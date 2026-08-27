import React from "react";
import TrustBadge from "./TrustBadge.jsx";

export default function UserProfile({ student }) {
  if (!student) return null;

  const { trustBreakdown } = student;

  return (
    <div className="animate-slide-up" style={{ maxWidth: "800px", margin: "20px auto 40px" }}>
      {/* Header Profile Card */}
      <div
        className="paper-card"
        style={{
          background: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "14px",
          padding: "32px",
          marginBottom: "24px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              className="avatar-circle"
              style={{ width: "72px", height: "72px", fontSize: "1.8rem", background: "#111111", color: "#ffffff", border: "2px solid #111111" }}
            >
              {student.initials}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 className="font-serif" style={{ fontSize: "2rem", color: "#111111" }}>
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

              <div style={{ color: "#666666", fontSize: "0.95rem", marginTop: "4px" }}>
                {student.dept} • Year {student.year} • {student.room}
              </div>
              <div className="font-mono" style={{ fontSize: "0.75rem", color: "#888888", marginTop: "4px" }}>
                Campus Member since {student.joinedMonth}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <TrustBadge score={student.trustScore} size="lg" showVerified={student.verified} />
            <div className="font-mono" style={{ fontSize: "0.72rem", color: "#888888", marginTop: "6px" }}>
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
            borderTop: "1px solid #eeeeee",
            textAlign: "center",
          }}
        >
          <div style={{ background: "#f8f8f8", padding: "14px", borderRadius: "8px", border: "1px solid #eeeeee" }}>
            <div className="font-mono" style={{ fontSize: "1.4rem", color: "#111111", fontWeight: "bold" }}>
              {student.borrowCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#666666", marginTop: "2px" }}>Borrowed</div>
          </div>

          <div style={{ background: "#f8f8f8", padding: "14px", borderRadius: "8px", border: "1px solid #eeeeee" }}>
            <div className="font-mono" style={{ fontSize: "1.4rem", color: "#257a4a", fontWeight: "bold" }}>
              {student.lendCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#666666", marginTop: "2px" }}>Lent Out</div>
          </div>

          <div style={{ background: "#f8f8f8", padding: "14px", borderRadius: "8px", border: "1px solid #eeeeee" }}>
            <div className="font-mono" style={{ fontSize: "1.4rem", color: "#111111", fontWeight: "bold" }}>
              ★ {student.avgRating}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#666666", marginTop: "2px" }}>Rating</div>
          </div>

          <div style={{ background: "#f8f8f8", padding: "14px", borderRadius: "8px", border: "1px solid #eeeeee" }}>
            <div
              className="font-mono"
              style={{
                fontSize: "1.4rem",
                color: student.lateReturns > 0 ? "#d9383a" : "#257a4a",
                fontWeight: "bold",
              }}
            >
              {student.lateReturns}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#666666", marginTop: "2px" }}>Late Returns</div>
          </div>
        </div>
      </div>

      {/* Trust Breakdown Bars */}
      <div
        className="paper-card"
        style={{
          background: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "14px",
          padding: "28px",
          marginBottom: "24px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
        }}
      >
        <h2 className="font-serif" style={{ fontSize: "1.2rem", color: "#111111", marginBottom: "18px" }}>
          Trust Metric Breakdown
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { label: "Reliability & Care", val: trustBreakdown?.reliability || 92 },
            { label: "Item Condition Maintenance", val: trustBreakdown?.condition || 95 },
            { label: "Communication Responsiveness", val: trustBreakdown?.communication || 90 },
            { label: "Timeliness & Return Punctuality", val: trustBreakdown?.timeliness || 88 },
          ].map((metric, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                <span style={{ color: "#333333" }}>{metric.label}</span>
                <span className="font-mono" style={{ color: "#111111", fontWeight: 700 }}>
                  {metric.val} / 100
                </span>
              </div>
              <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${metric.val}%`,
                    background: "#111111",
                    borderRadius: "999px",
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
