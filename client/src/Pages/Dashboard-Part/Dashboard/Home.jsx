import { FcBusinessman } from "react-icons/fc";
import { RiTeamFill } from "react-icons/ri";
import { GoOrganization } from "react-icons/go";
import { IoIosPerson } from "react-icons/io";
import { SiGoogleanalytics } from "react-icons/si";
import { BsQuestionCircle } from "react-icons/bs";
import { LuFileSearch } from "react-icons/lu";
import { IoMdLaptop } from "react-icons/io";
import { PiNotificationBold } from "react-icons/pi";
import { FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect, forwardRef } from "react";
import AppViewMore from "./AppViewMore";
import Sidebar from "../Dashboard/NewInterviewRequest";
import axios from "axios";
import "./Home.scss";
import { useNavigate } from "react-router-dom";
import { AiTwotoneSchedule } from "react-icons/ai";

const Home = () => {
  return (
    <>
      <div>
        <Home1 />
        <Home2 />
        <Home3 />
        <Home4 />
      </div>
    </>
  );
};

const Home1 = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <div className="container mx-auto mb-4 mt-2 ml-4">
        <span className="text-transparent font-medium text-xl bg-clip-text bg-gradient-to-r from-fuchsia-950 to-blue-500">
          {getGreeting()}, Trulee Innovate
        </span>
      </div>
    </>
  );
};

const SidebarWithRef = forwardRef((props, ref) => (
  <Sidebar {...props} ref={ref} />
));

const Home2 = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/newinterviewviewpage"); // Replace with the path you want to navigate to
  };

  // styles
  const trFontstyle = {
    fontSize: "13px",
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      closeSidebar();
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sidebarOpen]);

  const interviewData = [
    {
      title: "Salesforce Developer",
      date: "15/5/2024 3:00 pm",
      skills: "Apex, AURA, LWC",
    },
    {
      title: "Fullstack Developer",
      date: "15/5/2024 6:00 pm",
      skills: "HTML, CSS",
    },
    {
      title: "Java Developer",
      date: "15/5/2024 7:00 pm",
      skills: "Apex, AURA, LWC",
    },
  ];
  return (
    <>
      <div className="container mx-auto mb-5">
        <div className="shadow py-3 mx-2">
          <p className="mb-2 ml-3 font-bold">New Interview Requests</p>
          <div className="grid grid-cols-3 gap-4 mx-3">
            {interviewData.map((interview, index) => (
              <div key={index} className="p-1 rounded-md shadow-md border">
                <div className="flex mb-2 text-sm">
                  <div className="w-28 font-medium">Title</div>
                  <div>{interview.title}</div>
                </div>
                <div className="flex mb-2 text-sm">
                  <div className="w-28 font-medium">Date & Time</div>
                  <div>{interview.date}</div>
                </div>
                <div className="flex mb-2 text-sm">
                  <div className="w-28 font-medium">Skills</div>
                  <div>{interview.skills}</div>
                </div>
                <div className="text-lg mr-3 -mt-5 float-end">
                  <FaArrowRight onClick={toggleSidebar} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <p
              className="border rounded-md shadow text-xs p-1 mr-2"
              onClick={handleClick}
              style={{ cursor: "pointer" }}
            >
              View More
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const Home3 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const apps = [
    {
      to: "/internalinterview",
      icon: <FcBusinessman className="text-4xl" />,
      title: "Internal Interviews",
      description: "Internal interviews are conducted by internal team members",
    },
    {
      to: "/outsourceinterview",
      icon: <IoMdLaptop className="text-4xl" />,
      title: "Outsource Interviews",
      description:
        "Outsource interviews are conducted by external interviewers.",
    },
    {
      to: "/mockinterview",
      icon: <LuFileSearch className="text-4xl" />,
      title: "Mock Interviews",
      description:
        "Practice interviews for skill improvement and confidence building.",
    },
    {
      to: "/assessment",
      icon: <LuFileSearch className="text-4xl" />,
      title: "Assessments",
      description:
        "Simplify evaluations with our user-friendly assessment app.",
    },
    {
      to: "/interview-question",
      icon: <BsQuestionCircle className="text-4xl" />,
      title: "Question Bank",
      description: "Explore questions easily with our Question Bank app.",
    },
    {
      to: "/candidate",
      icon: <IoIosPerson className="text-4xl" />,
      title: "Candidates",
      description: "Manage candidates easily with our Candidates app.",
    },
    {
      to: "/position",
      icon: <GoOrganization className="text-4xl" />,
      title: "Positions",
      description: "Organize positions efficiently with the Position app.",
    },
    {
      to: "/team",
      icon: <RiTeamFill className="text-4xl" />,
      title: "Teams",
      description: "Easily add team members with our Teams app.",
    },
    {
      to: "/analytics",
      icon: <SiGoogleanalytics className="text-4xl" />,
      title: "Analytics",
      description: "Explore data with our Analytics app.",
    },
  ];
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [candidateData, setCandidateData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [interviewData, setInterviewData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [lastFetchedCandidates, setLastFetchedCandidates] = useState([]);
  const [lastFetchedPositions, setLastFetchedPositions] = useState([]);
  const [lastFetchedTeams, setLastFetchedTeams] = useState([]);
  const [lastFetchedInterviews, setLastFetchedInterviews] = useState([]);

  useEffect(() => {
    const fetchCandidateData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/candidate?CreatedBy=${userId}`);
        if (Array.isArray(response.data)) {
          const sortedData = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          if (
            sortedData.length > 0 &&
            sortedData[0].createdAt !== lastFetchedCandidates[0]?.createdAt
          ) {
            setCandidateData(sortedData);
          }
          setLastFetchedCandidates(sortedData);
          console.log(sortedData,"sfdvdf");
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidateData();
  }, []);

  useEffect(() => {
    const fetchSkillsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/position?CreatedBy=${userId}`);
        if (Array.isArray(response.data)) {
          const sortedData = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          if (
            sortedData.length > 0 &&
            sortedData[0].createdAt !== lastFetchedPositions[0]?.createdAt
          ) {
            setSkillsData(sortedData);;
          }
          setLastFetchedPositions(sortedData);
        }
      } catch (error) {
        console.error("Error fetching position data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkillsData();
  }, []);

  useEffect(() => {
    const fetchTeamsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/team?CreatedBy=${userId}`);
        if (Array.isArray(response.data)) {
          const sortedData = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          if (
            sortedData.length > 0 &&
            sortedData[0].createdAt !== lastFetchedTeams[0]?.createdAt
          ) {
            setTeamsData(sortedData);
          }
          setLastFetchedTeams(sortedData);
        }
      } catch (error) {
        console.error("Error fetching position data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamsData();
  }, []);

  useEffect(() => {
    const fetchInterviewData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/interview");
        if (Array.isArray(response.data)) {
          const sortedData = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          if (
            sortedData.length > 0 &&
            sortedData[0].createdAt !== lastFetchedInterviews[0]?.createdAt
          ) {
            setInterviewData(sortedData);
          }
          setLastFetchedInterviews(sortedData);
        }
      } catch (error) {
        console.error("Error fetching InterviewData:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviewData();
  }, []);

  return (
    <>
      <div className="container mx-auto mb-5">
        <div className="shadow py-3 mx-2">
          <div className="flex">
            <p className="mb-2 ml-3 font-bold">Newly added</p>
            <p className="mb-2 ml-40 font-bold">Apps</p>
          </div>
          <div className="grid grid-cols-5 gap-4 mx-3">
            {/* first column */}
            <div className="col-span-1 p-2 rounded-md shadow-md border">
              <div className="flex gap-5 mb-2 text-sm">
                <div className="font-bold w-20">Candidate</div>
                <div>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      {candidateData.length > 0 && (
                        <p>{candidateData[0].LastName}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-5 mb-2 text-sm">
                <div className="font-bold w-20">Positions</div>
                <div>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <>{skillsData.length > 0 && <p>{skillsData[0].title}</p>}</>
                  )}
                </div>
              </div>
              <div className="flex gap-5 mb-2 text-sm">
                <div className="font-bold w-20">Teams</div>
                <div>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      {teamsData.length > 0 && <p>{teamsData[0].LastName}</p>}
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-5 mb-2 text-sm">
                <div className="font-bold w-20">Schedules</div>
                <div>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      {interviewData.length > 0 && (
                        <p>{interviewData[0].InterviewTitle}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Second column */}
            <div className="col-span-4 p-2 rounded-md shadow-md border">
              <div className="grid grid-cols-3 gap-4">
                {apps.map((app, index) => (
                  <div
                    key={index}
                    className="p-1 rounded-md shadow-md hover:shadow-lg border flex flex-col"
                  >
                    {" "}
                    {/* Use flex to allow dynamic height */}
                    <NavLink to={app.to} className="flex-grow">
                      {" "}
                      {/* Allow NavLink to grow */}
                      <div className="grid grid-cols-5 cursor-pointer gap-1 h-full">
                        {" "}
                        {/* Ensure full height */}
                        <div className="col-span-1 flex items-center">
                          {app.icon}
                        </div>
                        <div className="col-span-4 flex items-center">
                          <div>
                            <p className="text-sm font-bold">{app.title}</p>
                            <p className="text-sm">{app.description}</p>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                ))}
              </div>
              <div>
                <p
                  className="border rounded-md shadow-md float-end text-xs p-1 mr-2 mt-2"
                  onClick={openModal}
                  style={{ cursor: "pointer" }}
                >
                  View More
                </p>
                {isModalOpen && (
                  <AppViewMore
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Home4 = () => {
  const navigate = useNavigate();

  const notifications = () => {
    navigate("/notifications"); // Replace with the path you want to navigate to
  };

  const notificationRef1 = useRef(null);
  useEffect(() => {
    // Function to close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (
        notificationRef1.current &&
        !notificationRef1.current.contains(event.target)
      ) {
        setNotificationDropdown1(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [notificationDropdown1, setNotificationDropdown1] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });

  const handleIconClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const dropdownHeight = 500;
    const newTop =
      rect.bottom + dropdownHeight > window.innerHeight
        ? window.innerHeight - dropdownHeight
        : rect.bottom;

    setDropdownPosition({
      top: newTop,
      right: window.innerWidth - rect.right,
    });
    setNotificationDropdown1(true);
  };

  const [notificationsData, setNotificationsData] = useState([]);
  const [notificationDropdown, setNotificationDropdown] = useState(false);

  useEffect(() => {
    const fetchNotificationData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/notification");
        setNotificationsData(response.data);
      } catch (error) {
        console.error("Error fetching notificationData:", error);
      }
    };
    fetchNotificationData();
  }, []);

  const filteredNotifications = notificationsData.slice(
    Math.max(notificationsData.length - 2, 0)
  );

  return (
    <>
      <div className="container mx-auto mb-10">
        <div className="shadow py-3 mx-2">
          <div className="flex">
            <p className="mb-2 ml-3 font-bold">Things to Note</p>
            <p className="mb-2 ml-36 font-bold">Notifications</p>
          </div>
          <div className="grid grid-cols-5 gap-4 mx-3">
            {/* first column */}
            <div className="col-span-1 p-2 rounded-md shadow-md text-center border">
              <p className="text-gray-500 mt-2"> Upcoming Interviews</p>
              <p className="text-4xl text-sky-500 p-4"> 0</p>
              <p className="text-gray-500"> Interview Requests</p>
              <p className="text-4xl text-sky-500 p-4"> 2</p>
            </div>
            {/* Second column */}
            <div className="col-span-4 p-2 rounded-md shadow-md border">
              <div className=" text-sm border-b mb-5 w-full justify-between">
              {filteredNotifications.map((interview, i) => (
                          <div
                            key={i}
                            className="flex text-sm border-b w-full justify-between bg-gray-100"
                          >
                            <div className="flex item-center mt-2">
                              <div className="w-10 ml-3 mt-1">
                                {interview.Status === "Scheduled" ? (
                                  <AiTwotoneSchedule className="text-xl" />
                                ) : (
                                  <PiNotificationBold className="text-xl" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold">
                                  {interview.Status === "Scheduled"
                                    ? "Interview Scheduled"
                                    : "New Interview Requests"}
                                </p>
                                <p>{interview.Body}</p>
                                <p className="mb-2">{interview.CreatedDate}</p>
                              </div>
                            </div>
                            <div className="text-xl mt-12 mr-2">
                              <FaArrowRight />
                            </div>
                          </div>
                        ))}
              </div>

           

              

              <div>
                <p
                  className="border rounded-md shadow-md float-end text-xs p-1 mr-2 mt-2"
                  onClick={notifications}
                  style={{ cursor: "pointer" }}
                >
                  View More
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
