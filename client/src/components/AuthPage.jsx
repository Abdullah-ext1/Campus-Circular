import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Shield, UserCheck, User, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import "./AuthPage.css";

export default function AuthPage() {
  const [usernameInput, setUsernameInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const handleSelectPreset = (roleName) => {
    const res = login(roleName);
    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        if (roleName === "admin") {
          navigate("/admin");
        } else {
          navigate("/explore");
        }
      }, 700);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    const res = login(usernameInput);
    if (res.success) {
      setErrorMsg("");
      setSubmitted(true);
      setTimeout(() => {
        if (res.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/explore");
        }
      }, 700);
    } else {
      setErrorMsg(t.auth.invalidUser);
    }
  };

  return (
    <div className="auth-page-root">
      {/* Top Bar */}
      <header className="auth-topbar">
        <button className="auth-nav-back" onClick={() => navigate("/")}>
          <ArrowLeft size={16} />
          <span>{t.nav.back}</span>
        </button>

        <div className="auth-brand" onClick={() => navigate("/")}>
          {t.nav.brand}
        </div>

        <div className="auth-lang-picker">
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
      </header>

      {/* Main Authentication Card */}
      <main className="auth-stage">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">{t.auth.title}</h1>
            <p className="auth-subtitle">{t.auth.subtitle}</p>
          </div>

          {submitted ? (
            <div className="auth-success-box">
              <CheckCircle2 size={48} className="success-check-icon" />
              <h3>{t.auth.successNotice}</h3>
            </div>
          ) : (
            <div className="auth-body">
              {/* 3 Preset One-Click Profiles */}
              <div className="quick-select-group">
                <span className="section-label">{t.auth.quickSelectHeader}</span>

                {/* 1. Admin Role */}
                <button
                  type="button"
                  className="role-select-card"
                  onClick={() => handleSelectPreset("admin")}
                >
                  <div className="role-icon-box">
                    <Shield size={20} />
                  </div>
                  <div className="role-card-text">
                    <div className="role-card-name">{t.auth.adminRole}</div>
                    <div className="role-card-desc">{t.auth.adminDesc}</div>
                  </div>
                  <span className="role-tag">username: admin</span>
                </button>

                {/* 2. Lister Role */}
                <button
                  type="button"
                  className="role-select-card"
                  onClick={() => handleSelectPreset("lister")}
                >
                  <div className="role-icon-box">
                    <UserCheck size={20} />
                  </div>
                  <div className="role-card-text">
                    <div className="role-card-name">{t.auth.listerRole}</div>
                    <div className="role-card-desc">{t.auth.listerDesc}</div>
                  </div>
                  <span className="role-tag">username: lister</span>
                </button>

                {/* 3. User Role */}
                <button
                  type="button"
                  className="role-select-card"
                  onClick={() => handleSelectPreset("user")}
                >
                  <div className="role-icon-box">
                    <User size={20} />
                  </div>
                  <div className="role-card-text">
                    <div className="role-card-name">{t.auth.userRole}</div>
                    <div className="role-card-desc">{t.auth.userDesc}</div>
                  </div>
                  <span className="role-tag">username: user</span>
                </button>
              </div>

              {/* Divider */}
              <div className="auth-divider">
                <span>{t.auth.usernameInputLabel}</span>
              </div>

              {/* Manual input form */}
              <form onSubmit={handleCustomSubmit} className="auth-manual-form">
                <div className="manual-input-wrapper">
                  <input
                    type="text"
                    className="auth-text-input"
                    placeholder={t.auth.usernamePlaceholder}
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      setErrorMsg("");
                    }}
                  />
                  <button type="submit" className="auth-submit-btn">
                    <span>{t.auth.submitBtn}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
                {errorMsg && (
                  <div className="auth-error-msg">
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
