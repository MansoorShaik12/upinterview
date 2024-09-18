import { useState, useRef, useEffect, useCallback } from "react";
import "../../../../index.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { FaList } from "react-icons/fa6";
import { TbLayoutGridRemove } from "react-icons/tb";
import { IoMdSearch } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import { IoIosArrowBack } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { MdMoreHoriz } from "react-icons/md";
import Sidebar from "../Team-Tab/CreateTeams";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import axios from "axios";
import Editteams from "./EditTeam";
import { CgInfo } from "react-icons/cg";
import TeamProfileDetails from "./TeamProfileDetails";
import maleImage from '../../../Dashboard-Part/Images/man.png';
import femaleImage from '../../../Dashboard-Part/Images/woman.png';
import genderlessImage from '../../../Dashboard-Part/Images/transgender.png';



const OffcanvasMenu = ({ isOpen, onFilterChange }) => {
  const [isTechDropdownOpen, setTechDropdownOpen] = useState(false);
  const [isExperienceDropdownOpen, setIsExperienceDropdownOpen] = useState(false);
  const [isTechMainChecked, setTechMainChecked] = useState(false);
  const [isExperienceMainChecked, setIsExperienceMainChecked] = useState(false);
  const [selectedTechOptions, setSelectedTechOptions] = useState([]);
  const [selectedExperienceOptions, setSelectedExperienceOptions] = useState([]);

  const isAnyOptionSelected = selectedTechOptions.length > 0 || selectedExperienceOptions.length > 0;


  const handleUnselectAll = () => {
    setSelectedTechOptions([]);
    setSelectedExperienceOptions([]);
    setTechMainChecked(false);
    setIsExperienceMainChecked(false);
    onFilterChange({ status: [], tech: [], experience: [] });
  };
  useEffect(() => {
    if (!isTechMainChecked) setSelectedTechOptions([]);
    if (!isExperienceMainChecked) setSelectedExperienceOptions([]);
  }, [isTechMainChecked, isExperienceMainChecked]);

  const handleTechMainToggle = () => {
    setTechMainChecked(!isTechMainChecked);
    const newSelectedTech = isTechMainChecked ? [] : [...skill];
    setSelectedTechOptions(newSelectedTech);
    onFilterChange({ tech: newSelectedTech, experience: selectedExperienceOptions });
  };

  const handleExperienceMainToggle = () => {
    setIsExperienceMainChecked(!isExperienceMainChecked);
    const newSelectedExperience = isExperienceMainChecked ? [] : [...technology];
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

  const technology = [
    "Artificial Intelligence (AI)",
    "Machine Learning (ML)",
    "Data Science",
    "Big Data Analytics",
    "Cloud Computing",
    "Blockchain",
    "Cybersecurity",
    "Internet of Things (IoT)",
    "Augmented Reality (AR)",
    "Virtual Reality (VR)",
    "DevOps",
    "Full Stack Development",
    "Mobile App Development",
    "Robotic Process Automation (RPA)",
    "Digital Marketing",
    "UI/UX Design",
    "Software Testing",
    "Edge Computing",
    "5G Technology",
    "Quantum Computing"
  ];

  const skill = [
    "HTML",
    "CSS",
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "AWS (Amazon Web Services)",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "Cybersecurity",
    "Network Administration",
    "Data Analysis",
    "Artificial Intelligence (AI)",
    "Machine Learning (ML)",
    "Natural Language Processing (NLP)",
    "Data Mining",
    "Data Visualization",
    "Tableau",
    "Power BI",
    "iOS Development",
    "Android Development",
    "React",
    "Angular",
    "Vue.js",
    "Django",
    "Spring",
    "Express.js",
    "UI/UX Design",
    "Software Testing",
    "Agile Methodologies",
    "Git",
    "Bash",
    "PowerShell",
    "Linux/Unix Administration",
    "Ruby on Rails",
    "PHP",
    "Swift",
    "TypeScript",
    "Node.js",
    "Flask",
    "Laravel",
    "ASP.NET",
    "React Native",
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
            {isAnyOptionSelected && (
              <div>
                <button onClick={handleUnselectAll} className="font-bold text-md">
                  Unselect All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="flex mt-2 justify-between">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5"
                checked={isExperienceMainChecked}
                onChange={handleExperienceMainToggle}
              />
              <span className="ml-3 font-bold">Technology</span>
            </label>
          </div>
          <div
            className="cursor-pointer mr-3 text-2xl"
            onClick={() =>
              setIsExperienceDropdownOpen(!isExperienceDropdownOpen)
            }
          >
            {isExperienceDropdownOpen ? (
              <MdKeyboardArrowUp />
            ) : (
              <MdKeyboardArrowDown />
            )}
          </div>
        </div>

        {isExperienceDropdownOpen && (
          <div className="bg-white py-2 mt-1">
            {technology.map((option, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  checked={selectedExperienceOptions.includes(option)}
                  onChange={() => handleExperienceOptionToggle(option)}
                />
                <span className="ml-2 w-56">{option}</span>
              </label>
            ))}
          </div>
        )}
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
            {skill.map((option, index) => (
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


const Team = () => {
  // sidebar code
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

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleCandidateClick = async (teams) => {
    setSelectedTeam(teams);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/team/${teams._id}/availability`);
      const availabilityData = response.data;
      setSelectedTeam({ ...teams, availability: availabilityData.Availability });
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  };

  const handleCloseProfile = () => {
    setSelectedTeam(null);
  };


  const [candidateData, setCandidateData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}`);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "team") {
        setCandidateData(data);
        setNotification("A new team member has been successfully created!");

        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    const fetchTeamsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/team?CreatedBy=${userId}`);
        if (Array.isArray(response.data)) {
          const teamsWithImages = response.data.map((team) => {
            if (team.ImageData && team.ImageData.filename) {
              const imageUrl = `${process.env.REACT_APP_API_URL}/${team.ImageData.path.replace(/\\/g, '/')}`;
              return { ...team, imageUrl };
            }
            return team;
          });
          setCandidateData(teamsWithImages);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamsData();

    return () => {
      ws.close();
    };
  }, []);



  const [selectedFilters, setSelectedFilters] = useState({
    tech: [],
    experience: [],
  });

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const FilteredData = () => {
    if (!Array.isArray(candidateData)) return [];
    return candidateData.filter((user) => {
      const fieldsToSearch = [
        user.LastName,
        user.Email,
        user.Phone,
      ].filter(field => field !== null && field !== undefined);

      const matchesExperience = selectedFilters.experience.length === 0 || selectedFilters.experience.includes(user.Technology);
      const matchesTech = selectedFilters.tech.length === 0 || (user.skills && user.skills.some(skill => selectedFilters.tech.includes(skill.skill)));

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


  const Navigate = useNavigate();
  const scheduling = () => {
    Navigate("/scheduletype_save");
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
  const endIndex = Math.min(startIndex + rowsPerPage, candidateData.length);
  const currentFilteredRows = FilteredData()
    .slice(startIndex, endIndex)
    .reverse();

  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("list");

  const handleListViewClick = () => {
    setViewMode("list");
  };

  const handleKanbanViewClick = () => {
    setViewMode("kanban");
  };

  const [tableVisible] = useState(true);

  const [actionViewMore, setActionViewMore] = useState({});

  const toggleAction = (id) => {
    setActionViewMore((prev) => (prev === id ? null : id));
  };

  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const [selectedcandidate, setSelectedcandidate] = useState(null);

  const handleEditClick = async (teams) => {
    console.log("Selected candidate for editing:", teams); // Log the selected candidate
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/team/${teams._id}/availability`);
      const availability = response.data.Availability;
      setSelectedcandidate({ ...teams, availability });
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
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
            <span className="text-lg font-semibold">My Team</span>
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
              Add Team Member
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
                  placeholder="Search by Name, Email, Phone."
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
                  className={`border-2 p-2 mr-2 text-2xl ${currentPage === 0 ? "cursor-not-allowed" : ""} ${activeArrow === "prev" ? "text-blue-500" : ""}`}
                  onClick={prevPage}
                  disabled={currentPage === 0}
                >
                  <IoIosArrowBack />
                </span>
              </Tooltip>

              <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
                <span
                  className={`border-2 p-2 text-2xl ${currentPage === totalPages - 1 ? "cursor-not-allowed" : ""} ${activeArrow === "next" ? "text-blue-500" : ""}`}
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
                  onClick={candidateData.length === 0 ? null : toggleMenu}
                  style={{
                    opacity: candidateData.length === 0 ? 0.2 : 1,
                    pointerEvents: candidateData.length === 0 ? "none" : "auto",
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
                            <th scope="col" className="py-3 px-6">
                              Name
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Email
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Phone
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Technology
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Location
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Skills
                            </th>
                            <th scope="col" className="py-3 pl-10">
                              Actions
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
                          ) : candidateData.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="py-10 text-center">
                                <div className="flex flex-col items-center justify-center p-5">
                                  <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                                  <p className="text-center text-lg font-normal">You don't have team yet. Create new team.</p>
                                  <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add team</p>
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
                            currentFilteredRows.map((teams) => {
                              return (
                                <tr
                                  key={teams._id}
                                  className="bg-white border-b cursor-pointer text-xs"
                                >
                                  <td className="py-4 px-6 text-blue-400">
                                    <div
                                      className="flex items-center gap-3"
                                      onClick={() => handleCandidateClick(teams)}
                                    >
                                       {teams.imageUrl ? (
                                      <img src={teams.imageUrl} alt="Candidate" className="w-7 h-7 rounded" />
                                    ) : (
                                      teams.Gender === "Male" ? (
                                        <img src={maleImage} alt="Male Avatar" className="w-7 h-7 rounded" />
                                      ) : teams.Gender === "Female" ? (
                                        <img src={femaleImage} alt="Female Avatar" className="w-7 h-7 rounded" />
                                      ) : (
                                        <img src={genderlessImage} alt="Other Avatar" className="w-7 h-7 rounded" />
                                      )
                                    )}
                                      {teams.LastName}
                                    </div>
                                  </td>
                                  <td className="py-2 px-6">{teams.Email}</td>
                                  <td className="py-2 px-6">{teams.Phone}</td>
                                  <td className="py-2 px-6">{teams.Technology}</td>
                                  <td className="py-2 px-6">{teams.Location}</td>
                                  <td className="py-2 px-6">
                                    {teams.skills?.map((skillEntry, index) => (
                                      <div key={index}>
                                        {skillEntry.skill}
                                        {index < teams.skills.length - 1 && ", "}
                                      </div>
                                    ))}
                                  </td>{" "}
                                  <td className="py-2 px-6">
                                    {/* Action */}
                                    <div>
                                      <button
                                        onClick={() => toggleAction(teams._id)}
                                      >
                                        <MdMoreHoriz className="text-3xl ml-5" />
                                      </button>
                                      {actionViewMore === teams._id && (
                                        <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2">
                                          <div className="space-y-1">
                                            <p
                                              className="hover:bg-gray-200 p-1 rounded pl-3"
                                              onClick={() =>
                                                handleCandidateClick(teams)
                                              }
                                            >
                                              View
                                            </p>
                                            <p
                                              className="hover:bg-gray-200 p-1 rounded pl-3"
                                              onClick={() =>
                                                handleEditClick(teams)
                                              }
                                            >
                                              Edit
                                            </p>
                                            <p
                                              className="hover:bg-gray-200 p-1 rounded pl-3"
                                              onClick={scheduling}
                                            >
                                              Schedule
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
                      ) : candidateData.length === 0 ? (
                        <div className="py-10 text-center">
                          <div className="flex flex-col items-center justify-center p-5">
                            <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                            <p className="text-center text-lg font-normal">You don't have team yet. Create new team.</p>
                            <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add team</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4 p-4">
                          {currentFilteredRows.length === 0 ? (
                            <div className="col-span-3 py-10 text-center">
                              <p className="text-lg font-normal">No data found.</p>
                            </div>
                          ) : (
                            currentFilteredRows.map((teams) => (
                              <div key={teams._id}>
                              <div className="relative">
                                <div className="float-right">
                                  <button
                                    onClick={() => toggleAction(teams._id)}
                                  >
                                    <IoMdMore className="text-3xl mt-1" />
                                  </button>
                                  {actionViewMore === teams._id && (
                                    <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2">
                                      <div className="space-y-1">
                                        <p
                                          className="hover:bg-gray-200 p-1 rounded pl-3"
                                          onClick={() =>
                                            handleCandidateClick(teams)
                                          }
                                        >
                                          View
                                        </p>
                                        <p
                                          className="hover:bg-gray-200 p-1 rounded pl-3"
                                          onClick={() =>
                                            handleEditClick(teams)
                                          }
                                        >
                                          Edit
                                        </p>
                                        <p
                                          className="hover:bg-gray-200 p-1 rounded pl-3"
                                          onClick={scheduling}
                                        >
                                          Schedule
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="bg-white border border-orange-500 cursor-pointer p-2 rounded">
                                <div className="flex">

                                  <div className="w-16 h-14 mt-3 ml-1 mr-3 overflow-hidden cursor-pointer rounded">
                                    {teams.imageUrl ? (
                                      <img src={teams.imageUrl} alt="Candidate" className="w-full h-full rounded" />
                                    ) : (
                                      teams.Gender === "Male" ? (
                                        <img src={maleImage} alt="Male Avatar" className="w-full h-full rounded" />
                                      ) : teams.Gender === "Female" ? (
                                        <img src={femaleImage} alt="Female Avatar" className="w-full h-full rounded" />
                                      ) : (
                                        <img src={genderlessImage} alt="Other Avatar" className="w-full h-full rounded" />
                                      )
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <div
                                      className="text-blue-400 text-lg cursor-pointer break-words"
                                      onClick={() =>
                                        handleCandidateClick(teams)
                                      }
                                    >
                                      {teams.LastName}
                                    </div>
                                    <div className="text-xs grid grid-cols-2 gap-1 items-start">
                                      <div className="text-gray-400">
                                        Email
                                      </div>
                                      <div>{teams.Email}</div>
                                      <div className="text-gray-400">
                                        Phone
                                      </div>
                                      <div>{teams.Phone}</div>
                                      <div className="text-gray-400">
                                        Technology
                                      </div>
                                      <div>{teams.Technology}</div>
                                      <div className="text-gray-400">
                                        Location
                                      </div>
                                      <div>{teams.Location}</div>
                                      <div className="text-gray-400">
                                        Skills
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {teams.skills.map((skillEntry, index) => (
                                          <div key={index}>
                                            {skillEntry.skill}{index < teams.skills.length - 1 && ', '}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
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

      {/* {selectedcandidate && (
         <Editteams onClose={handleclose} candidate1={selectedcandidate} availability={selectedcandidate.availability} />
       )} */}
    {selectedcandidate && (
        <Editteams onClose={handleclose} candidate1={selectedcandidate} availability={selectedcandidate.availability} />
      )}

      {selectedTeam && (
        <TeamProfileDetails candidate={selectedTeam} onCloseprofile={handleCloseProfile} />
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

export default Team;
