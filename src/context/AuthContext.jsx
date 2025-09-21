import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [appUser, setAppUser] = useState(null); // To store our backend user profile
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // User is logged in, now get their profile from our backend
        try {
          const token = await user.getIdToken();
          const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setAppUser(data.user); // Store the user profile from MongoDB
        } catch (error) {
          console.error("Could not fetch app user profile", error);
          setAppUser(null); // Clear profile on error
        }
      } else {
        // User is logged out
        setAppUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser, // The user from Firebase
    appUser,     // The user profile from our MongoDB (contains the role)
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}