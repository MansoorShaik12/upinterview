import React, { useState, useRef, useEffect } from "react";
import "../styles/tabs.scss";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { IoIosAddCircle } from 'react-icons/io';
import { MdArrowDropDown, MdOutlineCancel } from 'react-icons/md';
import PopupComponent from "../Interviews/OutsourceOption";

const Position_Form = ({ onClose, onPositionAdded }) => {
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [roundStep, setRoundStep] = useState(0);
  const [selectedRound, setSelectedRound] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("1 hour");
  const [roundEntries, setRoundEntries] = useState([]);
  const [editingRoundIndex, setEditingRoundIndex] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    companyname: "",
    jobdescription: "",
    minexperience: "",
    maxexperience: "",
    skills: [],
    additionalnotes: "",
  });

  const [errors, setErrors] = useState("");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: errorMessage });
    setUnsavedChanges(true);
  };

  const handleClose = () => {
    const isFormEmpty =
      !formData.title &&
      !formData.companyname &&
      !formData.jobdescription &&
      !formData.minexperience &&
      !formData.maxexperience &&
      formData.skills.length === 0 &&
      !formData.additionalnotes &&
      entries.length === 0 &&
      roundEntries.length === 0;

    if (!isFormEmpty) {
      setShowConfirmationPopup(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmationPopup(false);
    setUnsavedChanges(false);
    resetForm();
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmationPopup(false);
  };
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = {
      title: "Title is required",
      companyname: "Company Name is required",
      jobdescription: "Job Description is required",
      minexperience: "Min Experience is required",
      maxexperience: "Max Experience is required",
    };
    let formIsValid = true;
    const newErrors = { ...errors };
  
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]) {
        newErrors[field] = message;
        formIsValid = false;
      }
    });
  
    // Check if at least one skill is added
    if (entries.length === 0) {
      newErrors.skills = "At least one skill is required";
      formIsValid = false;
    }
  
    // Check if at least one round is added
    if (roundEntries.length === 0) {
      newErrors.rounds = "At least one round is required";
      formIsValid = false;
    }
  
    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }
  
    const data = {
      ...formData,
      companyname: selectedCompany,
      skills: entries.map(entry => ({
        skill: entry.skills[0],
        experience: entry.experience,
        expertise: entry.expertise,
      })),
      minexperience: parseInt(selectedMinExperience),
      maxexperience: parseInt(selectedMaxExperience),
      rounds: roundEntries,
      CreatedBy: userId,
    };
  
    try {
      // Check if a position with the same title, company, and experience range already exists
      const checkResponse = await axios.post(`${process.env.REACT_APP_API_URL}/position/check`, {
        title: formData.title,
        companyname: selectedCompany,
        minexperience: formData.minexperience,
        maxexperience: formData.maxexperience,
      });
  
      if (checkResponse.data.exists) {
        alert("A position with the same title, company, and experience range already exists.");
        return;
      }
  
      // If no such position exists, proceed with creation
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/position`, data);
      const newPosition = response.data;
      console.log("Position created:", response.data);
      onPositionAdded(newPosition);
    } catch (error) {
      console.error("Error creating position:", error);
    }
  
    setUnsavedChanges(false);
    resetForm();
    onClose();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const modalRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
    }
  };

  const [skills, setSkills] = useState([]);
  useEffect(() => {
    const fetchskillsData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/skills`);
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching SkillsData:", error);
      }
    };
    fetchskillsData();
  }, []);

  const [selectedMinExperience, setSelectedMinExperience] = useState("");
  const [showDropdownMinExperience, setShowDropdownMinExperience] =
    useState(false);
  const minExperienceOptions = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];

  const toggleDropdownMinExperience = () => {
    setShowDropdownMinExperience(!showDropdownMinExperience);
  };

  const handleMinExperienceSelect = (value) => {
    setSelectedMinExperience(value);
    setShowDropdownMinExperience(false);
    setFormData({
      ...formData,
      minexperience: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      minexperience: "",
    }));

    // Reset max experience when min experience changes
    setSelectedMaxExperience(""); // Reset max experience
  };

  const [selectedMaxExperience, setSelectedMaxExperience] = useState("");
  const [showDropdownMaxExperience, setShowDropdownMaxExperience] =
    useState(false);
  const maxExperienceOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "10+", label: "10+" },
  ].filter(option => parseInt(option.value) > parseInt(selectedMinExperience));

  const toggleDropdownMaxExperience = () => {
    setShowDropdownMaxExperience(!showDropdownMaxExperience);
  };

  const handleMaxExperienceSelect = (value) => {
    // Check if the selected max experience is less than or equal to the selected min experience
    if (parseInt(value) <= parseInt(selectedMinExperience)) {
      alert("Max experience must be greater than Min experience.");
      return; // Exit the function if the condition is not met
    }
    setSelectedMaxExperience(value);
    setShowDropdownMaxExperience(false);
    setFormData({
      ...formData,
      maxexperience: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      maxexperience: "",
    }));
  };

  const [additionalNotesValue, setAdditionalNotesValue] = useState("");
  const [description, setdescription] = useState("");

  const handleChangedescription = (event) => {
    const value = event.target.value;
    if (value.length <= 1000) {
      setdescription(value);
      event.target.style.height = "auto";
      event.target.style.height = event.target.scrollHeight + "px";
      setFormData({ ...formData, jobdescription: value });

      setErrors({ ...errors, jobdescription: "" });
    }
  };
  const handleAdditionalNotesChange = (event) => {
    const value = event.target.value;
    if (value.length <= 250) {
      setAdditionalNotesValue(value);
      event.target.style.height = "auto";
      event.target.style.height = event.target.scrollHeight + "px";
      setFormData({ ...formData, additionalnotes: value });
      setErrors({ ...errors, additionalnotes: "" });
    }
  };

  const [selectedCompany, setSelectedCompany] = useState("");
  const [showDropdownCompany, setShowDropdownCompany] = useState(false);

  const toggleDropdownCompany = () => {
    setShowDropdownCompany(!showDropdownCompany);
  };

  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/company`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching Companies data:", error);
      }
    };

    fetchCompaniesData();
  }, []);
  const handleCompanySelect = (company) => {
    setSelectedCompany(company.CompanyName);
    setShowDropdownCompany(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      companyname: company.CompanyName,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      companyname: "",
    }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedExp, setSelectedExp] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [entries, setEntries] = useState([]);
  const [allSelectedSkills, setAllSelectedSkills] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [teamData] = useState([]);

  const experienceOptions = [
    "0-1 Years",
    "1-2 years",
    "2-3 years",
    "3-4 years",
    "4-5 years",
    "5-6 years",
    "6-7 years",
    "7-8 years",
    "8-9 years",
    "9-10 years",
    "10+ years",
  ];
  const expertiseOptions = ["Basic", "Medium", "Expert"];

  const handleAddEntry = () => {
    if (selectedSkill && selectedExp && selectedLevel) {
      if (editingIndex !== null) {
        const updatedEntries = entries.map((entry, index) =>
          index === editingIndex
            ? {
              skills: [selectedSkill],
              experience: selectedExp,
              expertise: selectedLevel,
            }
            : entry
        );
        setEntries(updatedEntries);
        setEditingIndex(null);
        setAllSelectedSkills([
          ...updatedEntries.flatMap((entry) => entry.skills),
        ]);
      } else {
        setEntries([
          ...entries,
          {
            skills: [selectedSkill],
            experience: selectedExp,
            expertise: selectedLevel,
          },
        ]);
        setAllSelectedSkills([...allSelectedSkills, selectedSkill]);
      }

      // Clear the skills error
      setErrors((prevErrors) => ({
        ...prevErrors,
        skills: "",
      }));

      resetSkillForm();
    } else {
      // Handle validation error if any field is missing
      setErrors((prevErrors) => ({
        ...prevErrors,
        skills: "Please fill all skill fields",
      }));
    }
  };

  const resetSkillForm = () => {
    setSelectedSkill("");
    setSelectedExp("");
    setSelectedLevel("");
    setCurrentStep(0);
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      companyname: "",
      jobdescription: "",
      minexperience: "",
      maxexperience: "",
      skills: [],
      additionalnotes: "",
    });
    setEntries([]);
    setAllSelectedSkills([]);
    setSelectedCompany("");
    setSelectedMaxExperience("");
    setSelectedMinExperience("");
    setAdditionalNotesValue("");
    setdescription("");
    setRoundEntries([]);
    setSelectedSkill("");
    setSelectedExp("");
    setSelectedLevel("");
    setCurrentStep(0);
    setIsModalOpen(false);
    setIsRoundModalOpen(false);
    setRoundStep(0);
    setSelectedRound("");
    setSelectedMode("");
    setSelectedDuration("1 hour");
    setSelectedTeamMembers([]);
    setEditingRoundIndex(null);
    setErrors({});
  };

  const isNextEnabled = () => {
    if (currentStep === 0) {
      if (editingIndex !== null) {
        return selectedSkill !== "";
      } else {
        return (
          selectedSkill !== "" && !allSelectedSkills.includes(selectedSkill)
        );
      }
    } else if (currentStep === 1) {
      return selectedExp !== "";
    } else if (currentStep === 2) {
      return selectedLevel !== "";
    }
    return false;
  };

  const handleEdit = (index) => {
    const entry = entries[index];
    setSelectedSkill(entry.skills[0]);
    setSelectedExp(entry.experience);
    setSelectedLevel(entry.expertise);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const entry = entries[deleteIndex];
      setAllSelectedSkills(
        allSelectedSkills.filter((skill) => skill !== entry.skills[0])
      );
      setEntries(entries.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
  };

  // rounds
  const [showTeamMemberDropdown, setShowTeamMemberDropdown] = useState(false);
  const [isTeamMemberSelected, setIsTeamMemberSelected] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [showDropdowninterview, setShowDropdowninterview] = useState(false);
  const toggleDropdowninterview = () => {
    setShowDropdowninterview(!showDropdowninterview);
  };

  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const removeSelectedTeamMember = (memberToRemove) => {
    setSelectedTeamMembers(
      selectedTeamMembers.filter((member) => member !== memberToRemove)
    );
  };
  const clearSelectedTeamMembers = () => {
    setSelectedTeamMembers([]);
  };
  const interviews = ["My Self", "Team Member", "Outsource Interviewer"];

  const handleinterviewSelect = (interview) => {
    if (
      interview === "My Self" ||
      interview === "Team Member" ||
      interview === "Outsource Interviewer"
    ) {
      setShowDropdowninterview(false);
    } else {
      setShowDropdowninterview(false);
    }
    setIsTeamMemberSelected(interview === "Team Member");

    if (interview === "My Self" || interview === "Team Member") {
      setShowDropdowninterview(false);
    } else if (interview === "Outsource Interviewer") {
      setShowConfirmation(true);
    } else {
      setShowDropdowninterview(false);
    }
    setIsTeamMemberSelected(interview === "Team Member");
  };

  const toggleDropdownTeamMember = () => {
    setShowTeamMemberDropdown(!showTeamMemberDropdown);
  };

  const handleTeamMemberSelect = (teamMember) => {
    if (!selectedTeamMembers.some((member) => member.id === teamMember._id)) {
      setSelectedTeamMembers([
        ...selectedTeamMembers,
        { id: teamMember._id, name: teamMember.LastName },
      ]);
    }
    setShowTeamMemberDropdown(false);
    setIsTeamMemberSelected(false);
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleAddInterviewClick = () => {
    setShowPopup(true);
    setShowConfirmation(false);
  };


  const handlePopupClose = () => {
    setShowPopup(false);
  };

  // rounds
  const handleAddRoundEntry = () => {
    const newEntry = {
      round: selectedRound,
      customRoundName: selectedRound === "Other" ? customRoundName : "",
      mode: selectedMode,
      duration: selectedDuration,
      teamMembers: selectedTeamMembers,
    };

    const isDuplicate = roundEntries.some(entry =>
      (entry.round === "Other" ? entry.customRoundName : entry.round) ===
      (newEntry.round === "Other" ? newEntry.customRoundName : newEntry.round)
    );

    if (isDuplicate) {
      alert("A round with this name already exists. Please choose a different name.");
      return;
    }

    let updatedRoundEntries = [...roundEntries];
    if (editingRoundIndex !== null) {
      updatedRoundEntries[editingRoundIndex] = newEntry;
    } else {
      updatedRoundEntries.push(newEntry);
    }

    setRoundEntries(updatedRoundEntries);

    // Clear the rounds error
    setErrors((prevErrors) => ({
      ...prevErrors,
      rounds: "",
    }));

    resetRoundForm();
  };

  const resetRoundForm = () => {
    setSelectedRound("");
    setCustomRoundName("");
    setSelectedMode("");
    setSelectedDuration("");
    setSelectedTeamMembers([]);
    setRoundStep(0);
    setIsRoundModalOpen(false);
    setEditingRoundIndex(null);
  };

  const handleNextRound = () => {
    const newEntry = {
      round: selectedRound,
      customRoundName: selectedRound === "Other" ? customRoundName : "",
      mode: selectedMode,
      duration: selectedDuration,
      teamMembers: selectedTeamMembers,
    };

    const isDuplicate = roundEntries.some(entry =>
      (entry.round === "Other" ? entry.customRoundName : entry.round) ===
      (newEntry.round === "Other" ? newEntry.customRoundName : newEntry.round)
    );

    if (isDuplicate) {
      alert("A round with this name already exists. Please choose a different name.");
      return;
    }

    const updatedRoundEntries = [...roundEntries];
    if (roundStep < roundEntries.length) {
      updatedRoundEntries[roundStep] = newEntry;
    } else {
      updatedRoundEntries.push(newEntry);
    }

    setRoundEntries(updatedRoundEntries);
    setRoundStep(roundStep + 1);
    setSelectedRound("");
    setCustomRoundName("");
    setSelectedMode("");
    setSelectedDuration("1 hour");
    setSelectedTeamMembers([]);
  };

  const handleEditRound = (index) => {
    const entry = roundEntries[index];
    setSelectedRound(entry.round);
    setCustomRoundName(entry.customRoundName);
    setSelectedMode(entry.mode);
    setSelectedDuration(entry.duration);
    setSelectedTeamMembers(entry.teamMembers);
    setRoundStep(index);
    setIsRoundModalOpen(true);
    setEditingRoundIndex(index);
  };

  const [customRoundName, setCustomRoundName] = useState("");

  const openRoundModal = () => {
    setIsRoundModalOpen(true);
    setRoundStep(roundEntries.length);
    setSelectedRound("");
    setCustomRoundName("");
    setSelectedMode("");
    setSelectedDuration("1 hour");
    setSelectedTeamMembers([]);
    setEditingRoundIndex(null);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkills = skills.filter(skill =>
    skill.SkillName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [deleteRoundIndex, setDeleteRoundIndex] = useState(null);

  const handleDeleteRound = (index) => {
    setDeleteRoundIndex(index);
  };

  const confirmDeleteRound = () => {
    if (deleteRoundIndex !== null) {
      setRoundEntries(roundEntries.filter((_, i) => i !== deleteRoundIndex));
      setDeleteRoundIndex(null);
    }
  };

  const cancelDeleteRound = () => {
    setDeleteRoundIndex(null);
  };

  const skillpopupcancelbutton = () => {
    setIsModalOpen(false);
    setSearchTerm("");
  }

  return (
    <>

      <div className="fixed top-0 w-full bg-white border-b">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-bold">New Position</h2>
          <button type="button" onClick={handleClose} className="focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {showConfirmationPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <p>Do you want to save the changes before closing?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={handleConfirmClose} className="bg-red-500 text-white px-4 py-2 rounded">
                Don't Save
              </button>
              <button type="button" onClick={handleCancelClose} className="bg-gray-300 text-black px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-16 bottom-16 overflow-auto p-4 w-full text-sm">
        <div>
          <form onSubmit={handleSubmit}>
            {/* title */}
            <div className="flex gap-5 mb-5">
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 w-36"
                >
                  Title <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="flex-grow">
                <input
                  value={formData.title}
                  onChange={handleChange}
                  name="title"
                  type="text"
                  id="title"
                  className={`border-b focus:outline-none mb-5 w-full ${errors.title
                    ? "border-red-500"
                    : "border-gray-300 focus:border-black"
                    }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm -mt-4">
                    {errors.title}
                  </p>
                )}
              </div>
            </div>
            {/* company */}
            <div className="flex gap-5 mb-5 text-sm">
              <div>
                <label
                  htmlFor="company"
                  className="block mb-2  font-medium text-gray-900 w-36"
                >
                  Company <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    className={`border-b focus:outline-none mb-5 w-full ${errors.companyname
                      ? "border-red-500"
                      : "border-gray-300 focus:border-black"
                      }`}
                    value={selectedCompany}
                    onClick={toggleDropdownCompany}
                    readOnly
                  />
                  {errors.companyname && (
                    <p className="text-red-500 text-sm -mt-4">
                      {errors.companyname}
                    </p>
                  )}
                </div>
                {showDropdownCompany && (
                  <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg h-40 overflow-y-auto">
                    {companies.map((company) => (
                      <div
                        key={company}
                        className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleCompanySelect(company)}
                      >
                        {company.CompanyName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* experience */}
            <div className="flex gap-5">
              <div>
                <label
                  htmlFor="experience"
                  className="block mb-2  font-medium text-gray-900 w-36"
                >
                  Experience <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="flex-grow">
                <div className="flex items-center w-full gap-5">
                  <div className="flex gap-7 mb-5">
                    <div className="w-5">
                      <label
                        htmlFor="minexperience"
                        className="block  font-medium leading-6 text-gray-900"
                      >
                        Min
                      </label>
                    </div>
                    <div className="relative flex-grow">
                      <div className="relative">
                        <input
                          type="text"
                          id="minexperience"
                          className={`border-b focus:outline-none mb-5 w-full ${errors.minexperience
                            ? "border-red-500"
                            : "border-gray-300 focus:border-black"
                            }`}
                          value={selectedMinExperience}
                          onClick={toggleDropdownMinExperience}
                          readOnly
                        />
                        {errors.minexperience && (
                          <p className="text-red-500 text-sm -mt-4">
                            {errors.minexperience}
                          </p>
                        )}
                      </div>
                      {showDropdownMinExperience && (
                        <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                          {minExperienceOptions.map((option) => (
                            <div
                              key={option.value}
                              className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                              onClick={() =>
                                handleMinExperienceSelect(option.value)
                              }
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-5 mb-5">
                    <div className="w-5">
                      <label
                        htmlFor="maxexperience"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Max
                      </label>
                    </div>
                    <div className="relative flex-grow">
                      <div className="relative">
                        <input
                          type="text"
                          id="maxexperience"
                          className={`border-b focus:outline-none mb-5 w-full ${errors.maxexperience
                            ? "border-red-500"
                            : "border-gray-300 focus:border-black"
                            }`}
                          value={selectedMaxExperience}
                          onClick={toggleDropdownMaxExperience}
                          readOnly
                        />
                        {errors.maxexperience && (
                          <p className="text-red-500 text-sm -mt-4">
                            {errors.maxexperience}
                          </p>
                        )}
                      </div>
                      {showDropdownMaxExperience && (
                        <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                          {maxExperienceOptions.map((option) => (
                            <div
                              key={option.value}
                              className={`py-2 px-4 cursor-pointer hover:bg-gray-100 ${parseInt(option.value) <= parseInt(selectedMinExperience) ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => handleMaxExperienceSelect(option.value)}
                              disabled={parseInt(option.value) <= parseInt(selectedMinExperience)} // Disable invalid options
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* job description */}
            <div className="flex gap-5 mb-5">
              <div>
                <label
                  htmlFor="jobdescription"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                >
                  Job Description <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="flex-grow">
                <textarea
                  rows={8}
                  onChange={handleChangedescription}
                  value={formData.jobdescription}
                  name="jobdescription"
                  id="jobdescription"
                  className={`border p-2 focus:outline-none mb-5 w-full  rounded-md  ${errors.jobdescription
                    ? "border-red-500"
                    : "border-gray-300 focus:border-black"
                    }`}
                ></textarea>
                {errors.jobdescription && (
                  <p className="text-red-500 text-sm -mt-4">
                    {errors.jobdescription}
                  </p>
                )}
                {formData.jobdescription.length > 0 && (
                  <p className="text-gray-600 text-sm float-right -mt-4">
                    {formData.jobdescription.length}/1000
                  </p>
                )}
              </div>
            </div>
            {/* start - mansoor - 31-07-2024 */}
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center mb-2">
                  <label htmlFor="Skills" className="text-sm font-medium text-gray-900" >
                    Skills <span className="text-red-500">*</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center text-sm bg-blue-500 text-white py-1 rounded w-28"
                >
                  <FaPlus className="text-md mr-2" />
                  Add Skills
                </button>
              </div>
              {errors.skills && (
                <p className="text-red-500 text-sm">{errors.skills}</p>
              )}
              <div>
                <div className="space-y-2 mb-4 mt-5">
                  {entries.map((entry, index,) => (
                    <div key={index} className="flex flex-wrap -mx-2 border p-3 rounded-lg items-center bg-blue-100">
                      <div className="w-1/3 px-2">{entry.skills.join(', ')}</div>
                      <div className="w-1/3 px-2">{entry.experience}</div>
                      <div className="w-1/3 px-2">{entry.expertise}</div>
                      <div className="w-full flex justify-end space-x-2 -mt-5">
                        <button type="button" onClick={() => handleEdit(index)} className="text-blue-500 text-md">
                          <FaEdit />
                        </button>
                        <button type="button" onClick={() => handleDelete(index)} className="text-red-500 text-md">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {isModalOpen && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-80 relative">
                      <header className="flex justify-between items-center w-full border-b py-3 px-4">
                        <h2 className="text-lg font-bold">Select Skills</h2>
                        <button type="button" className="text-gray-700" onClick={skillpopupcancelbutton}>
                          <FaTimes className="text-gray-400 border rounded-full p-1 text-2xl" />
                        </button>
                      </header>
                      <div>
                        {currentStep === 0 && (
                          <div>
                            <div className="max-h-56 overflow-y-auto">
                              <div className="mt-3 ml-4 mb-3">
                                <div>
                                  <input
                                    type="text"
                                    placeholder="Search skills..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border p-2 mb-3 w-[96%] rounded focus:outline-none"
                                  />
                                  <div className="min-h-56">
                                    {filteredSkills.length > 0 ? (
                                      filteredSkills.map(skill => (
                                        <label key={skill._id} className="block mb-1">
                                          <input
                                            type="radio"
                                            value={skill.SkillName}
                                            checked={selectedSkill === skill.SkillName}
                                            disabled={allSelectedSkills.includes(skill.SkillName) && selectedSkill !== skill.SkillName}
                                            onChange={(e) => setSelectedSkill(e.target.value)}
                                            className="mr-3"
                                          />
                                          {skill.SkillName}
                                        </label>
                                      ))
                                    ) : (
                                      <p className="text-gray-500">No skills available</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {currentStep === 1 && (
                          <div>
                            <div className="max-h-56 overflow-y-auto">
                              <div className="mt-3 ml-4 mb-3">
                                {experienceOptions.map(exp => (
                                  <label key={exp} className="block mb-1">
                                    <input
                                      type="radio"
                                      name="experience"
                                      value={exp}
                                      checked={selectedExp === exp}
                                      onChange={(e) => setSelectedExp(e.target.value)}
                                      className="mr-3"
                                    />
                                    {exp}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {currentStep === 2 && (
                          <div>
                            <div className="min-h-56 overflow-y-auto">
                              <div className="mt-3 ml-4 mb-3">
                                {expertiseOptions.map(exp => (
                                  <label key={exp} className="block mb-1">
                                    <input
                                      type="radio"
                                      name="expertise"
                                      value={exp}
                                      checked={selectedLevel === exp}
                                      onChange={(e) => setSelectedLevel(e.target.value)}
                                      className="mr-3"
                                    />
                                    {exp}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <footer className="flex justify-end border-t py-2 px-4">
                        {currentStep === 0 && (
                          <button
                            onClick={() => {
                              setCurrentStep(1);
                              setSearchTerm("");
                            }}
                            className={`bg-blue-500 text-white px-4 py-2 rounded block float-right ${!isNextEnabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!isNextEnabled()}
                          >
                            Next
                          </button>
                        )}
                        {currentStep === 1 && (
                          <div className="flex justify-between gap-4">
                            <button type="button" onClick={() => setCurrentStep(0)} className="bg-gray-300 text-black px-4 py-2 rounded">
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={() => setCurrentStep(2)}
                              className={`bg-blue-500 text-white px-4 py-2 rounded ${!isNextEnabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={!isNextEnabled()}
                            >
                              Next
                            </button>
                          </div>
                        )}
                        {currentStep === 2 && (
                          <div className="flex justify-between gap-4">
                            <button type="button" onClick={() => setCurrentStep(1)} className="bg-gray-300 text-black px-4 py-2 rounded">
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={handleAddEntry}
                              className={`bg-blue-500 text-white px-4 py-2 rounded ${!isNextEnabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={!isNextEnabled()}
                            >
                              {editingIndex !== null ? 'Update' : 'Add'}
                            </button>
                          </div>
                        )}
                      </footer>
                    </div>
                  </div>
                )}

                {deleteIndex !== null && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg">
                      <p>Are you sure you want to delete this Skill?</p>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          type="button"
                          onClick={confirmDelete}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={cancelDelete}
                          className="bg-gray-300 text-black px-4 py-2 rounded"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* end - mansoor - 31-07-2024 */}
            <div className="footer-buttons flex justify-end">
              <button type="submit" className="footer-button">
                Save
              </button>
            </div>
          </form>
          {/* Rounds table*/}
          <div className="mt-5 text-sm">
            <div className="mb-5 flex justify-between">
              <label htmlFor="rounds" className="font-medium text-gray-900 dark:text-black">
                Rounds <span className="text-red-500">*</span>
              </label>

              <button
                className={`flex items-center justify-center text-sm bg-blue-500 text-white py-1 rounded w-28 ${roundEntries.length >= 5 ? 'cursor-not-allowed bg-blue-300' : ''}`}
                onClick={openRoundModal}
                disabled={roundEntries.length >= 5}
                title={roundEntries.length >= 5 ? "You reached maximum rounds" : ""}
              >
                <FaPlus className="text-md mr-2" />Add Rounds
              </button>
            </div>
            {errors.rounds && (
              <p className="text-red-500 text-sm -mt-4">{errors.rounds}</p>
            )}
            <div>
              {isRoundModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-lg w-96 relative">
                    <header className="flex justify-between items-center mb-4 w-full border-b p-3">
                      <h2 className="text-lg font-bold">Select Round-{roundStep + 1}</h2>
                      <button className="text-gray-700" onClick={resetRoundForm}>
                        <FaTimes className="text-gray-400 border rounded-full p-1 text-2xl" />
                      </button>
                    </header>

                    <div className="mb-4 flex items-center px-4">
                      <label className="block text-gray-700 font-medium mb-2 flex-shrink-0 w-32">
                        Round <span className="text-red-500">*</span>
                      </label>
                      {selectedRound === "Other" ? (
                        <input
                          type="text"
                          className="flex-grow px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                          value={customRoundName}
                          onChange={(e) => setCustomRoundName(e.target.value)}
                          placeholder="Enter round name"
                        />
                      ) : (
                        <select
                          className="flex-grow px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                          value={selectedRound}
                          onChange={(e) => {
                            const roundValue = e.target.value;
                            setSelectedRound(roundValue);
                            if (roundValue === "Assessment") {
                              setSelectedMode("Virtual");
                            } else {
                              setSelectedMode("");
                            }
                            setCustomRoundName("");
                          }}
                        >
                          <option value="" disabled hidden></option>
                          <option value="Assessment">Assessment</option>
                          <option value="Technical">Technical</option>
                          <option value="Final">Final</option>
                          <option value="HR Interview">HR Interview</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                    </div>

                    <div className="mb-4 flex items-center px-4">
                      <label className="block text-gray-700 font-medium mb-2 flex-shrink-0 w-32">
                        Interview Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="flex-grow px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        value={selectedMode}
                        onChange={(e) => setSelectedMode(e.target.value)}
                        disabled={selectedRound === "Assessment"}
                      >
                        <option value="" disabled hidden></option>
                        <option value="Virtual">Virtual</option>
                        <option value="Face to face">Face to face</option>
                      </select>
                    </div>

                    <div className="mb-4 flex items-center px-4">
                      <label className="block text-gray-700 font-medium mb-2 flex-shrink-0 w-32">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="flex-grow px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                      >
                        <option value="" disabled hidden></option>
                        <option value="30 minutes">30 minutes</option>
                        <option value="1 hour" selected>1 hour</option>
                        <option value="1.5 hours">1.5 hours</option>
                        <option value="2 hours">2 hours</option>
                      </select>
                    </div>

                    <div className="mb-20 flex items-center px-4">
                      <label className="block text-gray-700 font-medium flex-shrink-0 w-32">
                        Interviewer
                      </label>
                      <div className="relative flex-grow">
                        <div className="relative mb-3">
                          <div
                            className="border-b border-gray-300 focus:border-black focus:outline-none min-h-6 h-auto mb-5 w-full relative"
                            onClick={toggleDropdowninterview}
                          >
                            <div className="flex flex-wrap">
                              {selectedTeamMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="bg-slate-200 rounded-lg px-2 py-1 inline-block mr-2 mb-2"
                                >
                                  {member.name}
                                  <button
                                    onClick={() => removeSelectedTeamMember(member)}
                                    className="ml-1 bg-slate-300 rounded-lg px-2"
                                  >
                                    X
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="absolute top-2 right-5">
                              {selectedTeamMembers.length > 0 && (
                                <button
                                  onClick={clearSelectedTeamMembers}
                                  className="bg-slate-300 rounded-lg px-2 mb-2"
                                >
                                  X
                                </button>
                              )}
                            </div>
                          </div>
                          <MdArrowDropDown className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0" />
                        </div>
                        {showDropdowninterview && (
                          <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                            {interviews.map((interview) => (
                              <div
                                key={interview}
                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleinterviewSelect(interview)}
                              >
                                {interview}
                              </div>
                            ))}
                          </div>
                        )}
                        {isTeamMemberSelected && (
                          <div className="relative flex-grow mt-4">
                            <div className="relative">
                              <input
                                type="text"
                                className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full mt-3"
                                placeholder="Select Team Member"
                                onClick={toggleDropdownTeamMember}
                                readOnly
                              />
                              {showTeamMemberDropdown && (
                                <div className="flex gap-5 mb-5 relative w-full">
                                  <div className="relative flex-grow">
                                    <div className="relative bg-white border cursor-pointer p-1 shadow">
                                      <p className="p-1 font-medium">Recent Team Members</p>
                                      <div>
                                        {teamData.map((team) => (
                                          <div
                                            key={team._id}
                                            className="hover:bg-gray-100 w-full cursor-pointer"
                                            onClick={() => handleTeamMemberSelect(team)}
                                          >
                                            <div className="text-black flex p-1">
                                              {team.LastName}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <p
                                        className="flex bg-white border-b cursor-pointer p-1 hover:bg-gray-100"
                                      >
                                        <IoIosAddCircle className="text-2xl" />
                                        <span>Add New Team Member</span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <MdArrowDropDown className="absolute top-0 text-gray-500 text-lg mt-3 cursor-pointer right-0" />
                            </div>
                          </div>
                        )}
                        {showConfirmation && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-50">
                            <div className="relative bg-white rounded-lg p-6">
                              <button
                                className="absolute top-2 right-2 rounded-full"
                                onClick={() => setShowConfirmation(false)}
                              >
                                <MdOutlineCancel className="text-2xl" />
                              </button>
                              <p className="text-lg mt-3 ">
                                Do you want only outsourced interviewers?
                              </p>
                              <div className="mt-4 flex justify-center">
                                <button
                                  className="bg-gray-300 text-gray-700 rounded px-8 py-2 mr-2"
                                  onClick={() => setShowConfirmation(false)}
                                >
                                  No
                                </button>
                                <button
                                  className="bg-gray-300 text-gray-700 rounded px-8 py-2 ml-11"
                                  onClick={handleAddInterviewClick}
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <footer className="mt-6 flex justify-end px-3 pb-3 border-t pt-3">
                      {editingRoundIndex === null && roundStep < 4 && (
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                          onClick={handleNextRound}
                        >
                          Next
                        </button>
                      )}
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={handleAddRoundEntry}
                      >
                        {editingRoundIndex !== null ? 'Update' : 'Save'}
                      </button>
                    </footer>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2 mb-4">
              {roundEntries.map((entry, index) => (
                <div key={index} className="flex flex-wrap -mx-2 border p-3 rounded-lg items-center bg-blue-100">
                  <div className="w-1/3 px-2">
                    {entry.round === "Other" ? entry.customRoundName : entry.round}
                  </div>
                  <div className="w-1/3 px-2">{entry.mode}</div>
                  <div className="w-1/3 px-2">{entry.duration}</div>
                  <div className="w-full flex justify-end space-x-2 -mt-5">
                    <button type="button" onClick={() => handleEditRound(index)} className="text-blue-500 text-md">
                      <FaEdit />
                    </button>
                    <button type="button" onClick={() => handleDeleteRound(index)} className="text-red-500 text-md">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {deleteRoundIndex !== null && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
                <div className="bg-white p-5 rounded shadow-lg">
                  <p>Are you sure you want to delete this Round?</p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      onClick={confirmDeleteRound}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={cancelDeleteRound}
                      className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            {/* additional details */}
            <div className="flex gap-5 mb-5 mt-8">
              <div>
                <label
                  htmlFor="additionalnotes"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                >
                  Additional Notes
                </label>
              </div>
              <div className="flex-grow">
                <textarea
                  rows={5}
                  value={formData.additionalnotes}
                  onChange={handleAdditionalNotesChange}
                  name="additionalnotes"
                  id="additionalnotes"
                  className={`border p-2 focus:outline-none mb-5 w-full rounded-md ${errors.additionalnotes
                    ? "border-red-500"
                    : "border-gray-300 focus:border-black"
                    }`}
                ></textarea>
                {/* {errors.additionalnotes && <p className="text-red-500 text-sm -mt-4">{errors.additionalnotes}</p>} */}
                {formData.additionalnotes.length > 0 && (
                  <p className="text-gray-600 text-sm float-right -mt-4">
                    {formData.additionalnotes.length}/250
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>


      {showPopup && <PopupComponent onClose={handlePopupClose} />}
    </>
  );
};

export default Position_Form;
