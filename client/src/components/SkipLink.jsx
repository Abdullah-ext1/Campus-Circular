import React from "react";

export default function SkipLink({ targetId = "main-content", label = "Skip to main content" }) {
  return (
    <a href={`#${targetId}`} className="skip-to-content">
      {label}
    </a>
  );
}
