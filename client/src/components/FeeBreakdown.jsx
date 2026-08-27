import React from "react";
import { formatCurrency, calculateFees } from "../utils/helpers.js";

export default function FeeBreakdown({ dailyRate, days = 3, deposit = 0 }) {
  const { borrowingCharge, platformFee, totalAmount } = calculateFees({ dailyRate, days, deposit });

  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.04)",
        border: "1px dashed var(--receipt-dim)",
        borderRadius: "var(--radius-sm)",
        padding: "16px",
        margin: "16px 0",
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem",
      }}
    >
      <div style={{ textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold", marginBottom: "12px", borderBottom: "1px dashed var(--receipt-dim)", paddingBottom: "4px" }}>
        Financial Breakdown
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span>Borrowing Charge ({days} days)</span>
        <span>{formatCurrency(borrowingCharge)}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "var(--receipt-dim)" }}>
        <span>Platform Maintenance (5%)</span>
        <span>{formatCurrency(platformFee)}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "var(--stamp-red)" }}>
        <span>Security Deposit (Refundable)</span>
        <span>{formatCurrency(deposit)}</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          fontSize: "1.05rem",
          borderTop: "2px solid var(--receipt-text)",
          borderBottom: "2px double var(--receipt-text)",
          paddingTop: "6px",
          paddingBottom: "4px",
          marginTop: "8px",
        }}
      >
        <span>TOTAL DUE AT HANDOVER</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  );
}
