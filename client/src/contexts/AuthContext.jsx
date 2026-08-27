import React, { createContext, useContext, useState, useEffect } from "react";
import { students } from "../data/mockData.js";

const AuthContext = createContext();

// Pre-configured profiles
export const PRESET_ACCOUNTS = {
  admin: {
    username: "admin",
    name: "Admin Controller",
    role: "admin",
    dept: "Campus Circular Oversight",
    year: "Staff / Exec",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    trustScore: 100,
    studentId: 99,
  },
  lister: {
    username: "lister",
    name: "Siddharth Joshi",
    role: "lister",
    dept: "Computer Science",
    year: "3rd Year",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    trustScore: 95,
    studentId: 8,
  },
  user: {
    username: "user",
    name: "Aarav Sharma",
    role: "user",
    dept: "Film & Media Studies",
    year: "2nd Year",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    trustScore: 88,
    studentId: 1,
  },
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(() => {
    const saved = localStorage.getItem("cc_auth_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    // Default to lister/student if not logged in
    return PRESET_ACCOUNTS.lister;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("cc_auth_user") !== null;
  });

  const login = (usernameInput) => {
    const normalized = (usernameInput || "").trim().toLowerCase();
    const account = PRESET_ACCOUNTS[normalized];
    if (account) {
      setCurrentUserState(account);
      setIsAuthenticated(true);
      localStorage.setItem("cc_auth_user", JSON.stringify(account));
      return { success: true, user: account };
    }
    return { success: false, error: "Invalid username" };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("cc_auth_user");
    // Fallback to default user object in state
    setCurrentUserState(PRESET_ACCOUNTS.user);
  };

  const isAdmin = currentUser?.role === "admin";
  const isLister = currentUser?.role === "lister" || currentUser?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated,
        isAdmin,
        isLister,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
