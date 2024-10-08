import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { MdOutlineCancel, MdArrowDropDown } from "react-icons/md";
import { IoIosAddCircle } from 'react-icons/io';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { FaTimes } from "react-icons/fa";
import AddCandidateForm from "../Candidate-Tab/CreateCandidate";
import AddteamForm from "../Team-Tab/CreateTeams";
import OutsourceOption from './OutsourceOption';
const Schedulelater = ({ onClose }) => {
    const navigate = useNavigate();
    const candidateRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [candidateData, setCandidateData] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedPositionId, setSelectedPositionId] = useState('');
    const [errors, setErrors] = useState({});
    const [positionData, setPositionData] = useState(null);
    const [rounds, setRounds] = useState([
        { round: '', mode: '', dateTime: getCurrentDateTime() },
        { round: '', mode: '', dateTime: getCurrentDateTime() }
    ]);

    const [unsavedChanges, setUnsavedChanges] = useState(false); // Track unsaved changes
    const [showCloseConfirmation, setShowCloseConfirmation] = useState(false); // Show confirmation popup

    const [showOutsourcePopup, setShowOutsourcePopup] = useState(false);

    function getCurrentDateTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
    }
    const userId = localStorage.getItem("userId");
    console.log(userId)

    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/candidate?createdBy=${userId}`);
                if (Array.isArray(response.data)) {
                    const candidatesWithImages = response.data.map((candidate) => {
                        if (candidate.ImageData && candidate.ImageData.filename) {
                            const imageUrl = `${process.env.REACT_APP_API_URL}/${candidate.ImageData.path.replace(/\\/g, '/')}`;
                            return { ...candidate, imageUrl };
                        }
                        return candidate;
                    });
                    setCandidateData(candidatesWithImages);
                } else {
                    console.error('Expected an array but got:', response.data);
                }
            } catch (error) {
                console.error('Error fetching candidate data:', error);
            }
        };

        fetchCandidateData();
    }, []);

    useEffect(() => {
        if (selectedPositionId) {
            const fetchPositionData = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/position/${selectedPositionId}`
                    );
                    setPositionData(response.data);
                    setRounds(response.data.rounds.map(round => ({
                        ...round,
                        dateTime: getCurrentDateTime()
                    })));
                    setSelectedDuration(response.data.rounds.map(round => round.duration || ""));
                } catch (error) {
                    console.error("Error fetching detailed position data:", error);
                }
            };

            fetchPositionData();
        }
    }, [selectedPositionId]);

    const [userLastName, setUserLastName] = useState(''); // State to store user's LastName
    const sub = localStorage.getItem("sub");
    console.log(sub)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${sub}`);
                if (response.data) {
                    setUserLastName(response.data.Name); // Assuming response contains LastName
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const [roundsError, setRoundsError] = useState('');

    const [selectedCandidateImage, setSelectedCandidateImage] = useState('');
    const handleSave = async () => {
        const newErrors = {};
        if (!selectedCandidate) {
            newErrors.Candidate = "Candidate is required";
        }

        // Check if at least one round is fully filled and not marked as "Taken Externally"
        const isAnyRoundFilled = rounds.some(isRoundFullyFilled);

        if (!isAnyRoundFilled) {
            setRoundsError("Please fill at least one round to schedule.");
        } else {
            setRoundsError('');
        }

        if (Object.keys(newErrors).length > 0 || !isAnyRoundFilled) {
            setErrors(newErrors);
            return;
        }

        try {
            const interviewData = {
                Candidate: selectedCandidate,
                Position: selectedPosition,
                Status: "Scheduled",
                ScheduleType: 'instantinterview',
                Interviewstype: window.location.pathname,
                rounds: rounds.map(round => ({
                    round: round.round,
                    mode: round.mode,
                    dateTime: round.dateTime,
                    duration: round.duration,
                    interviewers: (round.interviewers || []).map(member => member.name),
                    instructions: round.instructions,
                    status: round.status || 'Scheduled'
                })),
                candidateImageUrl: selectedCandidateImage,
                CreatedBy: userId
            };
            console.log(interviewData);
            await axios.post(`${process.env.REACT_APP_API_URL}/interview`, interviewData);
            onClose();
        } catch (error) {
            console.error('Error saving interview data:', error);
        }
        navigate('/videocallbutton');
    };

    const [showMainContent, setShowMainContent] = useState(true);
    const [showNewteamContent, setShowNewteamContent] = useState(false);
    const [showNewCandidateContent, setShowNewCandidateContent] = useState(false);

    const handleAddNewCandidateClick = () => {
        setShowMainContent(false);
        setShowNewCandidateContent(true);
    };

    const [teamData, setTeamData] = useState([]);
    useEffect(() => {
        const fetchTeamsData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/team?CreatedBy=${userId}`);
                if (Array.isArray(response.data)) {
                    const teamsWithImages = response.data.map((team) => {
                        if (team.ImageData && team.ImageData.filename) {
                            const imageUrl = `${process.env.REACT_APP_API_URL}/${team.ImageData.path.replace(/\\/g, '/')}`;
                            return { ...team, imageUrl };
                        }
                        return team;
                    });
                    setTeamData(teamsWithImages);
                } else {
                    console.error('Expected an array but got:', response.data);
                }
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };
        fetchTeamsData();
    }, []);

    const newteammember = () => {
        setShowMainContent(false);
        setShowNewteamContent(true);
    };

    const handleClose = () => {
        if (unsavedChanges) {
            setShowCloseConfirmation(true); // Show confirmation popup
        } else {
            onClose();
        }
    };

    const confirmClose = () => {
        setShowCloseConfirmation(false);
        onClose();
    };

    const cancelClose = () => {
        setShowCloseConfirmation(false);
    };

    const [description, setdescription] = useState("");
    const [formData, setFormData] = useState({
        instructions: "",
    });

    const handleChangedescription = (event, index) => {
        const value = event.target.value;
        if (value.length <= 1000) {
            const newRounds = [...rounds];
            newRounds[index].instructions = value;
            setRounds(newRounds);

            event.target.style.height = "auto";
            event.target.style.height = event.target.scrollHeight + "px";
            setUnsavedChanges(true);
        }
    };

    const [showTeamMemberDropdown, setShowTeamMemberDropdown] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isTeamMemberSelected, setIsTeamMemberSelected] = useState(false);
    const [showDropdowninterview, setShowDropdowninterview] = useState(null);
    const toggleDropdowninterview = (index) => {
        const currentPage = window.location.pathname;

        if (currentPage === "/internalinterview") {
            setShowDropdowninterview(prevIndex => prevIndex === index ? null : index);
        } else if (currentPage === "/outsourceinterview") {
            setShowConfirmation(true);
        }
    };

    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

    const removeSelectedTeamMember = (memberToRemove, roundIndex) => {
        const newRounds = [...rounds];
        newRounds[roundIndex].interviewers = newRounds[roundIndex].interviewers.filter((member) => member.id !== memberToRemove.id);
        setRounds(newRounds);
        setErrors((prevErrors) => ({ ...prevErrors, Interviewer: "" }));
    };

    const clearSelectedTeamMembers = (roundIndex) => {
        const newRounds = [...rounds];
        newRounds[roundIndex].interviewers = [];
        setRounds(newRounds);
        setErrors((prevErrors) => ({ ...prevErrors, Interviewer: "" }));
    };

    const interviews = ["My Self", "Team Member", "Outsource Interviewer"];

    const handleinterviewSelect = (interview, roundIndex) => {
        if (!selectedCandidate) return;

        const newRounds = [...rounds];
        if (!newRounds[roundIndex].interviewers) {
            newRounds[roundIndex].interviewers = [];
        }

        if (interview === "My Self") {
            if (!newRounds[roundIndex].interviewers.some((member) => member.id === userId)) {
                newRounds[roundIndex].interviewers.push({ id: userId, name: userLastName });
            }
            setShowDropdowninterview(null);
            setIsTeamMemberSelected(false);
            setShowTeamMemberDropdown(false);
        } else if (interview === "Team Member") {
            setIsTeamMemberSelected(true);
            setShowDropdowninterview(null);
        } else if (interview === "Outsource Interviewer") {
            setShowDropdowninterview(false);
            setShowConfirmation(true);
        }

        setRounds(newRounds);
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[`Interviewer_${roundIndex}`]; // Remove the error for the specific round
            return newErrors;
        });

        const isAnyRoundFilled = newRounds.some(isRoundFullyFilled);
        if (isAnyRoundFilled) {
            setRoundsError(''); // Hide the error message
        }
    };

    const toggleDropdownTeamMember = () => {
        setShowTeamMemberDropdown(!showTeamMemberDropdown);
    };

    const handleTeamMemberSelect = (teamMember, roundIndex) => {
        const newRounds = [...rounds];
        if (!newRounds[roundIndex].interviewers) {
            newRounds[roundIndex].interviewers = [];
        }
        if (!newRounds[roundIndex].interviewers.some((member) => member.id === teamMember._id)) {
            newRounds[roundIndex].interviewers.push({ id: teamMember._id, name: teamMember.LastName });
        }
        setRounds(newRounds);
        setShowTeamMemberDropdown(false);
        setIsTeamMemberSelected(false);
        setErrors((prevErrors) => ({ ...prevErrors, Interviewer: "" }));
    };

    const [showPopup, setShowPopup] = useState(false);

    const handleAddInterviewClick = () => {
        setShowPopup(true);
        setShowConfirmation(false);
        setShowOutsourcePopup(true);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    const [selectedDuration, setSelectedDuration] = useState(rounds.map(round => round.duration || ''));
    const [showDropdownduration, setshowDropdownduration] = useState(null);
    const durationOptions = ["30 minutes", "1 hour", "1 : 30 minutes", "2 hours"];

    const toggleDropdownduration = (index) => {
        setshowDropdownduration(prevIndex => prevIndex === index ? null : index);
    };

    const handleDurationSelect = (index, duration) => {
        const newDurations = [...selectedDuration];
        newDurations[index] = duration;
        setSelectedDuration(newDurations);

        const newRounds = [...rounds];
        newRounds[index].duration = duration;
        setRounds(newRounds);
        setshowDropdownduration(false);
    };

    const handleRoundChange = (index, field, value) => {
        const newRounds = [...rounds];
        newRounds[index][field] = value;
        setRounds(newRounds);

        // Check if at least one round is fully filled
        const isAnyRoundFilled = newRounds.some(isRoundFullyFilled);
        if (isAnyRoundFilled) {
            setRoundsError('');
        }
        setUnsavedChanges(true);
    };

    // interviewmode code
    const interviewModeOptions = ["Face to Face", "Virtual"];

    const [showDropdownInterviewMode, setShowDropdownInterviewMode] = useState(null);

    const toggleDropdownInterviewMode = (index) => {
        setShowDropdownInterviewMode(prevIndex => prevIndex === index ? null : index);
    };

    const handleInterviewModeSelect = (index, mode) => {
        const newRounds = [...rounds];
        newRounds[index].mode = mode;
        setRounds(newRounds);
        setShowDropdownInterviewMode(null);
    };

    const isRoundFullyFilled = (round) => {
        const currentPage = window.location.pathname;
        if (currentPage === "/outsourceinterview") {
            return (
                round.round &&
                round.mode &&
                round.dateTime &&
                round.duration
            );
        }
        return (
            round.round &&
            round.mode &&
            round.dateTime &&
            round.duration &&
            round.interviewers &&
            round.interviewers.length > 0
        );
    };

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [roundToDelete, setRoundToDelete] = useState(null);

    const handleDeleteRound = (index) => {
        setRoundToDelete(index);
        setShowDeletePopup(true);
    };

    const confirmDeleteRound = () => {
        const newRounds = rounds.filter((_, i) => i !== roundToDelete);
        setRounds(newRounds);
        setShowDeletePopup(false);
        setRoundToDelete(null);
    };

    const cancelDeleteRound = () => {
        setShowDeletePopup(false);
        setRoundToDelete(null);
    };

    // adding new round
    const [showAddRoundPopup, setShowAddRoundPopup] = useState(false);
    const [roundPosition, setRoundPosition] = useState({ index: null, position: 'after' });

    const handleAddRoundClick = () => {
        setShowAddRoundPopup(true);
    };

    const handleAddRound = () => {
        const newRound = { round: '', mode: '', instructions: '', dateTime: getCurrentDateTime() };
        const newRounds = [...rounds];

        if (roundPosition.position === 'after') {
            newRounds.splice(roundPosition.index + 1, 0, newRound);
        } else {
            newRounds.splice(roundPosition.index, 0, newRound);
        }

        setRounds(newRounds);
        setShowAddRoundPopup(false);

        const newDurations = [...selectedDuration];
        if (roundPosition.position === 'after') {
            newDurations.splice(roundPosition.index + 1, 0, '');
        } else {
            newDurations.splice(roundPosition.index, 0, '');
        }
        setSelectedDuration(newDurations);

        // Check if at least one round is fully filled
        const isAnyRoundFilled = newRounds.some(isRoundFullyFilled);
        if (isAnyRoundFilled) {
            setRoundsError('');
        }
    };

    const [selectedRound, setSelectedRound] = useState("");
    const [customRoundName, setCustomRoundName] = useState("");
    const [selectedMode, setSelectedMode] = useState("");

    const handleRoundTitleChange = (index, title) => {
        const newRounds = [...rounds];
        newRounds[index].round = title;

        // Automatically set the interview mode to "Virtual" if the round title is "Assessment"
        if (title === "Assessment") {
            newRounds[index].mode = "Virtual";
        }

        setRounds(newRounds);
    };

    const [showRoundDropdown, setShowRoundDropdown] = useState(null); // State for round title dropdown

    const handleRoundSelect = (index, roundValue) => {
        setSelectedRound(roundValue);
        if (roundValue === "Other") {
            setCustomRoundName("");
        } else {
            handleRoundTitleChange(index, roundValue);
        }
        setShowRoundDropdown(null);
    };

    const handleClickOutside = (event) => {
        if (showRoundDropdown !== null && !event.target.closest('.round-dropdown')) {
            setShowRoundDropdown(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRoundDropdown]);

    const [searchTerm, setSearchTerm] = useState(''); // Add this state

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowDropdown(true);

        if (value === '') {
            setSelectedCandidate('');
            setSelectedPosition('');
            setSelectedPositionId('');
            setRounds([
                { round: '', mode: '', instructions: '' },
                { round: '', mode: '', instructions: '' }
            ]);
        }
        setUnsavedChanges(true);
    };

    const handleInputClick = () => {
        setShowDropdown(true); // Show dropdown when input is clicked
    };

    const handleCandidateSelect = (candidate) => {
        setSelectedCandidate(candidate.LastName);
        setSelectedPosition(candidate.Position);
        setSelectedCandidateImage(candidate.imageUrl);
        setSelectedPositionId(candidate.PositionId);
        setSearchTerm(candidate.LastName); // Update searchTerm with selected candidate's name
        setShowDropdown(false); // Close the dropdown
        setErrors((prevErrors) => ({ ...prevErrors, Candidate: "" }));
    };
    
    return (
        <>
            {showMainContent ? (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div
                            className="bg-white shadow-lg overflow-hidden"
                            style={{ width: "90%", height: "90%" }}
                        >
                            {/* Header - Fixed */}
                            <div className="border-b p-2">
                                <div className="mx-8 my-1 flex justify-between items-center">
                                    <p className="text-2xl">
                                        <span className="text-black font-semibold cursor-pointer">
                                            Schedule an Interview
                                        </span>
                                    </p>
                                    <button className="shadow-lg rounded-full" onClick={handleClose}>
                                        <MdOutlineCancel className="text-2xl" />
                                    </button>
                                </div>
                            </div>

                            {/* Middle Content - Scrollable */}
                            <div
                                className="overflow-y-auto"
                                style={{ height: "calc(100% - 112px)" }}
                            >
                                <div className="flex gap-5 mt-8 mb-8" style={{ padding: "0px 82px" }}>

                                    {/* candidate */}
                                    <div className="flex items-center w-full relative" ref={candidateRef}>
                                        <label
                                            htmlFor="Candidate"
                                            className="block font-medium text-gray-900 dark:text-black"
                                            style={{ width: "120px" }}
                                        >
                                            Candidate <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative flex-grow">
                                            <input
                                                type="text"
                                                className={`border-b focus:outline-none w-full ${errors.Candidate ? "border-red-500" : "border-gray-300"}`}
                                                value={searchTerm}
                                                onChange={handleInputChange}
                                                onClick={handleInputClick}
                                                autoComplete="off"
                                            />

                                            <MdArrowDropDown
                                                onClick={() => setShowDropdown(!showDropdown)}
                                                className="absolute top-0 text-gray-500 text-lg mt-1 mr-2 cursor-pointer right-0"
                                            />

                                            {/* Dropdown */}
                                            {showDropdown && (
                                                <div className="absolute z-50 border border-gray-200 mb-5 w-full rounded-md bg-white shadow">
                                                    <p className="p-1 font-medium border-b"> Recent Candidates</p>
                                                    <ul>
                                                        {candidateData
                                                            .filter(candidate => candidate.LastName.toLowerCase().includes(searchTerm.toLowerCase())) // Filter candidates
                                                            .slice(0, 4)
                                                            .map((candidate) => (
                                                                <li
                                                                    key={candidate.id}
                                                                    className="bg-white border-b cursor-pointer p-2 hover:bg-gray-100"
                                                                    onClick={() => {
                                                                        handleCandidateSelect(candidate);
                                                                        setUnsavedChanges(true); // Mark as unsaved changes
                                                                    }}
                                                                >
                                                                    {candidate.LastName}
                                                                </li>
                                                            ))}
                                                        <li
                                                            className="flex cursor-pointer shadow-md border-b p-1 rounded"
                                                            onClick={handleAddNewCandidateClick}
                                                        >
                                                            <IoIosAddCircle className="text-2xl" />
                                                            <span>Add New Candidate</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        {errors.Candidate && <p className="text-red-500 text-sm absolute -bottom-6 ml-32">{errors.Candidate}</p>}
                                    </div>
                                    {/* position */}
                                    <div
                                        className="flex items-center w-full"
                                    >
                                        <label className="block font-medium text-gray-900 dark:text-black" style={{ width: "100px" }}>
                                            Position <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="border-b focus:outline-none w-full bg-white"
                                            value={selectedPosition}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2 mx-20">
                                    {roundsError && <p className="text-red-500 text-sm">{roundsError}</p>}
                                    <div className="flex-grow"></div>
                                    <button
                                        className={`bg-blue-500 text-white font-bold py-1 px-2 text-sm rounded hover:bg-blue-600 ${!selectedCandidate ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handleAddRoundClick}
                                        disabled={!selectedCandidate}
                                    >
                                        Add Round
                                    </button>
                                </div>

                                {rounds.map((round, index) => {

                                    return (
                                        <div
                                            key={index}
                                            className="border my-4 p-4 rounded-lg shadow-md mx-auto text-sm"
                                            style={{
                                                maxWidth: "89%",
                                                opacity: !selectedCandidate ? 0.5 : 1,
                                            }}
                                        >

                                            <div className='flex justify-between items-center'>

                                                <p className="text-xl font-semibold underline mb-4">

                                                    Round {index + 1} {round.round && `/ ${round.round}`}
                                                </p>
                                                {rounds.length > 1 && (
                                                    <div className='space-x-3 -mt-2'>
                                                        <button
                                                            type='button'

                                                            className={`bg-gray-400 text-white font-bold py-1 px-2 text-sm rounded ${round.status === 'Completed' ? 'opacity-50 cursor-not-allowed' : ''}`}

                                                            disabled={round.status === 'Completed'}

                                                        >
                                                            {round.status === 'Completed' ? 'Completed' : 'Draft'}
                                                        </button>
                                                        <button
                                                            type='button'
                                                            className="bg-red-500 text-white font-bold py-1 px-2 text-sm rounded hover:bg-red-600"
                                                            onClick={selectedCandidate ? () => handleDeleteRound(index) : null}
                                                        >
                                                            Remove
                                                        </button>

                                                    </div>
                                                )}
                                            </div>


                                            <div className="flex w-full mb-4 gap-5">
                                                <div className="flex items-center w-1/2 pr-2">
                                                    <label className="block text-gray-700 mb-2 flex-shrink-0 w-32">
                                                        Round Title <span className="text-red-500">*</span>
                                                    </label>
                                                    {selectedRound === "Other" ? (
                                                        <input
                                                            type="text"
                                                            disabled={!selectedCandidate}
                                                            className="flex-grow px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                                            value={customRoundName}
                                                            onChange={(e) => setCustomRoundName(e.target.value)}
                                                            placeholder="Enter round name"
                                                        />
                                                    ) : (
                                                        <div className="relative flex-grow round-dropdown">
                                                            <div
                                                                className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                                                                onClick={() => selectedCandidate && setShowRoundDropdown(index)}
                                                                disabled={!selectedCandidate}
                                                            >
                                                                {round.round || <span>&nbsp;</span>}
                                                            </div>
                                                            <MdArrowDropDown
                                                                className="absolute top-0 right-0 text-lg mt-4 text-gray-500 cursor-pointer"
                                                                onClick={() => selectedCandidate && setShowRoundDropdown(index)}
                                                                disabled={!selectedCandidate}
                                                            />
                                                            {showRoundDropdown === index && (
                                                                <div className="absolute z-50 border border-gray-200 mb-5 w-full rounded-md bg-white shadow-lg">
                                                                    <div
                                                                        className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                        onClick={() => handleRoundSelect(index, "Assessment")}
                                                                    >
                                                                        Assessment
                                                                    </div>
                                                                    <div
                                                                        className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                        onClick={() => handleRoundSelect(index, "Technical")}
                                                                    >
                                                                        Technical
                                                                    </div>
                                                                    <div
                                                                        className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                        onClick={() => handleRoundSelect(index, "Final")}
                                                                    >
                                                                        Final
                                                                    </div>
                                                                    <div
                                                                        className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                        onClick={() => handleRoundSelect(index, "HR Interview")}
                                                                    >
                                                                        HR Interview
                                                                    </div>
                                                                    <div
                                                                        className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                        onClick={() => handleRoundSelect(index, "Other")}
                                                                    >
                                                                        Other
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center w-1/2 pl-2">
                                                    <label className="text-left" style={{ width: "131px" }}>
                                                        Interview Mode <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative flex-grow">
                                                        <input
                                                            type="text"
                                                            value={round.mode}
                                                            disabled={!selectedCandidate || round.round === "Assessment"}
                                                            className="border-b p-2 flex-grow bg-white w-full focus:outline-none"
                                                            onClick={selectedCandidate && round.round !== "Assessment" ? () => toggleDropdownInterviewMode(index) : null}
                                                            readOnly
                                                            onChange={(e) => handleRoundChange(index, 'mode', e.target.value)}
                                                        />
                                                        <MdArrowDropDown
                                                            className="absolute top-0 text-gray-500 text-lg mt-4 cursor-pointer right-0"
                                                            onClick={selectedCandidate && round.round !== "Assessment" ? () => toggleDropdownInterviewMode(index) : null}
                                                            disabled={!selectedCandidate || round.round === "Assessment"}
                                                        />
                                                        {showDropdownInterviewMode === index && (
                                                            <div className="absolute z-50 border border-gray-200 mb-5 w-full rounded-md bg-white shadow-lg">
                                                                {interviewModeOptions.map((mode) => (
                                                                    <div
                                                                        key={mode}
                                                                        className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                        onClick={() => handleInterviewModeSelect(index, mode)}
                                                                    >
                                                                        {mode}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex w-full mb-4 gap-5">
                                                <div className="flex items-center w-1/2 pr-2">
                                                    <label className="w-40 text-left mr-4">
                                                        Date & Time <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={round.dateTime}
                                                        className="border-b p-2 flex-grow w-full focus:outline-none bg-white"
                                                        style={{ borderRadius: "0" }}
                                                        onChange={(e) => {
                                                            const newRounds = [...rounds];
                                                            newRounds[index].dateTime = e.target.value;
                                                            setRounds(newRounds);
                                                        }}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="flex items-center w-1/2 pl-2">
                                                    <label className="text-left" style={{ width: "131px" }}>
                                                        Duration <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative flex-grow">
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                disabled={!selectedCandidate}
                                                                className="border-b p-2 flex-grow bg-white w-full focus:outline-none"
                                                                autoComplete="off"
                                                                value={selectedDuration[index]}
                                                                // onClick={() => toggleDropdownduration(index)}
                                                                onClick={selectedCandidate ? () => toggleDropdownduration(index) : null}
                                                                readOnly
                                                            />
                                                            <div
                                                                className="absolute right-0 top-0"
                                                                onClick={selectedCandidate ? () => toggleDropdownduration(index) : null}
                                                                disabled={!selectedCandidate}
                                                            >
                                                                <MdArrowDropDown className="text-lg text-gray-500 mt-4 cursor-pointer" />
                                                            </div>
                                                        </div>
                                                        {showDropdownduration === index && (
                                                            <div className="absolute z-50 mb-5 border border-gray-200 w-full rounded-md bg-white shadow">
                                                                {durationOptions.map((duration) => (
                                                                    <div
                                                                        key={duration}
                                                                        className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                        onClick={() => handleDurationSelect(index, duration)}
                                                                    >
                                                                        {duration}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* interviewer */}
                                            <div className="flex mb-4">
                                                <label className="text-left mt-1 mr-4" style={{ width: "114px" }}>
                                                    Interviewers <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative flex-grow">
                                                    <div className="relative mb-3">
                                                        <div
                                                            className={`border-b  focus:border-black focus:outline-none min-h-6 mb-5 h-auto w-full relative mt-1 ${errors.Interviewer
                                                                ? "border-red-500"
                                                                : "border-gray-300 focus:border-black"
                                                                }`}
                                                            onClick={selectedCandidate ? () => toggleDropdowninterview(index) : null}
                                                            disabled={!selectedCandidate}
                                                        >
                                                            <div className="flex flex-wrap">
                                                                {round.interviewers && round.interviewers.map((member) => (
                                                                    <div
                                                                        key={member.id}
                                                                        className="bg-slate-200 rounded-lg px-2 py-1 inline-block mr-2 -mt-2"
                                                                    >
                                                                        {member.name}
                                                                        <button
                                                                            onClick={() => removeSelectedTeamMember(member, index)}
                                                                            className="ml-1 bg-slate-300 rounded-lg px-2"
                                                                        >
                                                                            X
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="absolute top-0 right-5">
                                                                {round.interviewers && round.interviewers.length > 0 && (
                                                                    <button
                                                                        onClick={() => clearSelectedTeamMembers(index)}
                                                                        className="bg-slate-300 rounded-lg px-2 -mt-2"
                                                                    >
                                                                        X
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <MdArrowDropDown className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0" onClick={selectedCandidate ? () => toggleDropdowninterview(index) : null} />
                                                    </div>
                                                    {/* {errors[`Interviewer_${index}`] && <p className="text-red-500 text-sm -mt-2 ml-32">{errors[`Interviewer_${index}`]}</p>} */}
                                                    {showDropdowninterview === index && (
                                                        <div className="absolute z-50 border border-gray-200 mb-5 top-7 w-full rounded-md bg-white shadow-lg">
                                                            {interviews.map((interview) => (
                                                                <div
                                                                    key={interview}
                                                                    className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                                    onClick={() => handleinterviewSelect(interview, index)}
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
                                                                    <div className="flex gap-5 mb-5 -mt-4 relative w-full">
                                                                        <div className="relative flex-grow">
                                                                            <div className="relative bg-white border cursor-pointer shadow">
                                                                                <p className="p-1 font-medium">Recent Team Members</p>
                                                                                <div>
                                                                                    {teamData.slice(0, 4).map((team) => (
                                                                                        <div
                                                                                            key={team._id}
                                                                                            className="bg-white border-b cursor-pointer p-1 hover:bg-gray-100"
                                                                                            onClick={() => handleTeamMemberSelect(team, index)} // {{ edit_11 }}: Pass index
                                                                                        >
                                                                                            <div className="text-black flex p-1">
                                                                                                {team.LastName}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <p onClick={newteammember}
                                                                                    className="flex cursor-pointer border-b p-1 rounded"
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

                                            <div className="flex flex-col mb-4">
                                                <label className="text-left mb-2">Instructions</label>
                                                <div className="flex-grow">
                                                    <textarea
                                                        rows={5}
                                                        onChange={(e) => handleChangedescription(e, index)}
                                                        value={round.instructions}
                                                        name="instructions"
                                                        id="instructions"
                                                        disabled={!selectedCandidate}
                                                        className={`border p-2 focus:outline-none bg-white mb-5 w-full rounded-md
                                                        ${errors.instructions
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                            }`}

                                                    ></textarea>
                                                    {errors.instructions && (
                                                        <p className="text-red-500 text-sm -mt-4">
                                                            {errors.instructions}
                                                        </p>
                                                    )}
                                                    <p className="text-gray-600 text-sm float-right -mt-4">
                                                        {(round.instructions ? round.instructions.length : 0)}/1000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Save Button - Fixed */}
                            <div className="flex justify-end border-t">
                                <button
                                    className="bg-blue-500 mt-3 text-white p-3 rounded py-1 shadow-lg mr-5"
                                    onClick={handleSave}
                                >
                                    Schedule
                                </button>
                            </div>

                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div
                        className={"fixed inset-0 bg-black bg-opacity-15 z-50"}
                    >
                        <div className="fixed inset-y-0 right-0 z-50 w-1/2 bg-white shadow-lg transition-transform duration-5000 transform">
                            {showNewCandidateContent && (
                                    <AddCandidateForm onClose={handleClose} />
                            )}
                            {showNewteamContent && (
                                    <AddteamForm onClose={handleClose} />
                            )}
                        </div>
                    </div>

                </>
            )}
            {showOutsourcePopup && (
                <OutsourceOption onClose={() => setShowOutsourcePopup(false)} />
            )}
            {showDeletePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/3 relative">
                        <p className="text-lg mb-4">Are you sure you want to delete this round?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2"
                                onClick={cancelDeleteRound}
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 text-white rounded px-4 py-2"
                                onClick={confirmDeleteRound}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddRoundPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/3 relative">
                        <p className="text-lg mb-4">Add new round</p>
                        <div className="mb-4">
                            <label className="block mb-2">Select Position</label>
                            <select
                                className="border p-2 w-full"
                                value={roundPosition.index}
                                onChange={(e) => setRoundPosition({ ...roundPosition, index: parseInt(e.target.value) })}
                            >
                                {rounds.map((_, index) => (
                                    <option key={index} value={index}>
                                        Round {index + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Before or After</label>
                            <select
                                className="border p-2 w-full"
                                value={roundPosition.position}
                                onChange={(e) => setRoundPosition({ ...roundPosition, position: e.target.value })}
                            >
                                <option value="before">Before</option>
                                <option value="after">After</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2"
                                onClick={() => setShowAddRoundPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white rounded px-4 py-2"
                                onClick={handleAddRound}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCloseConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/3 relative">
                        <p className="text-lg mb-4">You have unsaved changes. Are you sure you want to close?</p>
                        <div className="flex justify-end">
                            <button className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2" onClick={cancelClose}>
                                No
                            </button>
                            <button className="bg-red-500 text-white rounded px-4 py-2" onClick={confirmClose}>
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Schedulelater;
