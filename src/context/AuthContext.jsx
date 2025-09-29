// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase"; // ✅ make sure this file exists

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------- LOGIN -------------------
  const login = async (email, password) => {
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken(); // get Firebase token

      // Send token to backend to fetch user info
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }), // ✅ send token in body
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch user data");
      }

      const data = await response.json();
      console.log("Login successful, user data:", data.user); // Debug log
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  // ------------------- LOGOUT -------------------
  const logout = async () => {
    await auth.signOut();
    setCurrentUser(null);
  };

  // ------------------- TRACK AUTH STATE -------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }), // ✅ send token in body
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Auth state change, user data:", data.user); // Debug log
            setCurrentUser(data.user);
          } else {
            console.log("Auth state change failed, clearing user");
            setCurrentUser(null);
          }
        } catch (err) {
          console.error("Auth state fetch error:", err.message);
          setCurrentUser(null);
        }
      } else {
        console.log("No Firebase user, clearing currentUser");
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Include loading in the context value
  const value = { 
    currentUser, 
    login, 
    logout, 
    loading // ✅ This was missing!
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}