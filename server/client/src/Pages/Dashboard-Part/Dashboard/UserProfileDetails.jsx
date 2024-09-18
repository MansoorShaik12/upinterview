import React, { useState,useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import EditUser from "./EditUser";


// {f} //

const UserProfileDetails = () => {
  useEffect(() => {
    document.title = "User Profile Details";
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.Users;
  const [Users] = useState(userData);
  console.log(Users)
  const [user] = useState(userData);

  const [activeTab, setActiveTab] = useState("users");
  const handleNavigate = () => {
    navigate("/users", { state: { Users } });
  };

  const formData = location.state?.formData;
  const selectedPosition = formData?.position;

  useEffect(() => {
    const fetchPositionDetails = async () => {
      try {
        const response = await fetch(`YOUR_API_ENDPOINT/${selectedPosition}`);
        console.log(response);
      } catch (error) {
        console.error("Error fetching position details:", error);
      }
    };

    if (selectedPosition) {
      fetchPositionDetails();
    }
  }, [selectedPosition]);

  // const closeModalAndNavigate = () => {
  //   navigate("/users");
  // };
  const closeModalAndNavigate = () => {
    setShowMainContent(true);
    setShowNewUserContent(false);
    navigate("/users");
  };

  const [showMainContent, setShowMainContent] = useState(true);
  const [showNewUserContent, setShowNewUserContent] = useState(false);

  const [userToEdit, setUserToEdit] = useState(null);

  // const handleEditClick = (users) => {
  //   setShowMainContent(false);
  //   setShowNewUserContent(true);
  //   setUserToEdit(users);
  // };
  // const handleEditClick = () => {
  //   console.log("Edit button clicked");
  //   setShowMainContent(false);
  //   console.log("setShowMainContent", false)
  //   setShowNewUserContent(true);
  //   setUserToEdit(Users);
  //   console.log("showNewUserContent:", true); // Should be true
  //   console.log("userToEdit:", Users); // Should log the user data
  // };
  const handleEditClick = () => {
    setUserToEdit(Users);
    setShowMainContent(false);
    setShowNewUserContent(true);
  };
  const handleclose = () => {
    setShowMainContent(true);
    setShowNewUserContent(false);
  };
  const sidebarRef = useRef(null);




  return (
    <>
      {showMainContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white shadow-lg overflow-auto"
            style={{ width: "97%", height: "94%" }}
          >
            <div className="border-b p-2">
              <div className="mx-8 my-3 flex justify-between items-center">
                <p className="text-xl">
                  <span
                    className="text-orange-500 font-semibold cursor-pointer"
                    onClick={handleNavigate}
                  >
                    User
                  </span>{" "}
                  /{Users.Firstname}
                </p>
                {/* Cancel icon */}
                <button
                  className="shadow-lg rounded-full"
                  onClick={closeModalAndNavigate}
                >
                  <MdOutlineCancel className="text-2xl" />
                </button>
              </div>
            </div>
            <>
              <div className="flex float-end mr-10 mt-1">
                <button className=" text-gray-500 mr-20"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
              </div>
              <div className="mx-16 mt-7 grid grid-cols-4">
                <div className="col-span-3">
                  <div className="flex mb-5">
                    {/*   First Name */}
                    <div className="w-1/3">
                      <div className="font-medium">First Name</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.Name}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/* Last Name*/}
                    <div className="w-1/3">
                      <div className="font-medium">Last Name</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.Firstname}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/*  User ID */}
                    <div className="w-1/3">
                      <div className="font-medium">User ID</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.UserId}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/*  Password */}
                    <div className="w-1/3">
                      <div className="font-medium">Password</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.Password}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-5">
                    {/*  Gender */}
                    <div className="w-1/3">
                      <div className="font-medium">Gender</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.Gender}</span>
                      </p>
                    </div>
                  </div>


                  <div className="flex mb-5">
                    {/*Email Address */}
                    <div className="w-1/3">
                      <div className="font-medium">Email Address</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.Email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/* Phone Number */}
                    <div className="w-1/3">
                      <div className="font-medium">Phone Number</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.Phone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/*  Linkedin URL */}
                    <div className="w-1/3">
                      <div className="font-medium">Linkedin URL</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.LinkedinUrl}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/* Profile*/}
                    <div className="w-1/3">
                      <div className="font-medium">Profile</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.Profile}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/*  Role */}
                    <div className="w-1/3">
                      <div className="font-medium">Role</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.Role}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/*  Time zone */}
                    <div className="w-1/3">
                      <div className="font-medium">Time Zone</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.Timezone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/*  Language */}
                    <div className="w-1/3">
                      <div className="font-medium">Language</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{Users.Language}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <div>
                    <div className="flex justify-end text-center mt-3">
                      <div>
                        <img className="w-32 h-32" src={Users.image} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      )
      }
      {showNewUserContent && (
        <EditUser 
        isOpen={showNewUserContent} 
        onClose={handleclose}
          user={userToEdit}
    
          />
      )}
    </>
  );
};

export default UserProfileDetails;  // {f} //
