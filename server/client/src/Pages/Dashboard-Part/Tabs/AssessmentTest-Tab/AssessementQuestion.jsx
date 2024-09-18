import React, { useState, useEffect } from "react";
import image2 from "../../../Dashboard-Part/Images/image2.png";
import { useLocation, useNavigate } from "react-router-dom";

const AssessmentQuestion = () => {
  const [assessment, setAssessment] = useState(null);
  const [selectedSection, setSelectedSection] = useState(0);
  const [showMainContent, setShowMainContent] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [answerLater, setAnswerLater] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditingFromPreview, setIsEditingFromPreview] = useState(false);
  const [showSectionContent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    const assessmentData = location.state?.assessment;
    console.log('Assessment Data:', assessmentData);

    if (assessmentData) {
      setAssessment(assessmentData);
      setSelectedOptions(new Array(assessmentData.Sections.length).fill([]).map(() => []));
      setAnswerLater(new Array(assessmentData.Sections.length).fill([]).map(() => []));
    } else {
      console.error('No assessment data found in state');
      navigate("/error");
    }
  }, [location.state, navigate]);

  const handleStartClick = () => {
    setShowQuestions(true);
    setCurrentQuestionIndex(0);
  };

  const handleRunClick = async () => {
  const question = assessment.Sections[selectedSection].Questions[currentQuestionIndex];
  const code = selectedOptions[selectedSection][currentQuestionIndex];
  const language = selectedLanguage;

  try {
    const response = await fetch('/run-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language, testCases: question.ProgrammingDetails[0].testCases }),
    });

    const result = await response.json();
    if (response.ok) {
      // Display the result
      console.log('Test cases result:', result);
    } else {
      setErrorMessage(result.error);
    }
  } catch (error) {
    setErrorMessage('Error running the code');
  }
  };
  
  const handleNextClick = () => {
    if (answerLater[selectedSection][currentQuestionIndex] || selectedOptions[selectedSection][currentQuestionIndex]) {
      if (currentQuestionIndex < assessment.Sections[selectedSection].Questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setErrorMessage(""); // Clear the error message
      } else if (selectedSection < assessment.Sections.length - 1) {
        setSelectedSection(selectedSection + 1);
        setCurrentQuestionIndex(0);
        setErrorMessage(""); // Clear the error message
      } else {
        setShowPreview(true);
        setShowQuestions(false);
      }
    } else {
      setErrorMessage("Please answer the question or check 'Answer at a later time'");
    }
  };

  const handlePrevClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setErrorMessage(""); // Clear the error message
    } else if (selectedSection > 0) {
      setSelectedSection(selectedSection - 1);
      setCurrentQuestionIndex(assessment.Sections[selectedSection - 1].Questions.length - 1);
      setErrorMessage(""); // Clear the error message
    }
  };

  const handleInputChange = (value) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[selectedSection][currentQuestionIndex] = value;
    setSelectedOptions(newSelectedOptions);

    // Uncheck and disable the checkbox if an answer is provided
    const newAnswerLater = [...answerLater];
    newAnswerLater[selectedSection][currentQuestionIndex] = false;
    setAnswerLater(newAnswerLater);

    setErrorMessage(""); // Clear the error message on input change
  };

  const handleCheckboxChange = () => {
    const newAnswerLater = [...answerLater];
    newAnswerLater[selectedSection][currentQuestionIndex] = !newAnswerLater[selectedSection][currentQuestionIndex];
    setAnswerLater(newAnswerLater);
    setErrorMessage(""); // Clear the error message on checkbox change
  };

  const handleFinishClick = () => {
    if (answerLater[selectedSection][currentQuestionIndex] || selectedOptions[selectedSection][currentQuestionIndex]) {
      setShowPreview(true);
      setShowQuestions(false);
      setIsEditingFromPreview(false);
      setErrorMessage(""); // Clear the error message
    } else {
      setErrorMessage("Please answer the question or check 'Answer at a later time'");
    }
  };

  const renderQuestion = () => {
    if (!assessment || selectedSection === null) return null;

    const section = assessment.Sections[selectedSection];
    const question = section.Questions[currentQuestionIndex];
    const totalQuestions = section.Questions.length;

    return (
      <div className="mx-40 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-semibold text-xl">{`Section ${selectedSection + 1}`}</h2>
          <p className="text-xl">{`${currentQuestionIndex + 1}/${totalQuestions}`}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 relative">
          <div className="absolute top-2 right-2 flex items-center">
            <input
              type="checkbox"
              checked={answerLater[selectedSection][currentQuestionIndex] || false}
              onChange={handleCheckboxChange}
              className="mr-2"
              disabled={!!selectedOptions[selectedSection][currentQuestionIndex]} // Disable if an answer is provided
            />
            <label>Answer at a later time</label>
          </div>
          <p className="font-semibold text-lg mb-4">{`${currentQuestionIndex + 1}. ${question.Question}`}</p>
          {question.QuestionType === "MCQ" && (
            <div className="mb-4">
              {question.Options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    className="mr-2"
                    onChange={() => handleInputChange(option)}
                    required={!answerLater[selectedSection][currentQuestionIndex]}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          )}
          {question.QuestionType === "Short Text(Single line)" && (
            <textarea
              className="w-full p-2 border rounded focus:outline-none"
              rows={3}
              placeholder="Enter your answer here"
              value={selectedOptions[selectedSection][currentQuestionIndex] || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              required={!answerLater[selectedSection][currentQuestionIndex]}
            />
          )}
          {question.QuestionType === "Long Text(Paragraph)" && (
            <textarea
              className="w-full p-2 border rounded"
              rows={10}
              placeholder="Enter your answer here"
              value={selectedOptions[selectedSection][currentQuestionIndex] || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              required={!answerLater[selectedSection][currentQuestionIndex]}
            />
          )}
          {question.QuestionType === "Programming Questions" && (
            <div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="mb-4"
              >
                <option value="">Select Language</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
              <textarea
                className="w-full p-2 border rounded"
                rows={15}
                placeholder="Enter your code here"
                value={selectedOptions[selectedSection][currentQuestionIndex] || question.ProgrammingDetails?.[0]?.code || ""}
                onChange={(e) => handleInputChange(e.target.value)}
                required={!answerLater[selectedSection][currentQuestionIndex]}
              />
              <button
                className="bg-blue-400 text-black py-1 px-7 rounded hover:bg-blue-500 mt-4"
                onClick={handleRunClick}
              >
                Run
              </button>
              <button className="bg-blue-400 text-black py-1 px-7 rounded hover:bg-blue-500 mt-4">
                Submit
              </button>
            </div>
          )}
          {errorMessage && (
            <p className="text-red-500 mt-2">{errorMessage}</p>
          )}
          <div className="flex justify-between mt-8">
            {!isEditingFromPreview && (currentQuestionIndex > 0 || selectedSection > 0) ? (
              <button
                className="bg-gray-400 text-black py-1 px-7 rounded hover:bg-gray-500"
                onClick={handlePrevClick}
              >
                Prev
              </button>
            ) : null}
            {!isEditingFromPreview && (
              <button
                className="bg-blue-400 text-black py-1 px-7 rounded hover:bg-blue-500 ml-auto"
                onClick={handleNextClick}
              >
                {currentQuestionIndex === section.Questions.length - 1 && selectedSection === assessment.Sections.length - 1 ? "Finish" : "Next"}
              </button>
            )}
            {isEditingFromPreview && (
              <button
                className="bg-blue-400 text-black py-1 px-7 rounded hover:bg-blue-500 ml-auto"
                onClick={handleFinishClick}
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    return (
      <div className="mx-40 mt-8">
        <h2 className="font-semibold text-xl mb-8">Preview</h2>
        {assessment.Sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h3 className="font-semibold text-lg">{`Section ${sectionIndex + 1}`}</h3>
            {section.Questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer mb-4"
                onClick={() => {
                  setSelectedSection(sectionIndex);
                  setCurrentQuestionIndex(questionIndex);
                  setShowPreview(false);
                  setShowQuestions(true);
                  setIsEditingFromPreview(true);
                }}
              >
                <p className="font-semibold">{`${questionIndex + 1}. ${question.Question}`}</p>
                <p className="ml-4">{`Answer: ${selectedOptions[sectionIndex][questionIndex] || "Not answered"}`}</p>
              </div>
            ))}
          </div>
        ))}
        <button
          className="bg-blue-400 text-black py-1 px-7 rounded hover:bg-blue-500"
          onClick={() => navigate('/assessmentsubmit', { state: { assessment, selectedOptions } })}
        >
          Submit
        </button>
      </div>
    );
  };

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
    setShowMainContent(false);
    setShowQuestions(true);
    setCurrentQuestionIndex(0);
  };

  if (!assessment) {
    return <div>Loading...</div>;
  }

  const renderSectionContent = () => {
    return (
      <div className="mx-40">
        <p className="font-semibold text-xl mt-10 ">Assessments</p>
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 cursor-pointer mb-5 mt-5">
          <h2 className="font-bold">{`Section ${selectedSection + 1}`}</h2>
          <p className="text-sm mt-2">5 Questions in 10 minutes</p>
        </div>
        <p>Please read the questions carefully and respond accordingly.</p>
        <div className=" mt-40 mb-10 ">
          <button className="bg-gray-400 text-black py-1 px-7 rounded hover:bg-gray-500 mr-4" onClick={() => setShowMainContent(true)} >
            Previous
          </button>
          <button className="bg-blue-400 text-black py-1 px-7 rounded hover:bg-blue-500 float-right" onClick={handleStartClick} >
            Start
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="border-b p-4">
        <p className="font-bold text-xl">LOGO</p>
      </div>

      {showMainContent && assessment ? (
        <div className="grid grid-cols-3 mb-4">
          <div className="flex mt-20 ml-8 col-span-1">
            <img
              style={{ width: "230px", height: "170px" }}
              src={image2}
              alt="Assessment"
            />
          </div>
          <div className="mt-8 mb-5 col-span-2">
            <p className="font-semibold text-xl mb-8">Assessments</p>
            <div className="grid grid-rows-4 gap-4">
              {assessment.Sections.map((section, index) => (
                <div
                  key={section._id}
                  className="bg-white border border-gray-100 shadow-md rounded-lg p-4 cursor-pointer w-10/12"
                  onClick={() => handleSectionClick(index)}
                >
                  <h2 className="font-bold">{`Section ${index + 1}`}</h2>
                  <p className="text-sm mt-2">5 Questions in 10 minutes</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : showQuestions ? (
        renderQuestion()
      ) : showPreview ? (
        renderPreview()
      ) : (
        <div className="mt-8 mb-10 ml-8">{renderSectionContent()}</div>
      )}
      <div>
        {showMainContent && (
          <div className="flex justify-end mr-36 mb-8">
            <div>
              <button
                className="bg-gray-400 text-black py-1 px-7 rounded hover:bg-gray-700"
                onClick={() => handleSectionClick(0)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {showSectionContent && renderSectionContent()}
      </div>
    </div>
  );
};

export default AssessmentQuestion;