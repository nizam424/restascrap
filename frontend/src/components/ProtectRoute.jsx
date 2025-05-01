// Instead of using localStorage which is an insecure practice, we check with the backend to ensure
// this component acts as a middleware to protect the route from unauthorized access
// you cannot start scraping unless youve signed in
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader } from "lucide-react";

const API_URL = import.meta.env.VITE_BASE_URL;

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await axios.get(`${API_URL}/auth/check-auth`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
        navigate("/"); // kick back to home if not auth’d
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (loading) {
    // full-screen loader while we verify the session
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  // once done loading, either render children or redirect
  return isAuthenticated ? children : <Navigate to="/" />;
}
