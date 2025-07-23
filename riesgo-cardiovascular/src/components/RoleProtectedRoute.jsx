import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleProtectedRoute = ({ element, allowedRoles }) => {
  const { roles } = useAuth();

  // Verifica que roles sea un array
  if (!Array.isArray(roles)) {
    return <Navigate to="/" />;
  }

  // Check if user has at least one of the allowed roles
  const hasAccess = roles.some(role => allowedRoles.includes(role));

  return hasAccess ? element : <Navigate to="/" />;
};

export default RoleProtectedRoute;
