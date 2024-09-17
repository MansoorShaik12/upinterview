import React, { useState, useRef, useEffect, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-input-2/lib/style.css";
import { MdArrowDropDown } from "react-icons/md";
import DatePicker from "react-datepicker";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";
import AddPositionForm from "../Interviews/Addpositionform";
import { useLocation } from "react-router-dom";

const NewAssessment = ({ onClose, candidate1 }) => {
  const location = useLocation();
  const assessmentData = location.state?.assessment || candidate1;
  const [updatedCandidate, setUpdatedCandidate] = useState(assessmentData);


  const [formData, setFormData] = useState({
    AssessmentTitle: "",
    AssessmentType: "",
    Skill_Technology: "",
    Position: "",
    Duration: "",
    TotalScore: "",
    PassScore: "",
    DifficultyLevel: "",
    NumberOfQuestions: "",
    ExpiryDate: "",
  });
  const [errors, setErrors] = useState("");
  
  const handleChange = (e) => {
    const { name } = e.target;
    let errorMessage = "";

    setUpdatedCandidate({
      ...updatedCandidate,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [name]: errorMessage });
  };

  useEffect(() => {
    setFormData(updatedCandidate);
    setSelectedPosition(updatedCandidate.Position || "");
    setStartDate(new Date(updatedCandidate.ExpiryDate || Date.now()));
  }, [updatedCandidate]);

  const handleCombinedSubmit = async (_id, e, path = null) => {
    e.preventDefault();
    const requiredFields = {
      AssessmentTitle: "Assessment Title is required",
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

    const questionData = {
      _id: _id,
      AssessmentTitle: formData.AssessmentTitle,
      AssessmentType: selectedAssessmentType,
      Skill_Technology: selectedSkill,
      Position: selectedPosition,
      Duration: selectedDuration,
      PassScore: selectedPassScore,
      DifficultyLevel: selectedDifficulty,
      NumberOfQuestions: selectedNumberOfQuestions,
      ExpiryDate: startDate,
    };

    console.log("Data being sent:", questionData);

    try {
      const questionResponse = await axios.put(
        `http://localhost:3000/assessment/${_id}`,
        questionData
      );
      console.log("Assessment created:", questionResponse.data);

      const questionId = questionResponse.data._id;

      const optionsData = {
        QuestionId: questionId,
        Options: mcqOptions.map((option) => option.option),
      };

      const optionsResponse = await axios.put(
        `http://localhost:3000/options/${questionId}`,
        optionsData
      );
      console.log("Options created:", optionsResponse.data);

      setFormData({
        AssessmentTitle: "",
        AssessmentType: "",
        Skill_Technology: "",
        Position: "",
        Duration: "",
        TotalScore: "",
        PassScore: "",
        DifficultyLevel: "",
        NumberOfQuestions: "",
        ExpiryDate: "",
      });

      setMcqOptions([
        { option: "", isSaved: false, isEditing: false },
        { option: "", isSaved: false, isEditing: false },
        { option: "", isSaved: false, isEditing: false },
        { option: "", isSaved: false, isEditing: false },
      ]);
    } catch (error) {
      console.error("Error creating question or options:", error);
    }

    onClose();
  };

  const [selectedAssessmentType, setSelectedAssessmentType] = useState(
    updatedCandidate.AssessmentType
  );
  const [showDropdownAssessment, setShowDropdownAssessment] = useState(false);
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
    setSelectedAssessmentType(type);
    setShowDropdownAssessment(false);
    setUpdatedCandidate((prevData) => ({
      ...prevData,
      AssessmentType: type,
    }));
  };
  const [mcqOptions, setMcqOptions] = useState([
    { option: "", isSaved: false, isEditing: false },
    { option: "", isSaved: false, isEditing: false },
    { option: "", isSaved: false, isEditing: false },
    { option: "", isSaved: false, isEditing: false },
  ]);

  const [selectedSkill, setSelectedSkill] = useState(
    updatedCandidate.Skill_Technology
  );
  const [showDropdownSkills, setShowDropdownSkills] = useState(false);
  const skills = ["JavaScript", "Python", "React", "HTML/CSS"];
  const toggleDropdownSkills = () => {
    setShowDropdownSkills(!showDropdownSkills);
  };
  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setShowDropdownSkills(false);
    setUpdatedCandidate((prevData) => ({
      ...prevData,
      skill: skill,
    }));
  };

  const [selectedDuration, setSelectedDuration] = useState(
    updatedCandidate.Duration
  );
  const [showDropdownDuration, setShowDropdownDuration] = useState(false);
  const durations = ["30 minutes", "45 minutes", "1 hour"];
  const toggleDropdownDuration = () => {
    setShowDropdownDuration(!showDropdownDuration);
  };
  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    setShowDropdownDuration(false);
    setUpdatedCandidate((prevData) => ({
      ...prevData,
      duration: duration,
    }));
  };

  const [selectedPassScore] = useState(
    updatedCandidate.PassScore
  );

  const [selectedDifficulty, setSelectedDifficulty] = useState(
    updatedCandidate.DifficultyLevel
  );
  const [showDropdownDifficulty, setShowDropdownDifficulty] = useState(false);
  const difficultyLevels = ["Easy", "Medium", "Hard"];
  const toggleDropdownDifficulty = () => {
    setShowDropdownDifficulty(!showDropdownDifficulty);
  };
  const handleDifficultySelect = (level) => {
    setSelectedDifficulty(level);
    setShowDropdownDifficulty(false);
    setUpdatedCandidate((prevData) => ({
      ...prevData,
      level: level,
    }));
  };

  const [selectedNumberOfQuestions, setSelectedNumberOfQuestions] = useState(
    updatedCandidate.NumberOfQuestions
  );
  const [showDropdownNumberOfQuestions, setShowDropdownNumberOfQuestions] =
    useState(false);
  const numberOfQuestionsOptions = ["5", "10", "15", "20"];
  const toggleDropdownNumberOfQuestions = () => {
    setShowDropdownNumberOfQuestions(!showDropdownNumberOfQuestions);
  };
  const handleNumberOfQuestionsSelect = (numberOfQuestions) => {
    setSelectedNumberOfQuestions(numberOfQuestions);
    setShowDropdownNumberOfQuestions(false);
    setUpdatedCandidate((prevData) => ({
      ...prevData,
      numberOfQuestions: numberOfQuestions,
    }));
  };


  const [sidebarOpenForSection, setSidebarOpenForSection] = useState(false);
  const sidebarRefForSection = useRef(null);

  const closeSidebarForSection = () => {
    setSidebarOpenForSection(false);
  };
  const handleOutsideClickForSection = useCallback((event) => {
    if (
      sidebarRefForSection.current &&
      !sidebarRefForSection.current.contains(event.target)
    ) {
      closeSidebarForSection();
    }
  }, []);

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


  const [sidebarOpenAddQuestion, setSidebarOpenAddQuestion] = useState(false);
  const sidebarRefAddQuestion = useRef(null);

  const closeSidebarAddQuestion = () => {
    setSidebarOpenAddQuestion(false);
  };
  const handleOutsideClickAddQuestion = useCallback((event) => {
    if (
      sidebarRefAddQuestion.current &&
      !sidebarRefAddQuestion.current.contains(event.target)
    ) {
      closeSidebarAddQuestion();
    }
  }, []);

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

  const [showMainContent, setShowMainContent] = useState(true);
  const [showNewPositionContent, setShowNewPositionContent] = useState(false);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/candidate");
        console.log("Candidate data:", response.data);
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };
    fetchCandidateData();
  }, []);

  const [selectedPosition, setSelectedPosition] = useState(updatedCandidate.Position || "");
  const [positions, setPositions] = useState([]);
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState(new Date(updatedCandidate.ExpiryDate || Date.now()));

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/position");
        console.log("Position data:", response.data);
      } catch (error) {
        console.error("Error fetching position data:", error);
      }
    };

    fetchSkillsData();
  }, []);

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

  const [showDropdownPosition, setShowDropdownPosition] = useState(false);

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/position");
        console.log("Position data:", response.data);
      } catch (error) {
        console.error("Error fetching position data:", error);
      }
    };

    fetchSkillsData();
  }, []);

  useEffect(() => {
    const fetchPositionsData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/position");
        console.log("Position data:", response.data);
        setPositions(response.data);
      } catch (error) {
        console.error("Error fetching position data:", error);
      }
    };
    fetchPositionsData();
  }, []);

  const toggleDropdownPosition = () => {
    setShowDropdownPosition(!showDropdownPosition);
  };

  const handlePositionSelect = (position) => {
    setSelectedPosition(position);
    setShowDropdownPosition(false);
    setFormData((prevData) => ({
      ...prevData,
      Position: position.title,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      Position: "",
    }));
  };

  const handleclose = () => {
    setShowMainContent(true);
    setShowNewPositionContent(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-15 z-50">
      <div className="fixed inset-y-0 right-0 z-50 w-1/2 bg-white shadow-lg transition-transform duration-5000 transform 'translate-x-0' : 'translate-x-full'">
        <div>
          {showMainContent ? (
            <div>
              <div className="fixed top-0 w-full bg-white border-b z-0">
                <div className="flex justify-between items-center p-4">
                  <h2 className="text-lg font-bold">New Assessment</h2>
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

              <div className="fixed top-16 bottom-16 overflow-auto w-full">
                <div>
                  <div className="container mx-auto">
                    <form className="group p-4">
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
                            value={updatedCandidate.AssessmentTitle}
                            onChange={handleChange}
                            autoComplete="given-name"
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
                      <div className="flex gap-5 mb-5">
                        <div>
                          <label
                            htmlFor="AssessmentType"
                            className="block text-sm font-medium leading-6 text-gray-900 w-36"
                          >
                            Assessment type{" "}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="flex-grow">
                          <div className="relative">
                            <input
                              type="text"
                              id="AssessmentType"
                              className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full"
                              value={selectedAssessmentType}
                              onClick={toggleDropdownAssessment}
                              readOnly
                            />
                            <MdArrowDropDown
                              className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0"
                              onClick={toggleDropdownAssessment}
                            />
                            {showDropdownAssessment && (
                              <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                                {assessmentTypes.map((questionType) => (
                                  <div
                                    key={questionType}
                                    className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                    onClick={() =>
                                      handleAssessmentTypeSelect(questionType)
                                    }
                                  >
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
                          <label
                            htmlFor="skills"
                            className="block text-sm font-medium leading-6 text-gray-900 w-36"
                          >
                            Skills/Technology{" "}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="relative flex-grow">
                          <div className="relative">
                            <input
                              type="text"
                              id="skills"
                              className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full"
                              value={selectedSkill}
                              onClick={toggleDropdownSkills}
                              readOnly
                            />

                            <MdArrowDropDown
                              className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0"
                              onClick={toggleDropdownSkills}
                            />
                          </div>
                          {showDropdownSkills && (
                            <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                              {skills.map((skill) => (
                                <div
                                  key={skill}
                                  className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSkillSelect(skill)}
                                >
                                  {skill}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-5 mb-5">
                        <div>
                          <label
                            htmlFor="position"
                            className="block text-sm font-medium leading-6 text-gray-900 w-36"
                          >
                            Position <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="relative flex-grow">
                          <div className="relative mb-5">
                            {selectedPosition ? (
                              <div className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full h-9 flex items-center">
                                <div className="bg-slate-200 rounded px-2 py-1 inline-block mr-2">
                                  {selectedPosition}
                                  <button
                                    className="ml-2 bg-slate-300 rounded px-2"
                                    onClick={() => setSelectedPosition("")}
                                  >
                                    X
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <input
                                type="text"
                                id="position"
                                className={`border-b focus:outline-none w-full ${errors.Position ? "border-red-500" : "border-gray-300 focus:border-black"
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
                                    onClick={() => handlePositionSelect(position)}
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
                      <div className="flex gap-5 mb-5">
                        <div>
                          <label
                            htmlFor="duration"
                            className="block text-sm font-medium leading-6 text-gray-900 w-36"
                          >
                            Duration <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="relative flex-grow">
                          <div className="relative">
                            <input
                              type="text"
                              id="duration"
                              className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full"
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
                                  onClick={() => handleDurationSelect(duration)}
                                >
                                  {duration}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
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
                              className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full"
                              value={selectedDifficulty}
                              onClick={toggleDropdownDifficulty}
                              readOnly
                            />

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
                                  onClick={() => handleDifficultySelect(level)}
                                >
                                  {level}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-5 mb-5">
                        <div>
                          <label
                            htmlFor="expiry"
                            className="block text-sm font-medium leading-6 text-gray-900 w-36"
                          >
                            Expiry date <span className="text-red-500">*</span>
                          </label>
                        </div>

                        <div className="relative flex-grow">
                          <div className="relative">
                            <div className="border-b border-gray-300 mb-5 w-full">
                              <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd-MM-yyyy"
                                className="focus:border-black focus:outline-none"
                                placeholderText=""
                                minDate={new Date()}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-5 mb-5">
                        <div>
                          <label
                            htmlFor="numberOfQuestions"
                            className="block text-sm font-medium leading-6 text-gray-900 w-36"
                          >
                            No. of Questions{" "}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="relative flex-grow">
                          <div className="relative">
                            <input
                              type="text"
                              id="numberOfQuestions"
                              className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full"
                              value={selectedNumberOfQuestions}
                              onClick={toggleDropdownNumberOfQuestions}
                              readOnly
                            />
                            <MdArrowDropDown
                              className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0"
                              onClick={toggleDropdownNumberOfQuestions}
                            />
                          </div>
                          {showDropdownNumberOfQuestions && (
                            <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                              {numberOfQuestionsOptions.map(
                                (numberOfQuestions) => (
                                  <div
                                    key={numberOfQuestions}
                                    className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                    onClick={() =>
                                      handleNumberOfQuestionsSelect(
                                        numberOfQuestions
                                      )
                                    }
                                  >
                                    {numberOfQuestions}
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="SaveAndScheduleButtons">
                        <button
                          type="submit"
                          onClick={(event) =>
                            handleCombinedSubmit(
                              updatedCandidate._id,
                              event,
                              "/assessment"
                            )
                          }
                          className="footer-button"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
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
      </div>
    </div>
  );
};

export default NewAssessment;
