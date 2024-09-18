import { useState, useRef, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { Menu, Transition } from "@headlessui/react";
import { MdMoreHoriz } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";

const profileData = [
  {
    profileName: "Java Developer",
    createdDate: "2023-01-09",
    createdBy: "Admin",
    modifiedDate: "2023-01-10",
    modifiedBy: "Admin",
  },

  // Add more dummy data as needed
];

const MasterData = () => {

  const [skillData, setSkillData] = useState([]);

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/skills`);
        console.log(response.data);
        setSkillData(response.data);
      } catch (error) {
        console.error('Error fetching roles data:', error);
      }
    };
    fetchSkillsData();
  }, []);

  const [technologyData, setTechnologyData] = useState([]);
  useEffect(() => {
    const fetchtechnologyData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/technology`);
        setTechnologyData(response.data);
      } catch (error) {
        console.error('Error fetching roles data:', error);
      }
    };
    fetchtechnologyData();
  }, []);

  const [industryData, setIndustries] = useState([]);
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

  const [roleData, setCurrentRole] = useState([]);

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

  const [locationData, setLocations] = useState([]);;

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("SkillMaster");
  const [openItemId, setOpenItemId] = useState(null);
  const dropdownRef = useRef(null);
  const [maincontent, setMaincontent] = useState(true);
  const [editcontent, setEditcontent] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedData(null);
    setMaincontent(true);
    setEditcontent(false);
    setOpenItemId(null);
  };

  const handleMoreClick = (itemId) => {
    setOpenItemId(openItemId === itemId ? null : itemId);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenItemId(null); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setOpenItemId(null);
    setIsOpen(false);
    setMaincontent(true);
    setEditcontent(false);
  }, [selectedTab]);

  const handleCandidateClick = (item) => {
    setSelectedData(item);
    setIsOpen(true);
    setOpenItemId(null);

  };
  const navigate = useNavigate();
  const viewClick = (item) => {
    navigate("/masterprofiledetails", { state: { userData: item } });

  };


  const handleEditClick = (item) => {
    setSelectedData(item);
    setMaincontent(false);
    setEditcontent(true);
  };
  const oneditpage = () => {
    setEditcontent(true);
    setMaincontent(false);
    setIsOpen(false);
  };

  const renderContent = () => {
    let data;
    switch (selectedTab) {
      case "SkillMaster":
        data = skillData;
        break;
      case "TechnologyMaster":
        data = technologyData;
        break;
      case "RoleMaster":
        data = roleData;
        break;
      case "IndustryMaster":
        data = industryData;
        break;
      case "LocationMaster":
        data = locationData;
        break;
      case "ProfileMaster":
        data = profileData;
        break;

      default:
        return <div>Select a tab to view content</div>;
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      if (isNaN(date)) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString();
    };

    return (
      <div className="relative">
        <table className="text-left w-full border-collapse border-gray-300">
          <thead className="text-xs border-t border-b bg-gray-300">
            <tr>
              {selectedTab === "ProfileMaster" ? (
                <>
                  <th scope="col" className="py-3 px-6">
                    Profile Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created By
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified by
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </>
              ) : selectedTab === "SkillMaster" ? (
                <>
                  <th scope="col" className="py-3 px-6">
                    ID
                  </th>
                  <th scope="col" className="py-3 px-6">
                    SkillName
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created By
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified by
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </>
              ) : selectedTab === "TechnologyMaster" ? (
                <>
                  <th scope="col" className="py-3 px-6">
                    ID
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Technology Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created By
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified by
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </>
              ) : selectedTab === "RoleMaster" ? (
                <>
                  <th scope="col" className="py-3 px-6">
                    Role Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Role Description
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created By
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified by
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </>
              ) : selectedTab === "IndustryMaster" ? (
                <>
                  <th scope="col" className="py-3 px-6">
                    Industry Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Industry Type
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created By
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified by
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </>
              ) : selectedTab === "LocationMaster" ? (
                <>
                  <th scope="col" className="py-3 px-6">
                    Location Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Location Type
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created By
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified by
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </>
              ) : (
                <>
                  <th scope="col" className="py-3 px-6">
                    ID
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created By
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified Date
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Modified by
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </>
              )}

            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 overflow-y-scroll text-xs">
            {data.map((item) => {

              const createdDate = item.CreatedDate ? new Date(item.CreatedDate).toLocaleDateString() : 'N/A'; // Format date
              console.log('CreatedDate:', createdDate); // Log the createdDate value
              return (
                <tr key={item._id}> {/* Use _id for unique key */}
                  {selectedTab === "ProfileMaster" ? (
                    <>
                      <td className="px-6 py-2">{item.profileName}</td>
                      <td className="px-6 py-2">{item.createdDate}</td>
                      <td className="px-6 py-2">{item.createdBy}</td>
                      <td className="px-6 py-2">{item.modifiedDate}</td>
                      <td className="px-6 py-2">{item.modifiedBy}</td>
                      <td className="px-6 py-2">
                        <button
                          className="text-blue-500 hover:underline ml-2"
                          onClick={() => viewClick(item)}
                        >
                          View
                        </button>
                      </td>
                    </>
                  ) : selectedTab === "SkillMaster" ? (
                    <>
                      <td className="px-6 py-2">{item._id}</td>
                      <td className="px-6 py-2">{item.SkillName}</td>
                      <td className="px-6 py-2">{new Date(item.CreatedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-2">{item.CreatedBy}</td>
                      <td className="px-6 py-2">{item.ModifiedDate}</td>
                      <td className="px-6 py-2">{item.ModifiedBy}</td>
                      <td className="px-6 py-2">
                        <button
                          className="text-blue-500 hover:underline ml-2"
                          onClick={() => viewClick(item)}
                        >
                          View
                        </button>
                      </td>
                    </>
                  ) : selectedTab === "TechnologyMaster" ? (
                    <>
                      <td className="px-6 py-2">{item._id}</td>
                      <td className="px-6 py-2">{item.TechnologyMasterName}</td>
                      <td className="px-6 py-2">{new Date(item.CreatedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-2">{item.CreatedBy}</td>
                      <td className="px-6 py-2">{item.ModifiedDate}</td>
                      <td className="px-6 py-2">{item.ModifiedBy}</td>
                      <td className="px-6 py-2">
                        <button
                          className="text-blue-500 hover:underline ml-2"
                          onClick={() => viewClick(item)}
                        >
                          View
                        </button>
                      </td>
                    </>
                  ) : selectedTab === "RoleMaster" ? (
                    <>
                      <td className="px-6 py-2">{item._id}</td>
                      <td className="px-6 py-2">{item.RoleName}</td>
                      <td className="px-6 py-2">{new Date(item.CreatedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-2">{item.CreatedBy}</td>
                      <td className="px-6 py-2">{item.ModifiedDate}</td>
                      <td className="px-6 py-2">{item.ModifiedBy}</td>
                      <td className="px-6 py-2">
                        <button
                          className="text-blue-500 hover:underline ml-2"
                          onClick={() => viewClick(item)}
                        >
                          View
                        </button>
                      </td>
                    </>
                  ) : selectedTab === "IndustryMaster" ? (
                    <>
                      <td className="px-6 py-2">{item._id}</td>
                      <td className="px-6 py-2">{item.IndustryName}</td>
                      <td className="px-6 py-2">{new Date(item.CreatedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-2">{item.CreatedBy}</td>
                      <td className="px-6 py-2">{item.ModifiedDate}</td>
                      <td className="px-6 py-2">{item.ModifiedBy}</td>
                      <td className="px-6 py-2">
                        <button
                          className="text-blue-500 hover:underline ml-2"
                          onClick={() => viewClick(item)}
                        >
                          View
                        </button>
                      </td>
                    </>
                  ) : selectedTab === "LocationMaster" ? (
                    <>
                      <td className="px-6 py-2">{item._id}</td>
                      <td className="px-6 py-2">{item.LocationName}</td>
                      <td className="px-6 py-2">{new Date(item.CreatedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-2">{item.CreatedBy}</td>
                      <td className="px-6 py-2">{item.ModifiedDate}</td>
                      <td className="px-6 py-2">{item.ModifiedBy}</td>
                      <td className="px-6 py-2">
                        <button
                          className="text-blue-500 hover:underline ml-2"
                          onClick={() => viewClick(item)}
                        >
                          View
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-2">{item.id}</td>
                      <td className="px-6 py-2">{item.name}</td>
                      <td className="px-6 py-2">{new Date(item.CreatedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-2">{item.CreatedBy}</td>
                      <td className="px-6 py-2">{item.ModifiedDate}</td>
                      <td className="px-6 py-2">{item.ModifiedBy}</td>
                      <td className="px-6 py-2">
                        <button
                          className="text-blue-500 hover:underline ml-2"
                          onClick={() => viewClick(item)}
                        >
                          View
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>


        </table>

      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className="fixed top-20 left-0 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto border border-gray-100">
          <ul className="space-y-2 font-medium">
            <li>
              <p>
                <span className="ms-3 font-bold text-lg">Master Tables</span>
              </p>
            </li>
            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg group ${selectedTab === "SkillMaster"
                  ? " bg-gray-200"
                  : "text-gray-900"
                  }`}
                onClick={() => setSelectedTab("SkillMaster")}
              >
                SkillMaster
              </NavLink>
            </li>
            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg group ${selectedTab === "TechnologyMaster"
                  ? " bg-gray-200"
                  : "text-gray-900"
                  }`}
                onClick={() => setSelectedTab("TechnologyMaster")}
              >
                TechnologyMaster
              </NavLink>
            </li>
            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg group ${selectedTab === "RoleMaster"
                  ? " bg-gray-200"
                  : "text-gray-900"
                  }`}
                onClick={() => setSelectedTab("RoleMaster")}
              >
                RoleMaster
              </NavLink>
            </li>
            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg group ${selectedTab === "IndustryMaster"
                  ? " bg-gray-200"
                  : "text-gray-900"
                  }`}
                onClick={() => setSelectedTab("IndustryMaster")}
              >
                IndustryMaster
              </NavLink>
            </li>
            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg group ${selectedTab === "LocationMaster"
                  ? " bg-gray-200"
                  : "text-gray-900"
                  }`}
                onClick={() => setSelectedTab("LocationMaster")}
              >
                LocationMaster
              </NavLink>
            </li>
            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg group ${selectedTab === "ProfileMaster"
                  ? " bg-gray-200"
                  : "text-gray-900"
                  }`}
                onClick={() => setSelectedTab("ProfileMaster")}
              >
                ProfileMaster
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
      {/* Main Content */}
      {maincontent && (
        <div className="w-full ml-64">

          {selectedTab === "ProfileMaster" ? (
            <div className="flex justify-between mx-3">
              <h2 className="text-2xl font-bold mb-4">{selectedTab}</h2>
              <p>
                <span className="p-2 px-5 w-fit text-xl font-semibold border shadow rounded-3xl">
                  Add
                </span>
              </p>
            </div>
          ) : (
            <h2 className="text-2xl font-bold -mb-10 ml-3">{selectedTab}</h2> // Show title for other tabs
          )}

          <div className="flex justify-end p-3">

            <div className="flex items-center -mt-2">
              {/* Search and Navigation Controls */}
              <div className="relative">
                <div className="searchintabs mr-5 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <button type="submit" className="p-2">
                      <IoMdSearch />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-12"
                  />
                </div>
              </div>
              <div>
                <span className="p-2 text-xl mr-2">1/0</span>
              </div>
              <div className="flex">
                <Tooltip
                  title="Previous"
                  enterDelay={300}
                  leaveDelay={100}
                  arrow
                >
                  <span className="border-2 p-2 mr-2 text-2xl">
                    <IoIosArrowBack />
                  </span>
                </Tooltip>

                <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
                  <span className="border-2 p-2 mr-2 text-2xl">
                    <IoIosArrowForward />
                  </span>
                </Tooltip>
              </div>
              <div className="ml-4 text-2xl border-2 rounded-md p-2">
                <Tooltip title="Filter" enterDelay={300} leaveDelay={100} arrow>
                  <span>
                    <FaFilter />
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>
          {renderContent()}
        </div>
      )}

      {isOpen && (
        <>
          <div className="w-full ml-64">
            <div className="flex justify-between w-full bg-white border-b pb-3 items-center">
              <div className="flex">
                <button
                  className="text-xl shadow px-2 ml-4 text-black rounded"
                  onClick={closeModal}
                >
                  <IoArrowBack />
                </button>
                <div className="items-center ml-5">
                  <span className="text-xl font-semibold">{selectedTab}/</span>
                  <span className="text-xl text-gray-500">
                    {selectedData.name}

                  </span>
                </div>
              </div>
              <div className=" items-center mr-5">
                <h2 className="text-lg text-gray-500" onClick={oneditpage}>
                  Edit
                </h2>
              </div>
            </div>
            <div className=" mt-4" style={{ marginLeft: "75px" }}>
              <div className="mt-2">
                {selectedData && (
                  <div className="grid grid-cols-3">
                    {selectedTab === "ProfileMaster" ? (
                      <>
                        <div className="font-semibold space-y-10">
                          <p>Profile Name</p> {/* Changed from SkillMaster Name to Profile Name */}
                          <p>Created Date</p>
                          <p>Created By</p>
                          <p>Modified Date</p>
                          <p>Modified by</p>
                        </div>
                        <div className="space-y-10 text-gray-500">
                          <p>{selectedData.profileName}</p> {/* Changed from {selectedData.name} to {selectedData.profileName} */}
                          <p>{selectedData.createdDate}</p>
                          <p>{selectedData.createdBy}</p>
                          <p>{selectedData.modifiedDate}</p>
                          <p>{selectedData.modifiedBy}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold space-y-10">
                          <p>SkillMaster ID</p>
                          <p>SkillMaster Name</p>
                          <p>Created Date</p>
                          <p>Created By</p>
                          <p>Modified Date</p>
                          <p>Modified by</p>
                        </div>
                        <div className="space-y-10 text-gray-500">
                          <p>{selectedData.id}</p>
                          <p>{selectedData.name}</p>
                          <p>{selectedData.createdDate}</p>
                          <p>{selectedData.createdBy}</p>
                          <p>{selectedData.modifiedDate}</p>
                          <p>{selectedData.modifiedBy}</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </>
      )}

      {editcontent && (
        <>
          <div className="w-full ml-64">
            <div className="flex justify-between w-full bg-white border-b pb-3 items-center">
              <div className="flex">
                <button
                  className="text-2xl shadow px-2 ml-4 text-black rounded"
                  onClick={closeModal}
                >
                  <IoArrowBack />
                </button>
                <div className="items-center ml-5">
                  <span className="text-xl font-semibold">{selectedTab}/</span>
                  <span className="text-xl text-gray-500">
                    {selectedData.name}
                  </span>
                </div>
              </div>
              <div className=" items-center mr-5">
                <h2 className="text-lg bg-blue-500 px-3 py-1 rounded">Save</h2>
              </div>
            </div>
            <div className="ml-10 mt-4">
              <div className="mt-2">
                {selectedData && (
                  <div className="grid grid-cols-2">
                    <div className="font-semibold space-y-10">
                      <p>SkillMaster ID</p>
                      <p>SkillMaster Name</p>
                      <p>Created Date</p>
                      <p>Created By</p>
                      <p>Modified Date</p>
                      <p>Modified by</p>
                    </div>
                    <div className="space-y-10 text-gray-500">
                      <p>{selectedData.id}</p>
                      <p>{selectedData.name}</p>
                      <p>{selectedData.createdDate}</p>
                      <p>{selectedData.createdBy}</p>
                      <p>{selectedData.modifiedDate}</p>
                      <p>{selectedData.modifiedBy}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MasterData;
