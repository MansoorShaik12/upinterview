import React, { useState, useEffect, useRef, useContext } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { TbCameraPlus } from "react-icons/tb";
import { MdUpdate } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { GiCancel } from "react-icons/gi";
import { IoIosCopy } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from 'moment-timezone';
import { useNavigate } from "react-router-dom";
import TimezoneSelect from 'react-timezone-select';
import { ProfileContext } from '../../Context/ProfileContext.js';
import { FaSearch } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const MultiStepForm = () => {


    const [selectedTimezone, setSelectedTimezone] = useState({});
    const [selectedLocation, setSelectedLocation] = useState('');
    const [showDropdownLocation, setShowDropdownLocation] = useState(false);
    const [searchTermLocation, setSearchTermLocation] = useState('');

    const { setProfileData } = useContext(ProfileContext);
    const { user } = useAuth0();

    console.log('this is user details', user);

    // basicdetails1
    const [nameError, setNameError] = useState('');
    const [UserIdError, setUserIdError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [linkedinurlError, setLinkedinurlError] = useState('');
    const [genderError, setGenderError] = useState('');

    // additional details
    const [currentroleError, setCurrentroleError] = useState('');
    const [industryError, setIndustryError] = useState('');
    const [experienceError, setExperienceError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [introductionError, setIntroductionError] = useState('');

    // basicdetails2
    const [technologyError, setTechnologyError] = useState('');
    const [skillError, setSkillError] = useState('');
    const [previousExperienceError, setPreviousExperienceError] = useState('');
    const [expertiseLevelError, setExpertiseLevelError] = useState('');

    // availability
    const [timesError, setTimesError] = useState('');
    const [timeZoneError, setTimeZoneError] = useState('');
    const [preferredDurationError, setPreferredDurationError] = useState('');

    const [step, setStep] = useState(0);

    const [showPopup, setShowPopup] = useState(false);


    const handleNextStep = async () => {
        let hasError = false;

        // Validate fields for ComponentOne
        if (step === 0) {
            if (!formData.Name) {
                setNameError('Last Name is required');
                hasError = true; // Set to true on error
            } else {
                setNameError('');
            }

            if (!formData.UserId) {
                setUserIdError('UserId is required');
                hasError = true; // Set to true on error
            } else {
                setUserIdError('');
            }

            if (!selectedGender) {
                setGenderError('Gender is required');
                hasError = true;
            } else {
                setGenderError('');
            }

            if (!formData.Email) {
                setEmailError('Email is required');
                hasError = true; // Set to true on error
            } else {
                setEmailError('');
            }

            if (!formData.Phone) {
                setPhoneError('Phonenumber is required');
                hasError = true; // Set to true on error
            } else {
                setPhoneError('');
            }

            if (!formData.LinkedinUrl) {
                setLinkedinurlError('LinkedIn URL is required');
                hasError = true; // Set to true on error
            } else {
                setLinkedinurlError('');
            }

            // Log the error state
            console.log("Has Error:", hasError); // Debugging line
            console.log("Form Data:", formData); // Log form data

            if (hasError) return; // Prevent moving to next step if errors exist

            setStep(1); // Move to ComponentTwo
        }
        if (step === 1) {
            if (!formData2.CurrentRole) {
                setCurrentroleError('Current Role is required');
                hasError = true // Set to true on error
            } else {
                setCurrentroleError('');
            }

            if (!selectedIndustry) {
                setIndustryError('Industry is required');
                hasError = true // Set to true on error
            } else {
                setIndustryError('');
            }

            if (!formData2.Experience) {
                setExperienceError('Experience is required');
                hasError = true // Set to true on error
            } else {
                setExperienceError('');
            }

            if (!selectedLocation) {
                setLocationError('Location is required');
                hasError = true // Set to true on error
            } else {
                setLocationError('');
            }

            if (!formData2.Introduction) {
                setIntroductionError('Introduction is required');
                hasError = true // Set to true on error
            } else {
                setIntroductionError('');
            }

            if (hasError) return; // Prevent moving to next step if errors exist
            setStep(1); // Move to ComponentTwo
        }
        if (step === 2) {
            if (!selectedCandidates.length) {
                setTechnologyError('Technology is required');
                hasError = true // Set to true on error
            } else {
                setTechnologyError('');
            }

            if (!selectedSkills.length) {
                setSkillError('Skill is required');
                hasError = true // Set to true on error
            } else {
                setSkillError('');
            }

            if (!previousExperience) {
                setPreviousExperienceError('Previous Experience is required');
                hasError = true // Set to true on error
            } else {
                setPreviousExperienceError('');
            }

            if (!expertiseLevel) {
                setExpertiseLevelError('Expertise Level is required');
                hasError = true // Set to true on error
            } else {
                setExpertiseLevelError('');
            }

            if (hasError) return; // Prevent moving to next step if errors exist
            setStep(3); // Move to ComponentThree
        }


        // Validate fields for ComponentThree
        if (step === 3) {
            const hasValidTimeSlot = Object.values(times).some(dayTimes =>
                dayTimes.some(timeSlot => timeSlot.startTime && timeSlot.endTime)
            );

            if (!hasValidTimeSlot) {
                setTimesError('At least one valid time slot is required');
                hasError = true // Set to true on error
            } else {
                setTimesError('');
            }

            if (!formData4.TimeZone) {
                setTimeZoneError('Time Zone is required');
                hasError = true // Set to true on error
            } else {
                setTimeZoneError('');
            }

            if (!selectedOption) {
                setPreferredDurationError('Preferred Interview Duration is required');
                hasError = true // Set to true on error
            } else {
                setPreferredDurationError('');
            }

            if (hasError) return; // Prevent saving if errors exist
            setStep(3)

        }

        else {

            setStep(step + 1);
        }

    };


    const handlePrevStep = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };
    const navigateToHome = async () => {
        let hasError = false;

        // Validate fields for the final step (Availability)
        if (step === 3) {
            const hasValidTimeSlot = Object.values(times).some(dayTimes =>
                dayTimes.some(timeSlot => timeSlot.startTime && timeSlot.endTime)
            );

            if (!hasValidTimeSlot) {
                setTimesError('At least one valid time slot is required');
                hasError = true;
            } else {
                setTimesError('');
            }

            if (!formData4.TimeZone) {
                setTimeZoneError('Time Zone is required');
                hasError = true;
            } else {
                setTimeZoneError('');
            }

            if (!selectedOption) {
                setPreferredDurationError('Preferred Interview Duration is required');
                hasError = true;
            } else {
                setPreferredDurationError('');
            }

            if (hasError) return; // Prevent saving if errors exist
        }

        // Save data to the database
        try {
            const response = await handleSubmit(); // Ensure handleSubmit is defined and returns a response
            navigate('/home', { state: { data: response.data } }); // Navigate to home page after successful save
        }
        catch (error) {
            console.error("Error saving data:", error);
        }
    };
    const [errors, setErrors] = useState({});

    const handleComponentThreeData = (data) => {
        setFormData({ ...formData, componentThreeData: data });
    };

    const handleComponentFourData = (data) => {
        setFormData({ ...formData, componentFourData: data });
    };

    const [shouldSubmit, setShouldSubmit] = useState(false);

    //for industry used master data
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [showDropdownIndustry, setShowDropdownIndustry] = useState(false);
    const toggleDropdownIndustry = () => {
        setShowDropdownIndustry(!showDropdownIndustry);
    };

    const [industries, setIndustries] = useState([]);
    useEffect(() => {
        const fetchindustriesData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/industries`);
                setIndustries(response.data);
            } catch (error) {
                console.error('Error fetching industries data:', error);
            }
        };
        fetchindustriesData();
    }, []);

    //for location used master data 

    const toggleDropdownLocation = () => {
        setShowDropdownLocation(!showDropdownLocation);
    };
    const [locations, setLocations] = useState([]);;

    useEffect(() => {
        const fetchlocationsData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/locations`);
                setLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations data:', error);
            }
        };
        fetchlocationsData();
    }, []);

    // currentroles  fetching from master table

    const [selectedCurrentRole, setSelectedCurrentRole] = useState('');
    const [showDropdownCurrentRole, setShowDropdownCurrentRole] = useState(false);
    const [CurrentRole, setCurrentRole] = useState([]);

    const toggleCurrentRole = () => {
        setShowDropdownCurrentRole(!showDropdownCurrentRole);
    };

    useEffect(() => {
        const fetchsetcurrentrolesData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/roles`);
                setCurrentRole(response.data);
            } catch (error) {
                console.error('Error fetching roles data:', error);
            }
        };
        fetchsetcurrentrolesData();
    }, []);

    const handleRoleSelect = (role) => {
        setSelectedCurrentRole(role);
        handleChange({ target: { name: 'CurrentRole', value: role } });
        setShowDropdownCurrentRole(false);
        setCurrentroleError('');
    };

    //technology fetching from master data 
    const [services, setServices] = useState([]);
    console.log(services)
    useEffect(() => {
        const fetchtechnologyData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/technology`);
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching roles data:', error);
            }
        };
        fetchtechnologyData();
    }, []);


    const [selectedCandidates, setSelectedCandidates] = useState([]);

    const popupRef = useRef(null);


    const handleRemoveCandidate = (index) => {
        setSelectedCandidates(selectedCandidates.filter((_, i) => i !== index));
    };
    const clearRemoveCandidate = () => {
        setSelectedCandidates([]);
    };
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setShowPopup(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const togglePopup = () => {
        setShowPopup((prev) => !prev);
    };

    const [skills, setSkills] = useState([]);
    console.log(skills)

    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/skills`);
                setSkills(response.data);
            } catch (error) {
                console.error('Error fetching roles data:', error);
            }
        };
        fetchSkillsData();
    }, []);

    const [selectedSkills, setSelectedSkills] = useState([])
    const [showSkillsPopup, setShowSkillsPopup] = useState(false);
    const skillsPopupRef = useRef(null);

    const handleRemoveSkill = (index) => {
        setSelectedSkills(selectedSkills.filter((_, i) => i !== index));
    };

    const clearSkills = () => {
        setSelectedSkills([]);
    };

    const handleSkillsClickOutside = (event) => {
        if (skillsPopupRef.current && !skillsPopupRef.current.contains(event.target)) {
            setShowSkillsPopup(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleSkillsClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleSkillsClickOutside);
        };
    }, []);

    const toggleSkillsPopup = () => {
        setShowSkillsPopup((prev) => !prev);
    };



    const [previousExperience, setPreviousExperience] = useState('');

    const [expertiseLevel, setExpertiseLevel] = useState('');

    const [selectedOption, setSelectedOption] = useState(null);

    const navigate = useNavigate();

    const [times, setTimes] = useState({
        Sunday: [{ startTime: null, endTime: null }],
        Monday: [{ startTime: null, endTime: null }],
        Tuesday: [{ startTime: null, endTime: null }],
        Wednesday: [{ startTime: null, endTime: null }],
        Thursday: [{ startTime: null, endTime: null }],
        Friday: [{ startTime: null, endTime: null }],
        Saturday: [{ startTime: null, endTime: null }]
    });

    const [showPopup1, setShowPopup1] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

    const handleCopy = (event, day) => {
        setSelectedDay(day);
        setSelectedDays([day]);
        const buttonRect = event.target.getBoundingClientRect();
        setPopupPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.left + window.scrollX
        });
        setShowPopup1(true);
    };

    const handlePaste = () => {
        const copiedTimes = times[selectedDay];
        setTimes(prevTimes => {
            const newTimes = { ...prevTimes };
            selectedDays.forEach(day => {
                newTimes[day] = copiedTimes.map(time => ({ ...time }));
            });
            return newTimes;
        });
        setShowPopup(false);
        setSelectedDay(null);
        setSelectedDays([]);
    };

    const handleAddTimeSlot = (day) => {
        setTimes(prevTimes => {
            const dayTimes = prevTimes[day];
            return {
                ...prevTimes,
                [day]: [...dayTimes, { startTime: null, endTime: null }]
            };
        });
    };

    const handleRemoveTimeSlot = (day, index) => {
        setTimes(prevTimes => {
            const newTimes = { ...prevTimes };
            if (newTimes[day].length === 1) {
                newTimes[day] = [{ startTime: "unavailable", endTime: "unavailable" }];
            } else {
                newTimes[day] = newTimes[day].filter((_, i) => i !== index);
            }
            return newTimes;
        });
    };


    const [formData, setFormData] = useState({
        Name: "" || user.name,
        Firstname: "",
        UserId: "",
        Email: user.email || "",
        Phone: "",
        LinkedinUrl: "",
        // ImageData: "",
        CountryCode: "+91",
        Gender: ""
    });

    console.log(formData)
    const [formData2, setFormData2] = useState({
        CurrentRole: "",
        industry: "",
        Experience: "",
        location: "",
        Introduction: "",
    });
    console.log(formData2)

    const [formData3, setFormData3] = useState({
        Technology: [],
        Skill: [],
        previousExperience: "",
        expertiseLevel: "",
        experienceYears: ""
    });

    console.log(formData3)

    const [formData4, setFormData4] = useState({
        TimeZone: "",
        PreferredDuration: "",
        Availability: ""
    });

    console.log("formData4", formData4)

    const [charCount, setCharCount] = useState(0);

    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (['CurrentRole', 'Experience', 'Introduction'].includes(name)) {
            setFormData2({ ...formData2, [name]: value });
        } else if (name === 'TimeZone') {
            setFormData4({ ...formData4, [name]: value });
            setTimeZoneError('');
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (name === 'Name' && value) {
            setNameError('');
        }
        if (name === 'UserId' && value) {
            setUserIdError('');
        }
        if (name === 'Gender' && value) {
            setGenderError('');
        }
        if (name === 'Email' && value) {
            setEmailError('');
        }
        if (name === 'Phone' && value) {
            setPhoneError('');
        }
        if (name === 'LinkedinUrl' && value) {
            setLinkedinurlError('');
        }
        if (name === 'CurrentRole' && value) {
            setCurrentroleError('');
        }
        if (name === 'Experience' && value) {
            setExperienceError('');
        }
        if (name === 'Introduction' && value) {
            setIntroductionError('');
            setCharCount(value.length);
        }

        // Check for User ID availability
        if (name === "UserId") {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/check-userid/${value}`);
                if (response.data.exists) {
                    setUserIdError('That User ID is already taken. Please choose another.');
                } else {
                    setUserIdError('');
                }
            } catch (error) {
                console.error('Error checking User ID:', error);
            }
        }

        // Check for Email availability
        if (name === "Email") {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/check-email/${value}`);
                if (response.data.exists) {
                    setEmailError('That email is already in use. Please choose another.');
                } else {
                    setEmailError('');
                }
            } catch (error) {
                console.error('Error checking Email:', error);
            }
        }
    };


    const handleIndustrySelect = (industry) => {
        setSelectedIndustry(industry.IndustryName);
        setFormData2((prevState) => ({
            ...prevState,
            industry: industry.IndustryName,
        }));
        setShowDropdownIndustry(false);
        setIndustryError('');
    };


    const handleSelectCandidate = (service) => {
        if (!selectedCandidates.includes(service)) {
            setSelectedCandidates((prev) => [...prev, service]);
            setFormData3((prev) => ({
                ...prev,
                Technology: [...prev.Technology, service.TechnologyMasterName],
            }));
        }
        setShowPopup(false);
        setTechnologyError('');

    };

    const handleSelectSkill = (skill) => {
        if (!selectedSkills.includes(skill)) {
            setSelectedSkills((prev) => [...prev, skill]);
            setFormData3((prev) => ({
                ...prev,
                Skill: [...prev.Skill, skill.SkillName],
            }));
        }
        setShowSkillsPopup(false);
        setSkillError('');
    };


    const handleRadioChange = (e) => {
        const value = e.target.value;
        setPreviousExperience(value);
        setPreviousExperienceError('');

        // Update formData3 with the new value
        setFormData3((prev) => ({
            ...prev,
            previousExperience: value,
        }));
    };

    const handleRadioChange2 = (e) => {
        const value = e.target.value;
        setExpertiseLevel(value);
        setExpertiseLevelError('');

        // Update formData3 with the new value
        setFormData3((prev) => ({
            ...prev,
            expertiseLevel: value,
        }));
    };
    const [experienceYears, setExperienceYears] = useState(''); // New state for years of experience
    console.log("experienceYears", experienceYears)

    const handleChangeExperienceYears = (e) => {
        const value = e.target.value;
        setExperienceYears(value); // Update state

        // Update formData3 with the new value
        setFormData3((prev) => ({
            ...prev,
            experienceYears: value, // Ensure this line is present
        }));
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setPreferredDurationError('');
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        let hasError = false
        if (!formData.Name) {
            setNameError('Last Name is required');
            hasError = true
        }

        if (hasError) return; // Prevent submission if errors exist

        const userData = {
            Name: formData.Name,
            sub: user.sub,
            Firstname: formData.Firstname,
            CountryCode: formData.CountryCode,
            UserId: formData.UserId,
            Email: formData.Email,
            Phone: formData.Phone,
            LinkedinUrl: formData.LinkedinUrl,
            Gender: selectedGender,
            isFreelancer: 'yes',
            CreatedBy: 'Admin'
        };
        console.log('Submitting form with userData:', userData); // Log the data being sent

        const contactData = {
            ...formData,
            ...formData2,
            ...formData3,
            Gender: selectedGender,
            industry: selectedIndustry,
            location: selectedLocation,
            CurrentRole: selectedCurrentRole,
            Technology: selectedCandidates.map(candidate => candidate.TechnologyMasterName),
            Skill: selectedSkills.map(skill => skill.SkillName),
            TimeZone: selectedTimezone.value,
            PreferredDuration: selectedOption,
            isFreelancer: 'yes'
        };

        console.log('Submitting form with data:', contactData);


        const availabilityData = Object.keys(times).map(day => ({
            day,
            timeSlots: times[day].filter(slot => slot.startTime && slot.endTime).map(slot => ({
                ...slot,
                day // Ensure the day field is included in each time slot
            }))
        })).filter(dayData => dayData.timeSlots.length > 0); // Filter out days without time slots

        console.log('Submitting form with availabilityData:', availabilityData);

        try {
            const userResponse = await axios.post(`${process.env.REACT_APP_API_URL}/users`, userData);
            console.log('User saved successfully:', userResponse.data);

            contactData.user = userResponse.data._id;
            const contactResponse = await axios.post(`${process.env.REACT_APP_API_URL}/contacts`, contactData);
            console.log('Contact saved successfully:', contactResponse.data);

            const availabilityIds = [];
            for (const availability of availabilityData) {
                availability.contact = contactResponse.data._id;
                const availabilityResponse = await axios.post(`${process.env.REACT_APP_API_URL}/loginavailability`, availability);
                console.log('Availability saved successfully:', availabilityResponse.data);
                availabilityIds.push(availabilityResponse.data._id);
            }

            // Update contact with availability IDs
            await axios.put(`${process.env.REACT_APP_API_URL}/contacts/${contactResponse.data._id}`, { availability: availabilityIds });

            localStorage.setItem('userId', userResponse.data._id);
            localStorage.setItem('sub', user.sub);


            if (file || user.picture) {
                const imageData = new FormData();
                if (file) {
                    imageData.append("image", file);
                } else {
                    imageData.append("imageUrl", user.picture);
                }
                imageData.append("type", "user");
                imageData.append("id", userResponse.data._id);

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

                // Upload image for contact
                imageData.set("type", "contact");
                imageData.set("id", contactResponse.data._id);

                try {
                    await axios.post(`${process.env.REACT_APP_API_URL}/upload`, imageData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                } catch (error) {
                    console.error("Error uploading image for contact:", error);
                    return;
                }
            }

            navigate('/home', { state: { data: userResponse.data } });

        } catch (error) {
            console.error('Error saving contact or user:', error);
            // Handle the error appropriately
            if (error.response) {
                console.error('Server responded with status:', error.response.status);
                console.error('Response data:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        }
    };


    // const handleTimezoneChange = (timezone) => {
    //     setSelectedTimezone(timezone);
    //     setFormData4({ ...formData4, TimeZone: timezone.value });
    //     setTimeZoneError('');
    // };

    //gender
    const [selectedGender, setSelectedGender] = useState('');
    console.log("selectedGender", selectedGender)
    const [showDropdowngender, setShowDropdownGender] = useState(false);
    const genders = ['Male', 'Female', 'Prefer not to say', 'Others'];

    const toggleDropdowngender = () => {
        setShowDropdownGender(!showDropdowngender);
    };

    const handleGenderSelect = (gender) => {
        setSelectedGender(gender);
        setShowDropdownGender(false);
        setFormData((prevFormData) => ({
            ...prevFormData,
            Gender: gender
        }));
        setGenderError('')
    }
    const location = useLocation();
    const isFreelancer = location.state?.isFreelancer;
    console.log('Is Freelancer:', isFreelancer); // Debugging line


    const [images, setImages] = useState([]);

    // const [charCount, setCharCount] = useState(0);

    const handleCountryCodeChange = (e) => {
        setFormData({ ...formData, CountryCode: e.target.value });
    };
    const handlePhoneInput = (e) => {
        const value = e.target.value;
        if (value.length <= 10) {
            handleChange(e);
        }
    };
    const [searchTermCurrentRole, setSearchTermCurrentRole] = useState('');
    const [searchTermIndustry, setSearchTermIndustry] = useState('');

    const filteredCurrentRoles = CurrentRole.filter(role =>
        role.RoleName.toLowerCase().includes(searchTermCurrentRole.toLowerCase())
    );

    const filteredIndustries = industries.filter(industry =>
        industry.IndustryName.toLowerCase().includes(searchTermIndustry.toLowerCase())
    );

    const filteredLocations = locations.filter(location =>
        location.LocationName && location.LocationName.toLowerCase().includes(searchTermLocation.toLowerCase())
    );
    const [searchTermTechnology, setSearchTermTechnology] = useState('');
    const [searchTermSkills, setSearchTermSkills] = useState('');



    // image code
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(user.picture ? user.picture : null);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
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






    const handleLocationSelect = (location) => {
        setSelectedLocation(location.LocationName);
        setFormData2((prevState) => ({
            ...prevState,
            location: location.LocationName,
        }));
        setShowDropdownLocation(false);
        setLocationError('');

        // Set timezone based on location data from the backend
        const timezone = location.TimeZone || moment.tz.guess();
        setSelectedTimezone({ value: timezone, label: timezone });
        setFormData4((prevState) => ({
            ...prevState,
            TimeZone: timezone,
        }));
    };

    const handleTimezoneChange = (timezone) => {
        setSelectedTimezone(timezone);
        setFormData4((prevState) => ({
            ...prevState,
            TimeZone: timezone.value,
        }));
        setTimeZoneError('');
    };

    useEffect(() => {
        if (selectedLocation) {
            const selectedLocData = locations.find(loc => loc.LocationName === selectedLocation);
            if (selectedLocData) {
                const timezone = selectedLocData.TimeZone || moment.tz.guess();
                setSelectedTimezone({ value: timezone, label: timezone });
                setFormData4((prevState) => ({
                    ...prevState,
                    TimeZone: timezone,
                }));
            }
        }
    }, [selectedLocation, locations]);

    return (
        <>
            <div className="border-b p-4">
                <p className="font-bold text-xl">LOGO</p>
            </div>
            <div className="flex justify-center gap-3 mt-10">
                <div className={`rounded h-2 w-24 border ${step === 0 ? 'bg-blue-500' : step > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div className={`rounded h-2 w-24 border ${step === 1 ? 'bg-blue-500' : step > 1 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div className={`rounded h-2 w-24 border ${step === 2 ? 'bg-blue-500' : step > 2 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div className={`rounded h-2 w-24 border ${step === 3 ? 'bg-blue-500' : step > 3 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>

            <form onSubmit={handleSubmit} className="container mx-auto">
                {step === 0 && (
                    <div className="mx-10 mt-7 grid grid-cols-2 gap-8">
                        <div className="col-span-1">
                            <div className="text-2xl font-bold mb-5">Basic Details:</div>
                            {/* First name */}
                            <div className="flex gap-5 mb-5">
                                <label htmlFor="Firstname" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                    First Name
                                </label>
                                <div>
                                    <input
                                        name="Firstname"
                                        type="text"
                                        id="Firstname"
                                        value={formData.Firstname}
                                        onChange={handleChange}
                                        className={`border-b focus:border-black focus:outline-none mb-5 w-96`}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            {/* Last name */}
                            <div className="flex gap-5 mb-5">
                                <label htmlFor="Name" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    <input
                                        name="Name"
                                        type="text"
                                        id="Name"
                                        value={formData.Name}
                                        onChange={handleChange}
                                        className={`border-b ${nameError ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-5 w-96`}
                                        autoComplete="off"
                                    />
                                    {nameError && <p className="text-red-500 text-sm -mt-4">{nameError}</p>}
                                </div>
                            </div>
                            {/* User id */}
                            <div className="flex gap-5 mb-5">
                                <label htmlFor="UserId" className="block text-sm font-medium leading-6 text-gray-900 w-36">User ID <span className="text-red-500">*</span></label>
                                <div>
                                    <input
                                        name="UserId"
                                        type="text"
                                        id="UserId"
                                        value={formData.UserId}
                                        onChange={handleChange}
                                        className={`border-b ${UserIdError ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-5 w-96`}
                                        autoComplete="off"
                                    />
                                    {UserIdError && <p className="text-red-500 text-sm -mt-4">{UserIdError}</p>}
                                </div>
                            </div>
                            {/* gender */}
                            <div className="flex gap-5 mb-5">
                                <label htmlFor="Gender" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <div className="relative flex-grow mb-5">
                                    <div className="relative w-96">
                                        <div className="flex items-center border-b border-gray-300 focus-within:border-black">
                                            <input
                                                type="text"
                                                className={`focus:outline-none w-96 ${genderError ? 'border-red-500' : 'border-gray-300'} focus:border-black`}
                                                id="Gender"
                                                value={selectedGender}
                                                onClick={toggleDropdowngender}
                                                readOnly
                                                autoComplete="off"
                                            />
                                            <div className="ml-2 cursor-pointer" onClick={toggleDropdowngender}>
                                                <MdArrowDropDown className="text-lg text-gray-500" />
                                            </div>
                                        </div>
                                        {genderError && <p className="text-red-500 text-sm">{genderError}</p>}
                                    </div>
                                    {showDropdowngender && (
                                        <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg">
                                            {genders.map((gender) => (
                                                <div key={gender} className="py-2 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleGenderSelect(gender)}>
                                                    {gender}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* email */}
                            <div className="flex gap-5 mb-5">
                                <label htmlFor="Email" className="block text-sm font-medium leading-6 text-gray-900 w-36">Email Address <span className="text-red-500">*</span></label>
                                <div>
                                    <input
                                        name="Email"
                                        type="text"
                                        id="Email"
                                        value={formData.Email}
                                        onChange={handleChange}
                                        placeholder="candidate@gmail.com"
                                        className={`border-b ${emailError ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-5 w-96`}
                                        autoComplete="off"
                                    />
                                    {emailError && <p className="text-red-500 text-sm -mt-4">{emailError}</p>}
                                </div>
                            </div>
                            {/* PhoneID */}
                            <div className="flex gap-5 mb-5">
                                <label htmlFor="Phone" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    <div className="flex gap-2">
                                        <select
                                            name="CountryCode"
                                            id="CountryCode"
                                            // value={formData.CountryCode}
                                            value={formData.CountryCode || "+91"} // Set default value to +91

                                            onChange={handleCountryCodeChange}
                                            className="border-b focus:outline-none mb-5 w-20"
                                        >
                                            <option value=""></option>
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
                                            placeholder="XXX-XXX-XXXX"
                                            className={`border-b ${phoneError ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-5 w-72`}
                                        />
                                    </div>
                                    {phoneError && <p className="text-red-500 text-sm -mt-4">{phoneError}</p>}
                                </div>
                            </div>
                            {/* linkedin url */}
                            <div className="flex gap-5 mb-5">
                                <label htmlFor="LinkedinUrl" className="block text-sm font-medium leading-6 text-gray-900 w-36">LinkedIn URL <span className="text-red-500">*</span></label>
                                <div>
                                    <input
                                        name="LinkedinUrl"
                                        type="text"
                                        id="LinkedinUrl"
                                        value={formData.LinkedinUrl}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        className={`border-b ${linkedinurlError ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-5 w-96`}
                                    />
                                    {linkedinurlError && <p className="text-red-500 text-sm -mt-4">{linkedinurlError}</p>}
                                </div>
                            </div>

                        </div>

                        {/* Image Upload Section */}
                        <div className="col-span-1">
                            <div className="mt-10 flex justify-center">
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
                        <div className="col-span-2 flex justify-end mb-4">
                            <button
                                onClick={handleNextStep}
                                className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400"
                                type="button"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {step === 1 && (
                    <div className="mx-10 mt-7 grid grid-cols-1 gap-8"> {/* Changed to single column layout */}
                        <div className="text-2xl font-bold mb-8">Additional Details:</div>

                        {/* Current Role */}
                        <div className="flex gap-5  relative">
                            <label htmlFor="CurrentRole" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                Current Role <span className="text-red-500">*</span>
                            </label>
                            <div className="relative w-96">
                                <input
                                    name="CurrentRole"
                                    type="text"
                                    id="CurrentRole"
                                    value={selectedCurrentRole}
                                    onClick={toggleCurrentRole}
                                    autoComplete="off"
                                    className={`border-b ${currentroleError ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-3 w-full`}
                                    readOnly
                                />
                                <div className="absolute right-2 -mt-6 transform -translate-y-1/2 cursor-pointer">
                                    <MdArrowDropDown className="text-lg text-gray-500" onClick={toggleCurrentRole} />
                                </div>
                                {currentroleError && <p className="text-red-500 text-sm -mt-4">{currentroleError}</p>}
                                {showDropdownCurrentRole && (
                                    <div className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto z-10">
                                        <div className="border-b">
                                            <div className="flex items-center border rounded px-2 py-1 m-2">
                                                <FaSearch className="absolute ml-1 text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search Current Role"
                                                    value={searchTermCurrentRole}
                                                    onChange={(e) => setSearchTermCurrentRole(e.target.value)}
                                                    className="pl-8  focus:border-black focus:outline-none w-full"
                                                />
                                            </div>
                                        </div>
                                        {filteredCurrentRoles.length > 0 ? (
                                            filteredCurrentRoles.map((role) => (
                                                <div
                                                    key={role._id}
                                                    onClick={() => handleRoleSelect(role.RoleName)}
                                                    className="cursor-pointer hover:bg-gray-200 p-2"
                                                >
                                                    {role.RoleName}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-gray-500">No roles found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Industry */}
                        <div className="flex gap-5 relative">
                            <label htmlFor="Industry" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                Industry <span className="text-red-500">*</span>
                            </label>
                            <div className="relative w-96">
                                <input
                                    name="Industry"
                                    type="text"
                                    id="Industry"
                                    value={selectedIndustry}
                                    autoComplete="off"
                                    onClick={() => setShowDropdownIndustry(!showDropdownIndustry)}
                                    className={`border-b ${industryError ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-3 w-full`}
                                    readOnly
                                />
                                <div className="absolute right-2 -mt-6 transform -translate-y-1/2 cursor-pointer">
                                    <MdArrowDropDown className="text-lg text-gray-500" onClick={() => setShowDropdownIndustry(!showDropdownIndustry)} />
                                </div>
                                {industryError && <p className="text-red-500 text-sm -mt-4">{industryError}</p>}
                                {showDropdownIndustry && (
                                    <div className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto z-10">
                                        <div className="border-b">
                                            <div className="flex items-center border rounded px-2 py-1 m-2">
                                                <FaSearch className="absolute ml-1 text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search Industry"
                                                    value={searchTermIndustry}
                                                    onChange={(e) => setSearchTermIndustry(e.target.value)}
                                                    className="pl-8  focus:border-black focus:outline-none w-full"
                                                />
                                            </div>
                                        </div>
                                        {industries.filter(industry =>
                                            industry.IndustryName.toLowerCase().includes(searchTermIndustry.toLowerCase())
                                        ).length > 0 ? (
                                            industries.filter(industry =>
                                                industry.IndustryName.toLowerCase().includes(searchTermIndustry.toLowerCase())
                                            ).map((industry) => (
                                                <div
                                                    key={industry._id}
                                                    onClick={() => handleIndustrySelect(industry)}
                                                    className="cursor-pointer hover:bg-gray-200 p-2"
                                                >
                                                    {industry.IndustryName}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-gray-500">No industries found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="flex gap-5 ">
                            <div>
                                <label htmlFor="Experience" className="block text-sm font-medium leading-6 text-gray-900  w-36">
                                    Current Experience <span className="text-red-500">*</span>
                                </label>
                            </div>
                            <div className="flex-grow">
                                <input type="number" name="Experience" autoComplete="off" value={formData2.Experience} onChange={handleChange} id="Experience" min="1" max="15" className={`border-b focus:outline-none mb-3 w-96 ${experienceError ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} />
                                {experienceError && <p className="text-red-500 text-sm -mt-4">{experienceError}</p>}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex gap-5 relative">
                            <label htmlFor="Location" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <div className="relative w-96">
                                <input
                                    name="Location"
                                    type="text"
                                    id="Location"
                                    value={selectedLocation}
                                    autoComplete="off"
                                    onClick={() => setShowDropdownLocation(!showDropdownLocation)}
                                    className={`border-b ${locationError ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-3 w-full`}
                                    readOnly
                                />
                                <div className="absolute right-2 -mt-6 transform -translate-y-1/2 cursor-pointer">
                                    <MdArrowDropDown className="text-lg text-gray-500" onClick={() => setShowDropdownLocation(!showDropdownLocation)} />
                                </div>
                                {locationError && <p className="text-red-500 text-sm -mt-4">{locationError}</p>}
                                {showDropdownLocation && (
                                    <div className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto z-10">
                                        <div className="border-b">
                                            <div className="flex items-center border rounded px-2 py-1 m-2">
                                                <FaSearch className="absolute ml-1 text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search Location"
                                                    value={searchTermLocation}
                                                    autoComplete="off"
                                                    onChange={(e) => setSearchTermLocation(e.target.value)}
                                                    className="pl-8 focus:border-black focus:outline-none w-full"
                                                />
                                            </div>
                                        </div>
                                        {(() => {
                                            const filteredLocations = locations.filter(location =>
                                                location.LocationName && location.LocationName.toLowerCase().includes(searchTermLocation.toLowerCase())
                                            );

                                            return filteredLocations.length > 0 ? (
                                                filteredLocations.map((location) => (
                                                    <div
                                                        key={location._id}
                                                        onClick={() => handleLocationSelect(location)}
                                                        className="cursor-pointer hover:bg-gray-200 p-2"
                                                    >
                                                        {location.LocationName}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-2 text-gray-500">No locations found</div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Introduction */}
                        <div className="w-full flex gap-5">
                            <label htmlFor="Introduction" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                                Introduction <span className="text-red-500">*</span>
                            </label>
                            <div className="flex-grow mt-3">
                                <textarea
                                    name="Introduction"
                                    type="text"
                                    rows={2}
                                    id="Introduction"
                                    value={formData2.Introduction}
                                    autoComplete="off"
                                    onChange={handleChange}
                                    className={`border p-2 focus:outline-none mb-3 w-full rounded-md ${errors.introductionError ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                                />
                                {introductionError && <p className="text-red-500 text-sm -mt-4">{introductionError}</p>}
                                <div className="text-sm text-gray-600 text-right">{charCount}/500</div>
                            </div>
                        </div>

                        <div className="flex justify-between mb-5">
                            <button type="button" onClick={() => setStep(step - 1)} className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400">Prev</button>
                            <button
                                onClick={handleNextStep}
                                className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400"
                                type="button"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}


                {step === 2 && (
                    <div className="mx-10 mt-7 grid grid-cols-1 gap-2"> {/* Changed to single column layout */}
                        <div className="text-2xl font-bold mb-5 mt-10 ml-5">
                            Interview Details:
                        </div>
                        <div className="flex gap-4 ml-5">
                            <label htmlFor="technology" className="block text-sm font-medium leading-6 text-gray-900 w-72">
                                Select Your Comfortable Technology <span className="text-red-500">*</span>
                            </label>
                            <div className="flex-grow relative">
                                <div
                                    className={`border-b border-gray-300 focus:border-black focus:outline-none -mt-2 w-96 cursor-pointer flex flex-wrap items-center min-h-10 ${technologyError ? 'border-red-500' : 'border-gray-300'}`}
                                    onClick={togglePopup}
                                >
                                    {selectedCandidates.map((candidate, index) => (
                                        <div key={index} className="bg-slate-200 rounded px-2 m-1 py-1 inline-block mr-2 text-sm">
                                            {candidate.TechnologyMasterName} {/* Ensure you access the correct property */}
                                            <button type="button" onClick={() => handleRemoveCandidate(index)} className="ml-2 bg-gray-300 rounded px-2">x</button>
                                        </div>
                                    ))}
                                    {selectedCandidates.length > 0 && (
                                        <button type="button" onClick={clearRemoveCandidate} className="bg-slate-300 rounded px-2 absolute top-0 text-sm" style={{ marginLeft: "360px" }}>X</button>
                                    )}
                                </div>

                                {showPopup && (
                                    <div ref={popupRef} className="absolute bg-white border border-gray-300 w-96 mt-1 max-h-60 overflow-y-auto z-10">
                                        <div className="border-b">
                                            <div className="flex items-center border rounded px-2 py-1 m-2">
                                                <FaSearch className="absolute ml-1 text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search Technology"
                                                    value={searchTermTechnology}
                                                    onChange={(e) => setSearchTermTechnology(e.target.value)}
                                                    className="pl-8 focus:border-black focus:outline-none w-full"
                                                />
                                            </div>
                                        </div>
                                        {services.filter(service =>
                                            service.TechnologyMasterName.toLowerCase().includes(searchTermTechnology.toLowerCase())
                                        ).length > 0 ? (
                                            services.filter(service =>
                                                service.TechnologyMasterName.toLowerCase().includes(searchTermTechnology.toLowerCase())
                                            ).map((service) => (
                                                <div
                                                    key={service._id} // Ensure this is unique
                                                    onClick={() => handleSelectCandidate(service)} // Ensure you have a function to handle selection
                                                    className="cursor-pointer hover:bg-gray-200 p-2"
                                                >
                                                    {service.TechnologyMasterName}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-gray-500">No technologies found</div>
                                        )}
                                    </div>
                                )}
                                {technologyError && <p className="text-red-500 text-sm mt-2">{technologyError}</p>}
                            </div>
                        </div>


                        {/* skills */}
                        <div className="flex gap-4 mt-7 ml-5">
                            <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900 w-72">
                                Select Skills <span className="text-red-500">*</span>
                            </label>
                            <div className="flex-grow relative">
                                <div
                                    className={`border-b border-gray-300 focus:border-black focus:outline-none -mt-2 w-96 cursor-pointer flex flex-wrap items-center min-h-10 ${skillError ? 'border-red-500' : 'border-gray-300'}`}
                                    onClick={toggleSkillsPopup}
                                >

                                    {selectedSkills.map((skill, index) => (
                                        <div key={index} className="bg-slate-200 rounded px-2 py-1 m-1 inline-block mr-2 text-sm">
                                            {skill.SkillName} {/* Access the correct property */}
                                            <button type="button" onClick={() => handleRemoveSkill(index)} className="ml-2 bg-gray-300 rounded px-2">x</button>
                                        </div>
                                    ))}
                                    {selectedSkills.length > 0 && (
                                        <button type="button" onClick={clearSkills} className="bg-slate-300 rounded px-2 absolute top-0 text-sm" style={{ marginLeft: "360px" }}>X</button>
                                    )}
                                </div>


                                {showSkillsPopup && (
                                    <div ref={skillsPopupRef} className="absolute bg-white border border-gray-300 w-96 mt-1 max-h-60 overflow-y-auto z-10">
                                        <div className="border-b">
                                            <div className="flex items-center border rounded px-2 py-1 m-2">
                                                <FaSearch className="absolute ml-1 text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search Skills"
                                                    value={searchTermSkills}
                                                    onChange={(e) => setSearchTermSkills(e.target.value)}
                                                    className="pl-8  focus:border-black focus:outline-none w-full"
                                                />
                                            </div>
                                        </div>
                                        {skills.filter(skill =>
                                            skill.SkillName.toLowerCase().includes(searchTermSkills.toLowerCase())
                                        ).length > 0 ? (
                                            skills.filter(skill =>
                                                skill.SkillName.toLowerCase().includes(searchTermSkills.toLowerCase())
                                            ).map((skill) => (
                                                <div
                                                    key={skill._id} // Ensure this is unique
                                                    onClick={() => handleSelectSkill(skill)} // Ensure you have a function to handle selection
                                                    className="cursor-pointer hover:bg-gray-200 p-2"
                                                >
                                                    {skill.SkillName}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-gray-500">No skills found</div>
                                        )}
                                    </div>
                                )}
                                {skillError && <p className="text-red-500 text-sm mt-2">{skillError}</p>}
                            </div>
                        </div>

                        {/* previous experience */}
                        <div className="text-gray-900 text-sm p-4 rounded-lg">
                            <p>Do you have any previous experience conducting interviews? <span className="text-red-500">*</span></p>
                            <div className="mt-3">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio text-gray-600"
                                        name="previousExperience"
                                        value="yes"
                                        checked={previousExperience === 'yes'}
                                        onChange={handleRadioChange}
                                    />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-4">
                                    <input
                                        type="radio"
                                        className="form-radio text-gray-600"
                                        name="previousExperience"
                                        value="no"
                                        checked={previousExperience === 'no'}
                                        onChange={handleRadioChange}
                                    />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                        </div>
                        {previousExperienceError && <p className="text-red-500 text-sm ml-5">{previousExperienceError}</p>}
                        {/* Conditional rendering for years of experience */}
                        {previousExperience === 'yes' && (
                            <div className="ml-4 flex items-center mb-6">
                                <label htmlFor="experienceYears" className="block text-sm text-gray-900 mr-6 ">
                                    How many years of experience do you have in conducting interviews? <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="experienceYears"
                                    name="experienceYears"
                                    min="1" max="15"
                                    value={experienceYears}
                                    onChange={handleChangeExperienceYears}
                                    className="border-b focus:border-black focus:outline-none w-60"
                                />
                            </div>
                        )}

                        {/* Level of Expertise */}
                        <div className="text-gray-900 text-sm p-4 rounded-lg -mt-5">
                            <p>Choose your level of expertise (comfort) in conducting interviews <span className="text-red-500">*</span></p>
                            <div className="mt-3 flex">
                                <label className="inline-flex items-center mr-10">
                                    <input
                                        type="radio"
                                        className="form-radio text-gray-600"
                                        name="expertiseLevel"
                                        value="junior"
                                        checked={expertiseLevel === 'junior'}
                                        onChange={handleRadioChange2}
                                    />
                                    <span className="ml-2">Junior (0-3 years)</span>
                                </label>
                                <label className="inline-flex items-center mr-10">
                                    <input
                                        type="radio"
                                        className="form-radio text-gray-600"
                                        name="expertiseLevel"
                                        value="mid-level"
                                        checked={expertiseLevel === 'mid-level'}
                                        onChange={handleRadioChange2}
                                    />
                                    <span className="ml-2">Mid-level (2-5 years)</span>
                                </label>
                                <label className="inline-flex items-center mr-10">
                                    <input
                                        type="radio"
                                        className="form-radio text-gray-600"
                                        name="expertiseLevel"
                                        value="senior"
                                        checked={expertiseLevel === 'senior'}
                                        onChange={handleRadioChange2}
                                    />
                                    <span className="ml-2">Senior (5-8 years)</span>
                                </label>
                                <label className="inline-flex items-center mr-10">
                                    <input
                                        type="radio"
                                        className="form-radio text-gray-600"
                                        name="expertiseLevel"
                                        value="lead"
                                        checked={expertiseLevel === 'lead'}
                                        onChange={handleRadioChange2}
                                    />
                                    <span className="ml-2">Lead (8+ years)</span>
                                </label>
                            </div>
                        </div>
                        {expertiseLevelError && <p className="text-red-500 text-sm ml-5">{expertiseLevelError}</p>}

                        <div className="flex justify-between ml-5 mb-5 mt-7">
                            <button type="button" onClick={() => setStep(step - 1)} className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400">Prev</button>
                            <button
                                onClick={handleNextStep}
                                className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400"
                                type="button"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <>
                        <div className="mx-10 mt-7 grid grid-cols-2 gap-8">
                            <div className="text-sm flex">
                                <div>
                                    <div className="text-xl">
                                        <h2>
                                            Availability &nbsp;{" "}
                                            <span className="text-red-500 -ml-3">*</span>
                                        </h2>
                                        {timesError && <p className="text-red-500 text-sm mt-2">{timesError}</p>}
                                    </div>
                                    {Object.keys(times).map((day) => (
                                        <div key={day}>
                                            <div className="flex justify-center space-y-8">
                                                <span className="w-24 mr-10 mt-7">{day}</span>
                                                <div>
                                                    {times[day].map((timeSlot, index) => (
                                                        <div key={index} className={`flex items-center -mt-2 justify-center ${index > 0 ? 'mt-5' : ''}`}>
                                                            {timeSlot.startTime === "unavailable" ? (
                                                                <span className="p-2 bg-slate-200 text-center w-32 mr-0" style={{ width: "287px" }}>Unavailable</span>
                                                            ) : (
                                                                <>
                                                                    {/* start time */}
                                                                    <div className="w-28 mr-5">
                                                                        <div className="border-2 border-black">
                                                                            <div className="flex justify-center">
                                                                                <div className="text-center">
                                                                                    <DatePicker
                                                                                        selected={timeSlot.startTime}
                                                                                        onChange={(date) => {
                                                                                            const newTimes = [...times[day]];
                                                                                            newTimes[index].startTime = date;
                                                                                            setTimes(prevTimes => ({
                                                                                                ...prevTimes,
                                                                                                [day]: newTimes
                                                                                            }));
                                                                                            if (date && newTimes[index].endTime) {
                                                                                                setTimesError('');
                                                                                            }
                                                                                        }}
                                                                                        showTimeSelect
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={15}
                                                                                        dateFormat="h:mm aa"
                                                                                        placeholderText="Start Time"
                                                                                        className="p-2 w-full"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* minus */}
                                                                    <div className='mr-5'>
                                                                        <span>
                                                                            <FaMinus className='text-2xl' />
                                                                        </span>
                                                                    </div>
                                                                    {/* end time */}
                                                                    <div className="max-w-sm w-28">
                                                                        <div className="border-2 border-black">
                                                                            <div className="flex justify-center">
                                                                                <div className="text-center">
                                                                                    <DatePicker
                                                                                        selected={timeSlot.endTime}
                                                                                        onChange={(date) => {
                                                                                            const newTimes = [...times[day]];
                                                                                            newTimes[index].endTime = date;
                                                                                            setTimes(prevTimes => ({
                                                                                                ...prevTimes,
                                                                                                [day]: newTimes
                                                                                            }));
                                                                                            if (newTimes[index].startTime && date) {
                                                                                                setTimesError('');
                                                                                            }
                                                                                        }}
                                                                                        showTimeSelect
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={15}
                                                                                        dateFormat="h:mm aa"
                                                                                        placeholderText="End Time"
                                                                                        className="w-full p-2"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {/* cancel */}
                                                            <div className='ml-12' style={{ width: '24px', height: '24px' }}>
                                                                {(timeSlot.startTime && timeSlot.endTime && timeSlot.startTime !== "unavailable") ? (
                                                                    <GiCancel
                                                                        className='text-2xl cursor-pointer'
                                                                        onClick={() => handleRemoveTimeSlot(day, index)}
                                                                    />
                                                                ) : (
                                                                    <div style={{ width: '24px', height: '24px' }}></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* plus */}
                                                <div>
                                                    <FaPlus className='text-2xl cursor-pointer mx-5' onClick={() => handleAddTimeSlot(day)} />
                                                </div>
                                                {/* copy */}
                                                <div className='relative'>
                                                    <IoIosCopy className='text-2xl cursor-pointer' onClick={(e) => handleCopy(e, day)} />
                                                    {showPopup1 && selectedDay === day && (
                                                        <div
                                                            className="absolute bg-white p-4 rounded-lg w-72 shadow-md border"
                                                            style={{ top: '100%', transform: 'translate(-90%, 10px)', zIndex: 1000 }}
                                                        >
                                                            <div className='flex justify-between'>
                                                                <h2 className="text-lg font-semibold mb-2 mr-2">Duplicate Time Entries</h2>
                                                                <GiCancel
                                                                    className="text-2xl cursor-pointer"
                                                                    onClick={() => setShowPopup1(false)}
                                                                />
                                                            </div>
                                                            <div>
                                                                {Object.keys(times).map(dayOption => (
                                                                    <label key={dayOption} className="block">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={dayOption}
                                                                            checked={selectedDays.includes(dayOption)}
                                                                            disabled={dayOption === selectedDay}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                setSelectedDays(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
                                                                            }}
                                                                            className="mr-2"
                                                                        />
                                                                        {dayOption}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                            <button type="button" onClick={handlePaste} className="mt-4 bg-blue-500 text-white py-1 px-4 rounded">
                                                                Duplicate
                                                            </button>
                                                            <button type="button" onClick={() => setShowPopup1(false)} className="mt-4 ml-2 bg-gray-500 text-white py-1 px-4 rounded">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {timesError && <p className="text-red-500 text-sm ml-5">{timesError}</p>}
                                </div>
                            </div>
                            <div className="mt-10">
                                {/* Time Zone */}
                                <div className="flex mb-7 mt-4 overflow-visible">
                <div>
                    <label
                        htmlFor="TimeZone"
                        className="block text-sm font-medium leading-6 text-gray-900 w-20"
                    >
                        Time Zone <span className="text-red-500">*</span>
                    </label>
                </div>
                <div className="flex-grow w-full overflow-visible -mt-1">
                    <div className="w-full overflow-visible">
                        <TimezoneSelect
                            value={selectedTimezone}
                            onChange={handleTimezoneChange}
                            className="TimezonePicker ml-5"
                        />
                        {timeZoneError && <p className="text-red-500 text-sm ml-5 mt-2">{timeZoneError}</p>}
                    </div>
                </div>
            </div>

                                {/* preferred interview */}
                                <div>
                                    <div className="bg-gray-50 border border-gray-500 text-gray-900 text-sm p-4 rounded-lg">
                                        <p className="font-medium">Preferred Interview Duration <span className="text-red-500">*</span></p>
                                        <ul className="flex mt-3 text-xs font-medium">
                                            <li
                                                className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "30"
                                                    ? "bg-gray-700 text-white"
                                                    : "bg-gray-300"
                                                    }`}
                                                onClick={() => handleOptionClick("30")}
                                            >
                                                30 mints
                                            </li>
                                            <li
                                                className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "60"
                                                    ? "bg-gray-700 text-white"
                                                    : "bg-gray-300"
                                                    }`}
                                                onClick={() => handleOptionClick("60")}
                                            >
                                                1 Hour
                                            </li>
                                            <li
                                                className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "90"
                                                    ? "bg-gray-700 text-white"
                                                    : "bg-gray-300"
                                                    }`}
                                                onClick={() => handleOptionClick("90")}
                                            >
                                                1:30 mints
                                            </li>
                                            <li
                                                className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "120"
                                                    ? "bg-gray-700 text-white"
                                                    : "bg-gray-300"
                                                    }`}
                                                onClick={() => handleOptionClick("120")}
                                            >
                                                2 Hour
                                            </li>
                                        </ul>
                                    </div>
                                    {preferredDurationError && <p className="text-red-500 text-sm mt-2">{preferredDurationError}</p>}
                                </div>
                            </div>

                        </div>
                        <div className="flex justify-between ml-5 my-7">
                            <button type="button" onClick={() => setStep(step - 1)} className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400">Prev</button>
                            <button
                                type="submit"
                                onClick={navigateToHome}
                                className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400"
                            >
                                Save
                            </button>
                        </div>
                    </>
                )}
            </form>
        </>
    );
};

export default MultiStepForm;