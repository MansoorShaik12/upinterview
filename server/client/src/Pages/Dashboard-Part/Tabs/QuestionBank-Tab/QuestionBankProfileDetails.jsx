import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Sidebar from "../QuestionBank-Tab/QuestionBankNewQuestion";
import Editassesmentquestion from "./EditQuestionform";
import { CiStar } from "react-icons/ci";
import QuestionBank from "../QuestionBank-Tab/QuestionBank.jsx";
import axios from "axios";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

const InterviewDetails = ({ questionProfile, onCloseprofile }) => {

  const userId = localStorage.getItem("userId");

  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [setMyQuestions] = useState([]);
  const [favoriteQuestions, setFavoriteQuestions] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isOpen, setIsOpen] = useState({
    interview: false,
    mcq: false,
    shortText: false,
    longText: false,
    programming: false,
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const fetchSuggestedQuestions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/suggestedquestions/${questionProfile.SkillName}`, {
          params: { userId }
        });
        const questions = response.data;
        setSuggestedQuestions(questions);

        const favoriteResponse = await axios.get(`${process.env.REACT_APP_API_URL}/favoritequestions/${userId}`);
        const favoriteQuestionIds = favoriteResponse.data.map(q => q._id);
        setFavoriteQuestions(favoriteQuestionIds);

        console.log("Suggested Questions:", questions);
      } catch (error) {
        console.error('Error fetching suggested questions:', error);
      }
    };

    const fetchMyQuestions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/newquestion/${questionProfile.SkillName}`, {
          params: { createdBy: userId }
        });
        const allQuestions = response.data;

        const filteredQuestions = allQuestions.filter(
          (question) => question.Skill === questionProfile.SkillName
        );

        setMyInterviewQuestions(filteredQuestions.filter(q => q.QuestionType === 'Interview Questions'));
        setMyMCQQuestions(filteredQuestions.filter(q => q.QuestionType === 'MCQ'));
        setMyShortAnswerQuestions(filteredQuestions.filter(q => q.QuestionType === 'Short Text(Single Line)'));
        setMyLongAnswerQuestions(filteredQuestions.filter(q => q.QuestionType === 'Long Text(Paragraph)'));
        setMyProgrammingQuestions(filteredQuestions.filter(q => q.QuestionType === 'Programming'));
      } catch (error) {
        console.error('Error fetching my questions:', error);
      }
    };

    fetchSuggestedQuestions();
    fetchMyQuestions(); // Fetch My Questions
  }, [questionProfile.SkillName, userId]);

  const handleStarClick = async (questionId) => {
    const isFavorite = favoriteQuestions.includes(questionId);
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/suggestedquestions/${questionId}/favorite`, {
        favorite: !isFavorite,
        userId: userId // Include user ID in the request
      });

      if (response.status === 200) {
        if (isFavorite) {
          setFavoriteQuestions(favoriteQuestions.filter((id) => id !== questionId));
        } else {
          setFavoriteQuestions([...favoriteQuestions, questionId]);
        }
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const toggleSection = (section) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleClick = () => {
    setFilled(!filled);
    setShowOnlyFavorites(!showOnlyFavorites);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;


  const renderQuestions = (questions, title, section) => {
    const filteredQuestions = showOnlyFavorites
      ? questions.filter((q) => favoriteQuestions.includes(q._id))
      : questions;

    const favoriteCount = questions.filter((q) => favoriteQuestions.includes(q._id)).length;
    const isDisabled = filteredQuestions.length === 0;


    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
    const indexOfFirstQuestion = (currentPage - 1) * questionsPerPage;
    const indexOfLastQuestion = Math.min(indexOfFirstQuestion + questionsPerPage, filteredQuestions.length);
    const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };


    return (
      <div className="mt-2 text-sm">
        <div className="flex space-x-8 p-2 text-md justify-between items-center bg-gray-100 pr-5 cursor-pointer"
          onClick={() => !isDisabled && toggleSection(section)}>
          <p className="pr-4 ml-2 w-1/4">{title}</p>
          {!showOnlyFavorites && (
            <p className="rounded px-3 py-2 ml-4 border bg-gray-200 cursor-pointer text-center">
              No.of Questions &nbsp; ({filteredQuestions.length})
            </p>
          )}
          <p className="rounded px-3 py-2 ml-4 border bg-gray-200 cursor-pointer text-center">
            No.of Favorite Questions &nbsp; ({favoriteCount})
          </p>
          <div className={`flex items-center text-3xl ml-3 mr-3 ${isDisabled ? 'opacity-20 cursor-not-allowed' : ''}`}>
            {isOpen[section] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>
        </div>
        {isOpen[section] && (
          <div className="p-4" style={{ display: 'block' }}>
            {currentQuestions.map((question, index) => (
              <div key={question._id} className="border border-gray-300 p-3 mb-2">
                <div className="flex items-center">
                  <p className="flex">
                    <span className="text-sm font-semibold" style={{ width: '120px' }}>Question {indexOfFirstQuestion + index + 1} :</span>
                    <span className="opacity-75 text-sm text-gray-800">{question.Question}</span>
                  </p>
                  {favoriteQuestions.includes(question._id) ? (
                    <FaStar
                      className="text-2xl"
                      style={{ marginLeft: 'auto', color: 'green' }}
                      onClick={() => handleStarClick(question._id)}
                    />
                  ) : (
                    <CiStar
                      className="text-2xl"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => handleStarClick(question._id)}
                    />
                  )}
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
                          <li key={idx}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredQuestions.length > questionsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <div
                  className={`ml-3 ${currentPage === 1 ? "invisible" : "visible"} cursor-pointer`}
                  onClick={currentPage > 1 ? handlePreviousPage : undefined}
                >
                  <FaArrowLeft />
                </div>
                <div className="inline-block px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded text-center">
                  <span>
                    {indexOfFirstQuestion + 1}-{indexOfLastQuestion}
                  </span>
                </div>
                <div
                  className={`mr-3 ${currentPage === totalPages ? "invisible" : "visible"} cursor-pointer`}
                  onClick={currentPage < totalPages ? handleNextPage : undefined}
                >
                  <FaArrowRight />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };



  const renderMyQuestions = (questions, title, section) => {
    const isDisabled = questions.length === 0;

    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const indexOfFirstQuestion = (currentPage - 1) * questionsPerPage;
    const indexOfLastQuestion = Math.min(indexOfFirstQuestion + questionsPerPage, questions.length);
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    return (
      <div className="mt-2 text-sm">
        <div className="flex space-x-8 p-2 text-md justify-between items-center bg-gray-100 pr-5 cursor-pointer"
          onClick={() => !isDisabled && toggleSection(section)}>
          <p className="pr-4 ml-2 w-1/4">{title}</p>
          <p className="rounded px-3 py-2 ml-4 border bg-gray-200 cursor-pointer text-center">
            No.of Questions &nbsp; ({questions.length})
          </p>
          <div className={`flex items-center text-3xl ml-3 mr-3 ${isDisabled ? 'opacity-20 cursor-not-allowed' : ''}`}>
            {isOpen[section] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>
        </div>
        {isOpen[section] && (
          <div className="p-4" style={{ display: 'block' }}>
            {currentQuestions.map((question, index) => (
              <div key={question._id} className="border border-gray-300 p-3 mb-2">
                <div className="flex float-right -mt-2 gap-5 text-xl">
                  <p onClick={() => handleEditClick(question)}>
                    <MdModeEditOutline />
                  </p>
                  <p onClick={() => handleDeleteClick(question._id)}>
                    <MdDelete />
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="flex">
                    <span className="text-sm font-semibold" style={{ width: '120px' }}>Question {indexOfFirstQuestion + index + 1} :</span>
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
                          <li key={idx}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {questions.length > questionsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <div
                  className={`ml-3 ${currentPage === 1 ? "invisible" : "visible"} cursor-pointer`}
                  onClick={currentPage > 1 ? handlePreviousPage : undefined}
                >
                  <FaArrowLeft />
                </div>
                <div className="inline-block px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded text-center">
                  <span>
                    {indexOfFirstQuestion + 1}-{indexOfLastQuestion}
                  </span>
                </div>
                <div
                  className={`mr-3 ${currentPage === totalPages ? "invisible" : "visible"} cursor-pointer`}
                  onClick={currentPage < totalPages ? handleNextPage : undefined}
                >
                  <FaArrowRight />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const location = useLocation();
  const candidateData = location.state?.skill;

  const selectedSkill = location.state?.skill?.SkillName;


  const [activeTab, setActiveTab] = useState("My Questions");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const Navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen, { state: { selectedSkill } });
  };

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

  const [showMainContent, setShowMainContent] = useState(true);
  const [showNewCandidateContent, setShowNewCandidateContent] = useState(false);

  const handleclose = () => {
    setShowMainContent(true);
    setShowNewCandidateContent(false);
  };
  const handleaddquestion = () => {
    Navigate("/interviewcq");
  };

  const [totalSuggestedQuestions] = useState(0);

  const [myInterviewQuestions, setMyInterviewQuestions] = useState([]);
  const [myMCQQuestions, setMyMCQQuestions] = useState([]);
  const [myShortAnswerQuestions, setMyShortAnswerQuestions] = useState([]);
  const [myLongAnswerQuestions, setMyLongAnswerQuestions] = useState([]);
  const [myProgrammingQuestions, setMyProgrammingQuestions] = useState([]);

  const handleEditClick = (question) => {
    setShowMainContent(false);
    setShowNewCandidateContent(question);
  };

  const handleDeleteClick = (questionId) => {
    setQuestionToDelete(questionId);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async (confirm) => {
    if (confirm && questionToDelete) {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/newquestion/${questionToDelete}`);
        console.log("Question deleted:", response.data);
        // Update state to remove the deleted question from the list
        setMyQuestions((prevQuestions) => prevQuestions.filter(q => q._id !== questionToDelete));
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
    setShowDeletePopup(false);
    setQuestionToDelete(null);
  };



  return (
    <>
      <div>
        {showMainContent ? (
          <>
            <div className="flex justify-between">
              <p className="text-xl text-blue-300 px-7 font-semibold">
                InterviewQuestion/ {candidateData?.SkillName}
              </p>
              <p
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mr-5 mb-5"
                onClick={handleaddquestion}
              >
                New Question
              </p>
            </div>

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div
                className="bg-white shadow-lg overflow-auto"
                style={{ width: "97%", height: "94%" }}
              >
                <div className="border-b">
                  <div className="mx-8 my-3 flex justify-between items-center">
                    <p className="text-xl">
                      <span className="font-semibold cursor-pointer">
                        Question Bank /{questionProfile.SkillName}
                      </span>
                    </p>
                    {/* Cancel icon */}
                    <button className="shadow-lg rounded-full" onClick={onCloseprofile}>
                      <MdOutlineCancel className="text-2xl" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="mx-16 mt-7 mb-7">
                    <p className="text-xl space-x-10">
                      <span
                        className={`cursor-pointer ${activeTab === "My Questions"
                          ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                          : "text-gray-500"
                          }`}
                        onClick={() => handleTabClick("My Questions")}
                      >
                        My Questions
                      </span>
                      <span
                        className={`cursor-pointer ${activeTab === "Suggested"
                          ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                          : "text-gray-500"
                          }`}
                        onClick={() => handleTabClick("Suggested")}
                      >
                        Suggested Questions
                      </span>
                    </p>
                  </div>

                  {activeTab === "My Questions" && (
                    <div>
                      <div className="float-end -mt-14 mr-5">
                        <button className="shadow rounded p-2 text-md mr-5" onClick={toggleSidebar}>
                          <span className="text-blue-500">New Question</span>
                          <Sidebar
                            isOpen={sidebarOpen}
                            onClose={closeSidebar}
                            onOutsideClick={handleOutsideClick}
                            ref={sidebarRef}
                            questionProfile={questionProfile}
                          />
                        </button>
                      </div>
                      {renderMyQuestions(myInterviewQuestions, "Interview Questions", "myInterviewQuestions")}
                      {renderMyQuestions(myMCQQuestions, "MCQ Questions", "myMCQQuestions")}
                      {renderMyQuestions(myShortAnswerQuestions, "Short Text (Single Line) Questions", "myShortAnswerQuestions")}
                      {renderMyQuestions(myLongAnswerQuestions, "Long Text (Paragraph) Questions", "myLongAnswerQuestions")}
                      {renderMyQuestions(myProgrammingQuestions, "Programming Questions", "myProgrammingQuestions")}
                    </div>
                  )}

                  {activeTab === "Suggested" && (
                    <>
                      <div className="float-end -mt-14 mr-5">
                        <button className="rounded p-2 text-xl" onClick={handleClick}>
                          <FaStar color={filled ? "green" : "black"} style={{ cursor: "pointer" }} />
                        </button>
                      </div>
                      <div>
                        {renderQuestions(
                          suggestedQuestions.filter(q => q.QuestionType === "Interview Questions"),
                          "Interview Questions",
                          "interview"
                        )}
                        {renderQuestions(
                          suggestedQuestions.filter(q => q.QuestionType === "MCQ"),
                          "MCQ Questions",
                          "mcq"
                        )}
                        {renderQuestions(
                          suggestedQuestions.filter(q => q.QuestionType === "Short Text(Single Line)"),
                          "Short Text (Single Line) Questions",
                          "shortText"
                        )}
                        {renderQuestions(
                          suggestedQuestions.filter(q => q.QuestionType === "Long Text(Paragraph)"),
                          "Long Text (Paragraph) Questions",
                          "longText"
                        )}
                        {renderQuestions(
                          suggestedQuestions.filter(q => q.QuestionType === "Programming"),
                          "Programming Questions",
                          "programming"
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {showNewCandidateContent && (
              <Editassesmentquestion
                onClose={handleclose}
                question={showNewCandidateContent}
              />
            )}
          </>
        )}
      </div>

      {totalSuggestedQuestions && <QuestionBank totalSuggestedQuestions={totalSuggestedQuestions} />}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <p>Are you sure you want to delete this question?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleDeleteConfirm(true)}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => handleDeleteConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

};

export default InterviewDetails;
