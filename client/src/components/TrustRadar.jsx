import React from "react";

export default function TrustRadar({ trustBreakdown }) {
  const { reliability = 90, condition = 94, communication = 88, timeliness = 82 } = trustBreakdown || {};

  // 4 axes: Top, Right, Bottom, Left
  const center = 100;
  const radius = 70;

  // Convert scores (0-100) to points
  const pTop = { x: center, y: center - (reliability / 100) * radius };
  const pRight = { x: center + (condition / 100) * radius, y: center };
  const pBottom = { x: center, y: center + (communication / 100) * radius };
  const pLeft = { x: center - (timeliness / 100) * radius, y: center };

  const pointsString = `${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`;

  return (
    <div style={{ textAlign: "center", margin: "16px 0" }}>
      <svg width="200" height="200" style={{ background: "transparent" }}>
        {/* Background Grid Circles / Lines */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--slate)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx={center} cy={center} r={radius * 0.5} fill="none" stroke="var(--slate)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="var(--slate)" strokeWidth="1" />
        <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="var(--slate)" strokeWidth="1" />

        {/* Data Polygon */}
        <polygon
          points={pointsString}
          fill="rgba(201, 168, 76, 0.25)"
          stroke="var(--ledger-gold)"
          strokeWidth="2"
        />

        {/* Axis Labels */}
        <text x={center} y={center - radius - 6} fill="var(--receipt-dim)" fontSize="9" textAnchor="middle" className="font-mono">
          Reliability
        </text>
        <text x={center + radius + 6} y={center + 3} fill="var(--receipt-dim)" fontSize="9" textAnchor="start" className="font-mono">
          Condition
        </text>
        <text x={center} y={center + radius + 14} fill="var(--receipt-dim)" fontSize="9" textAnchor="middle" className="font-mono">
          Communication
        </text>
        <text x={center - radius - 6} y={center + 3} fill="var(--receipt-dim)" fontSize="9" textAnchor="end" className="font-mono">
          Timeliness
        </text>
      </svg>
    </div>
  );
}
