import React, { useState } from "react";
import { formatCurrency } from "../utils/helpers.js";

export default function SettlementPanel({ borrowing, onBack }) {
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeType, setDisputeType] = useState("damage");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!borrowing) return null;

  const lateHours = borrowing.isLate ? 14 : 0;
  const lateFee = lateHours * 20; // ₹20/hr
  const damageFee = 0;
  const netRefund = borrowing.deposit - lateFee - damageFee;

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: "760px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button className="btn-secondary" onClick={onBack}>
          ← Back to Activity
        </button>
        <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--ledger-gold)" }}>
          SETTLEMENT & DISPUTES • {borrowing.id}
        </span>
      </div>

      {/* Financial Settlement Card */}
      <div
        className="paper-card perforated-edge"
        style={{
          background: "var(--receipt)",
          color: "var(--receipt-text)",
          padding: "28px",
          marginBottom: "24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.8rem" }}>
            FINAL FINANCIAL SETTLEMENT
          </span>
          <h2 className="font-serif" style={{ marginTop: "6px", color: "var(--receipt-text)" }}>
            Deposit Refund Statement
          </h2>
        </div>

        <div className="font-mono" style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "4px" }}>
            <span>Initial Security Deposit Escrow</span>
            <strong>{formatCurrency(borrowing.deposit)}</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "4px", color: lateFee > 0 ? "var(--stamp-red)" : "inherit" }}>
            <span>Late Return Penalties ({lateHours} hrs @ ₹20/hr)</span>
            <span>- {formatCurrency(lateFee)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "4px" }}>
            <span>Damage Assessment Deductions</span>
            <span>- {formatCurrency(damageFee)}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1.1rem",
              borderTop: "2px solid var(--receipt-text)",
              paddingTop: "8px",
              marginTop: "8px",
            }}
          >
            <span>NET DEPOSIT REFUNDABLE TO BORROWER</span>
            <span style={{ color: "var(--trust-green)" }}>{formatCurrency(netRefund)}</span>
          </div>
        </div>
      </div>

      {/* Dispute Filing Form */}
      <div
        className="paper-card"
        style={{
          background: "var(--carbon)",
          border: "var(--border-slate)",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: "1.1rem", color: "var(--receipt)" }}>
              Governance Dispute Submission
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--receipt-dim)" }}>
              Have an issue regarding damage claims or unreturned items?
            </p>
          </div>

          <button
            className="btn-secondary"
            onClick={() => setShowDisputeForm(!showDisputeForm)}
          >
            {showDisputeForm ? "Close Form" : "File Dispute"}
          </button>
        </div>

        {submitted ? (
          <div className="stamp stamp-green font-serif" style={{ padding: "16px", display: "block", textAlign: "center" }}>
            ✓ DISPUTE SUBMITTED TO CAMPUS GOVERNANCE BOARD
          </div>
        ) : (
          showDisputeForm && (
            <form onSubmit={handleDisputeSubmit} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", display: "block", marginBottom: "6px" }}>
                  DISPUTE CATEGORY
                </label>
                <select
                  value={disputeType}
                  onChange={(e) => setDisputeType(e.target.value)}
                  className="font-mono"
                  style={{
                    width: "100%",
                    background: "var(--ink-navy)",
                    color: "var(--receipt)",
                    border: "var(--border-slate)",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <option value="damage">Unreported Item Damage</option>
                  <option value="late">Unreasonable Overdue Delay</option>
                  <option value="deposit">Deposit Refund Disagreement</option>
                </select>
              </div>

              <div>
                <label className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", display: "block", marginBottom: "6px" }}>
                  DISPUTE EVIDENCE STATEMENT
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide explicit details and evidence context for campus governance review..."
                  style={{
                    width: "100%",
                    background: "var(--ink-navy)",
                    color: "var(--receipt)",
                    border: "var(--border-slate)",
                    padding: "10px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9rem",
                  }}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ background: "var(--stamp-red)" }}>
                Submit Evidence to Governance Board →
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
}
