import React from "react";
import { useState, useRef, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import { VscSave } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import { PiTextTFill } from "react-icons/pi";
import { FaCode } from "react-icons/fa6";
import { MdArrowDropDown } from "react-icons/md";
import { FaEdit, FaTrash } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

const languages = [
  "Python", "Java", "C++", "C#", "JavaScript", "HTML/CSS", "PHP", "Ruby", "TypeScript", "R",
  "MATLAB", "Julia", "Swift", "Kotlin", "C", "Rust", "Perl", "Bash", "Haskell", "Scala", "SQL",
  "Go (Golang)", "Dart"
];
const Divider = () => (
  <div className="border-t my-3"></div>
);


const AddQuestion1 = React.forwardRef(({ isOpen, onClose, sectionName, onQuestionAdded, selectedAssessmentType }, ref) => {
  
  const [questionNumber, setQuestionNumber] = useState(1);
  const questionTypeOptions = selectedAssessmentType;
  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [formData, setFormData] = useState({
    Question: '',
    QuestionType: '',
    DifficultyLevel: '',
    Score: '',
    Answer: ''
  });

  const [showDropdownQuestionType, setShowDropdownQuestionType] = useState(false);
  const [showMcqFields, setShowMcqFields] = useState(false);
  const [mcqOptions, setMcqOptions] = useState([
    { option: '', isSaved: false, isEditing: false },
    { option: '', isSaved: false, isEditing: false },
    { option: '', isSaved: false, isEditing: false },
    { option: '', isSaved: false, isEditing: false }
  ]);
  const [selectedDifficultyLevel, setSelectedDifficultyLevel] = useState('');
  const [showDropdownDifficultyLevel, setShowDropdownDifficultyLevel] = useState(false);
  const [selectedScore, setSelectedScore] = useState('');
  const [showDropdownScore, setShowDropdownScore] = useState(false);
  const difficultyLevels = ["Easy", "Medium", "Hard"];
  const scoreRanges = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [errors, setErrors] = useState("");
  const [mcqInputType, setMcqInputType] = useState(Array(mcqOptions.length).fill('text'));
  const [textContent, setTextContent] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [questionInputType, setQuestionInputType] = useState('text');

  const resetForm = () => {
    setFormData({
      Question: '',
      QuestionType: '',
      DifficultyLevel: '',
      Score: '',
      Answer: ''
    });
    setSelectedQuestionType('');
    setSelectedDifficultyLevel('');
    setSelectedScore('');
    setMcqOptions([
      { option: '', isSaved: false, isEditing: false },
      { option: '', isSaved: false, isEditing: false },
      { option: '', isSaved: false, isEditing: false },
      { option: '', isSaved: false, isEditing: false },
    ]);
  };

  const handleSubmit = async (e, isSaveAndNext) => {
    e.preventDefault();

    const requiredFields = {
      Question: 'Question is required',
      QuestionType: 'Question Type is required',
      DifficultyLevel: 'Difficulty Level is required',
      Score: 'Score is required',
      Answer: 'Answer is required'
    };

    let formIsValid = true;
    const newErrors = { ...errors };
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]) {
        newErrors[field] = message;
        formIsValid = false;
      }
    });
    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    const updatedOptions = mcqOptions.map(option => ({
      ...option,
      isSaved: true
    }));
    setMcqOptions(updatedOptions);

    let programmingDetails = null;
    if (selectedQuestionType === 'Programming Questions') {
      programmingDetails = entries.map((entry) => ({
        language: entry.language,
        code: entry.initialCode,
        testCases: entry.testCases
      }));
    }

    const questionData = {
      ...formData,
      DifficultyLevel: selectedDifficultyLevel,
      QuestionType: selectedQuestionType,
      Score: selectedScore,
      SectionName: sectionName,
      Options: mcqOptions.map(option => option.option),
      ProgrammingDetails: programmingDetails,
    };

    console.log("Sending questionData:", questionData);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/newquestion`, questionData);
      console.log("Question saved:", response.data);
    } catch (error) {
      console.error("Error saving question:", error);
    }

    onQuestionAdded(questionData);
    resetForm();
    setShowMcqFields(false);
    setErrors({});
    if (isSaveAndNext) {
      setQuestionNumber((prevNumber) => prevNumber + 1);
    } else {
      setQuestionNumber(1);
      if (onClose) {
        onClose();
      }
    }
  };

  const handleSaveAndNext = (e) => {
    e.preventDefault();
    handleSubmit(e, true);
    setFormData(prevData => ({
      ...prevData,
      Question: '',
      Answer: '',
    }));
    setTextContent('');
    setCodeContent('');
    setAnswerTextContent('');
    setAnswerCodeContent('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    handleSubmit(e, false);
    setFormData(prevData => ({
      ...prevData,
      Question: '',
      Answer: '',
    }));
    setTextContent('');
    setCodeContent('');
    setAnswerTextContent('');
    setAnswerCodeContent('');
  };

  const handleSaveOption = (index) => {
    const newOptions = [...mcqOptions];
    newOptions[index].isSaved = true;
    newOptions[index].isEditing = false;
    setMcqOptions(newOptions);
  };

  const handleEditOption = (index) => {
    const newOptions = [...mcqOptions];
    newOptions[index].isEditing = true;
    setMcqOptions(newOptions);
  };

  const handleCancelOption = (index) => {
    const newOptions = mcqOptions.filter((_, i) => i !== index);
    setMcqOptions(newOptions);
  };

  const handleDeleteOption = (index) => {
    const newOptions = mcqOptions.filter((_, i) => i !== index);
    setMcqOptions(newOptions);
  };

  const addOption = () => {
    setMcqOptions([
      ...mcqOptions,
      { option: '', isSaved: false, isEditing: false }
    ]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...mcqOptions];
    newOptions[index].option = value;
    setMcqOptions(newOptions);
  };

  const handleMcqTextClick = (index) => {
    const updatedInputType = [...mcqInputType];
    updatedInputType[index] = 'text';
    setMcqInputType(updatedInputType);
  };

  const handleMcqCodeClick = (index) => {
    const updatedInputType = [...mcqInputType];
    updatedInputType[index] = 'code';
    setMcqInputType(updatedInputType);
  };

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: ''
    }));
  };

  const toggleDropdownQuestionType = () => {
    setShowDropdownQuestionType(!showDropdownQuestionType);
  };
  const handleQuestionTypeSelect = (questionType) => {
    setSelectedQuestionType(questionType);
    setShowDropdownQuestionType(false);
    setFormData(prevData => ({
      ...prevData,
      QuestionType: questionType
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      QuestionType: ''
    }));
    setShowMcqFields(questionType === 'MCQ');
  };

  const toggleDropdownDifficultyLevel = () => {
    setShowDropdownDifficultyLevel(!showDropdownDifficultyLevel);
  };
  const handleDifficultyLevelSelect = (difficultyLevel) => {
    setSelectedDifficultyLevel(difficultyLevel);
    setShowDropdownDifficultyLevel(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      DifficultyLevel: difficultyLevel
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      DifficultyLevel: ''
    }));
  };
  const toggleDropdownScore = () => {
    setShowDropdownScore(!showDropdownScore);
  };
  const handleScoreSelect = (score) => {
    setSelectedScore(score);
    setShowDropdownScore(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      Score: score
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      Score: ''
    }));
  };

  const handleAddButtonClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleQuestionChange = (value) => {
    if (questionInputType === 'text') {
      setTextContent(value);
    } else {
      setCodeContent(value);
    }
  };
  const handleQuestionTextClick = () => {
    setQuestionInputType('text');
  };
  const handleQuestionCodeClick = () => {
    setQuestionInputType('code');
  };
  const [answerTextContent, setAnswerTextContent] = useState('');
  const [answerCodeContent, setAnswerCodeContent] = useState('');
  const [answerInputType, setAnswerInputType] = useState('text');

  const handleAnswerChange = (value) => {
    if (answerInputType === 'text') {
      setAnswerTextContent(value);
      setFormData(prevData => ({
        ...prevData,
        Answer: value
      }));
    } else {
      setAnswerCodeContent(value);
      setFormData(prevData => ({
        ...prevData,
        Answer: value
      }));
    }
  };

  const handleAnswerTextClick = () => {
    setAnswerInputType('text');
  };
  const handleAnswerCodeClick = () => {
    setAnswerInputType('code');
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [code, setCode] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [testCaseName, setTestCaseName] = useState('');
  const [testCaseInput, setTestCaseInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [marks, setMarks] = useState(0);
  const [showTestCaseFields, setShowTestCaseFields] = useState(false);
  const clearModalState = () => {
    setCode('');
    setTestCaseName('');
    setTestCaseInput('');
    setExpectedOutput('');
    setMarks(0);
    setCurrentStep(0);
    setErrors({});
    setSelectedLanguage('');
    setIsModalOpen(false);
  };
  const isNextEnabled = () => {
    if (currentStep === 0) {
      return selectedLanguage !== '';
    }
    return true;
  };
  const [allSelectedLanguages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleCancelButtonClick = () => {
    setShowTestCaseFields(false);
    setTestCaseName('');
    setTestCaseInput('');
    setExpectedOutput('');
    setMarks(0);
    setErrors({});
  };

  useEffect(() => {
    const handleScroll = () => {
      if (lineNumberRef.current && textareaRef.current) {
        lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    };
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);
      return () => {
        textarea.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  const textareaRef = useRef(null);
  const lineNumberRef = useRef(null);
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };
  const generateLineNumbers = () => {
    return code.split('\n').map((_, index) => (
      <div key={index} className="text-gray-500">
        {index + 1}
      </div>
    ));
  };
  const displayTestCaseForm = () => {
    setShowTestCaseFields(true);
  };
  const handleSaveTestCase = () => {
    const testCaseErrors = {};
    if (!testCaseName) {
      testCaseErrors.testCaseName = 'Test case name is required';
    }
    if (!testCaseInput) {
      testCaseErrors.testCaseInput = 'Test case input is required';
    }
    if (!expectedOutput) {
      testCaseErrors.expectedOutput = 'Expected output is required';
    }
    if (!marks) {
      testCaseErrors.marks = 'Marks are required';
    }
    if (Object.keys(testCaseErrors).length > 0) {
      setErrors(testCaseErrors);
    } else {
      const newTestCase = {
        name: testCaseName,
        input: testCaseInput,
        output: expectedOutput,
        marks: marks
      };
      setTestCases([...testCases, newTestCase]);
      setTestCaseName('');
      setTestCaseInput('');
      setExpectedOutput('');
      setMarks(0);
      setShowTestCaseFields(false);
      setErrors({});
    }
  };
  const [entries, setEntries] = useState([]);
  const handleAddEntry = () => {
    if (editingIndex !== null) {
      const updatedEntries = entries.map((entry, index) =>
        index === editingIndex
          ? { language: selectedLanguage, initialCode: code, testCases: testCases }
          : entry
      );
      setEntries(updatedEntries);
      setEditingIndex(null);
    } else {
      setEntries([...entries, { language: selectedLanguage, initialCode: code, testCases: testCases }]);
    }
    clearModalState();
  };
  const handleEdit = (index) => {
    const entry = entries[index];
    setSelectedLanguage(entry.language);
    setCode(entry.initialCode);
    setTestCases(entry.testCases);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className={`fixed inset-0 bg-black bg-opacity-15 z-50 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`fixed inset-y-0 right-0 z-50 w-full bg-white shadow-lg transition-transform duration-5000 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="fixed top-0 w-full bg-white border-b z-50">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-bold">Add Question</h2>
              <button onClick={onClose} className="focus:outline-none">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="fixed top-20 bottom-16 overflow-auto w-full">
            <form className=" p-4" onSubmit={handleSubmit}>
              <div>
                <div className="flex gap-5 mb-5">
                  <div>
                    <label htmlFor="QuestionType" className="block text-sm font-medium leading-6 text-gray-900 w-36  dark:text-gray-400">
                      Question Type <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="flex-grow">
                    <div className="relative">
                      <input
                        type="text"
                        id="QuestionType"
                        className={`border-b focus:outline-none mb-5 w-full ${errors.QuestionType ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                        value={selectedQuestionType}
                        onClick={toggleDropdownQuestionType}
                        readOnly
                      />
                      {errors.QuestionType && <p className="text-red-500 text-sm -mt-4">{errors.QuestionType}</p>}
                      <MdArrowDropDown
                        className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0" onClick={toggleDropdownQuestionType}
                      />
                      {showDropdownQuestionType && (
                        <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                          {questionTypeOptions.map((questionType) => (
                            <div key={questionType} className="py-2 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleQuestionTypeSelect(questionType)}>
                              {questionType}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
             
                <div className="flex gap-5 mb-5">
                  <div>
                    <label htmlFor="Question" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 w-36">
                      Question <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="flex-grow relative">
                    <textarea
                      name="Question"
                      id="Question"
                      rows={1}
                      value={questionInputType === 'text' ? textContent : codeContent}
                      onChange={(e) => {
                        handleInputChange('Question', e.target.value);
                        handleQuestionChange(e.target.value);
                      }}
                      className={`border-b focus:outline-none mb-5 w-full ${errors.Question ? 'border-red-500' : 'border-gray-300 focus:border-black'} ${questionInputType === 'code' ? 'bg-gray-100' : ''}`}
                      style={{
                        overflowY: 'hidden',
                        resize: 'vertical',
                        fontFamily: questionInputType === 'code' ? 'monospace' : 'inherit'
                      }}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                    />
                    <div className="absolute right-3 top-1 flex gap-2 text-gray-500 text-lg cursor-pointer">
                      <PiTextTFill style={{ color: questionInputType === 'text' ? 'blue' : '' }} onClick={handleQuestionTextClick} />
                      <FaCode style={{ color: questionInputType === 'code' ? 'blue' : '' }} onClick={handleQuestionCodeClick} />
                    </div>
                    {errors.Question && <p className="text-red-500 text-sm -mt-4">{errors.Question}</p>}
                  </div>
                </div>
                <div className="flex gap-5 mb-5">
                  {selectedQuestionType !== "Programming Questions" && (
                    <div>
                      <label htmlFor="Answer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 w-36">
                        Answer <span className="text-red-500">*</span>
                      </label>
                    </div>
                  )}
                  {selectedQuestionType !== "Programming Questions" && (
                    <div className="flex-grow relative">
                      <textarea
                        name="Answer"
                        id="Answer"
                        rows={1}
                        value={answerInputType === 'text' ? answerTextContent : answerCodeContent}
                        onChange={(e) => {
                          handleInputChange('Answer', e.target.value);
                          handleAnswerChange(e.target.value);
                        }}
                        className={`border-b focus:outline-none mb-5 w-full ${errors.Answer ? 'border-red-500' : 'border-gray-300 focus:border-black'} ${answerInputType === 'code' ? 'bg-gray-100' : ''}`}
                        style={{
                          overflowY: 'hidden',
                          resize: 'vertical',
                          fontFamily: answerInputType === 'code' ? 'monospace' : 'inherit'
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                      />
                      <div className="absolute right-3 top-1 flex gap-2 text-gray-500 text-lg cursor-pointer">
                        <PiTextTFill style={{ color: answerInputType === 'text' ? 'blue' : '' }} onClick={handleAnswerTextClick} />
                        <FaCode style={{ color: answerInputType === 'code' ? 'blue' : '' }} onClick={handleAnswerCodeClick} />
                      </div>
                      {errors.Answer && <p className="text-red-500 text-sm -mt-4">{errors.Answer}</p>}
                    </div>
                  )}
                  {selectedQuestionType === "Programming Questions" && (
                    <div className="flex justify-between items-center mb-5">
                      <label htmlFor="TestCases" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 w-36">
                        Code <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        className="ml-80 mr-4 bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={handleAddButtonClick}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
                
                {selectedQuestionType === "Programming Questions" && (
                  <div className="space-y-4 mb-4">
                    {entries.map((entry, index) => (
                      <div key={index} className="flex flex-col border p-3 rounded-lg bg-blue-100">
                        <div className="mb-2">
                          <strong>Language:</strong> {entry.language}
                        </div>
                        <div className="mb-2">
                          <strong>Initial Code:</strong>
                          <div className="relative border rounded-md w-full bg-black text-white overflow-auto">
                            <div
                              ref={lineNumberRef}
                              className="absolute top-0 left-0 w-8 h-full overflow-hidden bg-black text-gray-500 flex flex-col items-center pt-2"
                              style={{ lineHeight: '1.5rem', fontSize: '0.875rem' }}
                            >
                              {generateLineNumbers(entry.initialCode)}
                            </div>
                            <textarea
                              value={entry.initialCode}
                              className="w-full h-64 pl-10 pr-2 py-2 resize-none bg-black text-white border-0 focus:outline-none overflow-auto"
                              readOnly
                              style={{ lineHeight: '1.5rem', fontSize: '0.875rem' }}
                            />
                          </div>
                        </div>
                        <div className="mb-2">
                          <strong>Test Cases:</strong> {entry.testCases.length}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleEdit(index)} className="text-blue-500 text-md">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(index)} className="text-red-500 text-md">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-5 mb-5">
                  <div>
                    <label htmlFor="DifficultyLevel" className="  dark:text-gray-400 block text-sm font-medium leading-6 text-gray-900 w-36">
                      Difficulty Level <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative flex-grow">
                    <div className="relative">
                      <input type="text" name="DifficultyLevel" className={`border-b focus:outline-none mb-5 w-full ${errors.DifficultyLevel ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                        value={selectedDifficultyLevel} onClick={toggleDropdownDifficultyLevel} readOnly />
                      {errors.DifficultyLevel && <p className="text-red-500 text-sm -mt-4">{errors.DifficultyLevel}</p>}
                      <MdArrowDropDown
                        className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0" onClick={toggleDropdownDifficultyLevel}
                      />
                      {showDropdownDifficultyLevel && (
                        <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                          {difficultyLevels.map((difficultyLevel) => (
                            <div key={difficultyLevel} className="py-2 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleDifficultyLevelSelect(difficultyLevel)}>
                              {difficultyLevel}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 mb-5">
                  <div>
                    <label htmlFor="Score" className="  dark:text-gray-400 block text-sm font-medium leading-6 text-gray-900 w-36">
                      Score <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative flex-grow">
                    <div className="relative">
                      <input type="text" name="Score" className={`border-b focus:outline-none mb-5 w-full ${errors.Score ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}

                        value={selectedScore} onClick={toggleDropdownScore} readOnly />
                      {errors.Score && <p className="text-red-500 text-sm -mt-4">{errors.Score}</p>}
                      <MdArrowDropDown
                        className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0" onClick={toggleDropdownScore}
                      />
                      {showDropdownScore && (
                        <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                          {scoreRanges.map((score) => (
                            <div key={score} className="py-2 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleScoreSelect(score)}>
                              {score}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
               
                {showMcqFields && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="block mb-2 text-sm font-medium text-gray-900">Options</label>
                      <IoAdd className="text-2xl text-red-500 cursor-pointer" onClick={addOption} />
                    </div>
                    <form onSubmit={handleSubmit}>
                      {mcqOptions.map((option, index) => (
                        <div key={index} className="flex gap-5 items-center relative mb-4">
                          <div style={{ width: "150px" }}>
                            <label htmlFor={`option${index}`} className="block text-sm font-medium leading-6 text-gray-500"></label>
                          </div>
                          <div className="flex-grow flex items-center relative">
                            <span className="absolute left-0 pl-2 text-gray-500">{index + 1}.</span>
                            <textarea
                              id={`option${index}`}
                              name={`option${index}`}
                              autoComplete="off"
                              className={`border-b border-gray-300 text-gray-500 focus:border-black focus:outline-none w-10/12 pl-8`}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              value={option.option}
                              readOnly={option.isSaved && !option.isEditing}
                              placeholder="Please add option"
                              rows={2}
                              style={{
                                overflow: 'hidden',
                                resize: 'vertical',
                                fontFamily: mcqInputType[index] === 'code' ? 'monospace' : 'inherit',
                              }}
                              onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                              }}
                            />
                            <div className="absolute right-20 top-2 flex gap-2 text-gray-500 text-lg cursor-pointer">
                              <PiTextTFill
                                aria-label="Text mode"
                                style={{ color: mcqInputType[index] === 'text' ? 'blue' : 'gray' }}
                                onClick={() => handleMcqTextClick(index)}
                              />
                              <FaCode
                                aria-label="Code mode"
                                style={{ color: mcqInputType[index] === 'code' ? 'blue' : 'gray' }}
                                onClick={() => handleMcqCodeClick(index)}
                              />
                            </div>
                            {!option.isSaved || option.isEditing ? (
                              <div className="flex gap-2 ml-2">
                                <button type="button" className="p-1 mt-2 bg-white" onClick={() => handleSaveOption(index)}><VscSave /></button>
                                <button type="button" className="mt-2 p-1 bg-white" onClick={() => handleCancelOption(index)}><ImCancelCircle /></button>
                              </div>
                            ) : (
                              <div className="flex gap-2 ml-2">
                                <button type="button" className="mt-2 p-1 bg-white" onClick={() => handleEditOption(index)}><FaRegEdit /></button>
                                <button type="button" className="mt-2 p-1 bg-white" onClick={() => handleDeleteOption(index)}><AiTwotoneDelete /></button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                    </form>
                  </div>
                )}
                <div className="relative">
                  <div className="absolute inset-0 flex justify-center items-center">
                    <div className="bg-gray-100  border  border-gray-300 w-8 h-8 rounded-md flex justify-center items-center">
                      <h2 className="text-lg font-semibold">{questionNumber}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-buttons flex justify-between">
                <button type="button" onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button type="button" onClick={handleSaveAndNext} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save & Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50">
            <div className="bg-white p-3 rounded shadow-lg w-10/12 h-96 flex flex-col">
              <div className="sticky top-0 bg-white flex justify-between">
                <h2 className="text-lg mb-4">{currentStep === 0 ? "Select Language" : currentStep === 1 ? "Initial Code" : "Test Cases"}</h2>
                <button onClick={clearModalState} className="focus:outline-none">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Divider />
              <div className="flex-grow overflow-y-auto">
                {currentStep === 0 && (
                  <div>
                    {languages.map(language => (
                      <label key={language} className="block mb-2">
                        <input
                          type="radio"
                          value={language}
                          checked={selectedLanguage === language}
                          disabled={allSelectedLanguages.includes(language) && selectedLanguage !== language}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="mr-3"
                        />
                        {language}
                      </label>
                    ))}
                  </div>
                )}
                {currentStep === 1 && (
                  <div>
                    <div className="relative border rounded-md w-full h-64 mb-10 bg-black text-white">
                      <div ref={lineNumberRef} className="absolute top-0 left-0 w-8 h-full overflow-hidden bg-black text-gray-500 flex flex-col items-center pt-2" style={{ lineHeight: '1.5rem', fontSize: '0.875rem' }}>
                        {generateLineNumbers()}
                      </div>
                      <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={handleCodeChange}
                        className="w-full h-full pl-10 pr-2 py-2 resize-none bg-black text-white border-0 focus:outline-none"
                        placeholder="Enter your code here..."
                        style={{ lineHeight: '1.5rem', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div>
                    <div className="flex justify-between mb-5">
                      <div className="flex gap-2 items-center">
                        <label htmlFor="testCases" className="block text-sm font-medium leading-6 text-gray-900">
                          Test Cases
                        </label>
                      </div>
                      <button
                        onClick={displayTestCaseForm}
                        className="flex items-center px-2 py-0 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none  text-sm font-medium leading-6 "
                      >
                        Add
                      </button>
                    </div>
                    {testCases.length > 0 && (
                      <table className="min-w-full divide-y divide-gray-200 mt-5">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Case Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Output</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {testCases.map((testCase, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{testCase.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{testCase.input}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{testCase.output}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{testCase.marks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {showTestCaseFields && (
                      <div className="border rounded-md p-4 mb-5">
                        <div className="flex gap-10 mb-5">
                          <div>
                            <label htmlFor="testCaseName" className="block text-sm font-medium leading-6 text-gray-900 w-40">
                              Test Case Name<span className="text-red-500">*</span>
                            </label>
                          </div>
                          <div className="flex-grow relative">
                            <input
                              type="text"
                              id="testCaseName"
                              value={testCaseName}
                              onChange={(e) => setTestCaseName(e.target.value)}
                              className={`border-b focus:outline-none w-full ${errors.testCaseName ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                            />
                            {errors.testCaseName && (
                              <div className="text-red-500 text-xs mt-1">{errors.testCaseName}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-10 mb-5">
                          <div>
                            <label htmlFor="testCaseInput" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 w-40">
                              Input <span className="text-red-500">*</span>
                            </label>
                          </div>
                          <div className="flex-grow relative">
                            <input
                              type="text"
                              id="testCaseInput"
                              value={testCaseInput}
                              onChange={(e) => setTestCaseInput(e.target.value)}
                              className={`border-b focus:outline-none w-full ${errors.testCaseInput ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                            />
                            {errors.testCaseInput && (
                              <div className="text-red-500 text-xs mt-1">{errors.testCaseInput}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-10 mb-5">
                          <div>
                            <label htmlFor="expectedOutput" className="block text-sm font-medium leading-6 text-gray-900 w-40">
                              Expected Output<span className="text-red-500">*</span>
                            </label>
                          </div>
                          <div className="flex-grow relative">
                            <input
                              type="text"
                              id="expectedOutput"
                              value={expectedOutput}
                              onChange={(e) => setExpectedOutput(e.target.value)}
                              className={`border-b focus:outline-none w-full ${errors.expectedOutput ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                            />
                            {errors.expectedOutput && (
                              <div className="text-red-500 text-xs mt-1">{errors.expectedOutput}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-10 mb-5">
                          <div>
                            <label htmlFor="marks" className="block text-sm font-medium leading-6 text-gray-900 w-40">
                              Marks<span className="text-red-500">*</span>
                            </label>
                          </div>
                          <div className="flex-grow relative">
                            <input
                              type="number"
                              id="marks"
                              value={marks}
                              onChange={(e) => setMarks(parseInt(e.target.value))}
                              className={`border-b focus:outline-none w-full ${errors.marks ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                            />
                            {errors.marks && (
                              <div className="text-red-500 text-xs mt-1">{errors.marks}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={handleCancelButtonClick}
                            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveTestCase}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Divider />
              <div className="flex-shrink-0">
                {currentStep === 0 && (
                  <button
                    onClick={() => setCurrentStep(1)}
                    className={`bg-blue-500 text-white px-4 py-2 rounded mt-4 block float-right ${!isNextEnabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!isNextEnabled()}
                  >
                    Next
                  </button>
                )}
                {currentStep === 1 && (
                  <div className="flex justify-between mt-4">
                    <button onClick={() => setCurrentStep(0)} className="bg-gray-300 text-black px-4 py-2 rounded">
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className={`bg-blue-500 text-white px-4 py-2 rounded ${!isNextEnabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!isNextEnabled()}
                    >
                      Next
                    </button>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="flex justify-between mt-4">
                    <button onClick={() => setCurrentStep(1)} className="bg-gray-300 text-black px-4 py-2 rounded">
                      Back
                    </button>
                    <button
                      onClick={handleAddEntry}
                      className={`bg-blue-500 text-white px-4 py-2 rounded ${!isNextEnabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!isNextEnabled()}
                    >
                      {editingIndex !== null ? 'Update' : 'Add'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default AddQuestion1