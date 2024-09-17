import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import maleImage from '../../../Dashboard-Part/Images/man.png';
import femaleImage from '../../../Dashboard-Part/Images/woman.png';
import genderlessImage from '../../../Dashboard-Part/Images/transgender.png';
import axios from "axios";
import { format } from 'date-fns';
import EditCandidateForm from "./EditCandidate";

const CandidateDetails = ({ candidate, onCloseprofile }) => {
  useEffect(() => {
    document.title = "Candidate Profile Details";
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("candidate");
  const handleNavigate = () => {
    navigate("/candidate", { state: { candidate } });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const formData = location.state?.formData;
  const selectedPosition = formData?.position;

  useEffect(() => {
    const fetchPositionDetails = async () => {
      try {
        const response = await fetch(`YOUR_API_ENDPOINT/${selectedPosition}`);
        console.log(response);
      } catch (error) {
        console.error("Error fetching position details:", error);
      }
    };

    if (selectedPosition) {
      fetchPositionDetails();
    }
  }, [selectedPosition]);

  const [isArrowUp, setIsArrowUp] = useState(false);

  const toggleArrow = () => {
    setIsArrowUp(!isArrowUp);
  };

  const currentRows = [
    {
      id: 1,
      name: "John Doe",
      duration: "45minutes",
      scheduletype: "Face-to-Face",
      roundname: "Technical Interview",
      datetime: "13-3-2024, 11:30",
      Status: "Selected",
    },
    {
      id: 2,
      name: "Jane Smith",
      duration: "60 minutes",
      scheduletype: "Remote",
      roundname: "Data Skills Assessment",
      datetime: "15-3-2024, 09:00",
      Status: "Interviewed",
    },
    {
      id: 3,
      name: "Alice Johnson",
      duration: "30 minutes",
      scheduletype: "Online",
      roundname: "Coding Challenge",
      datetime: "20-3-2024, 14:00",
      Status: "Cancelled",
    },
    {
      id: 4,
      name: "Robert Lee",
      duration: "15 minutes",
      scheduletype: "In-Person",
      roundname: "Management Interview",
      datetime: "18-3-2024, 16:00",
      Status: "Rejected",
    },
  ];

  const [isArrowUp2, setIsArrowUp2] = useState(true);
  const trFontstyle = {
    fontSize: "14px",
  };
  const toggleArrow2 = () => {
    setIsArrowUp2(!isArrowUp2);
  };

  const [isArrowUp3, setIsArrowUp3] = useState(
    Array(currentRows.length).fill(false)
  );
  const toggleArrow3 = (index) => {
    const updatedArrows = [...isArrowUp3];
    updatedArrows[index] = !updatedArrows[index];
    setIsArrowUp3(updatedArrows);
  };

  const [isArrowUp4, setIsArrowUp4] = useState(
    Array(currentRows.length).fill(false)
  );
  const toggleArrow4 = (index) => {
    const updatedArrows = [...isArrowUp4];
    updatedArrows[index] = !updatedArrows[index];
    setIsArrowUp4(updatedArrows);
  };

  const [showMainContent, setShowMainContent] = useState(true);
  const [showNewCandidateContent, setShowNewCandidateContent] = useState(false);

  const handleEditClick = (candidate) => {
    setShowMainContent(false);
    setShowNewCandidateContent({ state: { candidate } });
  };
  const handleclose = () => {
    setShowMainContent(true);
    setShowNewCandidateContent(false);
  };

  const [positionData, setPositionData] = useState(null);
  const selectedPositionId = candidate.PositionId;

  useEffect(() => {
    if (selectedPositionId) {
      const fetchPositionData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/position/${selectedPositionId}`
          );
          setPositionData(response.data);
        } catch (error) {
          console.error("Error fetching detailed position data:", error);
        }
      };

      fetchPositionData();
    }
  }, [selectedPositionId]);
  const formattedDateOfBirth = candidate.Date_Of_Birth
  ? format(new Date(candidate.Date_Of_Birth), 'dd-MM-yyyy')
  : '';

  return (
    <>
      <div>
        {showMainContent ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className="bg-white shadow-lg overflow-auto"
              style={{ width: "97%", height: "94%" }}
            >
              <div className="border-b p-2">
                <div className="mx-8 my-3 flex justify-between items-center">
                  <p className="text-xl">
                    <span
                      className="text-orange-500 font-semibold cursor-pointer"
                      onClick={handleNavigate}
                    >
                      Candidate
                    </span>{" "}
                    / {candidate.LastName}
                  </p>
                  <button
                    className="shadow-lg rounded-full"
                    onClick={onCloseprofile}
                  >
                    <MdOutlineCancel className="text-2xl" />
                  </button>
                </div>
              </div>
              <div>
                <div className="mx-10 pt-5 pb-2">
                  <p className="text-xl space-x-10">
                    <span
                      className={`cursor-pointer ${
                        activeTab === "candidate"
                          ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                          : "text-gray-500"
                      }`}
                      onClick={() => handleTabClick("candidate")}
                    >
                      Candidate
                    </span>
                    <span
                      className={`cursor-pointer ${
                        activeTab === "position"
                          ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                          : "text-gray-500"
                      }`}
                      onClick={() => handleTabClick("position")}
                    >
                      Positions
                    </span>
                    <span
                      className={`cursor-pointer ${
                        activeTab === "schedule"
                          ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                          : "text-gray-500"
                      }`}
                      onClick={() => handleTabClick("schedule")}
                    >
                      Schedule History
                    </span>
                  </p>
                </div>
              </div>
              {activeTab === "candidate" && (
                <>
                  <div className="flex float-end -mt-7">
                    <button
                      className=" text-gray-500 mr-7"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                    <button className=" text-gray-500 mr-7">Schedule</button>
                  </div>

                  <div className="mx-16 mt-7 grid grid-cols-4">
                    <div className="col-span-3">
                      <div className="flex mb-5">
                        <div className="w-1/3">
                          <div className="font-medium">First Name</div>
                        </div>
                        <div className="w-1/3">
                          <p>
                            <span className="font-normal text-gray-500">
                              {candidate.FirstName}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex mb-5">
                        <div className="w-1/3">
                          <div className="font-medium">Last Name</div>
                        </div>
                        <div className="w-1/3">
                          <p>
                            <span className="font-normal text-gray-500">
                              {candidate.LastName}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex mb-5">
                        <div className="w-1/3">
                          <div className="font-medium">Email</div>
                        </div>
                        <div className="w-1/3">
                          <p>
                            <span className="font-normal text-gray-500">
                              {candidate.Email}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex mb-5">
                        <div className="w-1/3">
                          <div className="font-medium">Phone</div>
                        </div>
                        <div className="w-1/3">
                          <p>
                            <span className="font-normal text-gray-500">
                              {candidate.Phone}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex mb-5">
                        <div className="w-1/3">
                          <div className="font-medium">Date-of-Birth</div>
                        </div>
                        <div className="w-1/3">
                          <p>
                            <span className="font-normal text-gray-500">
                            {formattedDateOfBirth}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex mb-5">
                        <div className="w-1/3">
                          <div className="font-medium">Gender</div>
                        </div>
                        <div className="w-1/3">
                          <p>
                            <span className="font-normal text-gray-500">
                              {candidate.Gender}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex mb-5">
                        <div className="w-1/3">
                          <div className="font-medium">
                            Higher Qualification
                          </div>
                        </div>
                        <div className="w-1/3">
                          <p>
                            <span className="font-normal text-gray-500">
                              {candidate.HigherQualification}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex mb-5">
                        <div className="w-1/3">
                          <div className="font-medium">University/College</div>
                        </div>
                        <div className="w-1/3">
                          <p>
                            <span className="font-normal text-gray-500">
                              {candidate.UniversityCollege}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex mb-5">
                        <div className="w-1/3">
                          <div className="font-medium">Current Experience</div>
                        </div>
                        <div className="w-1/3">
                          <p>
                            <span className="font-normal text-gray-500">
                              {candidate.CurrentExperience}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-5">
                        <div className="w-1/3">
                          <div className="font-medium">Position</div>
                        </div>
                        <div className="w-1/3">
                          <p>
                            <span className="font-normal text-gray-500">
                              {candidate.Position}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <div>
                        <div className="flex justify-end text-center">
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
                  <div className="mb-5">
                    <div className="mt-4 mx-16">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div
                            htmlFor="experience"
                            className="block text-lg font-medium leading-6 text-gray-900 mr-4"
                          >
                            Skills
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 font-medium text-xs text-gray-900 dark:text-gray-400">
                        <table className="min-w-full divide-y divide-gray-200">
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
                </>
              )}

              {activeTab === "position" && (
                <div>
                  {positionData && (
                    <div className="mt-7 ">
                      <div className="flex space-x-8 p-2 text-md justify-between items-center bg-gray-100 pr-5">
                        <p className="pr-4 ml-8 w-1/4 font-medium">{positionData.title}</p>
                        <p className="rounded px-2 ml-4 text-center font-medium">
                          {positionData.companyname}
                        </p>
                        <div
                          className="flex items-center text-3xl ml-3 mr-3"
                          onClick={toggleArrow}
                        >
                          {isArrowUp ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </div>
                      </div>
                      <div
                        className="p-4"
                        style={{ display: isArrowUp ? "block" : "none" }}
                      >
                        <div className="border border-gray-300 p-3 mb-2">
                          <div className="mt-2 mb-2 ml-3">
                            <div className="flex flex-col mt-1 mb-2">
                              <div className="flex justify-between items-center mb-5">
                                <div className="flex">
                                  <span className="text-md font-semibold">
                                    Title:{" "}
                                  </span>
                                  <p className="ml-52">{positionData.title}</p>
                                </div>
                                <div className="flex mr-80">
                                  <span className="text-md font-semibold">
                                    Company Name:{" "}
                                  </span>
                                  <p className="ml-2">
                                    {positionData.companyname}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mb-5">
                                <div className="flex">
                                  <span className="text-md font-semibold">
                                    Experience:{" "}
                                  </span>
                                  <p className="ml-40">
                                  {positionData.minexperience} to {positionData.maxexperience} years
                                  </p>
                                </div>
                              </div>

                              <div className="flex mb-2">
                                <span className="text-md font-semibold">
                                  Job Description:{" "}
                                </span>
                                <p className="ml-32">
                                  {positionData.jobdescription}
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Skills */}
                          <div className="mb-3">
                            <div className="mt-4 mx-3">
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <div
                                    htmlFor="skills"
                                    className="block text-md font-medium text-gray-900 mr-20"
                                  >
                                    Skills
                                  </div>
                                </div>
                              </div>
                              <div className="mt-1 font-medium text-xs text-gray-900 dark:text-gray-400">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <tbody>
                                    {positionData.skills.map((skill, index) => (
                                      <tr key={index}>
                                        <td className="py-5 text-left  w-96 text-md font-medium text-gray-500 uppercase tracking-wider">
                                          {skill.skill}
                                        </td>
                                        <td className="py-5 text-left  w-96 text-md font-medium text-gray-500 uppercase tracking-wider">
                                          {skill.experience}
                                        </td>
                                        <td className="py-5 text-left  text-md font-medium text-gray-500 uppercase tracking-wider">
                                          {skill.expertise}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          {/* Rounds */}
                          <div className="mb-5">
                          <div className="mx-3">
                              <div className="flex justify-between">
                                <div
                                  htmlFor="rounds"
                                  className="block text-md font-medium text-gray-900 mr-20"
                                >
                                  Rounds
                                </div>
                              </div>
                              <div className="mt-1 font-medium text-xs text-gray-900 dark:text-gray-400">
                                <table className="divide-gray-200">
                                  <tbody>
                                    {positionData.rounds.map(
                                      (roundEntry, index) => (
                                        <tr key={index}>
                                          <td className="py-5 text-left w-96 text-md font-medium text-gray-500 uppercase tracking-wider">
                                            {roundEntry.round}
                                          </td>
                                          <td className="py-5 text-left w-96 text-md font-medium text-gray-500 uppercase tracking-wider">
                                            {roundEntry.mode}
                                          </td>
                                          <td className="py-5 text-left w-96 text-md font-medium text-gray-500 uppercase tracking-wider">
                                            {roundEntry.duration}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          <div className="flex mb-2">
  <span className="text-md font-semibold">
    Additional Notes:{" "}
  </span>
  <p className="ml-32">
    {positionData.additionalnotes}
  </p>
</div>

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "schedule" && (
                <div>
                  <div className="mt-7">
                    <div className="flex space-x-8 p-2 text-md justify-between items-center bg-gray-100 pr-5">
                      <p className="pr-4 ml-2 w-1/4">Full stack developer</p>
                      <p className="rounded px-2 ml-4 text-center">Accenture</p>
                      <div
                        className="flex items-center text-3xl ml-3 mr-3"
                        onClick={toggleArrow2}
                      >
                        {isArrowUp2 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                      </div>
                    </div>

                    <div
                      className="p-4"
                      style={{ display: isArrowUp2 ? "block" : "none" }}
                    >
                      <div className="border border-gray-300  mb-2">
                        <table className="text-left w-full border-collapse border-gray-300">
                          <thead className="text-xs border-t border-b bg-sky-300">
                            <tr style={trFontstyle}>
                              <th scope="col" className="py-3 px-6">
                                Schedule Type
                              </th>
                              <th scope="col" className="py-3 px-6">
                                Round Name
                              </th>

                              <th scope="col" className="py-3 px-6">
                                Interviewer
                              </th>
                              <th scope="col" className="py-3 px-6">
                                Date&Time
                              </th>
                              <th scope="col" className="py-3 px-6">
                                Duration
                              </th>
                              <th scope="col" className="py-3 px-6">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentRows.map((row, index) => (
                              <React.Fragment key={index}>
                                <tr className="bg-white border-b cursor-pointer">
                                  <td className="py-1 px-6 ">
                                    {row.scheduletype}
                                  </td>
                                  <td className="py-1 px-6">{row.roundname}</td>
                                  <td className="py-1 px-6">{row.name}</td>
                                  <td className="py-1 px-6">{row.datetime}</td>
                                  <td className="py-1 px-6">{row.duration}</td>
                                  <td className="py-1 px-6 relative">
                                    <div
                                      className={`py-2 rounded-full text-center ${
                                        row.Status === "Cancelled"
                                          ? "bg-red-500"
                                          : row.Status === "Interviewed"
                                          ? "bg-yellow-300"
                                          : row.Status === "Selected"
                                          ? "bg-green-300"
                                          : "bg-orange-300"
                                      }`}
                                    >
                                      {row.Status}
                                      {row.Status === "Selected" && (
                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                          <div
                                            className="text-3xl"
                                            onClick={() => toggleArrow3(index)}
                                          >
                                            {isArrowUp3[index] ? (
                                              <IoIosArrowUp />
                                            ) : (
                                              <IoIosArrowDown />
                                            )}
                                          </div>
                                        </span>
                                      )}
                                      {row.Status === "Rejected" && (
                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                          <div
                                            className="text-3xl"
                                            onClick={() => toggleArrow4(index)}
                                          >
                                            {isArrowUp4[index] ? (
                                              <IoIosArrowUp />
                                            ) : (
                                              <IoIosArrowDown />
                                            )}
                                          </div>
                                        </span>
                                      )}
                                      +
                                    </div>
                                  </td>
                                </tr>
                                {row.Status === "Selected" && (
                                  <tr>
                                    <td colSpan="6">
                                      <div
                                        className="p-4"
                                        style={{
                                          display: isArrowUp3[index]
                                            ? "block"
                                            : "none",
                                        }}
                                      >
                                        <div className=" p-3 mb-2">
                                          <p>
                                            <span className="text-md font-semibold">
                                              Feedback:
                                            </span>
                                            [Candidate's Name] excels in both
                                            front-end and back-end development,
                                            showcasing expertise in HTML, CSS,
                                            JavaScript, React.js, Node.js, and
                                            Express.js. Their strong
                                            problem-solving and collaboration
                                            skills make them a valuable asset
                                            for our development team as a
                                            Full-stack Developer.
                                          </p>
                                          <p>
                                            <span className="text-md font-semibold">
                                              Follow-up Actions:
                                            </span>
                                            scheduling another round
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}

                                {row.Status === "Rejected" && (
                                  <tr>
                                    <td colSpan="6">
                                      <div
                                        className="p-4"
                                        style={{
                                          display: isArrowUp4[index]
                                            ? "block"
                                            : "none",
                                        }}
                                      >
                                        <div className=" p-3 mb-2">
                                          <p>
                                            <span className="text-md font-semibold">
                                              Feedback:
                                            </span>
                                            Rejected
                                          </p>
                                          <p>
                                            <span className="text-md font-semibold">
                                              Follow-up Actions:
                                            </span>
                                            Will mail be delivered by
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {showNewCandidateContent && (
              <EditCandidateForm onClose={handleclose} candidate1={candidate} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CandidateDetails;
