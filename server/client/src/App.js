import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './Pages/Dashboard-Part/Dashboard/Home.jsx'
import Navbar from './Components/Navbar/Navbar-Sidebar.jsx'
import Assessment from "./Pages/Dashboard-Part/Tabs/Assessment-Tab/Assessment.jsx";
import Analytics from "./Pages/Dashboard-Part/Tabs/Analytics-Tab/Analytics.jsx";
import Candidate from "./Pages/Dashboard-Part/Tabs/Candidate-Tab/Candidate.jsx";
import Position from "./Pages/Dashboard-Part/Tabs/Position-Tab/Position.jsx"
import Billing from "./Pages/Dashboard-Part/Tabs/Billing-Tab/Billing.jsx";
import QuestionBank from './Pages/Dashboard-Part/Tabs/QuestionBank-Tab/QuestionBank.jsx';
import Settingssidebar from './Pages/Dashboard-Part/Tabs/Settings-Tab/Settings.jsx';
import NewAssessment from './Pages/Dashboard-Part/Tabs/Assessment-Tab/NewAssessment.jsx';
import Interviewcq from './Pages/Dashboard-Part/Tabs/QuestionBank-Tab/QuestionBank-Form.jsx';
import CreateCandidate from './Pages/Dashboard-Part/Tabs/Candidate-Tab/CreateCandidate.jsx';
import Team from "./Pages/Dashboard-Part/Tabs/Team-Tab/Team.jsx";
import CreateTeams from "./Pages/Dashboard-Part/Tabs/Team-Tab/CreateTeams.jsx";
import PositionProfileDetails from './Pages/Dashboard-Part/Tabs/Position-Tab/PositionProfileDetails.js';
import Internalinterview from './Pages/Dashboard-Part/Tabs/Interviews/Internal-interviews.jsx'
import Outsourceinterview from './Pages/Dashboard-Part/Tabs/Interviews/Outsource-interviews.jsx'
import AppViewMore from './Pages/Dashboard-Part/Dashboard/AppViewMore';
// settings
import Profile from './Pages/Dashboard-Part/Tabs/Settings-Tab/Profile.jsx';
import Availability from './Pages/Dashboard-Part/Tabs/Settings-Tab/Availability.jsx';
import Billingdetails from './Pages/Dashboard-Part/Tabs/Settings-Tab/Billing_details.jsx';
import Invoice from './Pages/Dashboard-Part/Tabs/Settings-Tab/Invoice.jsx';
//Login
import Login1 from './Pages/Login-Part/Login-1.jsx';
import Login2 from './Pages/Login-Part/Login-2.jsx';
import Login3 from './Pages/Login-Part/Login-3.jsx';
import Login4 from './Pages/Login-Part/Login-4.jsx';

import CandidateProfileDetails from './Pages/Dashboard-Part/Tabs/Candidate-Tab/CandidateProfileDetails.js';
import Schedulenow from './Pages/Dashboard-Part/Tabs/Interviews/Schedulenow.jsx'
import TeamProfileDetails from './Pages/Dashboard-Part/Tabs/Team-Tab/TeamProfileDetails.js'
import InterviewProfileDetails from './Pages/Dashboard-Part/Tabs/QuestionBank-Tab/QuestionBankProfileDetails.jsx'
import AssessmentProfileDetails from './Pages/Dashboard-Part/Tabs/Assessment-Tab/Assessmentprofiledetails.jsx';
import OutsourceOption from './Pages/Dashboard-Part/Tabs/Interviews/OutsourceOption.jsx'
import EditCandidate from './Pages/Dashboard-Part/Tabs/Candidate-Tab/EditCandidate.jsx';
import EditAssessment from './Pages/Dashboard-Part/Tabs/Assessment-Tab/EditAssessment.jsx';
import EditTeam from './Pages/Dashboard-Part/Tabs/Team-Tab/EditTeam.jsx'
import EditQuestion from './Pages/Dashboard-Part/Tabs/QuestionBank-Tab/EditQuestionform.jsx'
import Editpositionform from './Pages/Dashboard-Part/Tabs/Position-Tab/Editpositionform.jsx'
import Notifications from './Pages/Dashboard-Part/Dashboard/Notifications.jsx'
import Editinternallater from './Pages/Dashboard-Part/Tabs/Interviews/Edit-Internal-later.jsx'
import MockInterview from './Pages/Dashboard-Part/Tabs/MockInterview/MockInterview.jsx';
import MockProfileDetails from './Pages/Dashboard-Part/Tabs/MockInterview/MockProfileDetails.jsx';
import NewInterviewViewPage from './Pages/Dashboard-Part/Dashboard/NewInterviewViewPage.jsx';
import NewInterviewRequest from './Pages/Dashboard-Part/Dashboard/NewInterviewRequest.jsx';
import Internalprofiledetails from './Pages/Dashboard-Part/Tabs/Interviews/Internalprofiledetails.js'
// Assessment test
import AssessmentTest from './Pages/Dashboard-Part/Tabs/AssessmentTest-Tab/AssessmentTest.jsx';
import AssessmentText from './Pages/Dashboard-Part/Tabs/AssessmentTest-Tab/AssessementQuestion.jsx';
import AssessmentSubmit from './Pages/Dashboard-Part/Tabs/AssessmentTest-Tab/AssessmentSubmit.jsx';
// Start Interviews
import CandidateVC from './Pages/Dashboard-Part/Tabs/StartInterview-Tab/CandidateCV.jsx'
import VideoCallButton from './Pages/Dashboard-Part/Tabs/StartInterview-Tab/VideoCallButton.jsx';

import MasterData from './Pages/Dashboard-Part/Dashboard/MasterData.jsx';
import Users from './Pages/Dashboard-Part/Dashboard/Users.jsx';
import Contact from './Pages/Dashboard-Part/Dashboard/Contact.jsx';
import UserProfileDetails from './Pages/Dashboard-Part/Dashboard/UserProfileDetails.jsx';
import ContactProfileDetails from './Pages/Dashboard-Part/Dashboard/ContactProfileDetails.jsx';
import Inquirydesk from './Pages/Dashboard-Part/Dashboard/Inquirydesk.jsx';

import Admin from './Pages/Login-Part/Admin.jsx';
import NoFreelancer from './Pages/Login-Part/NoFreelancer.jsx';
import Callback from './Callback.js';
import JitsiMeeting from './jitsimeetingstart.jsx';

const App = () => {
  const location = useLocation();
  const shouldRenderNavbar = !['/', '/profile1', '/profile2', '/profile3', '/profile4', '/assessmenttest', '/assessmenttext', '/assessmentsubmit', '/candidatevc', '/admin', '/nofreelance', '/callback', '/jitsimeetingstart'].includes(location.pathname);
  const pathsWithSidebar = ['/profile', '/availability', '/billing_details', '/invoice'];
  const isNavbarHidden = !shouldRenderNavbar;

  // useEffect(() => {
  //   const checkUserExistence = async () => {
  //     if (isAuthenticated && user) {
  //       try {
  //         const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${user.sub}`);
  //         if (response.data) {
  //           navigate('/home');
  //         } else {
  //           if (!['/', '/profile1'].includes(location.pathname)) {
  //             navigate('/profile4');
  //           }
  //         }
  //       } catch (error) {
  //         console.error('Error checking user existence:', error);
  //       }
  //     }
  //   };

  //   if (!['/', '/profile1', '/profile2', '/profile3'].includes(location.pathname)) {
  //     checkUserExistence();
  //   }
  // }, [isAuthenticated, user, navigate, location.pathname]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  // useEffect(() => {
  //   // Fetch the user role from the backend
  //   const fetchUserRole = async () => {
  //     try {
  //       const response = await fetch('/api/users/role', {
  //         headers: {
  //           'Authorization': 'Bearer ' + localStorage.getItem('token')
  //         }
  //       });
  //       const data = await response.json();
  //       setUserRole(data.role);
  //     } catch (error) {
  //       console.error('Error fetching user role:', error);
  //     }
  //   };

  //   fetchUserRole();
  // }, []);
  const [roomName, setRoomName] = useState('SampleRoom');
  const [displayName, setDisplayName] = useState('John Doe');
  // const [jwtToken, setJwtToken] = useState('eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMDE5YWY1YjhlOWM3NGY0MmE0NDk0N2VlMGMwODU3MmQvYzZiYzBmLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3MjUzNjczNDAsImV4cCI6MTcyNTM3NDU0MCwibmJmIjoxNzI1MzY3MzM1LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMDE5YWY1YjhlOWM3NGY0MmE0NDk0N2VlMGMwODU3MmQiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImFzaHJhZnNoYWlrMjUwIiwiaWQiOiJnb29nbGUtb2F1dGgyfDExMTQ5NjEwNzE0OTQwNDU2MDIzNSIsImF2YXRhciI6IiIsImVtYWlsIjoiYXNocmFmc2hhaWsyNTBAZ21haWwuY29tIn19LCJyb29tIjoiKiJ9.DSat0QMav-gbIRq7Wf5vBT6MpE4l7YWQAEdmyzFhzSbIVcF9Q8XlTXYT7D4TCUWGbeVp7nAmUeyiINSChOZ1AFuTvuEaFBZz6VT0xFzj2UL1aew0bv9DbXBtPcCSY2flJ2dOntwy3yffJ9FOiqFVpIUvvspBm-TRa0HEpod03o9Gs4DpTKHQp5he8e_UdKVrN-aqSC-I4fepqlhtKd9rQ6W5COIVW4UOYrdVTUufEuWcoFlLa2XF6TN92h2FZRp2VVBlxhrFdew59Qw6Oe9pHiJ3SzEfjo96TMbrcgPdV71I_5KJT-n0TXxD4RdAF6oUZ6XyZ61-VEPasqWlCcgjHA');
  return (
    <React.Fragment>
      {shouldRenderNavbar && <Navbar />}
      {pathsWithSidebar.includes(location.pathname) && <Settingssidebar />}
      <div className={isNavbarHidden ? '' : 'mt-28'}>
        <Routes>
          {/* login */}
          <Route path="/" element={<Login1 />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/nofreelance" element={<NoFreelancer />} />
          <Route path="/profile1" element={<Login2 />} />
          <Route path="/profile3" element={<Login3 />} />
          <Route path="/profile4" element={<Login4 />} />
          {/* home */}
          <Route path="/AppViewMore" element={<AppViewMore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/home" element={<Home />} />
          {/* candidate */}
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/create-new-candidate" element={<CreateCandidate />} />
          <Route path="/candidate-profile-details" element={<CandidateProfileDetails />} />
          <Route path="/edit-candidate" element={<EditCandidate />} />
          {/* position */}
          <Route path="/position" element={<Position />} />
          <Route path="/position-profile-details" element={<PositionProfileDetails />} />
          <Route path="/edit-position" element={<Editpositionform />} />
          {/* teams */}
          <Route path="/team" element={<Team />} />
          <Route path="/create-new-team" element={<CreateTeams />} />
          <Route path="/team-profile-details" element={<TeamProfileDetails />} />
          <Route path="/edit-team" element={<EditTeam />} />
          {/* assessment */}
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/create-new-assessment" element={<NewAssessment />} />
          <Route path="/assessment-profile-details" element={<AssessmentProfileDetails />} />
          <Route path="/edit-assessment" element={<EditAssessment />} />
          {/* Question Bank */}
          <Route path="/edit-question" element={<EditQuestion />} />
          {/* Assessment Test */}
          <Route path="/assessmenttest" element={<AssessmentTest />} />
          <Route path="/assessmenttext" element={<AssessmentText />} />
          <Route path="/assessmentsubmit" element={<AssessmentSubmit />} />

          <Route path="/analytics" element={<Analytics />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/question-bank" element={<QuestionBank />} />  
          <Route path="/interviewcq" element={<Interviewcq />} />
          <Route path="/outsourceoption" element={<OutsourceOption />} />
          <Route path="/interview-profiledetails" element={<InterviewProfileDetails />} />
          <Route path="/schedulenow" element={<Schedulenow />} />
          <Route path="/newinterviewviewpage" element={<NewInterviewViewPage />} />
          <Route path="/newinterviewrequest" element={<NewInterviewRequest />} />
          <Route path="/internalprofiledetails" element={<Internalprofiledetails />} />
          <Route path="/internalinterview" element={<Internalinterview />} />
          <Route path="/outsourceinterview" element={<Outsourceinterview />} />
          <Route path="/editinternallater" element={<Editinternallater />} />
          <Route path="/mock-profiledetails" element={<MockProfileDetails />} />
          <Route path="/mockinterview" element={<MockInterview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/billing_details" element={<Billingdetails />} />
          <Route path="/invoice" element={<Invoice />} />
          {/* Start Interviews */}
          <Route path="/candidatevc" element={<CandidateVC />} />
          <Route path="/videocallbutton" element={<VideoCallButton />} />
          <Route path="/masterdata" element={<MasterData />} />
          <Route path="/users" element={<Users />} />
          {/* <Route path="/users" element={<ProtectedRoute element={Users} requiredRole="user" userRole={userRole} />} /> */}

          <Route path="/contact" element={<Contact />} />
          <Route path="/userprofiledetails" element={<UserProfileDetails />} />
          <Route path="/contactprofiledetails" element={<ContactProfileDetails />} />
          <Route path="/inquirydesk" element={<Inquirydesk />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/jitsimeetingstart" element={<JitsiMeeting roomName={roomName} displayName={displayName} />} />
        </Routes>
      </div>
    </React.Fragment>

  )
}

export default App
