import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import "../../../../index.css";
import "../styles/tabs.scss";
import { IoIosArrowBack, IoIosArrowForward, IoMdSearch } from "react-icons/io";
import { FaList } from "react-icons/fa6";
import { TbLayoutGridRemove } from "react-icons/tb";
import Tooltip from '@mui/material/Tooltip';
import Sidebar from "../QuestionBank-Tab/QuestionBank-Form.jsx";
import { FaFilter } from "react-icons/fa";
import { CgInfo } from "react-icons/cg";
import QuestionBankProfileDetails from "./QuestionBankProfileDetails.jsx";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

const OffcanvasMenu = ({ isOpen, onFilterChange }) => {
    const [isTechDropdownOpen, setTechDropdownOpen] = useState(false);
    const [isTechMainChecked, setTechMainChecked] = useState(false);
    const [selectedTechOptions, setSelectedTechOptions] = useState([]);
    const [techOptions, setTechOptions] = useState([]);
    const isAnyOptionSelected =  selectedTechOptions.length > 0;

    const handleUnselectAll = () => {
        setSelectedTechOptions([]);
        setTechMainChecked(false);
        onFilterChange({ tech: [] });
    };

    useEffect(() => {
        if (!isTechMainChecked) setSelectedTechOptions([]);
    }, [isTechMainChecked]);

    const handleTechMainToggle = () => {
        const newSelectedTech = !isTechMainChecked ? techOptions.map(option => option.SkillName) : [];
        setTechMainChecked(!isTechMainChecked);
        setSelectedTechOptions(newSelectedTech);
        onFilterChange({ tech: newSelectedTech });
    };

    const handleTechOptionToggle = (option) => {
        const selectedIndex = selectedTechOptions.indexOf(option);
        const updatedOptions = selectedIndex === -1
            ? [...selectedTechOptions, option]
            : selectedTechOptions.filter((_, index) => index !== selectedIndex);
        setSelectedTechOptions(updatedOptions);
        onFilterChange({ tech: updatedOptions });
    };

    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/skills`);
                setTechOptions(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching SkillsData:', error);
            } 
        };
        fetchSkillsData();
    }, []);
    

    useEffect(() => {
        onFilterChange({
            tech: selectedTechOptions,
        });
    }, [ selectedTechOptions, onFilterChange]);

    return (
        <div
            className="absolute w-72 text-sm bg-white border right-0 z-30 overflow-y-scroll"
            style={{
                visibility: isOpen ? "visible" : "hidden",
                transform: isOpen ? "" : "translateX(50%)",
                height: isOpen ? "calc(100vh - 30%)" : "auto",
            }}
        >
            <div className="p-2 mb-32">
                <div className="flex justify-between p-2 mb-4 shadow items-center">
                    <div>
                        <h2 className="text-lg font-bold ">Filter</h2>
                    </div>
                    {/* Unselect All Option */}
                    <div>
                        {(isAnyOptionSelected) && (
                            <div>
                                <button onClick={handleUnselectAll} className="font-bold text-md">
                                    Unselect All
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skill/Technology */}
                <div className="flex mt-2 justify-between">
                    <div className="cursor-pointer">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5"
                                checked={isTechMainChecked}
                                onChange={handleTechMainToggle}
                            />
                            <span className="ml-3 font-bold">Skill/Technology</span>
                        </label>
                    </div>
                    <div
                        className="cursor-pointer mr-3 text-2xl"
                        onClick={() => setTechDropdownOpen(!isTechDropdownOpen)}
                    >
                        {isTechDropdownOpen ? (
                            <MdKeyboardArrowUp />
                        ) : (
                            <MdKeyboardArrowDown />
                        )}
                    </div>
                </div>
                {isTechDropdownOpen && (
            <div className="bg-white py-2 mt-1">
                {techOptions.map((option, index) => (
                    <label key={index} className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5"
                            checked={selectedTechOptions.includes(option.SkillName)}
                            onChange={() => handleTechOptionToggle(option.SkillName)}
                        />
                        <span className="ml-2 w-56">{option.SkillName}</span>
                    </label>
                ))}
            </div>
        )}
            </div>
        </div>
    );
};

const QuestionBank = () => {

    const [suggestedQuestionsCount, setSuggestedQuestionsCount] = useState({});
    const [favoriteQuestionsCount, setFavoriteQuestionsCount] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentRows, setCurrentRows] = useState([]);
    const [questionProfile, setQuestionProfile] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const [notification, setNotification] = useState("");

    useEffect(() => {
        const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}`);

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            const { type, data } = JSON.parse(event.data);
            if (type === 'question') {
                // setQuestionProfile(data);
                setNotification("A new question has been successfully created!");

                setTimeout(() => {
                    setNotification("");
                }, 3000);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };


        const fetchSuggestedQuestionsCount = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/suggestedquestions-count`);
                setSuggestedQuestionsCount(response.data);
            } catch (error) {
                console.error('Error fetching suggested questions count:', error);
            }
        };

        const fetchFavoriteQuestionsCount = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/favoritequestions-count/${userId}`);
                setFavoriteQuestionsCount(response.data);
            } catch (error) {
                console.error('Error fetching favorite questions count:', error);
            }
        };

        fetchSuggestedQuestionsCount();
        fetchFavoriteQuestionsCount();

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        const fetchSkillsData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/skills`);
                setCurrentRows(response.data);
            } catch (error) {
                console.error('Error fetching SkillsData:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSkillsData();
    }, []);
    const getSuggestedQuestionCountForSkill = (skillName) => {
        return suggestedQuestionsCount[skillName] || 0;
    };

    const getFavoriteQuestionCountForSkill = (skillName) => {
        return favoriteQuestionsCount[skillName] || 0;
    };

    const handleCandidateClick = (row) => {
        setQuestionProfile(row);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleOutsideClick = useCallback((event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            closeSidebar();
        }
    }, [closeSidebar]);

    useEffect(() => {
        if (sidebarOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };

    }, [sidebarOpen, handleOutsideClick]);

    const [selectedFilters, setSelectedFilters] = useState({ tech: [],});

    const handleFilterChange = useCallback((filters) => {
        setSelectedFilters(filters);
    }, []);

    const FilteredData = () => {
        if (!Array.isArray(currentRows)) return [];
        return currentRows.filter((user) => {
            const fieldsToSearch = [
                user.SkillName
            ].filter(field => field !== null && field !== undefined);

            const matchesTech = selectedFilters.tech.length === 0 || selectedFilters.tech.includes(user.SkillName);

            const matchesSearchQuery = fieldsToSearch.some(
                (field) =>
                    field.toString().toLowerCase().includes(searchQuery.toLowerCase())
            );
            return matchesSearchQuery && matchesTech;
        });
    };

    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 10;

    const totalPages = Math.ceil(FilteredData().length / rowsPerPage);

    const [activeArrow, setActiveArrow] = useState(null);

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
            setActiveArrow('next');
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setActiveArrow('prev');
        }
    };

    const startIndex = currentPage * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, currentRows.length);

    const currentFilteredRows = FilteredData().slice(startIndex, endIndex).reverse();

    const [tableVisible] = useState(true);

    const [viewMode, setViewMode] = useState("list");

    const handleListViewClick = () => {
        setViewMode("list");
    };

    const handleKanbanViewClick = () => {
        setViewMode("kanban");
    };

    const handleProfileClose = () => {
        setQuestionProfile(null);
    };

    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        setCurrentPage(0);
    }, [selectedFilters]);

    return (
        <>
            <div className="fixed top-24 left-0 right-0">
                <div className="flex justify-between p-4">
                    <div>
                        <span className="text-lg font-semibold">Question Bank</span>
                    </div>

                    <div>
                        {notification && (
                            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
                                {notification}
                            </div>
                        )}
                    </div>

                    <div onClick={toggleSidebar} className="mr-6">
                        <span className="p-2 text-md font-semibold border shadow rounded-3xl">
                            Add Question
                        </span>
                    </div>

                </div>
            </div>

            <div className="fixed top-36 left-0 right-0">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                        <Tooltip title="List" enterDelay={300} leaveDelay={100} arrow>
                            <span onClick={handleListViewClick}>
                                <FaList
                                    className={`text-2xl mr-4 ${viewMode === "list" ? "text-blue-500" : ""}`}
                                />
                            </span>
                        </Tooltip>
                        <Tooltip title="Kanban" enterDelay={300} leaveDelay={100} arrow>
                            <span onClick={handleKanbanViewClick}>
                                <TbLayoutGridRemove
                                    className={`text-2xl ${viewMode === "kanban" ? "text-blue-500" : ""}`}
                                />
                            </span>
                        </Tooltip>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="searchintabs mr-5 relative">
                                <div className="absolute inset-y-0 left-0 flex items-center">
                                    <button type="submit" className="p-2">
                                        <IoMdSearch />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by Skill/Technology."
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    className="pl-10 pr-12"
                                />
                            </div>
                        </div>


                        <div>
                            <span className="p-2 text-xl mr-2">
                                {currentPage + 1}/{totalPages}
                            </span>
                        </div>
                        <div className="flex">
                            <Tooltip title="Previous" enterDelay={300} leaveDelay={100} arrow>
                                <span
                                    className={`border-2 p-2 mr-2 text-2xl ${currentPage === 0 ? " cursor-not-allowed" : ""} ${activeArrow === "prev" ? "text-blue-500" : ""}`}
                                    onClick={prevPage}
                                >
                                    <IoIosArrowBack />
                                </span>
                            </Tooltip>

                            <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
                                <span
                                    className={`border-2 p-2 text-2xl ${currentPage === totalPages - 1 ? " cursor-not-allowed" : ""} ${activeArrow === "next" ? "text-blue-500" : ""}`}
                                    onClick={nextPage}
                                >
                                    <IoIosArrowForward />
                                </span>
                            </Tooltip>
                        </div>



                        <div className="ml-4 text-2xl border-2 rounded-md p-2">
                            <Tooltip title="Filter" enterDelay={300} leaveDelay={100} arrow>
                                <span
                                    onClick={currentRows.length === 0 ? null : toggleMenu}
                                    style={{
                                        opacity: currentRows.length === 0 ? 0.2 : 1,
                                        pointerEvents: currentRows.length === 0 ? "none" : "auto",
                                    }}
                                >
                                    <FaFilter className={`${isMenuOpen ? "text-blue-500" : ""}`} />
                                </span>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed left-0 right-0 mx-auto top-56 z-10">
                {tableVisible && (
                    <div>
                        {viewMode === "list" ? (
                            <div className="flex">
                                <div className="flex-grow" style={{ marginRight: isMenuOpen ? "290px" : "0" }}>
                                    <div className="relative">
                                        <div className="overflow-y-auto min-h-80 max-h-96">
                                            <table className="text-left w-full border-collapse border-gray-300 mb-14">
                                                <thead className="bg-gray-300 sticky top-0 z-10 text-xs">
                                                    <tr>
                                                        <th scope="col" className="py-3 px-6">
                                                            Skill/Technology
                                                        </th>
                                                        <th scope="col" className="py-3 px-6">
                                                            Number of Questions
                                                        </th>
                                                        <th scope="col" className="py-3 px-6">
                                                            Number of Favorite Questions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? (
                                                        <tr>
                                                            <td colSpan="7" className="py-28 text-center">
                                                                <div className="wrapper12">
                                                                    <div className="circle12"></div>
                                                                    <div className="circle12"></div>
                                                                    <div className="circle12"></div>
                                                                    <div className="shadow12"></div>
                                                                    <div className="shadow12"></div>
                                                                    <div className="shadow12"></div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : currentRows.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="7" className="py-10 text-center">
                                                                <div className="flex flex-col items-center justify-center p-5">
                                                                    <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                                                                    <p className="text-center text-lg font-normal">You don't have question yet. Create new question.</p>
                                                                    <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add question</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : currentFilteredRows.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="7" className="py-10 text-center">
                                                                <p className="text-lg font-normal">No data found.</p>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        currentFilteredRows.map((row, index) => (
                                                            <tr key={index} className="bg-white border-b text-xs cursor-pointer">
                                                                <td className="py-2 px-6 text-blue-300" onClick={() => handleCandidateClick(row)}>{row.SkillName}</td>
                                                                <td className="py-2 px-6">
                                                                    <p>{getSuggestedQuestionCountForSkill(row.SkillName)}</p>
                                                                </td>
                                                                <td className="py-2 px-6">
                                                                    <p>{getFavoriteQuestionCountForSkill(row.SkillName)}</p>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <OffcanvasMenu isOpen={isMenuOpen} closeOffcanvas={toggleMenu} onFilterChange={handleFilterChange} />
                            </div>
                        ) : (
                            // kanban view
                            <div className="mx-3">
                                <div className="flex">
                                    <div
                                        className="flex-grow"
                                        style={{ marginRight: isMenuOpen ? "290px" : "0" }}
                                    >
                                        <div className="overflow-y-auto min-h-80 max-h-96">
                                            {loading ? (
                                                <div className="py-10 text-center">
                                                    <div className="wrapper12">
                                                        <div className="circle12"></div>
                                                        <div className="circle12"></div>
                                                        <div className="circle12"></div>
                                                        <div className="shadow12"></div>
                                                        <div className="shadow12"></div>
                                                        <div className="shadow12"></div>
                                                    </div>
                                                </div>
                                            ) : currentRows.length === 0 ? (
                                                <div className="py-10 text-center">
                                                    <div className="flex flex-col items-center justify-center p-5">
                                                        <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                                                        <p className="text-center text-lg font-normal">You don't have question yet. Create new question.</p>
                                                        <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add question</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-4 p-4">
                                                    {currentFilteredRows.length === 0 ? (
                                                        <div className="col-span-3 py-10 text-center">
                                                            <p className="text-lg font-normal">No data found.</p>
                                                        </div>
                                                    ) : (
                                                        currentFilteredRows.map((row, index) => (
                                                            <>
                                                                <div
                                                                    key={index}
                                                                    className="bg-white border border-orange-500 cursor-pointer p-2 rounded"
                                                                >
                                                                    <p className='text-lg' onClick={() => handleCandidateClick(row)}>
                                                                        {row.SkillName}
                                                                    </p>

                                                                    <div className="grid grid-cols-2 text-sm">
                                                                        <div className="p-1" style={{ width: "200px" }}>
                                                                            <p className="text-gray-700">
                                                                                <span className="text-slate-400">
                                                                                    Number of Questions
                                                                                </span>
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                <span className="text-slate-400">
                                                                                    Number of Favorite Questions
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                        <div className="p-1 ml-24">
                                                                            <p className="text-gray-700">{getSuggestedQuestionCountForSkill(row.SkillName)}</p>
                                                                            <p className="text-gray-700">{getFavoriteQuestionCountForSkill(row.SkillName)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <OffcanvasMenu isOpen={isMenuOpen} closeOffcanvas={toggleMenu} onFilterChange={handleFilterChange} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {questionProfile && (
                <QuestionBankProfileDetails
                    questionProfile={questionProfile}
                    onCloseprofile={handleProfileClose}
                />
            )}



            {sidebarOpen && (
                // If i am this 2 divs add in direct forms then it will conflict when lookups open that why iam adding here(ashraf)
                <>
                    <div
                        className={"fixed inset-0 bg-black bg-opacity-15 z-50"}
                    >
                        <div className="fixed inset-y-0 right-0 z-50 w-1/2 bg-white shadow-lg transition-transform duration-5000 transform">
                            <Sidebar
                                onClose={closeSidebar}
                                onOutsideClick={handleOutsideClick}
                                ref={sidebarRef}
                            />
                        </div>
                    </div>
                </>)}
        </>

    );
};

export default QuestionBank;
