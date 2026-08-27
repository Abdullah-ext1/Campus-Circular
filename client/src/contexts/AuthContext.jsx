import React, { createContext, useContext, useState, useEffect } from "react";
import { students } from "../data/mockData.js";

const AuthContext = createContext();

// Build dynamic user accounts map from students directory
const createAccountsMap = () => {
  const map = {};

  // Register all 14 student profiles
  students.forEach((s) => {
    const role = s.username === "admin" ? "admin" : (s.lendCount >= 15 ? "lister" : "user");
    const account = {
      username: s.username,
      name: s.name,
      role: role,
      dept: s.dept,
      year: `${s.year}th Year`,
      avatar: s.avatar,
      trustScore: s.trustScore,
      studentId: s.id,
    };

    map[s.username.toLowerCase()] = account;
    map[s.name.toLowerCase()] = account;
    map[s.name.split(" ")[0].toLowerCase()] = account; // first name
  });

  // Aliases for generic roles
  map["admin"] = map["admin"] || {
    username: "admin",
    name: "Campus Circular Oversight",
    role: "admin",
    dept: "Governance & Trust Council",
    year: "Staff / Exec",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    trustScore: 100,
    studentId: 14,
  };

  map["lister"] = map["priya"] || map["arjun"] || {
    username: "lister",
    name: "Priya Sharma",
    role: "lister",
    dept: "Journalism & Mass Comm",
    year: "2nd Year",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    trustScore: 91,
    studentId: 2,
  };

  map["user"] = map["arjun"] || {
    username: "user",
    name: "Arjun Mehta",
    role: "user",
    dept: "Film & Media Studies",
    year: "3rd Year",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    trustScore: 94,
    studentId: 1,
  };

  return map;
};

export const PRESET_ACCOUNTS = createAccountsMap();

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
    return PRESET_ACCOUNTS["arjun"] || PRESET_ACCOUNTS["user"];
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
    setCurrentUserState(PRESET_ACCOUNTS["user"]);
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
        availableUsers: Object.values(PRESET_ACCOUNTS).filter(
          (u, index, self) => index === self.findIndex((t) => t.studentId === u.studentId)
        ),
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
