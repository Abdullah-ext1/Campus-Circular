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
  QrCode,
  CreditCard,
  Check,
  X,
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

  const [activeTab, setActiveTab] = useState("overview"); // overview | payments | resources | users | disputes | config
  const [stats, setStats] = useState({
    totalListings: mockResources.length,
    activeBorrows: sampleBorrowings.length,
    registeredUsers: mockStudents.length,
    openDisputes: 1,
  });

  // UPI Payments state
  const [paymentsList, setPaymentsList] = useState(() => {
    try {
      const saved = localStorage.getItem("cc_pending_payments");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "PAY-948201",
              orderId: "ORD-2026-8912",
              items: ["Sony A7 III Mirrorless", "Camera Tripod"],
              amount: 849,
              deposit: 500,
              platformFee: 49,
              days: 3,
              payerName: "Aarav Sharma",
              payerPhone: "9820194821",
              studentId: 7,
              utrNumber: "429184910284",
              timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
              status: "PENDING_APPROVAL",
              upiId: "campuscircular@icici",
            },
            {
              id: "PAY-382910",
              orderId: "ORD-2026-3104",
              items: ["Focusrite Scarlett 2i2"],
              amount: 399,
              deposit: 300,
              platformFee: 49,
              days: 2,
              payerName: "Rohan Kapoor",
              payerPhone: "9811029384",
              studentId: 4,
              utrNumber: "849201948201",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              status: "APPROVED",
              upiId: "campuscircular@icici",
            },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cc_pending_payments", JSON.stringify(paymentsList));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [paymentsList]);

  // Actions
  const handleApprovePayment = (paymentId) => {
    setPaymentsList((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: "APPROVED" } : p))
    );

    // Update borrowing status in cc_borrowings
    try {
      const existing = JSON.parse(localStorage.getItem("cc_borrowings") || "[]");
      const updated = existing.map((b) => {
        if (b.paymentStatus === "PENDING_APPROVAL") {
          return { ...b, paymentStatus: "APPROVED", notes: "Payment Verified by Admin ✓" };
        }
        return b;
      });
      localStorage.setItem("cc_borrowings", JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleRejectPayment = (paymentId) => {
    setPaymentsList((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: "REJECTED" } : p))
    );
  };

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
          <div className="admin-user-pill">
            <ShieldCheck size={16} />
            <span>{user?.name || "Administrator"}</span>
          </div>
        </div>
      </header>

      {/* Main Admin Body: Left Tab Nav + Right Content */}
      <div className="admin-layout container">
        <aside className="admin-sidebar-nav" role="navigation" aria-label="Admin sidebar">
          <div className="admin-sidebar-header">
            <h3>Control Center</h3>
          </div>

          <button
            className={`admin-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
            aria-selected={activeTab === "overview"}
          >
            <TrendingUp size={16} />
            <span>Overview</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
            aria-selected={activeTab === "payments"}
            style={{ position: "relative" }}
          >
            <QrCode size={16} />
            <span>UPI Payments</span>
            {paymentsList.filter((p) => p.status === "PENDING_APPROVAL").length > 0 && (
              <span
                style={{
                  background: "#d9383a",
                  color: "#fff",
                  fontSize: "0.68rem",
                  padding: "1px 6px",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  marginLeft: "auto",
                }}
              >
                {paymentsList.filter((p) => p.status === "PENDING_APPROVAL").length}
              </span>
            )}
          </button>

          <button
            className={`admin-nav-item ${activeTab === "resources" ? "active" : ""}`}
            onClick={() => setActiveTab("resources")}
            aria-selected={activeTab === "resources"}
          >
            <Package size={16} />
            <span>Moderation</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
            aria-selected={activeTab === "users"}
          >
            <Users size={16} />
            <span>User Directory</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "disputes" ? "active" : ""}`}
            onClick={() => setActiveTab("disputes")}
            aria-selected={activeTab === "disputes"}
          >
            <AlertTriangle size={16} />
            <span>Disputes</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "impact" ? "active" : ""}`}
            onClick={() => setActiveTab("impact")}
            aria-selected={activeTab === "impact"}
          >
            <TrendingUp size={16} />
            <span>Campus Impact</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "config" ? "active" : ""}`}
            onClick={() => setActiveTab("config")}
            aria-selected={activeTab === "config"}
          >
            <Settings size={16} />
            <span>Protocol Rules</span>
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

          {/* ── TAB: UPI PAYMENTS & APPROVALS ── */}
          {activeTab === "payments" && (
            <div className="admin-overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Pending Verification</div>
                  <div className="stat-value" style={{ color: "#d9383a" }}>
                    {paymentsList.filter((p) => p.status === "PENDING_APPROVAL").length}
                  </div>
                  <div className="stat-meta">Awaiting Admin UTR confirmation</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Total Escrow Processed</div>
                  <div className="stat-value">
                    ₹{paymentsList.reduce((sum, p) => sum + (p.status === "APPROVED" ? p.amount : 0), 0) + 1248}
                  </div>
                  <div className="stat-meta">Secure campus bank transfers</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Approved Transactions</div>
                  <div className="stat-value" style={{ color: "#257a4a" }}>
                    {paymentsList.filter((p) => p.status === "APPROVED").length + 4}
                  </div>
                  <div className="stat-meta">100% verified via ICICI UPI</div>
                </div>
              </div>

              <div className="admin-card-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 className="box-title" style={{ margin: 0 }}>
                    UPI Payment Verification Queue
                  </h3>
                  <span className="font-mono" style={{ fontSize: "0.75rem", color: "#666" }}>
                    VPA: campuscircular@icici
                  </span>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>PAYMENT ID / TIME</th>
                        <th>STUDENT / PHONE</th>
                        <th>ITEMS / DAYS</th>
                        <th>AMOUNT & DEPOSIT</th>
                        <th>UPI UTR NUMBER</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentsList.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="font-mono" style={{ fontWeight: 700, color: "#111" }}>{p.id}</div>
                            <div style={{ fontSize: "0.72rem", color: "#666" }}>
                              {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{p.payerName}</div>
                            <div style={{ fontSize: "0.75rem", color: "#666" }}>{p.payerPhone}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                              {Array.isArray(p.items) ? p.items.join(", ") : p.items}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#888" }}>{p.days} Days Loan</div>
                          </td>
                          <td>
                            <div className="font-mono" style={{ fontWeight: 700, fontSize: "0.95rem" }}>₹{p.amount}</div>
                            <div style={{ fontSize: "0.72rem", color: "#257a4a" }}>₹{p.deposit} Deposit</div>
                          </td>
                          <td>
                            <span className="font-mono" style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 700 }}>
                              {p.utrNumber}
                            </span>
                          </td>
                          <td>
                            {p.status === "PENDING_APPROVAL" ? (
                              <span className="status-tag pending" style={{ background: "rgba(217, 56, 58, 0.1)", color: "#d9383a", border: "1px solid rgba(217, 56, 58, 0.3)" }}>
                                ⏱ PENDING APPROVAL
                              </span>
                            ) : p.status === "APPROVED" ? (
                              <span className="status-tag active" style={{ background: "rgba(37, 122, 74, 0.1)", color: "#257a4a", border: "1px solid rgba(37, 122, 74, 0.3)" }}>
                                ✓ APPROVED
                              </span>
                            ) : (
                              <span className="status-tag suspended">REJECTED</span>
                            )}
                          </td>
                          <td>
                            {p.status === "PENDING_APPROVAL" ? (
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  type="button"
                                  onClick={() => handleApprovePayment(p.id)}
                                  className="action-btn-primary"
                                  style={{ padding: "4px 8px", fontSize: "0.75rem", background: "#257a4a", color: "#fff", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                  title="Approve UPI Payment"
                                >
                                  <Check size={12} /> Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectPayment(p.id)}
                                  className="action-btn-secondary"
                                  style={{ padding: "4px 8px", fontSize: "0.75rem", color: "#d9383a" }}
                                  title="Reject"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <span className="font-mono" style={{ fontSize: "0.75rem", color: "#888" }}>
                                Sealed
                              </span>
                            )}
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

          {/* ── TAB 5: CAMPUS IMPACT ── */}
          {activeTab === "impact" && (
            <div className="admin-card-box">
              <h3 className="box-title">Campus Circular Impact Analytics</h3>
              <p style={{ color: "#666666", fontSize: "0.88rem", marginBottom: "20px" }}>
                Insights into peer asset circulation, money saved, and sustainable campus resource sharing.
              </p>

              <div className="stats-grid" style={{ marginBottom: "24px" }}>
                <div className="stat-card">
                  <div className="stat-label">Student Money Saved</div>
                  <div className="stat-value">₹84,500</div>
                  <div className="stat-meta">Avoided retail hardware purchases</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Equipment Circulation Rate</div>
                  <div className="stat-value">88.4%</div>
                  <div className="stat-meta">Active gear shared this semester</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">On-Time Return Reliability</div>
                  <div className="stat-value">97.2%</div>
                  <div className="stat-meta">Prompt return before due date</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Avg. Peer Trust Index</div>
                  <div className="stat-value">86%</div>
                  <div className="stat-meta">Verified student credibility</div>
                </div>
              </div>

              <div style={{ background: "#fafafa", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "20px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px" }}>Most Circulated Campus Gear Categories</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "4px" }}>
                      <span>Cameras & Media (DSLR, Tripods, Mics, Gimbals)</span>
                      <span className="font-bold">42% of all loans</span>
                    </div>
                    <div style={{ height: "8px", background: "#e5e5e5", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: "42%", height: "100%", background: "#111111" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "4px" }}>
                      <span>Academic & Laptops (MacBooks, Tablets, Graphing Displays)</span>
                      <span className="font-bold">28% of all loans</span>
                    </div>
                    <div style={{ height: "8px", background: "#e5e5e5", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: "28%", height: "100%", background: "#111111" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "4px" }}>
                      <span>Event & Audio (Projectors, Speakers, Lights)</span>
                      <span className="font-bold">18% of all loans</span>
                    </div>
                    <div style={{ height: "8px", background: "#e5e5e5", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: "18%", height: "100%", background: "#111111" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "4px" }}>
                      <span>Music & Tools (Guitars, Synths, Drills, Sewing)</span>
                      <span className="font-bold">12% of all loans</span>
                    </div>
                    <div style={{ height: "8px", background: "#e5e5e5", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: "12%", height: "100%", background: "#111111" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 6: PLATFORM CONFIG ── */}
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
