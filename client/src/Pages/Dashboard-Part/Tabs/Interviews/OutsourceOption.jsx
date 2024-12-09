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
      className="w-72 text-xs bg-white border z-50 h-[calc(100vh-300px)]"
      style={{
        visibility: isOpen ? "visible" : "hidden",
        transform: isOpen ? "" : "translateX(50%)",
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "1000",
      }}
    >
      <div className="relative h-full flex flex-col">
        <div className="absolute w-72 border-b flex justify-between p-2 items-center bg-white z-10">
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
                  <span className="ml-3 w-56  text-xs">{option.SkillName}</span>
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
        <div className=" w-72 bg-white space-x-3 flex justify-end border-t p-2">
          <button
            type="submit"
            className="bg-custom-blue p-2 rounded-md text-white font-semibold"
            onClick={closeOffcanvas}
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-custom-blue p-2 rounded-md text-white font-semibold"
            onClick={Apply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const OutsourceOption = ({ onClose, onSelectCandidates }) => {
  const { sharingPermissionscontext } = usePermissions();
  const sharingPermissions = useMemo(() => sharingPermissionscontext.candidate || {}, [sharingPermissionscontext]);

  const interviewers = [
    {
      name: "John Doe",
      company: "TATA",
      role: "Backend Developer",
      experience: "5-6 Years",
      skills: "Java, Spring Boot, Microservices, REST APIs, SQL",
      image: maleImage,
      ratingImage: StarRating,
      price: "USD $ 15",
      introduction: "John is a seasoned backend developer with a passion for building scalable applications. He has extensive experience in Java and Spring Boot, and is adept at designing microservices architectures. John is committed to delivering high-quality code and enjoys mentoring junior developers. He has worked on various projects that required innovative solutions and has a knack for optimizing performance. In his free time, John contributes to open-source projects and stays updated with the latest industry trends. He believes in the importance of clean code and best practices, often advocating for code reviews and pair programming. John also enjoys participating in hackathons, where he collaborates with other developers to create impactful solutions. His strong analytical skills enable him to troubleshoot complex issues efficiently. Outside of coding, John is an avid hiker and enjoys exploring nature with his family."
    },
    {
      name: "Jane Smith",
      company: "Wipro",
      role: "Data Scientist",
      experience: "3-4 Years",
      skills: "Python, Machine Learning, Data Analysis, Pandas, NumPy",
      image: femaleImage,
      ratingImage: StarRating,
      price: "USD $ 25",
      introduction: "Jane is a data enthusiast who loves turning data into actionable insights. With a strong background in machine learning and data analysis, she excels at creating predictive models. Jane is passionate about using data to solve complex problems and is always eager to learn new technologies. She has a proven track record of collaborating with cross-functional teams to drive data-driven decision-making. Jane is skilled in various data visualization tools, which she uses to present her findings effectively. She actively participates in data science meetups and workshops, sharing her knowledge and learning from others in the field. Jane also enjoys mentoring aspiring data scientists, helping them navigate their career paths. In her spare time, she writes articles on data science topics, contributing to online communities. Her curiosity drives her to explore new methodologies and tools, ensuring she stays at the forefront of the industry. When not working with data, Jane enjoys painting and finding inspiration in art."
    },
    {
      name: "Joyy",
      company: "Infosys",
      role: "Backend Developer",
      experience: "5-6 Years",
      skills: "Java, Spring Boot, Microservices, REST APIs, SQL",
      image: maleImage,
      ratingImage: StarRating,
      price: "USD $ 15",
      introduction: "John is a seasoned backend developer with a passion for building scalable applications. He has extensive experience in Java and Spring Boot, and is adept at designing microservices architectures. John is committed to delivering high-quality code and enjoys mentoring junior developers. He has worked on various projects that required innovative solutions and has a knack for optimizing performance. In his free time, John contributes to open-source projects and stays updated with the latest industry trends. He believes in the importance of clean code and best practices, often advocating for code reviews and pair programming. John also enjoys participating in hackathons, where he collaborates with other developers to create impactful solutions. His strong analytical skills enable him to troubleshoot complex issues efficiently. Outside of coding, John is an avid hiker and enjoys exploring nature with his family."
    },
    {
      name: "Smitha",
      company: "TCS",
      role: "Data Scientist",
      experience: "3-4 Years",
      skills: "Python, Machine Learning, Data Analysis, Pandas, NumPy",
      image: femaleImage,
      ratingImage: StarRating,
      price: "USD $ 10",
      introduction: "Jane is a data enthusiast who loves turning data into actionable insights. With a strong background in machine learning and data analysis, she excels at creating predictive models. Jane is passionate about using data to solve complex problems and is always eager to learn new technologies. She has a proven track record of collaborating with cross-functional teams to drive data-driven decision-making. Jane is skilled in various data visualization tools, which she uses to present her findings effectively. She actively participates in data science meetups and workshops, sharing her knowledge and learning from others in the field. Jane also enjoys mentoring aspiring data scientists, helping them navigate their career paths. In her spare time, she writes articles on data science topics, contributing to online communities. Her curiosity drives her to explore new methodologies and tools, ensuring she stays at the forefront of the industry. When not working with data, Jane enjoys painting and finding inspiration in art."
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [cardData, setCardData] = useState([]);
  const [filteredData, setFilteredData] = useState(interviewers);
  const [value1, setValue1] = useState([1000, 2000]);
  const [showContent, setShowContent] = useState(true);


  const [expandedIndex, setExpandedIndex] = useState(null);

  const [selectedInterviewer, setSelectedInterviewer] = useState(null);



  function valuetext(value) {
    return `${value}°C`;
  }

  const minValue = 1000;
  const maxValue = 10000;
  const minDistance = 1000;

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    let newMin = newValue[0];
    let newMax = newValue[1];
    newMin = Math.max(minValue, newMin);
    newMax = Math.min(maxValue, newMax);

    if (newMax - newMin < minDistance) {
      if (activeThumb === 0) {
        newMin = newMax - minDistance;
      } else {
        newMax = newMin + minDistance;
      }
    }

    setValue1([newMin, newMax]);
    const filtered = cardData.filter((card) => {
      const cardInr = parseInt(card.inr, 10);
      return cardInr >= newMin && cardInr <= newMax;
    });
    setFilteredData(filtered);
  };

  const marks = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1) * 1000,
    label: `${i + 1}k`,
  }));



  const handleSearchInputChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = interviewers.filter((interviewer) => {
      return (
        interviewer.name.toLowerCase().includes(query) ||
        interviewer.company.toLowerCase().includes(query) ||
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
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");


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


  const [selectedFilters, setSelectedFilters] = useState({
    tech: [],
    experience: { min: '', max: '' },
  });

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
                  Hire an Outsourced Interviewer
                </h2>
                <button
                  onClick={onClose}
                  className="focus:outline-none sm:hidden"
                >
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


              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>
                  {`
                    .hide-scrollbar::-webkit-scrollbar {
                      display: none;
                    }
                  `}
                </style>

                {/* filter and search */}
                <div className="flex items-center mb-4 mt-2">
                  <div className="relative ">
                    <div className=" ml-10 searchintabs border rounded-md relative py-[2px] w-[200px]">
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

                  <div className="w-80 mt-7">
                    <div className="text-center justify-center flex">
                      <Box sx={{ width: 250 }}>
                        <Slider
                          getAriaLabel={() => "Minimum distance"}
                          value={value1}
                          onChange={handleChange1}
                          valueLabelDisplay="auto"
                          getAriaValueText={valuetext}
                          step={1000}
                          marks={marks}
                          min={minValue}
                          max={maxValue}
                          sx={{
                            "& .MuiSlider-thumb": {
                              backgroundColor: "custom-blue",
                            },
                            "& .MuiSlider-rail": {
                              backgroundColor: "custom-blue",
                            },
                            "& .MuiSlider-track": {
                              backgroundColor: "custom-blue",
                              border: `1px solid ${"custom-blue"}`,
                            },
                          }}
                          disableSwap
                        />
                      </Box>
                    </div>
                  </div>

                  <div className="ml-2 text-xl border rounded-md p-2 relative">
                    <Tooltip
                      title="Filter"
                      enterDelay={300}
                      leaveDelay={100}
                      arrow
                    >
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

                    {/* OffcanvasMenu positioned below the filter icon with mr-80 */}
                    {isMenuOpen && (
                      <div className="absolute top-full mt-2" style={{ left: '-600%' }}>
                        <OffcanvasMenu
                          isOpen={isMenuOpen}
                          closeOffcanvas={handleFilterIconClick}
                          onFilterChange={handleFilterChange}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* cards code  */}
                <div className="flex flex-wrap justify-between gap-6 p-4">
                  {filteredData.map((interviewer, index) => (
                    <div
                      key={index}
                      className=" w-[48%] border border-custom-blue rounded-md shadow-md bg-[#F5F9FA]"
                      style={{
                        height: expandedIndex === index ? 'auto' : '150px',
                        overflowY: expandedIndex === index ? 'auto' : 'hidden',
                      }}
                    >
                      <div className="p-2" >
                        <div className="flex gap-4 items-start">
                          {/* Left Section: Image, Rating, Price, Skills Label */}
                          <div className="flex flex-col items-center">
                            <img
                              src={interviewer.image}
                              alt="interviewerImage"
                              className="w-10 h-10 rounded-full"
                            />
                            <img
                              src={interviewer.ratingImage}
                              alt="Rating"
                              className="w-10 h-5"
                            />
                            <p className="bg-blue-400 text-white text-xs rounded px-2 mb-1">
                              {interviewer.price}
                            </p>
                            <p className="text-gray-400  mr-9 text-xs">Skills:</p>
                          </div>

                          {/* Right Section: Info and Skills Content */}
                          <div className="flex-1 text-xs">
                            <p className="font-bold text-blue-400 mb-1 relative group">
                              {interviewer.name}
                              <span className="absolute left-16 ml-2 px-2 py-1 text-xs font-normal bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Name
                              </span>
                            </p>

                            <p className="mb-1 relative group">
                              {interviewer.company}
                              <span className="absolute left-16 ml-2 px-2 py-1 text-xs bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Company
                              </span>
                            </p>

                            <p className="mb-1 relative group">
                              {interviewer.role}
                              <span className="absolute left-28 ml-2 px-2 py-1 text-xs bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Role
                              </span>
                            </p>

                            <p className="mb-1 relative group">
                              {interviewer.experience}
                              <span className="absolute left-16 ml-2 px-2 py-1 text-xs bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Experience
                              </span>
                            </p>

                            <div className="mb-1">
                              <p className={`relative ${expandedIndex === index ? '' : 'overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[100px]'}`}>
                                {expandedIndex === index
                                  ? `${interviewer.skills.substring(0, 40)}...`
                                  : interviewer.skills}
                              </p>
                            </div>

                          </div>


                          {/* Toggle Arrow */}
                          <div
                            className="flex items-center text-2xl cursor-pointer"
                            onClick={() => toggleIntroduction(index)}
                          >
                            {expandedIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                          </div>
                        </div>
                        <div className="text-xs">
                          {expandedIndex === index && (
                            <p className="text-gray-400">Introduction:</p>
                          )}
                          <p>
                            {expandedIndex === index
                              ? `${interviewer.introduction.substring(0, 350)}${interviewer.introduction.length > 350 ? '...' : ''}`
                              : ''}
                          </p>
                        </div>

                      </div>

                      {/* Buttons */}
                      <div className="flex justify-end gap-4 p-2 -mt-3">
                        <button
                          className="border border-custom-blue py-1 px-2 bg-white rounded text-sm font-semibold hover:bg-blue-50"
                          onClick={() => handleViewClick(interviewer)}
                        >
                          View
                        </button>
                        <button className="border border-custom-blue py-1 px-2 bg-white rounded text-sm font-semibold hover:bg-blue-50">
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>


              <div className="footer-buttons flex justify-end gap-6">
                <button type="submit" className="footer-button bg-white text-black border border-custom-blue hover:bg-custom-blue hover:text-white">
                  Send Request
                </button>
                <button type="submit" className="footer-button bg-custom-blue">
                  Schedule
                </button>
              </div>
            </div>

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
                          <img
                            src={StarRating}
                            alt="5 stars"
                            className="w-24 h-10 -mt-1 mx-auto"
                          />
                          <p className="bg-blue-400 text-white py-1 px-2 w-[82px] rounded mx-auto">
                            {selectedInterviewer.price}
                          </p>
                          <p>{selectedInterviewer.company}</p>
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
                          <div className="flex w-1/4">
                            <p className="font-medium">Company Name</p>
                          </div>
                          <div className="w-1/4 sm:w-1/2">
                            <p className="text-gray-500">{selectedInterviewer.company}</p>
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

export default OutsourceOption;
