import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("TOKEN");

  return token ? children : <Navigate to="/auth/login" replace />;
};
