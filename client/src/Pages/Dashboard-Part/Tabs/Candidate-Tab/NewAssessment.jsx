import React, { useState, useRef, useEffect, forwardRef, useCallback, } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-input-2/lib/style.css";
import AddQuestion1 from "../Assessment-Tab/AddQuestion1.jsx";
import AddSection1 from "./AddSection1.jsx";
import Editassesmentquestion from "./EditAssessmentquestion.jsx";
import AddPositionForm from "../Interviews/Addpositionform.jsx";
import { fetchFilterData } from "../../../../utils/dataUtils.js";
import { validateAssessmentData } from "../../../../utils/assessmentValidation.js";
import Cookies from "js-cookie";
import Sidebar from "../Assessment-Tab/PassScore.jsx";
import { usePermissions } from '../../../../PermissionsContext';
import { useMemo } from 'react';
import { format } from 'date-fns';
// import { handleShareClick as shareAssessment } from '../../../../utils/EmailShare';

import { ReactComponent as MdArrowDropDown } from '../../../../icons/MdArrowDropDown.svg';
import { ReactComponent as IoIosArrowUp } from '../../../../icons/IoIosArrowUp.svg';
import { ReactComponent as IoIosArrowDown } from '../../../../icons/IoIosArrowDown.svg';
import { ReactComponent as SlPencil } from '../../../../icons/SlPencil.svg';
import { ReactComponent as IoIosAddCircle } from '../../../../icons/IoIosAddCircle.svg';
import { ReactComponent as HiOutlineExclamationCircle } from '../../../../icons/HiOutlineExclamationCircle.svg';
import { ReactComponent as MdOutlineCancel } from '../../../../icons/MdOutlineCancel.svg';
import { ReactComponent as IoArrowBack } from '../../../../icons/IoArrowBack.svg';
import { ReactComponent as FaTrash } from '../../../../icons/FaTrash.svg';
import { ReactComponent as CgInfo } from '../../../../icons/CgInfo.svg';
import Candidate from "../Candidate-Tab/Candidate.jsx";

const NewAssessment = ({ onClose, onDataAdded }) => {
  const { sharingPermissionscontext } = usePermissions();
  const positionPermissions = useMemo(() => sharingPermissionscontext.position || {}, [sharingPermissionscontext]);

  const organizationId = Cookies.get("organizationId");
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
  // const [currentSectionName, setCurrentSectionName] = useState(null);
  const [toggleStates, setToggleStates] = useState([]);
  // const [selectedQuestion, setSelectedQuestion] = useState(null);
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
    AssessmentTitle: "",
    AssessmentType: "",
    Position: "",
    Duration: "",
    DifficultyLevel: "",
    NumberOfQuestions: "",
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
      [currentSectionName]: [
        ...(prevQuestions[currentSectionName] || []),
        questionData,
      ],
    }));
  };
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [currentSectionName, setCurrentSectionName] = useState('');

  // const handleQuestionAdded = (questionData) => {
  //   setQuestionsBySection((prevQuestions) => ({
  //     ...prevQuestions,
  //     [currentSectionName]: [
  //       ...(prevQuestions[currentSectionName] || []).filter(q => q._id !== questionData._id),
  //       questionData,
  //     ],
  //   }));
  //   setIsAddQuestionModalOpen(false);
  // };

  const resetActiveTab = () => {
    setActiveTab("Basicdetails");
  };

  const resetFormData = () => {
    setFormData({
      AssessmentTitle: "",
      AssessmentType: "",
      Skill_Technology: "",
      Position: "",
      Duration: "",
      DifficultyLevel: "",
      NumberOfQuestions: "",
      ExpiryDate: null,
    });
    setQuestionsBySection({});
    setSelectedAssessmentType("");
    setSelectedDuration("");
    setSelectedDifficulty("");
    setStartDate(null);
    setPosition("");
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

    if (name === "NumberOfQuestions") {
      setQuestionsLimit(Number(value));
    }

  };

  const handleCombinedSubmit = (e, path = null) => {
    e.preventDefault();

    const newErrors = validateAssessmentData(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setPosition(formData.Position);

    // if (path) {
    //   handleSaveAll();
    // } else {
    setActiveTab((prevTab) => {
      if (prevTab === "Basicdetails") return "Questions";
      if (prevTab === "Questions") return "Candidates";
      return "Basicdetails";
    });
    // }
  };
  const [assessmentId, setAssessmentId] = useState(null);
  const userName = Cookies.get("userName");
  // const handleSaveAll = async () => {
  //   try {
  //     const currentDateTime = format(new Date(), 'dd MMM, yyyy - hh:mm a');
  //     const assessmentData = {
  //       AssessmentTitle: formData.AssessmentTitle,
  //       AssessmentType: selectedAssessmentType,
  //       Position: formData.Position,
  //       Duration: selectedDuration,
  //       DifficultyLevel: selectedDifficulty,
  //       NumberOfQuestions: formData.NumberOfQuestions,
  //       ExpiryDate: startDate,
  //       Sections: matchingSection.map((sectionName) => ({
  //         SectionName: sectionName,
  //         Position: position,
  //         Questions: questionsBySection[sectionName].map((question) => ({
  //           ...question,
  //           Options: question.Options || [],
  //           ProgrammingDetails: question.ProgrammingDetails || null,
  //         })),
  //       })),
  //       CreatedBy: `${userName} at ${currentDateTime}`,
  //       LastModifiedById: userId,
  //       OwnerId: userId,
  //       CreatedDate: new Date(),
  //       // CandidateIds: selectedCandidateIds(),
  //     };
  //     console.log(selectedCandidateIds, "selectedCandidateIds");

  //     if (organizationId) {
  //       assessmentData.orgId = organizationId;
  //     }

  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL} / assessment`,
  //       assessmentData
  //     );
  //     if (response.data) {
  //       setAssessmentId(response.data._id);
  //       handleClose();
  //       onClose();
  //     } else {
  //       console.error("Unexpected response structure:", response);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error saving assessment, sections, and questions:",
  //       error.response.data
  //     );
  //   }
  // };

  const handleSaveAll = async () => {
    try {
      const currentDateTime = format(new Date(), 'dd MMM, yyyy - hh:mm a');
      const assessmentData = {
        AssessmentTitle: formData.AssessmentTitle,
        AssessmentType: selectedAssessmentType,
        Position: formData.Position,
        Duration: selectedDuration,
        DifficultyLevel: selectedDifficulty,
        NumberOfQuestions: formData.NumberOfQuestions,
        ExpiryDate: startDate,
        Sections: matchingSection.map((sectionName) => ({
          SectionName: sectionName,
          Position: position,
          Questions: questionsBySection[sectionName].map((question) => ({
            ...question,
            Hint: question.Hint || null,
            AutoAssessment: (question.QuestionType === 'Short Text(Single line)' || question.QuestionType === 'Long Text(Paragraph)') ? {
              enabled: question.AutoAssessment?.enabled,
              matching: question.AutoAssessment?.matching
            } : undefined,
            Options: question.Options || [],
            ProgrammingDetails: question.ProgrammingDetails || null,
          })),
          passScore: passScores[sectionName] || 0,
        })),
        totalScore: totalScore,
        passScore: overallPassScore, 
        CreatedBy: `${userName} at ${currentDateTime}`,
        LastModifiedById: userId,
        OwnerId: userId,
        CreatedDate: new Date(),
        candidateIds: selectedCandidates,
      };

      if (organizationId) {
        assessmentData.orgId = organizationId;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/assessment`,
        assessmentData
      );

      console.log(response.data, "response.data");
      if (response.data) {
        setAssessmentId(response.data._id);
        onDataAdded(response.data);

        // Close the form only if the user is on the "Basicdetails" or "Questions" tab
        if (activeTab === "Basicdetails" || activeTab === "Questions") {
          handleClose();
          onClose();
        }
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      throw error; // Re-throw the error to be caught in handleShareClick
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

  const handleOutsideClickForSection = useCallback(
    (event) => {
      if (
        sidebarRefForSection.current &&
        !sidebarRefForSection.current.contains(event.target)
      ) {
        closeSidebarForSection();
      }
    },
    [closeSidebarForSection]
  );

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

  const handleOutsideClickAddQuestion = useCallback(
    (event) => {
      if (
        sidebarRefAddQuestion.current &&
        !sidebarRefAddQuestion.current.contains(event.target)
      ) {
        closeSidebarAddQuestion();
      }
    },
    [closeSidebarAddQuestion]
  );

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
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/sections`
        );
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

  const userId = Cookies.get("userId");

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

  // const handleEditClick = (question) => {
  //   setSelectedQuestion(question);
  //   setIsEditQuestionModalOpen(true);
  //   setCurrentSectionName(question.SectionName);
  // };

  const handleEditClick = (question, sectionName) => {
    setSelectedQuestion(question);
    setCurrentSectionName(sectionName);
    setIsEditQuestionModalOpen(true);
  };

  useEffect(() => {
    const fetchSkillsData = async () => {
      // setLoading(true);
      try {
        const filteredPositions = await fetchFilterData(
          "position",
          positionPermissions
        );
        setPositions(filteredPositions);
      } catch (error) {
        console.error("Error fetching position data:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchSkillsData();
  }, [positionPermissions]);

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
    const extractedSkills = position.skills.map((skill) => skill.skill);
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

  // const handleSectionAdded = (newSection) => {
  //   const isSectionExists = selectedIcons.some(
  //     (section) =>
  //       section.SectionName === newSection.SectionName &&
  //       section.Position === position
  //   );
  //   if (isSectionExists) {
  //     alert(
  //       `Section "${newSection.SectionName}" already exists for position "${position}".`
  //     );
  //     return;
  //   }
  //   setMatchingSection((prevSections) => [
  //     ...prevSections,
  //     newSection.SectionName,
  //   ]);
  //   setQuestionsBySection((prevQuestions) => ({
  //     ...prevQuestions,
  //     [newSection.SectionName]: prevQuestions[newSection.SectionName] || [],
  //   }));
  // };

  const [selectedSkills, setSelectedSkills] = useState([]);

  // const handleSectionAdded = (data) => {
  //   const { SectionName, Skills } = data;

  //   // Add the customized section name to the matching sections
  //   setMatchingSection((prevSections) => {
  //     const uniqueSections = [...new Set([...prevSections, SectionName])]; // Add the new section name
  //     return uniqueSections;
  //   });

  //   const newSections = Skills.map(skill => skill);

  //   setMatchingSection((prevSections) => {
  //     const uniqueSections = [...new Set([...prevSections, ...newSections])];
  //     return uniqueSections;
  //   });

  //   setQuestionsBySection((prevQuestions) => {
  //     const updatedQuestions = { ...prevQuestions };
  //     newSections.forEach((sectionName) => {
  //       if (!updatedQuestions[sectionName]) {
  //         updatedQuestions[sectionName] = [];
  //       }
  //     });
  //     return updatedQuestions;
  //   });

  //   setSelectedSkills([]);
  // };

  const [addedSections, setAddedSections] = useState([]);

  const handleSectionAdded = (data) => {
    const { SectionName, Questions } = data;

    // Check if SectionName is not empty before adding
    if (SectionName) {
      setMatchingSection((prevSections) => {
        const uniqueSections = [...new Set([...prevSections, SectionName])];
        return uniqueSections;
      });

      // Add the section name to the addedSections state
      setAddedSections((prevSections) => [...prevSections, SectionName]);

      // Initialize questions for the new section
      setQuestionsBySection((prevQuestions) => {
        const updatedQuestions = { ...prevQuestions };
        if (!updatedQuestions[SectionName]) {
          updatedQuestions[SectionName] = Questions || [];
        }
        return updatedQuestions;
      });
    }
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
    setActiveTab("Basicdetails");
  };

  const handleBackButtonClickCandidate = () => {
    setActiveTab("Questions")
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/newquestion`
        );
        setQuestionsBySection(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
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
          updatedQuestions[updatedSectionName] =
            updatedQuestions[matchingSection[editingIndex]];
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
    setCheckedState((prevState) => {
      const isChecked = !prevState[sectionName]?.[questionIndex];
      const newCheckedState = {
        ...prevState,
        [sectionName]: {
          ...prevState[sectionName],
          [questionIndex]: isChecked,
        },
      };

      const newCheckedCount = Object.values(newCheckedState).reduce(
        (count, section) => {
          return count + Object.values(section).filter(Boolean).length;
        },
        0
      );

      setCheckedCount(newCheckedCount);
      return newCheckedState;
    });
  };

  const confirmDelete2 = () => {
    setQuestionsBySection((prevState) => {
      const newQuestionsBySection = { ...prevState };

      Object.keys(checkedState).forEach((sectionName) => {
        newQuestionsBySection[sectionName] = newQuestionsBySection[
          sectionName
        ].filter(
          (_, questionIndex) => !checkedState[sectionName][questionIndex]
        );
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
          newQuestionsBySection[sectionName] = newQuestionsBySection[
            sectionName
          ].filter(
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
          updatedQuestions[sectionToDeleteFrom] = updatedQuestions[
            sectionToDeleteFrom
          ].filter((_, index) => index !== questionToDelete);
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

  const [isDeleteSectionConfirmationOpen, setIsDeleteSectionConfirmationOpen] =
    useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [sectionIndexToDelete, setSectionIndexToDelete] = useState(null);

  const confirmDeleteSection = () => {
    if (sectionToDelete !== null && sectionIndexToDelete !== null) {
      setMatchingSection((prevSections) =>
        prevSections.filter((_, i) => i !== sectionIndexToDelete)
      );
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
      className="focus:border-black focus:outline-none"
      value={value}
      onClick={onClick}
      ref={ref}
    />
  ));


  // mansoor
  const [questionsLimit, setQuestionsLimit] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOutsideClick = useCallback((event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      closeSidebar();
    }
  }, []);

  const [totalScore, setTotalScore] = useState(0);

  // Function to calculate total score
  const calculateTotalScore = () => {
    let score = 0;
    matchingSection.forEach(section => {
      if (questionsBySection[section]) {
        questionsBySection[section].forEach(question => {
          score += Number(question.Score) || 0; // Ensure score is treated as a number
        });
      }
    });
    setTotalScore(score);
  };

  // Effect to recalculate total score whenever questions change
  useEffect(() => {
    calculateTotalScore();
  }, [questionsBySection]);

  const [passScores, setPassScores] = useState({});
  const [overallPassScore, setOverallPassScore] = useState(0);

  // Initialize passScores for each section to 0
  useEffect(() => {
    const initialPassScores = {};
    matchingSection.forEach(sectionName => {
      initialPassScores[sectionName] = 0;
    });
    setPassScores(initialPassScores);
  }, [matchingSection]);

  const handlePassScoreSave = (scores) => {
    if (scores.overall !== undefined) {
      setOverallPassScore(scores.overall);
    } else {
      setPassScores(scores);
    }
  };

  const handleSaveAndNext = () => {
    const isAnySectionPassScoreSet = Object.values(passScores).some(score => score > 0);

    if (overallPassScore > 0 || isAnySectionPassScoreSet) {
      setActiveTab("Candidates");
    } else {
      setSidebarOpen(true);
    }
  };

  const [candidateData, setCandidateData] = useState([]);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/candidate`);
        setCandidateData(response.data);
      } catch (error) {
        console.error('Error fetching candidate data:', error);
      }
    };

    fetchCandidateData();
  }, []);


  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectCandidates = (candidates) => {
    setSelectedCandidates(candidates);
  };

  // ashraf


  const handleShareClick = async () => {
    try {
      setIsLoading(true);
      await handleSaveAll(); // Ensure this is awaited
      console.log(selectedCandidates);
      console.log(assessmentId);

      if (!assessmentId) {
        console.error('Failed to save assessment or retrieve assessmentId');
        return;
      }

      if (selectedCandidates.length === 0) {
        setErrors({ ...errors, Candidate: "Please select at least one candidate." });
        return;
      }

      // Update candidates with the new assessmentId
      await axios.post(`${process.env.REACT_APP_API_URL}/update-candidates`, {
        candidateIds: selectedCandidates,
        assessmentId: assessmentId
      });

      // Send emails to the selected candidates
      const candidateEmails = selectedCandidates.map(id => {
        const candidate = candidateData.find(c => c._id === id);
        return candidate ? candidate.Email : null;
      }).filter(email => email !== null);

      if (candidateEmails.length > 0) {
        await axios.post(`${process.env.REACT_APP_API_URL}/send-assessment-link`, {
          candidateEmails,
          assessmentId: assessmentId,
        });
        console.log('Emails sent successfully');
      } else {
        console.error('No valid candidate emails found');
      }

      // Close the form after successful share logic
      handleClose();
      onClose();
    } catch (error) {
      console.error('Error during share process:', error);
    } finally {
      setIsLoading(false); // Ensure loading is stopped in all cases
    }
  };


  // const handleShareClick = () => {
  //   shareAssessment({
  //     selectedCandidates,
  //     candidateData,
  //     assessmentId,
  //     selectedIcons2,
  //     setErrors,
  //     setIsLoading,
  //     // setIsSuccess,
  //     // onCloseshare,
  //     handleSaveAll, // Pass the handleSaveAll function
  //   });
  // };
  const calculateCheckedCount = () => {
    return Object.values(questionsBySection).reduce((total, questions) => {
      return total + (questions ? questions.length : 0);
    }, 0);
  };

  useEffect(() => {
    setCheckedCount(calculateCheckedCount());
  }, [questionsBySection]);


  const [isLimitReachedPopupOpen, setIsLimitReachedPopupOpen] = useState(false);
  const toggleSidebarAddQuestion = (sectionName) => {
    if (checkedCount >= questionsLimit) {
      setIsLimitReachedPopupOpen(true);
      return;
    }
    setSelectedQuestion(null); // Reset selected question for adding new
    setCurrentSectionName(sectionName);
    setIsAddQuestionModalOpen(true); // Open the modal
  };

  const closeLimitReachedPopup = () => {
    setIsLimitReachedPopupOpen(false);
  };

  const handleDeleteSectionClick = (index, sectionName) => {
    // Remove the section from matchingSection and questionsBySection
    setMatchingSection((prevSections) => prevSections.filter((_, i) => i !== index));
    setQuestionsBySection((prevQuestions) => {
      const updatedQuestions = { ...prevQuestions };
      delete updatedQuestions[sectionName];
      return updatedQuestions;
    });

    // Update addedSections to reflect the deletion
    setAddedSections((prevSections) => prevSections.filter((name) => name !== sectionName));
  };

  const [isSelectCandidatePopupOpen, setIsSelectCandidatePopupOpen] = useState(false);

  const handleShareButtonClick = () => {
    if (selectedCandidates.length === 0) {
      setIsSelectCandidatePopupOpen(true);
    } else {
      handleShareClick();
    }
  };

  const handleQuestionUpdated = (updatedQuestion) => {
    console.log("Updating question:", updatedQuestion);
  
    setQuestionsBySection((prevQuestions) => {
      const updatedQuestions = { ...prevQuestions };
      const sectionQuestions = updatedQuestions[updatedQuestion.SectionName] || [];
      const questionIndex = sectionQuestions.findIndex(q => q._id === updatedQuestion._id);
  
      console.log("Current section questions:", sectionQuestions);
      console.log("Question index found:", questionIndex);
  
      if (questionIndex !== -1) {
        sectionQuestions[questionIndex] = updatedQuestion; // Update the existing question
        console.log("Question updated:", sectionQuestions[questionIndex]);
      } else {
        sectionQuestions.push(updatedQuestion); // Add as new if not found
        console.log("Question added:", updatedQuestion);
      }
  
      updatedQuestions[updatedQuestion.SectionName] = sectionQuestions;
      console.log("Updated questions by section:", updatedQuestions);
      return updatedQuestions;
    });
  };

  return (
    <React.Fragment>
      <div>
        {showMainContent ? (
          <div className="bg-white">
            {/* Header */}
            <div className="fixed w-full bg-white border-b top-[55px] z-10">
              <div className="flex justify-between sm:justify-start items-center mx-10 py-3">
                <button
                  onClick={onClose}
                  className="focus:outline-none md:hidden lg:hidden xl:hidden 2xl:hidden sm:w-8"
                >
                  <IoArrowBack className="text-2xl" />
                </button>
                <h2 className="text-lg font-bold">New Assessment</h2>
              </div>
            </div>

            {/* Content */}
            <div className="mb-20 pt-1">
              <div>
                <div>
                  <div className="flex justify-center gap-3 mt-16">
                    <div
                      className={`rounded h-2 w-24 border ${activeTab === "Basicdetails" ? "bg-[#F9CB7B]" : "bg-blue-400"
                        }`}
                    ></div>
                    <div
                      className={`rounded h-2 w-24 border ${activeTab === "Questions"
                        ? "bg-[#F9CB7B]"
                        : activeTab === "Candidates"
                          ? "bg-blue-400"
                          : "bg-gray-400"
                        }`}
                    ></div>
                    <div
                      className={`rounded h-2 w-24 border ${activeTab === "Candidates" ? "bg-[#F9CB7B]" : "bg-gray-400"
                        }`}
                    ></div>
                  </div>
                  <div>
                    {/* basic details tab content */}
                    {activeTab === "Basicdetails" && (
                      <>
                        <form className="group mx-10">
                          <div className="font-semibold text-xl mb-5 mt-3">
                            Assessment Details:
                          </div>
                          {/* Assessment Name and Type */}
                          <div className="gap-5 grid grid-cols-2">
                            <div className="flex flex-col col-span-1">
                              <div className="flex items-center gap-10">
                                <label
                                  htmlFor="AssessmentTitle"
                                  className="block text-sm font-medium leading-6 text-gray-800 -mt-5"
                                >
                                  Assessment Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="AssessmentTitle"
                                  id="AssessmentTitle"
                                  value={formData.AssessmentTitle}
                                  onChange={handleChange}
                                  autoComplete="off"
                                  className={`border-b focus:outline-none mb-5 flex-grow ${errors.AssessmentTitle
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-black"
                                    }`}
                                />
                              </div>
                              {errors.AssessmentTitle && (
                                <p className="text-red-500 text-sm">{errors.AssessmentTitle}</p>
                              )}
                            </div>

                            <div className="flex flex-col col-span-1">
                              <div className="flex gap-10">
                                <label
                                  htmlFor="AssessmentType"
                                  className="block text-sm font-medium leading-6 text-gray-800"
                                >
                                  Assessment Type <span className="text-red-500">*</span>
                                </label>
                                <div className="flex-grow relative">
                                  <div
                                    className="border-b border-gray-300 max-w-[432px] focus:border-black min-h-6 focus:outline-none flex-grow flex flex-wrap items-center gap-2 cursor-pointer mt-1"
                                    onClick={toggleDropdownAssessment}
                                  >
                                    {Array.isArray(selectedAssessmentType) &&
                                      selectedAssessmentType.map((type) => (
                                        <div
                                          key={type}
                                          className="flex items bg-gray-200 rounded text-xs p-1 -mt-1 mb-1"
                                        >
                                          {type}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveAssessmentType(type);
                                            }}
                                            className="ml-2 text-xs bg-slate-300 rounded px-2"
                                          >
                                            X
                                          </button>
                                        </div>
                                      ))}
                                    <MdArrowDropDown className="absolute right-0 top-3 text-gray-500 text-lg cursor-pointer" />
                                    {selectedAssessmentType.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedAssessmentType([]);
                                          setFormData((prevData) => ({
                                            ...prevData,
                                            AssessmentType: [],
                                          }));
                                        }}
                                        className="absolute -right-7 top-1 mt-1 mr-6 text-xs bg-slate-300 rounded px-2"
                                      >
                                        X
                                      </button>
                                    )}
                                  </div>
                                  {showDropdownAssessment && (
                                    <div className="absolute z-50 mt-1 w-full bg-white shadow-lg text-sm rounded-sm border">
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
                                  {errors.AssessmentType && (
                                    <p className="text-red-500 text-sm mt-1">{errors.AssessmentType}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* No. of Questions */}
                          <div className="grid grid-cols-2 gap-5 mb-8 mt-3">
                            <div className="flex flex-col col-span-1">
                              <div className="flex items-center gap-12">
                                <label
                                  htmlFor="NumberOfQuestions"
                                  className="block text-sm font-medium leading-6 text-gray-800 -mt-3"
                                >
                                  No. of Questions <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="NumberOfQuestions"
                                  value={formData.NumberOfQuestions}
                                  onChange={handleChange}
                                  id="NumberOfQuestions"
                                  min="1"
                                  max="50"
                                  autoComplete="off"
                                  className={`border-b focus:outline-none mb-5 flex-grow ${errors.NumberOfQuestions
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-black"
                                    }`}
                                />
                              </div>
                              {errors.NumberOfQuestions && (
                                <p className="text-red-500 text-sm">{errors.NumberOfQuestions}</p>
                              )}
                            </div>
                          </div>
                          <div className="border-b mb-8"></div>

                          <div className="font-semibold text-xl mb-8">
                            Position & Requirements:
                          </div>

                          {/* Position */}
                          <div className="gap-5 grid grid-cols-2">
                            <div className="flex flex-col col-span-1">
                              <div className="flex items-center gap-[72px]">
                                <label className="text-sm font-medium leading-6 text-gray-800 w-24 -mt-6">
                                  Position
                                  <div className="relative inline-block">
                                    <CgInfo
                                      className="ml-2 text-gray-500 cursor-pointer"
                                      onClick={handleIconClick}
                                    />
                                    {showMessage && (
                                      <div className="absolute bottom-full mb-2 left-0 w-max bg-white text-gray-700 border border-gray-300 rounded p-2 text-xs">
                                        Depending on the position, we can offer
                                        sections with tailored questions.
                                      </div>
                                    )}
                                  </div>
                                </label>

                                <div className="relative flex-grow">
                                  <div className="relative">
                                    <div className="relative mb-5">
                                      {selectedPosition.title ? (
                                        <div className="border-b border-gray-300 focus:border-black focus:outline-none w-full h-6 flex items-center text-xs">
                                          <div className="bg-slate-200 rounded  inline-block mr-2 p-1 mb-2">
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
                                    <MdArrowDropDown
                                      className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0"
                                      onClick={toggleDropdownPosition}
                                    />
                                    {/* Dropdown */}
                                    {showDropdownPosition && (
                                      <div className="absolute border z-50 -mt-4 mb-5 w-full rounded-sm bg-white shadow-lg">
                                        <p className="font-medium px-4 py-1 border-b">
                                          Recent Positions
                                        </p>
                                        <div className="h-36 text-sm overflow-y-auto">
                                          <div>
                                            {positions.map((position) => (
                                              <p
                                                key={position._id}
                                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                onClick={() =>
                                                  handlePositionSelect(position)
                                                }
                                              >
                                                {position.title}
                                              </p>
                                            ))}
                                          </div>
                                        </div>
                                        <p
                                          className="flex cursor-pointer shadow-md border-t p-1 rounded"
                                          onClick={handleAddNewPositionClick}
                                        >
                                          <IoIosAddCircle className="text-2xl" />
                                          <span>Add New Position</span>
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Difficulty Level */}
                            <div className="flex flex-col col-span-1">
                              <div className="flex items-center gap-[60px]">
                                <label
                                  htmlFor="difficulty"
                                  className="block text-sm font-medium leading-6 text-gray-800 -mt-5"
                                >
                                  Difficulty Level <span className="text-red-500">*</span>
                                </label>

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
                                    <div className="absolute z-50 -mt-4 mb-5 w-full rounded-sm bg-white shadow-lg border">
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
                            </div>
                          </div>
                          <div className="border-b mb-8"></div>

                          <div className="font-semibold text-xl mb-5">
                            Timing & Validity:
                          </div>

                          {/* Duration */}
                          <div className="flex gap-5 mb-9">
                            <div className="flex flex-col w-1/2">
                              <div className="flex items-center gap-[72px]">
                                <label
                                  htmlFor="duration"
                                  className="block text-sm font-medium leading-6 text-gray-800 w-24 -mt-5"
                                >
                                  Duration{" "}
                                  <span className="text-red-500">*</span>
                                </label>

                                <div className="relative flex-grow">
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="duration"
                                      className={`border-b focus:outline-none mb-5 w-full ${errors.Duration
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-black"
                                        }`}
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
                                    <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg h-20 overflow-y-auto">
                                      {durations.map((duration) => (
                                        <div
                                          key={duration}
                                          className="py-2 px-2 cursor-pointer hover:bg-gray-100 text-sm"
                                          onClick={() =>
                                            handleDurationSelect(duration)
                                          }
                                        >
                                          {duration}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
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
                                  <MdOutlineCancel
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
                                        className="bg-custom-blue text-white py-2 px-4 rounded hover:bg-custom-blue"
                                        onClick={handleUpgrade}
                                      >
                                        Upgrade
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Expiry date */}
                            <div className="flex flex-col w-1/2">
                              <div className="flex items-center gap-[68px]">
                                <label
                                  htmlFor="expiry"
                                  className="block text-sm font-medium leading-6 text-gray-800 w-24 -mt-5"
                                >
                                  Expiry Date
                                  <span className="text-red-500">*</span>
                                </label>

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
                                </div>
                                {errors.ExpiryDate && (
                                  <p className="text-red-500 text-sm -mt-4">
                                    {errors.ExpiryDate}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>


                          <div className="SaveAndScheduleButtons">
                            <div>
                              <p className="cursor-pointer border border-custom-blue px-4 rounded p-2 mx-7" onClick={onClose}>Cancel</p>
                            </div>
                            <div className="mr-7">
                              <button
                                type="submit"
                                onClick={handleSaveAll}
                                className="footer-button mr-[10px]"
                              >
                                Save
                              </button>

                              <button
                                type="submit"
                                onClick={(event) => handleCombinedSubmit(event)}
                                className="footer-button"
                              >
                                Save & Next
                              </button>
                            </div>
                          </div>
                        </form>
                      </>
                    )}
                    {/* question tab content */}
                    {activeTab === "Questions" && (

                      <div>
                        <div className="flex justify-between mb-8 mt-7 mx-10">
                          <p className="font-md">
                            Questions: {checkedCount > 0 ? checkedCount : 0} / {questionsLimit}
                          </p>
                          <p className="font-md">
                            Total Score: {totalScore}
                          </p>
                          <p className="font-md">Pass Score : {overallPassScore || '0'}</p>
                        </div>
                        <div className="overflow-x-auto relative" style={{ overflowX: "auto" }}>
                          <div className="border p-2 flex justify-between bg-gray-200 items-center">
                            <p className="font-bold ml-8">Questions</p>
                            <button
                              className="border rounded px-2 py-1 bg-custom-blue text-white text-md mr-8"
                              onClick={toggleSidebarForSection}
                            >
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
                              selectedSkills={selectedSkills}
                              setSelectedSkills={setSelectedSkills}
                              addedSections={addedSections}
                            />
                          </div>
                          {matchingSection.length > 0 &&
                            matchingSection.map((sectionName, index) => (
                              <div key={index} className="text-md justify-between">
                                <div className="flex justify-between bg-gray-100 p-2">
                                  <div className="flex">
                                    <div className="flex items-center font-bold">
                                      <p className="pr-4 sm:pr-0 ml-2 sm:ml-0 w-36 sm:w-24 sm:text-xs">
                                        {Array.isArray(questionsBySection[sectionName]) && questionsBySection[sectionName].length > 0 && (
                                          <span className="bg-white px-2 py-0 mr-2 rounded-sm">
                                            {questionsBySection[sectionName].length}
                                          </span>
                                        )}
                                        {sectionName}
                                      </p>
                                    </div>
                                    <p className="border-r-gray-600 border"></p>
                                    <div
                                      className="flex items-center sm:text-xs"
                                      onClick={() => {
                                        toggleSidebarAddQuestion(sectionName);
                                      }}
                                    >
                                      <p className="rounded px-2 ml-2 sm:ml-0 cursor-pointer text-custom-blue">
                                        Add Questions
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex">
                                    <p className="p-2">Pass Score : {passScores[sectionName] || '0'}</p>
                                    <p className="border-r-gray-600 border"></p>
                                    <button
                                      type="button"
                                      className="text-xl text-black p-2"
                                      onClick={() => handleEditSection(index, sectionName)}
                                    >
                                      <SlPencil />
                                    </button>
                                    <button
                                      type="button"
                                      className="text-xl text-black p-2"
                                      onClick={() => handleDeleteSectionClick(index, sectionName)}
                                    >
                                      <FaTrash />
                                    </button>
                                    <p className="border-r-gray-600 border"></p>
                                    <div
                                      className="flex items-center text-3xl ml-3 mr-3 cursor-pointer"
                                      onClick={() => toggleArrow1(index)}
                                    >
                                      {toggleStates[index] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                    </div>
                                  </div>
                                </div>

                                {isAddQuestionModalOpen && (
                                  <AddQuestion1
                                    isOpen={isAddQuestionModalOpen}
                                    onClose={() => setIsAddQuestionModalOpen(false)}
                                    sectionName={currentSectionName}
                                    onQuestionAdded={handleQuestionAdded}
                                    selectedAssessmentType={selectedAssessmentType}
                                    questionsLimit={questionsLimit}
                                    checkedCount={checkedCount}
                                  />
                                )}

                                <div
                                  className="p-2"
                                  style={{
                                    display: toggleStates[index] ? "block" : "none",
                                  }}
                                >
                                  {Array.isArray(questionsBySection[sectionName]) &&
                                    questionsBySection[sectionName].map((question, questionIndex) => (
                                      <div key={question._id} className="border sm:p-0 border-gray-300 mb-2 text-sm">
                                        <div className="flex justify-between">
                                          <div className="flex items-center gap-1">
                                            <hr
                                              className={`w-1 h-10 ${getDifficultyColorClass(
                                                question.DifficultyLevel
                                              )}`}
                                            />
                                            <input
                                              type="checkbox"
                                              checked={
                                                checkedState[sectionName]?.[questionIndex] || false
                                              }
                                              onChange={() =>
                                                handleQuestionSelection(sectionName, questionIndex)
                                              }
                                            />
                                            <div className="sm:-mt-[2px]">
                                              {questionIndex + 1}.
                                            </div>
                                            <div className="sm:-mt-[2px] sm:w-[40px] sm:overflow-hidden sm:text-ellipsis sm:whitespace-nowrap">
                                              {question.Question}
                                            </div>
                                          </div>
                                          <div className="flex gap-2">
                                            <p className="border-r-gray-600 border"></p>
                                            <div className="w-40 mt-2 sm:mt-[9px]">
                                              {question.QuestionType}
                                            </div>
                                            <p className="border-r-gray-600 border"></p>
                                            <div className="mt-2 w-10 sm:mt-[9px]">
                                              {question.Score}
                                            </div>
                                            <button
                                              type="button"
                                              className="text-xl text-black p-2"
                                              onClick={() => handleEditClick(question, sectionName)}
                                            >
                                              <SlPencil />
                                            </button>
                                            <button
                                              type="button"
                                              className="text-xl text-black p-2"
                                              onClick={() =>
                                                handleDeleteIconClick(questionIndex, sectionName)
                                              }
                                            >
                                              <FaTrash />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                        </div>

                        <div
                          className="SaveAndScheduleButtons"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <button
                            type="button"
                            className="footer-button"
                            onClick={handleBackButtonClick}
                          >
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

                          <div className="SaveAndScheduleButtons">
                            <div>
                              <p className="cursor-pointer border border-custom-blue rounded p-2 ml-8 px-4" onClick={handleBackButtonClick}>Back</p>
                            </div>
                            <div className="mr-8">
                              <button
                                type="submit"
                                onClick={handleSaveAll}
                                className="footer-button mr-[10px]"
                              >
                                Save
                              </button>

                              <button
                                type="submit"
                                onClick={handleSaveAndNext}
                                className="footer-button"
                              >
                                Save & Next
                              </button>
                            </div>
                          </div>

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

                    {activeTab === "Candidates" && (
                      <>
                        <Candidate isAssessmentContext={true} onSelectCandidates={handleSelectCandidates} />
                        <div className="customFooter z-50">
                          <div>
                            <p className="cursor-pointer border border-custom-blue rounded p-2 ml-8 px-4" onClick={handleBackButtonClickCandidate}>Back</p>
                          </div>
                          <div className="mr-8">
                            <button className="cursor-pointer border rounded p-2 mr-3" onClick={handleSaveAll}>skip</button>
                            <button
                              type="submit"
                              onClick={handleShareButtonClick}
                              className="footerButton bg-custom-blue mr-[10px]"
                            >
                              Share
                            </button>
                          </div>
                        </div>
                      </>
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
                          Are you sure you want to delete{" "}
                          {isBulkDelete
                            ? "the selected questions?"
                            : "this question?"}
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

                {isLimitReachedPopupOpen && (
                  <div
                    style={{ zIndex: "9999" }}
                    className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center"
                  >
                    <div className="absolute top-0 bg-white p-8 rounded-lg shadow-lg mt-16">
                      <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500">
                          {/* Question limit reached. Please go back and increase the limit if you want to add more questions. */}
                          Question limit reached. Please go back to previous step to increase the number of questions.
                        </h3>
                        <div className="flex justify-center gap-4">
                          <button
                            className="text-gray-600 hover:bg-gray-500 hover:text-white border rounded p-2"
                            onClick={closeLimitReachedPopup}
                          >
                            OK
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
                    onQuestionAdded={handleQuestionAdded}
                    onSave={handleQuestionUpdated}
                  />
                )}
                {sidebarOpen && (
                  <div className={"fixed inset-0 bg-black bg-opacity-15 z-50"}>
                    <div className="fixed inset-y-0 right-0 z-50 w-1/2 bg-white shadow-lg transition-transform duration-5000 transform">
                      <Sidebar
                        sections={matchingSection}
                        questionsBySection={questionsBySection}
                        onClose={() => setSidebarOpen(false)}
                        onSave={handlePassScoreSave}
                        onOutsideClick={handleOutsideClick}
                        ref={sidebarRef}
                      />
                    </div>
                  </div>
                )}

                {isSelectCandidatePopupOpen && (
                  <div
                    style={{ zIndex: "9999" }}
                    className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center"
                  >
                    <div className="absolute top-0 bg-white p-8 rounded-lg shadow-lg mt-16">
                      <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500">
                          Please select at least one candidate to share the assessment.
                        </h3>
                        <div className="flex justify-center gap-4">
                          <button
                            className="text-gray-600 hover:bg-gray-500 hover:text-white border rounded p-2"
                            onClick={() => setIsSelectCandidatePopupOpen(false)}
                          >
                            OK
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
};

export default NewAssessment;
