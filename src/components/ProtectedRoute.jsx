import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = null, redirectToSignup = false }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userLoggedIn = localStorage.getItem('userLoggedIn');
      const userData = localStorage.getItem('userData');
      
      if (userLoggedIn === 'true' && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          setCurrentUser(parsedUserData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('userLoggedIn');
          localStorage.removeItem('userData');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is not logged in
  if (!currentUser) {
    // Redirect to signup for report page if specified
    if (redirectToSignup) {
      return <Navigate to="/signup" replace />;
    }
    // Otherwise redirect to login
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check user role
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // For dashboard access, show alert and redirect to home
    if (allowedRoles.includes('admin')) {
      alert("Access denied! Dashboard is only available for Authority users.");
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;