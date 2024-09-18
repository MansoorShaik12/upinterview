import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import EditAssesmentForm from "./EditAssessment";
import axios from 'axios';
import { MdMoreHoriz } from "react-icons/md";
import { MdOutlineImageNotSupported } from "react-icons/md";


const AssessmentProfileDetails = ({ assessment, onCloseprofile }) => {
  const location = useLocation();
  useEffect(() => {
    document.title = "AssessmentProfileDetails";
  }, []);
  const navigate = useNavigate();
  const [showMainContent, setShowMainContent] = useState(true);
  const [showNewCandidateContent, setShowNewCandidateContent] = useState(false)

  const handleEditClick = (assessment) => {
    setShowMainContent(false);
    setShowNewCandidateContent(true);
  };

  const handleClose = () => {
    setShowMainContent(true);
    setShowNewCandidateContent(false);
  };

  const [activeTab, setActiveTab] = useState("assessment");

  const handleNavigate = () => {
    navigate("/assessment", { state: { assessment } });
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const formData = location.state?.formData;
  const selectedPosition = formData?.position;
  const [setPositionTitle] = useState("");

  const fetchPositionDetails = useCallback(async () => {
    try {
      const response = await fetch(`YOUR_API_ENDPOINT/${selectedPosition}`);
      const data = await response.json();
      setPositionTitle(data.title);
    } catch (error) {
      console.error("Error fetching position details:", error);
    }
  }, [selectedPosition, setPositionTitle]);

  useEffect(() => {
    if (selectedPosition) {
      fetchPositionDetails();
    }
  }, [selectedPosition, fetchPositionDetails]);

  const [arrowStates, setArrowStates] = useState([]);

  const toggleArrow = (index) => {
    setArrowStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          question: "OOP",
          type: "MCQ",
          difficulty: "Easy",
          options: ["A", "B", "C"],
          answer: "A",
        },
      ];
      setArrowStates(new Array(data.length).fill(false));
    };

    fetchData();
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

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

  const [candidatesData, setCandidatesData] = useState([]);
  useEffect(() => {
    const fetchCandidatesData = async () => {
      try {
        const candidatePromises = assessment.CandidateIds.map(candidateId =>
          axios.get(`${process.env.REACT_APP_API_URL}/candidate/${candidateId}`)
        );
        const candidatesResponses = await Promise.all(candidatePromises);
        const candidates = candidatesResponses.map(response => response.data);
        setCandidatesData(candidates);
      } catch (error) {
        console.error('Error fetching candidate data:', error);
      }
    };

    if (assessment.CandidateIds && assessment.CandidateIds.length > 0) {
      fetchCandidatesData();
    }
  }, [assessment.CandidateIds]);


  const [actionViewMore] = useState({});


  const renderQuestions = (assessment, arrowStates, toggleArrow) => {
    const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

    return assessment.Sections.map((section, index) => {
      const isDisabled = section.Questions.length === 0;

      return (
        <div key={index} className="mt-5 text-sm">
          <div className="flex space-x-8 p-2 text-md justify-between items-center bg-gray-100 pr-5 cursor-pointer"
            onClick={() => !isDisabled && toggleArrow(index)}>
            <p className="pr-4 ml-2 w-1/4">{section.SectionName}</p>
            <p className="rounded px-3 py-2 ml-4 border bg-gray-200 cursor-pointer text-center">
              No.of Questions &nbsp; ({section.Questions.length})
            </p>
            <div className={`flex items-center text-3xl ml-3 mr-3 ${isDisabled ? 'opacity-20 cursor-not-allowed' : ''}`}>
              {arrowStates[index] ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
          </div>
          {arrowStates[index] && (
            <div className="p-4" style={{ display: 'block' }}>
              {section.Questions.map((question, qIndex) => (
                <div key={question._id} className="border border-gray-300 p-3 mb-2">
                  <div className="flex items-center">
                    <p className="flex">
                      <span className="text-sm font-semibold" style={{ width: '120px' }}>Question {qIndex + 1} :</span>
                      <span className="opacity-75 text-sm text-gray-800">{question.Question}</span>
                    </p>
                  </div>
                  <div className="flex justify-between pr-20">
                    <p className="flex">
                      <span className="text-sm font-semibold" style={{ width: '120px' }}>Question Type: </span>
                      <span className="opacity-75 text-sm text-gray-800">{question.QuestionType}</span>
                    </p>
                    <p className="flex">
                      <span className="text-sm font-semibold" style={{ width: '100px' }}>Difficulty: </span>
                      <span className="opacity-75 text-sm text-gray-800" style={{ minWidth: '100px', textAlign: 'left' }}>{question.DifficultyLevel}</span>
                    </p>
                    <p className="flex">
                      <span className="text-sm font-semibold" style={{ width: '80px' }}>Score: </span>
                      <span className="opacity-75 text-sm text-gray-800" style={{ minWidth: '100px', textAlign: 'left' }}> {question.Score}</span>
                    </p>
                  </div>
                  {question.QuestionType === 'Programming Questions' ? (
                    <div>
                      <p className="flex">
                        <span className="text-sm font-semibold" style={{ width: '120px' }}>Language: </span>
                        <span className="opacity-75 text-sm text-gray-800">{question.ProgrammingDetails[0]?.language}</span>
                      </p>
                      <p className="flex">
                        <span className="text-sm font-semibold" style={{ width: '120px' }}>Code: </span>
                        <span className="opacity-75 text-sm text-gray-800"><pre>{question.ProgrammingDetails[0]?.code}</pre></span>
                      </p>
                      {question.ProgrammingDetails[0]?.testCases && (
                        <div className="flex mb-2">
                          <div className="font-medium w-28" style={{ width: '120px' }}>Test Cases: </div>
                          <div className="opacity-75">
                            <ul>
                              {question.ProgrammingDetails[0].testCases.map((testCase, idx) => (
                                <li key={idx}>
                                  <strong>{testCase.name}:</strong> Input: {testCase.input}, Output: {testCase.output}, Marks: {testCase.marks}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="flex">
                        <span className="text-sm font-semibold" style={{ width: '120px' }}>Answer: </span>
                        <span className="opacity-75 text-sm text-gray-800">{question.Answer}</span>
                      </p>
                      {question.QuestionType === 'MCQ' && question.Options && (
                        <div className="flex mb-2">
                          <div className="font-medium w-28" style={{ width: '120px' }}>Options: </div>
                          <div className="opacity-75">
                            <ul>
                              {question.Options.map((option, idx) => (
                                <li key={idx}>{optionLetters[idx]}. {option}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
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
              <div className="border-b">
                <div className="mx-8 my-3">
                  <p className="text-xl flex justify-between items-center">
                    <span
                      className="text-orange-500 font-semibold cursor-pointer"
                      onClick={handleNavigate}
                    >
                      Assessment /{" "}
                      <span className="text-gray-400">
                        {assessment.AssessmentTitle}
                      </span>
                    </span>
                    <button
                      className="shadow-lg rounded-full"
                      onClick={onCloseprofile}
                    >
                      <MdOutlineCancel className="text-2xl" />
                    </button>
                  </p>
                </div>
              </div>

              <div>
                <div className="mx-14 mt-3">
                  <p className="text-xl space-x-10">
                    <span
                      className={`cursor-pointer ${activeTab === "assessment"
                        ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                        : "text-gray-500"
                        }`}
                      onClick={() => handleTabClick("assessment")}
                    >
                      Assessment
                    </span>
                    <span
                      className={`cursor-pointer ${activeTab === "Questions"
                        ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                        : "text-gray-500"
                        }`}
                      onClick={() => handleTabClick("Questions")}
                    >
                      Questions
                    </span>
                    <span
                      className={`cursor-pointer ${activeTab === "Candidates"
                        ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                        : "text-gray-500"
                        }`}
                      onClick={() => handleTabClick("Candidates")}
                    >
                      Candidates
                    </span>
                    <span
                      className={`cursor-pointer ${activeTab === "Results"
                        ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                        : "text-gray-500"
                        }`}
                      onClick={() => handleTabClick("Results")}
                    >
                      Results
                    </span>
                  </p>
                </div>
              </div>
              {activeTab === "assessment" && (
                <div>
                  <div className="float-right -mt-16">
                    <button
                      className=" text-gray-500 mr-7"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mx-16 mt-10">
                    <div className="flex mb-5">
                      <div className="w-1/4">
                        <div className="font-medium">Assessment Name</div>
                      </div>
                      <div className="w-1/4">
                        <p>
                          <span className="font-normal">
                            {" "}
                            {assessment.AssessmentTitle}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex mb-5">
                      <div className="w-1/4">
                        <div className="font-medium">Assessment Type</div>
                      </div>
                      <div className="w-1/4">
                        <p>
                          <span className="font-normal">
                            {assessment.AssessmentType.map((type, index) => (
                              <div key={index}>{type}{index < assessment.AssessmentType.length - 1 ? ' ,' : ''}</div>
                            ))}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex mb-5">
                      <div className="w-1/4">
                        <div className="font-medium">Position</div>
                      </div>
                      <div className="w-1/3">
                        <p>
                          <span className="font-normal">
                            {" "}
                            {assessment.Position}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex mb-5">
                      <div className="w-1/4">
                        <div className="font-medium">Duration</div>
                      </div>
                      <div className="w-1/3">
                        <p>
                          <span className="font-normal">
                            {" "}
                            {assessment.Duration}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-5">
                      <div className="w-1/4">
                        <div className="font-medium">Difficulty Level</div>
                      </div>
                      <div className="w-1/4">
                        <p>
                          <span className="font-normal">
                            {" "}
                            {assessment.DifficultyLevel}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-5">
                      <div className="w-1/4">
                        <div className="font-medium">Expiry Date</div>
                      </div>
                      <div className="w-1/3">
                        <p>
                          <span className="font-normal">
                            {" "}
                            {new Date(assessment.ExpiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Questions" && (
                <>
                  {renderQuestions(assessment, arrowStates, toggleArrow)}
                </>
              )}

              {activeTab === "Candidates" && (
                <div className="relative mt-5">
                  <div className="overflow-y-auto min-h-80 max-h-96">
                    <table className="text-left w-full border-collapse border-gray-300 mb-14">
                      <thead className="bg-gray-300 sticky top-0 z-10 text-xs">
                        <tr>
                          <th scope="col" className="py-3 px-6">Candidate Name</th>
                          <th scope="col" className="py-3 px-6">Email</th>
                          <th scope="col" className="py-3 px-6">Phone</th>
                          <th scope="col" className="py-3 px-6">Higher Qualification</th>
                          <th scope="col" className="py-3 px-6">Current Experience</th>
                          <th scope="col" className="py-3 px-6">Skills/Technology</th>
                          <th scope="col" className="py-3 px-6">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidatesData.length > 0 ? (
                          candidatesData.map((candidate) => (
                            <tr key={candidate._id} className="bg-white border-b cursor-pointer text-xs">
                              <td className="py-2 px-6 text-blue-400">
                                <div className="flex items-center gap-3">
                                  {candidate.imageUrl ? (
                                    <img src={candidate.imageUrl} alt="Candidate" className="w-7 h-7 rounded" />
                                  ) : (
                                    <MdOutlineImageNotSupported className="w-7 h-7 text-gray-900" alt="Default" />
                                  )}
                                  {candidate.LastName}
                                </div>
                              </td>
                              <td className="py-2 px-6">{candidate.Email}</td>
                              <td className="py-2 px-6">{candidate.Phone}</td>
                              <td className="py-2 px-6">{candidate.HigherQualification}</td>
                              <td className="py-2 px-6">{candidate.CurrentExperience}</td>
                              <td className="py-2 px-6">
                                {candidate.skills.map((skillEntry, index) => (
                                  <div key={index}>
                                    {skillEntry.skill}{index < candidate.skills.length - 1 && ', '}
                                  </div>
                                ))}
                              </td>
                              <td className="py-2 px-6 relative">
                                <button>
                                  <MdMoreHoriz className="text-3xl" />
                                </button>
                                {actionViewMore === candidate._id && (
                                  <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2 popup">
                                    <div className="space-y-1">
                                      <p className="hover:bg-gray-200 p-1 rounded pl-3">View</p>
                                      <p className="hover:bg-gray-200 p-1 rounded pl-3">Edit</p>
                                      <p className="hover:bg-gray-200 p-1 rounded pl-3">Schedule</p>
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="py-10 text-center">
                              <p className="text-lg font-normal">No Candidates Selected</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === "Results" && (
                <div>
                  <table className="text-left w-full border-collapse border-gray-300 mt-10">
                    <thead className="text-xs border-t border-b bg-orange-50">
                      <tr>
                        <th scope="col" className="py-3 px-6">
                          Candidate Name
                        </th>
                        <th scope="col" className="py-3 px-6">
                          No.Of Answered Questions
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Duration
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Progress Score/Total Score
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Test Date
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Action
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>

              )}
            </div>
          </div>
        ) : (
          <>
            {showNewCandidateContent && (
              <EditAssesmentForm
                onClose={handleClose}
                assessmentId={assessment._id}
                candidate1={assessment}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AssessmentProfileDetails;