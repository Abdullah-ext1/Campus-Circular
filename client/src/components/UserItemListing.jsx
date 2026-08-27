import React, { useState } from "react";
import { formatCurrency } from "../utils/helpers.js";

export default function UserItemListing({ currentUser, userResources, onAddResource, onDeleteResource }) {
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form State matching screenshot fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("camera");
  const [emoji, setEmoji] = useState("📷");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState(90);
  const [location, setLocation] = useState(currentUser?.room || "Hostel 4, Room 312");

  // Charges & Deposit Slip fields
  const [dailyRate, setDailyRate] = useState(150);
  const [hourlyRate, setHourlyRate] = useState(25);
  const [minCharge, setMinCharge] = useState(50);
  const [deposit, setDeposit] = useState(2000);
  const [maxDuration, setMaxDuration] = useState(5);

  // Accessories & Conditions
  const [accessoriesInput, setAccessoriesInput] = useState("24-105mm Lens, 2x Batteries, 64GB SD Card");
  const [borrowingConditions, setBorrowingConditions] = useState("Return with full battery charge. Handle with care.");
  const [tagsInput, setTagsInput] = useState("video, photo, camera");

  const categories = [
    { id: "camera", label: "📷 Camera & Video", emoji: "📷" },
    { id: "tripod", label: "📐 Tripod & Mount", emoji: "📐" },
    { id: "microphone", label: "🎤 Microphone & Audio", emoji: "🎤" },
    { id: "lighting", label: "💡 Studio Lighting", emoji: "💡" },
    { id: "laptop", label: "💻 Laptop & Computing", emoji: "💻" },
    { id: "tablet", label: "📱 Tablet & Drawing", emoji: "📱" },
    { id: "instrument", label: "🎸 Musical Instrument", emoji: "🎸" },
    { id: "projector", label: "📽️ Projector & Display", emoji: "📽️" },
    { id: "speaker", label: "🔊 Party Speaker & Sound", emoji: "🔊" },
    { id: "tool", label: "🔧 Workshop Tools", emoji: "🔧" },
    { id: "drone", label: "🚁 Drone & Aerial", emoji: "🚁" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const newResource = {
      id: Date.now(),
      name: name.trim(),
      category,
      emoji: categories.find((c) => c.id === category)?.emoji || emoji,
      ownerId: currentUser.id,
      condition: Number(condition),
      deposit: Number(deposit),
      hourlyRate: Number(hourlyRate),
      dailyRate: Number(dailyRate),
      minCharge: Number(minCharge),
      maxDuration: Number(maxDuration),
      description: description.trim(),
      tags: tagsInput.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      available: true,
      timesLent: 0,
      lastInspection: new Date().toISOString().split("T")[0],
      accessories: accessoriesInput.split(",").map((a) => a.trim()).filter(Boolean),
      borrowingConditions: borrowingConditions.trim(),
      location: location.trim(),
    };

    onAddResource(newResource);
    setSuccessMsg(`✓ "${name}" has been published to the Campus Catalog!`);

    // Reset Form
    setName("");
    setDescription("");
    setShowForm(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: "860px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.75rem" }}>
            LENDER ADMIN PORTAL
          </span>
          <h1 className="font-serif" style={{ color: "var(--receipt)", marginTop: "4px" }}>
            My Campus Gear Listings
          </h1>
          <p style={{ color: "var(--receipt-dim)", fontSize: "0.95rem" }}>
            List your unused cameras, laptops, tools, and instruments to earn peer trust and lending fees.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          style={{ padding: "10px 20px", fontSize: "0.95rem" }}
        >
          {showForm ? "← Back to My Listings" : "+ List New Gear →"}
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="stamp stamp-green font-serif" style={{ display: "block", width: "100%", padding: "12px", marginBottom: "24px", textAlign: "center" }}>
          {successMsg}
        </div>
      )}

      {/* CREATE NEW LISTING FORM */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Section 1: Item Overview */}
          <div className="paper-card" style={{ background: "var(--carbon)", border: "var(--border-slate)", padding: "24px" }}>
            <h3 className="font-serif" style={{ fontSize: "1.2rem", color: "var(--ledger-gold)", marginBottom: "16px" }}>
              1. Resource Specification
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div>
                <label className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", display: "block", marginBottom: "6px" }}>
                  ITEM NAME / TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. Canon EOS R6 Mark II"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    background: "var(--ink-navy)",
                    border: "var(--border-slate)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--receipt)",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              <div>
                <label className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", display: "block", marginBottom: "6px" }}>
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    const selectedCat = categories.find((c) => c.id === e.target.value);
                    if (selectedCat) setEmoji(selectedCat.emoji);
                  }}
                  className="font-mono"
                  style={{
                    width: "100%",
                    background: "var(--ink-navy)",
                    border: "var(--border-slate)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--receipt)",
                    fontSize: "0.95rem",
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", display: "block", marginBottom: "6px" }}>
                  CONDITION SCORE (% OK)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  style={{
                    width: "100%",
                    background: "var(--ink-navy)",
                    border: "var(--border-slate)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--receipt)",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              <div>
                <label className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", display: "block", marginBottom: "6px" }}>
                  PICKUP LOCATION / ROOM
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hostel 7, Room 108"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: "100%",
                    background: "var(--ink-navy)",
                    border: "var(--border-slate)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--receipt)",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", display: "block", marginBottom: "6px" }}>
                DESCRIPTION & USAGE NOTES
              </label>
              <textarea
                rows={3}
                placeholder="Full-frame mirrorless, great for video. Comes with kit lens..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{
                  width: "100%",
                  background: "var(--ink-navy)",
                  border: "var(--border-slate)",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--receipt)",
                  fontSize: "0.95rem",
                }}
              />
            </div>
          </div>

          {/* Section 2: Deposit & Charges Slip (Styled like the exact screenshot!) */}
          <div
            className="paper-card perforated-edge"
            style={{
              background: "var(--receipt)",
              color: "var(--receipt-text)",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid var(--receipt-text)", paddingBottom: "12px" }}>
              <span className="font-serif" style={{ fontSize: "1.3rem", fontWeight: "bold", letterSpacing: "1px" }}>
                DEPOSIT & CHARGES SLIP
              </span>
              <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)" }}>
                FORM CC-T2 (LENDER CONFIG)
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Daily Rate */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>Daily Rate</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="font-mono" style={{ fontWeight: "bold" }}>₹</span>
                  <input
                    type="number"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    className="font-mono"
                    style={{
                      width: "90px",
                      background: "#fff",
                      border: "1px solid var(--receipt-dim)",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  />
                  <span className="font-mono" style={{ fontSize: "0.85rem", color: "var(--receipt-dim)" }}>/ day</span>
                </div>
              </div>

              {/* Hourly Rate */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>Hourly Rate</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="font-mono" style={{ fontWeight: "bold" }}>₹</span>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="font-mono"
                    style={{
                      width: "90px",
                      background: "#fff",
                      border: "1px solid var(--receipt-dim)",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  />
                  <span className="font-mono" style={{ fontSize: "0.85rem", color: "var(--receipt-dim)" }}>/ hr</span>
                </div>
              </div>

              {/* Minimum Charge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>Minimum Charge</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="font-mono" style={{ fontWeight: "bold" }}>₹</span>
                  <input
                    type="number"
                    value={minCharge}
                    onChange={(e) => setMinCharge(e.target.value)}
                    className="font-mono"
                    style={{
                      width: "90px",
                      background: "#fff",
                      border: "1px solid var(--receipt-dim)",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  />
                </div>
              </div>

              {/* Security Deposit (Refundable) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dotted var(--receipt-dim)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--stamp-red)" }}>
                  Security Deposit (Refundable)
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="font-mono" style={{ fontWeight: "bold", color: "var(--stamp-red)" }}>₹</span>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className="font-mono"
                    style={{
                      width: "110px",
                      background: "#fff",
                      border: "1px solid var(--stamp-red)",
                      color: "var(--stamp-red)",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  />
                </div>
              </div>

              {/* Max Duration */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>Max Duration</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <select
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(e.target.value)}
                    className="font-mono"
                    style={{
                      background: "#fff",
                      border: "1px solid var(--receipt-dim)",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: "bold",
                    }}
                  >
                    {[1, 2, 3, 4, 5, 7, 10, 14].map((d) => (
                      <option key={d} value={d}>
                        {d} days
                      </option>
                    ))}
                  </select>
                  <span className="font-mono" style={{ fontSize: "0.85rem", color: "var(--receipt-dim)" }}>max</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Included Accessories & Borrowing Conditions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            <div className="paper-card" style={{ background: "var(--carbon)", border: "var(--border-slate)", padding: "20px" }}>
              <h3 className="font-serif" style={{ fontSize: "1.1rem", color: "var(--ledger-gold)", marginBottom: "12px" }}>
                Included Accessories
              </h3>
              <input
                type="text"
                placeholder="Comma separated: 24-105mm Lens, 2x Batteries, Carrying Bag"
                value={accessoriesInput}
                onChange={(e) => setAccessoriesInput(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--ink-navy)",
                  border: "var(--border-slate)",
                  padding: "10px",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--receipt)",
                  fontSize: "0.9rem",
                }}
              />
              <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginTop: "6px", display: "block" }}>
                Separated by commas. These will render as bullet points on item details.
              </span>
            </div>

            <div className="paper-card" style={{ background: "var(--carbon)", border: "var(--border-slate)", padding: "20px" }}>
              <h3 className="font-serif" style={{ fontSize: "1.1rem", color: "var(--stamp-red)", marginBottom: "12px" }}>
                Owner Borrowing Conditions
              </h3>
              <textarea
                rows={3}
                placeholder='e.g. "Return with full battery charge. Do not use under heavy rain without protective housing."'
                value={borrowingConditions}
                onChange={(e) => setBorrowingConditions(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--ink-navy)",
                  border: "var(--border-slate)",
                  padding: "10px",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--receipt)",
                  fontSize: "0.9rem",
                }}
              />
            </div>
          </div>

          {/* Section 4: Tags */}
          <div className="paper-card" style={{ background: "var(--carbon)", border: "var(--border-slate)", padding: "20px" }}>
            <label className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", display: "block", marginBottom: "6px" }}>
              SEARCH TAGS & KEYWORDS
            </label>
            <input
              type="text"
              placeholder="video, photo, camera, mirrorless"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              style={{
                width: "100%",
                background: "var(--ink-navy)",
                border: "var(--border-slate)",
                padding: "10px",
                borderRadius: "var(--radius-sm)",
                color: "var(--receipt)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          {/* Submit CTA */}
          <button type="submit" className="btn-primary" style={{ padding: "16px", fontSize: "1.1rem", width: "100%" }}>
            PUBLISH TO CAMPUS CATALOG →
          </button>
        </form>
      ) : (
        /* MY CURRENT LISTINGS LIST */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="font-mono" style={{ fontSize: "0.8rem", color: "var(--receipt-dim)" }}>
            MY ACTIVE LISTED ITEMS ({userResources.length}):
          </div>

          {userResources.map((item) => (
            <div
              key={item.id}
              className="paper-card"
              style={{
                background: "var(--carbon)",
                border: "var(--border-slate)",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "2.2rem" }}>{item.emoji}</span>
                <div>
                  <h3 className="font-serif" style={{ fontSize: "1.2rem", color: "var(--receipt)" }}>
                    {item.name}
                  </h3>
                  <div style={{ fontSize: "0.85rem", color: "var(--receipt-dim)", marginTop: "2px" }}>
                    Condition: {item.condition}% OK • {item.timesLent} times lent
                  </div>
                  <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ledger-gold)", marginTop: "4px" }}>
                    📍 {item.location}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "20px" }}>
                <div>
                  <div className="font-mono" style={{ fontSize: "1.2rem", color: "var(--ledger-gold)", fontWeight: "bold" }}>
                    {formatCurrency(item.dailyRate)}/day
                  </div>
                  <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--stamp-red)" }}>
                    Deposit: {formatCurrency(item.deposit)}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteResource(item.id)}
                  className="btn-secondary"
                  style={{ color: "var(--stamp-red)", borderColor: "var(--stamp-red)", padding: "6px 12px", fontSize: "0.8rem" }}
                >
                  Unlist ✕
                </button>
              </div>
            </div>
          ))}

          {userResources.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--receipt-dim)" }}>
              <div style={{ fontSize: "2rem" }}>📦</div>
              <div className="font-serif" style={{ fontSize: "1.2rem", marginTop: "12px", color: "var(--receipt)" }}>
                You haven't listed any gear yet
              </div>
              <p style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                Click "+ List New Gear" to put your camera, laptop, or instruments in campus circulation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
