import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Mail, Lock, User, GraduationCap, CheckCircle2 } from "lucide-react";
import "./AuthPage.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dept: "Computer Science",
    year: "3rd Year",
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate("/app");
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-header-bar">
        <button className="auth-back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          <span>Back to Landing</span>
        </button>
        <div className="auth-brand-pill">CAMPUS CIRCULAR</div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          {/* Card Header & Tab Switcher */}
          <div className="auth-card-top">
            <div className="auth-badge">
              <ShieldCheck size={16} />
              <span>Campus Verified Auth</span>
            </div>

            <h2 className="auth-title">
              {isLogin ? "Welcome Back to Campus" : "Join the Circular Network"}
            </h2>
            <p className="auth-subtitle">
              {isLogin
                ? "Enter your campus credentials to access peer listings"
                : "Register with your student ID to start sharing & borrowing"}
            </p>

            <div className="auth-tabs">
              <button
                className={`auth-tab ${isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(true)}
              >
                Log In
              </button>
              <button
                className={`auth-tab ${!isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="auth-success-state">
              <CheckCircle2 size={48} className="success-icon" />
              <h3>Authentication Successful!</h3>
              <p>Entering Campus Circular app...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-icon-wrapper">
                    <User size={18} className="field-icon" />
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Siddharth Joshi"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Campus Email</label>
                <div className="input-icon-wrapper">
                  <Mail size={18} className="field-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="student@campus.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-icon-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="form-row">
                  <div className="form-group half">
                    <label>Department</label>
                    <div className="input-icon-wrapper">
                      <GraduationCap size={18} className="field-icon" />
                      <select name="dept" value={formData.dept} onChange={handleChange}>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Film Studies">Film Studies</option>
                        <option value="Journalism">Journalism</option>
                        <option value="Mechanical Eng">Mechanical Eng</option>
                        <option value="Design">Design</option>
                        <option value="Biotech">Biotech</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group half">
                    <label>Academic Year</label>
                    <select name="year" value={formData.year} onChange={handleChange} className="simple-select">
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
              )}

              <button type="submit" className="auth-submit-btn">
                {isLogin ? "Log In to Campus" : "Create Campus Account"}
              </button>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <div className="social-auth-buttons">
                <button
                  type="button"
                  className="social-btn"
                  onClick={() => navigate("/app")}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    width={18}
                  />
                  <span>Continue with Campus SSO</span>
                </button>
              </div>
            </form>
          )}

          <div className="auth-footer-note">
            <span>Protected by Campus Analog Trust Protocol v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
