/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UrlState } from "@/context";
import { BarLoader } from "react-spinners";

function RequireAuth({ children }) {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = UrlState();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [loading, isAuthenticated, navigate]);

  // Still loading session - show a loader
  if (loading) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }

  // Authenticated - render protected children
  if (isAuthenticated) {
    return children;
  }

  // Not authenticated - return null until redirect finishes
  return null;
}

export default RequireAuth;
