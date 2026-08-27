import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Settings, Plus, Compass } from "lucide-react";

export default function Header({ currentUser, onOpenDashboard, isAdmin, onToggleAdmin, onOpenProfile, onCreateListing }) {
  const navigate = useNavigate();

  return (
    <header className="app-header" role="banner">
      <div className="brand-stamp" role="button" tabIndex={0} onClick={() => navigate("/")} aria-label="Go to home">
        <span className="brand-logo">campus circular.</span>
        {isAdmin && <span className="badge-tag">ADMIN</span>}
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
          className="btn-primary"
          onClick={onCreateListing}
          style={{ padding: "6px 14px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
          aria-label="Create a new equipment listing"
        >
          <Plus size={16} />
          <span>List Gear</span>
        </button>

        <button
          className="btn-secondary"
          onClick={onOpenDashboard}
          style={{ padding: "6px 12px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
          aria-label="View Campus Impact stats"
        >
          <BarChart3 size={15} />
          <span>Impact</span>
        </button>

        <button
          className="btn-secondary"
          onClick={onToggleAdmin}
          style={{ padding: "6px 10px", fontSize: "0.8rem", opacity: isAdmin ? 1 : 0.6, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          title="Toggle Admin Mode"
          aria-label="Toggle admin console"
        >
          <Settings size={15} />
        </button>

        <div
          className="user-pill"
          onClick={onOpenProfile}
          role="button"
          tabIndex={0}
          aria-label={`View ${currentUser?.name}'s profile`}
        >
          <div className="avatar-circle">{currentUser?.initials || currentUser?.name?.[0] || "U"}</div>
          <span className="font-sans" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {currentUser?.name?.split(" ")[0]}
          </span>
          <span className="font-mono" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#111111" }}>
            {currentUser?.trustScore || 90}%
          </span>
        </div>
      </div>
    </header>
  );
}
