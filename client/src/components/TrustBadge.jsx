import React from "react";

export default function TrustBadge({ score = 90, size = "md", showVerified = false }) {
  let colorClass = "trust-green";
  if (score < 70) colorClass = "stamp-red";
  else if (score < 85) colorClass = "ledger-gold";

  const sizeStyles = {
    sm: { width: "24px", height: "24px", fontSize: "0.7rem", borderWidth: "1px" },
    md: { width: "36px", height: "36px", fontSize: "0.85rem", borderWidth: "2px" },
    lg: { width: "56px", height: "56px", fontSize: "1.2rem", borderWidth: "3px" },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        borderStyle: "solid",
        borderColor: `var(--${colorClass})`,
        color: `var(--${colorClass})`,
        background: `var(--${colorClass}-bg, rgba(201,168,76,0.1))`,
        fontWeight: "700",
        fontFamily: "var(--font-mono)",
        boxShadow: `0 0 8px var(--${colorClass}-bg)`,
        position: "relative",
        ...currentSize,
      }}
      title={`Trust Score: ${score}/100`}
    >
      <span>{score}</span>
      {showVerified && (
        <span
          style={{
            position: "absolute",
            bottom: "-2px",
            right: "-2px",
            background: "var(--trust-green)",
            color: "#fff",
            fontSize: "0.6rem",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✓
        </span>
      )}
    </div>
  );
}
