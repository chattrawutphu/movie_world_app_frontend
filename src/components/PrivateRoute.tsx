import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/authSlice';

interface PrivateRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }
  
  // If the user doesn't have the required role, redirect to unauthorized
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated and has the required role, render the children
  return <Outlet />;
};

export default PrivateRoute; 