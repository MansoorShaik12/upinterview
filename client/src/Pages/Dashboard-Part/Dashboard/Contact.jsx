import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import { MdMoreHoriz } from "react-icons/md";
import ContactProfileDetails from "./ContactProfileDetails";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Contact = () => {
  const [contactData, setContactData] = useState([]);
  useEffect(() => {
    const fetchsetContactData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contacts');
        setContactData(response.data);
      } catch (error) {
        console.error('Error fetching roles data:', error);
      }
    };
    fetchsetContactData();
  }, []);

  const navigate = useNavigate();

  const handleContactClick = (Contact) => {
    navigate("/contactprofiledetails", { state: { Contacts:Contact } });
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const FilteredData = () => {
    if (!Array.isArray(contactData)) return [];
    return contactData.filter((contact) => {
      const fieldsToSearch = [
        contact.Name,
        contact.UserID,
        contact.Phone,
        contact.Email,
        contact.LinkedinURL,
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
  const endIndex = Math.min(startIndex + rowsPerPage, FilteredData().length);
  const currentFilteredRows = FilteredData().slice(startIndex, endIndex);

  const [tableVisible] = useState(true);
  const [viewMode, setViewMode] = useState("list");

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [actionViewMore, setActionViewMore] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const openPopup = (Contact) => {
    setSelectedContact(Contact);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setSelectedContact(null);
  };

  const handleMoreClick = (usersId) => {
    setActionViewMore(usersId === actionViewMore ? null : usersId);
  };

  // const handleUserClick = (Contact) => {
  //   navigate("/contactprofiledetails", { state: {Contact } });
  // };

  const handleEditClick = (users) => {
    // setSidebarOpen(true);
    setActionViewMore(null); // Close the action menu
  };

  return (
    <>
      <div className="flex justify-between">
        <p className="text-2xl font-semibold ml-5">Contacts</p>
      </div>

      <div className="container mx-auto mb-5">
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
                    onClick={contactData.length === 0 ? null : toggleMenu}
                    style={{
                      opacity: contactData.length === 0 ? 0.2 : 1,
                      pointerEvents: contactData.length === 0 ? "none" : "auto",
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
                            Current Role
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Industry
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Years Of Experience
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
                        {currentFilteredRows.map((Contact, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-6">
                              <span
                                onClick={() => handleContactClick(Contact)}
                                className="cursor-pointer text-blue-500"
                              >
                                {Contact.Name}
                              </span>
                            </td>
                            <td className="py-3 px-6">{Contact.CurrentRole}</td>
                            <td className="py-3 px-6">{Contact.industry}</td>
                            <td className="py-3 px-6">{Contact.Experience}</td>
                            <td className="py-3 px-6">
                              <a
                                href={Contact.LinkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {Contact.LinkedinUrl}
                              </a>
                            </td>
                            <td className="py-3 px-6 relative">
                              <button
                                onClick={() => handleMoreClick(Contact.UserId)}
                              >
                                <MdMoreHoriz className="text-3xl" />
                              </button>
                              {actionViewMore === Contact.UserId && (
                                <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2">
                                  <div className="space-y-1">
                                    <p
                                      className="hover:bg-gray-200 p-1 rounded pl-3 cursor-pointer"
                                      onClick={() => handleContactClick(Contact)}
                                    >
                                      View
                                    </p>
                                    <p
                                      className="hover:bg-gray-200 p-1 rounded pl-3 cursor-pointer"
                                      onClick={() => handleEditClick(Contact)}
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
              </div>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
      {selectedContact && <ContactProfileDetails candidate={selectedContact} />}
    </>
  );
};

export default Contact;
