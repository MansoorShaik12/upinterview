import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { MdArrowDropDown } from "react-icons/md";
import DatePicker from "react-datepicker";
import axios from "axios";
import { FaSearch } from 'react-icons/fa';
import PopupComponent from "../Interviews/OutsourceOption";
const MockSchedulelater = ({ isOpen, onClose, onOutsideClick}) => {

    const [formData, setFormData] = useState({
        Title: "",
        Skills: "",
        DateTime: "",
        Interviewer: "",
        Duration: "",
        Description: "",
    });


    const [errors, setErrors] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';

        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: errorMessage });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = {
            Title: 'Title is required',
            DateTime: 'Date Time is required',
            Description: 'Description is required',
            Skills: 'Skills is required',

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

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/mockinterview`, {
                ...formData,
                Skills: selectedSkill,
                DateTime: confirmedDateTime,
                Duration: duration,
                Description: textareaValue,
                Status: "Scheduled"
            });
            console.log(response.data);
            setFormData({
                Title: "",
                Skills: "",
                DateTime: "",
                Duration: duration,
                Description: "",
                Status: "",
            });

            onClose();
        } catch (error) {
            console.error('Error creating interview or posting notification:', error);
        }
    };

    const [textareaValue, setTextareaValue] = useState("");

    const handleChangedescription = (event) => {
        const value = event.target.value;
        if (value.length <= 250) {
            setTextareaValue(value);
            event.target.style.height = 'auto';
            event.target.style.height = event.target.scrollHeight + 'px';
            setFormData({ ...formData, Description: value });

            setErrors({ ...errors, Description: '' });
        }
    };
    //for skills
    const [selectedSkill, setSelectedSkill] = useState("");
    const [showDropdownSkills, setShowDropdownSkills] = useState(false);
    const [skills, setSkills] = useState([]);
    const [searchTermSkills, setSearchTermSkills] = useState('');

    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/skills`);
                setSkills(response.data);
            } catch (error) {
                console.error('Error fetching skills data:', error);
            }
        };
        fetchSkillsData();
    }, []);

    const toggleDropdownSkills = () => {
        setShowDropdownSkills(!showDropdownSkills);
    };

    const handleSkillSelect = (skill) => {
        setSelectedSkill(skill);
        setFormData((prevFormData) => ({
            ...prevFormData,
            Skills: skill
        }));
        setShowDropdownSkills(false);
        setErrors((prevErrors) => ({
            ...prevErrors,
            Skills: ''
        }));
    };

    const filteredSkills = skills.filter(skill =>
        skill.SkillName.toLowerCase().includes(searchTermSkills.toLowerCase())
    );

    const [showDropdownAssessment, setShowDropdownAssessment] = useState(false);
    const toggleDropdownAssessment = () => {
        setShowDropdownAssessment(!showDropdownAssessment);
    };

    const [date, setDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [duration, setDuration] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [confirmedDateTime, setConfirmedDateTime] = useState("");

    const timeOptions = [
        "00:00",
        "00:30",
        "01:00",
        "01:30",
        "02:00",
        "02:30",
        "03:00",
        "03:30",
        "04:00",
        "04:30",
        "05:00",
        "05:30",
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30",
    ];

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
        setShowDatePicker(false);
        setStartTime(timeOptions[0]);
        setEndTime(timeOptions[0]);
        setShowTimePicker(true);
        setFormData((prevFormData) => ({
            ...prevFormData,
            DateTime: selectedDate
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            DateTime: ''
        }));
    };

    const handleTimeChange = (e, type) => {
        const selectedTime = e.target.value;
        if (type === "start") {
            setStartTime(selectedTime);
        } else {
            setEndTime(selectedTime);
        }
    };

    const calculateDuration = () => {
        if (startTime && endTime) {
            const [startHour, startMinute] = startTime.split(":").map(Number);
            const [endHour, endMinute] = endTime.split(":").map(Number);

            let start = new Date();
            start.setHours(startHour, startMinute);

            let end = new Date();
            end.setHours(endHour, endMinute);

            let durationInMinutes = (end - start) / 60000;

            if (durationInMinutes < 0) {
                durationInMinutes += 24 * 60;
            }

            const hours = Math.floor(durationInMinutes / 60);
            const minutes = durationInMinutes % 60;
            const hoursString = hours.toString().padStart(2, '0');
            const minutesString = minutes.toString().padStart(2, '0');

            const durationString = `${hoursString}:${minutesString}`;
            setDuration(durationString);
        }
    };

    const handleConfirm = () => {
        calculateDuration();
        setConfirmedDateTime(
            `${date.toLocaleDateString()} ${startTime} - ${endTime} `
        );
        setShowTimePicker(false);
    };

    const [showDurationDropdown, setShowDurationDropdown] = useState(false);
    const durationOptions = ["30 mins", "45 mins", "1 hr", "1:30 hrs", "2 hrs"];

    // ... existing functions ...

    const handleDurationSelect = (selectedDuration) => {
        setDuration(selectedDuration);
        setShowDurationDropdown(false);
        setFormData((prevFormData) => ({
            ...prevFormData,
            Duration: selectedDuration
        }));
    };

    const toggleDurationDropdown = () => {
        setShowDurationDropdown(!showDurationDropdown);
    };
    // const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleAddInterviewClick = () => {
        // setSidebarOpen(false);
        setShowPopup(true);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        // setSidebarOpen(true);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" >
            <div
                onClick={onOutsideClick}
                className={`fixed inset-y-0 right-0 w-1/2 bg-white shadow-lg transition-transform duration-5000 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div>
                    <div className="fixed top-0 w-full bg-white border-b z-0">
                        <div className="flex justify-between items-center p-4">
                            <h2 className="text-lg font-bold">Schedule An Interview</h2>
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
                    {/* Content */}
                    <div className="fixed top-20 bottom-14 overflow-auto p-4 w-full">
                        <form onSubmit={handleSubmit}>
                            {/*  Interview Title */}
                            <div className="flex gap-5 mb-5">
                                <div>
                                    <label
                                        for="Title"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                                    >
                                        Interview Title <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="flex-grow">
                                    <input
                                        value={formData.Title}
                                        onChange={handleChange}
                                        name="Title"
                                        type="text"
                                        id="Title"
                                        className={`border-b focus:outline-none mb-5 w-full ${errors.Title ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                                    />
                                    {errors.Title && <p className="text-red-500 text-sm -mt-4">{errors.Title}</p>}
                                </div>
                            </div>

                            {/* Skills/Technology */}

                            <div className="flex gap-5 mb-5">
                                <div>
                                    <label
                                        htmlFor="Skill"
                                        className="block text-sm font-medium leading-6 text-gray-900 dark:text-black w-36"
                                    >
                                        Skills/Technology <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="relative flex-grow">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="Skill"
                                            className={`border-b focus:outline-none mb-5 w-full ${errors.Skills ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                                            value={formData.Skills}
                                            onClick={toggleDropdownSkills}
                                            readOnly
                                        />
                                        <MdArrowDropDown className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0" onClick={toggleDropdownSkills} />
                                        {errors.Skills && <p className="text-red-500 text-sm -mt-4">{errors.Skills}</p>}
                                    </div>
                                    {showDropdownSkills && (
                                        <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg max-h-48 overflow-y-auto">
                                            <div className="flex items-center border-b p-2">
                                                <FaSearch className="absolute left-2 text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search Skills"
                                                    value={searchTermSkills}
                                                    onChange={(e) => setSearchTermSkills(e.target.value)}
                                                    className="pl-8 focus:border-black focus:outline-none w-full"
                                                />
                                            </div>
                                            {filteredSkills.length > 0 ? (
                                                filteredSkills.map((skill, index) => (
                                                    <div
                                                        key={index}
                                                        className="py-2 px-4 cursor-pointer hover:bg-gray-100 text-sm "
                                                        onClick={() => handleSkillSelect(skill.SkillName)}
                                                    >
                                                        {skill.SkillName}
                                                    </div>
                                                ))                                                                                                              
                                            ) : (
                                                <div className="p-2 text-gray-500">No skills found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* date */}
                            <div>
                                <div className="flex gap-5 mb-5">
                                    <div>
                                        <label
                                            htmlFor="title"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                                        >
                                            Date&Time <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <div className="flex-grow relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={confirmedDateTime}
                                            onClick={() => {
                                                setShowDatePicker(true);
                                                setShowTimePicker(false);
                                            }}
                                            className={`border-b focus:outline-none mb-5 w-full ${errors.DateTime ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                                        />
                                        {errors.DateTime && <p className="text-red-500 text-sm -mt-4">{errors.DateTime}</p>}
                                        {showDatePicker && (
                                            <div className="absolute z-10 -mt-3">
                                                <DatePicker
                                                    selected={date}
                                                    onChange={handleDateChange}
                                                    inline
                                                />
                                            </div>
                                        )}

                                        {showTimePicker && (
                                            <div className="absolute z-10 -mt-3 bg-white p-2 text-sm rounded-sm shadow w-full">
                                                <div className="flex gap-2">
                                                    <div className="mb-4 mr-1">
                                                        <label className="block mb-2">
                                                            Select Start Time
                                                        </label>
                                                        <select
                                                            className="border border-gray-300 p-2 rounded w-32"
                                                            value={startTime}
                                                            onChange={(e) => handleTimeChange(e, "start")}
                                                        >
                                                            {timeOptions.map((time, index) => (
                                                                <option key={index} value={time}>
                                                                    {time}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block mb-2">
                                                            Select End Time
                                                        </label>
                                                        <select
                                                            className="border border-gray-300 p-2 rounded w-32"
                                                            value={endTime}
                                                            onChange={(e) => handleTimeChange(e, "end")}
                                                        >
                                                            {timeOptions.map((time, index) => (
                                                                <option key={index} value={time}>
                                                                    {time}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {startTime && endTime && (
                                                        <button
                                                            onClick={handleConfirm}
                                                            className="mt-7 bg-blue-500 text-white  p-2 w-20 h-9 rounded"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Duration */}

                            <div className="flex gap-5 mb-5">
                                <div>
                                    <label
                                        htmlFor="duration"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                                    >
                                        Duration <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="flex-grow relative">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="duration"
                                            className="border-b focus:outline-none mb-5 w-full border-gray-300 focus:border-black"
                                            value={duration}
                                            onClick={toggleDurationDropdown}
                                            readOnly
                                        />
                                        <MdArrowDropDown className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0" onClick={toggleDurationDropdown} />
                                    </div>
                                    {/* {showDurationDropdown && (
                                        <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                                            {durationOptions.map((option) => (
                                                <div
                                                    key={option}
                                                    className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleDurationSelect(option)}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    )} */}
                                </div>
                            </div>


                            {/*  Add Interviews */}
                            <div className="flex gap-5 mb-5">
                                <label
                                    htmlFor="Interviewer"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                                >
                                 Interviewer <span className="text-red-500">*</span>
                                </label>
                                <div className="relative flex-grow">
                                    <div
                                        className="border-b border-gray-300 focus:border-black focus:outline-none min-h-6 h-auto mb-5 w-full relative"
                                        onClick={handleAddInterviewClick}
                                    ></div>
                                </div>
                            </div>
                            {/* Description/Instruction */}
                            <div className="flex gap-5 mb-5">
                                <div>
                                    <label
                                        htmlFor="Instructions"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                                    >
                                        Instructions
                                        <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="flex-grow">
                                    <textarea
                                        value={textareaValue}
                                        onChange={handleChangedescription}
                                        name="instructions"
                                        id="instructions"
                                        rows={5}
                                        className={`border rounded-md p-2 focus:outline-none mb-5 w-full ${errors.Description ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                                    ></textarea>
                                    {errors.Description && <p className="text-red-500 text-sm -mt-4">{errors.Description}</p>}
                                    {textareaValue.length > 0 && (
                                        <p className="text-gray-600 text-sm">{textareaValue.length}/250</p>
                                    )}
                                </div>
                            </div>


                            {/* Footer */}
                            <div className="footer-buttons flex justify-end">
                                <button type="submit" className="footer-button">
                                    Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {showPopup && <PopupComponent onClose={handlePopupClose} />}
        </div>
    );
};

export default MockSchedulelater;
