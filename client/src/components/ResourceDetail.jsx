import React from "react";
import TrustBadge from "./TrustBadge.jsx";
import CategoryIcon from "./CategoryIcon.jsx";
import { MapPin } from "lucide-react";
import { getStudent, resources as allResources } from "../data/mockData.js";
import { formatCurrency, formatDate, suggestAlternatives } from "../utils/helpers.js";

export default function ResourceDetail({ resource, onBack, onStartBorrowing, onSelectResource }) {
  if (!resource) return null;

  const owner = getStudent(resource.ownerId);
  const alternatives = suggestAlternatives(resource, allResources);

  return (
    <div className="animate-slide-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Navigation Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--ledger-gold)" }}>
          RESOURCE SPECIFICATION #RES-00{resource.id}
        </span>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        {/* Top: Photo / Visual Box + Owner Profile */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {/* Photo Placeholder Box */}
          <div
            className="paper-card"
            style={{
              background: "var(--carbon)",
              border: "var(--border-slate)",
              height: "220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ padding: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius-lg)", color: "var(--ledger-gold)" }}>
              <CategoryIcon category={resource.category} size={64} />
            </div>
            <div
              className="stamp stamp-green font-serif"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                fontSize: "0.75rem",
              }}
            >
              CONDITION: {resource.condition}% OK
            </div>
            <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginTop: "12px" }}>
              Inspected: {formatDate(resource.lastInspection)}
            </div>
          </div>

          {/* Owner Profile Card */}
          <div
            className="paper-card"
            style={{
              background: "var(--carbon)",
              border: "1px solid var(--slate)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", textTransform: "uppercase", letterSpacing: "1px" }} className="font-mono">
                Item Owner & Custodian
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "12px" }}>
                <TrustBadge score={owner.trustScore} size="lg" showVerified={owner.verified} />
                <div>
                  <h3 className="font-serif" style={{ fontSize: "1.2rem", color: "var(--receipt)" }}>
                    {owner.name}
                  </h3>
                  <div style={{ fontSize: "0.85rem", color: "var(--receipt-dim)" }}>
                    {owner.dept} • Year {owner.year}
                  </div>
                  <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ledger-gold)", marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={12} /> {owner.room}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "1px solid var(--slate)",
                fontSize: "0.8rem",
                color: "var(--receipt-dim)",
              }}
            >
              <div>
                Exchanges: <strong style={{ color: "var(--receipt)" }}>{owner.lendCount} lent</strong>
              </div>
              <div>
                Joined: <strong style={{ color: "var(--receipt)" }}>{owner.joinedMonth}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>
            {resource.category.toUpperCase()}
          </span>
          <h1 className="font-serif" style={{ color: "var(--receipt)", marginTop: "4px" }}>
            {resource.name}
          </h1>
          <p style={{ color: "var(--receipt-dim)", fontSize: "1rem", marginTop: "12px" }}>
            {resource.description}
          </p>
        </div>

        {/* Deposit Slip Terms Card */}
        <div
          className="paper-card perforated-edge"
          style={{
            background: "var(--receipt)",
            color: "var(--receipt-text)",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span className="font-serif" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              DEPOSIT & CHARGES SLIP
            </span>
            <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>
              FORM CC-T2
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "4px" }}>
              <span>Daily Rate</span>
              <strong className="font-mono">{formatCurrency(resource.dailyRate)} / day</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "4px" }}>
              <span>Hourly Rate</span>
              <strong className="font-mono">{formatCurrency(resource.hourlyRate)} / hr</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "4px" }}>
              <span>Minimum Charge</span>
              <strong className="font-mono">{formatCurrency(resource.minCharge)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "4px" }}>
              <span>Security Deposit (Refundable)</span>
              <strong className="font-mono" style={{ color: "var(--stamp-red)" }}>{formatCurrency(resource.deposit)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "4px" }}>
              <span>Max Duration</span>
              <strong className="font-mono">{resource.maxDuration} days max</strong>
            </div>
          </div>
        </div>

        {/* Accessories & Conditions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          <div className="paper-card" style={{ background: "var(--carbon)", padding: "20px", border: "var(--border-slate)" }}>
            <h3 className="font-serif" style={{ fontSize: "1rem", color: "var(--ledger-gold)", marginBottom: "10px" }}>
              Included Accessories
            </h3>
            <ul style={{ listStyle: "circle", paddingLeft: "20px", color: "var(--receipt-dim)", fontSize: "0.85rem" }}>
              {resource.accessories?.map((acc, i) => (
                <li key={i} style={{ marginBottom: "4px" }}>{acc}</li>
              ))}
            </ul>
          </div>

          <div className="paper-card" style={{ background: "var(--carbon)", padding: "20px", border: "var(--border-slate)" }}>
            <h3 className="font-serif" style={{ fontSize: "1rem", color: "var(--stamp-red)", marginBottom: "10px" }}>
              Owner Borrowing Conditions
            </h3>
            <p style={{ color: "var(--receipt-dim)", fontSize: "0.85rem", fontStyle: "italic" }}>
              "{resource.borrowingConditions}"
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="btn-primary"
          onClick={() => onStartBorrowing(resource)}
          style={{ width: "100%", padding: "16px", fontSize: "1.1rem", marginTop: "12px" }}
        >
          Draft Borrowing Agreement →
        </button>

        {/* Alternatives Section */}
        {alternatives.length > 0 && (
          <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "var(--border-slate)" }}>
            <h3 className="font-serif" style={{ fontSize: "1.1rem", color: "var(--receipt-dim)", marginBottom: "16px" }}>
              Similar Campus Alternatives
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {alternatives.map((alt) => (
                <div
                  key={alt.id}
                  className="paper-card"
                  onClick={() => onSelectResource(alt)}
                  style={{
                    background: "var(--carbon)",
                    border: "var(--border-slate)",
                    padding: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div style={{ padding: "6px", background: "rgba(0,0,0,0.25)", borderRadius: "var(--radius-sm)", color: "var(--ledger-gold)", display: "flex", alignItems: "center" }}>
                    <CategoryIcon category={alt.category} size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--receipt)" }}>
                      {alt.name}
                    </div>
                    <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ledger-gold)" }}>
                      {formatCurrency(alt.dailyRate)}/day
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
