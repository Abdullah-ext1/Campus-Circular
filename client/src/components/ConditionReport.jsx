import React, { useState } from "react";
import { Check, AlertTriangle } from "lucide-react";
import { formatDate } from "../utils/helpers.js";

export default function ConditionReport({ borrowing, onBack }) {
  const [checklist, setChecklist] = useState([
    { id: 1, item: "Body & Exterior Shell", status: "ok" },
    { id: 2, item: "Screen / Lens / Sensor Optics", status: "ok" },
    { id: 3, item: "Buttons & Mechanical Controls", status: "ok" },
    { id: 4, item: "Included Accessories & Cables", status: "ok" },
    { id: 5, item: "Power / Battery Charge Level", status: "ok" },
  ]);

  const handleToggle = (id, newStatus) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button className="btn-secondary" onClick={onBack}>
          ← Back to Activity
        </button>
        <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--ledger-gold)" }}>
          INSPECTION PROTOCOL • {borrowing?.id}
        </span>
      </div>

      <div
        className="paper-card"
        style={{
          background: "var(--carbon)",
          border: "var(--border-slate)",
          padding: "28px",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.75rem" }}>
            DUAL-STEP VERIFICATION REPORT
          </span>
          <h2 className="font-serif" style={{ color: "var(--receipt)", marginTop: "6px" }}>
            Pre & Post Condition Handover Comparison
          </h2>
          <p style={{ color: "var(--receipt-dim)", fontSize: "0.9rem", marginTop: "4px" }}>
            Both borrower and lender cross-verify standard condition parameters to preserve trust score integrity.
          </p>
        </div>

        {/* Comparison Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {/* Handover Baseline */}
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--slate)" }}>
            <span className="stamp stamp-green font-serif" style={{ fontSize: "0.7rem" }}>
              1. INITIAL HANDOVER (BASELINE)
            </span>
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem", color: "var(--receipt-dim)" }}>
              <div>• All optical elements cleaned & verified</div>
              <div>• Battery charged at 100%</div>
              <div>• All 4 cables and lens caps accounted for</div>
              <div>• Zero major structural blemishes</div>
            </div>
            <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ledger-gold)", marginTop: "12px" }}>
              Verified: {formatDate(borrowing?.timestamps?.handover)}
            </div>
          </div>

          {/* Interactive After Return Checklist */}
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--slate)" }}>
            <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.7rem" }}>
              2. POST-RETURN CHECKLIST
            </span>

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {checklist.map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--receipt)" }}>{c.item}</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      onClick={() => handleToggle(c.id, "ok")}
                      style={{
                        padding: "2px 8px",
                        fontSize: "0.75rem",
                        borderRadius: "var(--radius-sm)",
                        background: c.status === "ok" ? "var(--trust-green)" : "var(--slate)",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Check size={12} /> OK
                    </button>
                    <button
                      onClick={() => handleToggle(c.id, "issue")}
                      style={{
                        padding: "2px 8px",
                        fontSize: "0.75rem",
                        borderRadius: "var(--radius-sm)",
                        background: c.status === "issue" ? "var(--stamp-red)" : "var(--slate)",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <AlertTriangle size={12} /> Issue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={onBack} style={{ width: "100%", marginTop: "24px" }}>
          Submit Verified Inspection Report →
        </button>
      </div>
    </div>
  );
}
