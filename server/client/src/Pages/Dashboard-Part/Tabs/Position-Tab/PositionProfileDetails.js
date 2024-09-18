import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { GrSchedulePlay } from "react-icons/gr";
import { useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { TbFoldersOff } from "react-icons/tb";
import EditPositionForm from "./Editpositionform";
import axios from "axios";
import { MdMoreHoriz } from "react-icons/md";
import { MdOutlineImageNotSupported } from "react-icons/md";

const PositionProfileDetails = ({ position, onCloseprofile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const position = useMemo(() => location.state?.position || {}, [location.state?.position]);

  // useEffect(() => {
  //   console.log("Position data of me is :", position);
  // }, [position]);

  // const handleNavigate = () => {
  //   navigate("/position", { state: { position } });
  // };

  const [activeTab, setActiveTab] = useState("position");
  const [searchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [candidateData, setCandidateData] = useState([]);

  useEffect(() => {
    const fetchCandidateData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/candidate`);
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
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, []);


  const FilteredData = () => {
    return candidateData.filter(
      (user) =>
        (user.name && user.name.includes(searchQuery)) ||
        (user.id && user.id.includes(searchQuery)) ||
        (user.email && user.email.includes(searchQuery)) ||
        (user.skills && user.skills.includes(searchQuery)) ||
        (user.phoneNumber && user.phoneNumber.includes(searchQuery))
    );
  };

  const currentFilteredRows = FilteredData();

  const trFontstyle = {
    fontSize: "13px",
  };
  const Navigate = useNavigate();

  const scheduling = () => {
    Navigate("/scheduletype_save");
  };

  const [currentPage] = useState(0);
  const rowsPerPage = 5;

  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, candidateData.length);
  const currentRows = currentFilteredRows.slice(startIndex, endIndex).reverse();
  const closeModalAndNavigate = () => {
    navigate("/position");
  };

  const [showMainContent, setShowMainContent] = useState(true);
  const [showNewCandidateContent, setShowNewCandidateContent] = useState(false);

  const handleEditClick = (position) => {
    setShowMainContent(false);
    setShowNewCandidateContent(position);
  };
  const handleclose = () => {
    setShowMainContent(true);
    setShowNewCandidateContent(false);
  };


  const [filteredCandidates, setFilteredCandidates] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "candidate") {
      console.log("Position title:", position.title);
      console.log("Candidate data:", candidateData);

      // Log each candidate object to inspect its structure
      candidateData.forEach((candidate, index) => {
        console.log(`Candidate ${index}:`, candidate);
      });

      // Assuming the correct property name is 'Position' or 'position'
      const filtered = candidateData.filter(
        (candidate) => candidate.Position === position.title || candidate.position === position.title
      );
      setFilteredCandidates(filtered);
      console.log("Filtered candidates:", filtered);

    }
  };





  return (
    <>
      <div>
        {showMainContent ? (
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
                    >
                      Position
                    </span>{" "}
                    / {position.title}
                  </p>
                  <button
                    className="shadow-lg rounded-full"
                    onClick={onCloseprofile}
                  >
                    <MdOutlineCancel className="text-2xl" />
                  </button>
                </div>
              </div>
              <div>
                <div className="mx-14 my-3">
                  <p className="text-xl space-x-10">
                    <span
                      className={`cursor-pointer ${activeTab === "position"
                        ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                        : "text-gray-500"
                        }`}
                      onClick={() => handleTabClick("position")}
                    >
                      Position
                    </span>
                    <span
                      className={`cursor-pointer ${activeTab === "candidate"
                        ? "text-orange-500 font-semibold pb-3 border-b-2 border-orange-500"
                        : "text-gray-500"
                        }`}
                      onClick={() => handleTabClick("candidate")}
                    >
                      Candidate
                    </span>
                  </p>
                </div>
              </div>
              {activeTab === "position" && (
                <>
                  <div className="flex float-end -mt-10">
                    <button
                      className=" text-gray-500 mr-7"
                      // onClick={handleEditClick}
                      onClick={() => handleEditClick(position)}
                    >
                      Edit
                    </button>
                  </div>
                  <div>
                    <div className="mx-16 mt-10">
                      {position ? (
                        <>
                          <div>
                            <div className="flex mb-5">
                              <div className="w-1/4">
                                <div className="font-medium">Title</div>
                              </div>
                              <div className="w-1/4">
                                <p>
                                  <span className="font-normal text-gray-500">
                                    {position.title}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex mb-5">
                              <div className="w-1/4">
                                <div className="font-medium">Company Name</div>
                              </div>
                              <div className="w-1/4">
                                <p>
                                  <span className="font-normal text-gray-500">
                                    {position.companyname}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex mb-5">
                              <div className="w-1/4">
                                <div className="font-medium">Experience</div>
                              </div>
                              <div className="w-1/4">
                                <p>
                                  <span className="font-normal text-gray-500">
                                  {position.minexperience} to {position.maxexperience} years

                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex mb-5">
                              <div className="w-1/4">
                                <div className="font-medium">
                                  Job Description
                                </div>
                              </div>
                              <div className="w-1/4">
                                <p>
                                  <span className="font-normal text-gray-500">
                                    {position.jobdescription}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex mb-10 mt-5">
                              <div className="w-1/4">
                                <div className="font-medium">
                                  Additional Notes
                                </div>
                              </div>
                              <div className="w-1/4">
                                <p>
                                  <span className="font-normal text-gray-500">
                                    {position.additionalnotes}
                                  </span>
                                </p>
                              </div>
                            </div>
                            {/* Skills */}
                            <div className="mb-5">
                              <div className="mt-4">
                                <div className="flex justify-between">
                                  <div
                                    htmlFor="experience"
                                    className="text-lg font-medium text-gray-900"
                                  >
                                    Skills
                                  </div>
                                </div>
                                <div className="mt-4 font-medium text-xs text-gray-900 dark:text-gray-400">
                                  <table className="divide-gray-200">
                                    <tbody>
                                      {position.skills.map((skillEntry, index) => (
                                        <tr key={index}>
                                          <td className="py-5 text-left w-96  text-md font-medium text-gray-500 uppercase tracking-wider">
                                            {skillEntry.skill}
                                          </td>
                                          <td className="py-5 text-left w-96  text-md font-medium text-gray-500 uppercase tracking-wider">
                                            {skillEntry.experience}
                                          </td>
                                          <td className="py-5 text-left w-96  text-md font-medium text-gray-500 uppercase tracking-wider">
                                            {skillEntry.expertise}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>

                            {/* Rounds */}
                            <div className="mb-5">
                              <div className="mt-4">
                                <div className="flex justify-between">
                                  <div
                                    htmlFor="rounds"
                                    className="text-lg font-medium text-gray-900 mr-4"
                                  >
                                    Rounds
                                  </div>
                                </div>
                                <div className="mt-4 font-medium text-xs text-gray-900 dark:text-gray-400">
                                  <table className="divide-gray-200">
                                    <tbody>
                                      {position.rounds.map((roundEntry, index) => (
                                        <tr key={index}>
                                          <td className="py-5 text-left w-96 text-md font-medium text-gray-500 uppercase tracking-wider">
                                            {roundEntry.round}
                                          </td>
                                          <td className="py-5 text-left w-96 text-md font-medium text-gray-500 uppercase tracking-wider">
                                            {roundEntry.mode}
                                          </td>
                                          <td className="py-5 text-left w-96 text-md font-medium text-gray-500 uppercase tracking-wider">
                                            {roundEntry.duration}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>


                          </div>
                        </>
                      ) : (
                        <p>No position data available.</p>
                      )}
                    </div>
                  </div>
                </>
              )}






              {activeTab === "candidate" && (
                <div>
                  <div
                    className="overflow-x-auto relative mt-6"
                    style={{ overflowX: "auto" }}
                  >
                    <table className="text-left w-full border-collapse border-gray-300">
                      {/* <thead className="text-xs border-t border-b bg-orange-50"> */}
                      <thead className="bg-gray-300 sticky top-0 z-10 text-xs">

                        <tr style={{ fontSize: "13px" }}>
                          <th scope="col" className="py-3 px-6">
                            Candidate Name
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Email
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Phone
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Higher Qualification
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Current Experience
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Skill/Technology
                          </th>
                          {/* <th scope="col" className="py-3 px-6">
                            Position
                          </th> */}
                          {/* <th scope="col" className="py-3 px-6">
                            Status
                          </th> */}
                          <th scope="col" className="py-3 px-6">
                            Action
                          </th>
                        </tr>
                      </thead>
                      {filteredCandidates.length > 0 ? (
                        <tbody>
                          {filteredCandidates.map((row, index) => (
                            <tr
                              key={index}
                              className="bg-white border-b cursor-pointer text-xs"
                            >
                              <td className="py-2 px-6 text-blue-400">
                              <div className="flex items-center gap-3">
                                    {row.imageUrl ? (
                                      <img src={row.imageUrl} alt="Candidate" className="w-7 h-7 rounded" />
                                    ) : (
                                      <MdOutlineImageNotSupported className="w-7 h-7 text-gray-900" alt="Default" />
                                    )}
                                    {row.LastName}
                                  </div>
                              </td>
                              <td className="py-2 px-6">{row.Email}</td>
                              <td className="py-2 px-6">{row.Phone}</td>
                              <td className="py-2 px-6">{row.HigherQualification}</td>
                              <td className="py-2 px-6">{row.CurrentExperience}</td>


                              <td className="py-2 px-6">
                                {row.skills.map((skillSet, index) => (
                                  <div key={index}>{skillSet.skill}</div>
                                ))}
                              </td>
                              {/* <td className="py-4 px-6 text-blue-400">
                                {row.Position}
                              </td> */}
                              {/* <td className="py-4 px-6">{row.status}</td> */}
                              <td className="py-2 px-6 relative">
                                <button >
                                  <MdMoreHoriz className="text-3xl" />
                                </button>
                                {/* {actionViewMore === candidate._id && (
                                  <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2 popup">
                                    <div className="space-y-1">
                                      <p
                                        className="hover:bg-gray-200 p-1 rounded pl-3"
                                        onClick={() => handleCandidateClick(candidate)}
                                      >
                                        View
                                      </p>
                                      <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handleEditClick(candidate)}>Edit</p>
                                      <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handlePopupClick(candidate.LastName)}>
                                        Schedule
                                      </p>
                                    </div>
                                  </div>
                                )} */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan="7" className="py-10 text-center">
                              <div className="flex flex-col items-center justify-center p-5">
                                <p className="mt-5 text-9xl"><TbFoldersOff /></p>
                                <p className="text-center text-xl font-normal">You don't have candidates yet. Create new candidate.</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              )}




            </div>
          </div>
        ) : (
          <>
            {showNewCandidateContent && (
              <EditPositionForm onClose={handleclose} candidate1={showNewCandidateContent} rounds={showNewCandidateContent.rounds} />
            )}
          </>
        )}
      </div>
    </>
  );
};
export default PositionProfileDetails;
