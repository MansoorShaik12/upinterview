import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import femaleImage from "../../../Dashboard-Part/Images/woman.png";
import StarRating from "../../../Dashboard-Part/Images/stars.png";
import "../../Tabs/styles/tabs.scss";
import Slider from "@mui/material/Slider";
import { blue, deepOrange } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import maleImage from "../../../Dashboard-Part/Images/man.png";
import genderlessImage from "../../../Dashboard-Part/Images/transgender.png";
import { usePermissions } from '../../../../PermissionsContext';
import { useMemo } from 'react';



import { ReactComponent as IoArrowBack } from "../../../../icons/IoArrowBack.svg";
import { ReactComponent as IoMdSearch } from "../../../../icons/IoMdSearch.svg";
import { ReactComponent as FiFilter } from "../../../../icons/FiFilter.svg";
import { ReactComponent as LuFilterX } from "../../../../icons/LuFilterX.svg";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { ReactComponent as MdKeyboardArrowUp } from "../../../../icons/MdKeyboardArrowUp.svg";
import { ReactComponent as MdKeyboardArrowDown } from "../../../../icons/MdKeyboardArrowDown.svg";
import { fetchMasterData } from "../../../../utils/fetchMasterData.js";
import { fetchFilterData } from '../../../../utils/dataUtils.js';

const OffcanvasMenu = ({ isOpen, onFilterChange, closeOffcanvas }) => {
  const [isTechDropdownOpen, setTechDropdownOpen] = useState(false);
  const [isTechMainChecked, setTechMainChecked] = useState(false);
  const [selectedTechOptions, setSelectedTechOptions] = useState([]);
  const isAnyOptionSelected = selectedTechOptions.length > 0;
  const handleUnselectAll = () => {
    setSelectedTechOptions([]);
    setTechMainChecked(false);
    setMinExperience('');
    setMaxExperience('');
    onFilterChange({ status: [], tech: [], experience: { min: '', max: '' } });
  };
  useEffect(() => {
    if (!isTechMainChecked) setSelectedTechOptions([]);
  }, [isTechMainChecked]);

  const handleTechMainToggle = () => {
    const newTechMainChecked = !isTechMainChecked;
    setTechMainChecked(newTechMainChecked);
    const newSelectedTech = newTechMainChecked ? skills.map(s => s.SkillName) : [];
    setSelectedTechOptions(newSelectedTech);

  };

  const handleTechOptionToggle = (option) => {
    const selectedIndex = selectedTechOptions.indexOf(option);
    const updatedOptions = selectedIndex === -1
      ? [...selectedTechOptions, option]
      : selectedTechOptions.filter((_, index) => index !== selectedIndex);

    setSelectedTechOptions(updatedOptions);
  };
  const [skills, setSkills] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsData = await fetchMasterData('skills');
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };
    fetchData();
  }, []);

  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');

  const handleExperienceChange = (e, type) => {
    const value = Math.max(0, Math.min(15, e.target.value));
    if (type === 'min') {
      setMinExperience(value);
    } else {
      setMaxExperience(value);
    }

  };
  const Apply = () => {
    onFilterChange({
      tech: selectedTechOptions,
      experience: { min: minExperience, max: maxExperience },
    });
    if (window.innerWidth < 1023) {
      closeOffcanvas();
    }
  }
  return (
    <div
      className="absolute w-72 sm:mt-5 md:w-full sm:w-full text-sm bg-white border right-0 z-30 h-[calc(100vh-200px)]"
      style={{
        visibility: isOpen ? "visible" : "hidden",
        transform: isOpen ? "" : "translateX(50%)",
      }}
    >
      <div className="relative h-full flex flex-col">
        <div className="absolute w-72 sm:w-full md:w-full border-b flex justify-between p-2 items-center bg-white z-10">
          <div>
            <h2 className="text-lg font-bold ">Filters</h2>
          </div>
          {/* Unselect All Option */}
          <div>
            {(isAnyOptionSelected || minExperience || maxExperience) && (
              <div>
                <button onClick={handleUnselectAll} className="font-bold text-md">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 flex-grow overflow-y-auto mb-20 mt-10">
          {/* Skill/Technology */}
          <div className="flex mt-2 justify-between">
            <div className="cursor-pointer">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4"
                  checked={isTechMainChecked}
                  onChange={handleTechMainToggle}
                />
                <span className="ml-3 font-bold">Skill/Technology</span>
              </label>
            </div>
            <div
              className="cursor-pointer mr-3 text-2xl"
              onClick={() => setTechDropdownOpen(!isTechDropdownOpen)}
            >
              {isTechDropdownOpen ? (
                <MdKeyboardArrowUp />
              ) : (
                <MdKeyboardArrowDown />
              )}
            </div>
          </div>
          {isTechDropdownOpen && (
            <div className="bg-white py-2 mt-1">
              {skills.map((option, index) => (
                <label key={index} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4"
                    checked={selectedTechOptions.includes(option.SkillName)}
                    onChange={() => handleTechOptionToggle(option.SkillName)}
                  />
                  <span className="ml-3 w-56 md:w-72 sm:w-72 text-xs">{option.SkillName}</span>
                </label>
              ))}
            </div>
          )}
          <div className="flex justify-between mt-2 ml-5">
            <div className="cursor-pointer">
              <label className="inline-flex items-center">
                <span className="ml-3 font-bold">Experience</span>
              </label>
            </div>
          </div>
          <div className="bg-white py-2 mt-1">
            <div className="flex items-center ml-10">
              <input
                type="number"
                placeholder="Min"
                value={minExperience}
                min="0"
                max="15"
                onChange={(e) => handleExperienceChange(e, 'min')}
                className="border-b form-input w-20"
              />
              <span className="mx-3">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxExperience}
                min="1"
                max="15"
                onChange={(e) => handleExperienceChange(e, 'max')}
                className="border-b form-input w-20"
              />
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="fixed bottom-0 w-72 sm:w-full md:w-full bg-white space-x-3 flex justify-end border-t p-2">
          <button
            type="submit"
            className="bg-custom-blue p-2 rounded-md text-white"
            onClick={closeOffcanvas}
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-custom-blue p-2 rounded-md text-white"
            onClick={Apply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const InternalInterviews = ({ onClose, onSelectCandidates }) => {
  const { sharingPermissionscontext } = usePermissions();
  const sharingPermissions = useMemo(() => sharingPermissionscontext.team || {}, [sharingPermissionscontext]);

  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    tech: [],
  });

  const fetchTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const filteredTeams = await fetchFilterData('team', sharingPermissions);
      const teamsWithImages = filteredTeams.map((team) => {
        if (team.ImageData && team.ImageData.filename) {
          const imageUrl = `${process.env.REACT_APP_API_URL}/${team.ImageData.path.replace(/\\/g, '/')}`;
          return { ...team, imageUrl };
        }
        return team;
      });
      setTeamData(teamsWithImages);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  }, [sharingPermissions]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  const FilteredData = () => {
    if (!Array.isArray(teamData)) return [];
    return teamData.filter((team) => {
      const matchesStatus = selectedFilters.status.length === 0 || selectedFilters.status.includes(team.Technology);
      const matchesTech = selectedFilters.tech.length === 0 || team.skills.some(skill => selectedFilters.tech.includes(skill.skill));
      const matchesSearchQuery = [team.LastName, team.Email, team.Phone].some(
        (field) => field && field.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesSearchQuery && matchesStatus && matchesTech;
    });
  };

  const [cardData, setCardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [value1, setValue1] = useState([1000, 2000]);
  const [showContent, setShowContent] = useState(true);


  const [expandedIndex, setExpandedIndex] = useState(null);

  const [selectedInterviewer, setSelectedInterviewer] = useState(null);

  const handleSearchInputChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = filteredData.filter((interviewer) => {
      return (
        interviewer.name.toLowerCase().includes(query) ||
        interviewer.role.toLowerCase().includes(query)
      );
    });

    setFilteredData(filtered);
  };



  const toggleIntroduction = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleViewClick = (interviewer) => {
    setSelectedInterviewer(interviewer);
  };
  const [isFilterActive, setIsFilterActive] = useState(false);

  const handleFilterIconClick = () => {
    if (candidateData.length !== 0) {
      setIsFilterActive((prev) => !prev);
      toggleMenu();
    }
  };
  


  const fetchCandidateData = useCallback(async () => {
    setLoading(true);
    try {
      const filteredCandidates = await fetchFilterData('candidate', sharingPermissions);
      const candidatesWithImages = filteredCandidates.map((candidate) => {
        if (candidate.ImageData && candidate.ImageData.filename) {
          const imageUrl = `${process.env.REACT_APP_API_URL}/${candidate.ImageData.path.replace(/\\/g, '/')}`;
          return { ...candidate, imageUrl };
        }
        return candidate;
      });
      setCandidateData(candidatesWithImages);
    } catch (error) {
      console.error('Error fetching candidate data:', error);
    } finally {
      setLoading(false);
    }
  }, [sharingPermissions]);
  useEffect(() => {
    fetchCandidateData();
  }, [fetchCandidateData]);


  const [candidateData, setCandidateData] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);



  const handleFilterChange = useCallback((filters) => {
    setSelectedFilters(filters);
  }, []);




  const [isMenuOpen, setMenuOpen] = useState(false);


  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates((prevSelected) => {
      const isSelected = prevSelected.includes(candidateId);
      const updatedSelection = isSelected
        ? prevSelected.filter((id) => id !== candidateId)
        : [...prevSelected, candidateId];

      return updatedSelection;
    });
  };

  useEffect(() => {
    if (onSelectCandidates) {
      onSelectCandidates(selectedCandidates);
    }
  }, [selectedCandidates, onSelectCandidates]);

  const handleSelectAll = () => {
    if (selectedCandidates.length === candidateData.length) {
      setSelectedCandidates([]);
    } else {
      const allCandidateIds = candidateData.map((candidate) => candidate._id);
      setSelectedCandidates(allCandidateIds);
    }
  };


  return (
    <>
      {showContent && (
        <>
          <div className={"fixed inset-0 bg-black bg-opacity-15 z-50"}>
            <div className="fixed inset-y-0 right-0 z-50 w-1/2 bg-white shadow-lg transition-transform duration-5000 transform">
              {/* header */}
              <div className="sticky top-0 flex justify-between p-4 border border-b bg-custom-blue text-white z-10">
                <h2 className="text-lg font-bold">
                  Internal Interviewers
                </h2>
                <button
                  onClick={onClose}
                  className="focus:outline-none sm:hidden"
                >
                  <svg
                    className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>


              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>
                  {` .hide-scrollbar::-webkit-scrollbar { display: none;  } `}
                </style>

                {/* filter and search */}
                <div className="flex items-center mb-4 mt-2 justify-between">
                  {/* Search Input */}
                  <div className="relative w-[200px] ml-10">
                    <div className="searchintabs border rounded-md relative py-[2px]">
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <button type="submit" className="p-2">
                          <IoMdSearch className="text-custom-blue" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Search Interviewer"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        className="rounded-full h-8 focus:outline-none border-gray-800"
                      />
                    </div>
                  </div>

                  {/* Filter Icon */}
                  <div className="mr-10 text-xl sm:text-md md:text-md border rounded-md p-2">
                    <Tooltip title="Filter" enterDelay={300} leaveDelay={100} arrow>
                      <span
                        onClick={handleFilterIconClick}
                        style={{
                          opacity: candidateData.length === 0 ? 0.2 : 1,
                          pointerEvents: candidateData.length === 0 ? "none" : "auto",
                        }}
                      >
                        {isFilterActive ? (
                          <LuFilterX className="text-custom-blue" />
                        ) : (
                          <FiFilter className="text-custom-blue" />
                        )}
                      </span>
                    </Tooltip>
                  </div>
                </div>

                {/* cards code  */}
                <div className="flex flex-wrap justify-between gap-6 p-4">
                  {FilteredData().map((interviewer, index) => (
                    <div
                      key={index}
                      className="w-[48%] border border-custom-blue rounded-md shadow-md bg-[#F5F9FA]"
                    >
                      <div className="p-2">
                        <div className="flex gap-6 items-start">
                          {/* Left Section: Image*/}
                          <div className="flex flex-col items-center">
                            <img
                              src={interviewer.imageUrl || (interviewer.Gender === "Male" ? maleImage : interviewer.Gender === "Female" ? femaleImage : genderlessImage)}
                              alt="interviewerImage"
                              className="w-16 h-16 rounded-full"
                            />
                          </div>

                          {/* Right Section: Info and Skills Content */}
                          <div className="flex-1 text-xs">
                            <p className="font-bold text-blue-400 mb-1 relative group">
                              {interviewer.LastName}
                              <span className="absolute left-16 ml-2 px-2 py-1 text-xs font-normal bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Name
                              </span>
                            </p>

                            <p className="mb-1 relative group">
                              {interviewer.Technology}
                              <span className="absolute left-28 ml-2 px-2 py-1 text-xs bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Technology
                              </span>
                            </p>

                            <p className="mb-1 relative group">
                              {interviewer.experience}
                              <span className="absolute left-16 ml-2 px-2 py-1 text-xs bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Experience
                              </span>
                            </p>

                            <div className="mb-1">
                              <p>
                                {interviewer.skills.map(skill => skill.skill).join(', ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Buttons */}
                      <div className="flex justify-end gap-4 p-2">
                        <button
                          className="border border-custom-blue py-1 px-2 rounded text-sm font-semibold hover:bg-blue-50 bg-white"
                          onClick={() => handleViewClick(interviewer)}
                        >
                          View
                        </button>
                        <button className="border border-custom-blue py-1 px-2 rounded text-sm font-semibold hover:bg-blue-50 bg-white">
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="footer-buttons flex justify-end">
                <button type="submit" className="footer-button bg-custom-blue">
                  Schedule
                </button>
              </div>
            </div>
            <OffcanvasMenu isOpen={isMenuOpen} closeOffcanvas={handleFilterIconClick} onFilterChange={handleFilterChange} />

          </div>

          {/* Detailed View */}
          {selectedInterviewer && (
            <div className={"fixed inset-0 bg-black bg-opacity-15 z-50"}>
              <div className="fixed inset-y-0 right-0 z-50 w-full bg-white shadow-lg transition-transform duration-5000 transform">
                <div className="container mx-auto">
                  <div className="grid grid-cols-4 mx-5">
                    {/* Left side */}
                    <div className="col-span-1 my-5">
                      <div className="mx-3 border rounded-lg h-[525px] mb-5 flex flex-col items-center">
                        <div className="mt-16">
                          <img
                            src={selectedInterviewer.image}
                            alt="Candidate"
                            className="w-32 h-32 rounded"
                          />
                        </div>
                        <div className="text-center mt-3">
                          <h2 className="text-lg font-bold">{selectedInterviewer.name}</h2>
                          
                  
                          <p>{selectedInterviewer.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="col-span-3 my-5">
                      <div className="flex justify-between sm:justify-start items-center">
                        <p className="text-2xl">
                          <span
                            className="text-custom-blue font-semibold cursor-pointer"
                            onClick={onClose}
                          >
                            {selectedInterviewer.name}
                          </span>
                        </p>
                        <button
                          type="submit"
                          className="footer-button bg-custom-blue mb-2"
                        >
                          Send Request
                        </button>
                      </div>
                      <div className="border p-4 rounded-md">
                        <h3 className="text-lg font-bold mb-2">Interviewer Details:</h3>
                        <div className="flex mb-5">
                          <div className="flex w-1/4">
                            <p className="font-medium">Name</p>
                          </div>
                          <div className="w-1/4 sm:w-1/2">
                            <p className="text-gray-500">{selectedInterviewer.name}</p>
                          </div>
                        </div>
                        <div className="flex mb-5">
                          <div className="flex w-1/4">
                            <p className="font-medium">Role</p>
                          </div>
                          <div className="w-1/4 sm:w-1/2">
                            <p className="text-gray-500">{selectedInterviewer.role}</p>
                          </div>
                          <div className="flex w-1/4">
                            <p className="font-medium">Experience</p>
                          </div>
                          <div className="w-1/4 sm:w-1/2">
                            <p className="text-gray-500">{selectedInterviewer.experience}</p>
                          </div>
                        </div>
                        <div className="flex mb-5">
                          <div className="flex w-1/4">
                            <p className="font-medium">Skills</p>
                          </div>
                          <div className="w-1/4 sm:w-1/2">
                            <p className="text-gray-500">{selectedInterviewer.skills}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md mt-4">
                        <h3 className="text-lg font-bold mb-2">Introduction:</h3>
                        <p className="text-gray-600">
                          {selectedInterviewer.introduction}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}




    </>
  );
};

export default InternalInterviews;
