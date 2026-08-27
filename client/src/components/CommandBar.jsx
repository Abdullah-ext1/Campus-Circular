import React, { useState } from "react";
import { suggestedQueries, recentActivity, getStudent, getResource } from "../data/mockData.js";

export default function CommandBar({ onSearch }) {
  const [inputQuery, setInputQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      onSearch(inputQuery.trim());
    }
  };

  const handlePillClick = (queryText) => {
    setInputQuery(queryText);
    onSearch(queryText);
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: "760px", margin: "24px auto 0" }}>
      {/* Hero Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ marginBottom: "12px" }}>
          <span className="stamp stamp-gold font-serif">CAMPUS CIRCULAR</span>
        </div>
        <h1 className="font-serif" style={{ color: "var(--receipt)" }}>
          What do you need?
        </h1>
        <p style={{ color: "var(--receipt-dim)", fontSize: "1.05rem", marginTop: "8px" }}>
          Type your intent in plain language. We'll assemble a bundled resource kit from trusted campus peers.
        </p>
      </div>

      {/* Spotlight Command Bar */}
      <form onSubmit={handleSubmit} style={{ position: "relative", marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--carbon)",
            border: "2px solid var(--slate)",
            borderRadius: "var(--radius-lg)",
            padding: "8px 16px",
            boxShadow: "var(--paper-shadow)",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ledger-gold)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--slate)")}
        >
          <span className="font-mono" style={{ fontSize: "1.3rem", color: "var(--ledger-gold)", marginRight: "12px" }}>
            ⌘
          </span>
          <input
            type="text"
            className="font-sans"
            placeholder="e.g. 'I need to make a reel for my club event tomorrow'"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            style={{
              flex: 1,
              fontSize: "1.1rem",
              color: "var(--receipt)",
              padding: "8px 0",
            }}
            autoFocus
          />
          <button type="submit" className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.95rem" }}>
            Dispatch →
          </button>
        </div>
      </form>

      {/* Suggested Query Pills */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }} className="font-mono">
          Common Campus Intent Dispatches:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {suggestedQueries.map((queryText, index) => (
            <button
              key={index}
              className="btn-secondary"
              onClick={() => handlePillClick(queryText)}
              style={{
                fontSize: "0.85rem",
                borderRadius: "var(--radius-full)",
                borderStyle: "dashed",
                padding: "6px 14px",
              }}
            >
              <span style={{ color: "var(--ledger-gold)", marginRight: "6px" }}>⚡</span>
              {queryText}
            </button>
          ))}
        </div>
      </div>

      {/* Live Campus Activity Feed */}
      <div
        className="paper-card"
        style={{
          background: "var(--carbon)",
          color: "var(--receipt)",
          padding: "20px",
          border: "var(--border-slate)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span className="font-serif" style={{ fontSize: "1.1rem", color: "var(--receipt)" }}>
            Live Campus Circulation
          </span>
          <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--trust-green)" }}>
            ● ACTIVE CAMPUS NETWORK
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recentActivity.map((act, i) => {
            const student = getStudent(act.studentId);
            const resource = getResource(act.resourceId);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  paddingBottom: "8px",
                  borderBottom: i < recentActivity.length - 1 ? "1px solid var(--slate)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.2rem" }}>{resource.emoji}</span>
                  <div>
                    <span style={{ fontWeight: 600 }}>{student.name}</span>{" "}
                    <span style={{ color: "var(--receipt-dim)" }}>
                      {act.action} <strong style={{ color: "var(--receipt)" }}>{resource.name}</strong>
                    </span>
                  </div>
                </div>
                <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ledger-gold)" }}>
                  {act.timeAgo}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
