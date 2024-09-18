import React, { useState, useRef, useEffect } from "react";
import { MdOutlineCancel, MdArrowDropDown } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";
import AddCandidateForm from "../Candidate-Tab/CreateCandidate";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-input-2/lib/style.css";

const ShareAssessment = ({
  isOpen,
  onCloseshare,
  onOutsideClick,
  AssessmentTitle,
  assessmentId,
}) => {
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
  });

  const linkInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownCandidate(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [copyStatus, setCopyStatus] = useState('');

  const handleCopyClick = async () => {
    if (linkInputRef.current) {
      try {
        await navigator.clipboard.writeText(linkInputRef.current.value);
        setCopyStatus('Copied');
        setTimeout(() => setCopyStatus(''), 2000);
      } catch (err) {
        console.error('Error copying text: ', err);
      }
    }
  };


  const userId = localStorage.getItem("userId");

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
  }, [userId]);

  const [InterviewQuestion] = useState([]);

  const [selectedIcons2] = useState([]);

  const [showMainContent, setShowMainContent] = useState(true);
  const [showNewCandidateContent, setShowNewCandidateContent] = useState(false);


  const [notesValue, setNotesValue] = useState("");


  const handleNotesChange = (event) => {
    const value = event.target.value;
    if (value.length <= 250) {
      setNotesValue(value);
      event.target.style.height = "auto";
      event.target.style.height = event.target.scrollHeight + "px";
      setFormData({ ...formData, notes: value });
      setErrors({ ...errors, notes: "" });
    }
  };

  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidateData, setCandidateData] = useState([]);
  const [candidateInput, setCandidateInput] = useState("");
  const [showDropdownCandidate, setShowDropdownCandidate] = useState(false);
  const [errors, setErrors] = useState({});
  const candidateRef = useRef(null);
  const dropdownRef = useRef(null);


  const handleCandidateInputChange = (e) => {
    const inputValue = e.target.value;
    setCandidateInput(inputValue);
    const filtered = candidateData.filter((candidate) =>
      candidate.LastName.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredCandidates(filtered);
    setShowDropdownCandidate(!showDropdownCandidate);
  };

  const handleDropdownToggle = () => {
    setShowDropdownCandidate((prev) => !prev);
  };

  const handleCandidateSelect = (candidate) => {
    const candidateName = candidate.LastName;
    if (candidate && !selectedCandidates.includes(candidateName)) {
      setSelectedCandidates([...selectedCandidates, candidateName]);
      // sendEmail(candidate);
      setErrors({ ...errors, Candidate: "" });
    }
    setCandidateInput("");
    setShowDropdownCandidate(false);
  };

  const handleCandidateRemove = (candidateName) => {
    setSelectedCandidates(
      selectedCandidates.filter((candidate) => candidate !== candidateName)
    );
  };

  const handleClearAllCandidates = () => {
    setSelectedCandidates([]);
  };

  const handleAddNewCandidateClick = () => {
    setShowMainContent(false);
    setShowNewCandidateContent(true);
  };

  const handleclose = () => {
    setShowMainContent(true);
    setShowNewCandidateContent(false);
  };

  const handleCandidateAdded = (newCandidate) => {
    setCandidateData([...candidateData, newCandidate]);
    setSelectedCandidates([...selectedCandidates, newCandidate.LastName]);
    setShowMainContent(true);
    setShowNewCandidateContent(false);
    setShowDropdownCandidate(false);
  };



  if (!isOpen) return null;
  const shareLink = `${process.env.REACT_APP_API_URL}/assessment/${assessmentId}/share`;


  const handleShareClick = async () => {
    if (selectedCandidates.length === 0) {
      setErrors({ ...errors, Candidate: "Please select at least one candidate." });
      return;
    }
    setIsLoading(true);
    try {
      const selectedCandidateIds = selectedCandidates.map(candidateName => {
        const candidate = candidateData.find(c => c.LastName === candidateName);
        return candidate ? candidate._id : null;
      }).filter(id => id !== null);

      await axios.post(`${process.env.REACT_APP_API_URL}/update-candidates`, {
        candidateIds: selectedCandidateIds,
        assessmentId
      });

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-assessment-link`, {
        candidateEmails: selectedCandidateIds.map(id => {
          const candidate = candidateData.find(c => c._id === id);
          return candidate ? candidate.Email : null;
        }).filter(email => email !== null),
        assessmentId,
        notes: formData.notes,
        sections: selectedIcons2,
        questions: InterviewQuestion
      });

      if (response.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onCloseshare();
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating candidate IDs or sending emails:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-15 z-50 ${isOpen ? "visible" : "invisible"
          }`}
        onClick={onOutsideClick}
      >
        <div
          className={`fixed inset-y-0 right-0 z-10 w-1/2 bg-white shadow-lg transition-transform duration-1000 transform ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded shadow-lg">
                Sending email...
              </div>
            </div>
          )}
          {isSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded shadow-lg">
                Email sent successfully!
              </div>
            </div>
          )}
          {showMainContent ? (
            <>
              <div className="border-b">
                <div className="mx-8 my-3">
                  <p className="text-xl flex justify-between items-center">
                    <span className="text-orange-500 font-semibold cursor-pointer">
                      {" "}
                      Share
                      <span className="text-gray-400">{AssessmentTitle}</span>
                    </span>
                    <button
                      className="shadow-lg rounded-full"
                      onClick={onCloseshare}
                    >
                      <MdOutlineCancel className="text-2xl" />
                    </button>
                  </p>
                </div>
              </div>

              <div className="fixed top-20 bottom-16 left-8 overflow-auto w-full">
                {/* Share the link */}
                <div className="flex gap-5 mb-5 mt-8">
                  <div>
                    <label
                      htmlFor="share"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                    >
                      Share the link
                    </label>
                  </div>
                  <div className="flex-grow flex items-center mr-16">
                    <input
                      type="text"
                      id="share"
                      value={shareLink}
                      readOnly
                      ref={linkInputRef}
                      className="border-b focus:border-black focus:outline-none mb-1 w-full"
                    />
                    <div
                      className="cursor-pointer flex items-center text-gray-600 ml-2 mb-2 relative"
                      onClick={handleCopyClick}
                    >
                      <FaRegCopy
                        className={`text-xl ${copyStatus ? "text-blue-500" : "text-gray-600"}`}
                      />
                      <div>
                        {copyStatus && (
                          <span className="absolute right-0 top-full mt-1 px-2 py-1 text-xs text-white bg-gray-600 border border-gray-600 rounded-md shadow-lg z-10">
                            Copied
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* add candidate */}
                <div className="flex gap-5 mb-5 relative" ref={candidateRef}>
                  <div>
                    <label
                      htmlFor="Candidate"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                    >
                      Candidate <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative flex-grow">
                    <div className={`border-b focus:border-black focus:outline-none mb-5 w-96 h-auto flex items-start flex-wrap ${errors.Candidate ? "border-red-500" : "border-gray-300"}`}>
                      {selectedCandidates.map((candidate, index) => (
                        <div
                          key={index}
                          className="bg-slate-200 rounded-lg flex px-1 py-1 mr-1 mb-1 text-xs"
                        >
                          {candidate}
                          <button
                            onClick={() => handleCandidateRemove(candidate)}
                            className="ml-1 bg-slate-300 rounded px-2"
                          >
                            X
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        className="border-none focus:outline-none flex-grow min-w-[100px]"
                        value={candidateInput}
                        onChange={handleCandidateInputChange}
                        onClick={() => {
                          setShowDropdownCandidate(!showDropdownCandidate);
                          if (!candidateInput) {
                            setFilteredCandidates(candidateData);

                          }
                        }}
                        autoComplete="off"
                      />
                      {errors.Candidate && <p className="text-red-500 text-sm absolute mt-7">{errors.Candidate}</p>}
                      {selectedCandidates.length > 0 && (
                        <button
                          onClick={handleClearAllCandidates}
                          className="text-gray-500 text-lg cursor-pointer top-0 right-0 mt-1"
                        >
                          X
                        </button>
                      )}
                      <MdArrowDropDown
                        onClick={handleDropdownToggle}
                        className="absolute top-0 text-gray-500 text-lg mt-1 cursor-pointer right-0"
                      />
                    </div>

                    {/* Dropdown */}
                    {showDropdownCandidate && (
                      <div ref={dropdownRef} className="absolute z-30 -mt-5 w-96 rounded-md bg-white shadow-lg">
                        <p className="p-1 font-medium">Recent Candidates</p>
                        <ul>
                          {filteredCandidates.length > 0 ? (
                            filteredCandidates.slice(0, 4).map((candidate) => (
                              <li
                                key={candidate._id}
                                className="bg-white border-b cursor-pointer p-1 hover:bg-gray-100"
                                onClick={() =>
                                  handleCandidateSelect(candidate)
                                }
                              >
                                {candidate.LastName}
                              </li>
                            ))
                          ) : (
                            <li className="bg-white border-b cursor-pointer p-1">
                              No matching candidates found
                            </li>
                          )}
                          <li
                            className="flex bg-white border-b cursor-pointer p-1 hover:bg-gray-100"
                            onClick={handleAddNewCandidateClick}
                          >
                            <IoIosAddCircle className="text-2xl" />
                            <span>Add New Candidate</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                </div>
                {/* notes */}
                <div className="flex gap-5 mb-5 mt-8">
                  <div>
                    <label
                      htmlFor="notes"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                    >
                      Notes
                    </label>
                  </div>
                  <div className="flex-grow mr-12">
                    <textarea
                      rows={5}
                      value={formData.notes}
                      onChange={handleNotesChange}
                      name="notes"
                      id="notes"
                      className="border p-2  rounded-md focus:border-black focus:outline-none mb-5 w-96"
                    ></textarea>
                    {notesValue.length > 0 && (
                      <p className="text-gray-600 text-sm float-right -mt-4 mr-12">
                        {notesValue.length}/250
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="footer-buttons flex justify-end">
                <button onClick={handleShareClick} className="footer-button bg-blue-500 text-white">
                  Share
                </button>
              </div>
            </>
          ) : (
            <>
              {showNewCandidateContent && (
                <AddCandidateForm onClose={handleclose} onCandidateAdded={handleCandidateAdded} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShareAssessment;