import React, { useState } from "react";
import { AlertTriangle, Settings } from "lucide-react";
import CategoryIcon from "./CategoryIcon.jsx";
import { lifecycleStates, getStudent, getResource } from "../data/mockData.js";
import { formatDate, formatTime } from "../utils/helpers.js";

export default function LifecycleTracker({ borrowing, onBack, onUpdateBorrowing }) {
  const [currentStateIdx, setCurrentStateIdx] = useState(borrowing?.currentState || 4);
  const [isLate, setIsLate] = useState(borrowing?.isLate || false);

  if (!borrowing) return null;

  const resource = getResource(borrowing.resourceId);
  const owner = getStudent(borrowing.ownerId);
  const borrower = getStudent(borrowing.borrowerId);

  const handleAdvance = () => {
    if (currentStateIdx < lifecycleStates.length - 1) {
      const nextIdx = currentStateIdx + 1;
      setCurrentStateIdx(nextIdx);
      if (onUpdateBorrowing) {
        onUpdateBorrowing({ ...borrowing, currentState: nextIdx, isLate });
      }
    }
  };

  const handleToggleLate = () => {
    const newLate = !isLate;
    setIsLate(newLate);
    if (onUpdateBorrowing) {
      onUpdateBorrowing({ ...borrowing, currentState: currentStateIdx, isLate: newLate });
    }
  };

  const currentState = lifecycleStates[currentStateIdx];

  return (
    <div className="animate-slide-up" style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button className="btn-secondary" onClick={onBack}>
          ← Back to Activity
        </button>
        <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--ledger-gold)" }}>
          AGREEMENT #{borrowing.id} • STATE DISPATCH
        </span>
      </div>

      {/* Main Ledger Card */}
      <div
        className="paper-card"
        style={{
          background: "var(--carbon)",
          border: isLate ? "2px solid var(--stamp-red)" : "var(--border-slate)",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: isLate ? "0 0 20px rgba(201,64,64,0.3)" : "var(--shadow-lg)",
        }}
      >
        {/* Item & Parties Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ padding: "8px", background: "rgba(0,0,0,0.25)", borderRadius: "var(--radius-md)", color: "var(--ledger-gold)" }}>
                <CategoryIcon category={resource?.category} size={28} />
              </div>
              <div>
                <h2 className="font-serif" style={{ color: "var(--receipt)" }}>
                  {resource.name}
                </h2>
                <div style={{ fontSize: "0.85rem", color: "var(--receipt-dim)" }}>
                  Lender: <strong style={{ color: "var(--receipt)" }}>{owner.name}</strong> • Borrower: <strong style={{ color: "var(--receipt)" }}>{borrower.name}</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            {isLate ? (
              <span className="stamp stamp-red font-serif" style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <AlertTriangle size={14} /> AT RISK / LATE RETURN
              </span>
            ) : (
              <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.85rem" }}>
                ACTIVE IN TRUST
              </span>
            )}
          </div>
        </div>

        {/* Horizontal Lifecycle Timeline */}
        <div style={{ margin: "40px 0 24px 0", position: "relative", overflowX: "auto", paddingBottom: "12px" }}>
          {/* Zone Highlight Background for IN TRUST */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              left: "40%",
              width: "20%",
              height: "80px",
              background: isLate ? "var(--stamp-red-bg)" : "var(--ledger-gold-bg)",
              border: isLate ? "1px dashed var(--stamp-red)" : "1px dashed var(--ledger-gold)",
              borderRadius: "var(--radius-md)",
              zIndex: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "4px",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "0.65rem",
                color: isLate ? "var(--stamp-red)" : "var(--ledger-gold)",
                fontWeight: "bold",
                letterSpacing: "1px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {isLate ? (
                <>
                  <AlertTriangle size={10} /> AT RISK ZONE
                </>
              ) : (
                "IN TRUST ZONE"
              )}
            </span>
          </div>

          {/* Timeline Nodes Container */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1, minWidth: "700px" }}>
            {/* Background Line */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "20px",
                right: "20px",
                height: "4px",
                background: "var(--slate)",
                zIndex: 0,
              }}
            />

            {lifecycleStates.map((state, idx) => {
              const isPassed = idx < currentStateIdx;
              const isCurrent = idx === currentStateIdx;

              let nodeColor = "var(--slate)";
              let nodeBg = "var(--carbon)";

              if (isPassed) {
                nodeColor = "var(--trust-green)";
                nodeBg = "var(--trust-green)";
              } else if (isCurrent) {
                nodeColor = isLate ? "var(--stamp-red)" : "var(--ledger-gold)";
                nodeBg = isLate ? "var(--stamp-red)" : "var(--ledger-gold)";
              }

              return (
                <div
                  key={state.key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => setCurrentStateIdx(idx)}
                >
                  {/* Circle Node */}
                  <div
                    style={{
                      width: isCurrent ? "32px" : "24px",
                      height: isCurrent ? "32px" : "24px",
                      borderRadius: "50%",
                      background: nodeBg,
                      border: `3px solid ${nodeColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      transition: "all 0.3s ease",
                      animation: isCurrent && isLate ? "riskPulse 1.2s infinite" : isCurrent ? "pulse 2s infinite" : "none",
                    }}
                  >
                    {isPassed ? "✓" : idx + 1}
                  </div>

                  {/* Short Label */}
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "0.7rem",
                      marginTop: "8px",
                      color: isCurrent ? (isLate ? "var(--stamp-red)" : "var(--ledger-gold)") : isPassed ? "var(--trust-green)" : "var(--receipt-dim)",
                      fontWeight: isCurrent ? "bold" : "normal",
                    }}
                  >
                    {state.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current State Detail Box */}
        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            border: "1px solid var(--slate)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
            marginTop: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-serif" style={{ fontSize: "1.1rem", color: "var(--receipt)" }}>
              Current Phase: {currentState.label}
            </span>
            <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ledger-gold)" }}>
              STEP {currentStateIdx + 1} OF 10
            </span>
          </div>
          <p style={{ color: "var(--receipt-dim)", fontSize: "0.9rem", marginTop: "6px" }}>
            {currentState.description}
          </p>

          <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginTop: "12px" }}>
            Target Deadline: {formatDate(borrowing.timestamps.due)} at {formatTime(borrowing.timestamps.due)}
          </div>
        </div>
      </div>

      {/* Demo Controls Bar */}
      <div
        className="paper-card"
        style={{
          background: "var(--carbon-light)",
          border: "var(--border-slate)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--ledger-gold)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Settings size={14} /> DEMO STATE CONTROL CONTROLS
        </span>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn-secondary"
            onClick={handleToggleLate}
            style={{ borderColor: isLate ? "var(--stamp-red)" : "var(--slate)" }}
          >
            {isLate ? "Reset to On-Time" : "Simulate Late Return"}
          </button>

          <button
            className="btn-primary"
            onClick={handleAdvance}
            disabled={currentStateIdx >= lifecycleStates.length - 1}
          >
            Advance State →
          </button>
        </div>
      </div>
    </div>
  );
}
