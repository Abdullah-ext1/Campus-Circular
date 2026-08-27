import React from "react";

export default function NotificationCenter({ notifications = [], onClose }) {
  const sampleNotifs = [
    { id: 1, text: "Priya accepted your borrow request for Canon EOS R6.", time: "2h ago", unread: true },
    { id: 2, text: "Return deadline approaching for JBL PartyBox 310 tomorrow.", time: "4h ago", unread: true },
    { id: 3, text: "Arjun rated your Tripod lending exchange ★★★★★.", time: "1d ago", unread: false },
  ];

  const list = notifications.length > 0 ? notifications : sampleNotifs;

  return (
    <div
      className="paper-card animate-slide-up"
      style={{
        position: "absolute",
        top: "60px",
        right: "16px",
        width: "320px",
        background: "var(--carbon)",
        border: "var(--border-gold)",
        padding: "16px",
        zIndex: 150,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span className="font-serif" style={{ fontSize: "1rem", color: "var(--receipt)" }}>
          Campus Dispatches
        </span>
        <button onClick={onClose} style={{ color: "var(--receipt-dim)" }}>✕</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {list.map((n) => (
          <div
            key={n.id}
            style={{
              padding: "8px 10px",
              background: n.unread ? "rgba(201,168,76,0.1)" : "rgba(0,0,0,0.2)",
              borderLeft: n.unread ? "3px solid var(--ledger-gold)" : "3px solid transparent",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
            }}
          >
            <div style={{ color: "var(--receipt)" }}>{n.text}</div>
            <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--receipt-dim)", marginTop: "4px" }}>
              {n.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
