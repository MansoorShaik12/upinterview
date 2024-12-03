import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { handleWebSocket } from './utils/dataUtils.js';
import Home from './Pages/Dashboard-Part/Dashboard/Home.jsx';
import Navbar from './Components/Navbar/Navbar-Sidebar.jsx';
import Assessment from "./Pages/Dashboard-Part/Tabs/Assessment-Tab/Assessment.jsx";
import Analytics from "./Pages/Dashboard-Part/Tabs/Analytics-Tab/Analytics.jsx";
import Candidate from "./Pages/Dashboard-Part/Tabs/Candidate-Tab/Candidate.jsx";
import Position from "./Pages/Dashboard-Part/Tabs/Position-Tab/Position.jsx";
import Billing from "./Pages/Dashboard-Part/Tabs/Billing-Tab/Billing.jsx";
import QuestionBank from './Pages/Dashboard-Part/Tabs/QuestionBank-Tab/QuestionBank.jsx';
import Settingssidebar from './Pages/Dashboard-Part/Tabs/Settings-Tab/Settings.jsx';
import App_settings from './Pages/Dashboard-Part/Tabs/App_Settings-Tab/App_settings.jsx';
import NewAssessment from './Pages/Dashboard-Part/Tabs/Assessment-Tab/NewAssessment.jsx';
import Interviewcq from './Pages/Dashboard-Part/Tabs/QuestionBank-Tab/QuestionBank-Form.jsx';
import CreateCandidate from './Pages/Dashboard-Part/Tabs/Candidate-Tab/CreateCandidate.jsx';
import Team from "./Pages/Dashboard-Part/Tabs/Team-Tab/Team.jsx";
import CreateTeams from "./Pages/Dashboard-Part/Tabs/Team-Tab/CreateTeams.jsx";
import PositionProfileDetails from './Pages/Dashboard-Part/Tabs/Position-Tab/PositionProfileDetails.js';
import Internalinterview from './Pages/Dashboard-Part/Tabs/Interviews/Internal-interviews.jsx';
import Outsourceinterview from './Pages/Dashboard-Part/Tabs/Interviews/Outsource-interviews.jsx';
import AppViewMore from './Pages/Dashboard-Part/Dashboard/AppViewMore';
import AllSharingSettings from './Pages/Dashboard-Part/Dashboard/All_Sharing_settings.jsx';
import InvoiceLine from './Pages/Dashboard-Part/Tabs/Settings-Tab/InvoiceLine.jsx';
import Price from './Pages/Login-Part/price.jsx';
import SharingSettings from './Pages/Dashboard-Part/Tabs/Settings-Tab/Sharing_settings.jsx';
// settings
import Profile from './Pages/Dashboard-Part/Tabs/Settings-Tab/Profile.jsx';
import Availability from './Pages/Dashboard-Part/Tabs/Settings-Tab/Availability.jsx';
import Billingdetails from './Pages/Dashboard-Part/Tabs/Settings-Tab/Billing_details.jsx';
import Invoice from './Pages/Dashboard-Part/Tabs/Settings-Tab/Invoice.jsx';
import UserDetails from './Pages/Dashboard-Part/Tabs/Settings-Tab/User_details.jsx';
import CompanyInfo from './Pages/Dashboard-Part/Tabs/Settings-Tab/Company_info.jsx';
import Settings from './Pages/Dashboard-Part/Tabs/Settings-Tab/Settings.jsx';
//Login
import Login1 from './Pages/Login-Part/Login-1.jsx';
import Login2 from './Pages/Login-Part/Login-2.jsx';
import Login3 from './Pages/Login-Part/Login-3.jsx';
import Login4 from './Pages/Login-Part/Login-4.jsx';

import CandidateProfileDetails from './Pages/Dashboard-Part/Tabs/Candidate-Tab/CandidateProfileDetails.js';
import Schedulelater from './Pages/Dashboard-Part/Tabs/Interviews/Schedulelater.jsx';
import Schedulenow from './Pages/Dashboard-Part/Tabs/Interviews/Schedulenow.jsx';
import TeamProfileDetails from './Pages/Dashboard-Part/Tabs/Team-Tab/TeamProfileDetails.js';
import InterviewProfileDetails from './Pages/Dashboard-Part/Tabs/QuestionBank-Tab/QuestionBankProfileDetails.jsx';
import AssessmentPopUp from './Pages/Dashboard-Part/Tabs/Assessment-Tab/Assessmentprofiledetails.jsx';
import OutsourceOption from './Pages/Dashboard-Part/Tabs/Interviews/OutsourceOption.jsx';
import EditCandidate from './Pages/Dashboard-Part/Tabs/Candidate-Tab/EditCandidate.jsx';
import EditAssessment from './Pages/Dashboard-Part/Tabs/Assessment-Tab/EditAssessment.jsx';
import EditTeam from './Pages/Dashboard-Part/Tabs/Team-Tab/EditTeam.jsx';
import EditQuestion from './Pages/Dashboard-Part/Tabs/QuestionBank-Tab/EditQuestionform.jsx';
import Editpositionform from './Pages/Dashboard-Part/Tabs/Position-Tab/Editpositionform.jsx';
import Notifications from './Pages/Dashboard-Part/Dashboard/Notifications.jsx';
import Editinternallater from './Pages/Dashboard-Part/Tabs/Interviews/Edit-Internal-later.jsx';
import MockInterview from './Pages/Dashboard-Part/Tabs/MockInterview/MockInterview.jsx';
import MockProfileDetails from './Pages/Dashboard-Part/Tabs/MockInterview/MockProfileDetails.jsx';
import NewInterviewViewPage from './Pages/Dashboard-Part/Dashboard/NewInterviewViewPage.jsx';
import NewInterviewRequest from './Pages/Dashboard-Part/Dashboard/NewInterviewRequest.jsx';
import Internalprofiledetails from './Pages/Dashboard-Part/Tabs/Interviews/Internalprofiledetails.js';
// Assessment test
import AssessmentTest from './Pages/Dashboard-Part/Tabs/AssessmentTest-Tab/AssessmentTest.jsx';
import AssessmentText from './Pages/Dashboard-Part/Tabs/AssessmentTest-Tab/AssessementQuestion.jsx';
import AssessmentSubmit from './Pages/Dashboard-Part/Tabs/AssessmentTest-Tab/AssessmentSubmit.jsx';
// Start Interviews
import CandidateVC from './Pages/Dashboard-Part/Tabs/StartInterview-Tab/CandidateCV.jsx';
import VideoCallButton from './Pages/Dashboard-Part/Tabs/StartInterview-Tab/VideoCallButton.jsx';

import MasterData from './Pages/Dashboard-Part/Dashboard/MasterData.jsx';
import Users from './Pages/Dashboard-Part/Dashboard/Users.jsx';
import Contact from './Pages/Dashboard-Part/Dashboard/Contact.jsx';
import UserProfileDetails from './Pages/Dashboard-Part/Dashboard/UserProfileDetails.jsx';
import ContactProfileDetails from './Pages/Dashboard-Part/Dashboard/ContactProfileDetails.jsx';
import Inquirydesk from './Pages/Dashboard-Part/Dashboard/Inquirydesk.jsx';
import Roles from './Pages/Dashboard-Part/Dashboard/Roles.jsx';
import Profilefromapps from './Pages/Dashboard-Part/Dashboard/Profile.jsx';
import Admin from './Pages/Login-Part/Admin.jsx';
import NoFreelancer from './Pages/Login-Part/NoFreelancer.jsx';
import Callback from './Callback.js';
import JitsiMeeting from './jitsimeetingstart.jsx';
import { Organization } from './Pages/Login-Part/Organization.jsx';

// app settings
import Connected_apps from './Pages/Dashboard-Part/Tabs/App_Settings-Tab/Connected_apps.jsx';
import APIs from './Pages/Dashboard-Part/Tabs/App_Settings-Tab/APIs.jsx';
import Auth_token from './Pages/Dashboard-Part/Tabs/App_Settings-Tab/Auth_token.jsx';
import Access_token from './Pages/Dashboard-Part/Tabs/App_Settings-Tab/Access_token.jsx';
import initializeApp from './utils/initializeApp.js';

import SharingRules from './Pages/Dashboard-Part/Tabs/Settings-Tab/Sharing_rules.jsx';

import Task from './Pages/Dashboard-Part/Dashboard/Task.jsx'


const App = () => {
  const location = useLocation();
  const shouldRenderNavbar = !['/', '/profile1', '/price', '/profile2', '/profile3', '/profile4', '/assessmenttest', '/assessmenttext', '/assessmentsubmit', '/candidatevc', '/admin', '/nofreelance', '/callback', '/jitsimeetingstart', '/organization'].includes(location.pathname);
  const pathsWithSidebar = ['/profile', '/availability', '/billing_details', '/invoice', '/user_details', '/company_info', '/invoiceline', '/sharing_settings', '/sharing_rules'];
  const pathsWithSidebarAppSettings = ['/connected_apps', '/access_token', '/auth_token', '/apis'];
  const isNavbarHidden = !shouldRenderNavbar;
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [sharingSettings, setSharingSettings] = useState(null);
  const [objectPermissions, setObjectPermissions] = useState({});
  const [tabPermissions, setTabPermissions] = useState({});
  const [sharingPermissions, setSharingPermissions] = useState({});
  const [organization, setOrganization] = useState(false);
  const [freelancer, setFreelancer] = useState(false);

  useEffect(() => {
    initializeApp(setUserProfile, setUserRole, setSharingSettings, setOrganization, setFreelancer, setObjectPermissions, setTabPermissions, setSharingPermissions);
    const ws = handleWebSocket(
      'user',
    );
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'user') {
        initializeApp(setUserProfile, setUserRole, setSharingSettings, setOrganization, setFreelancer, setObjectPermissions, setTabPermissions, setSharingPermissions);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const [roomName] = useState('SampleRoom');
  const [displayName] = useState('John Doe');

  return (
    <React.Fragment>
      {shouldRenderNavbar && <Navbar />}
      {pathsWithSidebar.includes(location.pathname) && <Settingssidebar />}
      {pathsWithSidebarAppSettings.includes(location.pathname) && <App_settings />}
      <div className={isNavbarHidden ? '' : 'mt-16'}>
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
          <Route path="/home" element={<Home sharingPermissions={sharingPermissions} freelancer={freelancer} objectPermissions={objectPermissions} />} />
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/position" element={<Position />}  />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/analytics" element={<Analytics objectPermissions={objectPermissions.analytics || {}} tabPermissions={tabPermissions.analytics || {}} sharingPermissions={sharingPermissions.analytics || {}} />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/interview-question" element={<QuestionBank objectPermissions={objectPermissions.questionBank || {}} sharingPermissions={sharingPermissions.questionBank || {}} />} />
          <Route path="/newassessment" element={<NewAssessment />} />
          {/* <Route path="/interviewcq" element={<Interviewcq />} /> */}
          <Route path="/createCandidate" element={<CreateCandidate sharingPermissions={sharingPermissions} organization={organization} />} />
          <Route path="/team" element={<Team />} />
          <Route path="/createTeams" element={<CreateTeams />} />
          <Route path="/outsourceoption" element={<OutsourceOption />} />
          <Route path="/candidate-profiledetails" element={<CandidateProfileDetails />} />
          <Route path="/position-profiledetails" element={<PositionProfileDetails />} />
          <Route path="/team-profiledetails" element={<TeamProfileDetails />} />
          <Route path="/interview-profiledetails" element={<InterviewProfileDetails />} />
          {/* <Route path="/assessmentpopup" element={<AssessmentPopUp />} /> */}
          {/* <Route path="/schedulelater" element={<Schedulelater />} />
          <Route path="/schedulenow" element={<Schedulenow />} />
          <Route path="/newinterviewviewpage" element={<NewInterviewViewPage />} />
          <Route path="/newinterviewrequest" element={<NewInterviewRequest />} /> */}
          {/* <Route path="/internalprofiledetails" element={<Internalprofiledetails />} />
          <Route path="/internalinterview" element={<Internalinterview objectPermissions={objectPermissions.interviews || {}} tabPermissions={tabPermissions.interviews || {}} sharingPermissions={sharingPermissions || {}} />} /> */}
          {/* <Route path="/outsourceinterview" element={<Outsourceinterview objectPermissions={objectPermissions.interviews || {}} tabPermissions={tabPermissions.interviews || {}} sharingPermissions={sharingPermissions || {}} />} /> */}
          <Route path="/editcandidate" element={<EditCandidate />} />
          <Route path="/editassessment" element={<EditAssessment />} />
          <Route path="/editteam" element={<EditTeam />} />
          <Route path="/editquestion" element={<EditQuestion />} />
          <Route path="/editpositionform" element={<Editpositionform />} />
          <Route path="/editinternallater" element={<Editinternallater />} />
          <Route path="/mock-profiledetails" element={<MockProfileDetails />} />
          <Route path="/mockinterview" element={<MockInterview objectPermissions={objectPermissions.mockInterviews || {}} sharingPermissions={sharingPermissions.mockInterviews || {}} />} />
          <Route path="/assessmenttest" element={<AssessmentTest />} />
          <Route path="/assessmenttext" element={<AssessmentText />} />
          <Route path="/assessmentsubmit" element={<AssessmentSubmit />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/availability" element={<Availability objectPermissions={objectPermissions.availability || {}} tabPermissions={tabPermissions.availability || {}} sharingPermissions={sharingPermissions.availability || {}} />} />
          <Route path="/billing_details" element={<Billingdetails />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/user_details" element={<UserDetails />} />
          <Route path="/company_info" element={<CompanyInfo />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sharing_settings" element={<SharingSettings />} />
          <Route path="/invoiceline" element={<InvoiceLine />} />
          <Route path="/all_sharing_settings" element={<AllSharingSettings />} />
          <Route path="/sharing_rules" element={<SharingRules />} />
          <Route path="/task" element={<Task sharingPermissions={sharingPermissions} />} />

          {/* Start Interviews */}
          {/* <Route path="/candidatevc" element={<CandidateVC />} />
          <Route path="/videocallbutton" element={<VideoCallButton />} />
          <Route path="/masterdata" element={<MasterData objectPermissions={objectPermissions.masterdata || {}} tabPermissions={tabPermissions.masterdata || {}} sharingPermissions={sharingPermissions.masterdata || {}} />} />
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles objectPermissions={objectPermissions.roles || {}} tabPermissions={tabPermissions.roles || {}} sharingPermissions={sharingPermissions.roles || {}} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user-profiledetails" element={<UserProfileDetails />} />
          <Route path="/contact-profiledetails" element={<ContactProfileDetails />} />
          <Route path="/inquirydesk" element={<Inquirydesk />} />
          <Route path="/profilefromapps" element={<Profilefromapps />} /> */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/price" element={<Price />} />
          <Route path="/jitsimeetingstart" element={<JitsiMeeting roomName={roomName} displayName={displayName} />} />
          <Route path="/organization" element={<Organization />} />
          {/* <Route path="/connected_apps" element={<Connected_apps />} />
          <Route path="/access_token" element={<Access_token />} />
          <Route path="/auth_token" element={<Auth_token />} />
          <Route path="/apis" element={<APIs />} /> */}
        </Routes>
      </div>
    </React.Fragment>
  );
};

export default App;


