import React from "react";
import TrustBadge from "./TrustBadge.jsx";
import CategoryIcon from "./CategoryIcon.jsx";
import { MapPin } from "lucide-react";
import { getStudent, distances } from "../data/mockData.js";
import { formatCurrency } from "../utils/helpers.js";

export default function ResourceCard({ resource, onSelect }) {
  if (!resource) return null;

  const owner = getStudent(resource.ownerId);
  const distance = distances[resource.id] || "5 min walk";

  return (
    <div
      className="paper-card"
      onClick={() => onSelect(resource)}
      style={{
        background: "var(--carbon)",
        border: "1px solid var(--slate)",
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--ledger-gold)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--slate)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div>
        {/* Top bar: Icon + Status badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div style={{ padding: "8px", background: "rgba(0,0,0,0.25)", borderRadius: "var(--radius-md)", color: "var(--ledger-gold)" }}>
            <CategoryIcon category={resource.category} size={24} />
          </div>
          {resource.available ? (
            <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--trust-green)", background: "var(--trust-green-bg)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>
              ● AVAILABLE
            </span>
          ) : (
            <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--stamp-red)", background: "var(--stamp-red-bg)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>
              IN USE
            </span>
          )}
        </div>

        {/* Name & Category */}
        <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--ledger-gold)", textTransform: "uppercase" }}>
          {resource.category}
        </div>
        <h3 className="font-serif" style={{ fontSize: "1.1rem", color: "var(--receipt)", marginTop: "2px", marginBottom: "8px" }}>
          {resource.name}
        </h3>

        <div style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <MapPin size={12} /> {distance}
          </span>
          <span>•</span>
          <span>Condition {resource.condition}%</span>
        </div>
      </div>

      {/* Footer: Owner & Price */}
      <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--slate)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <TrustBadge score={owner.trustScore} size="sm" showVerified={owner.verified} />
          <span style={{ fontSize: "0.8rem", color: "var(--receipt-dim)" }}>{owner.name.split(" ")[0]}</span>
        </div>

        <div className="font-mono" style={{ fontSize: "1rem", color: "var(--ledger-gold)", fontWeight: "bold" }}>
          {formatCurrency(resource.dailyRate)}<span style={{ fontSize: "0.7rem", color: "var(--receipt-dim)", fontWeight: "normal" }}>/day</span>
        </div>
      </div>
    </div>
  );
}
