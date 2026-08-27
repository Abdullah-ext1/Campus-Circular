import React from "react";
import { formatCurrency, calculateFees } from "../utils/helpers.js";

export default function FeeBreakdown({ dailyRate, days = 3, deposit = 0 }) {
  const { borrowingCharge, platformFee, totalAmount } = calculateFees({ dailyRate, days, deposit });

  return (
    <div
      style={{
        background: "#f9f9f9",
        border: "1px dashed #cccccc",
        borderRadius: "8px",
        padding: "16px 20px",
        margin: "18px 0",
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem",
      }}
    >
      <div style={{ textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginBottom: "12px", borderBottom: "1px dashed #dddddd", paddingBottom: "6px", color: "#111111" }}>
        Financial Calculation Summary
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "#333333" }}>
        <span>Borrowing Fee ({days} {days === 1 ? "day" : "days"})</span>
        <span style={{ fontWeight: 600 }}>{formatCurrency(borrowingCharge)}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "#666666" }}>
        <span>Platform Protocol (5%)</span>
        <span>{formatCurrency(platformFee)}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#111111" }}>
        <span>Security Deposit (Refundable)</span>
        <span style={{ fontWeight: 600 }}>{formatCurrency(deposit)}</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 800,
          fontSize: "1.05rem",
          borderTop: "2px solid #111111",
          borderBottom: "2px double #111111",
          paddingTop: "8px",
          paddingBottom: "6px",
          marginTop: "10px",
          color: "#111111",
        }}
      >
        <span>TOTAL DUE AT HANDOVER</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  );
}
