import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Settings,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getAdminOverview } from "../utils/api.js";
import { resources as mockResources, students as mockStudents, sampleBorrowings } from "../data/mockData.js";
import "./AdminPage.css";

export default function AdminPage() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("overview"); // overview | resources | users | disputes | config
  const [stats, setStats] = useState({
    totalListings: mockResources.length,
    activeBorrows: sampleBorrowings.length,
    registeredUsers: mockStudents.length,
    openDisputes: 1,
  });

  // Local state for interactive moderation actions
  const [resourcesList, setResourcesList] = useState(mockResources);
  const [usersList, setUsersList] = useState(mockStudents);
  const [disputesList, setDisputesList] = useState([
    {
      id: "DISP-2026-009",
      resourceName: "Sony A7 III Mirrorless Camera",
      lender: "Siddharth Joshi",
      borrower: "Aarav Sharma",
      type: "Minor Scratch Reported",
      claimedAmount: "₹1,200",
      status: "pending",
      date: "26 Aug 2026",
    },
    {
      id: "DISP-2026-004",
      resourceName: "Manfrotto Tripod",
      lender: "Priya Sharma",
      borrower: "Rohan Kapoor",
      type: "Late Return (48hrs)",
      claimedAmount: "₹350",
      status: "resolved",
      date: "20 Aug 2026",
    },
  ]);

  const [config, setConfig] = useState({
    platformFeePercent: 5,
    maxBorrowDays: 14,
    minTrustScoreForListing: 60,
    disputeGraceHours: 24,
  });

  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  useEffect(() => {
    getAdminOverview().then((res) => {
      if (res) setStats(res);
    });
  }, []);

  // Actions
  const handleToggleResourceStatus = (id) => {
    setResourcesList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isApproved = r.isApproved !== false;
          return { ...r, isApproved: !isApproved };
        }
        return r;
      })
    );
  };

  const handleToggleUserSuspension = (studentId) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === studentId) {
          return { ...u, isSuspended: !u.isSuspended };
        }
        return u;
      })
    );
  };

  const handleResolveDispute = (disputeId) => {
    setDisputesList((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: "resolved" } : d))
    );
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setConfigSavedNotice(true);
    setTimeout(() => setConfigSavedNotice(false), 3000);
  };

  return (
    <div className="admin-root">
      {/* Top Navbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button className="admin-back-btn" onClick={() => navigate("/explore")}>
            <ArrowLeft size={16} />
            <span>{t.nav.explore}</span>
          </button>
          <div className="admin-brand">{t.nav.brand}</div>
          <span className="admin-badge-pill">{t.nav.admin}</span>
        </div>

        <div className="admin-topbar-right">
          <div className="admin-lang-picker">
            <span className={lang === "EN" ? "active" : ""} onClick={() => setLang("EN")}>
              EN
            </span>
            <span className={lang === "HI" ? "active" : ""} onClick={() => setLang("HI")}>
              हिंदी
            </span>
            <span className={lang === "MR" ? "active" : ""} onClick={() => setLang("MR")}>
              मराठी
            </span>
          </div>

          <div className="admin-user-pill">
            <ShieldCheck size={16} />
            <span>{user?.name || "Administrator"}</span>
          </div>
        </div>
      </header>

      {/* Main Admin Body: Left Tab Nav + Right Content */}
      <div className="admin-layout container">
        <aside className="admin-sidebar-nav">
          <div className="admin-sidebar-header">
            <h3>Control Center</h3>
          </div>

          <button
            className={`admin-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <TrendingUp size={16} />
            <span>{t.admin.tabOverview}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "resources" ? "active" : ""}`}
            onClick={() => setActiveTab("resources")}
          >
            <Package size={16} />
            <span>{t.admin.tabResources}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={16} />
            <span>{t.admin.tabUsers}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "disputes" ? "active" : ""}`}
            onClick={() => setActiveTab("disputes")}
          >
            <AlertTriangle size={16} />
            <span>{t.admin.tabDisputes}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "config" ? "active" : ""}`}
            onClick={() => setActiveTab("config")}
          >
            <Settings size={16} />
            <span>{t.admin.tabConfig}</span>
          </button>
        </aside>

        <main className="admin-content">
          {/* Header Title */}
          <div className="admin-section-header">
            <h2>{t.admin.title}</h2>
            <p>{t.admin.subtitle}</p>
          </div>

          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="admin-overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">{t.admin.totalListings}</div>
                  <div className="stat-value">{resourcesList.length}</div>
                  <div className="stat-meta">+4 added this week</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">{t.admin.activeBorrows}</div>
                  <div className="stat-value">{stats.activeBorrows}</div>
                  <div className="stat-meta">100% on-time return rate</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">{t.admin.registeredUsers}</div>
                  <div className="stat-value">{usersList.length}</div>
                  <div className="stat-meta">Verified campus students</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">{t.admin.openDisputes}</div>
                  <div className="stat-value">{disputesList.filter((d) => d.status === "pending").length}</div>
                  <div className="stat-meta">Requires moderator review</div>
                </div>
              </div>

              {/* Activity Table */}
              <div className="admin-card-box">
                <h3 className="box-title">Recent Protocol Transactions</h3>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>TRANSACTION ID</th>
                        <th>ITEM NAME</th>
                        <th>LENDER</th>
                        <th>BORROWER</th>
                        <th>DURATION</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleBorrowings.slice(0, 5).map((b) => (
                        <tr key={b.id}>
                          <td className="font-mono">{b.id}</td>
                          <td>Resource #{b.resourceId}</td>
                          <td>Student #{b.ownerId}</td>
                          <td>Student #{b.borrowerId}</td>
                          <td>{b.durationDays} Days</td>
                          <td>
                            <span className="status-tag active">In Escrow</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: RESOURCES MODERATION ── */}
          {activeTab === "resources" && (
            <div className="admin-card-box">
              <h3 className="box-title">{t.admin.tabResources}</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ITEM</th>
                      <th>CATEGORY</th>
                      <th>DAILY RATE</th>
                      <th>CONDITION</th>
                      <th>MODERATION</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resourcesList.map((r) => {
                      const isApproved = r.isApproved !== false;
                      return (
                        <tr key={r.id}>
                          <td>
                            <div className="table-item-cell">
                              <img
                                src={r.image}
                                alt={r.name}
                                className="table-thumb"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100";
                                }}
                              />
                              <div>
                                <div className="item-cell-title">{r.name}</div>
                                <div className="item-cell-sub">ID: #{r.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>{r.category?.toUpperCase()}</td>
                          <td>₹{r.dailyRate}/day</td>
                          <td style={{ textTransform: "capitalize" }}>{r.condition}</td>
                          <td>
                            {isApproved ? (
                              <span className="status-tag approved">{t.admin.statusApproved}</span>
                            ) : (
                              <span className="status-tag flagged">{t.admin.statusFlagged}</span>
                            )}
                          </td>
                          <td>
                            <button
                              className={`admin-action-btn ${isApproved ? "flag" : "approve"}`}
                              onClick={() => handleToggleResourceStatus(r.id)}
                            >
                              {isApproved ? t.admin.flagBtn : t.admin.approveBtn}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 3: USERS DIRECTORY ── */}
          {activeTab === "users" && (
            <div className="admin-card-box">
              <h3 className="box-title">{t.admin.tabUsers}</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>STUDENT</th>
                      <th>DEPARTMENT</th>
                      <th>TRUST SCORE</th>
                      <th>BORROWS / LENDS</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div className="item-cell-title">{s.name}</div>
                          <div className="item-cell-sub">{s.room}</div>
                        </td>
                        <td>{s.dept} (Yr {s.year})</td>
                        <td>
                          <span className="trust-score-badge">{s.trustScore}%</span>
                        </td>
                        <td>{s.borrowCount} borrowed / {s.lendCount} lent</td>
                        <td>
                          {s.isSuspended ? (
                            <span className="status-tag flagged">{t.admin.statusSuspended}</span>
                          ) : (
                            <span className="status-tag active">{t.admin.statusActive}</span>
                          )}
                        </td>
                        <td>
                          <button
                            className={`admin-action-btn ${s.isSuspended ? "approve" : "flag"}`}
                            onClick={() => handleToggleUserSuspension(s.id)}
                          >
                            {s.isSuspended ? t.admin.reinstateBtn : t.admin.suspendBtn}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 4: DISPUTES ── */}
          {activeTab === "disputes" && (
            <div className="admin-card-box">
              <h3 className="box-title">{t.admin.tabDisputes}</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>DISPUTE ID</th>
                      <th>EQUIPMENT</th>
                      <th>PARTIES</th>
                      <th>CLAIM</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disputesList.map((d) => (
                      <tr key={d.id}>
                        <td className="font-mono">{d.id}</td>
                        <td>{d.resourceName}</td>
                        <td>
                          <div>Lender: {d.lender}</div>
                          <div>Borrower: {d.borrower}</div>
                        </td>
                        <td>{d.type}</td>
                        <td className="font-bold">{d.claimedAmount}</td>
                        <td>
                          <span className={`status-tag ${d.status === "resolved" ? "approved" : "flagged"}`}>
                            {d.status?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {d.status === "pending" ? (
                            <button
                              className="admin-action-btn approve"
                              onClick={() => handleResolveDispute(d.id)}
                            >
                              {t.admin.resolveDisputeBtn}
                            </button>
                          ) : (
                            <span style={{ fontSize: "0.8rem", color: "#888888" }}>Settled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 5: PLATFORM CONFIG ── */}
          {activeTab === "config" && (
            <div className="admin-card-box">
              <h3 className="box-title">{t.admin.tabConfig}</h3>
              <form onSubmit={handleSaveConfig} className="admin-config-form">
                <div className="config-field">
                  <label>PLATFORM ESCROW COMMISSION (%)</label>
                  <input
                    type="number"
                    value={config.platformFeePercent}
                    onChange={(e) => setConfig({ ...config, platformFeePercent: e.target.value })}
                  />
                  <small>Deducted on completed peer equipment rentals.</small>
                </div>

                <div className="config-field">
                  <label>MAXIMUM BORROW DURATION (DAYS)</label>
                  <input
                    type="number"
                    value={config.maxBorrowDays}
                    onChange={(e) => setConfig({ ...config, maxBorrowDays: e.target.value })}
                  />
                  <small>Limits single-agreement lifecycle length.</small>
                </div>

                <div className="config-field">
                  <label>MINIMUM TRUST SCORE TO LIST GEAR (%)</label>
                  <input
                    type="number"
                    value={config.minTrustScoreForListing}
                    onChange={(e) => setConfig({ ...config, minTrustScoreForListing: e.target.value })}
                  />
                  <small>Ensures only reputable students can post listings.</small>
                </div>

                {configSavedNotice && (
                  <div className="config-success-notice">
                    <CheckCircle size={16} />
                    <span>Configuration successfully synchronized with platform protocol!</span>
                  </div>
                )}

                <button type="submit" className="admin-save-btn">
                  {t.admin.saveConfigBtn}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
