import React, { useState } from "react";
import { useEffect } from "react";
import { TbCameraPlus } from "react-icons/tb";
import { MdUpdate } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import ImageUploading from "react-images-uploading";
import { MdArrowDropDown } from "react-icons/md";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

// {f} //
const UserForm = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState({
    FirstName: "",
    LastName: "",
    Gender: "",
    UserID: "",
    Password: "",
    EmailAddress: "",
    PhoneNumber: "",
    LinkedinURL: "",
  });

  const maxNumber = 10;

  const [images, setImages] = useState([]);
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
    setUserData((prevState) => ({
      ...prevState,
      image: imageList.length > 0 ? imageList[0].data_url : "",
    }));
  };

  const [selectedGender, setSelectedGender] = useState("");
  const [showDropdowngender, setShowDropdownGender] = useState(false);
  const genders = ["Male", "Female", "Others"];

  const toggleDropdowngender = () => {
    setShowDropdownGender(!showDropdowngender);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setShowDropdownGender(false);
    setUserData((prevUserData) => ({
      ...prevUserData,
      gender: gender,
    }));
  };

  const [errors, setErrors] = useState({ Phone: "", Email: "" });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number validation (starts with 6-9 and has 10 digits)
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "Email") {
      if (!value) {
        errorMessage = "Email is required";
      } else if (!validateEmail(value)) {
        errorMessage = "Invalid email address";
      }
    } else if (name === "Phone") {
      if (!value) {
        errorMessage = "Phone number is required";
      } else if (!validatePhone(value)) {
        errorMessage = "Invalid phone number";
      }
    }

    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      handleChange(e);
    }
  };

  const handleCountryCodeChange = (e) => {
    setUserData({ ...userData, CountryCode: e.target.value });
  };

  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };


  // role//

  const [selectedCurrentRole, setSelectedCurrentRole] = useState("");
  const [showDropdownCurrentRole, setShowDropdownCurrentRole] = useState(false);
  const [currentroleError, setCurrentroleError] = useState("");
  const [CurrentRole, setCurrentRole] = useState([]);
  const [searchTermCurrentRole, setSearchTermCurrentRole] = useState("");
  const filteredCurrentRoles = CurrentRole.filter((role) =>
    role.RoleName.toLowerCase().includes(searchTermCurrentRole.toLowerCase())
  );

  const toggleCurrentRole = () => {
    setShowDropdownCurrentRole(!showDropdownCurrentRole);
  };

  useEffect(() => {
    const fetchsetcurrentrolesData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/roles");
        setCurrentRole(response.data);
      } catch (error) {
        console.error("Error fetching roles data:", error);
      }
    };
    fetchsetcurrentrolesData();
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedCurrentRole(role);
    handleChange({ target: { name: 'CurrentRole', value: role } });
    setShowDropdownCurrentRole(false);
  };


  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-15 z-50 ${isOpen ? "visible" : "invisible"
          }`}
      >
        <div
          className={`fixed inset-y-0 right-0 z-50 w-1/2 bg-white shadow-lg transition-transform duration-5000 transform ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="fixed top-0 w-full bg-white border-b">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-xl font-bold">New User</h2>
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
          <div className="fixed top-16 bottom-16 overflow-auto p-5 text-sm">
            <form>
              <div className="grid grid-cols-4">
                <div className="col-span-3">
                  <div className="flex gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="FirstName"
                        className="block text-sm font-medium leading-6 text-gray-900 w-36"
                      >
                        First Name
                      </label>
                    </div>
                    <div className="flex-grow">
                      <input
                        type="text"
                        name="FirstName"
                        id="FirstName"
                        value={userData.FirstName}
                        autoComplete="given-name"
                        className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="LastName"
                        className="block text-sm font-medium leading-6 text-gray-900 w-36"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="flex-grow">
                      <input
                        type="text"
                        name="LastName"
                        id="LastName"
                        autoComplete="family-name"
                        value={userData.LastName}
                        className="border-b focus:outline-none mb-5 w-full"
                      />
                    </div>
                  </div>

                  <div className="flex gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium leading-6 text-gray-900  w-36"
                      >
                        Gender <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="relative flex-grow">
                      <div className="relative">
                        <input
                          type="text"
                          className="border-b border-gray-300 focus:border-black focus:outline-none mb-5 w-full"
                          id="gender"
                          value={selectedGender}
                        />

                        <div
                          className="absolute right-0 top-0"
                          onClick={toggleDropdowngender}
                        >
                          <MdArrowDropDown className="text-lg text-gray-500 mt-1 cursor-pointer" />
                        </div>
                      </div>
                      {showDropdowngender && (
                        <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                          {genders.map((gender) => (
                            <div
                              key={gender}
                              className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleGenderSelect(gender)}
                            >
                              {gender}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="userid"
                        className="block text-sm font-medium leading-6 text-gray-900 w-36"
                      >
                        User ID <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div style={{ position: "relative" }} className="flex-grow">
                      <div className="border-b border-gray-300 mt-5  mb-5 w-full"></div>
                    </div>
                  </div>

                  <div className="flex gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900  w-36"
                      >
                        Password
                        <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="relative flex-grow">
                      <div className="relative">
                        <input
                          className="border-b focus:outline-none mb-5 w-full"
                          type="text"
                        //   value={selectedQualification}
                        />
                      </div>
                    </div>
                  </div>

                  {/* email */}
                  <div className="flex gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="Email"
                        className="block text-sm font-medium leading-6 text-gray-900 w-36"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="flex-grow">
                      <input
                        type="text"
                        name="Email"
                        id="email"
                        value={userData.Email}
                        onChange={handleChange}
                        placeholder="candidate@gmail.com"
                        autoComplete="email"
                        className={`border-b focus:outline-none mb-5 w-full ${errors.Email
                            ? "border-red-500"
                            : "border-gray-300 focus:border-black"
                          }`}
                      />
                      {errors.Email && (
                        <p className="text-red-500 text-sm -mt-4">
                          {errors.Email}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* phone */}
                  <div className="flex gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="Phone"
                        className="block text-sm font-medium leading-6 text-gray-900 w-36"
                      >
                        Phone <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="flex-grow">
                      <div className="flex">
                        <select
                          name="CountryCode"
                          id="CountryCode"
                          value={userData.CountryCode}
                          onChange={handleCountryCodeChange}
                          className="border-b focus:outline-none mb-5 w-1/4 mr-2"
                        >
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
                          value={userData.Phone}
                          onChange={handlePhoneInput}
                          autoComplete="tel"
                          placeholder="XXX-XXX-XXXX"
                          className={`border-b focus:outline-none mb-5 w-full ${errors.Phone
                              ? "border-red-500"
                              : "border-gray-300 focus:border-black"
                            }`}
                        />
                      </div>
                      {errors.Phone && (
                        <p className="text-red-500 text-sm -mt-4">
                          {errors.Phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="linkedin"
                        className="block text-sm font-medium leading-6 text-gray-900 w-36"
                      >
                        Linkedin URL
                        <span className="text-red-500">*</span>
                      </label>
                    </div>

                    <div className="relative flex-grow">
                      <div className="relative">
                        <input
                          type="text"
                          className="border-b focus:outline-none mb-5 w-full "
                        //   value={selectedCollege}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="profile"
                        className="block text-sm font-medium leading-6 text-gray-900 w-36"
                      >
                        Profile
                        <span className="text-red-500">*</span>
                      </label>
                    </div>

                    <div className="relative flex-grow">
                      <div className="relative">
                        <select
                          id="profile"
                          className="border-b focus:outline-none mb-5 w-full"
                        // value={selectedCollege}
                        >
                          <option value=""></option>
                          <option value="option1">Admin</option>
                          <option value="option2">Super Admin</option>
                          {/* Add more options as needed */}
                        </select>
                      </div>
                    </div>
                  </div>


                  {/* Current Role */}
                  <div className="flex gap-5 mb-5">
                    <label
                      htmlFor="CurrentRole"
                      className="block text-sm font-medium leading-6 text-gray-900 w-36"
                    >
                      Role
                    </label>
                    <div className="relative w-80">
                      <input
                        name="CurrentRole"
                        type="text"
                        id="CurrentRole"
                        value={selectedCurrentRole}
                        onClick={toggleCurrentRole}
                        className={`border-b ${currentroleError
                            ? "border-red-500"
                            : "border-gray-300"
                          } border-b focus:outline-none mb-5 w-full`}
                        readOnly
                      />
                      {currentroleError && (
                        <p className="text-red-500 text-sm -mt-4">
                          {currentroleError}
                        </p>
                      )}
                      {showDropdownCurrentRole && (
                        <div className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto z-10">
                          <div className="flex items-center border-b p-2">
                            <FaSearch className="absolute left-2 text-gray-500" />
                            <input
                              type="text"
                              placeholder="Search Current Role"
                              value={searchTermCurrentRole}
                              onChange={(e) =>
                                setSearchTermCurrentRole(e.target.value)
                              }
                              className="pl-8  focus:border-black focus:outline-none w-full"
                            />
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
                            <div className="p-2 text-gray-500">
                              No roles found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="timezone"
                        className="block text-sm font-medium leading-6 text-gray-900 w-36"
                      >
                        Time Zone
                        <span className="text-red-500">*</span>
                      </label>
                    </div>

                    <div className="relative flex-grow">
                      <div className="relative">
                        <input
                          type="text"
                          className="border-b focus:outline-none mb-5 w-full "
                        //   value={selectedCollege}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 mb-5">
                    <div className="flex gap-5">
                      <div>
                        <label
                          htmlFor="language"
                          className="block text-sm font-medium leading-6 text-gray-900 w-36"
                        >
                          Language
                          <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="relative flex-grow">
                        <div className="relative">
                          <select
                            id="language"
                            className="border-b focus:outline-none mb-5 w-full"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                          >
                            <option value="" disabled></option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="App">
                    <ImageUploading
                      multiple
                      value={images}
                      onChange={onChange}
                      maxNumber={maxNumber}
                      dataURLKey="data_url"
                    >
                      {({
                        imageList,
                        onImageUpload,
                        onImageUpdate,
                        onImageRemove,
                      }) => (
                        <div className="upload__image-wrapper">
                          {imageList.length === 0 && (
                            <button onClick={onImageUpload}>
                              <div className="border-2 p-10 rounded-md ml-5 mr-2 mt-2">
                                <span style={{ fontSize: "40px" }}>
                                  <TbCameraPlus />
                                </span>
                              </div>
                            </button>
                          )}
                          {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                              <div className="image-item__btn-wrapper">
                                <div className="border-2 rounded-md mt-2 ml-5 mr-2 relative">
                                  <img
                                    src={image["data_url"]}
                                    alt=""
                                    style={{ height: "100px" }}
                                  />
                                  <div className="absolute bottom-0 left-0">
                                    <button
                                      onClick={() => onImageUpdate(index)}
                                      className="text-white"
                                    >
                                      <MdUpdate className="text-xl ml-2 mb-1" />
                                    </button>
                                  </div>
                                  <div className="absolute bottom-0 right-0">
                                    <button
                                      onClick={() => onImageRemove(index)}
                                      className="text-white"
                                    >
                                      <ImCancelCircle className="text-xl mr-2 mb-1" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ImageUploading>
                  </div>
                </div>
              </div>

              <div className="footer-buttons flex justify-end">
                <button type="submit" className="footer-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserForm; // {f} //
