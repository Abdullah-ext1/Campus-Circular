import React, { useState } from "react";
import FeeBreakdown from "./FeeBreakdown.jsx";
import TrustBadge from "./TrustBadge.jsx";
import CategoryIcon from "./CategoryIcon.jsx";
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
    <div className="animate-slide-up" style={{ maxWidth: "740px", margin: "20px auto 40px" }}>
      {/* Top Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button className="btn-secondary" onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          ← Back to Resource
        </button>
        <span className="font-mono" style={{ fontSize: "0.78rem", color: "#666666", letterSpacing: "1px", textTransform: "uppercase" }}>
          Official Peer Contract
        </span>
      </div>

      {/* Main Document Card */}
      <div
        className="paper-card"
        style={{
          background: "#ffffff",
          color: "#111111",
          border: "1px solid #e0e0e0",
          borderRadius: "14px",
          padding: "36px",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Stamp Overlay on Confirmation */}
        {isConfirmed && (
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-10deg)",
              zIndex: 20,
              animation: "stampIn 0.4s ease-out forwards",
            }}
          >
            <div
              style={{
                fontSize: "1.8rem",
                padding: "16px 32px",
                border: "4px solid #111111",
                background: "#ffffff",
                color: "#111111",
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "2px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                borderRadius: "8px",
              }}
            >
              ✓ AGREEMENT SEALED
            </div>
          </div>
        )}

        {/* Contract Header */}
        <div style={{ textAlign: "center", marginBottom: "28px", borderBottom: "2px solid #111111", paddingBottom: "20px" }}>
          <div
            style={{
              display: "inline-block",
              background: "#f4f4f4",
              border: "1px solid #d4d4d4",
              color: "#111111",
              fontSize: "0.75rem",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              padding: "4px 12px",
              borderRadius: "4px",
              marginBottom: "10px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Peer Borrowing Agreement
          </div>
          <h1 className="font-serif" style={{ fontSize: "2rem", color: "#111111", margin: "4px 0" }}>
            Campus Circular Trust Contract
          </h1>
          <div className="font-mono" style={{ fontSize: "0.8rem", color: "#666666", marginTop: "6px" }}>
            CONTRACT NO: <strong>{serialNo}</strong> • CREATED: {formatDate(new Date().toISOString())}
          </div>
        </div>

        {/* Parties (Side-by-side) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            background: "#f9f9f9",
            border: "1px solid #eeeeee",
            padding: "18px",
            borderRadius: "10px",
            marginBottom: "24px",
          }}
        >
          {/* Lender */}
          <div>
            <div className="font-mono" style={{ fontSize: "0.72rem", color: "#888888", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              LENDER (OWNER)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
              <TrustBadge score={owner.trustScore} size="sm" showVerified={owner.verified} />
              <div>
                <strong style={{ fontSize: "0.95rem", color: "#111111", display: "block" }}>{owner.name}</strong>
                <div style={{ fontSize: "0.78rem", color: "#666666" }}>
                  {owner.dept} • {owner.room}
                </div>
              </div>
            </div>
          </div>

          {/* Borrower */}
          <div style={{ borderLeft: "1px dashed #dddddd", paddingLeft: "16px" }}>
            <div className="font-mono" style={{ fontSize: "0.72rem", color: "#888888", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              BORROWER (YOU)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
              <TrustBadge score={borrower.trustScore} size="sm" showVerified={borrower.verified} />
              <div>
                <strong style={{ fontSize: "0.95rem", color: "#111111", display: "block" }}>{borrower.name}</strong>
                <div style={{ fontSize: "0.78rem", color: "#666666" }}>
                  {borrower.dept} • {borrower.room}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Item Row */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            background: "#ffffff",
            border: "1px solid #e8e8e8",
            borderRadius: "10px",
          }}
        >
          <div>
            <div style={{ fontSize: "0.72rem", color: "#888888", letterSpacing: "0.5px" }} className="font-mono">
              IDENTIFIED RESOURCE
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", color: "#111111" }}>
              <CategoryIcon category={resource.category} size={20} />
              <span>{resource.name}</span>
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label style={{ fontSize: "0.72rem", color: "#888888", display: "block", marginBottom: "4px", letterSpacing: "0.5px" }} className="font-mono">
              DURATION (DAYS)
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="font-mono"
              style={{
                background: "#f8f8f8",
                border: "1px solid #cccccc",
                borderRadius: "6px",
                padding: "6px 12px",
                fontWeight: 700,
                color: "#111111",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              {[1, 2, 3, 4, 5, 7, 14].map((d) => (
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
        <div style={{ margin: "24px 0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.88rem" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", color: "#333333" }}>
            <input
              type="checkbox"
              checked={checked1}
              onChange={(e) => setChecked1(e.target.checked)}
              style={{ accentColor: "#000000", width: "18px", height: "18px", marginTop: "2px", flexShrink: 0 }}
            />
            <span>I agree to return the item on or before the agreed return deadline.</span>
          </label>

          <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", color: "#333333" }}>
            <input
              type="checkbox"
              checked={checked2}
              onChange={(e) => setChecked2(e.target.checked)}
              style={{ accentColor: "#000000", width: "18px", height: "18px", marginTop: "2px", flexShrink: 0 }}
            />
            <span>I accept responsibility for inspection upon handover and reporting any pre-existing damage.</span>
          </label>

          <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", color: "#333333" }}>
            <input
              type="checkbox"
              checked={checked3}
              onChange={(e) => setChecked3(e.target.checked)}
              style={{ accentColor: "#000000", width: "18px", height: "18px", marginTop: "2px", flexShrink: 0 }}
            />
            <span>I acknowledge the security deposit terms and potential late return fee deductions.</span>
          </label>
        </div>

        {/* Confirm Button */}
        <button
          type="button"
          disabled={!isFormValid || isConfirmed}
          onClick={handleConfirmClick}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.5px",
            background: isFormValid ? "#111111" : "#e0e0e0",
            color: isFormValid ? "#ffffff" : "#888888",
            border: isFormValid ? "1px solid #111111" : "1px solid #e0e0e0",
            borderRadius: "10px",
            cursor: isFormValid ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            boxShadow: isFormValid ? "0 4px 14px rgba(0, 0, 0, 0.15)" : "none",
          }}
        >
          {isConfirmed ? "SEALED & PROCESSED ✓" : "CONFIRM & SEAL AGREEMENT →"}
        </button>
      </div>
    </div>
  );
}
