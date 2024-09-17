import { useState, useRef, useEffect, useCallback } from "react";
import "../../../../index.css";
import "../styles/tabs.scss";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaList } from "react-icons/fa6";
import { TbLayoutGridRemove } from "react-icons/tb";
import { IoMdSearch } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import MockProfileDetails from "./MockProfileDetails";
import { FaFilter } from "react-icons/fa";
import Sidebar from "../MockInterview/MockSchedulelater";
import { MdMoreHoriz } from "react-icons/md";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { FcOk } from "react-icons/fc";
import { WiTime4 } from "react-icons/wi";
import { MdCancel } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";
import { FaTimes } from 'react-icons/fa';
import EditMoclnterview from './Edit-Moclnterview.jsx'
import axios from "axios";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CgInfo } from "react-icons/cg";

const OffcanvasMenu = ({ isOpen, onFilterChange }) => {
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isTechDropdownOpen, setTechDropdownOpen] = useState(false);
  const [isStatusMainChecked, setStatusMainChecked] = useState(false);
  const [isTechMainChecked, setTechMainChecked] = useState(false);
  const [isExperienceMainChecked, setIsExperienceMainChecked] = useState(false);
  const [selectedStatusOptions, setSelectedStatusOptions] = useState([]);
  const [selectedTechOptions, setSelectedTechOptions] = useState([]);
  const [selectedExperienceOptions, setSelectedExperienceOptions] = useState(
    []
  );

  const isAnyOptionSelected =
    selectedStatusOptions.length > 0 ||
    selectedTechOptions.length > 0 ||
    selectedExperienceOptions.length > 0;

  const handleUnselectAll = () => {
    setSelectedStatusOptions([]);
    setSelectedTechOptions([]);
    setSelectedExperienceOptions([]);
    setStatusMainChecked(false);
    setTechMainChecked(false);
    setIsExperienceMainChecked(false);
    setMinExperience("");
    setMaxExperience("");
    onFilterChange({ status: [], tech: [], experience: [] });
  };
  useEffect(() => {
    if (!isStatusMainChecked) setSelectedStatusOptions([]);
    if (!isTechMainChecked) setSelectedTechOptions([]);
    if (!isExperienceMainChecked) setSelectedExperienceOptions([]);
  }, [isStatusMainChecked, isTechMainChecked, isExperienceMainChecked]);

  const handleStatusMainToggle = () => {
    setStatusMainChecked(!isStatusMainChecked);
    const newSelectedStatus = isStatusMainChecked ? [] : [...statusOptions];
    setSelectedStatusOptions(newSelectedStatus);
    onFilterChange({
      status: newSelectedStatus,
      tech: selectedTechOptions,
      experience: selectedExperienceOptions,
    });
  };

  const handleTechMainToggle = () => {
    setTechMainChecked(!isTechMainChecked);
    const newSelectedTech = isTechMainChecked ? [] : [...techOptions];
    setSelectedTechOptions(newSelectedTech);
    onFilterChange({
      status: selectedStatusOptions,
      tech: newSelectedTech,
      experience: selectedExperienceOptions,
    });
  };

  const handleExperienceMainToggle = () => {
    setIsExperienceMainChecked(!isExperienceMainChecked);
    const newSelectedExperience = isExperienceMainChecked
      ? []
      : [...experienceOptions];
    setSelectedExperienceOptions(newSelectedExperience);
    onFilterChange({
      status: selectedStatusOptions,
      tech: selectedTechOptions,
      experience: newSelectedExperience,
    });
  };

  const handleStatusOptionToggle = (option) => {
    const selectedIndex = selectedStatusOptions.indexOf(option);
    const updatedOptions =
      selectedIndex === -1
        ? [...selectedStatusOptions, option]
        : selectedStatusOptions.filter((_, index) => index !== selectedIndex);

    setSelectedStatusOptions(updatedOptions);
    onFilterChange({
      status: updatedOptions,
      tech: selectedTechOptions,
      experience: selectedExperienceOptions,
    });
  };

  const handleTechOptionToggle = (option) => {
    const selectedIndex = selectedTechOptions.indexOf(option);
    const updatedOptions =
      selectedIndex === -1
        ? [...selectedTechOptions, option]
        : selectedTechOptions.filter((_, index) => index !== selectedIndex);

    setSelectedTechOptions(updatedOptions);
    onFilterChange({
      status: selectedStatusOptions,
      tech: updatedOptions,
      experience: selectedExperienceOptions,
    });
  };

  const handleExperienceOptionToggle = (option) => {
    const selectedIndex = selectedExperienceOptions.indexOf(option);
    const updatedOptions =
      selectedIndex === -1
        ? [...selectedExperienceOptions, option]
        : selectedExperienceOptions.filter(
          (_, index) => index !== selectedIndex
        );

    setSelectedExperienceOptions(updatedOptions);
    onFilterChange({
      status: selectedStatusOptions,
      tech: selectedTechOptions,
      experience: updatedOptions,
    });
  };

  const statusOptions = [
    "Bachelor of Arts (BA)",
    "Bachelor of Science (BSc)",
    "Bachelor of Commerce (BCom)",
    "Bachelor of Engineering (BE/BTech)",
    "Bachelor of Technology (B.Tech)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Computer Applications (BCA)",
    "Bachelor of Architecture (BArch)",
    "Master of Arts (MA)",
    "Master of Science (MSc)",
    "Master of Commerce (MCom)",
    "Master of Engineering (ME/MTech)",
    "Master of Technology (M.Tech)",
    "Master of Business Administration (MBA)",
    "Master of Computer Applications (MCA)",
    "Diploma in Engineering",
    "Diploma in Computer Applications (DCA)",
    "Diploma in Business Administration",
  ];

  const experienceOptions = [
    "0-1 years",
    "1-2 years",
    "2-3 years",
    "3-4 years",
    "4-5 years",
    "5-6 years",
    "6-7 years",
    "7-8 years",
    "8-9 years",
    "9-10 years",
    "10+ years",
  ];

  const techOptions = [
    "Python",
    "Java",
    "SQL",
    "JavaScript",
    "Artificial Intelligence (AI)",
    "Machine Learning (ML)",
    "Internet of Things (IoT)",
    "Blockchain",
    "Augmented Reality (AR)",
    "Virtual Reality (VR)",
    "Cybersecurity",
    "Cloud Computing",
    "Big Data Analytics",
    "Quantum Computing",
    "Natural Language Processing (NLP)",
    "Data Science",
    "DevOps (Development and Operations)",
    "Software-defined Networking (SDN)",
    "Predictive Analytics",
    "Robotic Process Automation (RPA)",
    "Edge Computing",
    "5G Technology",
    "Autonomous Vehicles",
    "Biometric Authentication Technology",
  ];

  const [isExperienceDropdownOpen, setExperienceDropdownOpen] = useState(false);

  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");

  const handleExperienceChange = (e, type) => {
    const value = Math.max(0, Math.min(15, e.target.value));
    if (type === "min") {
      setMinExperience(value);
    } else {
      setMaxExperience(value);
    }
    onFilterChange({
      status: selectedStatusOptions,
      tech: selectedTechOptions,
      experience: {
        min: type === "min" ? value : minExperience,
        max: type === "max" ? value : maxExperience,
      },
    });
  };
  useEffect(() => {
    onFilterChange({
      status: selectedStatusOptions,
      tech: selectedTechOptions,
      experience: { min: minExperience, max: maxExperience },
    });
  }, [
    selectedStatusOptions,
    selectedTechOptions,
    minExperience,
    maxExperience,
    onFilterChange,
  ]);

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
                <button
                  onClick={handleUnselectAll}
                  className="font-bold text-md"
                >
                  Unselect All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Higher Qualification */}
        <div className="flex justify-between">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5"
                checked={isStatusMainChecked}
                onChange={handleStatusMainToggle}
              />
              <span className="ml-3 font-bold">Higher Qualification</span>
            </label>
          </div>
          <div
            className="cursor-pointer mr-3 text-2xl"
            onClick={() => setStatusDropdownOpen(!isStatusDropdownOpen)}
          >
            {isStatusDropdownOpen ? (
              <MdKeyboardArrowUp />
            ) : (
              <MdKeyboardArrowDown />
            )}
          </div>
        </div>
        {isStatusDropdownOpen && (
          <div className="bg-white py-2 mt-1">
            {statusOptions.map((option, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  checked={selectedStatusOptions.includes(option)}
                  onChange={() => handleStatusOptionToggle(option)}
                />
                <span className="ml-2 w-56">{option}</span>
              </label>
            ))}
          </div>
        )}

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
              onChange={(e) => handleExperienceChange(e, "min")}
              className="border-b form-input w-20 mr-2"
            />
            <span className="mx-2">to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxExperience}
              min="1"
              max="15"
              onChange={(e) => handleExperienceChange(e, "max")}
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

const MockInterview = () => {
  useEffect(() => {
    document.title = "mockinterview Tab";
  }, []);
  const [notification, setNotification] = useState("");
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
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sidebarOpen, handleOutsideClick]);

  const [interviewDropdown, setinterviewDropdown] = useState(false);

  const interviewRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        interviewRef.current &&
        !interviewRef.current.contains(event.target)
      ) {
        setinterviewDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const navigate = useNavigate();
  const [selectedMockInterview] = useState(null);

  const handleMockInterviewClick = (mockinterview) => {
    navigate("/mock-profiledetails", { state: { mockinterview } });
  };

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);

  const [mockinterviewData, setmockinterviewData] = useState([]);
  console.log("mockinterviewData", mockinterviewData)

  useEffect(() => {

    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "interview") {
        setmockinterviewData(data);
        setNotification("A new MockInterview has been successfully created!");

        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    const fetchmockinterviewData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/mockinterview");
        setmockinterviewData(response.data);
      } catch (error) {
        console.error("Error fetching mockinterview data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchmockinterviewData();

    return () => {
      ws.close();
    };

  }, []);


  const FilteredData = () => {
    return mockinterviewData.filter((user) => {
      const fieldsToSearch = [
        user.Title,
        user.Skills,
        user.DateTime,
        user.Duration,
        user.TeamMember,
      ];

      return fieldsToSearch.some(
        (field) =>
          field !== undefined &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    console.log("Search query:", event.target.value);
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
  const endIndex = Math.min(startIndex + rowsPerPage, mockinterviewData.length);

  const currentFilteredRows = FilteredData().slice(startIndex, endIndex).reverse();


  const [tableVisible] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const handleListViewClick = () => {
    setViewMode("list");
  };

  const handleKanbanViewClick = () => {
    setViewMode("kanban");
  };


  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const [actionViewMore, setActionViewMore] = useState({});

  const toggleAction = (id) => {
    setActionViewMore((prev) => (prev === id ? null : id));
  };
  const [showPopup, setShowPopup] = useState(false);
  const [currentInterviewId, setCurrentInterviewId] = useState(null);

  const handleUpdate = (interviewId) => {
    setCurrentInterviewId(interviewId);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setCurrentInterviewId(null);
  };

  const handlePopupConfirm = async (e, _id) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/mockinterview/${currentInterviewId}`, {
        _id: currentInterviewId,
        Status: "ScheduleCancel",
      });

      const notificationResponse = await axios.post('http://localhost:5000/notification', {
        Body: 'Interview Cancelled successfully',
        Status: "ScheduleCancel",
      });

      console.log('Notification posted:', notificationResponse.data);
      console.log('Updated interview:', response.data);
      setShowPopup(false);
    } catch (error) {
      console.error('Error updating interview status or posting notification:', error);
    }
  };

  const [selectedcandidate, setSelectedcandidate] = useState(null);
  const handleEditClick = (mockinterview) => {
    setSelectedcandidate(mockinterview);
  };

  const handleclose = () => {
    setSelectedcandidate(null);
    setActionViewMore(false);
  };

  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    tech: [],
    experience: [],
  });

  const handleFilterChange = useCallback((filters) => {
    setSelectedFilters(filters);
  }, []);

  const buttonRef = useRef(null);

  const handleClick = async () => {
    try {
      const response = await axios.put('http://localhost:5000/interview/reschedule', {
        id: selectedcandidate._id,
      });
      console.log('Updated interview:', response.data);
      setActionViewMore(false);
    } catch (error) {
      console.error('Error updating interview status from me :', error);
    }
  };

  return (
    <>
      <div className="fixed top-24 left-0 right-0 z-40">
        <div className="flex justify-between mt-5">
          <div>
            <span className="p-3 w-fit text-lg font-semibold">Mock Interviews</span>
          </div>
          <div>
            {notification && (
              <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
                {notification}
              </div>
            )}
          </div>
          <div
            className="relative mr-6 z-50"
            ref={interviewRef}
            onClick={() => setinterviewDropdown(!interviewDropdown)}
          >
            <span
              className="p-2 w-fit text-md font-semibold border shadow rounded-3xl"
            >
              Create a New Schedule
            </span>
            {interviewDropdown && (
              <div className="absolute mt-5 z-10 w-48 rounded-md shadow-lg bg-white ring-1 p-2 ring-black ring-opacity-5">
                <div className="space-y-1">
                  <p
                    className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md"
                    activeClassName="bg-gray-200 text-gray-800"
                    onClick={() => {
                      setinterviewDropdown(false);
                      toggleSidebar();
                    }}
                  >
                    Schedule for Later
                  </p>
                  <p
                    className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md"
                    activeClassName="bg-gray-200 text-gray-800"
                    onClick={() => {
                      setinterviewDropdown(false);
                      toggleSidebar();
                    }}
                  >
                    Instant Interview
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <Sidebar
            isOpen={sidebarOpen}
            onClose={closeSidebar}
            onOutsideClick={handleOutsideClick}
            ref={sidebarRef}
          />
        </div>
      </div>
      {/* 2 */}
      <div className="fixed top-36 left-0 right-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Tooltip title="List" enterDelay={300} leaveDelay={100} arrow>
              <span onClick={handleListViewClick}>
                <FaList
                  className={`text-2xl mr-4 ${viewMode === "list" ? "text-blue-500" : ""
                    }`}
                />
              </span>
            </Tooltip>
            <Tooltip title="Kanban" enterDelay={300} leaveDelay={100} arrow>
              <span onClick={handleKanbanViewClick}>
                <TbLayoutGridRemove
                  className={`text-2xl ${viewMode === "kanban" ? "text-blue-500" : ""
                    }`}
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
                  placeholder="Search by Candidate, Position."
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
                  className={`border-2 p-2 mr-2 text-2xl ${currentPage === 0 ? " cursor-not-allowed" : ""
                    } ${activeArrow === "prev" ? "text-blue-500" : ""}`}
                  onClick={prevPage}
                  disabled={currentPage === 0}
                >
                  <IoIosArrowBack />
                </span>
              </Tooltip>

              <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
                <span
                  className={`border-2 p-2 text-2xl ${currentPage === totalPages - 1 ? " cursor-not-allowed" : ""
                    } ${activeArrow === "next" ? "text-blue-500" : ""}`}
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  <IoIosArrowForward />
                </span>
              </Tooltip>
            </div>
            <div className="ml-4 text-2xl border-2 rounded-md p-2">
              <Tooltip title="Filter" enterDelay={300} leaveDelay={100} arrow>
                <span
                  onClick={mockinterviewData.length === 0 ? null : toggleMenu}
                  style={{
                    opacity: mockinterviewData.length === 0 ? 0.2 : 1,
                    pointerEvents: mockinterviewData.length === 0 ? "none" : "auto",
                  }}
                >
                  <FaFilter
                    className={`${isMenuOpen ? "text-blue-500" : ""}`}
                  />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* 3 */}
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
                    <div className="overflow-y-auto min-h-80 max-h-96">
                      <table className="text-left w-full border-collapse border-gray-300 mb-14">
                        <thead className="bg-gray-300 sticky top-0 z-10 text-xs">
                          <tr>
                            <th scope="col" className="py-3 px-6 pl-11">
                              Interview Title
                            </th>
                            <th scope="col" className="py-3 px-6">
                              SkillTechnology
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Date & Time
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Duration (hh:mm)
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Interviewer
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Created On
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan="5" className="py-28 text-center">
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
                          ) : mockinterviewData.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="py-10 text-center">
                                <div className="flex flex-col items-center justify-center p-5">
                                  <p className="text-9xl rotate-180 text-blue-500">
                                    <CgInfo />
                                  </p>
                                  <p className="text-center text-lg font-normal">
                                    You don't have mockinterview yet. Create new mockinterview.
                                  </p>
                                  <p
                                    onClick={toggleSidebar}
                                    className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md"
                                  >
                                    Add Schedule
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : mockinterviewData.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="py-10 text-center">
                                <p className="text-lg font-normal">
                                  No data found.
                                </p>
                              </td>
                            </tr>
                          ) : (
                            currentFilteredRows.map((mockinterview) => {
                              const [date, timeRange] = mockinterview.DateTime.split(' ');
                              const startTime = timeRange.split(' - ')[0];
                              const formattedDateTime = `${date} ${startTime}`;
                              return (
                                <tr
                                  key={mockinterview._id}
                                  className="bg-white border-b cursor-pointer text-xs"
                                >
                                  <td className=" text-blue-400">
                                    <div className="flex items-center">
                                      {mockinterview.Status === 'Scheduled' && (
                                        <>
                                          <span className="w-2 bg-yellow-300 h-12"></span>

                                          <Tooltip title="Scheduled" enterDelay={300} leaveDelay={100} arrow>
                                            <span>
                                              <WiTime4 className="text-xl ml-1 mr-1 text-yellow-300" />
                                            </span>
                                          </Tooltip>
                                        </>
                                      )}
                                      {mockinterview.Status === 'ScheduleCancel' && (
                                        <>
                                          <span className="w-2 bg-red-500 h-12"></span>

                                          <Tooltip title="Cancel" enterDelay={300} leaveDelay={100} arrow>
                                            <span>
                                              <MdCancel className="text-xl ml-1 mr-1 text-red-500" />
                                            </span>
                                          </Tooltip>
                                        </>
                                      )}
                                      {mockinterview.Status === 'ReSchedule' && (
                                        <>
                                          <span className="w-2 bg-violet-500 h-12"></span>
                                          <Tooltip title="Rescheduled" enterDelay={300} leaveDelay={100} arrow>
                                            <span>
                                              <GrPowerReset className="text-xl ml-1 mr-1 text-violet-500" />
                                            </span>
                                          </Tooltip>

                                        </>
                                      )}
                                      <div className="py-2 px-2 flex items-center gap-3 text-blue-400">

                                        <div onClick={() =>
                                          handleMockInterviewClick(mockinterview)
                                        }>
                                          {mockinterview.Title}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 px-6">{mockinterview.Skills}</td>
                                  <td className="py-2 px-6">{formattedDateTime}</td>
                                  <td className="py-2 px-6">{mockinterview.Duration}</td>

                                  <td className="py-2 px-6"></td>
                                  <td className="py-2 px-6">{mockinterview.CreatedDate}</td>
                                  <td className="py-2 px-6">
                                    <div>
                                      <button
                                        onClick={() => toggleAction(mockinterview._id)}
                                      >
                                        <MdMoreHoriz className="text-3xl" />
                                      </button>
                                      {actionViewMore === mockinterview._id && (
                                        <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 -ml-28">
                                          <div className="space-y-1">
                                            <p
                                              className="hover:bg-gray-200 p-1 rounded pl-3"
                                              onClick={() =>
                                                handleMockInterviewClick(
                                                  mockinterview
                                                )
                                              }
                                            >
                                              View
                                            </p>
                                            <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handleEditClick(mockinterview)}>
                                              Reschedule
                                            </p>
                                            <p
                                              className="hover:bg-gray-200 p-1 rounded pl-3"
                                              onClick={() => handleUpdate(mockinterview._id)}
                                            >
                                              Cancel
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
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
                    <div className="overflow-y-auto min-h-80 max-h-96 right-0">
                      <div className="right-0">
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
                        ) : mockinterviewData.length === 0 ? (
                          <div className="py-10 text-center">
                            <div className="flex flex-col items-center justify-center p-5">
                              <p className="text-9xl rotate-180 text-blue-500">
                                <CgInfo />
                              </p>
                              <p className="text-center text-lg font-normal">
                                You don't have mockinterview yet. Create new mockinterview.
                              </p>
                              <p
                                onClick={toggleSidebar}
                                className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md"
                              >
                                Add Schedule
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-4 p-4">
                            {currentFilteredRows.length === 0 ? (
                              <div className="col-span-3 py-10 text-center">
                                <p className="text-lg font-normal">
                                  No data found.
                                </p>
                              </div>
                            ) : (
                              currentFilteredRows.map((mockinterview) => (
                                <div key={mockinterview._id} className="relative">
                                  <div className="absolute right-0 top-0">
                                    <button onClick={() => toggleAction(mockinterview._id)}>
                                      <IoMdMore className="text-3xl mt-1" />
                                    </button>
                                    {actionViewMore === mockinterview._id && (
                                      <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2">
                                        <div className="space-y-1">
                                          <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handleMockInterviewClick(mockinterview)}>View</p>
                                          <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handleEditClick(mockinterview)}>Reschedule</p>
                                          <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handleUpdate(mockinterview._id)}>Cancel</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="bg-white border border-orange-500 cursor-pointer p-2 rounded shadow-lg">
                                    <div className="flex">

                                      <div className="flex flex-col justify-between  ml-2">
                                        <p className="text-blue-400 text-lg cursor-pointer break-words" onClick={() => handleMockInterviewClick(mockinterview)}>
                                          {mockinterview.LastName}
                                        </p>
                                        <div className="text-xs grid grid-cols-2 gap-1  mt-5 items-start">
                                          <div className="text-gray-400">Skills/Technology</div>
                                          <div>{mockinterview.Skills}</div>

                                          <div className="text-gray-400">Date & Time</div>
                                          <div>{mockinterview.DateTime}</div>
                                          <div className="text-gray-400">Interviewer</div>
                                          <div className="text-blue-400">{mockinterview.Interviewer}</div>
                                          <div className="text-gray-400">Created On</div>
                                          <div>{mockinterview.CreatedDate}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="absolute right-2 bottom-0 ">
                                      {mockinterview.Status === "Scheduled" && (
                                        <>
                                          <Tooltip
                                            title="Scheduled"
                                            enterDelay={300}
                                            leaveDelay={100}
                                            arrow
                                          >
                                            <span>
                                              <WiTime4 className="text-3xl ml-1 mr-1 text-yellow-300" />
                                            </span>
                                          </Tooltip>
                                        </>
                                      )}
                                      {mockinterview.Status ===
                                        "ScheduleCancel" && (
                                          <>
                                            <Tooltip
                                              title="Cancel"
                                              enterDelay={300}
                                              leaveDelay={100}
                                              arrow
                                            >
                                              <span>
                                                <MdCancel className="text-3xl ml-1 mr-1 text-red-500" />
                                              </span>
                                            </Tooltip>
                                          </>
                                        )}
                                      {mockinterview.Status === "ReSchedule" && (
                                        <>
                                          <Tooltip
                                            title="Reschedule"
                                            enterDelay={300}
                                            leaveDelay={100}
                                            arrow
                                          >
                                            <span>
                                              <GrPowerReset className="text-3xl ml-1 mr-1 text-violet-500" />
                                            </span>
                                          </Tooltip>
                                        </>
                                      )}
                                    </div>
                                    {/* <div className="absolute right-2 bottom-2">
                                  <FcOk className="text-2xl" />
                                </div> */}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
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


      {selectedMockInterview && (
        <MockProfileDetails mockinterview={selectedMockInterview} />
      )}

      {selectedcandidate && (
        <EditMoclnterview onClose={handleclose} candidate1={selectedcandidate} ref={buttonRef} onClick={handleClick} />
      )}

      {showPopup && <Popup onClose={handlePopupClose} onConfirm={(e) => handlePopupConfirm(e, currentInterviewId._id)} />}

    </>
  );
};

const Popup = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-15">
      <div className="relative bg-white p-5 rounded-lg border shadow-lg h-48 text-center" style={{ width: "45%" }}>
        <div onClick={onClose} className="absolute top-2 right-2 cursor-pointer">
          <FaTimes className="text-gray-500" size={20} />
        </div>
        <p className='mt-6 text-lg'>Are You sure u want to cancel this Schedule</p>
        <div className="mt-10 flex justify-between">
          <button onClick={onConfirm} className="px-14 py-1 border bg-gray-300 rounded-md ml-10">Yes</button>
          <button onClick={onClose} className="px-14 py-1 border bg-gray-300 rounded-md mr-10">No</button>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
