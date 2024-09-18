import React from 'react'
import { useNavigate } from 'react-router-dom';

const Login_1 = () => {
	const Naviagte = useNavigate()
	const Signup = () => {
		Naviagte("/profile1")
	};

	const Login = () => {
		Naviagte("/admin")
	};
	
	return (
		<>
			<div className='container mx-auto'>
				<div className='flex float-end mt-6'>
					<div className='border rounded text-white bg-blue-300 mr-5 p-2 w-32 text-center' onClick={Login}>
						Login
					</div>
					<div className='border rounded text-white  bg-blue-300 mr-5 p-2 w-32 text-center cursor-pointer' onClick={Signup}>
						Sign Up
					</div>
				</div>
			</div>
		</>
	)
}

export default Login_1















// import React from 'react';

// const CLIENT_ID = '86isvzpo5nk027';
// const REDIRECT_URI = 'https://www.linkedin.com/developers/tools/oauth/redirect'; // Replace with your redirect URI
// const STATE = 'DCEeFWf45A53sdfKef424'; // A unique state value to protect against CSRF

// const LinkedInLogin = () => {
//   const handleLinkedInLogin = () => {
//     const linkedInAuthURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${STATE}&scope=r_liteprofile%20r_emailaddress`;
//     window.location.href = linkedInAuthURL;
//   };

//   return (
//     <div>
//       <button onClick={handleLinkedInLogin}>Sign Up with LinkedIn</button>
//     </div>
//   );
// };

// export default LinkedInLogin;






