import React from "react";
import { BarChart3, Settings } from "lucide-react";

export default function Header({ currentUser, onOpenDashboard, isAdmin, onToggleAdmin, onOpenProfile }) {
  return (
    <header className="app-header">
      <div className="brand-stamp" onClick={() => onOpenProfile && onOpenProfile()}>
        <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.85rem", padding: "2px 8px" }}>
          CAMPUS CIRCULAR
        </span>
        {isAdmin && <span className="badge-tag">ADMIN MODE</span>}
      </div>

      <div className="header-actions">
        <button
          className="btn-secondary"
          onClick={onOpenDashboard}
          style={{ padding: "6px 12px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <BarChart3 size={15} style={{ color: "var(--ledger-gold)" }} />
          <span className="font-mono">Impact</span>
        </button>

        <button
          className="btn-secondary"
          onClick={onToggleAdmin}
          style={{ padding: "6px 10px", fontSize: "0.8rem", opacity: isAdmin ? 1 : 0.7, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          title="Toggle Admin Mode"
        >
          <Settings size={15} />
        </button>

        <div className="user-pill" onClick={onOpenProfile}>
          <div className="avatar-circle">{currentUser?.initials || "U"}</div>
          <span className="font-sans" style={{ fontSize: "0.85rem", fontWeight: 500 }}>
            {currentUser?.name?.split(" ")[0]}
          </span>
          <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ledger-gold)" }}>
            {currentUser?.trustScore}
          </span>
        </div>
      </div>
    </header>
  );
}
