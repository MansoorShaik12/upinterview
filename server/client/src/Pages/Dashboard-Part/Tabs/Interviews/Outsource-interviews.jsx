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
import { FaFilter } from "react-icons/fa";
import SchedulePopup from "./Schedulelater.jsx";
import SchedulePopup1 from "./Schedulenow.jsx";
import { MdMoreHoriz } from "react-icons/md";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import axios from "axios";
import { IoMdMore } from "react-icons/io";
import Editinternallater from "./Edit-Internal-later";
import { WiTime4 } from "react-icons/wi";
import { MdCancel } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";
import { FaTimes } from "react-icons/fa";
import { CgInfo } from "react-icons/cg";
import OutsourceInterview from "./Internalprofiledetails.js";
import { MdOutlineImageNotSupported } from "react-icons/md";

const OffcanvasMenu = ({ isOpen }) => {
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const handleStatusToggle = () => {
    setStatusDropdownOpen(!isStatusDropdownOpen);
  };

  return (
    <div
      className="absolute top-12 w-72  text-sm bg-white border right-0 z-30 overflow-y-scroll"
      style={{
        top: "40.3%",
        visibility: isOpen ? "visible" : "hidden",
        transform: isOpen ? "" : "translateX(50%)",
        height: isOpen ? "calc(100vh - 30%)" : "auto",
      }}
    >
      <div className="p-2">
        <h2 className="text-lg shadow-sm font-bold p-2 mb-4">Filter</h2>
        {/* Status checkbox */}
        <div className="flex">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 " />
              <span className="ml-3">Interview Type</span>
            </label>
          </div>
          {/* Dropdown icon */}
          <div className="cursor-pointer" onClick={handleStatusToggle}>
            {isStatusDropdownOpen ? (
              <FaCaretUp className="ml-10" />
            ) : (
              <FaCaretDown className="ml-10" />
            )}
          </div>
        </div>

        {/* Dropdown menu */}
        {isStatusDropdownOpen && (
          <div className="bg-white border border-gray-200 shadow-lg py-2 px-3 mt-1">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 " />
              <span className="ml-2">Phone</span>
            </label>{" "}
            <br />
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 " />
              <span className="ml-2">Video</span>
            </label>{" "}
            <br />
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 " />
              <span className="ml-2">Face To Face </span>
            </label>{" "}
            <br />
          </div>
        )}

        {/* Experience checkbox */}
        <div className="flex mt-2">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 " />
              <span className="ml-3">Today</span>
            </label>
          </div>
        </div>

        {/* Technology checkbox */}
        <div className="flex mt-2">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 " />
              <span className="ml-3">Tomorrow</span>
            </label>
          </div>
        </div>

        <div className="flex mt-2">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 " />
              <span className="ml-3">This Week</span>
            </label>
          </div>
        </div>
        <div className="flex mt-2">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 " />
              <span className="ml-3">Next Week</span>
            </label>
          </div>
        </div>
        <div className="flex mt-2">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 " />
              <span className="ml-3">This Month</span>
            </label>
          </div>
        </div>
        <div className="flex mt-2">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 " />
              <span className="ml-3">Next Month</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const Outsource = () => {
  useEffect(() => {
    document.title = "Candidate Tab";
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // const [interviewDropdown, setinterviewDropdown] = useState(false);
  const [interviewDropdown, setInterviewDropdown] = useState(false);

  useEffect(() => {
    document.title = "Internal interviews";
  }, []);
  const userId = localStorage.getItem("userId");

  const fetchInterviewData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/interview?CreatedBy=${userId}&Interviewstype=/outsourceinterview`
      );
      console.log("interview data:", response.data);
      setCandidateData(response.data);
    } catch (error) {
      console.error("Error fetching InterviewData:", error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedInterview, setSelectedInterview] = useState(null);

  const interviewRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        interviewRef.current &&
        !interviewRef.current.contains(event.target)
      ) {
        setInterviewDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  // const navigate = useNavigate();



  // const [searchQuery, setSearchQuery] = useState("");

  //------------------------------------------
  // fetching candidate data from the mongo db
  // -----------------------------------------
  const [candidateData, setCandidateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}`);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "interview") {
        setCandidateData(data);
        setNotification("A new candidate has been successfully created!");

        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    fetchInterviewData();

    return () => {
      ws.close();
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    console.log("Search query:", event.target.value);
  };

  const FilteredData = () => {
    return candidateData.filter((user) => {
      const fieldsToSearch = [
        user.Candidate,
        user.Position,
        // user.InterviewTitle,
        // user.InterviewType,
        // user.TeamMember ? user.TeamMember.join(", ") : "",
        // user.CreatedDate,
      ];
      return fieldsToSearch.some(
        (field) =>
          field !== undefined &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  // ------------------------------------------------
  // end of fetching candidate data from the mongo db
  // ------------------------------------------------

  // const FilteredData = () => {
  //   return candidateData.filter((user) => {
  //     const fieldsToSearch = [
  //       user.InterviewTitle,
  //       user.InterviewType,
  //       user.Position,
  //       user.TeamMember ? user.TeamMember.join(", ") : "",
  //       user.CreatedDAte,
  //     ];
  //     return fieldsToSearch.some(
  //       (field) =>
  //         field !== undefined &&
  //         field.toString().toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   });
  // };

  // const handleSearchInputChange = (event) => {
  //   setSearchQuery(event.target.value);
  //   console.log("Search query:", event.target.value);
  // };

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
  // const currentFilteredRows = FilteredData()
  // .slice(startIndex, endIndex)
  // .reverse();

  // action popup
  const [actionViewMore, setActionViewMore] = useState({});

  const toggleAction = (id) => {
    setActionViewMore((prev) => (prev === id ? null : id));
  };

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

  const [cancelledInterviews, setCancelledInterviews] = useState({});
  const [canceledInterviews, setCanceledInterviews] = useState({});

  const handleCancelInterview = (interviewId) => {
    setCancelledInterviews((prevState) => ({
      ...prevState,
      [interviewId]: true,
    }));
    setActionViewMore((prevState) => ({
      ...prevState,
      [interviewId]: false,
    }));
  };

  const handleCancelClick = (id) => {
    setCanceledInterviews((prevState) => ({
      ...prevState,
      [id]: true,
    }));
    setActionViewMore((prevState) => ({
      ...prevState,
      [id]: false,
    }));
  };

  const handleclose = () => {
    setSelectedInterview(null);
    setActionViewMore(false);
  };

  const buttonRef = useRef(null);

  const handleClick = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/interview/reschedule`,
        {
          id: selectedInterview._id,
        }
      );
      console.log("Updated interview:", response.data);
      setActionViewMore(false);
    } catch (error) {
      console.error("Error updating interview status from me :", error);
    }
  };

  //popup
  const [showPopup, setShowPopup] = useState(false);
  const [currentInterviewId, setCurrentInterviewId] = useState(null);



  const handlePopupClose = () => {
    setShowPopup(false);
    setCurrentInterviewId(null);
    setActionViewMore(false);
  };

  const handlePopupConfirm = async (e, _id) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/interview/${currentInterviewId}`,
        {
          _id: currentInterviewId,
          Status: "ScheduleCancel",
        }
      );

      const notificationResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/notification`,
        {
          Body: "Interview Cancelled successfully",
          Status: "ScheduleCancel",
        }
      );

      console.log("Notification posted:", notificationResponse.data);
      console.log("Updated interview:", response.data);
      setShowPopup(false);
      setActionViewMore(false);
    } catch (error) {
      console.error(
        "Error updating interview status or posting notification:",
        error
      );
    }
  };

  const [isSchedulePopupVisible, setSchedulePopupVisible] = useState(false); // State for popup visibility
  const [isSchedulePopupVisible1, setSchedulePopupVisible1] = useState(false); // State for popup visibility

  const openSchedulePopup = () => {
    setSchedulePopupVisible(true); // Show the popup
  };

  const closeSchedulePopup = () => {
    setSchedulePopupVisible(false); // Hide the popup
  };

  const openSchedulePopup1 = () => {
    setSchedulePopupVisible1(true); // Show the popup
  };

  const closeSchedulePopup1 = () => {
    setSchedulePopupVisible1(false); // Hide the popup
  };

  const currentFilteredRows = FilteredData()
    .slice(startIndex, endIndex)
    .reverse();

  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    tech: [],
    experience: [],
  });

  const handleFilterChange = useCallback((filters) => {
    setSelectedFilters(filters);
  }, []);

  const toggleInterviewDropdown = () => {
    setInterviewDropdown(!interviewDropdown);
  };

  const closeInterviewDropdown = () => {
    setInterviewDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        interviewRef.current &&
        !interviewRef.current.contains(event.target)
      ) {
        closeInterviewDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showEditLater, setShowEditLater] = useState(false);



  const [triggerCancel, setTriggerCancel] = useState(false);

  const handleInterviewClick = (interview) => {
    setTriggerCancel(false);
    setSelectedCandidate(interview);
    setActionViewMore(false);
  };
  const handleEditClick = (interview) => {
    setShowEditLater({
      ...interview,
      interviewers: interview.rounds[0]?.interviewers || [] // Pass the interviewers data
    });
    fetchInterviewData();
    setActionViewMore(false)
  };
  const handleUpdate = (interviewId, scheduleType) => {
    if (scheduleType === "instantinterview") {
      return;
    }
    setCurrentInterviewId(interviewId);
    setTriggerCancel(true);
    setSelectedCandidate(candidateData.find(candidate => candidate._id === interviewId));
    setActionViewMore(false);
  };

  const handleCloseProfile = () => {
    setSelectedCandidate(null);
  };

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}`);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "newInterview") {
        setCandidateData((prevData) => [...prevData, data]);
        setNotification("A new Outsource Interview has been created successfully!");

        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    fetchInterviewData();

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      {/* 1 */}
      <div className="fixed top-24 left-0 right-0 z-40">
        <div className="flex justify-between p-4">
          <div>
            <span className="p-3 w-fit text-lg font-semibold">
              Outsource Interviews
            </span>
          </div>

          <div>
            {notification && (
              <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
                {notification}
              </div>
            )}
          </div>

          <div className="relative mr-6 z-50">
            <span
              className="p-2 w-fit text-md font-semibold border shadow rounded-3xl cursor-pointer"
              onClick={toggleInterviewDropdown}
            >
              Request an Interview
            </span>
            {interviewDropdown && (
              <div className="absolute mt-5 z-50 w-48 rounded-md shadow-lg bg-white ring-1 p-2 ring-black ring-opacity-5">
                {/* Dropdown items */}
                <div className="space-y-1">
                  <p
                    className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md"
                    onClick={() => {
                      setInterviewDropdown(false);
                      openSchedulePopup();
                    }}
                  >
                    Schedule for Later
                  </p>
                  <p
                    className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md"
                    onClick={() => {
                      setInterviewDropdown(false);
                      openSchedulePopup1();
                    }}
                  >
                    Instant Interview
                  </p>
                </div>
              </div>
            )}
          </div>
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
                  onClick={candidateData.length === 0 ? null : toggleMenu}
                  style={{
                    opacity: candidateData.length === 0 ? 0.2 : 1,
                    pointerEvents: candidateData.length === 0 ? "none" : "auto",
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
                              Candidate Name
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Position
                            </th>
                            <th scope="col" className="py-3 px-6">
                              No. of Rounds
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
                              <td colSpan="9" className="py-10 text-center">
                                <div className="flex flex-col items-center justify-center p-5">
                                  <p className="text-9xl rotate-180 text-blue-500">
                                    <CgInfo />
                                  </p>
                                  <p className="text-center text-lg font-normal">
                                    You don't have any Interview request yet.
                                    Create new Interview request.
                                  </p>
                                  <p
                                    onClick={toggleSidebar}
                                    className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md"
                                  >
                                    Request an Interview
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : currentFilteredRows.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="py-10 text-center">
                                <p className="text-lg font-normal">
                                  No data found.
                                </p>
                              </td>
                            </tr>
                          ) : (
                            currentFilteredRows.map((interview) => {
                              const dateTime = interview.DateTime || "";
                              const [date, timeRange] = dateTime.split(" ");
                              const startTime = timeRange
                                ? timeRange.split(" - ")[0]
                                : "";
                              const formattedDateTime = `${date} ${startTime}`;
                              return (
                                <tr
                                  key={interview._id}
                                  className="bg-white border-b cursor-pointer text-xs"
                                >
                                  <td>
                                    <div className="flex items-center">
                                      {interview.Status === "Scheduled" && (
                                        <>
                                          <span className="w-2 bg-yellow-300 h-12"></span>
                                          <Tooltip
                                            title="Scheduled"
                                            enterDelay={300}
                                            leaveDelay={100}
                                            arrow
                                          >
                                            <span>
                                              <WiTime4 className="text-xl ml-1 mr-1 text-yellow-300" />
                                            </span>
                                          </Tooltip>
                                        </>
                                      )}
                                      {interview.Status ===
                                        "ScheduleCancel" && (
                                          <>
                                            <span className="w-2 bg-red-500 h-12"></span>
                                            <Tooltip
                                              title="Cancel"
                                              enterDelay={300}
                                              leaveDelay={100}
                                              arrow
                                            >
                                              <span>
                                                <MdCancel className="text-xl ml-1 mr-1 text-red-500" />
                                              </span>
                                            </Tooltip>
                                          </>
                                        )}
                                      {interview.Status === "Reschedule" && (
                                        <>
                                          <span className="w-2 bg-violet-500 h-12"></span>
                                          <Tooltip
                                            title="Rescheduled"
                                            enterDelay={300}
                                            leaveDelay={100}
                                            arrow
                                          >
                                            <span>
                                              <GrPowerReset className="text-xl ml-1 mr-1 text-violet-500" />
                                            </span>
                                          </Tooltip>
                                        </>
                                      )}
                                      <div className="py-2 px-2 flex items-center gap-3 text-blue-400">
                                        {interview.candidateImageUrl ? (
                                          <img
                                            src={interview.candidateImageUrl}
                                            alt="Candidate"
                                            className="w-7 h-7 rounded"
                                          />
                                        ) : (
                                          <MdOutlineImageNotSupported
                                            className="w-7 h-7 text-gray-900"
                                            alt="Default"
                                          />
                                        )}
                                        <div
                                          onClick={() =>
                                            handleInterviewClick(interview)
                                          }
                                        >
                                          {interview.Candidate}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 px-6">
                                    {interview.Position}
                                  </td>
                                  <td className="py-2 px-6">
                                    <Tooltip
                                      title={interview.rounds.map(
                                        (round, index) => (
                                          <div key={index}>{round.round}</div>
                                        )
                                      )}
                                      arrow
                                    >
                                      <span>
                                        {interview.rounds.length}{" "}
                                        {interview.rounds.length === 1
                                          ? "Round"
                                          : "Rounds"}
                                      </span>
                                    </Tooltip>
                                  </td>
                                  <td className="py-2 px-6">
                                    {interview.CreatedDate}
                                  </td>
                                  <td className="py-2 px-6">
                                    {/* Action */}
                                    <div>
                                      <button
                                        onClick={() =>
                                          toggleAction(interview._id)
                                        }
                                      >
                                        <MdMoreHoriz className="text-3xl" />
                                      </button>
                                      {actionViewMore === interview._id && (
                                        <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2">
                                          <div className="space-y-1">
                                            <p
                                              className="hover:bg-gray-200 p-1 rounded pl-3"
                                              onClick={() =>
                                                handleInterviewClick(interview)
                                              }
                                            >
                                              View
                                            </p>
                                            {interview.ScheduleType !== "instantinterview" && (
                                            <>
                                              <p
                                                className="hover:bg-gray-200 p-1 rounded pl-3"
                                                onClick={() =>
                                                  handleEditClick(interview)
                                                }
                                              >
                                                Reschedule
                                              </p>
                                              <p
                                                className="hover:bg-gray-200 p-1 rounded pl-3"
                                                onClick={() =>
                                                  handleUpdate(
                                                    interview._id,
                                                    interview.ScheduleType
                                                  )
                                                }
                                              >
                                                Cancel
                                              </p>
                                            </>
                                          )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  {/* <td className="py-2 px-6">{formattedDateTime}</td> */}

                                  {/* <td className="py-2 px-6">
																  {interview.InterviewType}
																</td> */}

                                  {/* <td className="py-2 px-6">
																  {interview.Duration}
																</td> */}
                                  {/* <td className="py-2 px-6">
																  {Array.isArray(interview.TeamMember)
																	? interview.TeamMember.join(", ")
																	: ""}
																</td> */}
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
                // onFilterChange={handleFilterChange}
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
                        ) : candidateData.length === 0 ? (
                          <div className="py-10 text-center">
                            <div className="flex flex-col items-center justify-center p-5">
                              <p className="text-9xl rotate-180 text-blue-500">
                                <CgInfo />
                              </p>
                              <p className="text-center text-lg font-normal">
                                You don't have Schedule yet. Create new
                                Schedule.
                              </p>
                              <p
                                onClick={setInterviewDropdown}
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
                              currentFilteredRows.map((interview) => (
                                <div key={interview._id} className="relative">
                                  <div className="absolute right-0 top-0">
                                    <button
                                      onClick={() =>
                                        toggleAction(interview._id)
                                      }
                                    >
                                      <IoMdMore className="text-3xl mt-1" />
                                    </button>
                                    {actionViewMore === interview._id && (
                                      <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2">
                                        <div className="space-y-1">
                                          <p
                                            className="hover:bg-gray-200 p-1 rounded pl-3"
                                            onClick={() =>
                                              handleInterviewClick(interview)
                                            }
                                          >
                                            View
                                          </p>
                                          <p
                                            className={`hover:bg-gray-200 p-1 rounded pl-3  ${interview.ScheduleType ===
                                              "instantinterview"
                                              ? "cursor-not-allowed text-gray-400"
                                              : ""
                                              }`}
                                            onClick={() =>
                                              interview.ScheduleType !==
                                              "instantinterview" &&
                                              handleEditClick(interview)
                                            }
                                          >
                                            Reschedule
                                          </p>
                                          <p
                                            className={`hover:bg-gray-200 p-1 rounded pl-3 ${interview.ScheduleType ===
                                              "instantinterview"
                                              ? "cursor-not-allowed text-gray-400"
                                              : ""
                                              }`}
                                            onClick={() =>
                                              interview.ScheduleType !==
                                              "instantinterview" &&
                                              handleUpdate(
                                                interview._id,
                                                interview.ScheduleType
                                              )
                                            }
                                          >
                                            Cancel
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="bg-white border border-orange-500 cursor-pointer p-2 rounded shadow-lg">
                                    <div className="flex">
                                      <div className="w-16 h-14 mt-3 ml-1 mr-3 overflow-hidden cursor-pointer rounded">
                                        {interview.candidateImageUrl ? (
                                          <img
                                            src={interview.candidateImageUrl}
                                            alt="Candidate"
                                            className="w-full h-full"
                                          />
                                        ) : (
                                          <MdOutlineImageNotSupported
                                            className="w-full h-full text-gray-900"
                                            alt="Default"
                                          />
                                        )}
                                      </div>
                                      <div className="flex flex-col justify-between">
                                        <p
                                          className="text-blue-400 text-lg cursor-pointer break-words"
                                          onClick={() =>
                                            handleInterviewClick(interview)
                                          }
                                        >
                                          {interview.Candidate}
                                        </p>
                                        <div className="text-xs grid grid-cols-2 gap-1 items-start">
                                          {/* <div className="text-gray-400">
                                            Interview Title
                                          </div>
                                          <div>{interview.InterviewTitle}</div> */}
                                          {/* <div className="text-gray-400">
                                            Interview Type
                                          </div>
                                          <div>{interview.InterviewType}</div> */}
                                          <div className="text-gray-400">
                                            Position
                                          </div>
                                          <div className="text-blue-400">
                                            {interview.Position}
                                          </div>
                                          <div className="text-gray-400">
                                            No. of Rounds
                                          </div>
                                          <div>
                                            {" "}
                                            <Tooltip
                                              title={interview.rounds.map(
                                                (round, index) => (
                                                  <div key={index}>
                                                    {round.round}
                                                  </div> // Adjust this line based on your round data structure
                                                )
                                              )}
                                              arrow
                                            >
                                              <span>
                                                {interview.rounds.length}{" "}
                                                {interview.rounds.length === 1
                                                  ? "Round"
                                                  : "Rounds"}
                                              </span>
                                            </Tooltip>
                                          </div>
                                          {/* <div className="text-gray-400">
                                            Duration
                                          </div>
                                          <div>{interview.Duration}</div> */}
                                          {/* <div className="text-gray-400">
                                            Interviewer
                                          </div>
                                          <div className="text-blue-400">
                                            {Array.isArray(interview.TeamMember)
                                              ? interview.TeamMember.join(", ")
                                              : ""}
                                          </div> */}
                                          <div className="text-gray-400">
                                            Created Date
                                          </div>
                                          <div>{interview.CreatedDate}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="absolute right-1 bottom-1">
                                      {interview.Status === "Scheduled" && (
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
                                      {interview.Status ===
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
                                      {interview.Status === "ReSchedule" && (
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

      {/* {selectedCandidate && (
				<CandidateProfileDetails candidate={selectedCandidate} />
			)} */}
 {showPopup && (
        <Popup
          onClose={handlePopupClose}
          onConfirm={(e) => handlePopupConfirm(e, currentInterviewId)}
        />
      )}
      {showEditLater && (
        <Editinternallater
          onClose={() => setShowEditLater(false)}
          candidate1={showEditLater}
          rounds={showEditLater.rounds}
          interviewers={showEditLater.interviewers}
        />
      )}
      {isSchedulePopupVisible && <SchedulePopup onClose={closeSchedulePopup} />}
      {isSchedulePopupVisible1 && (
        <SchedulePopup1 onClose={closeSchedulePopup1} />
      )}
      {selectedCandidate && (
        <OutsourceInterview
        candidate={selectedCandidate}
        onCloseprofile={handleCloseProfile}
        triggerCancel={triggerCancel}
        viewMode={viewMode} // Pass viewMode as a prop
        />
      )}
    </>
  );
};

const Popup = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-15">
      <div
        className="relative bg-white p-5 rounded-lg border shadow-lg h-48 text-center"
        style={{ width: "45%" }}
      >
        <div
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer"
        >
          <FaTimes className="text-gray-500" size={20} />
        </div>
        <p className="mt-6 text-lg">
          Are You sure u want to cancel this Schedule
        </p>
        <div className="mt-10 flex justify-between">
          <button
            onClick={onConfirm}
            className="px-14 py-1 border bg-gray-300 rounded-md ml-10"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-14 py-1 border bg-gray-300 rounded-md mr-10"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Outsource;
