import { useState, useRef, useEffect, useCallback } from "react";
import "../../../../index.css";
import "../styles/tabs.scss";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaList } from "react-icons/fa6";
import { TbLayoutGridRemove } from "react-icons/tb";
import { IoMdSearch } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import { IoMdMore } from "react-icons/io";
import { MdMoreHoriz } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import Sidebar from "../Assessment-Tab/NewAssessment.jsx";
import axios from "axios";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import EditAssessment from "./EditAssessment.jsx";
import { CgInfo } from "react-icons/cg";

import ShareAssessment from "./ShareAssessment.jsx";
import AssessmentProfileDetails from "./Assessmentprofiledetails.jsx";

const OffcanvasMenu = ({ isOpen, onFilterChange }) => {
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isTechDropdownOpen, setTechDropdownOpen] = useState(false);
  const [isStatusMainChecked, setStatusMainChecked] = useState(false);
  const [isTechMainChecked, setTechMainChecked] = useState(false);
  const [isExperienceMainChecked, setIsExperienceMainChecked] = useState(false);
  const [selectedStatusOptions, setSelectedStatusOptions] = useState([]);
  const [selectedTechOptions, setSelectedTechOptions] = useState([]);
  const [selectedExperienceOptions, setSelectedExperienceOptions] = useState([]);
  const isAnyOptionSelected = selectedStatusOptions.length > 0 || selectedTechOptions.length > 0 || selectedExperienceOptions.length > 0;

  const handleUnselectAll = () => {
    setSelectedStatusOptions([]);
    setSelectedTechOptions([]);
    setSelectedExperienceOptions([]);
    setStatusMainChecked(false);
    setTechMainChecked(false);
    setIsExperienceMainChecked(false);
    setMinExperience('');
    setMaxExperience('');
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
    onFilterChange({ status: newSelectedStatus, tech: selectedTechOptions, experience: selectedExperienceOptions });
  };

  const handleTechMainToggle = () => {
    setTechMainChecked(!isTechMainChecked);
    const newSelectedTech = isTechMainChecked ? [] : [...techOptions];
    setSelectedTechOptions(newSelectedTech);
    onFilterChange({ status: selectedStatusOptions, tech: newSelectedTech, experience: selectedExperienceOptions });
  };

  const handleStatusOptionToggle = (option) => {
    const selectedIndex = selectedStatusOptions.indexOf(option);
    const updatedOptions = selectedIndex === -1
      ? [...selectedStatusOptions, option]
      : selectedStatusOptions.filter((_, index) => index !== selectedIndex);

    setSelectedStatusOptions(updatedOptions);
    onFilterChange({ status: updatedOptions, tech: selectedTechOptions, experience: selectedExperienceOptions });
  };

  const handleTechOptionToggle = (option) => {
    const selectedIndex = selectedTechOptions.indexOf(option);
    const updatedOptions = selectedIndex === -1
      ? [...selectedTechOptions, option]
      : selectedTechOptions.filter((_, index) => index !== selectedIndex);

    setSelectedTechOptions(updatedOptions);
    onFilterChange({ status: selectedStatusOptions, tech: updatedOptions, experience: selectedExperienceOptions });
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

  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');

  const handleExperienceChange = (e, type) => {
    const value = Math.max(0, Math.min(15, e.target.value));
    if (type === 'min') {
      setMinExperience(value);
    } else {
      setMaxExperience(value);
    }
    onFilterChange({
      status: selectedStatusOptions,
      tech: selectedTechOptions,
      experience: { min: type === 'min' ? value : minExperience, max: type === 'max' ? value : maxExperience },
    });
  };

  useEffect(() => {
    onFilterChange({
      status: selectedStatusOptions,
      tech: selectedTechOptions,
      experience: { min: minExperience, max: maxExperience },
    });
  }, [selectedStatusOptions, selectedTechOptions, minExperience, maxExperience, onFilterChange]);

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


const Assessment = () => {
  useEffect(() => {
    document.title = "Assessment Tab";
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [assessmentData, setAssessmentData] = useState([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false);
  const [recipientEmail] = useState("");

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

  const handleAssessmentClick = (assessment) => {
    setShowAssessmentDetails(assessment)
    setActionViewMore(false);
  };

  const handleShareClick = async (assessment) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/shareassessment`, {
        assessmentId: assessment._id,
        email: recipientEmail,
        programmingDetails: assessment.ProgrammingDetails
      });
      console.log("Assessment shared:", response.data);
    } catch (error) {
      console.error("Error sharing assessment:", error);
    }
    setIsShareOpen(assessment);
    setActionViewMore(false);
  };


  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}`);

    ws.onopen = () => {
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);

      if (type === 'assessment') {
        setAssessmentData(data);
        setNotification("A new assessment has been successfully created!");

        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    };

    ws.onclose = () => {
    };

    const fetchAssessmentData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/assessment?createdBy=${userId}`);
        setAssessmentData(response.data);
      } catch (error) {
        console.error("Error fetching Assessment data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessmentData();

    return () => {
      ws.close();
    };
  }, [userId]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    tech: [],
    experience: [],
  });

  const handleFilterChange = useCallback((filters) => {
    setSelectedFilters(filters);
  }, []);

  const FilteredData = () => {
    if (!Array.isArray(assessmentData)) return [];
    return assessmentData.filter((user) => {
      const fieldsToSearch = [
        user.AssessmentTitle,
        user.Position,

      ].filter(field => field !== null && field !== undefined);

      const matchesStatus = selectedFilters.status.length === 0 || selectedFilters.status.includes(user.HigherQualification);
      const matchesTech = selectedFilters.tech.length === 0 || user.skills.some(skill => selectedFilters.tech.includes(skill.skill));
      const matchesExperience = (selectedFilters.experience.min === '' || user.CurrentExperience >= selectedFilters.experience.min) &&
        (selectedFilters.experience.max === '' || user.CurrentExperience <= selectedFilters.experience.max);

      const matchesSearchQuery = fieldsToSearch.some(
        (field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

      return matchesSearchQuery && matchesStatus && matchesTech && matchesExperience;
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(FilteredData().length / rowsPerPage);
  const [activeArrow, setActiveArrow] = useState(null);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setActiveArrow("next");
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setActiveArrow("prev");
    }
  };
  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, assessmentData.length);
  const currentFilteredRows = FilteredData()
    .slice(startIndex, endIndex)
    .reverse();

  const [tableVisible] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const handleListViewClick = () => {
    setViewMode("list");
  };
  const handleKanbanViewClick = () => {
    setViewMode("kanban");
  };

  const [actionViewMore, setActionViewMore] = useState({});

  const toggleAction = (id) => {
    setActionViewMore((prev) => (prev === id ? null : id));
  };

  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleEditClick = (assessment) => {
    setSelectedAssessment(assessment);
    setActionViewMore(false);
  };

  const handleCloseProfile = () => {
    setShowAssessmentDetails(false);
  };
  const handleCloseShare = () => {
    setIsShareOpen(false);
  };

  const handleCloseEdit = () => {
    setSelectedAssessment(null);
    setActionViewMore(false);
  };

  return (
    <>
      <div className="fixed top-24 left-0 right-0">
        <div className="flex justify-between mt-5">
          <div>
            <span className="p-3 w-fit text-lg font-semibold">
              My Assessments
            </span>
          </div>
          <div>
            {notification && (
              <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
                {notification}
              </div>
            )}
          </div>
          <div onClick={toggleSidebar} className="mr-6">
            <span className="p-2 w-fit text-md font-semibold border shadow rounded-3xl">
              Add Assessments
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
                  placeholder="Search by Assessment Name, Position."
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
                  onClick={assessmentData.length === 0 ? null : toggleMenu}
                  style={{
                    opacity: assessmentData.length === 0 ? 0.2 : 1,
                    pointerEvents: assessmentData.length === 0 ? "none" : "auto",
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
                    <div className="overflow-y-auto min-h-80 max-h-96">
                      <table className="text-left w-full border-collapse border-gray-300 mb-14">
                        <thead className="bg-gray-300 sticky top-0 z-10 text-xs">
                          <tr>
                            <th scope="col" className="py-3 px-6">
                              Assessment Name
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Position
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Duration
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Expiry Date
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan="8" className="py-28 text-center">
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
                          ) : assessmentData.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="py-10 text-center">
                                <div className="flex flex-col items-center justify-center p-5">
                                  <p className="text-9xl rotate-180 text-blue-500">
                                    <CgInfo />
                                  </p>
                                  <p className="text-center text-lg font-normal">
                                    You don't have assessment yet. Create new assessment.
                                  </p>
                                  <p
                                    onClick={toggleSidebar}
                                    className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md"
                                  >
                                    Add assessment
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : currentFilteredRows.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="py-10 text-center">
                                <p className="text-lg font-normal">No data found.</p>
                              </td>
                            </tr>
                          ) : (
                            currentFilteredRows.map((assessment) => (
                              <tr
                                key={assessment._id}
                                className="bg-white border-b cursor-pointer text-xs"
                              >
                                <td className="py-2 px-6 text-blue-400">
                                  <div
                                    className="flex"
                                    onClick={() =>
                                      handleAssessmentClick(assessment)
                                    }
                                  >
                                    {assessment.AssessmentTitle}
                                  </div>
                                </td>
                                <td className="py-2 px-6">{assessment.Position}</td>
                                <td className="py-2 px-6">{assessment.Duration}</td>
                                <td className="py-2 px-6">
                                  {new Date(assessment.ExpiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}                                </td>
                                <td className="py-2 px-6">
                                  <div>
                                    <button
                                      onClick={() => toggleAction(assessment._id)}
                                    >
                                      <MdMoreHoriz className="text-3xl" />
                                    </button>
                                    {actionViewMore === assessment._id && (
                                      <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2">
                                        <div className="space-y-1">
                                          <p
                                            className="hover:bg-gray-200 p-1 rounded pl-3"
                                            onClick={() => handleShareClick(assessment)}
                                          >
                                            Share
                                          </p>
                                          <p
                                            className="hover:bg-gray-200 p-1 rounded pl-3"
                                            onClick={() =>
                                              handleAssessmentClick(assessment)
                                            }
                                          >
                                            View
                                          </p>
                                          <p
                                            className="hover:bg-gray-200 p-1 rounded pl-3"
                                            onClick={() =>
                                              handleEditClick(assessment)
                                            }
                                          >
                                            Edit
                                          </p>
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
                      ) : assessmentData.length === 0 ? (
                        <div className="py-10 text-center">
                          <div className="flex flex-col items-center justify-center p-5">
                            <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                            <p className="text-center text-lg font-normal">You don't have candidates yet. Create new candidate.</p>
                            <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add Candidate</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4 p-4">
                          {currentFilteredRows.length === 0 ? (
                            <div className="col-span-3 py-10 text-center">
                              <p className="text-lg font-normal">No data found.</p>
                            </div>
                          ) : (
                            currentFilteredRows.map((assessment) => (
                              <div
                                key={assessment._id}
                                className="bg-white border border-orange-500 cursor-pointer p-2 rounded text-xs"
                              >
                                <div className="flex justify-between">
                                  <div className="flex">
                                    <div className="w-32 ml-2">
                                      <p
                                        className="text-blue-500 text-lg"
                                        onClick={() =>
                                          handleAssessmentClick(assessment)
                                        }
                                      >
                                        {assessment.AssessmentTitle}
                                      </p>
                                      <p className="text-gray-700">
                                        <span className="text-slate-400">
                                          Position
                                        </span>
                                      </p>
                                      <p className="text-gray-700">
                                        <span className="text-slate-400">
                                          Duration
                                        </span>
                                      </p>
                                      <p className="text-gray-700">
                                        <span className="text-slate-400">
                                          Expiry Date
                                        </span>
                                      </p>
                                    </div>
                                    <div className="mt-7">

                                      <p className="text-gray-700">
                                        {assessment.Position}
                                      </p>
                                      <p className="text-gray-700">
                                        {assessment.Duration}
                                      </p>
                                      <p className="text-gray-700">
                                        {new Date(assessment.ExpiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <div>
                                      <button
                                        onClick={() =>
                                          toggleAction(assessment._id)
                                        }
                                      >
                                        <IoMdMore className="text-3xl" />
                                      </button>
                                      {actionViewMore === assessment._id && (
                                        <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2">
                                          <div className="space-y-1">
                                            <p
                                              className="hover:bg-gray-200 p-1 rounded pl-3"
                                              onClick={() => handleShareClick(assessment)}
                                            >
                                              Share
                                            </p>
                                            <p
                                              className="hover:bg-gray-200 p-1 rounded pl-3"
                                              onClick={() =>
                                                handleAssessmentClick(assessment)
                                              }
                                            >
                                              View
                                            </p>
                                            <p
                                              className="hover:bg-gray-200 p-1 rounded pl-3"
                                              onClick={() =>
                                                handleEditClick(assessment)
                                              }
                                            >
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
                  <OffcanvasMenu isOpen={isMenuOpen} closeOffcanvas={toggleMenu} onFilterChange={handleFilterChange} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {selectedAssessment && (
        <EditAssessment
          onClose={handleCloseEdit}
          assessmentId={selectedAssessment._id}
          candidate1={selectedAssessment}
        />
      )}
      {isShareOpen && (
        <ShareAssessment
          isOpen={isShareOpen}
          onCloseshare={handleCloseShare}
          assessmentId={isShareOpen._id}
        />
      )}
      {showAssessmentDetails && (
        <AssessmentProfileDetails assessment={showAssessmentDetails} onCloseprofile={handleCloseProfile} />
      )}

      {sidebarOpen && (
        <>
          <div className={"fixed inset-0 bg-black bg-opacity-15 z-50"}>
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

export default Assessment;
