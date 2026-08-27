import React, { useState } from "react";
import { students as initialStudents, resources as initialResources, disputes as initialDisputes } from "../data/mockData.js";
import { formatCurrency, formatDate } from "../utils/helpers.js";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview"); // overview | users | resources | disputes | fees
  const [students, setStudents] = useState(initialStudents);
  const [resources, setResources] = useState(initialResources);
  const [disputesList, setDisputesList] = useState(initialDisputes);

  const toggleVerify = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, verified: !s.verified } : s))
    );
  };

  const resolveDispute = (id) => {
    setDisputesList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "resolved" } : d))
    );
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Admin Title Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.75rem", marginBottom: "4px" }}>
            CAMPUS GOVERNANCE
          </span>
          <h1 className="font-serif" style={{ color: "var(--receipt)" }}>
            Platform Administration Panel
          </h1>
        </div>

        <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--trust-green)" }}>
          ● LIVE GOVERNANCE SYSTEM
        </span>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "var(--border-slate)", paddingBottom: "12px", marginBottom: "24px" }}>
        {[
          { id: "overview", label: "Overview Metrics" },
          { id: "users", label: `User Verification (${students.length})` },
          { id: "resources", label: `Catalog Flags (${resources.length})` },
          { id: "disputes", label: `Disputes Board (${disputesList.filter((d) => d.status !== "resolved").length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn-secondary"
            style={{
              borderColor: activeTab === tab.id ? "var(--ledger-gold)" : "var(--slate)",
              color: activeTab === tab.id ? "var(--ledger-gold)" : "var(--receipt-dim)",
              fontSize: "0.85rem",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <div className="paper-card" style={{ background: "var(--carbon)", padding: "20px", border: "var(--border-slate)" }}>
            <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>TOTAL REGISTERED STUDENTS</div>
            <div className="font-mono" style={{ fontSize: "2rem", color: "var(--receipt)", fontWeight: "bold", marginTop: "4px" }}>
              {students.length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--trust-green)", marginTop: "4px" }}>
              {students.filter((s) => s.verified).length} Verified Accounts
            </div>
          </div>

          <div className="paper-card" style={{ background: "var(--carbon)", padding: "20px", border: "var(--border-slate)" }}>
            <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>CATALOGED RESOURCES</div>
            <div className="font-mono" style={{ fontSize: "2rem", color: "var(--ledger-gold)", fontWeight: "bold", marginTop: "4px" }}>
              {resources.length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", marginTop: "4px" }}>
              Across 10 Campus Categories
            </div>
          </div>

          <div className="paper-card" style={{ background: "var(--carbon)", padding: "20px", border: "var(--border-slate)" }}>
            <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>ACTIVE GOVERNANCE DISPUTES</div>
            <div className="font-mono" style={{ fontSize: "2rem", color: "var(--stamp-red)", fontWeight: "bold", marginTop: "4px" }}>
              {disputesList.filter((d) => d.status !== "resolved").length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--stamp-red)", marginTop: "4px" }}>
              Requires Board Action
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="paper-card" style={{ background: "var(--carbon)", padding: "20px", border: "var(--border-slate)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--slate)", color: "var(--receipt-dim)" }}>
                  <th style={{ padding: "8px" }}>Student Name</th>
                  <th style={{ padding: "8px" }}>Dept & Year</th>
                  <th style={{ padding: "8px" }}>Trust Score</th>
                  <th style={{ padding: "8px" }}>Late Returns</th>
                  <th style={{ padding: "8px" }}>Status</th>
                  <th style={{ padding: "8px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "10px 8px", fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: "10px 8px", color: "var(--receipt-dim)" }}>{s.dept} (Yr {s.year})</td>
                    <td style={{ padding: "10px 8px" }} className="font-mono">{s.trustScore}</td>
                    <td style={{ padding: "10px 8px", color: s.lateReturns > 0 ? "var(--stamp-red)" : "inherit" }}>
                      {s.lateReturns}
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      {s.verified ? (
                        <span style={{ color: "var(--trust-green)" }}>✓ Verified</span>
                      ) : (
                        <span style={{ color: "var(--ledger-gold)" }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <button
                        onClick={() => toggleVerify(s.id)}
                        className="btn-secondary"
                        style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                      >
                        {s.verified ? "Unverify" : "Approve ✓"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === "disputes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {disputesList.map((disp) => (
            <div
              key={disp.id}
              className="paper-card"
              style={{
                background: "var(--carbon)",
                border: disp.status === "resolved" ? "1px solid var(--slate)" : "1px solid var(--stamp-red)",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span className="stamp stamp-red font-serif" style={{ fontSize: "0.7rem" }}>
                    DISPUTE #{disp.id}
                  </span>
                  <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginLeft: "12px" }}>
                    Filed: {formatDate(disp.filedAt)}
                  </span>
                </div>

                {disp.status === "resolved" ? (
                  <span className="stamp stamp-green font-serif" style={{ fontSize: "0.7rem" }}>
                    RESOLVED
                  </span>
                ) : (
                  <button className="btn-primary" onClick={() => resolveDispute(disp.id)} style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
                    Mark Resolved ✓
                  </button>
                )}
              </div>

              <p style={{ color: "var(--receipt)", fontSize: "0.9rem", marginTop: "12px" }}>
                "{disp.description}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
