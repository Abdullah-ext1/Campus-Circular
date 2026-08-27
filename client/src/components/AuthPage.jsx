import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { students } from "../data/mockData.js";
import "./AuthPage.css";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedStudentPreview, setSelectedStudentPreview] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSignIn = (e) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      setErrorMsg("Please enter your username");
      return;
    }

    const res = login(username);
    if (res.success) {
      setErrorMsg("");
      setSubmitted(true);
      const redirectPath = location.state?.from?.pathname || (res.user.role === "admin" ? "/admin" : "/explore");
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 600);
    } else {
      setErrorMsg(`Unknown username "${username}". You can use any student name (e.g. arjun, priya, kavya, zoya, admin).`);
    }
  };

  const handleDemoQuickFill = (s) => {
    setUsername(s.username);
    setPassword("••••••••");
    setSelectedStudentPreview(s);
    setErrorMsg("");
  };

  return (
    <div className="auth-page-root">
      {/* Accessible Skip Link */}
      <a href="#auth-form" className="skip-to-content">
        Skip to sign in form
      </a>

      {/* Top Navbar */}
      <header className="auth-topbar" role="banner">
        <button
          className="auth-nav-back"
          onClick={() => navigate("/")}
          aria-label="Return to landing page"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="auth-brand" onClick={() => navigate("/")} role="button" tabIndex={0}>
          campus circular.
        </div>

        <div className="auth-topbar-placeholder" />
      </header>

      {/* Main Sign In Form Stage */}
      <main className="auth-stage" role="main">
        <div className="auth-card" id="auth-form">
          <div className="auth-card-header">
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">
              Choose from verified campus peer profiles or enter any student handle
            </p>
          </div>

          {submitted ? (
            <div className="auth-success-box" role="status" aria-live="polite">
              <CheckCircle2 size={44} className="success-check-icon" />
              <h3>Identity Authenticated</h3>
              <p>Entering Campus Circular workspace as {username}...</p>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="auth-form" noValidate>
              {/* Username field */}
              <div className="form-group">
                <label htmlFor="username-input" className="form-label">
                  Student Username
                </label>
                <div className="input-icon-wrapper">
                  <UserIcon size={18} className="field-icon" aria-hidden="true" />
                  <input
                    id="username-input"
                    type="text"
                    className="form-input"
                    placeholder="e.g. arjun, kavya, priya, zoya, admin..."
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMsg) setErrorMsg("");
                      const matched = students.find((s) => s.username === e.target.value.toLowerCase());
                      setSelectedStudentPreview(matched || null);
                    }}
                    autoComplete="username"
                    required
                    aria-describedby={errorMsg ? "auth-error" : undefined}
                  />
                </div>
              </div>

              {/* Matched Profile Badge Preview */}
              {selectedStudentPreview && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f5f5f5", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
                  <img
                    src={selectedStudentPreview.avatar}
                    alt={selectedStudentPreview.name}
                    style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1, fontSize: "0.78rem" }}>
                    <div style={{ fontWeight: 700, color: "#111111" }}>{selectedStudentPreview.name}</div>
                    <div style={{ color: "#666666" }}>{selectedStudentPreview.dept} • Year {selectedStudentPreview.year}</div>
                  </div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#111111", display: "flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={14} /> {selectedStudentPreview.trustScore}%
                  </div>
                </div>
              )}

              {/* Password field */}
              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password-input" className="form-label">
                    Password
                  </label>
                  <span className="pwd-hint">Any password for demo</span>
                </div>
                <div className="input-icon-wrapper">
                  <Lock size={18} className="field-icon" aria-hidden="true" />
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="auth-error-msg" id="auth-error" role="alert">
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button type="submit" className="auth-submit-btn">
                Sign In
              </button>

              {/* Quick autofill directory chips */}
              <div className="demo-accounts-row">
                <span className="demo-label">Available Student Profiles:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", width: "100%", marginTop: "4px" }}>
                  {students.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`demo-chip ${username === s.username ? "active" : ""}`}
                      onClick={() => handleDemoQuickFill(s)}
                      title={`${s.name} (${s.dept}) - Trust ${s.trustScore}%`}
                    >
                      {s.username}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
