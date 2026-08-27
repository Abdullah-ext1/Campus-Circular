import React, { useState } from "react";
import { Zap } from "lucide-react";
import CategoryIcon from "./CategoryIcon.jsx";
import { suggestedQueries, recentActivity, getStudent, getResource } from "../data/mockData.js";

export default function CommandBar({ onSearch, isParsingIntent = false }) {
  const [inputQuery, setInputQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim() && !isParsingIntent) {
      onSearch(inputQuery.trim());
    }
  };

  const handlePillClick = (queryText) => {
    if (isParsingIntent) return;
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
          Type your intent in plain language. Groq AI parses intent to match cameras, tripods, lights & gear bundles.
        </p>
      </div>

      {/* Spotlight Command Bar */}
      <form onSubmit={handleSubmit} style={{ position: "relative", marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--carbon)",
            border: isParsingIntent ? "2px solid var(--ledger-gold)" : "2px solid var(--slate)",
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
            disabled={isParsingIntent}
            placeholder="e.g. 'reel shoot kit' or 'need camera and tripod for event'"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            style={{
              flex: 1,
              fontSize: "1.1rem",
              color: "var(--receipt)",
              padding: "8px 0",
              opacity: isParsingIntent ? 0.7 : 1,
            }}
            autoFocus
          />
          <button
            type="submit"
            disabled={isParsingIntent}
            className="btn-primary"
            style={{
              padding: "8px 20px",
              fontSize: "0.95rem",
              opacity: isParsingIntent ? 0.8 : 1,
            }}
          >
            {isParsingIntent ? "⚡ Parsing Groq AI..." : "Dispatch →"}
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
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Zap size={14} style={{ color: "var(--ledger-gold)" }} />
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
                  <div style={{ color: "var(--ledger-gold)", display: "flex", alignItems: "center" }}>
                    <CategoryIcon category={resource?.category} size={16} />
                  </div>
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
