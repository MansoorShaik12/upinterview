import React, { useState } from "react";
import "../styles/tabs.scss";
import { useRef, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import range from "lodash/range";
import ImageUploading from "react-images-uploading";
import { TbCameraPlus } from "react-icons/tb";
import { MdUpdate } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { MdArrowDropDown } from "react-icons/md";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import Savenextpopup from "./Save_&_next_popup";
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import AddPositionForm from "../Position-Tab/Position-Form";
import { FaTimes } from "react-icons/fa";
import { format, getYear } from 'date-fns';

const CreateCandidate = ({ isOpen, onClose, onCandidateAdded }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [skillsData, setSkillsData] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState("");

  // ------------------------------
  //storeing CandidateData
  // ------------------------------
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    CountryCode: "+91",
    Date_Of_Birth: "",
    Gender: "",
    HigherQualification: "",
    UniversityCollege: "",
    CurrentExperience: "",
    Resume: "",
    Resume: "",
    skills: [],
    Position: "",
    image: "",
    PositionId: "",
  });

  const [candidateData, setCandidateData] = useState([]);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/candidate`);
        if (Array.isArray(response.data)) {
          setCandidateData(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };
    fetchCandidateData();
  }, []);

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const [errors, setErrors] = useState({ Phone: "", Email: "" });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number validation (starts with 6-9 and has 10 digits)
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "Email") {
      if (!value) {
        errorMessage = "Email is required";
      } else if (!validateEmail(value)) {
        errorMessage = "Invalid email address";
      }
    } else if (name === "Phone") {
      if (!value) {
        errorMessage = "Phone number is required";
      } else if (!validatePhone(value)) {
        errorMessage = "Invalid phone number";
      }
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      handleChange(e);
    }
  };

  const [popupLastName, setPopupLastName] = useState("");
  // image code
  const [file, setFile] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setIsImageUploaded(true);

    }
  };

  const handleReplace = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteImage = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setShowImagePopup(false);
    handleSubmit(e, false);
  };

  const handleSubmit = async (e, openPopup) => {
    e.preventDefault();

    const requiredFields = {
      LastName: "Last Name is required",
      Email: "Email is required",
      Phone: "Phone Number is required",
      Gender: "Gender is required",
      HigherQualification: "Higher Qualification is required",
      UniversityCollege: "University/College is required",
      CurrentExperience: "Current Experience is required",
      Position: "Position Experience is required",
    };
    let formIsValid = true;
    const newErrors = { ...errors };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field] && !selectedPosition) {
        newErrors[field] = message;
        formIsValid = false;
      }
    });
    if (entries.length === 0) {
      newErrors.skills = "At least one skill is required";
      formIsValid = false;
    }
    setErrors(newErrors);

    // If the form is invalid, return early
    if (!formIsValid) {
      return;
    }
    if (!isImageUploaded && !showImagePopup) {
      setShowImagePopup(true);
      return;
    }
    const fullPhoneNumber = `${formData.CountryCode} ${formData.Phone}`;
    const data = {
      ...formData,
      Phone: fullPhoneNumber,
      HigherQualification: selectedQualification,
      Gender: selectedGender,
      UniversityCollege: selectedCollege,
      Date_Of_Birth: startDate,
      skills: entries.map((entry) => ({
        skill: entry.skills[0],
        experience: entry.experience,
        expertise: entry.expertise,
      })),
      Position: selectedPosition,
      PositionId: selectedPositionId,
      createdBy: userId,
    };

    try {
      // First, create the candidate
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/candidate`, data);
      const candidateId = response.data._id;

      // If an image is selected, upload it
      if (file) {
        const imageData = new FormData();
        imageData.append("image", file);
        imageData.append("type", "candidate");
        imageData.append("id", candidateId);

        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/upload`, imageData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error) {
          console.error("Error uploading image:", error);
          return;
        }
      }

      setFormData({
        FirstName: "",
        LastName: "",
        CountryCode: "+91",
        Email: "",
        Phone: "",
        Date_Of_Birth: "",
        Gender: "",
        HigherQualification: "",
        UniversityCollege: "",
        CurrentExperience: "",
        skills: [],
        image: "",
        Position: "",
        PositionId: "",
      });
      setEntries([]);
      setSelectedQualification("");
      setSelectedGender("");
      setSelectedCollege("");
      setStartDate("");
      setFile(null);
      setFilePreview(null);

      if (onCandidateAdded) {
        onCandidateAdded(response.data);
      }

      if (openPopup) {
        handlePopupClick();
        setPopupLastName(formData.LastName);
      } else {
        onClose(); // Close the form
      }
    } catch (error) {
      console.error("Error creating candidate:", error);
    }
  };

  const handleClose = () => {
    const isFormEmpty =
      !formData.FirstName &&
      !formData.LastName &&
      !formData.Email &&
      !formData.Phone &&
      !formData.Date_Of_Birth &&
      !formData.Gender &&
      !formData.HigherQualification &&
      !formData.UniversityCollege &&
      !formData.CurrentExperience &&
      formData.skills.length === 0 &&
      !formData.Position;

    if (!isFormEmpty) {
      setShowConfirmationPopup(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    resetForm();
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmationPopup(false);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains("add-new-button")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [skills, setSkills] = useState([]);
  useEffect(() => {
    const fetchskillsData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/skills`);
        setSkills(response.data);
        setFilteredSkills(response.data);
      } catch (error) {
        console.error("Error fetching SkillsData:", error);
      }
    };
    fetchskillsData();
  }, []);

  const handleNewPositionAdded = (newPosition) => {
    setSelectedPosition(newPosition.title);
    setSelectedPositionId(newPosition._id);
    setShowNewPositionContent(false);
  };

  const [startDate, setStartDate] = useState(null);
  const years = range(1990, getYear(new Date()) + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleDateChange = (date) => {
    const formattedDate = format(date, 'dd-MM-yyyy');
    setFormData((prevData) => ({
      ...prevData,
      Date_Of_Birth: formattedDate,
    }));
    setStartDate(date);
  };


  const [selectedGender, setSelectedGender] = useState("");
  const [showDropdowngender, setShowDropdownGender] = useState(false);
  const genders = ["Male", "Female", "Others"];

  const toggleDropdowngender = () => {
    setShowDropdownGender(!showDropdowngender);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setShowDropdownGender(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      Gender: gender,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      Gender: "",
    }));
  };

  const [selectedCollege, setSelectedCollege] = useState("");
  const [showDropdownCollege, setShowDropdownCollege] = useState(false);

  const toggleDropdown = () => {
    setShowDropdownCollege(!showDropdownCollege);
  };

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college.University_CollegeName);
    setFormData((prevFormData) => ({
      ...prevFormData,
      UniversityCollege: college.University_CollegeName,
    }));
    setShowDropdownCollege(false);
    setErrors((prevErrors) => ({
      ...prevErrors,
      UniversityCollege: "",
    }));
  };

  const [selectedQualification, setSelectedQualification] = useState("");
  const [showDropdownQualification, setShowDropdownQualification] =
    useState(false);

  const handleQualificationSelect = (qualification) => {
    setSelectedQualification(qualification.QualificationName);
    setFormData((prevData) => ({
      ...prevData,
      HigherQualification: qualification.QualificationName, // Update HigherQualification, not qualification
    }));
    setShowDropdownQualification(false);
    setErrors((prevErrors) => ({
      ...prevErrors,
      HigherQualification: "",
    }));
  };

  const toggleDropdownQualification = () => {
    setShowDropdownQualification(!showDropdownQualification);
  };

  const [qualification, setQualification] = useState([]);
  useEffect(() => {
    const fetchQualificationData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/qualification`);
        setQualification(response.data);
      } catch (error) {
        console.error("Error fetching Qualification data:", error);
      }
    };
    fetchQualificationData();
  }, []);

  const [college, setCollege] = useState([]);

  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/universitycollege`
        );
        setCollege(response.data);
      } catch (error) {
        console.error("Error fetching CollegeData:", error);
      }
    };
    fetchCollegeData();
  }, []);

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

  // ABOUT POPUP

  const [showPopup, setShowPopup] = useState(false);

  const handlePopupClick = () => {
    setShowPopup(true);
    onClose();
  };

  const onClosepopup = () => {
    setShowPopup(false);
  };

  // skills//

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedExp, setSelectedExp] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [entries, setEntries] = useState([]);
  const [allSelectedSkills, setAllSelectedSkills] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const skillOptions = ["JavaScript", "React", "Node.js", "CSS", "HTML"];
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

  //skill
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleAddEntry = () => {
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      skills: "",
    }));
    resetForm();
  };

  const resetForm = () => {
    setSelectedSkill("");
    setSelectedExp("");
    setSelectedLevel("");
    setCurrentStep(0);
    setIsModalOpen(false);
    setFilteredSkills(skills);
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

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleInputClick = () => {
  //   setShowPopup(true);
  // };

  // const handleFileChange = (e) => {
  //   // Handle the file upload logic here
  //   console.log(e.target.files[0]); // For now, just log the file
  //   setFormData({ ...formData, Resume: e.target.files[0].name });
  //   setShowPopup(false); // Close the popup after file selection
  // };

  // const [showCard, setShowCard] = useState(false);
  // const handleInputClick = () => {
  //   setShowCard(true);
  // };

  // const handleUploadClick = () => {
  //   document.getElementById("fileInput").click();
  // };

  // const handleClose = () => {
  //   setShowCard(false);
  // };

  // const handleInputClick = () => {
  //   setShowCard(true);
  // };

  // const handleUploadClick = () => {
  //   document.getElementById('fileInput').click();
  // };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setFormData({ ...formData, Resume: file.name });
  //     setShowCard(false);
  //   }
  // };

  // const handleClose = () => {
  //   setShowCard(false);
  // };

  // const handleChange = (event) => {
  //   setFormData({ ...formData, [event.target.name]: event.target.value });
  // };

  const [showCard, setShowCard] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleInputClick = () => {
    setShowCard(true);
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFileName(file.name);
  //     setFormData({ ...formData, Resume: file.name });
  //     setShowCard(false);
  //   }
  // };

  // const handleClose = () => {
  //   setShowCard(false);
  // };

  const handleRemoveFile = () => {
    setFileName("");
    setFormData({ ...formData, Resume: "" });
  };




  // position 
  const positionRef = useRef(null);
  const [value, setValue] = useState("");
  const [showMainContent, setShowMainContent] = useState(true);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [showNewPositionContent, setShowNewPositionContent] = useState(false);


  const [selectedPosition, setSelectedPosition] = useState("");


  const handlePositionSelect = (position) => {
    setSelectedPosition(position.title);
    setSelectedPositionId(position._id);
    setValue("");
    setShowDropdown(false);
    setErrors((prevErrors) => ({
      ...prevErrors,
      Position: "",
    }));
  };
  const handlePositionInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    setShowDropdown(true);
    setFormData((prevFormData) => ({
      ...prevFormData,
      Position: inputValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      Position: "",
    }));
  };

  const handleAddNewPositionClick = () => {
    setShowMainContent(false);
    setShowNewPositionContent(true);
   
    if (value.trim() !== "") {
      const newPosition = { _id: positions.length + 1, title: value };
      setPositions([newPosition, ...positions]); // Add new position at the beginning
      setSelectedPosition(value);
      setValue("");
      setShowDropdown(false);
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    // Filter positions based on user input
    const filtered = skillsData
      .filter((position) =>
        position.title.toLowerCase().includes(value.toLowerCase())
      )
      .slice(-5); // Get the last 5 positions

    setFilteredPositions(filtered);

    // Show dropdown only if there are filtered positions and the input is not empty
    // If there are no matching positions, show the dropdown
    setShowDropdown(
      (filtered.length > 0 || filtered.length === 0) && value.trim().length > 0
    );
  }, [value, skillsData]);




  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/position?CreatedBy=${userId}`);
        setSkillsData(response.data);
      } catch (error) {
        console.error("Error fetching position data:", error);
      }
    };

    fetchSkillsData();
  }, []);


  const handleCountryCodeChange = (e) => {
    setFormData({ ...formData, CountryCode: e.target.value });
  };

  const handleclose = () => {
    setShowMainContent(true);

    setShowNewPositionContent(false);
  };

  const skillpopupcancelbutton = () => {
    setIsModalOpen(false);
    setSearchTerm("");
  }
  return (
    <>
      <div>
        {showMainContent ? (
          <div>
            {/* Header */}
            <div className="fixed top-0 w-full bg-white border-b">
              <div className="flex justify-between items-center p-4">
                <h2 className="text-lg font-bold">New Candidate</h2>
                <button onClick={handleClose} className="focus:outline-none">
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

            {/* Content */}
            <div className="fixed top-16 bottom-16 overflow-auto p-5 text-sm right-0">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4">

                  <div className="col-span-3">
                    {/* first name */}
                    <div className="flex gap-5 mb-5">
                      <div>
                        <label
                          htmlFor="FirstName"
                          className="block text-sm font-medium leading-6 text-gray-900 w-36"
                        >
                          First Name
                        </label>
                      </div>
                      <div className="flex-grow">
                        <input
                          type="text"
                          name="FirstName"
                          id="FirstName"
                          value={formData.FirstName}
                          onChange={handleChange}
                          autoComplete="off"
                          className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full"
                        />
                      </div>
                    </div>
                    {/* last name */}
                    <div className="flex gap-5 mb-5">
                      <div>
                        <label
                          htmlFor="LastName"
                          className="block text-sm font-medium leading-6 text-gray-900 w-36"
                        >
                          Last Name <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="flex-grow">
                        <input
                          type="text"
                          name="LastName"
                          id="LastName"
                          autoComplete="off"
                          value={formData.LastName}
                          onChange={handleChange}
                          className={`border-b focus:outline-none mb-5 w-full ${errors.LastName
                            ? "border-red-500"
                            : "border-gray-300 focus:border-black"
                            }`}
                        />
                        {errors.LastName && (
                          <p className="text-red-500 text-sm -mt-4">
                            {errors.LastName}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* email */}
                    <div className="flex gap-5 mb-5">
                      <div>
                        <label
                          htmlFor="Email"
                          className="block text-sm font-medium leading-6 text-gray-900 w-36"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="flex-grow">
                        <input
                          type="text"
                          name="Email"
                          id="email"
                          value={formData.Email}
                          onChange={handleChange}
                          placeholder="candidate@gmail.com"
                          autoComplete="off"
                          className={`border-b focus:outline-none mb-5 w-full ${errors.Email
                            ? "border-red-500"
                            : "border-gray-300 focus:border-black"
                            }`}
                        />
                        {errors.Email && (
                          <p className="text-red-500 text-sm -mt-4">
                            {errors.Email}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* phone */}
                    <div className="flex gap-5 mb-5">
                      <div>
                        <label
                          htmlFor="Phone"
                          className="block text-sm font-medium leading-6 text-gray-900 w-36"
                        >
                          Phone <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="flex-grow">
                        <div className="flex">
                          <select
                            name="CountryCode"
                            autoComplete="off"
                            id="CountryCode"
                            value={formData.CountryCode}
                            onChange={handleCountryCodeChange}
                            className="border-b focus:outline-none mb-5 w-1/4 mr-2"
                          >
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+61">+61</option>
                            <option value="+971">+971</option>
                            <option value="+60">+60</option>
                          </select>
                          <input
                            type="text"
                            name="Phone"
                            id="Phone"
                            value={formData.Phone}
                            onChange={handlePhoneInput}
                            autoComplete="off"
                            placeholder="xxx-xxx-xxxx"
                            className={`border-b focus:outline-none mb-5 w-full ${errors.Phone
                              ? "border-red-500"
                              : "border-gray-300 focus:border-black"
                              }`}
                          />
                        </div>
                        {errors.Phone && (
                          <p className="text-red-500 text-sm -mt-4">
                            {errors.Phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* date */}
                    <div className="flex gap-5 mb-5">
                      <div>
                        <label
                          htmlFor="dateofbirth"
                          className="block text-sm font-medium leading-6 text-gray-900 w-36"
                        >
                          Date-of-Birth
                        </label>
                      </div>
                      <div style={{ position: "relative" }} className="flex-grow">
                        <div className="border-b border-gray-300  mb-5 w-full">
                          <DatePicker
                            className="focus:border-black focus:outline-none"
                            selected={startDate}
                            onChange={(date) => {
                              handleDateChange(date);
                            }}
                            dateFormat="MMMM d, yyyy"
                            maxDate={new Date()} // Prevent future dates
                            renderCustomHeader={({
                              date,
                              changeYear,
                              changeMonth,
                              decreaseMonth,
                              increaseMonth,
                              prevMonthButtonDisabled,
                              nextMonthButtonDisabled,
                            }) => (
                              <div
                                style={{
                                  margin: 10,
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <button
                                  onClick={decreaseMonth}
                                  disabled={prevMonthButtonDisabled}
                                  type="button"
                                >
                                  {"<<"}
                                </button>
                                <select
                                  value={getYear(date)}
                                  onChange={({ target: { value } }) => changeYear(value)}
                                >
                                  {years.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={months[date.getMonth()]}
                                  onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                >
                                  {months.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={increaseMonth}
                                  disabled={nextMonthButtonDisabled}
                                  type="button"
                                >
                                  {">>"}
                                </button>
                              </div>
                            )}
                            customInput={<input type="text" readOnly className="w-full" />}
                            onChangeRaw={(e) => e.preventDefault()} // Prevent manual input
                            preventOpenOnFocus // Prevent opening on focus
                            showPopperArrow={false} // Hide the popper arrow
                          />
                        </div>
                      </div>
                    </div>

                    {/* gender */}
                    <div className="flex gap-5 mb-5">
                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm font-medium leading-6 text-gray-900  w-36"
                        >
                          Gender <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative flex-grow">
                        <div className="relative">
                          <input
                            type="text"
                            className={`border-b focus:outline-none mb-5 w-full ${errors.Gender
                              ? "border-red-500"
                              : "border-gray-300 focus:border-black"
                              }`}
                            id="gender"
                            autoComplete="off"
                            value={selectedGender}
                            onClick={toggleDropdowngender}
                            readOnly
                          />
                          <div
                            className="absolute right-0 top-0"
                            onClick={toggleDropdowngender}
                          >
                            <MdArrowDropDown className="text-lg text-gray-500 mt-1 cursor-pointer" />
                          </div>
                        </div>
                        {showDropdowngender && (
                          <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                            {genders.map((gender) => (
                              <div
                                key={gender}
                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleGenderSelect(gender)}
                              >
                                {gender}
                              </div>
                            ))}
                          </div>
                        )}
                        {errors.Gender && (
                          <p className="text-red-500 text-sm -mt-4">{errors.Gender}</p>
                        )}
                      </div>
                    </div>

                    {/* Qualification */}
                    <div className="flex gap-5 mb-5">
                      <div>
                        <label
                          htmlFor="qualification"
                          className="block text-sm font-medium leading-6 text-gray-900  w-36"
                        >
                          Higher Qualification{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative flex-grow">
                        <div className="relative">
                          <input
                            className={`border-b focus:outline-none mb-5 w-full ${errors.HigherQualification
                              ? "border-red-500"
                              : "border-gray-300 focus:border-black"
                              }`}
                            type="text"
                            autoComplete="off"
                            value={selectedQualification}
                            onClick={toggleDropdownQualification}
                            readOnly
                          />
                          {errors.HigherQualification && (
                            <p className="text-red-500 text-sm -mt-4">
                              {errors.HigherQualification}
                            </p>
                          )}

                          <div
                            className="absolute right-0 top-0"
                            onClick={toggleDropdownQualification}
                          >
                            <MdArrowDropDown className="text-lg  text-gray-500 mt-1 cursor-pointer" />
                          </div>
                        </div>
                        {showDropdownQualification && (
                          <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md h-72 overflow-y-scroll bg-white shadow-lg">
                            {qualification.map((qualification) => (
                              <div
                                key={qualification.code}
                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleQualificationSelect(qualification)
                                }
                              >
                                {qualification.QualificationName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* college */}
                    <div className="flex gap-5 mb-5">
                      <div>
                        <label
                          htmlFor="college"
                          className="block text-sm font-medium leading-6 text-gray-900 w-36"
                        >
                          University/College{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="relative flex-grow">
                        <div className="relative">
                          <input
                            type="text"
                            className={`border-b focus:outline-none mb-5 w-full ${errors.UniversityCollege
                              ? "border-red-500"
                              : "border-gray-300 focus:border-black"
                              }`}
                            value={selectedCollege}
                            onClick={toggleDropdown}
                            autoComplete="off"
                            readOnly
                          />
                          {errors.UniversityCollege && (
                            <p className="text-red-500 text-sm -mt-4">
                              {errors.UniversityCollege}
                            </p>
                          )}
                          <div
                            className="absolute right-0 top-0"
                            onClick={toggleDropdown}
                          >
                            <MdArrowDropDown className="text-lg  text-gray-500 mt-1 cursor-pointer" />
                          </div>
                        </div>
                        {/* Dropdown */}
                        {showDropdownCollege && (
                          <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg h-72 overflow-y-scroll">
                            {college.map((college) => (
                              <div
                                key={college.code}
                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleCollegeSelect(college)}
                              >
                                {college.University_CollegeName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* experience */}
                    <div className="flex gap-5 mb-5">
                      <div>
                        <label
                          htmlFor="CurrentExperience"
                          className="block text-sm font-medium leading-6 text-gray-900  w-36"
                        >
                          Current Experience{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="flex-grow">
                        <input
                          type="number"
                          name="CurrentExperience"
                          value={formData.CurrentExperience}
                          onChange={handleChange}
                          id="CurrentExperience"
                          min="1"
                          max="15"
                          autoComplete="off"
                          className={`border-b focus:outline-none mb-5 w-full ${errors.CurrentExperience
                            ? "border-red-500"
                            : "border-gray-300 focus:border-black"
                            }`}
                        />
                        {errors.CurrentExperience && (
                          <p className="text-red-500 text-sm -mt-4">
                            {errors.CurrentExperience}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Resume */}
                    {/* <div className="flex gap-5 mb-5">
                          <div>
                            <label
                              htmlFor="fileUpload"
                              className="block text-sm font-medium leading-6 text-gray-900 w-36"
                            >
                              Resume
                            </label>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center mt-3">
                              <label
                                htmlFor="fileUpload"
                                className="cursor-pointer border-b focus:outline-none w-full flex items-center"
                              >
                                <span className="text-gray-700 h-5"></span>
                              </label>
                              <input
                                type="file"
                                id="fileUpload"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                              />
                            </div>
                            {fileName && (
                              <div className="flex items-center border shadow p-2 rounded w-full" style={{ marginTop: "-38px" }}>
                                <AiOutlineFile size={20} className="mr-2" />
                                <span className="text-gray-700" style={{ width: "190px" }}>{fileName}</span>
                                <button
                                  onClick={handleRemoveFile}
                                  className="text-gray-500 text-sm"
                                >
                                  <AiOutlineClose />
                                </button>
                              </div>
                            )}
                            {errors.Resume && (
                              <p className="text-red-500 text-sm">{errors.Resume}</p>
                            )}
                          </div>
                        </div> */}

                    {/* Position */}

                    <div className="flex gap-5 mb-5 relative" ref={positionRef}>
                      <div>
                        <label
                          htmlFor="Position"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                        >
                          Position <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative flex-grow">
                        <div className="relative">
                          {selectedPosition ? (
                            <div className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full h-9 flex items-center">
                              <div className="bg-slate-200 rounded-lg px-2 py-1 inline-block mr-2">
                                {selectedPosition}
                                <button
                                  onClick={() => handlePositionSelect("")}
                                  className="ml-1 bg-slate-300 rounded-lg px-2"
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          ) : (
                            <input
                              type="text"
                              className={`border-b focus:outline-none mb-5 w-full ${errors.Position
                                ? "border-red-500"
                                : "border-gray-300 focus:border-black"
                                }`}
                              value={value}
                              onChange={handlePositionInputChange}
                              onClick={() => setShowDropdown(!showDropdown)}
                              autoComplete="off"
                            />
                          )}
                          {errors.Position && !selectedPosition && (
                            <p className="text-red-500 text-sm -mt-4">
                              {errors.Position}
                            </p>
                          )}

                          <MdArrowDropDown
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0"
                          />

                          {/* Dropdown */}
                          {showDropdown && (
                            <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                              <p className="p-1 font-medium">Recent Positions</p>
                              <ul>
                                {filteredPositions.slice(0, 4).map((position) => (
                                  <li
                                    key={position._id}
                                    className="bg-white border-b cursor-pointer p-1 hover:bg-gray-100"
                                    onClick={() => handlePositionSelect(position)}
                                  >
                                    {position.title}
                                  </li>
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


                  </div>





                  {/* Right content */}
                  <div className="col-span-1 float-right">
                    <div className="ml-5">
                      <div className="w-32 h-32 border border-gray-300 rounded-md flex items-center justify-center relative">
                        <input
                          type="file"
                          id="imageInput"
                          className="hidden"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                        {filePreview ? (
                          <>
                            <img src={filePreview} alt="Selected" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0">
                              <button
                                type="button"
                                onClick={handleReplace}
                                className="text-white"
                              >
                                <MdUpdate className="text-xl ml-2 mb-1" />
                              </button>
                            </div>
                            <div className="absolute bottom-0 right-0">
                              <button
                                type="button"
                                onClick={handleDeleteImage}
                                className="text-white"
                              >
                                <ImCancelCircle className="text-xl mr-2 mb-1" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            className="flex flex-col items-center justify-center"
                            onClick={() => fileInputRef.current.click()}
                            type="button"
                          >
                            <span style={{ fontSize: "40px" }}>
                              <TbCameraPlus />
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>




                </div>
                {showImagePopup && (
                  <div className="fixed inset-0 flex z-50 items-center justify-center bg-gray-200 bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg">
                      <p>Upload the image for identification, if not then you can continue to the next page.</p>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowImagePopup(false)}
                          className="bg-gray-300 text-black px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="footer-button"
                          onClick={handleContinue}>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Footer */}
                <div className="footer-buttons flex justify-end">
                  <button
                    type="submit"
                    className="footer-button"
                    onClick={(e) => handleSubmit(e, false)}
                  >
                    Save
                  </button>
                  <button
                    type="submit"
                    className="footer-button"
                    onClick={(e) => handleSubmit(e, true)}
                  >
                    Save & Schedule
                  </button>
                </div>
              </form>
              {/* skills */}
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
                          <button onClick={() => handleEdit(index)} className="text-blue-500 text-md">
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
                            onClick={confirmDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Yes
                          </button>
                          <button
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
            </div>




          </div>

        ) : (
          <>

            {showNewPositionContent && (
              <AddPositionForm onClose={handleclose} onPositionAdded={handleNewPositionAdded} />
            )}

          </>
        )}




      </div>

      {showPopup && (
        <Savenextpopup onClosepopup={onClosepopup} lastName={popupLastName} />
      )}
      {/* Confirmation Popup */}
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



    </>
  );
};

export default CreateCandidate;
