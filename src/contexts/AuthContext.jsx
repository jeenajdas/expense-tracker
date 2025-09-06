// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
      });
    }
  }, []);

  // Save/remove user in localStorage
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      localStorage.setItem("user", JSON.stringify(authState.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [authState]);

  // Auth Actions 
  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (existingUser) {
      setAuthState({ user: existingUser, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const register = async (name, email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      avatar: null, 
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setAuthState({ user: newUser, isAuthenticated: true });
    return true;
  };

 
  const updateAvatar = (avatarBase64) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, avatar: avatarBase64 };

    // Update users list in localStorage too
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) =>
      u.email === updatedUser.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(users));

    // Update current logged-in user
    setAuthState({ ...authState, user: updatedUser });
  };

  const logout = () => {
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
