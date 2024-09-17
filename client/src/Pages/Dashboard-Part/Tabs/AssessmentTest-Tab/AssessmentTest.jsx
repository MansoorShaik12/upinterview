import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const AssessmentTest = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAssessment = async () => {
      const params = new URLSearchParams(location.search);
      const assessmentId = params.get('assessmentId');
      if (assessmentId) {
        try {
          const response = await axios.get(`http://localhost:5000/assessment-details/${assessmentId}`);
          setAssessment(response.data);
        } catch (error) {
          console.error("Error fetching assessment:", error);
          setError("Failed to load assessment. Please try again.");
        }
      }
    };
    fetchAssessment();
  }, [location]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!assessment) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (otp.length !== 4) {
      setError("OTP must be 4 digits");
    } else if (otp !== "1234") {
      setError("Invalid OTP");
    } else {
      setError("");
      setIsSubmitted(true);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError("");
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleContinueButtonClick = () => {
    if (assessment) {
      navigate("/assessmenttext", { state: { assessment } });
    } else {
      setError("Assessment data not loaded. Please try again.");
    }
  };

  return (
    <div>
      {isSubmitted ? (
        <div>
          <div className="relative bg-white">
            <div className="mx-auto">
              <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 px-10">
                <div className="flex items-center">
                  <p className="text-2xl font-bold">Logo</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-28">
            <div>
              <p className="text-xl font-semibold mt-5">Terms & Conditions</p>
            </div>
            <div>
              <p className="mt-5 text-xs">
                Eligibility: Only registered participants meeting the
                eligibility criteria can take the assessment.
              </p>
              <p className="mt-2 text-xs">
                Registration: Participants must complete the registration
                process, including payment of any fees, by the specified
                deadline.
              </p>
              <p className="mt-2 text-xs">
                Identification: Valid identification is required to enter the
                assessment area.
              </p>
              <p className="mt-2 text-xs">
                Conduct: Participants must adhere to all instructions and
                maintain academic integrity throughout the assessment.
              </p>
              <p className="mt-2 text-xs">
                Prohibited Items: Electronic devices, notes, and other
                unauthorized materials are not allowed.
              </p>
              <p className="mt-2 text-xs">
                Confidentiality: Participants' personal data will be protected,
                and all assessment content must remain confidential.
              </p>
              <p className="mt-2 text-xs">
                Special Accommodations: Requests for special accommodations must
                be submitted in advance and approved by the assessment body.
              </p>
              <p className="mt-2 text-xs">
                Results: Assessment results will be communicated within a
                specified timeframe. Appeals can be made if participants believe
                there has been an error.
              </p>
              <p className="mt-2 text-xs">
                Cancellation: If the assessment is cancelled or rescheduled due
                to unforeseen circumstances, participants will be notified
                promptly, and any applicable refunds will be processed.
              </p>
              <p className="mt-2 text-xs">
                Liability: The assessment organizers are not liable for any
                personal loss or injury sustained during the assessment.
              </p>
              <p className="mt-5 text-xs">
                By participating in this assessment, you agree to comply with
                these terms and conditions.
              </p>
            </div>
            <div className="items-center justify-between mr-28 mt-14 mb-14">
              <div className="items-center justify-center p-4 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-gray-600"
                  />
                  <span className="ml-4 font-medium">
                    I agree to the terms & conditions
                  </span>
                </label>
              </div>
              <div className="mt-5 ml-4">
                <div className="w-10"></div>
                <button
                  onClick={handleContinueButtonClick}
                  className={
                    "bg-gray-300 hover:bg-blue-500 text-gray-800 font-bold py-2 px-4 rounded " +
                    (!isChecked ? "cursor-not-allowed" : "")
                  }
                  disabled={!isChecked}
                >
                  Continue
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div>
          <div className="relative bg-white">
            <div className="mx-auto">
              <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 px-10">
                <div className="flex items-center">
                  <p className="text-2xl font-bold">Logo</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-28">
            <div>
              <p className="font-medium mt-5">
                Welcome to the [Name of the Assessment]!
              </p>
              <p className="mt-2 text-xs">
                We're glad you're here. This assessment is designed to [brief
                purpose of the assessment]. Your responses will help us [explain
                how the data will be used].
              </p>
              <p className="mt-2 font-medium">Instructions Overview</p>
              <p className="mt-2 text-xs">
                Before we begin, here are a few things you should know:
                <ul className="list-disc list-inside">
                  <li>
                    Time Required: The assessment will take approximately
                    [estimated time] to complete.
                  </li>
                  <li>
                    Environment: Please ensure you are in a quiet place where
                    you can focus.
                  </li>
                  <li>
                    Materials Needed: You will need [list any materials, if
                    applicable].
                  </li>
                </ul>
              </p>
              <p className="mt-2 font-medium">Confidentiality and Privacy</p>
              <p className="mt-2 text-xs">
                Your privacy is important to us. All responses are confidential
                and will be used solely for the purpose of [explain the
                purpose]. Please review our [link to privacy policy] for more
                details.
              </p>
              <p className="mt-2 font-medium">Instructions for Navigation</p>
              <p className="mt-2 text-xs">
                Here's how to navigate through the assessment:
                <ul className="list-disc list-inside">
                  <li>Use the "Next" button to move to the next question.</li>
                  <li>
                    Use the "Back" button to review or change your previous
                    answers.
                  </li>
                  <li>
                    The progress bar at the top of the page will show you how
                    much of the assessment you have completed.
                  </li>
                </ul>
              </p>
              <p className="mt-2 font-medium">Technical Requirements</p>
              <p className="mt-2 text-xs">
                For the best experience, please ensure your device meets the
                following technical requirements:
                <ul className="list-disc list-inside">
                  <li>
                    Browser: Use the latest version of [recommended browsers].
                  </li>
                  <li>
                    Internet Connection: A stable internet connection is
                    required.
                  </li>
                  <li>
                    Device: This assessment is best completed on a [suggested
                    device type, e.g., desktop, laptop, tablet].
                  </li>
                </ul>
              </p>
              <p className="mt-2 font-medium">Support Contact Information</p>
              <p className="mt-2 text-xs">
                If you encounter any technical difficulties or have questions,
                please contact our support team at [support email/phone number].
                We're here to help!
              </p>
            </div>
            <div className="mb-10">
              <div className="flex items-center mt-16">
                <form onSubmit={handleSubmit} className=" items-center gap-28">
                  <label
                    htmlFor="otp"
                    className="text-lg text-blue-500 font-medium"
                  >
                    Please enter the 4-digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    className="border p-2"
                  />
                  <button type="submit" className="bg-blue-500 text-white p-2 ml-2">
                    Submit
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentTest;
