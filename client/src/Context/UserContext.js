import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [sharingSettings, setSharingSettings] = useState([]);

  return (
    <UserContext.Provider value={{ userRole, setUserRole, userProfile, setUserProfile, sharingSettings, setSharingSettings }}>
      {children}
    </UserContext.Provider>
  );
};