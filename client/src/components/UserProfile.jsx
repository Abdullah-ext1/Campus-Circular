import React from "react";
import TrustBadge from "./TrustBadge.jsx";

export default function UserProfile({ student }) {
  if (!student) return null;

  const { trustBreakdown } = student;

  return (
    <div className="animate-slide-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Header Profile Card */}
      <div
        className="paper-card"
        style={{
          background: "var(--carbon)",
          border: "var(--border-slate)",
          padding: "28px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              className="avatar-circle"
              style={{ width: "72px", height: "72px", fontSize: "1.8rem", border: "2px solid var(--ledger-gold)" }}
            >
              {student.initials}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 className="font-serif" style={{ fontSize: "2rem", color: "var(--receipt)" }}>
                  {student.name}
                </h1>
                {student.verified ? (
                  <span className="stamp stamp-green font-serif" style={{ fontSize: "0.65rem" }}>
                    ✓ VERIFIED STUDENT
                  </span>
                ) : (
                  <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.65rem" }}>
                    UNVERIFIED
                  </span>
                )}
              </div>

              <div style={{ color: "var(--receipt-dim)", fontSize: "0.95rem", marginTop: "4px" }}>
                {student.dept} • Year {student.year} • {student.room}
              </div>
              <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ledger-gold)", marginTop: "4px" }}>
                Campus Member since {student.joinedMonth}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <TrustBadge score={student.trustScore} size="lg" showVerified={student.verified} />
            <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginTop: "6px" }}>
              CUMULATIVE TRUST SCORE
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            gap: "12px",
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "var(--border-slate)",
            textAlign: "center",
          }}
        >
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
            <div className="font-mono" style={{ fontSize: "1.4rem", color: "var(--ledger-gold)", fontWeight: "bold" }}>
              {student.borrowCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>Borrowed</div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
            <div className="font-mono" style={{ fontSize: "1.4rem", color: "var(--trust-green)", fontWeight: "bold" }}>
              {student.lendCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>Lent Out</div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
            <div className="font-mono" style={{ fontSize: "1.4rem", color: "var(--receipt)", fontWeight: "bold" }}>
              ★ {student.avgRating}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>Rating</div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
            <div
              className="font-mono"
              style={{
                fontSize: "1.4rem",
                color: student.lateReturns > 0 ? "var(--stamp-red)" : "var(--trust-green)",
                fontWeight: "bold",
              }}
            >
              {student.lateReturns}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>Late Returns</div>
          </div>
        </div>
      </div>

      {/* Trust Breakdown Bars */}
      <div
        className="paper-card"
        style={{
          background: "var(--carbon)",
          border: "var(--border-slate)",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h3 className="font-serif" style={{ fontSize: "1.2rem", color: "var(--receipt)", marginBottom: "16px" }}>
          Trust Metric Breakdown
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { label: "Reliability & Care", val: trustBreakdown?.reliability || 92 },
            { label: "Item Condition Maintenance", val: trustBreakdown?.condition || 95 },
            { label: "Communication Responsiveness", val: trustBreakdown?.communication || 90 },
            { label: "Timeliness & Return Punctuality", val: trustBreakdown?.timeliness || 88 },
          ].map((metric, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                <span>{metric.label}</span>
                <span className="font-mono" style={{ color: "var(--ledger-gold)" }}>
                  {metric.val} / 100
                </span>
              </div>
              <div style={{ height: "8px", background: "var(--slate)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${metric.val}%`,
                    background: "var(--ledger-gold)",
                    borderRadius: "var(--radius-full)",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
