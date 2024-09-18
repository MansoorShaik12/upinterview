import { useState, useRef, useEffect, useCallback } from "react";
import '../../../../index.css';
import '../styles/tabs.scss'
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaList } from "react-icons/fa6";
import { TbLayoutGridRemove } from "react-icons/tb";
import { IoMdSearch } from 'react-icons/io';
import Tooltip from '@mui/material/Tooltip';
import PositionProfileDetails from './PositionProfileDetails';
import { useNavigate } from 'react-router-dom';
import { IoMdMore } from "react-icons/io";
import axios from 'axios';
import { MdMoreHoriz } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import Sidebar from '../Position-Tab/Position-Form.jsx'
import Modal from 'react-modal';
import CandidateModalContent from './PositionProfileDetails';
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import Editposition from './Editpositionform.jsx'
import { CgInfo } from "react-icons/cg";



const OffcanvasMenu = ({ isOpen, onFilterChange }) => {
    const [isTechDropdownOpen, setTechDropdownOpen] = useState(false);
    const [isExperienceDropdownOpen, setIsExperienceDropdownOpen] = useState(false);
    const [isTechMainChecked, setTechMainChecked] = useState(false);
    const [isExperienceMainChecked, setIsExperienceMainChecked] = useState(false);
    const [selectedTechOptions, setSelectedTechOptions] = useState([]);
    const [selectedExperienceOptions, setSelectedExperienceOptions] = useState([]);
    const [minExperience, setMinExperience] = useState('');
    const [maxExperience, setMaxExperience] = useState('');

    const isAnyOptionSelected = selectedTechOptions.length > 0 || selectedExperienceOptions.length > 0;

    const handleUnselectAll = () => {
        setSelectedTechOptions([]);
        setSelectedExperienceOptions([]);
        setTechMainChecked(false);
        setIsExperienceMainChecked(false);
        setMinExperience('');
        setMaxExperience('');
        onFilterChange({ status: [], tech: [], experience: [] });
    };

    useEffect(() => {
        if (!isTechMainChecked) setSelectedTechOptions([]);
        if (!isExperienceMainChecked) setSelectedExperienceOptions([]);
    }, [isTechMainChecked, isExperienceMainChecked]);

    const handleTechMainToggle = () => {
        setTechMainChecked(!isTechMainChecked);
        const newSelectedTech = isTechMainChecked ? [] : [...techOptions];
        setSelectedTechOptions(newSelectedTech);
        onFilterChange({ tech: newSelectedTech, experience: selectedExperienceOptions });
    };

    const handleExperienceMainToggle = () => {
        setIsExperienceMainChecked(!isExperienceMainChecked);
        const newSelectedExperience = isExperienceMainChecked ? [] : [...experienceOptions];
        setSelectedExperienceOptions(newSelectedExperience);
        onFilterChange({ tech: selectedTechOptions, experience: newSelectedExperience });
    };

    const handleTechOptionToggle = (option) => {
        const selectedIndex = selectedTechOptions.indexOf(option);
        const updatedOptions = selectedIndex === -1
            ? [...selectedTechOptions, option]
            : selectedTechOptions.filter((_, index) => index !== selectedIndex);

        setSelectedTechOptions(updatedOptions);
        onFilterChange({ tech: updatedOptions, experience: selectedExperienceOptions });
    };

    const handleExperienceOptionToggle = (option) => {
        const selectedIndex = selectedExperienceOptions.indexOf(option);
        const updatedOptions = selectedIndex === -1
            ? [...selectedExperienceOptions, option]
            : selectedExperienceOptions.filter((_, index) => index !== selectedIndex);

        setSelectedExperienceOptions(updatedOptions);
        onFilterChange({ tech: selectedTechOptions, experience: updatedOptions });
    };
    const handleExperienceChange = (e, type) => {
        const value = Math.max(0, Math.min(15, e.target.value));
        if (type === 'min') {
            setMinExperience(value);
        } else {
            setMaxExperience(value);
        }
        onFilterChange({
            tech: selectedTechOptions,
            experience: { min: type === 'min' ? value : minExperience, max: type === 'max' ? value : maxExperience },
        });
    };

    useEffect(() => {
        onFilterChange({
            tech: selectedTechOptions,
            experience: { min: minExperience, max: maxExperience },
        });
    }, [selectedTechOptions, minExperience, maxExperience]);

    const experienceOptions = [
        '0-1 years',
        '1-2 years',
        '2-3 years',
        '3-4 years',
        '4-5 years',
        '5-6 years',
        '6-7 years',
        '7-8 years',
        '8-9 years',
        '9-10 years',
        '10+ years'
    ];

    const techOptions = [
        'HTML',
        'CSS',
        'JavaScript',
        'Python',
        'Java',
        'C++',
        'SQL',
        'MongoDB',
        'PostgreSQL',
        'AWS (Amazon Web Services)',
        'Azure',
        'Google Cloud',
        'Docker',
        'Kubernetes',
        'Jenkins',
        'Cybersecurity',
        'Network Administration',
        'Data Analysis',
        'Artificial Intelligence (AI)',
        'Machine Learning (ML)',
        'Natural Language Processing (NLP)',
        'Data Mining',
        'Data Visualization',
        'Tableau',
        'Power BI',
        'iOS Development',
        'Android Development',
        'React',
        'Angular',
        'Vue.js',
        'Django',
        'Spring',
        'Express.js',
        'UI/UX Design',
        'Software Testing',
        'Agile Methodologies',
        'Git',
        'Bash',
        'PowerShell',
        'Linux/Unix Administration',
        'Ruby on Rails',
        'PHP',
        'Swift',
        'TypeScript',
        'Node.js',
        'Flask',
        'Laravel',
        'ASP.NET',
        'React Native'
    ];

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
                        {(isAnyOptionSelected || minExperience || maxExperience) && (
                            <div>
                                <button onClick={handleUnselectAll} className="font-bold text-md">
                                    Unselect All
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Experience */}
                <div className="flex justify-between mt-2 ml-5">
                    <div className="cursor-pointer">
                        <label className="inline-flex items-center">
                            <span className="ml-3 font-bold">Experience</span>
                        </label>
                    </div>
                </div>

                <div className="bg-white py-2 mt-1">
                    <div className="flex items-center ml-10">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minExperience}
                            min="0"
                            max="15"
                            onChange={(e) => handleExperienceChange(e, 'min')}
                            className="border-b form-input w-20 mr-2"
                        />
                        <span className="mx-2">to</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxExperience}
                            min="1"
                            max="15"
                            onChange={(e) => handleExperienceChange(e, 'max')}
                            className="border-b form-input w-20"
                        />
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
                            <span className="ml-3 font-bold">Skills</span>
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
                                    checked={selectedTechOptions.includes(option)}
                                    onChange={() => handleTechOptionToggle(option)}
                                />
                                <span className="ml-2 w-56">{option}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



const Position = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

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
    }, []);

    useEffect(() => {
        if (sidebarOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [sidebarOpen, handleOutsideClick]);






    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const [selectedPosition, setSelectedPosition] = useState(null);

    const handlePositionClick = (position) => {
        setSelectedPosition(position);
    };
    const handleCloseProfile = () => {
        setSelectedPosition(null);
    };

    // function handlePositionClick(position) {
    //     navigate('/position-profiledetails', { state: { position, skills: position.Skill } });
    // }
    const [skillsData, setSkillsData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState("");
    const userId = localStorage.getItem("userId");
    useEffect(() => {

        const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}`);

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            const { type, data } = JSON.parse(event.data);
            if (type === 'position') {
                setSkillsData(data);
                setNotification("A new position has been successfully created!");

                setTimeout(() => {
                    setNotification("");
                }, 3000);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };


        const fetchSkillsData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/position?CreatedBy=${userId}`);
                console.log('Position data:', response.data);
                setSkillsData(response.data);
            } catch (error) {
                console.error('Error fetching position data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkillsData();

        return () => {
            ws.close();
        };

    }, []);

    // const FilteredData = () => {
    //     return skillsData.filter(user => {
    //         const fieldsToSearch = [
    // user.title,
    // user.companyname,
    //             user.jobdescription,
    //             user.additionalnotes,
    //             user.Skill
    //         ];

    //         return fieldsToSearch.some(field =>
    //             field !== undefined && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
    //         );
    //     });
    // };

    const [selectedFilters, setSelectedFilters] = useState({
        status: [],
        tech: [],
        experience: [],
    });

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
    };

    const FilteredData = () => {
        if (!Array.isArray(skillsData)) return [];
        return skillsData.filter((user) => {
            const fieldsToSearch = [
                user.title,
                user.companyname,
            ];

            const matchesTech = selectedFilters.tech.length === 0 || user.skills.some(skill => selectedFilters.tech.includes(skill.skill));

            // Parse experience values
            const minExp = parseInt(selectedFilters.experience.min, 10);
            const maxExp = parseInt(selectedFilters.experience.max, 10);
            const userMinExp = parseInt(user.minexperience, 10);
            const userMaxExp = parseInt(user.maxexperience, 10);

            // Experience matching logic
            const matchesExperience = (isNaN(minExp) && isNaN(maxExp)) ||
                (!isNaN(minExp) && !isNaN(maxExp) && userMinExp >= minExp && userMaxExp <= maxExp) ||
                (!isNaN(minExp) && isNaN(maxExp) && userMinExp >= minExp) ||
                (isNaN(minExp) && !isNaN(maxExp) && userMaxExp <= maxExp);

            const matchesSearchQuery = fieldsToSearch.some(
                (field) =>
                    field !== undefined &&
                    field.toString().toLowerCase().includes(searchQuery.toLowerCase())
            );

            return matchesSearchQuery && matchesTech && matchesExperience;
        });
    };

    useEffect(() => {
        setCurrentPage(0);
    }, [selectedFilters]);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(0);
    };







    const addLineBreaks = (text) => {
        const maxLength = 20;
        if (text.length > maxLength) {
            return text.match(new RegExp(`.{1,${maxLength}}`, 'g')).join('<br>');
        }
        return text;
    };
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 10;
    const [activeArrow, setActiveArrow] = useState(null);

    const totalPages = Math.ceil(FilteredData().length / rowsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
            setActiveArrow('next');
            console.log('Next Page:', currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setActiveArrow('prev');
            console.log('Previous Page:', currentPage - 1);
        }
    };

    const startIndex = currentPage * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, FilteredData().length);
    const currentFilteredRows = FilteredData().slice(startIndex, endIndex).reverse();

    console.log('Current Page:', currentPage);
    console.log('Filtered Data:', FilteredData());
    console.log('Current Filtered Rows:', currentFilteredRows);

    const [viewMode, setViewMode] = useState("list");

    const handleListViewClick = () => {
        setViewMode("list");
    };

    const handleKanbanViewClick = () => {
        setViewMode("kanban");
    };

    const [tableVisible] = useState(true);

    const [selectedCandidate, setSelectedCandidate] = useState(null);


    const closeModal = () => {
        setSelectedCandidate(null);
    };

    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const [actionViewMore, setActionViewMore] = useState({});

    const toggleAction = (id) => {
        setActionViewMore((prev) => (prev === id ? null : id));
    };

    const [selectedcandidate, setSelectedcandidate] = useState(null);

    const handleEditClick = (position) => {
        setSelectedcandidate(position);
        setActionViewMore(false);
    };

    const handleclose = () => {
        setSelectedcandidate(null);
        setActionViewMore(false);
    };





    return (
        <>
            <div className="fixed top-24 left-0 right-0">
                <div className="flex justify-between p-4">
                    <div>
                        <span className="text-lg font-semibold">Positions</span>
                    </div>

                    <div>
                        {notification && (
                            <div className="fixed top-24 mt-3 left-1/2 transform -translate-x-1/2 bg-green-500 px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
                                {notification}
                            </div>
                        )}
                    </div>

                    <div onClick={toggleSidebar} className="mr-6">
                        <span className="p-2 text-md font-semibold border shadow rounded-3xl">
                            Add Position
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
                                    placeholder="Search by Title, Company Name."
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
                                    onClick={skillsData.length === 0 ? null : toggleMenu}
                                    style={{
                                        opacity: skillsData.length === 0 ? 0.2 : 1,
                                        pointerEvents: skillsData.length === 0 ? "none" : "auto",
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
                                <div
                                    className="flex-grow"
                                    style={{ marginRight: isMenuOpen ? "290px" : "0" }}
                                >
                                    <div className="relative">
                                        <div className="overflow-y-auto" style={{ minHeight: '415px', maxHeight: '415px' }}>
                                            <table className="text-left w-full border-collapse border-gray-300">
                                                <thead className="bg-gray-300 sticky top-0 z-10 text-xs">
                                                    <tr>
                                                        <th scope="col" className="py-3 px-5">Title</th>
                                                        <th scope="col" className="py-3 px-5">Company Name</th>
                                                        <th scope="col" className="py-3 px-5">Job Description</th>
                                                        <th scope="col" className="py-3 px-5">Experience</th>
                                                        <th scope="col" className="py-3 px-5">Skills</th>
                                                        <th scope="col" className="py-3 px-5">Rounds</th>
                                                        <th scope="col" className="py-3 pl-7">Action</th>
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
                                                    ) : skillsData.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="8" className="py-10 text-center">
                                                                <div className="flex flex-col items-center justify-center p-5">
                                                                    <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                                                                    <p className="text-center text-lg font-normal">You don't have position yet. Create new position.</p>
                                                                    <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add position</p>
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
                                                        currentFilteredRows.map(position => (
                                                            <tr key={position._id} className="bg-white border-b cursor-pointer text-xs">
                                                                <td onClick={() => handlePositionClick(position)} className="py-4 px-5 text-blue-400" style={{ whiteSpace: 'normal' }}>{position.title}</td>
                                                                <td className="py-2 px-5" style={{ whiteSpace: 'normal' }}>{position.companyname}</td>
                                                                <td className="py-2 px-5" style={{ whiteSpace: 'normal', maxWidth: '200px' }} dangerouslySetInnerHTML={{ __html: addLineBreaks(position.jobdescription) }}></td>
                                                                <td className="py-2 px-5" style={{ whiteSpace: 'normal' }}>{position.minexperience}-
                                                                    {position.maxexperience} years</td>
                                                                <td className="py-2 px-5" style={{ whiteSpace: 'normal' }}>
                                                                    {position.skills.map((skillEntry, index) => (
                                                                        <div key={index}>
                                                                            {skillEntry.skill}{index < position.skills.length - 1 && ', '}
                                                                        </div>
                                                                    ))}
                                                                </td>
                                                                <td className="py-2 px-5" style={{ whiteSpace: 'normal' }}>
                                                                    <Tooltip
                                                                        title={
                                                                            position.rounds && position.rounds.length > 0
                                                                                ? position.rounds.map((round, index) => (
                                                                                    <div key={index}>{round.round}</div>
                                                                                ))
                                                                                : 'No rounds'
                                                                        }
                                                                        arrow
                                                                    >
                                                                        <span>{position.rounds && position.rounds.length > 0 ? `${position.rounds.length} rounds` : 'No rounds'}</span>
                                                                    </Tooltip>
                                                                </td>
                                                                <td className='py-2 pl-5' style={{ whiteSpace: 'normal' }}>
                                                                    <div>
                                                                        <button onClick={() => toggleAction(position._id)}>
                                                                            <MdMoreHoriz className="text-3xl" />
                                                                        </button>
                                                                        {actionViewMore === position._id && (
                                                                            <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2 popup">
                                                                                <div className="space-y-1">
                                                                                    <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handlePositionClick(position)}>View</p>
                                                                                    <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handleEditClick(position)}>Edit</p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <OffcanvasMenu
                                    isOpen={isMenuOpen}
                                    closeOffcanvas={toggleMenu}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                        ) : (
                            // kanban view
                            <div className="mx-3">
                                <div className="flex">
                                    <div
                                        className="flex-grow"
                                        style={{ marginRight: isMenuOpen ? "290px" : "0" }}
                                    >
                                        <div className="overflow-y-auto -mr-3" style={{ minHeight: '415px', maxHeight: '415px' }}>
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
                                            ) : skillsData.length === 0 ? (
                                                <div className="py-10 text-center">
                                                    <div className="flex flex-col items-center justify-center p-5">
                                                        <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                                                        <p className="text-center text-lg font-normal">You don't have position yet. Create new position.</p>
                                                        <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add Position</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-4 p-4">
                                                    {currentFilteredRows.length === 0 ? (
                                                        <div className="col-span-3 py-10 text-center">
                                                            <p className="text-lg font-normal">No data found.</p>
                                                        </div>
                                                    ) : (
                                                        currentFilteredRows.map((position) => (
                                                            <div
                                                                key={position._id}
                                                                className="bg-white border border-orange-500 cursor-pointer p-2 rounded"
                                                            >
                                                                <div className="flex justify-between">
                                                                    <div className="flex">
                                                                        <div className="w-32 ml-2">
                                                                            <p
                                                                                className="text-blue-500 text-lg w-80"
                                                                                onClick={() => handlePositionClick(position)}
                                                                            >
                                                                                {position.title}
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                <span className="text-slate-400">Company</span>
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                <span className="text-slate-400">
                                                                                    Experience
                                                                                </span>
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                <span className="text-slate-400">Skills</span>
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                <span className="text-slate-400">Rounds</span>
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                <span className="text-slate-400">
                                                                                    Job Description
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                        <div className="mt-7">
                                                                            
                                                                            <p className="text-gray-700">
                                                                                {position.companyname}
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                {position.minexperience}-
                                                                                {position.maxexperience} years
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                {position.skills.map((skillEntry, index) => (
                                                                                    <div key={index}>
                                                                                        {skillEntry.skill}{index < position.skills.length - 1 && ', '}
                                                                                    </div>
                                                                                ))}
                                                                            </p>
                                                                            <p className="text-gray-7000">
                                                                                <Tooltip
                                                                                    title={
                                                                                        position.rounds && position.rounds.length > 0
                                                                                            ? position.rounds.map((round, index) => (
                                                                                                <div key={index}>{round.round}</div>
                                                                                            ))
                                                                                            : 'No rounds'
                                                                                    }
                                                                                    arrow
                                                                                >
                                                                                    <span>{position.rounds && position.rounds.length > 0 ? `${position.rounds.length} rounds` : 'No rounds'}</span>
                                                                                </Tooltip>
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                {position.jobdescription}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="relative">
                                                                        <div>
                                                                            <button
                                                                                onClick={() => toggleAction(position._id)}
                                                                            >
                                                                                <IoMdMore className="text-3xl" />
                                                                            </button>
                                                                            {actionViewMore === position._id && (
                                                                                <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2 popup">
                                                                                    <div className="space-y-1">
                                                                                        <p
                                                                                            className="hover:bg-gray-200 p-1 rounded pl-3"
                                                                                            onClick={() =>
                                                                                                handlePositionClick(position)
                                                                                            }
                                                                                        >
                                                                                            View
                                                                                        </p>
                                                                                        <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handleEditClick(position)}>
                                                                                            Edit
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <OffcanvasMenu
                                        isOpen={isMenuOpen}
                                        closeOffcanvas={toggleMenu}
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>



            {/* {selectedPosition && (
                <PositionProfileDetails position={selectedPosition} />
            )} */}
            {selectedPosition && (
                <PositionProfileDetails position={selectedPosition} onCloseprofile={handleCloseProfile} />
            )}
            {selectedcandidate && (
                <Editposition onClose={handleclose} candidate1={selectedcandidate} rounds={selectedcandidate.rounds} />
            )}
            {sidebarOpen && (
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
                </>
            )}
        </>
    );
};

export default Position;











