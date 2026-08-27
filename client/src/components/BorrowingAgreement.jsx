import React, { useState } from "react";
import FeeBreakdown from "./FeeBreakdown.jsx";
import TrustBadge from "./TrustBadge.jsx";
import { getStudent } from "../data/mockData.js";
import { calculateFees, formatDate } from "../utils/helpers.js";

export default function BorrowingAgreement({ resource, borrower, onBack, onConfirm }) {
  const [days, setDays] = useState(3);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!resource || !borrower) return null;

  const owner = getStudent(resource.ownerId);
  const isFormValid = checked1 && checked2 && checked3;
  const serialNo = `BRW-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleConfirmClick = () => {
    if (!isFormValid) return;
    setIsConfirmed(true);

    const { totalAmount, platformFee } = calculateFees({
      dailyRate: resource.dailyRate,
      days,
      deposit: resource.deposit,
    });

    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const newBorrowing = {
      id: serialNo,
      borrowerId: borrower.id,
      resourceId: resource.id,
      ownerId: owner.id,
      currentState: 1, // Requested -> Accepted -> Handover (1: Requested)
      timestamps: {
        requested: now.toISOString(),
        accepted: null,
        handover: null,
        borrowed: null,
        due: dueDate.toISOString(),
        returned: null,
        inspected: null,
        settled: null,
        rated: null,
      },
      isLate: false,
      deposit: resource.deposit,
      dailyRate: resource.dailyRate,
      totalDays: days,
      platformFee,
      totalAmount,
      notes: "Campus peer lending agreement confirmed.",
      conditionBefore: { score: resource.condition, notes: "Verified prior to handover" },
      conditionAfter: null,
      rating: null,
      dispute: null,
    };

    setTimeout(() => {
      onConfirm(newBorrowing);
    }, 1200);
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: "740px", margin: "0 auto" }}>
      {/* Top Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button className="btn-secondary" onClick={onBack}>
          ← Back to Resource
        </button>
        <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)" }}>
          OFFICIAL CAMPUS CONTRACT
        </span>
      </div>

      {/* Main Document Paper Card */}
      <div
        className="paper-card perforated-edge"
        style={{
          background: "var(--receipt)",
          color: "var(--receipt-text)",
          padding: "32px",
          position: "relative",
        }}
      >
        {/* Stamp Overlay on Confirmation */}
        {isConfirmed && (
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-12deg)",
              zIndex: 20,
              animation: "stampIn 0.4s ease-out forwards",
            }}
          >
            <div
              className="stamp stamp-green font-serif"
              style={{
                fontSize: "2rem",
                padding: "16px 32px",
                borderWidth: "4px",
                boxShadow: "0 0 20px rgba(59,138,90,0.4)",
              }}
            >
              ✓ AGREEMENT SEALED
            </div>
          </div>
        )}

        {/* Contract Header */}
        <div style={{ textAlign: "center", marginBottom: "24px", borderBottom: "2px solid var(--receipt-text)", paddingBottom: "16px" }}>
          <div className="stamp stamp-red font-serif" style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
            PEER BORROWING AGREEMENT
          </div>
          <h2 className="font-serif" style={{ fontSize: "1.6rem", color: "var(--receipt-text)" }}>
            Campus Circular Trust Contract
          </h2>
          <div className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", marginTop: "4px" }}>
            SERIAL NO: {serialNo} • DATE: {formatDate(new Date().toISOString())}
          </div>
        </div>

        {/* Parties (Side-by-side) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            background: "rgba(0,0,0,0.03)",
            padding: "16px",
            borderRadius: "var(--radius-sm)",
            marginBottom: "20px",
          }}
        >
          {/* Lender */}
          <div>
            <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--receipt-dim)", textTransform: "uppercase" }}>
              LENDER (OWNER)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
              <TrustBadge score={owner.trustScore} size="sm" showVerified={owner.verified} />
              <div>
                <strong style={{ fontSize: "0.95rem" }}>{owner.name}</strong>
                <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>
                  {owner.dept} ({owner.room})
                </div>
              </div>
            </div>
          </div>

          {/* Borrower */}
          <div style={{ borderLeft: "1px dashed var(--receipt-dim)", paddingLeft: "16px" }}>
            <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--receipt-dim)", textTransform: "uppercase" }}>
              BORROWER (YOU)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
              <TrustBadge score={borrower.trustScore} size="sm" showVerified={borrower.verified} />
              <div>
                <strong style={{ fontSize: "0.95rem" }}>{borrower.name}</strong>
                <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>
                  {borrower.dept} ({borrower.room})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Item Row */}
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }} className="font-mono">
              IDENTIFIED RESOURCE
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              {resource.emoji} {resource.name}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", display: "block" }} className="font-mono">
              DURATION (DAYS)
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="font-mono"
              style={{
                background: "#fff",
                border: "1px solid var(--receipt-dim)",
                borderRadius: "var(--radius-sm)",
                padding: "4px 8px",
                fontWeight: "bold",
              }}
            >
              {[1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Embedded Financial Fee Breakdown */}
        <FeeBreakdown dailyRate={resource.dailyRate} days={days} deposit={resource.deposit} />

        {/* Responsibilities Checkboxes */}
        <div style={{ margin: "24px 0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={checked1}
              onChange={(e) => setChecked1(e.target.checked)}
              style={{ accentColor: "var(--trust-green)", width: "18px", height: "18px" }}
            />
            <span>I agree to return the item on or before the agreed return deadline.</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={checked2}
              onChange={(e) => setChecked2(e.target.checked)}
              style={{ accentColor: "var(--trust-green)", width: "18px", height: "18px" }}
            />
            <span>I accept responsibility for inspection upon handover and reporting any pre-existing damage.</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={checked3}
              onChange={(e) => setChecked3(e.target.checked)}
              style={{ accentColor: "var(--trust-green)", width: "18px", height: "18px" }}
            />
            <span>I acknowledge the security deposit terms and potential late return fee deductions.</span>
          </label>
        </div>

        {/* Confirm Button */}
        <button
          className="btn-primary"
          disabled={!isFormValid || isConfirmed}
          onClick={handleConfirmClick}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "1.1rem",
            background: isFormValid ? "var(--ink-navy)" : "var(--receipt-dim)",
            color: "var(--receipt)",
            opacity: isFormValid ? 1 : 0.6,
            animation: isConfirmed ? "pressStamp 0.4s ease" : "none",
          }}
        >
          {isConfirmed ? "SEALED & PROCESSED ✓" : "CONFIRM & SEAL AGREEMENT →"}
        </button>
      </div>
    </div>
  );
}
