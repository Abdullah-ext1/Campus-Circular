import React, { useState } from "react";
import { getStudent } from "../data/mockData.js";

export default function CommunityBoard() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      studentId: 7, // Meera
      need: "Need a graphing calculator (TI-84) for Electronics lab exam on Friday!",
      postedAt: "2h ago",
      responses: 2,
    },
    {
      id: 2,
      studentId: 4, // Rohan
      need: "Looking for an audio interface (Focusrite Solo) for weekend recording project.",
      postedAt: "5h ago",
      responses: 1,
    },
    {
      id: 3,
      studentId: 8, // Siddharth
      need: "Anyone have a portable ring light for hostel room portrait shoot?",
      postedAt: "1d ago",
      responses: 3,
    },
  ]);

  const [newNeed, setNewNeed] = useState("");

  const handlePost = (e) => {
    e.preventDefault();
    if (newNeed.trim()) {
      const item = {
        id: Date.now(),
        studentId: 8, // current user Siddharth
        need: newNeed.trim(),
        postedAt: "Just now",
        responses: 0,
      };
      setRequests([item, ...requests]);
      setNewNeed("");
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: "800px", margin: "24px auto 0" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.75rem" }}>
          COMMUNITY REQUEST BOARD
        </span>
        <h2 className="font-serif" style={{ color: "var(--receipt)", marginTop: "4px" }}>
          Unmet Campus Need Dispatches
        </h2>
        <p style={{ color: "var(--receipt-dim)", fontSize: "0.9rem" }}>
          Can't find a listed resource in the catalog? Post your need and let campus peers respond.
        </p>
      </div>

      {/* Post Form */}
      <form
        onSubmit={handlePost}
        className="paper-card"
        style={{
          background: "var(--carbon)",
          border: "var(--border-slate)",
          padding: "20px",
          marginBottom: "24px",
          display: "flex",
          gap: "12px",
        }}
      >
        <input
          type="text"
          placeholder="Describe what gear or tool you're searching for..."
          value={newNeed}
          onChange={(e) => setNewNeed(e.target.value)}
          style={{
            flex: 1,
            background: "var(--ink-navy)",
            border: "var(--border-slate)",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            color: "var(--receipt)",
            fontSize: "0.9rem",
          }}
        />
        <button type="submit" className="btn-primary" style={{ padding: "10px 18px" }}>
          Post Need →
        </button>
      </form>

      {/* Requests Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {requests.map((req) => {
          const student = getStudent(req.studentId);
          return (
            <div
              key={req.id}
              className="paper-card"
              style={{
                background: "var(--carbon)",
                border: "var(--border-slate)",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--receipt)" }}>
                  {student.name} <span style={{ color: "var(--receipt-dim)", fontWeight: "normal" }}>({student.dept})</span>
                </div>
                <p style={{ color: "var(--receipt-dim)", fontSize: "0.9rem", marginTop: "4px" }}>
                  "{req.need}"
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ledger-gold)" }}>
                  {req.postedAt}
                </span>
                <button
                  className="btn-secondary"
                  style={{ display: "block", fontSize: "0.75rem", padding: "4px 10px", marginTop: "6px" }}
                >
                  I Can Help ({req.responses})
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
