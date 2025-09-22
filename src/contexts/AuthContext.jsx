// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
  });

  // Watch Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState({ user, isAuthenticated: true });
      } else {
        setAuthState({ user: null, isAuthenticated: false });
      }
    });
    return () => unsubscribe();
  }, []);

  // Login with Firebase
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login failed:", error.message);
      return false;
    }
  };

  // Register with Firebase
  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      return true;
    } catch (error) {
      console.error("Registration failed:", error.message);
      return false;
    }
  };

  // Update user avatar (using Firebase profile photo URL)
  const updateAvatar = async (avatarUrl) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { photoURL: avatarUrl });
    setAuthState({ ...authState, user: auth.currentUser });
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setAuthState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
