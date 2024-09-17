import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, requiredRole, userRole, ...rest }) => {
  if (!userRole) {
    console.error('User role is not provided.');
    return <Navigate to="/" />;
  }

  return userRole === requiredRole ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;