import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Star, RefreshCw, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { getStudent, resources as allResources } from "../data/mockData.js";
import "./PublicProfile.css";

/**
 * Generate a smooth linear gradient based on student name hash
 */
function generateGradientFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 40 + (hash % 60)) % 360;

  return `linear-gradient(135deg, hsl(${hue1}, 65%, 45%), hsl(${hue2}, 70%, 30%))`;
}

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const studentId = parseInt(id, 10) || 2;
  const student = getStudent(studentId);

  if (!student) {
    return (
      <div className="profile-page-root">
        <div className="profile-not-found">
          <h2>Student Profile Not Found</h2>
          <button onClick={() => navigate("/")} className="btn-back">
            ← Return to Landing Page
          </button>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const headerGradient = generateGradientFromName(student.name);
  const successfulReturns = Math.max(0, (student.borrowCount || 10) - (student.lateReturns || 0));
  const disputesCount = student.disputes !== undefined ? student.disputes : 0;
  const userItems = allResources.filter((r) => r.ownerId === student.id);

  return (
    <div className="profile-page-root">
      {/* Top Navbar */}
      <header className="profile-navbar">
        <button onClick={() => navigate(-1)} className="profile-nav-back">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <span className="profile-navbar-title">STUDENT TRUST LEDGER</span>
        <button onClick={() => navigate("/app")} className="profile-nav-app">
          Open App
        </button>
      </header>

      {/* Hero Header with Dynamic Gradient */}
      <section className="profile-hero-banner" style={{ background: headerGradient }}>
        <div className="profile-hero-overlay" />
        <div className="profile-hero-content">
          <div className="profile-avatar-large">
            {student.initials}
          </div>

          <div className="profile-header-info">
            <div className="profile-name-row">
              <h1 className="profile-name">{student.name}</h1>
              {student.verified ? (
                <span className="verification-badge verified">
                  <ShieldCheck size={14} /> VERIFIED STUDENT
                </span>
              ) : (
                <span className="verification-badge unverified">
                  UNVERIFIED
                </span>
              )}
            </div>

            <p className="profile-academic-meta">
              Department of {student.dept} • Year {student.year} Student
            </p>
            <p className="profile-location-meta">
              📍 Residence: {student.room} • Member since {student.joinedMonth}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area (Monochrome White & Black) */}
      <main className="profile-main-container">
        {/* Core Metrics Grid */}
        <section className="metrics-grid-section">
          <div className="metric-box highlighted">
            <div className="metric-header">
              <ShieldCheck size={18} />
              <span>Trust Score</span>
            </div>
            <div className="metric-value-large">{student.trustScore}</div>
            <div className="metric-subtext">out of 100 points</div>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <Star size={18} />
              <span>Average Rating</span>
            </div>
            <div className="metric-value">★ {student.avgRating || 4.8}</div>
            <div className="metric-subtext">from peer exchanges</div>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <CheckCircle size={18} />
              <span>Successful Returns</span>
            </div>
            <div className="metric-value">{successfulReturns}</div>
            <div className="metric-subtext">on-time handovers</div>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <AlertTriangle size={18} />
              <span>Disputes</span>
            </div>
            <div className={`metric-value ${disputesCount > 0 ? "warning" : "clean"}`}>
              {disputesCount}
            </div>
            <div className="metric-subtext">
              {disputesCount === 0 ? "Clean record" : "Recorded disputes"}
            </div>
          </div>
        </section>

        {/* Breakdown & Exchange History */}
        <div className="profile-columns-grid">
          {/* Left Column: Trust Metric Breakdown */}
          <div className="profile-card">
            <h3 className="card-heading">Trust Metric Breakdown</h3>
            <div className="breakdown-list">
              {[
                { label: "Reliability & Care", value: student.trustBreakdown?.reliability || 92 },
                { label: "Item Condition Maintenance", value: student.trustBreakdown?.condition || 95 },
                { label: "Communication Responsiveness", value: student.trustBreakdown?.communication || 90 },
                { label: "Timeliness & Punctuality", value: student.trustBreakdown?.timeliness || 88 },
              ].map((item, idx) => (
                <div key={idx} className="breakdown-row">
                  <div className="breakdown-labels">
                    <span>{item.label}</span>
                    <span className="breakdown-val">{item.value}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="exchange-summary-box">
              <div className="summary-col">
                <span className="sum-num">{student.lendCount || 0}</span>
                <span className="sum-label">Items Lent</span>
              </div>
              <div className="summary-col">
                <span className="sum-num">{student.borrowCount || 0}</span>
                <span className="sum-label">Items Borrowed</span>
              </div>
              <div className="summary-col">
                <span className="sum-num">{student.lateReturns || 0}</span>
                <span className="sum-label">Late Returns</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Listed Gear */}
          <div className="profile-card">
            <div className="card-header-flex">
              <h3 className="card-heading">Listed Campus Gear</h3>
              <span className="gear-count-badge">
                <Package size={14} /> {userItems.length} Available
              </span>
            </div>

            {userItems.length === 0 ? (
              <div className="no-items-placeholder">
                <p>No active equipment listed at the moment.</p>
              </div>
            ) : (
              <div className="user-gear-list">
                {userItems.map((item) => (
                  <div
                    key={item.id}
                    className="user-gear-card"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img
                      src={item.image || "https://pngimg.com/uploads/photo_camera/photo_camera_PNG101641.png"}
                      alt={item.name}
                      className="user-gear-thumb"
                    />
                    <div className="user-gear-info">
                      <h4 className="user-gear-title">{item.name}</h4>
                      <span className="user-gear-cat">{item.category.toUpperCase()}</span>
                      <div className="user-gear-rate">₹{item.dailyRate}/day</div>
                    </div>
                    <button className="btn-view-item">View →</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="profile-footer">
        <span>© 2026 Campus Circular • Verified Peer Profile</span>
      </footer>
    </div>
  );
}
