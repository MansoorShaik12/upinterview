import { useState, useRef, useEffect, useCallback } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import { MdMoreHoriz } from "react-icons/md";
import UserProfileDetails from "./UserProfileDetails";
import { useNavigate } from "react-router-dom";
import Sidebar from "./UserForm";
import Sidebar1 from "./EditUser";
import axios from "axios";

import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import EditUser from "./EditUser";

// {f} //

const OffcanvasMenu = ({ isOpen }) => {
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isTechDropdownOpen, setTechDropdownOpen] = useState(false);
  const [isExperienceDropdownOpen, setIsExperienceDropdownOpen] =
    useState(false);
  const [isStatusMainChecked, setStatusMainChecked] = useState(false);
  const [isTechMainChecked, setTechMainChecked] = useState(false);
  const [isExperienceMainChecked, setIsExperienceMainChecked] = useState(false);
  const [selectedAdminOptions, setSelectedAdminOptions] = useState([]);
  const [selectedCustomerOptions, setSelectedCustomerOptions] = useState([]);
  const [selectedSuperadminOptions, setSelectedSuperadminOptions] = useState(
    []
  );

  useEffect(() => {
    if (!isStatusMainChecked) setSelectedAdminOptions([]);
    if (!isTechMainChecked) setSelectedCustomerOptions([]);
    if (!isExperienceMainChecked) setSelectedSuperadminOptions([]);
  }, [isStatusMainChecked, isTechMainChecked, isExperienceMainChecked]);

  const handleStatusMainToggle = () => {
    setStatusMainChecked(!isStatusMainChecked);
    setSelectedAdminOptions(isStatusMainChecked ? [] : [...adminOptions]);
  };

  const handleTechMainToggle = () => {
    setTechMainChecked(!isTechMainChecked);
    setSelectedCustomerOptions(isTechMainChecked ? [] : [...customerOptions]);
  };

  const handleExperienceMainToggle = () => {
    setIsExperienceMainChecked(!isExperienceMainChecked);
    setSelectedSuperadminOptions(
      isExperienceMainChecked ? [] : [...superadminOptions]
    );
  };

  const handleStatusOptionToggle = (option) => {
    const selectedIndex = selectedAdminOptions.indexOf(option);
    if (selectedIndex === -1) {
      setSelectedAdminOptions([...selectedAdminOptions, option]);
    } else {
      const updatedOptions = [...selectedAdminOptions];
      updatedOptions.splice(selectedIndex, 1);
      setSelectedAdminOptions(updatedOptions);
    }
  };

  const handleTechOptionToggle = (option) => {
    const selectedIndex = selectedCustomerOptions.indexOf(option);
    if (selectedIndex === -1) {
      setSelectedCustomerOptions([...selectedCustomerOptions, option]);
    } else {
      const updatedOptions = [...selectedCustomerOptions];
      updatedOptions.splice(selectedIndex, 1);
      setSelectedCustomerOptions(updatedOptions);
    }
  };

  const handleExperienceOptionToggle = (option) => {
    const selectedIndex = selectedSuperadminOptions.indexOf(option);
    if (selectedIndex === -1) {
      setSelectedSuperadminOptions([...selectedSuperadminOptions, option]);
    } else {
      const updatedOptions = [...selectedSuperadminOptions];
      updatedOptions.splice(selectedIndex, 1);
      setSelectedSuperadminOptions(updatedOptions);
    }
  };

  const adminOptions = ["Bachelor of Arts (BA)", "Bachelor of Science (BSc)"];

  const superadminOptions = ["0-1 years", "1-2 years"];

  const customerOptions = ["Python", "Java", "SQL"];

  return (
    <div
      className="absolute top-12 w-72 text-sm bg-white border right-0 z-30 overflow-y-scroll"
      style={{
        top: "40.3%",
        visibility: isOpen ? "visible" : "hidden",
        transform: isOpen ? "" : "translateX(50%)",
        height: isOpen ? "calc(100vh - 30%)" : "auto",
      }}
    >
      <div className="p-2">
        <h2 className="text-lg shadow font-bold p-2 mb-4">Filter</h2>
        <div className="flex justify-between">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5"
                checked={isStatusMainChecked}
                onChange={handleStatusMainToggle}
              />
              <span className="ml-3 font-bold">Admin</span>
            </label>
          </div>
        </div>

        <div className="flex mt-2 justify-between">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5"
                checked={isExperienceMainChecked}
                onChange={handleExperienceMainToggle}
              />
              <span className="ml-3 font-bold">SuperAdmin</span>
            </label>
          </div>
        </div>

        <div className="flex mt-2 justify-between">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5"
                checked={isTechMainChecked}
                onChange={handleTechMainToggle}
              />
              <span className="ml-3 font-bold">Customer</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const Users = () => {

 
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchlocationsData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };
    fetchlocationsData();
  }, []);
  const navigate = useNavigate();

  const handleUserClick = (users) => {
    navigate("/userprofiledetails", { state: { Users: users } });
  };
  const [userToEdit, setUserToEdit] = useState(null);
  const handleEditClick = (users) => {
    setUserToEdit(users);
    setSidebarOpen1(true);
    setActionViewMore(null); 
  };

  const handleclose = () => {
    setSelectedUser(false);
    setActionViewMore(false);
    setSidebarOpen(false); // Close the sidebar
    setSidebarOpen1(false); // Close the edit user sidebar
  };

 
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    console.log("Search query:", event.target.value);
  };

  const FilteredData = () => {
    if (!Array.isArray(userData)) return [];
    return userData.filter((users) => {
      const fieldsToSearch = [
        users.Firstname,
        users.UserId,
        users.Phone,
        users.Email,
        users.LinkedinUrl,
      ];

      return fieldsToSearch.some(
        (field) =>
          field !== undefined &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(FilteredData().length / rowsPerPage);
  const [activeArrow, setActiveArrow] = useState(null);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setActiveArrow("next");
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setActiveArrow("prev");
    }
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, userData.length);
  const currentFilteredRows = FilteredData()
    .slice(startIndex, endIndex)
    .reverse();

  const [tableVisible] = useState(true);
  const [viewMode, setViewMode] = useState("list");

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const openPopup = (users) => {
    setSelectedUser(users);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    document.title = "Users Tab";
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarOpen1, setSidebarOpen1] = useState(false);

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  const handleOutsideClick = useCallback((event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      closeSidebar();
    }
  }, []);

  const toggleSidebar1 = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar1 = () => {
    setSidebarOpen1(false);
  };
  const handleOutsideClickk = useCallback((event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      closeSidebar1();
    }
  }, []);
  const [actionViewMore, setActionViewMore] = useState(null);

  const handleMoreClick = (usersId) => {
    setActionViewMore(usersId === actionViewMore ? null : usersId);
  };

  return (
    <>
      <div className="flex justify-between mt-5">
        <div>
          <p className="text-2xl font-semibold ml-5">Users</p>
        </div>

        <div onClick={toggleSidebar} className="mr-6">
          <span className="p-2 px-5 w-fit text-xl font-semibold border shadow rounded-3xl">
            Add User
          </span>
        </div>
      </div>

      <div className="container mx-auto mb-5 mt-16 mr-14">
        <div className="mx-3">
          <div className="flex items-center justify-between">
            <div className="flex"></div>
            <div className="flex items-center -mt-10">
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
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="pl-10 pr-12"
                  />
                </div>
              </div>
              <div>
                <span className="p-2 text-xl mr-2">
                  {currentPage + 1}/{totalPages}
                </span>
              </div>
              <div className="flex">
                <Tooltip
                  title="Previous"
                  enterDelay={300}
                  leaveDelay={100}
                  arrow
                >
                  <span
                    className={`border-2 p-2 mr-2 text-2xl ${
                      currentPage === 0 ? "cursor-not-allowed" : ""
                    } ${activeArrow === "prev" ? "text-blue-500" : ""}`}
                    onClick={currentPage === 0 ? null : prevPage}
                  >
                    <IoIosArrowBack />
                  </span>
                </Tooltip>
                <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
                  <span
                    className={`border-2 p-2 text-2xl ${
                      currentPage === totalPages - 1 ? "cursor-not-allowed" : ""
                    } ${activeArrow === "next" ? "text-blue-500" : ""}`}
                    onClick={currentPage === totalPages - 1 ? null : nextPage}
                  >
                    <IoIosArrowForward />
                  </span>
                </Tooltip>
              </div>
              <div className="ml-4 text-2xl border-2 rounded-md p-2">
                <Tooltip title="Filter" enterDelay={300} leaveDelay={100} arrow>
                  <span
                    onClick={userData.length === 0 ? null : toggleMenu}
                    style={{
                      opacity: userData.length === 0 ? 0.2 : 1,
                      pointerEvents: userData.length === 0 ? "none" : "auto",
                    }}
                  >
                    <FaFilter
                      className={`${isMenuOpen ? "text-blue-500" : ""}`}
                    />
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {tableVisible && (
          <div>
            {viewMode === "list" ? (
              <div className="flex">
                <div
                  className="flex-grow"
                  style={{ marginRight: isMenuOpen ? "290px" : "0" }}
                >
                  <div className="relative">
                    <table className="text-left w-full border-collapse border-gray-300">
                      <thead className="text-xs border-t border-b bg-gray-300">
                        <tr>
                          <th scope="col" className="py-3 px-6">
                            Name
                          </th>
                          <th scope="col" className="py-3 px-6">
                            User ID
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Email
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Phone
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Linkedin URL
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentFilteredRows.map((users, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-6">
                              <span
                                onClick={() => handleUserClick(users)}
                                className="cursor-pointer text-blue-500"
                              >
                                {users.Firstname}
                              </span>
                            </td>
                            <td className="py-3 px-6">{users.UserId}</td>
                            <td className="py-3 px-6">{users.Email}</td>
                            <td className="py-3 px-6">{users.Phone}</td>
                            <td className="py-3 px-6">
                              <a
                                href={users.LinkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {users.LinkedinUrl}
                              </a>
                            </td>
                            <td className="py-3 px-6 relative">
                              <button
                                onClick={() => handleMoreClick(users.UserId)}
                              >
                                <MdMoreHoriz className="text-3xl" />
                              </button>
                              {actionViewMore === users.UserId && (
                                <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2">
                                  <div className="space-y-1">
                                    <p
                                      className="hover:bg-gray-200 p-1 rounded pl-3"
                                      onClick={() => handleUserClick(users)}
                                    >
                                      View
                                    </p>
                                    <p
                                      className="hover:bg-gray-200 p-1 rounded pl-3"
                                      onClick={() => handleEditClick(users)}
                                    >
                                      Edit
                                    </p>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <OffcanvasMenu
                  isOpen={isMenuOpen}
                  closeOffcanvas={toggleMenu}
                />
              </div>
            ) : (
              <div>{/* Kanban view implementation */}</div>
            )}
          </div>
        )}
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onOutsideClick={handleOutsideClick}
        ref={sidebarRef}
      />

      <Sidebar1
        isOpen={sidebarOpen1}
        onClose={closeSidebar1}
        onOutsideClick={handleOutsideClickk}
        ref={sidebarRef}
        user={userToEdit}
      />
      {selectedUser && <UserProfileDetails users={selectedUser} />}

      {selectedUser && <EditUser onClose={handleclose} users={selectedUser} />}
    </>
  );
};

export default Users; // {f} //
