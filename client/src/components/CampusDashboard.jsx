import React from "react";
import { dashboardMetrics } from "../data/mockData.js";
import { formatCurrency } from "../utils/helpers.js";

export default function CampusDashboard({ onClose }) {
  const { activeMembers, totalResources, totalExchanges, moneySaved, popularCategories, topLenders } = dashboardMetrics;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(27,33,65,0.95)",
        backdropFilter: "blur(10px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <div
        className="paper-card animate-slide-up"
        style={{
          background: "var(--carbon)",
          border: "var(--border-gold)",
          maxWidth: "800px",
          width: "100%",
          padding: "28px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.75rem" }}>
              CAMPUS CIRCULATION IMPACT
            </span>
            <h2 className="font-serif" style={{ color: "var(--receipt)", marginTop: "4px" }}>
              Collective Community Statistics
            </h2>
          </div>

          <button
            className="btn-secondary"
            onClick={onClose}
            style={{ fontSize: "1.2rem", padding: "4px 12px" }}
          >
            ✕
          </button>
        </div>

        {/* Hero Impact Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "var(--radius-md)", border: "var(--border-slate)" }}>
            <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>COMMUNITY SAVINGS</div>
            <div className="font-mono" style={{ fontSize: "1.6rem", color: "var(--trust-green)", fontWeight: "bold", marginTop: "4px" }}>
              {formatCurrency(moneySaved)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginTop: "2px" }}>Saved by students</div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "var(--radius-md)", border: "var(--border-slate)" }}>
            <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>TOTAL EXCHANGES</div>
            <div className="font-mono" style={{ fontSize: "1.6rem", color: "var(--ledger-gold)", fontWeight: "bold", marginTop: "4px" }}>
              {totalExchanges}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginTop: "2px" }}>Completed lendings</div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "var(--radius-md)", border: "var(--border-slate)" }}>
            <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>ACTIVE MEMBERS</div>
            <div className="font-mono" style={{ fontSize: "1.6rem", color: "var(--receipt)", fontWeight: "bold", marginTop: "4px" }}>
              {activeMembers}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginTop: "2px" }}>Verified peers</div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "var(--radius-md)", border: "var(--border-slate)" }}>
            <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>SHARED ITEMS</div>
            <div className="font-mono" style={{ fontSize: "1.6rem", color: "var(--receipt)", fontWeight: "bold", marginTop: "4px" }}>
              {totalResources}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginTop: "2px" }}>Listed in catalog</div>
          </div>
        </div>

        {/* Popular Categories Horizontal Bar Chart (CSS-Only) */}
        <div style={{ marginBottom: "28px" }}>
          <h3 className="font-serif" style={{ fontSize: "1.1rem", color: "var(--receipt)", marginBottom: "16px" }}>
            Most Circulated Categories
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {popularCategories.map((cat, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                  <span>{cat.name}</span>
                  <span className="font-mono" style={{ color: "var(--ledger-gold)" }}>
                    {cat.count} loans ({cat.percentage}%)
                  </span>
                </div>
                <div style={{ height: "10px", background: "var(--slate)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${cat.percentage * 2.5}%`,
                      background: "var(--ledger-gold)",
                      borderRadius: "var(--radius-full)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Lenders Leaderboard */}
        <div>
          <h3 className="font-serif" style={{ fontSize: "1.1rem", color: "var(--receipt)", marginBottom: "12px" }}>
            🏆 Top Campus Lenders Leaderboard
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {topLenders.map((lender, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(0,0,0,0.2)",
                  padding: "10px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--slate)",
                  fontSize: "0.85rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="font-mono" style={{ fontWeight: "bold", color: "var(--ledger-gold)" }}>
                    #{i + 1}
                  </span>
                  <span>{lender.name}</span>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <span style={{ color: "var(--receipt-dim)" }}>
                    <strong style={{ color: "var(--receipt)" }}>{lender.count}</strong> items lent
                  </span>
                  <span className="font-mono" style={{ color: "var(--trust-green)" }}>
                    {lender.trust} Trust
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
