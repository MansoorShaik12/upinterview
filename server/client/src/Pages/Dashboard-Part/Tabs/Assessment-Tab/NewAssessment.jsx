import React, { useState, useRef, useEffect, forwardRef, useCallback } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { SlPencil } from "react-icons/sl";
import { IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdArrowDropDown, MdClose } from "react-icons/md";
import { BsFillInfoCircleFill } from "react-icons/bs";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-input-2/lib/style.css";
import AddQuestion1 from "../Assessment-Tab/AddQuestion1.jsx";
import AddSection1 from "./AddSection1.jsx";
import Editassesmentquestion from "./EditAssessmentquestion.jsx";
import AddPositionForm from "../Interviews/Addpositionform.jsx";

const NewAssessment = forwardRef(({ onClose }, ref) => {
  const [activeTab, setActiveTab] = useState("Basicdetails");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [errors, setErrors] = useState("");
  const [selectedAssessmentType, setSelectedAssessmentType] = useState([]);
  const [showDropdownAssessment, setShowDropdownAssessment] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [showDropdownDuration, setShowDropdownDuration] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [showDropdownDifficulty, setShowDropdownDifficulty] = useState(false);
  const [sidebarOpenForSection, setSidebarOpenForSection] = useState(false);
  const [sidebarOpenAddQuestion, setSidebarOpenAddQuestion] = useState(false);
  const sidebarRefAddQuestion = useRef(null);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [selectedIcons2, setSelectedIcons2] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpen2, setIsPopupOpen2] = useState(false);
  const [currentSectionName, setCurrentSectionName] = useState(null);
  const [toggleStates, setToggleStates] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [positions, setPositions] = useState("");
  const [value, setValue] = useState("");
  const [showNewPositionContent, setShowNewPositionContent] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true);
  const [skillsForSelectedPosition, setSkillsForSelectedPosition] = useState([]);
  const [matchingSection, setMatchingSection] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedSectionName, setEditedSectionName] = useState("");
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [checkedState, setCheckedState] = useState({});
  const [checkedCount, setCheckedCount] = useState(0);
  const [questionsBySection, setQuestionsBySection] = useState({});
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [sectionToDeleteFrom, setSectionToDeleteFrom] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const sidebarRefForSection = useRef(null);
  const popupRef = useRef(null);
  const [formData, setFormData] = useState({
    AssessmentTitle: '',
    AssessmentType: '',
    Position: '',
    Duration: '',
    DifficultyLevel: '',
    NumberOfQuestions: '',
    ExpiryDate: null,
  });

  const handleIconClick = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setShowMessage(!showMessage);
  };

  const handleQuestionAdded = (questionData) => {
    setQuestionsBySection((prevQuestions) => ({
      ...prevQuestions,
      [currentSectionName]: [...(prevQuestions[currentSectionName] || []), questionData]
    }));
  };

  const resetActiveTab = () => {
    setActiveTab("Basicdetails");
  };

  const resetFormData = () => {
    setFormData({
      AssessmentTitle: '',
      AssessmentType: '',
      Skill_Technology: '',
      Position: '',
      Duration: '',
      DifficultyLevel: '',
      NumberOfQuestions: '',
      ExpiryDate: null,
    });
    setQuestionsBySection({});
    setSelectedAssessmentType('');
    setSelectedDuration('');
    setSelectedDifficulty('');
    setStartDate(null);
    setPosition('');
  };

  const handleClose = () => {
    resetActiveTab();
    resetFormData();
  };

  const [questionToEdit] = useState(null);

  const [selectedPosition, setSelectedPosition] = useState("");
  const [showDropdownPosition, setShowDropdownPosition] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleCombinedSubmit = (e, path = null) => {
    e.preventDefault();

    const requiredFields = {
      AssessmentTitle: 'Assessment Title is required',
      AssessmentType: 'Assessment Type is required',
      Duration: 'Duration is required',
      DifficultyLevel: 'Difficulty Level is required',
      NumberOfQuestions: 'Number Of Questions is required',
      Position: 'Position is required',
      ExpiryDate: 'Expiry Date is required',
    };

    let formIsValid = true;
    const newErrors = {};

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = message;
        formIsValid = false;
      }
    });

    if (!selectedPosition) {
      newErrors.Position = 'Position is required';
      formIsValid = false;
    }

    if (selectedAssessmentType.length === 0) {
      newErrors.AssessmentType = 'Assessment Type is required';
      formIsValid = false;
    }


    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    setPosition(formData.Position);

    if (path) {
      handleSaveAll();
    } else {
      setActiveTab((prevTab) => {
        if (prevTab === "Basicdetails") return "Questions";
        if (prevTab === "Questions") return "Candidates";
        return "Basicdetails";
      });
    }
  };

  const handleSaveAll = async () => {
    try {
      const assessmentData = {
        AssessmentTitle: formData.AssessmentTitle,
        AssessmentType: selectedAssessmentType,
        Position: formData.Position,
        Duration: selectedDuration,
        DifficultyLevel: selectedDifficulty,
        NumberOfQuestions: formData.NumberOfQuestions,
        ExpiryDate: startDate,
        Sections: matchingSection.map(sectionName => ({
          SectionName: sectionName,
          Position: position,
          Questions: questionsBySection[sectionName].map(question => ({
            ...question,
            Options: question.Options || [],
            ProgrammingDetails: question.ProgrammingDetails || null
          }))
        })),
        CreatedBy: userId,
        CreatedDate: new Date()
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/assessment`, assessmentData);
      console.log(response.data);

      handleClose();
      onClose();
    } catch (error) {
      console.error('Error saving assessment, sections, and questions:', error.response.data);
    }
  };

  const assessmentTypes = [
    "MCQ",
    "Programming Questions",
    "Short Text(Single line)",
    "Long Text(Paragraph)",
  ];

  const toggleDropdownAssessment = () => {
    setShowDropdownAssessment(!showDropdownAssessment);
  };

  const handleAssessmentTypeSelect = (type) => {
    setSelectedAssessmentType((prevSelected) => {
      if (prevSelected.includes(type)) {
        setShowDropdownAssessment(false);
        return prevSelected;
      } else {
        return [...prevSelected, type];
      }
    });

    setFormData((prevData) => ({
      ...prevData,
      AssessmentType: selectedAssessmentType.includes(type)
        ? selectedAssessmentType.filter((item) => item !== type)
        : [...selectedAssessmentType, type],
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      AssessmentType: "",
    }));
  };

  const handleRemoveAssessmentType = (type) => {
    setSelectedAssessmentType((prevSelected) => {
      const updatedSelected = prevSelected.filter((item) => item !== type);
      setFormData((prevData) => ({
        ...prevData,
        AssessmentType: updatedSelected,
      }));
      return updatedSelected;
    });
  };

  const durations = ["30 minutes", "45 minutes", "1 hour", "1:30 minutes"];

  const toggleDropdownDuration = () => {
    setShowDropdownDuration(!showDropdownDuration);
  };

  const handleDurationSelect = (duration) => {
    if (duration === "1 hour" || duration === "1:30 minutes") {
      setShowUpgradePopup(true);
      setShowDropdownDuration(false);
    } else {
      setSelectedDuration(duration);
      setShowDropdownDuration(false);
      setFormData((prevData) => ({
        ...prevData,
        Duration: duration,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        Duration: "",
      }));
    }
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setFormData((prevData) => ({
      ...prevData,
      ExpiryDate: date,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      ExpiryDate: "",
    }));
  };

  const handleUpgrade = () => {
    setShowUpgradePopup(false);
  };

  const closePopup = () => {
    setShowUpgradePopup(false);
  };

  const difficultyLevels = ["Easy", "Medium", "Hard"];
  const toggleDropdownDifficulty = () => {
    setShowDropdownDifficulty(!showDropdownDifficulty);
  };
  const handleDifficultySelect = (level) => {
    setSelectedDifficulty(level);
    setShowDropdownDifficulty(false);
    setFormData((prevData) => ({
      ...prevData,
      DifficultyLevel: level,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      DifficultyLevel: "",
    }));
  };

  const toggleSidebarForSection = () => {
    setSidebarOpenForSection(!sidebarOpenForSection);
  };

  const closeSidebarForSection = useCallback(() => {
    setSidebarOpenForSection(false);
  }, []);

  const handleOutsideClickForSection = useCallback((event) => {
    if (
      sidebarRefForSection.current &&
      !sidebarRefForSection.current.contains(event.target)
    ) {
      closeSidebarForSection();
    }
  }, [closeSidebarForSection]);

  useEffect(() => {
    if (sidebarOpenForSection) {
      document.addEventListener("mousedown", handleOutsideClickForSection);
    } else {
      document.removeEventListener("mousedown", handleOutsideClickForSection);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClickForSection);
    };
  }, [sidebarOpenForSection, handleOutsideClickForSection]);

  const closeSidebarAddQuestion = useCallback(() => {
    setSidebarOpenAddQuestion(false);
  }, []);

  const handleOutsideClickAddQuestion = useCallback((event) => {
    if (
      sidebarRefAddQuestion.current &&
      !sidebarRefAddQuestion.current.contains(event.target)
    ) {
      closeSidebarAddQuestion();
    }
  }, [closeSidebarAddQuestion]);

  useEffect(() => {
    if (sidebarOpenAddQuestion) {
      document.addEventListener("mousedown", handleOutsideClickAddQuestion);
    } else {
      document.removeEventListener("mousedown", handleOutsideClickAddQuestion);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClickAddQuestion);
    };
  }, [sidebarOpenAddQuestion, handleOutsideClickAddQuestion]);


  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/sections`);
        setSelectedIcons(response.data);
        const IconData = response.data.filter(
          (data) => data.Position === position
        );
        setSelectedIcons2(IconData);
      } catch (error) {
        console.error("Error fetching Sectionsdata:", error);
      }
    };
    fetchSectionData();
  }, [position]);

  const handleDeleteQuestionClick = (questionId, sectionName) => {
    setQuestionsBySection((prevQuestions) => {
      const updatedQuestions = { ...prevQuestions };
      if (Array.isArray(updatedQuestions[sectionName])) {
        updatedQuestions[sectionName] = updatedQuestions[sectionName].filter(
          (question) => question._id !== questionId
        );
      }
      return updatedQuestions;
    });
  };

  const cancelDelete = () => {
    setIsPopupOpen(false);
    setQuestionToDelete(null);
  };

  const handleclose = () => {
    setShowMainContent(true);
    setShowNewPositionContent(false);
  };

  const userId = localStorage.getItem("userId");


  const toggleSidebarAddQuestion = (SectionName) => {
    setSidebarOpenAddQuestion(!sidebarOpenAddQuestion);
    setCurrentSectionName(SectionName);
  };

  const toggleArrow1 = (index) => {
    setToggleStates((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const getDifficultyColorClass = (difficultyLevel) => {
    switch (difficultyLevel) {
      case "Easy":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Hard":
        return "bg-red-500";
      default:
        return "";
    }
  };

  const handleEditClick = (question) => {
    setSelectedQuestion(question);
    setIsEditQuestionModalOpen(true)
    setCurrentSectionName(question.SectionName);
  };

  useEffect(() => {
    const fetchPositionsData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/position?CreatedBy=${userId}`);
        setPositions(response.data);
      } catch (error) {
        console.error("Error fetching position data:", error);
      }
    };

    fetchPositionsData();
  }, [userId]);

  const toggleDropdownPosition = (e) => {
    e.stopPropagation();
    setShowDropdownPosition(!showDropdownPosition);
  };


  const handlePositionSelect = (position) => {
    setSelectedPosition(position);
    setShowDropdownPosition(false);
    setValue("");
    setFormData((prevData) => ({
      ...prevData,
      Position: position.title,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      Position: "",
    }));
    const extractedSkills = position.skills.map(skill => skill.skill);
    setSkillsForSelectedPosition(extractedSkills);
  };

  const handleAddNewPositionClick = () => {
    setShowMainContent(false);
    setShowNewPositionContent(true);

    if (value.trim() !== "") {
      const newPosition = { _id: positions.length + 1, title: value };
      setPositions([newPosition, ...positions]);
      setSelectedPosition(value);
      setValue("");
    }
  };

  const handleSectionAdded = (newSection) => {
    const isSectionExists = selectedIcons.some(section => section.SectionName === newSection.SectionName && section.Position === position);
    if (isSectionExists) {
      alert(`Section "${newSection.SectionName}" already exists for position "${position}".`);
      return;
    }
    setMatchingSection((prevSections) => [...prevSections, newSection.SectionName]);
    setQuestionsBySection((prevQuestions) => ({
      ...prevQuestions,
      [newSection.SectionName]: prevQuestions[newSection.SectionName] || []
    }));
  };

  useEffect(() => {
    const sectionNames = selectedIcons
      .filter((section) => section.Position === position)
      .map((section) => section.SectionName);

    const uniqueSections = [
      ...new Set([
        ...selectedIcons2.map((icon) => icon.SectionName),
        ...sectionNames,
      ]),
    ];
    setMatchingSection(uniqueSections);
  }, [selectedIcons, selectedIcons2, position]);

  const handleBackButtonClick = () => {

    setActiveTab('Basicdetails');
  };


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/newquestion`);
        setQuestionsBySection(response.data);

      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleEditSection = (index, currentSectionName) => {
    setEditingIndex(index);
    setEditedSectionName(currentSectionName);
    setIsEditSectionModalOpen(true);
  };

  const handleSaveSectionName = () => {
    if (editingIndex !== null && editedSectionName.trim() !== "") {
      const updatedSectionName = editedSectionName.trim();

      setQuestionsBySection((prevQuestions) => {
        const updatedQuestions = { ...prevQuestions };
        if (updatedQuestions[matchingSection[editingIndex]]) {
          updatedQuestions[updatedSectionName] = updatedQuestions[matchingSection[editingIndex]];
          delete updatedQuestions[matchingSection[editingIndex]];
        }
        return updatedQuestions;
      });

      setMatchingSection((prevSections) => {
        const updatedSections = [...prevSections];
        updatedSections[editingIndex] = updatedSectionName;
        return updatedSections;
      });

      setIsEditSectionModalOpen(false);
      setEditingIndex(null);
    }
  };


  const confirmDelete = () => {
    if (questionToDelete && sectionToDeleteFrom) {
      handleDeleteQuestionClick(questionToDelete, sectionToDeleteFrom);
      setIsDeleteConfirmationOpen(false);
      setQuestionToDelete(null);
      setSectionToDeleteFrom(null);
    }
  };


  const cancelDelete2 = () => {
    setIsPopupOpen2(false);
    setQuestionToDelete(null);
    setSectionToDeleteFrom(null);
  };

  const handleQuestionSelection = (sectionName, questionIndex) => {
    setCheckedState(prevState => {
      const isChecked = !prevState[sectionName]?.[questionIndex];
      const newCheckedState = {
        ...prevState,
        [sectionName]: {
          ...prevState[sectionName],
          [questionIndex]: isChecked
        }
      };

      const newCheckedCount = Object.values(newCheckedState).reduce((count, section) => {
        return count + Object.values(section).filter(Boolean).length;
      }, 0);

      setCheckedCount(newCheckedCount);
      return newCheckedState;
    });
  };

  const confirmDelete2 = () => {
    setQuestionsBySection(prevState => {
      const newQuestionsBySection = { ...prevState };

      Object.keys(checkedState).forEach(sectionName => {
        newQuestionsBySection[sectionName] = newQuestionsBySection[sectionName].filter((_, questionIndex) => !checkedState[sectionName][questionIndex]);
      });

      return newQuestionsBySection;
    });

    setCheckedState({});
    setCheckedCount(0);
  };

  const handleDeleteIconClick = (questionIndex, sectionName) => {
    setQuestionToDelete(questionIndex);
    setSectionToDeleteFrom(sectionName);
    setIsBulkDelete(false);
    setIsDeleteConfirmationOpen(true);
  };

  const handleBulkDeleteClick = () => {
    setIsBulkDelete(true);
    setIsDeleteConfirmationOpen(true);
  };
  const confirmDeleteQuestion = () => {
    if (isBulkDelete) {
      setQuestionsBySection((prevState) => {
        const newQuestionsBySection = { ...prevState };

        Object.keys(checkedState).forEach((sectionName) => {
          newQuestionsBySection[sectionName] = newQuestionsBySection[sectionName].filter(
            (_, questionIndex) => !checkedState[sectionName][questionIndex]
          );
        });

        return newQuestionsBySection;
      });

      setCheckedState({});
      setCheckedCount(0);
    } else {
      setQuestionsBySection((prevQuestions) => {
        const updatedQuestions = { ...prevQuestions };
        if (Array.isArray(updatedQuestions[sectionToDeleteFrom])) {
          updatedQuestions[sectionToDeleteFrom] = updatedQuestions[sectionToDeleteFrom].filter(
            (_, index) => index !== questionToDelete
          );
        }
        return updatedQuestions;
      });
    }

    setIsDeleteConfirmationOpen(false);
    setQuestionToDelete(null);
    setSectionToDeleteFrom(null);
  };

  const cancelDeleteQuestion = () => {
    setIsDeleteConfirmationOpen(false);
    setQuestionToDelete(null);
    setSectionToDeleteFrom(null);
  };

  const [isDeleteSectionConfirmationOpen, setIsDeleteSectionConfirmationOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [sectionIndexToDelete, setSectionIndexToDelete] = useState(null);

  const handleDeleteSectionClick = (index, sectionName) => {
    setSectionToDelete(sectionName);
    setSectionIndexToDelete(index);
    setIsDeleteSectionConfirmationOpen(true);
  };

  const confirmDeleteSection = () => {
    if (sectionToDelete !== null && sectionIndexToDelete !== null) {
      setMatchingSection((prevSections) => prevSections.filter((_, i) => i !== sectionIndexToDelete));
      setQuestionsBySection((prevQuestions) => {
        const updatedQuestions = { ...prevQuestions };
        delete updatedQuestions[sectionToDelete];
        return updatedQuestions;
      });
      setIsDeleteSectionConfirmationOpen(false);
      setSectionToDelete(null);
      setSectionIndexToDelete(null);
    }
  };

  const cancelDeleteSection = () => {
    setIsDeleteSectionConfirmationOpen(false);
    setSectionToDelete(null);
    setSectionIndexToDelete(null);
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <input
      type="text"
      readOnly
      className="focus:border-black focus:outline-none w-96"
      value={value}
      onClick={onClick}
      ref={ref}
    />
  ));

  return (
    <React.Fragment>
      <div>
        {showMainContent ? (
          <div>
            {/* Header */}
            <div className="fixed top-0 w-full bg-white border-b z-0">
              <div className="flex justify-between items-center p-4">
                <h2 className="text-lg font-bold">New Assessment</h2>
                <button onClick={onClose} className="focus:outline-none">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="fixed top-16 bottom-16 overflow-auto w-full">
              <div>
                <div className="container mx-auto">
                  <div>
                    {/* basic details tab content */}
                    {activeTab === "Basicdetails" && (
                      <>
                        <form className="group p-4">
                          {/* Assessment Name */}
                          <div className="flex gap-5 mb-5">
                            <div>
                              <label
                                htmlFor="AssessmentTitle"
                                className="block text-sm font-medium leading-6 text-gray-900 w-36"
                              >
                                Assessment Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                            </div>
                            <div className="flex-grow">
                              <input
                                type="text"
                                name="AssessmentTitle"
                                id="AssessmentTitle"
                                value={formData.AssessmentTitle}
                                onChange={handleChange}
                                autoComplete="off"
                                className={`border-b focus:outline-none mb-5 w-full ${errors.AssessmentTitle
                                  ? "border-red-500"
                                  : "border-gray-300 focus:border-black"
                                  }`}
                              />
                              {errors.AssessmentTitle && (
                                <p className="text-red-500 text-sm -mt-4">
                                  {errors.AssessmentTitle}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* Assessment type */}
                          <div className="flex gap-5 mb-9">
                            {/* Label */}
                            <label
                              htmlFor="AssessmentType"
                              className="block text-sm font-medium leading-6 text-gray-900"
                              style={{ width: "143px" }}
                            >
                              Assessment Type
                              <span className="text-red-500">*</span>
                            </label>

                            {/* Input area */}
                            <div className="flex-grow relative" style={{ width: "200px" }}>
                              {/* Conditionally Styled Input Border */}
                              <div
                                className={`border-b ${errors.AssessmentType ? "border-red-500" : "border-gray-300"} focus:border-black focus:outline-none w-full flex items-center flex-wrap gap-2 py-3 cursor-pointer ${Array.isArray(selectedAssessmentType) && selectedAssessmentType.length > 0 ? "-mt-3" : ""}`}
                                onClick={toggleDropdownAssessment}
                              >
                                {Array.isArray(selectedAssessmentType) && selectedAssessmentType.map((type) => (
                                  <div key={type} className="flex items-center bg-gray-200 rounded px-2 py-1">
                                    {type}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveAssessmentType(type);
                                      }}
                                      className="ml-2 text-sm bg-slate-300 rounded px-2"
                                    >
                                      X
                                    </button>
                                  </div>
                                ))}
                                {Array.isArray(selectedAssessmentType) && selectedAssessmentType.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedAssessmentType([]);
                                    }}
                                    className="absolute top-1 right-8 text-gray-500 text-lg cursor-pointer"
                                  >
                                    X
                                  </button>
                                )}
                                <MdArrowDropDown
                                  className="absolute right-0 top-1 text-gray-500 text-lg cursor-pointer"
                                />
                              </div>

                              {/* Dropdown Options */}
                              {showDropdownAssessment && (
                                <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-md">
                                  {assessmentTypes.map((questionType) => (
                                    <div
                                      key={questionType}
                                      className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                      onClick={() => {
                                        handleAssessmentTypeSelect(questionType);
                                        setShowDropdownAssessment(false);
                                      }}
                                    >
                                      {questionType}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Validation Error */}
                              {errors.AssessmentType && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.AssessmentType}
                                </p>
                              )}
                            </div>
                          </div>



                          {/* Position */}
                          <div className="flex gap-5 mb-5">
                            <div>
                              <label className="text-sm font-medium leading-6 text-gray-900 w-36 flex items-center">
                                Position <span className="text-red-500">*</span>
                                <div className="relative inline-block">
                                  <BsFillInfoCircleFill
                                    className="ml-2 text-gray-500 cursor-pointer"
                                    onClick={handleIconClick}
                                  />
                                  {showMessage && (
                                    <div className="absolute bottom-full mb-2 left-0 w-max bg-white text-gray-700 border border-gray-300 rounded p-2 text-xs">
                                      Depending on the position, we can offer sections with tailored questions.
                                    </div>
                                  )}
                                </div>
                              </label>
                            </div>
                            <div className="relative flex-grow">
                              <div className="relative">
                                <div className="relative mb-5">
                                  {selectedPosition.title ? (
                                    <div className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full h-9 flex items-center">
                                      <div className="bg-slate-200 rounded px-2 py-1 inline-block mr-2 mb-3">
                                        {selectedPosition.title}
                                        <button
                                          className="ml-2 bg-slate-300 rounded px-2"
                                          onClick={() =>
                                            setSelectedPosition("")
                                          }
                                        >
                                          X
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      id="position"
                                      className={`border-b focus:outline-none w-full ${errors.Position
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-black"
                                        }`}
                                      value={selectedPosition.title || ""}
                                      onClick={toggleDropdownPosition}
                                      readOnly
                                    />
                                  )}
                                </div>

                                {errors.Position && (
                                  <p className="text-red-500 text-sm -mt-4">
                                    {errors.Position}
                                  </p>
                                )}
                                <MdArrowDropDown
                                  className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0"
                                  onClick={toggleDropdownPosition}
                                />
                                {/* Dropdown */}
                                {showDropdownPosition && (
                                  <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                                    <p className="p-1 font-medium">
                                      Recent Positions
                                    </p>
                                    <ul>
                                      {positions.map((position) => (
                                        <div
                                          key={position._id}
                                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                          onClick={() =>
                                            handlePositionSelect(position)
                                          }
                                        >
                                          {position.title}
                                        </div>
                                      ))}
                                      <li
                                        className="flex cursor-pointer shadow-md border-b p-1 rounded"
                                        onClick={handleAddNewPositionClick}
                                      >
                                        <IoIosAddCircle className="text-2xl" />
                                        <span>Add New Position</span>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Duration */}
                          <div>
                            <div className="flex gap-5 mb-5">
                              <div>
                                <label
                                  htmlFor="duration"
                                  className="block text-sm font-medium leading-6 text-gray-900 w-36"
                                >
                                  Duration{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                              </div>
                              <div className="relative flex-grow">
                                <div className="relative">
                                  <input
                                    type="text"
                                    id="duration"
                                    className={`border-b focus:outline-none mb-5 w-full ${errors.Duration ? "border-red-500" : "border-gray-300 focus:border-black"}`}
                                    value={selectedDuration}
                                    onClick={toggleDropdownDuration}
                                    readOnly
                                  />
                                  <MdArrowDropDown
                                    className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0"
                                    onClick={toggleDropdownDuration}
                                  />
                                </div>
                                {showDropdownDuration && (
                                  <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                                    {durations.map((duration) => (
                                      <div
                                        key={duration}
                                        className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                        onClick={() =>
                                          handleDurationSelect(duration)
                                        }
                                      >
                                        {duration}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {errors.Duration && (
                                  <p className="text-red-500 text-sm -mt-4">
                                    {errors.Duration}
                                  </p>
                                )}
                              </div>
                            </div>

                            {showUpgradePopup && (
                              <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-75 z-50">
                                <div
                                  className="relative bg-white p-5 rounded-lg shadow-lg"
                                  style={{ width: "80%" }}
                                >
                                  <MdClose
                                    className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                                    onClick={closePopup}
                                  />
                                  <div className="flex justify-center">
                                    <div className="text-center">
                                      <p className="mb-4">
                                        {" "}
                                        Upgrade your plan to select a duration{" "}
                                        <br /> longer than 45 minutes.
                                      </p>
                                      <button
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                        onClick={handleUpgrade}
                                      >
                                        Upgrade
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>


                          {/* No. of Questions */}
                          <div className="flex gap-5 mb-5">
                            <div>
                              <label
                                htmlFor="NumberOfQuestions"
                                className="block text-sm font-medium leading-6 text-gray-900  w-36"
                              >
                                No. of Questions{" "}
                                <span className="text-red-500">*</span>
                              </label>
                            </div>
                            <div className="flex-grow">
                              <input
                                type="number"
                                name="NumberOfQuestions"
                                value={formData.NumberOfQuestions}
                                onChange={handleChange}
                                id="NumberOfQuestions"
                                min="1"
                                max="50"
                                autoComplete="off"
                                className={`border-b focus:outline-none mb-5 w-full ${errors.NumberOfQuestions
                                  ? "border-red-500"
                                  : "border-gray-300 focus:border-black"
                                  }`}
                              />
                              {errors.NumberOfQuestions && (
                                <p className="text-red-500 text-sm -mt-4">
                                  {errors.NumberOfQuestions}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Difficulty Level */}
                          <div className="flex gap-5 mb-5">
                            <div>
                              <label
                                htmlFor="difficulty"
                                className="block text-sm font-medium leading-6 text-gray-900 w-36"
                              >
                                Difficulty Level{" "}
                                <span className="text-red-500">*</span>
                              </label>
                            </div>
                            <div className="relative flex-grow">
                              <div className="relative">
                                <input
                                  type="text"
                                  id="difficulty"
                                  className={`border-b focus:outline-none mb-5 w-full ${errors.DifficultyLevel
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-black"
                                    }`}
                                  value={selectedDifficulty}
                                  onClick={toggleDropdownDifficulty}
                                  readOnly
                                />
                                {errors.DifficultyLevel && (
                                  <p className="text-red-500 text-sm -mt-4">
                                    {errors.DifficultyLevel}
                                  </p>
                                )}

                                <MdArrowDropDown
                                  className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0"
                                  onClick={toggleDropdownDifficulty}
                                />
                              </div>
                              {showDropdownDifficulty && (
                                <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                                  {difficultyLevels.map((level) => (
                                    <div
                                      key={level}
                                      className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                      onClick={() =>
                                        handleDifficultySelect(level)
                                      }
                                    >
                                      {level}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Expiry date */}
                          <div className="flex gap-5 mb-5">
                            <div>
                              <label
                                htmlFor="expiry"
                                className="block text-sm font-medium leading-6 text-gray-900 w-36"
                              >
                                Expiry Date{" "}
                                <span className="text-red-500">*</span>
                              </label>
                            </div>
                            <div className="relative flex-grow">
                              <div className="relative">
                                <div className="border-b border-gray-300 mb-5 w-full">
                                  <DatePicker
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd-MM-yyyy"
                                    className="focus:border-black focus:outline-none w-full"
                                    placeholderText=""
                                    minDate={new Date()}
                                    customInput={<CustomInput />}
                                  />
                                </div>
                              </div>
                              {errors.ExpiryDate && (
                                <p className="text-red-500 text-sm -mt-4">
                                  {errors.ExpiryDate}
                                </p>
                              )}
                            </div>
                          </div>


                          <div className="SaveAndScheduleButtons">
                            <button
                              type="submit"
                              onClick={(event) => handleCombinedSubmit(event, "/assessment")}
                              className="footer-button"
                            >
                              Save
                            </button>

                            <button type="submit" onClick={(event) => handleCombinedSubmit(event)} className="footer-button">
                              Save & Next
                            </button>
                          </div>
                        </form>
                      </>
                    )}

                    {/* question tab content */}
                    {activeTab === "Questions" && (
                      <div>
                        <div className="overflow-x-auto relative" style={{ overflowX: "auto" }}>
                          <div className="border p-2 flex justify-between bg-gray-200 items-center">
                            <p className="font-bold">Questions</p>
                            <button className="border rounded px-2 py-1 bg-sky-500 text-white text-md" onClick={toggleSidebarForSection}>
                              Add Section
                            </button>
                            <AddSection1
                              isOpen={sidebarOpenForSection}
                              onClose={closeSidebarForSection}
                              onOutsideClick={handleOutsideClickForSection}
                              ref={sidebarRefForSection}
                              position={position}
                              onSectionAdded={handleSectionAdded}
                              skills={skillsForSelectedPosition}
                            />
                          </div>
                          {matchingSection.length > 0 && matchingSection.map((sectionName, index) => (
                            <div key={index} className="mt-3 text-md justify-between">
                              <div className="flex justify-between bg-gray-100 p-2">
                                <div className="flex">
                                  <div className="flex items-center font-bold">
                                    <p className="pr-4 ml-2 w-36">
                                      {Array.isArray(questionsBySection[sectionName]) && questionsBySection[sectionName].length > 0 && (
                                        ` (${questionsBySection[sectionName].length})`
                                      )}
                                      {sectionName}
                                    </p>
                                  </div>
                                  <p className="border-r-gray-600 border"></p>
                                  <div className="flex items-center" onClick={() => { toggleSidebarAddQuestion(sectionName); }}>
                                    <p className="rounded px-2 ml-2 cursor-pointer text-blue-300">Add Questions</p>
                                  </div>
                                </div>
                                <div className="flex">
                                  <button type="button" className="text-xl text-black p-2" onClick={() => handleEditSection(index, sectionName)}>
                                    {/* section edit */}
                                    <SlPencil />
                                  </button>
                                  <button type="button" className="text-xl text-black p-2" onClick={() => handleDeleteSectionClick(index, sectionName)}>
                                    {/* section delete */}
                                    <RiDeleteBin6Line />
                                  </button>
                                  <p className="border-r-gray-600 border"></p>
                                  <div className="flex items-center text-3xl ml-3 mr-3 cursor-pointer" onClick={() => toggleArrow1(index)}>
                                    {toggleStates[index] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                  </div>
                                </div>
                              </div>

                              <AddQuestion1
                                isOpen={sidebarOpenAddQuestion}
                                onClose={closeSidebarAddQuestion}
                                onOutsideClick={handleOutsideClickAddQuestion}
                                ref={sidebarRefAddQuestion}
                                sectionName={sectionName}
                                onQuestionAdded={handleQuestionAdded}
                                questionToEdit={questionToEdit}
                                selectedAssessmentType={selectedAssessmentType}
                              />
                              <div className="p-2" style={{ display: toggleStates[index] ? "block" : "none" }}>
                                {Array.isArray(questionsBySection[sectionName]) && questionsBySection[sectionName]
                                  .map((question, questionIndex) => (
                                    <div key={question._id} className="border p-2 border-gray-300 mb-2 text-sm">
                                      <div className="flex justify-between">
                                        <div className="flex items-center gap-2">
                                          <hr className={`w-1 h-10 ${getDifficultyColorClass(question.DifficultyLevel)}`} />
                                          <input
                                            type="checkbox"
                                            checked={checkedState[sectionName]?.[questionIndex] || false}
                                            onChange={() => handleQuestionSelection(sectionName, questionIndex)}
                                          />
                                          <div>{questionIndex + 1}.</div>
                                          <div>{question.Question}</div>
                                        </div>
                                        <div className="flex gap-2">
                                          <p className="border-r-gray-600 border"></p>
                                          <div className="w-40 mt-2">{question.QuestionType}</div>
                                          <p className="border-r-gray-600 border"></p>
                                          <div className="mt-2 w-10">{question.Score}</div>
                                          <button type="button" className="text-xl text-black p-2" onClick={() => handleEditClick(question)}>
                                            <SlPencil />
                                          </button>
                                          <button type="button" className="text-xl text-black p-2" onClick={() => handleDeleteIconClick(questionIndex, sectionName)}>
                                            <RiDeleteBin6Line />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="SaveAndScheduleButtons" style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <button type="button" className="footer-button" onClick={handleBackButtonClick}>
                            Back
                          </button>
                          {checkedCount > 1 && (
                            <button
                              className="text-gray-600 hover:bg-gray-500 hover:text-white border rounded p-2"
                              onClick={handleBulkDeleteClick}
                            >
                              Delete
                            </button>
                          )}
                          <button onClick={handleSaveAll} className="footer-button">
                            Save
                          </button>
                        </div>

                        {isPopupOpen2 && (
                          <div
                            style={{ zIndex: "9999" }}
                            className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center"
                          >
                            <div
                              ref={popupRef}
                              className="absolute top-0  bg-white p-8 rounded-lg shadow-lg mt-16"
                            >
                              <div className="text-center">
                                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                                <h3 className="mb-5 text-lg font-normal text-gray-500">
                                  Are you sure you want to delete{" "}
                                </h3>
                                <div className="flex justify-center gap-4">
                                  <button
                                    className="text-gray-600 hover:bg-gray-500  hover:text-white border rounded p-2"
                                    onClick={confirmDelete2}
                                  >
                                    Delete
                                  </button>
                                  <button
                                    className="text-gray-600 hover:bg-gray-500 border hover:text-white rounded p-2"
                                    onClick={cancelDelete2}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirmation Popup */}
                {isPopupOpen && (
                  <div
                    style={{ zIndex: "9999" }}
                    className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center"
                  >
                    <div
                      ref={popupRef}
                      className="absolute top-0  bg-white p-8 rounded-lg shadow-lg mt-16"
                    >
                      <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500">
                          Are you sure you want to delete{" "}
                        </h3>
                        <div className="flex justify-center gap-4">
                          <button
                            className="text-gray-600 hover:bg-gray-500  hover:text-white border rounded p-2"
                            onClick={confirmDelete}
                          >
                            Yes, I'm sure
                          </button>
                          <button
                            className="text-gray-600 hover:bg-gray-500 border hover:text-white rounded p-2"
                            onClick={cancelDelete}
                          >
                            No, cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isDeleteConfirmationOpen && (
                  <div
                    style={{ zIndex: "9999" }}
                    className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center"
                  >
                    <div className="absolute top-0 bg-white p-8 rounded-lg shadow-lg mt-16">
                      <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500">
                          Are you sure you want to delete {isBulkDelete ? "the selected questions?" : "this question?"}
                        </h3>
                        <div className="flex justify-center gap-4">
                          <button
                            className="text-gray-600 hover:bg-gray-500 hover:text-white border rounded p-2"
                            onClick={confirmDeleteQuestion}
                          >
                            Yes, I'm sure
                          </button>
                          <button
                            className="text-gray-600 hover:bg-gray-500 border hover:text-white rounded p-2"
                            onClick={cancelDeleteQuestion}
                          >
                            No, cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isDeleteSectionConfirmationOpen && (
                  <div
                    style={{ zIndex: "9999" }}
                    className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center"
                  >
                    <div className="absolute top-0 bg-white p-8 rounded-lg shadow-lg mt-16">
                      <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500">
                          Are you sure you want to delete this section?
                        </h3>
                        <div className="flex justify-center gap-4">
                          <button
                            className="text-gray-600 hover:bg-gray-500 hover:text-white border rounded p-2"
                            onClick={confirmDeleteSection}
                          >
                            Yes, I'm sure
                          </button>
                          <button
                            className="text-gray-600 hover:bg-gray-500 border hover:text-white rounded p-2"
                            onClick={cancelDeleteSection}
                          >
                            No, cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isEditSectionModalOpen && (
                  <div
                    style={{ zIndex: "9999" }}
                    className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center"
                  >
                    <div className="absolute top-0 bg-white p-8 rounded-lg shadow-lg mt-16">
                      <div className="text-center">
                        <h3 className="mb-5 text-lg font-normal text-gray-500">
                          Edit Section Name
                        </h3>
                        <input
                          type="text"
                          value={editedSectionName}
                          onChange={(e) => setEditedSectionName(e.target.value)}
                          className="border p-2 rounded w-full"
                        />
                        <div className="flex justify-center gap-4 mt-4">
                          <button
                            className="text-gray-600 hover:bg-gray-500 hover:text-white border rounded p-2"
                            onClick={handleSaveSectionName}
                          >
                            Save
                          </button>
                          <button
                            className="text-gray-600 hover:bg-gray-500 border hover:text-white rounded p-2"
                            onClick={() => setIsEditSectionModalOpen(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isEditQuestionModalOpen && (
                  <Editassesmentquestion
                    sectionName={currentSectionName}
                    isOpen={isEditQuestionModalOpen}
                    selectedAssessmentType={selectedAssessmentType}
                    onClose={() => setIsEditQuestionModalOpen(false)}
                    selectedQuestion={selectedQuestion}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {showNewPositionContent && (
              <AddPositionForm onClose={handleclose} />
            )}
          </>
        )}
      </div>
    </React.Fragment>
  );
});

export default NewAssessment;
