import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Plus, Compass, Send, Clock, User, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Header({ currentUser, isAdmin, onToggleAdmin, onNavigateTab, onCreateListing }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTab = (tabId) => {
    setDropdownOpen(false);
    if (onNavigateTab) {
      onNavigateTab(tabId);
    } else {
      navigate("/app", { state: { targetTab: tabId } });
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/auth");
  };

  const firstName = currentUser?.name?.split(" ")[0] || "User";
  const userInitials = currentUser?.initials || currentUser?.name?.[0] || "U";

  return (
    <header className="app-header" role="banner">
      <div className="brand-stamp" role="button" tabIndex={0} onClick={() => navigate("/")} aria-label="Go to home">
        <span className="brand-logo">campus circular.</span>
      </div>

      <div className="header-actions">
        <button
          className="btn-secondary"
          onClick={() => navigate("/explore")}
          style={{ padding: "6px 12px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
          aria-label="Explore campus listings"
        >
          <Compass size={15} />
          <span>Explore</span>
        </button>

        <button
          className="btn-secondary"
          onClick={() => navigate("/wanted")}
          style={{ padding: "6px 12px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
          aria-label="Browse Wanted Hardware Requests"
        >
          <span>Wanted Board</span>
        </button>

        <button
          className="btn-primary"
          onClick={onCreateListing}
          style={{ padding: "6px 14px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
          aria-label="Create a new equipment listing"
        >
          <Plus size={16} />
          <span>List Gear</span>
        </button>

        {/* User Pill with Dropdown */}
        <div className="user-dropdown-container" ref={dropdownRef} style={{ position: "relative" }}>
          <div
            className="user-pill"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            role="button"
            tabIndex={0}
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            aria-label={`User menu for ${currentUser?.name}`}
            style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}
          >
            <div className="avatar-circle">{userInitials}</div>
            <span className="font-sans" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111111" }}>
              {firstName}
            </span>
            <ChevronDown size={14} style={{ color: "#666666", transition: "transform 0.2s ease", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="user-dropdown-menu animate-slide-up"
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "220px",
                background: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: "10px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                padding: "8px",
                zIndex: 200,
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {/* Header Info */}
              <div style={{ padding: "8px 10px 10px", borderBottom: "1px solid #f0f0f0", marginBottom: "4px" }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111111" }}>{currentUser?.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#666666", marginTop: "2px" }}>{currentUser?.dept || "Campus Member"}</div>
              </div>

              {/* Navigation Options */}
              <button
                type="button"
                className="dropdown-item-btn"
                role="menuitem"
                onClick={() => handleSelectTab("home")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  color: "#111111",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.15s ease",
                }}
              >
                <Send size={15} style={{ color: "#444444" }} />
                <span>Dispatch / AI Finder</span>
              </button>

              <button
                type="button"
                className="dropdown-item-btn"
                role="menuitem"
                onClick={() => handleSelectTab("activity")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  color: "#111111",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.15s ease",
                }}
              >
                <Clock size={15} style={{ color: "#444444" }} />
                <span>Activity & Loans</span>
              </button>

              <button
                type="button"
                className="dropdown-item-btn"
                role="menuitem"
                onClick={() => handleSelectTab("profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  color: "#111111",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.15s ease",
                }}
              >
                <User size={15} style={{ color: "#444444" }} />
                <span>My Profile</span>
              </button>

              <div style={{ height: "1px", background: "#f0f0f0", margin: "4px 0" }} />

              <button
                type="button"
                className="dropdown-item-btn"
                role="menuitem"
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  color: "#d9383a",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.15s ease",
                }}
              >
                <LogOut size={15} />
                <span>Switch Account / Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
