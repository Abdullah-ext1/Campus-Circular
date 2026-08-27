import React from "react";
import TrustBadge from "./TrustBadge.jsx";
import CategoryIcon from "./CategoryIcon.jsx";
import { MapPin } from "lucide-react";
import { getStudent, distances } from "../data/mockData.js";
import { formatCurrency } from "../utils/helpers.js";

export default function KitRecommendation({ kit, query, onBack, onSelectResource }) {
  if (!kit) return null;

  const totalDaily = kit.resources.reduce((sum, r) => sum + r.dailyRate, 0);
  const discountedDaily = Math.round(totalDaily * (1 - (kit.bundleDiscount || 0) / 100));

  return (
    <div className="animate-slide-up" style={{ maxWidth: "840px", margin: "0 auto" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <button className="btn-secondary" onClick={onBack}>
          ← Back to Dispatch
        </button>
        <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)" }}>
          PARSED INTENT: "{query}"
        </span>
      </div>

      {/* Kit Title Stamp */}
      <div
        className="paper-card"
        style={{
          background: "var(--carbon)",
          border: "var(--border-gold)",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.8rem" }}>
              AI MATCHED GEAR BUNDLE
            </span>
            <h1 className="font-serif" style={{ color: "var(--receipt)", marginTop: "8px" }}>
              {kit.name}
            </h1>
            <p style={{ color: "var(--receipt-dim)", fontSize: "0.95rem", marginTop: "4px" }}>
              {kit.description}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div className="font-mono" style={{ fontSize: "1.6rem", color: "var(--ledger-gold)", fontWeight: "bold" }}>
              {formatCurrency(discountedDaily)}
              <span style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", fontWeight: "normal" }}>/day</span>
            </div>
            {kit.bundleDiscount > 0 && (
              <span className="stamp stamp-green font-serif" style={{ fontSize: "0.7rem", marginTop: "4px" }}>
                SAVE {kit.bundleDiscount}% BUNDLE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Resource Luggage Tag Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
        <div className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", textTransform: "uppercase" }}>
          Bundle Manifest ({kit.resources.length} Verified Items):
        </div>

        {kit.resources.map((resource, index) => {
          const owner = getStudent(resource.ownerId);
          const distance = distances[resource.id] || "5 min walk";

          return (
            <React.Fragment key={resource.id}>
              {/* Connector line between items */}
              {index > 0 && (
                <div
                  style={{
                    height: "20px",
                    width: "2px",
                    borderLeft: "2px dashed var(--ledger-gold)",
                    margin: "-8px 0 -8px 48px",
                    zIndex: 1,
                  }}
                />
              )}

              {/* Resource Tag Card */}
              <div
                className="paper-card"
                onClick={() => onSelectResource(resource)}
                style={{
                  background: "var(--carbon)",
                  border: "1px solid var(--slate)",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--ledger-gold)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--slate)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {/* Left side: Tag hole cutout + item info */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "var(--ink-navy)",
                      border: "1px solid var(--slate)",
                    }}
                    title="Tag attachment ring"
                  />

                  <div style={{ padding: "8px", background: "rgba(0,0,0,0.25)", borderRadius: "var(--radius-md)", color: "var(--ledger-gold)" }}>
                    <CategoryIcon category={resource.category} size={24} />
                  </div>

                  <div>
                    <h3 className="font-serif" style={{ fontSize: "1.1rem", color: "var(--receipt)" }}>
                      {resource.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px", fontSize: "0.85rem", color: "var(--receipt-dim)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={12} /> {distance}
                      </span>
                      <span>•</span>
                      <span>Condition: {resource.condition}%</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Owner info + Price */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--receipt)" }}>
                        {owner.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>
                        {owner.dept}
                      </div>
                    </div>
                    <TrustBadge score={owner.trustScore} size="sm" showVerified={owner.verified} />
                  </div>

                  <div style={{ borderLeft: "1px solid var(--slate)", paddingLeft: "16px", textAlign: "right" }}>
                    <div className="font-mono" style={{ fontSize: "1.1rem", color: "var(--ledger-gold)", fontWeight: 600 }}>
                      {formatCurrency(resource.dailyRate)}
                    </div>
                    <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--receipt-dim)" }}>
                      / day
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Bundle Action Footer */}
      <div
        style={{
          marginTop: "32px",
          padding: "20px",
          background: "var(--carbon-light)",
          borderRadius: "var(--radius-md)",
          border: "var(--border-slate)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
            Ready to borrow from {new Set(kit.resources.map((r) => r.ownerId)).size} peer lenders?
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", marginTop: "2px" }}>
            Select an individual item above to review terms, or proceed with the primary kit item.
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => onSelectResource(kit.resources[0])}
        >
          Select Primary Item →
        </button>
      </div>
    </div>
  );
}
