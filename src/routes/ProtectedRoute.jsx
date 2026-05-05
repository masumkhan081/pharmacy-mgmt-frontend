import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, access, isAccessControlled }) => {
  const location = useLocation();
  const { userRole, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }
  if (isAccessControlled && !access?.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
