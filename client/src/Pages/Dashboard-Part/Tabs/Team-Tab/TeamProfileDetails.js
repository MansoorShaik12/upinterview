import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMinus } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineCancel } from "react-icons/md";
import EditTeamsForm from "./EditTeam";
import maleImage from '../../../Dashboard-Part/Images/man.png';
import femaleImage from '../../../Dashboard-Part/Images/woman.png';
import genderlessImage from '../../../Dashboard-Part/Images/transgender.png';

const TeamDetails = ({ candidate, onCloseprofile }) => {
  // const navigate = useNavigate();
  // const location = useLocation();
  // const candidateData = location.state?.teams;
  // const [candidate] = useState(candidateData);

  const [showMainContent, setShowMainContent] = useState(true);
  const [showNewCandidateContent, setShowNewCandidateContent] = useState(false);

  // const handleEditClick = (candidate) => {
  //   setShowMainContent(false);
  //   setShowNewCandidateContent({ state: { candidate } });
  // };

  const handleEditClick = (candidate) => {
    setShowMainContent(false);
    setShowNewCandidateContent({ state: { candidate, availability: candidate.availability } }); // Pass availability
  };

  const handleclose = () => {
    setShowMainContent(true);
    setShowNewCandidateContent(false);
  };

  const [activeTab, setActiveTab] = useState("teammember");
  // const skills = location.state?.teams?.Skill;
  // const SkillExperience = location.state?.teams?.SkillExperience;
  // const SkillExpertise = location.state?.teams?.SkillExpertise;

  // const handleNavigate = () => {
  //   navigate("/candidate", { state: { candidate } });
  // };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // skills function
  const [rows] = useState(candidate.skills);
  const [selectedRowIndexes, setSelectedRowIndexes] = useState([]);
  const handleSelectRow = (index) => {
    if (selectedRowIndexes.includes(index)) {
      setSelectedRowIndexes(selectedRowIndexes.filter((i) => i !== index));
    } else {
      setSelectedRowIndexes([...selectedRowIndexes, index]);
    }
  };

  // styles
  const trFontstyle = {
    fontSize: "13px",
  };
  const currentRows = [
    {
      id: 1,
      name: "John Doe",
      image: "https://via.placeholder.com/150",
      position: "Frontend Developer",
      scheduletype: "Face-to-Face",
      roundname: "Technical Interview",
      datetime: "13-3-2024, 11:30",
      Status: "Scheduled",
    },
    {
      id: 2,
      name: "Jane Smith",
      image: "https://via.placeholder.com/150",
      position: "Data Analyst",
      scheduletype: "Remote",
      roundname: "Data Skills Assessment",
      datetime: "15-3-2024, 09:00",
      Status: "Pending",
    },
    {
      id: 3,
      name: "Alice Johnson",
      image: "https://via.placeholder.com/150",
      position: "Backend Developer",
      scheduletype: "Online",
      roundname: "Coding Challenge",
      datetime: "20-3-2024, 14:00",
      Status: "Completed",
    },
    {
      id: 4,
      name: "Robert Lee",
      image: "https://via.placeholder.com/150",
      position: "Project Manager",
      scheduletype: "In-Person",
      roundname: "Management Interview",
      datetime: "18-3-2024, 16:00",
      Status: "Rescheduled",
    },
    {
      id: 5,
      name: "Emma Wilson",
      image: "https://via.placeholder.com/150",
      position: "UX Designer",
      scheduletype: "Face-to-Face",
      roundname: "Creative Workshop",
      datetime: "25-3-2024, 10:30",
      Status: "Cancelled",
    },
  ];

  // team availability
  const [selectedOption, setSelectedOption] = useState(null);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };
  // const closeModalAndNavigate = () => {
  //   navigate("/team");
  // };

  const { availability } = candidate;

  console.log("Availability data:", availability);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getAvailabilityForDay = (day) => {
    return availability.filter((slot) => slot.day === day);
  };

  return (
    <>
      <div>
        {showMainContent ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className="bg-white shadow-lg overflow-auto"
              style={{ width: "97%", height: "94%" }}
            >
              {/* Team / Profile */}
              <div className="border-b p-2">
                <div className="mx-8 my-3 flex justify-between items-center">
                  <p className="text-xl">
                    <span className="text-orange-500 font-semibold cursor-pointer">
                      Team
                    </span>{" "}
                    / {candidate.LastName}
                  </p>
                  {/* Cancel icon */}
                  <button
                    className="shadow-lg rounded-full"
                    onClick={onCloseprofile}
                  >
                    <MdOutlineCancel className="text-2xl" />
                  </button>
                </div>
              </div>

              {/* Show Edit button only when activeTab is "teammember" */}
              {activeTab === "teammember" && (
                <div className="flex float-end">
                  <button
                    className="text-gray-500 mr-7 mt-3"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* mini tabs navigation */}
              <div>
                <div className="mx-14 mt-4">
                  <p className="text-xl space-x-10">
                    <span
                      className={`cursor-pointer ${activeTab === "teammember"
                        ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                        : "text-gray-500"
                        }`}
                      onClick={() => handleTabClick("teammember")}
                    >
                      Team Member
                    </span>
                    <span
                      className={`cursor-pointer ${activeTab === "schedulehistory"
                        ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                        : "text-gray-500"
                        }`}
                      onClick={() => handleTabClick("schedulehistory")}
                    >
                      Schedule History
                    </span>
                  </p>
                </div>
              </div>
              {/* team member tab content */}
              {activeTab === "teammember" && (
                <div>
                  <div className="mx-16 mt-10 grid grid-cols-2">
                    <div className="col-span-1 border-r">
                      <div className="grid grid-cols-4">
                        <div className="col-span-3">
                          <div className="flex mb-5">
                            {/* first name */}
                            <div className="w-1/2">
                              <div className="font-medium">First Name</div>
                            </div>
                            <div className="w-1/2">
                              <p>
                                <span className="font-normal text-gray-500">
                                  {candidate.FirstName}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex mb-5">
                            {/* last name */}
                            <div className="w-1/2">
                              <div className="font-medium">Last Name</div>
                            </div>
                            <div className="w-1/2">
                              <p>
                                <span className="font-normal text-gray-500">
                                  {candidate.LastName}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex mb-5">
                            {/* Email */}
                            <div className="w-1/2">
                              <div className="font-medium">Email</div>
                            </div>
                            <div className="w-1/2">
                              <p>
                                <span className="font-normal text-gray-500">
                                  {candidate.Email}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex mb-5">
                            {/* Phone */}
                            <div className="w-1/2">
                              <div className="font-medium">Phone</div>
                            </div>
                            <div className="w-1/2">
                              <p>
                                <span className="font-normal text-gray-500">
                                  {candidate.Phone}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex mb-5">
                            {/* Company */}
                            <div className="w-1/2">
                              <div className="font-medium">Company</div>
                            </div>
                            <div className="w-1/2">
                              <p>
                                <span className="font-normal text-gray-500">
                                  {candidate.CompanyName}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex mb-5">
                            {/* Technology */}
                            <div className="w-1/2">
                              <div className="font-medium">Technology</div>
                            </div>
                            <div className="w-1/2">
                              <p>
                                <span className="font-normal text-gray-500">
                                  {candidate.Technology}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex mb-5">
                            {/* location */}
                            <div className="w-1/2">
                              <div className="font-medium">Location</div>
                            </div>
                            <div className="w-1/2">
                              <p>
                                <span className="font-normal text-gray-500">
                                  {candidate.Location}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Role */}
                          <div className="flex mb-5">
                            <div className="w-1/2">
                              <div className="font-medium">Role</div>
                            </div>
                            <div className="w-1/2">
                              <p>
                                <span className="font-normal text-gray-500">
                                  {candidate.CurrentRole}
                                </span>
                              </p>
                            </div>
                          </div>
                          {/* Time Zone */}
                          <div className="flex mb-5">
                            <div className="w-1/2">
                              <div className="font-medium">Time Zone</div>
                            </div>
                            <div className="w-1/2">
                              <p>
                                <span className="font-normal text-gray-500">
                                  {candidate.TimeZone}
                                </span>
                              </p>
                            </div>
                          </div>
                          {/* Preffered Duration */}
                          <div className="flex mb-5">
                            <div className="w-1/2">
                              <div className="font-medium">Preferred Duration</div>
                            </div>
                            <div className="w-1/2">
                              <p>
                                <span className="font-normal text-gray-500">
                                  {candidate.PreferredDuration}
                                </span>
                              </p>
                            </div>
                          </div>

                        </div>
                        <div className="col-span-1">
                          <div>
                            <div className="flex justify-end text-center mr-5">
                              <div>
                              {candidate.imageUrl ? (
                                    <img src={candidate.imageUrl} alt="Candidate" className="w-32 h-32 rounded" />
                                  ) : (
                                    candidate.Gender === "Male" ? (
                                      <img src={maleImage} alt="Male Avatar" className="w-32 h-32 rounded" />
                                    ) : candidate.Gender === "Female" ? (
                                      <img src={femaleImage} alt="Female Avatar" className="w-32 h-32 rounded" />
                                    ) : (
                                      <img src={genderlessImage} alt="Other Avatar" className="w-32 h-32 rounded" />
                                    )
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* skills */}
                      <div className="mt-4">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <div
                              htmlFor="experience"
                              className="block text-md font-medium leading-6 text-gray-900 mr-4"
                            >
                              Skill
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <table className="w-full">
                            <tbody>
                              {candidate.skills.map((skillEntry, index) => (
                                <tr key={index}>
                                  <td className="py-5 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                                    {skillEntry.skill}
                                  </td>
                                  <td className="py-5 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                                    {skillEntry.experience}
                                  </td>
                                  <td className="py-5 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                                    {skillEntry.expertise}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    {/* /Availability */}
                    <div className="col-span-1 mb-10">
                      <div className="ml-10 -mt-2 space-y-5">
                        <p className="text-lg font-medium">Availability</p>
                        <div className="mt-2">
                          {availability && availability.length > 0 ? (
                            <div className="space-y-3">
                              {/* Headers */}
                              <div className="flex items-center space-x-4 font-bold">
                                <div className="w-32 ml-10">Day</div>
                                <div className="w-32">Start Time</div>
                                <div className="w-8"></div>
                                <div className="w-32">End Time</div>
                              </div>
                              {daysOfWeek.map((day) => {
                                const slots = getAvailabilityForDay(day);
                                if (slots.length === 0) {
                                  // Display empty boxes if no slots are available
                                  return (
                                    <div key={day} className="flex items-center space-x-6">
                                      <div className="py-2 px-4 w-32 text-center rounded border border-gray-300 text-black">
                                        {day}
                                      </div>
                                      <div className="py-2 px-4 w-32 text-center rounded border border-gray-300 text-gray-300">start time</div>
                                      <div className="w-8 text-center">
                                        <FaMinus className="text-2xl" />
                                      </div>
                                      <div className="py-2 px-4 w-32 text-center rounded border border-gray-300 text-gray-300">end time</div>
                                    </div>
                                  );
                                }
                                // Display day with available slots
                                return (
                                  <React.Fragment key={day}>
                                    {slots.map((slot, index) => (
                                      <div key={index} className="flex items-center space-x-6">
                                        {index === 0 && (
                                          <div className="py-2 px-4 w-32 text-center rounded border border-gray-300">
                                            {day}
                                          </div>
                                        )}
                                        {index > 0 && (
                                          <div className="py-2 px-4 w-32 text-center"></div>
                                        )}
                                        <div className="py-2 px-4 w-32 text-center rounded border border-gray-300">
                                          {new Date(slot.startTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </div>
                                        <div className="w-8 text-center">
                                          <FaMinus className="text-2xl" />
                                        </div>
                                        <div className="py-2 px-4 w-32 text-center rounded border border-gray-300">
                                          {new Date(slot.endTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          ) : (
                            <p>No availability details available.</p>
                          )}
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              )}
              {/* schedulehistory */}
              {activeTab === "schedulehistory" && (
                <div className="mt-7">
                  <table className="text-left w-full border-collapse border-gray-300">
                    <thead className="text-xs border-t border-b bg-gray-300">
                      <tr style={trFontstyle}>
                        <th scope="col" className="py-3 px-6">
                          Candidate Name
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Position
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Schedule Type
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Round Name
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Date&Time
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRows.map((row, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b cursor-pointer"
                        >
                          <td className="py-4 px-6 text-blue-400">
                            <div className="flex">
                              {row.image && (
                                <img
                                  src={row.image}
                                  alt="Candidate"
                                  className="w-10 mr-2 "
                                />
                              )}
                              {row.name}
                            </div>
                          </td>
                          <td className="py-4 px-6  text-blue-400">
                            {row.position}
                          </td>
                          <td className="py-4 px-6">{row.scheduletype}</td>
                          <td className="py-4 px-6">{row.roundname}</td>
                          <td className="py-4 px-6">{row.datetime}</td>
                          <td className="py-4 px-6">{row.Status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {showNewCandidateContent && (
              <EditTeamsForm onClose={handleclose} candidate1={candidate} />
            )}
          </>
        )}
      </div>
    </>
  );
};

// ... existing code ...

const TimePicker = ({ placeholder, type, dayIndex, timeIndex }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let storageKey = "";
    switch (dayIndex) {
      case 0:
        storageKey = "mondayTimes";
        break;
      case 1:
        storageKey = "tuesdayTimes";
        break;
      default:
        storageKey = "defaultTimes";
    }
  }, [dayIndex]);

  const handleTimeChange = (time) => {
    const formattedTime = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    let storageKey = "";
    switch (dayIndex) {
      case 0:
        storageKey = "mondayTimes";
        break;
      case 1:
        storageKey = "tuesdayTimes";
        break;
      default:
        storageKey = "defaultTimes";
    }
    let storedTimes = JSON.parse(localStorage.getItem(storageKey)) || {};
    storedTimes[timeIndex] = storedTimes[timeIndex] || {};

    if (type === "start") {
      storedTimes[timeIndex].start = formattedTime;
    } else {
      storedTimes[timeIndex].end = formattedTime;
    }

    if (storedTimes[timeIndex].start && storedTimes[timeIndex].end) {
      localStorage.setItem(storageKey, JSON.stringify(storedTimes));
      setErrorMessage("");
    } else {
      setErrorMessage("Both start and end times must be selected.");
    }

    setSelectedTime(time);
  };

  return (
    <div className="mx-auto">
      <div className="relative rounded-md shadow-sm w-full">
        <DatePicker
          selected={selectedTime}
          onChange={handleTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          placeholderText={placeholder}
          dateFormat="h:mm aa"
          className="flex justify-center w-full pl-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          style={{ width: "calc(100% - 2.5rem)", color: "#000000" }}
        />
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default TeamDetails;
