// import React, { useState } from "react";
// import image1 from "../Dashboard-Part/Images/image1.png";

// const Admin = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <>
//       <div>
//         <div className="border-b p-4">
//           <p className="font-bold text-xl">LOGO</p>
//         </div> 

//         <div className="grid grid-cols-2">
//           {/* col 1 */}
//           <div className="flex justify-center">
//             <img src={image1} alt="logo" />
//           </div>
//           {/* col 2 */}
//           <div className="p-4">
//             <div className="flex justify-center gap-52 mb-20">
//               <button className="border-2 border-gray-400 font-medium rounded-md px-10 py-2">User</button>
//               <button className="border-2 border-gray-400 font-medium rounded-md px-10 py-2">Admin</button>
//             </div>
//             <div className="max-w-md mx-auto">
//               <h2 className="text-2xl mb-10 text-center">Welcome Back</h2>
//               <div className="border border-gray-300 rounded-md mb-4">
//   <label className="block text-gray-600 ml-2">Email or Phone</label>
//   <input
//     type="text"
//     name="contact"
//     placeholder=""
//     className="w-full focus:outline-none rounded-md border-gray-300 px-2"
//   />
// </div>

// <div className="border border-gray-300 rounded-md mb-4 relative">
//   <label className="block text-gray-600 ml-2">Password</label>
//   <input
//     type={showPassword ? "text" : "password"}
//     placeholder=""
//     className="w-full focus:outline-none rounded-md border-gray-300 px-2"
//   />
//   <button
//     onClick={togglePasswordVisibility}
//     className="text-blue-500 absolute right-4 top-1/2 transform -translate-y-1/2"
//   >
//     {showPassword ? "Hide" : "Show"}
//   </button>
// </div>


//               <div className="mb-8">
//                 <a href="#" className="text-blue-500">Forgot Password?</a>
//               </div>
//               <div className="flex flex-col items-center">
//                 <button className="bg-blue-500 text-white rounded-full px-16 py-2 mb-2">Login</button>
//                 <button className="bg-gray-500 text-white rounded-full px-16 py-2">Cancel</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Admin;







import React, { useState } from "react";
import { usePermify } from '@permify/react-role';
import image1 from "../Dashboard-Part/Images/image1.png";

const Admin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { can } = usePermify();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div>
        <div className="border-b p-4">
          <p className="font-bold text-xl">LOGO</p>
        </div>

        <div className="grid grid-cols-2">
          {/* col 1 */}
          <div className="flex justify-center">
            <img src={image1} alt="logo" />
          </div>
          {/* col 2 */}
          <div className="p-4">
            <div className="flex justify-center gap-52 mb-20">
              <button className="border-2 border-gray-400 font-medium rounded-md px-10 py-2">User</button>
              {can && can('view') && (
                <button className="border-2 border-gray-400 font-medium rounded-md px-10 py-2">Admin</button>
              )}
            </div>
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl mb-10 text-center">Welcome Back</h2>
              <div className="border border-gray-300 rounded-md mb-4">
                <label className="block text-gray-600 ml-2">Email or Phone</label>
                <input
                  type="text"
                  name="contact"
                  placeholder=""
                  className="w-full focus:outline-none rounded-md border-gray-300 px-2"
                />
              </div>

              <div className="border border-gray-300 rounded-md mb-4 relative">
                <label className="block text-gray-600 ml-2">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  className="w-full focus:outline-none rounded-md border-gray-300 px-2"
                />
                <button
                  onClick={togglePasswordVisibility}
                  className="text-blue-500 absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="mb-8">
                <a href="#" className="text-blue-500">Forgot Password?</a>
              </div>
              <div className="flex flex-col items-center">
                <button className="bg-blue-500 text-white rounded-full px-16 py-2 mb-2">Login</button>
                <button className="bg-gray-500 text-white rounded-full px-16 py-2">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
