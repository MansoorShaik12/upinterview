import React, { useState, useEffect, useMemo } from "react";
import axios from "axios"; // Ensure axios is imported
import Software from "../../../Dashboard-Part/Images/software.jpg";
import { GoDotFill } from "react-icons/go";
import { IoMdSearch } from "react-icons/io";
import StarRating from "../../../Dashboard-Part/Images/stars.png";
import "../../Tabs/styles/tabs.scss";
import Slider from "@mui/material/Slider";
import { deepOrange } from "@mui/material/colors";
import { MdOutlineCancel } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import Box from "@mui/material/Box";
import { IoArrowBack } from "react-icons/io5";

const PaginationComponent = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cardData, setCardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [value1, setValue1] = useState([1000, 2000]);
  const [showContent, setShowContent] = useState(true);
  const [selectedPersonId, setSelectedPersonId] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/contacts`);
        const freelancers = response.data.filter(contact => contact.isFreelancer === 'yes');
        setCardData(freelancers);
        setFilteredData(freelancers);
      } catch (error) {
        console.error('Error fetching contacts data:', error);
      }
    };
    fetchContacts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = cardData.filter((item) => {
      return (
        (item.Name && item.Name.toLowerCase().includes(lowercasedQuery)) ||
        (item.Experience && item.Experience.toLowerCase().includes(lowercasedQuery)) ||
        (item.CurrentRole && item.CurrentRole.toLowerCase().includes(lowercasedQuery)) ||
        (item.company && item.company.toLowerCase().includes(lowercasedQuery)) ||
        (item.Technology && item.Technology.toLowerCase().includes(lowercasedQuery)) ||
        (item.Introduction && item.Introduction.toLowerCase().includes(lowercasedQuery)) ||
        (item.inr && item.inr.toLowerCase().includes(lowercasedQuery))
      );
    });
    setFilteredData(filtered);
  }, [searchQuery, cardData]);

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

  const toggleContent = (id) => {
    setShowContent(false);
    setSelectedPersonId(cardData.find((card) => card.id === id));
  };

  const toggleAntiContent = () => {
    setShowContent(true);
    setSelectedPersonId(false);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
        <div className="bg-white shadow-lg overflow-hidden" style={{ width: "97%", height: "94%" }}>
          {showContent && (
            <>
              {/* header */}
              <div className="sticky top-0 flex justify-between p-4 border border-b bg-white z-10">
                <p className="text-3xl text-orange-500 mt-3">Hire an Outsourced Interviewer</p>
                <div className="relative mt-5">
                  {filteredData.some(card => card.selected) && ( // Check if any card is selected
                    <button className="px-2 py-1 mr-5 bg-green-500 text-white rounded hover:bg-green-600">
                      Send Request
                    </button>
                  )}
                  <button
                    className="absolute top-0 right-0 transform translate-x-2 -translate-y-7 rounded-full"
                    onClick={onClose}
                  >
                    <MdOutlineCancel className="text-2xl" />
                  </button>
                </div>
              </div>

              {/* filter and search */}
              <div className="flex items-center justify-end mb-4 mt-2">
                <div className="w-80">
                  <p className="text-xs font-bold text-center">Cost efficient filter</p>
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
                            backgroundColor: deepOrange[500],
                          },
                          "& .MuiSlider-rail": {
                            backgroundColor: deepOrange[500],
                          },
                          "& .MuiSlider-track": {
                            backgroundColor: deepOrange[500],
                            border: `1px solid ${deepOrange[500]}`,
                          },
                        }}
                        disableSwap
                      />
                    </Box>
                  </div>
                </div>
                <div className="searchintabs mr-3">
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={handleSearchChange}
                  />
                  <button type="submit">
                    <IoMdSearch />
                  </button>
                </div>
              </div>

              {/* card contents */}
              <div className="relative flex flex-col h-full overflow-hidden text-sm">
                <div className={`flex-grow overflow-y-scroll ${filteredData.length > 0 ? "" : "flex items-center justify-center"}`}>
                  {filteredData.length > 0 ? (
                    <div className="grid grid-cols-3 gap-5 mx-5 mb-52">
                      {filteredData.map((card) => (
                        <div
                          key={card._id}
                          className={`bg-white border border-gray-300 cursor-pointer p-2 rounded shadow-orange-500 shadow w-full bg-${card.bgColor}`}
                        >
                          <div className="grid grid-cols-2 h-full">
                            {/* col 1 */}
                            <div className="text-gray-500">
                              <p>Role:</p>
                              <p>Skills:</p>
                              <p>Experience:</p>
                              <p>Company:</p>
                              <p>Interviewer:</p>
                            </div>
                            {/* col 2 */}
                            <div className="font-semibold -ml-10 flex flex-col justify-between">
                              <div className="flex justify-between">
                                <p>{card.CurrentRole}</p>
                                <div className="flex items-center gap-2">
                                  <GoDotFill className="text-green-500 text-3xl" />
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4"
                                    checked={card.selected} // Bind checkbox to selected state
                                    onChange={() => {
                                      card.selected = !card.selected; // Toggle selection
                                      setFilteredData([...filteredData]); // Update state to re-render
                                    }}
                                  />
                                </div>
                              </div>
                              <p>{card.Technology}</p>
                              <p>{card.Experience}</p>
                              <p>{card.company}</p>
                              <div className="flex items-center gap-5">
                                <div>
                                  <p>{card.Name}</p>
                                  <img
                                    src={StarRating}
                                    alt=""
                                    width={70}
                                    className="bg-white rounded-lg -mt-1"
                                  />
                                  <p className="bg-blue-800 text-white text-sm py-0.5 px-5">
                                    INR: {card.inr}
                                  </p>
                                </div>
                                <div className="flex items-center gap-5 mt-2">
                                  <img
                                    src={card.imageUrl || Software}
                                    alt={`Card ${card._id}`}
                                    className="w-14 h-14 rounded"
                                  />
                                  <FaArrowRightLong
                                    className="text-xl mt-10 cursor-pointer"
                                    onClick={() => toggleContent(card._id)}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end mt-2">
                                <p className="px-5 bg-blue-500 py-1 rounded-md text-white w-fit cursor-pointer">Schedule</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center -mt-24">
                      <p>No data found</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {selectedPersonId && (
            <>
              {/* Header */}
              <div className="border border-b relative flex justify-between items-center"> 
              <div className="flex items-center p-2"> 
                  <button
                    className="text-2xl shadow px-2 ml-4 mr-5 text-black rounded"
                    onClick={() => toggleAntiContent()}
                  >
                    <IoArrowBack />
                  </button>
                  <p className="text-3xl">{selectedPersonId.Name}</p> 
                </div>
                <div className="flex p-2"> 
                  <button className="px-4 py-1 mr-3 bg-blue-500 text-white rounded hover:bg-green-600">
                    Schedule
                  </button>
                  <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-12">
                    Send Request
                  </button>
                </div>
              </div>
              <div>
                <div className="mx-20 mt-10 text-sm">
                  <div className="grid grid-cols-4">
                    {/* col 1 */}
                    <div className="col-span-1">
                      <ul className="space-y-5">
                        <li className="font-bold">Name</li>
                        <li className="font-bold">Role</li>
                        <li className="font-bold">Experience</li>
                        <li className="font-bold">Company Name</li>
                        <li className="font-bold">Technology</li>
                        <li className="font-bold">Skills</li>
                      </ul>
                    </div>
                    {/* col 2 */}
                    <div className="col-span-1">
                      <ul className="space-y-5">
                        <li>{selectedPersonId.Name}</li>
                        <li>{selectedPersonId.CurrentRole}</li>
                        <li>{selectedPersonId.Experience}</li>
                        <li>{selectedPersonId.company}</li>
                        <li>-</li>
                        <li>{selectedPersonId.Technology}</li>
                      </ul>
                    </div>
                    {/* col 3 */}
                    <div className="flex justify-end col-span-2">
                      <div className="text-center space-y-1">
                        <img
                          src={selectedPersonId.imageUrl || Software}
                          alt={`Card ${selectedPersonId._id}`}
                          className="w-32 h-32 rounded"
                        />
                        <img
                          src={StarRating}
                          alt=""
                          width={130}
                          className="bg-white rounded-lg -mt-1"
                        />
                        <p className="bg-blue-800 text-white py-2 w-32 text-md">
                          INR: {selectedPersonId.inr}
                        </p>
                        <p className="bg-green-500 py-2 text-white mt-5 rounded-lg w-32 text-md">
                          Available
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <p className="font-bold">Introduction</p>
                    <p>{selectedPersonId.Introduction}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PaginationComponent;
