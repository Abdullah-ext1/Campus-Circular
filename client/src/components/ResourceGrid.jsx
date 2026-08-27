import React, { useState, useMemo } from "react";
import ResourceCard from "./ResourceCard.jsx";
import { resources as initialResources } from "../data/mockData.js";
import { searchResources, filterResources, sortResources } from "../utils/helpers.js";

export default function ResourceGrid({ onSelectResource }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortKey, setSortKey] = useState("relevance");

  const categories = [
    { id: "all", label: "All Items" },
    { id: "camera", label: "📷 Cameras" },
    { id: "tripod", label: "📐 Tripods" },
    { id: "microphone", label: "🎤 Audio & Mics" },
    { id: "lighting", label: "💡 Lighting" },
    { id: "laptop", label: "💻 Laptops" },
    { id: "instrument", label: "🎸 Music" },
    { id: "projector", label: "📽️ Display" },
    { id: "speaker", label: "🔊 Speakers" },
    { id: "tool", label: "🔧 Tools" },
  ];

  const processedResources = useMemo(() => {
    let list = searchResources(searchTerm, initialResources);
    list = filterResources(list, { category: categoryFilter, availability: availabilityFilter });
    return sortResources(list, sortKey);
  }, [searchTerm, categoryFilter, availabilityFilter, sortKey]);

  return (
    <div className="animate-slide-up" style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Search & Header Bar */}
      <div style={{ marginBottom: "24px" }}>
        <h1 className="font-serif" style={{ color: "var(--receipt)", marginBottom: "8px" }}>
          Campus Inventory Catalog
        </h1>
        <p style={{ color: "var(--receipt-dim)", fontSize: "0.95rem" }}>
          Browse available gear shared by verified campus peers.
        </p>

        {/* Input & Sort Row */}
        <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search items, tags, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="font-sans"
            style={{
              flex: 1,
              minWidth: "240px",
              background: "var(--carbon)",
              border: "var(--border-slate)",
              padding: "10px 16px",
              borderRadius: "var(--radius-md)",
              color: "var(--receipt)",
            }}
          />

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="font-mono"
            style={{
              background: "var(--carbon)",
              border: "var(--border-slate)",
              padding: "10px 16px",
              borderRadius: "var(--radius-md)",
              color: "var(--receipt)",
            }}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="trust">Sort: Highest Trust</option>
            <option value="rate_low">Price: Low to High</option>
            <option value="rate_high">Price: High to Low</option>
            <option value="condition">Best Condition</option>
          </select>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "16px 0 8px 0" }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className="btn-secondary"
              style={{
                fontSize: "0.8rem",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                borderColor: categoryFilter === cat.id ? "var(--ledger-gold)" : "var(--slate)",
                color: categoryFilter === cat.id ? "var(--ledger-gold)" : "var(--receipt)",
                background: categoryFilter === cat.id ? "var(--ledger-gold-bg)" : "var(--carbon)",
                whiteSpace: "nowrap",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Status Counter */}
      <div className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", marginBottom: "16px" }}>
        SHOWING {processedResources.length} OF {initialResources.length} CAMPUS RESOURCES
      </div>

      {/* Items Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
        {processedResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} onSelect={onSelectResource} />
        ))}
      </div>

      {processedResources.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--receipt-dim)" }}>
          <div style={{ fontSize: "2rem" }}>🔍</div>
          <div className="font-serif" style={{ fontSize: "1.2rem", marginTop: "12px", color: "var(--receipt)" }}>
            No resources matched your criteria
          </div>
          <p style={{ fontSize: "0.9rem", marginTop: "4px" }}>
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
}
