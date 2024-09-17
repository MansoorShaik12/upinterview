import React, { useState, useEffect, useRef } from "react";
import { PiNotificationBold } from "react-icons/pi";
import { FaArrowRight } from "react-icons/fa";
import { AiTwotoneSchedule } from "react-icons/ai";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaBell } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Navbar-Sidebar.scss";

const Navbar = () => {
  const userId = localStorage.getItem('userId');

  const [assessmentDropdown, setAssessmentDropdown] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationDropdown, setnotificationDropdown] = useState(false);
  const [interviewDropdown, setinterviewDropdown] = useState(false);
  const [outlineDropdown, setoutlineDropdown] = useState(false);
  const [isDetailDropdownOpen, setIsDetailDropdownOpen] = useState(false);
  const [isGettingDropdownOpen, setIsGettingDropdownOpen] = useState(false);
  const [isQuestionDropdownOpen, setIsQuestionDropdownOpen] = useState(false);
  const [isFunctionDropdownOpen, setIsFunctionDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isAdditionalDropdownOpen, setIsAdditionalDropdownOpen] = useState(false);
  const [isLegalDropdownOpen, setIsLegalDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);


  const assessmentRef = useRef(null);
  const moreRef = useRef(null);
  const profileRef = useRef(null);
  const outlineRef = useRef(null);
  const notificationRef = useRef(null);
  const interviewRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        assessmentRef.current &&
        !assessmentRef.current.contains(event.target)
      ) {
        setAssessmentDropdown(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
      if (
        interviewRef.current &&
        !interviewRef.current.contains(event.target)
      ) {
        setinterviewDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setnotificationDropdown(false);
      }
      if (
        outlineRef.current &&
        !outlineRef.current.contains(event.target)
      ) {
        setoutlineDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contacts'); // Fetch all contacts
        if (Array.isArray(response.data) && response.data.length > 0) {
          const contact = response.data[0]; // Assuming you want the first contact's image
          if (contact.ImageData && contact.ImageData.filename) {
            const imageUrl = `http://localhost:5000/${contact.ImageData.path.replace(/\\/g, '/')}`;
            setProfileImage(imageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, []);
  const handleCancel = () => {
    setnotificationDropdown(false);
  };
  const handleCancelled = () => {
    setoutlineDropdown(false);
  };
  const handleGettingToggle = () => {
    setIsGettingDropdownOpen(!isGettingDropdownOpen);
  };
  const handleDetailToggle = () => {
    setIsDetailDropdownOpen(!isDetailDropdownOpen);
  };
  const handleQuestionToggle = () => {
    setIsQuestionDropdownOpen(!isQuestionDropdownOpen);
  };
  const handleFunctionToggle = () => {
    setIsFunctionDropdownOpen(!isFunctionDropdownOpen);
  };
  const handleContactToggle = () => {
    setIsContactDropdownOpen(!isContactDropdownOpen);
  };
  const handleAdditionalToggle = () => {
    setIsAdditionalDropdownOpen(!isAdditionalDropdownOpen);
  };
  const handleLegalToggle = () => {
    setIsLegalDropdownOpen(!isLegalDropdownOpen);
  };


  // const [profileImage, setProfileImage] = useState(null);
  // const [profileDropdown, setProfileDropdown] = useState(false);
  // const profileRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/contacts/${userId}`);
        const data = response.data;

        if (data.ImageData && data.ImageData.path) {
          setProfileImage(data.ImageData.path);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileData();
  }, []);
  const notifications = () => {
    navigate("/notifications");
    setnotificationDropdown(false);
  };

  return (
    <>
      <div className="bg-white fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto relative">
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 px-10">
            <div className="flex items-center">
              <p className="text-2xl font-bold">Logo</p>
            </div>
            <nav className="flex space-x-10">
              <div className="relative" ref={interviewRef}>
                <button className="text-black font-medium flex items-center" onClick={() => setinterviewDropdown(!interviewDropdown)} >
                  Interviews &nbsp; {interviewDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {interviewDropdown && (
                  <div className="absolute mt-2 z-50 w-48 rounded-md shadow-lg bg-white ring-1 p-2 ring-black ring-opacity-5">
                    <div className="space-y-1">
                      <NavLink className="block px-3 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md" activeclassname="bg-gray-200 text-gray-800" to="/internalinterview" onClick={() => { setinterviewDropdown(false); }} >
                        Internal Interviews
                      </NavLink>
                      <NavLink className="block px-3 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md" activeclassname="bg-gray-200 text-gray-800" to="/outsourceinterview" onClick={() => { setinterviewDropdown(false); }} >
                        Outsource Interviews
                      </NavLink>
                      <NavLink className="block px-3 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md" activeclassname="bg-gray-200 text-gray-800" to="/mockinterview" onClick={() => { setMoreDropdown(false); }} >
                        Mock Interviews
                      </NavLink>
                      <NavLink className="block px-3 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md" activeclassname="bg-gray-200 text-gray-800" to="/videocallbutton" onClick={() => { setinterviewDropdown(false); }} >
                        Start Interview
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={assessmentRef}>
                <button className="text-black font-medium flex items-center" onClick={() => setAssessmentDropdown(!assessmentDropdown)} >
                  Assessments&nbsp;
                  {assessmentDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {assessmentDropdown && (
                  <div className="absolute mt-2 z-10 w-44 rounded-md shadow-lg bg-white ring-1 p-2 ring-black ring-opacity-5">
                    <div className="space-y-1">
                      <NavLink className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md" onClick={() => { setAssessmentDropdown(false); }} activeclassname="bg-gray-200 text-gray-800" to="/assessment" >
                        Assessments
                      </NavLink>
                      <NavLink className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md" activeclassname="bg-gray-200 text-gray-800" to="/interview-question" onClick={() => { setAssessmentDropdown(false); }} >
                        Question Bank
                      </NavLink>
                      <NavLink className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md" activeclassname="bg-gray-200 text-gray-800" to="/assessmenttest" onClick={() => { setAssessmentDropdown(false); }} >
                        Assessment Test
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-base font-medium text-black">
                <NavLink activeclassname="bg-gray-200 text-gray-800" to="/analytics" >
                  Analytics
                </NavLink>
              </p>
              <div className="relative" ref={moreRef}>
                <button className="text-black font-medium flex items-center" onClick={() => setMoreDropdown(!moreDropdown)} >
                  More&nbsp;
                  {moreDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {moreDropdown && (
                  <div className="absolute p-2 z-10 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="space-y-1">
                      <NavLink className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md" activeclassname="bg-gray-200 text-gray-800" to="/candidate" onClick={() => { setMoreDropdown(false); }} >
                        Candidates
                      </NavLink>
                      <NavLink className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md" activeclassname="bg-gray-200 text-gray-800" to="/position" onClick={() => { setMoreDropdown(false); }} >
                        Positions
                      </NavLink>
                      <NavLink className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md" activeclassname="bg-gray-200 text-gray-800" to="/team" onClick={() => { setMoreDropdown(false); }} >
                        Teams
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            </nav>
            <div className="flex space-x-2 text-black">
              <div className="search">
                <input type="text" placeholder="Search" className="rounded-full" />
                <button type="submit"><IoMdSearch /></button>
              </div>
              <div className="text-2xl border-2 rounded-md p-2">
                <NavLink to="/home">
                  <IoHome />
                </NavLink>
              </div>
              <div className="text-2xl border-2 rounded-md p-2" ref={outlineRef} >
                <div className="relative">
                  <p className="text-black font-medium" onClick={() => setoutlineDropdown(!outlineDropdown)} >
                    <IoMdInformationCircleOutline />
                  </p>
                  {outlineDropdown && (
                    <div className="absolute top-12 w-80 text-sm rounded-md bg-white border right-0 z-50 -mr-20">
                      <div className="flex justify-between items-center px-4 py-2 border-b">
                        <h2 className="text-start font-medium text-gray-400">Help & Training</h2>
                        <button className="text-gray-500 hover:text-gray-700" onClick={handleCancelled}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M15.293 4.293a1 1 0 1 1 1.414 1.414L11.414 10l5.293 5.293a1 1 0 1 1-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 1 1-1.414-1.414L8.586 10 3.293 4.707a1 1 0 1 1 1.414-1.414L10 8.586l5.293-5.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <div className="text-sm border-b w-full">
                          <div className="mt-2 mb-2 ml-8 flex items-center">
                            <p>Introduction</p>
                          </div>
                          <div className="flex justify-between mr-4 mt-2">
                            <div className="cursor-pointer">
                              <label className="inline-flex items-center ml-5">
                                <span className="ml-3"> Getting Started</span>
                              </label>
                            </div>
                            <div className="cursor-pointer ml-30" onClick={handleGettingToggle}>
                              {isGettingDropdownOpen ? (
                                <FaCaretUp className="ml-10" />
                              ) : (
                                <FaCaretDown className="ml-10" />
                              )}
                            </div>
                          </div>
                          <div className="flex mt-2 justify-between mr-4">
                            <div className="cursor-pointer">
                              <label className="inline-flex items-center ml-5">
                                <span className="ml-3">Detailed Instructions</span>
                              </label>
                            </div>
                            <div className="cursor-pointer ml-[88px]" onClick={handleDetailToggle}>
                              {isDetailDropdownOpen ? (
                                <FaCaretUp className="ml-10" />
                              ) : (
                                <FaCaretDown className="ml-10" />
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between mr-4 mt-2">
                            <div className="cursor-pointer">
                              <label className="inline-flex items-center ml-5">
                                <span className="ml-3">FAQs (Frequently Asked Questions) </span>
                              </label>
                            </div>
                            <div className="cursor-pointer" onClick={handleQuestionToggle}>
                              {isQuestionDropdownOpen ? (
                                <FaCaretUp className="ml-10" />
                              ) : (
                                <FaCaretDown className="ml-10" />
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between mr-4 mt-2">
                            <div className="cursor-pointer">
                              <label className="inline-flex items-center ml-5">
                                <span className="ml-3">Search Functionalilty</span>
                              </label>
                            </div>
                            <div className="cursor-pointer ml-[88px]" onClick={handleFunctionToggle}>
                              {isFunctionDropdownOpen ? (
                                <FaCaretUp className="ml-10" />
                              ) : (
                                <FaCaretDown className="ml-10" />
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between mr-4 mt-2">
                            <div className="cursor-pointer">
                              <label className="inline-flex items-center ml-5">
                                <span className="ml-3">Contact Support</span>
                              </label>
                            </div>
                            <div className="cursor-pointer ml-[114px]" onClick={handleContactToggle}>
                              {isContactDropdownOpen ? (
                                <FaCaretUp className="ml-10" />
                              ) : (
                                <FaCaretDown className="ml-10" />
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between mr-4 mt-2">
                            <div className="cursor-pointer">
                              <label className="inline-flex items-center ml-5">
                                <span className="ml-3">Additional Resources</span>
                              </label>
                            </div>
                            <div className="cursor-pointer ml-[85px]" onClick={handleAdditionalToggle}>
                              {isAdditionalDropdownOpen ? (
                                <FaCaretUp className="ml-10" />
                              ) : (
                                <FaCaretDown className="ml-10" />
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between mr-4 mt-2">
                            <div className="cursor-pointer">
                              <label className="inline-flex items-center ml-5">
                                <span className="ml-3">Legal and Privacy Information</span>
                              </label>
                            </div>
                            <div className="cursor-pointer ml-[30px]" onClick={handleLegalToggle}>
                              {isLegalDropdownOpen ? (
                                <FaCaretUp className="ml-10" />
                              ) : (
                                <FaCaretDown className="ml-10" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-2xl border-2 rounded-md p-2" ref={notificationRef}>
                <div className="relative">
                  <p className="text-black font-medium" onClick={() => setnotificationDropdown(!notificationDropdown)}>
                    <FaBell />
                  </p>
                  {notificationDropdown && (
                    <div className="absolute top-12 w-80 text-sm rounded-md bg-white border right-0 z-50 -mr-20">
                      <div className="flex justify-between items-center px-4 py-2 border-b">
                        <h2 className="text-start font-medium">Notifications</h2>
                        <button className="text-gray-500 hover:text-gray-700" onClick={handleCancel}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M15.293 4.293a1 1 0 1 1 1.414 1.414L11.414 10l5.293 5.293a1 1 0 1 1-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 1 1-1.414-1.414L8.586 10 3.293 4.707a1 1 0 1 1 1.414-1.414L10 8.586l5.293-5.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div>
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="flex text-sm border-b w-full justify-between bg-gray-100">
                            <div className="flex item-center mt-2">
                              <div className={`w-10 ml-3 mt-1 ${i === 2 ? "w-14 mr-5" : ""}`}>
                                {i === 2 ? <AiTwotoneSchedule className="text-xl" /> : <PiNotificationBold className="text-xl" />}
                              </div>
                              <div>
                                <p className="font-bold">{i === 2 ? "Interview Scheduled" : "New Interview Requests"}</p>
                                <p>Skill: Apex, AURA, LWC</p>
                                <p className="mb-2">15 May 2024, 05:40 PM</p>
                              </div>
                            </div>
                            <div className={`text-xl mt-12 mr-2 ${i === 2 ? "mt-28" : ""}`}>
                              <FaArrowRight />
                            </div>
                          </div>
                        ))}
                        <div>
                          <p onClick={notifications}
                            style={{ cursor: "pointer" }} className="float-right text-sm mr-2 p-2">View More</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-2xl border-2 rounded-md px-1 py-1 flex items-center" ref={profileRef}>
                <div className="relative">
                  <p
                    className="text-black font-medium"
                    onClick={() => setProfileDropdown(!profileDropdown)}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-12 h-7 rounded-full" />
                    ) : (
                      <CgProfile />
                    )}
                  </p>
                  {profileDropdown && (
                    <div className="absolute top-10 w-40 text-sm rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 right-0 z-10">
                      <div className="p-2">
                        {[
                          { to: "/billing", label: "Billing" },
                          { to: "/wallet", label: "My Wallet" },
                          { to: "/profile", label: "Settings" },
                        ].map(({ to, label }, index) => (
                          <NavLink
                            key={index}
                            className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md"
                            activeClassName="bg-gray-200 text-gray-800"
                            to={to}
                            onClick={() => setProfileDropdown(false)}
                          >
                            {label}
                          </NavLink>
                        ))}
                      </div>
                      <p className="border-b"></p>
                      <div className="p-2 text-red-600">
                        <NavLink
                          className="block px-4 py-1 hover:bg-gray-200 hover:text-gray-800 rounded-md"
                          activeClassName="bg-gray-200 text-gray-800"
                          to="/logout"
                          onClick={() => setProfileDropdown(false)}
                        >
                          Logout
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;