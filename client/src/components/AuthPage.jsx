import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
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
    }, 900);
  };

  return (
    <div className="auth-page-root">
      {/* Top Navbar */}
      <header className="auth-top-navbar">
        <button className="auth-nav-back" onClick={() => navigate("/")}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="auth-brand-logo" onClick={() => navigate("/")}>
          CAMPUS CIRCULAR
        </div>

        <div className="auth-nav-placeholder" />
      </header>

      {/* Main Centered Stage */}
      <main className="auth-stage">
        <div className="scrib-auth-card">
          {/* Card Title & Subtitle */}
          <h1 className="scrib-title">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="scrib-subtitle">
            {isLogin
              ? "Sign in to access your campus peer lending & trust workspace."
              : "Register your student credentials to start sharing & borrowing."}
          </p>

          {/* Single Sign-On Button (Google SSO) */}
          <button
            type="button"
            className="google-sso-btn"
            onClick={() => navigate("/app")}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="google-icon"
            />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="scrib-divider">
            <span className="divider-line" />
            <span className="divider-text">
              {isLogin ? "OR EMAIL SIGN IN" : "OR REGISTER WITH EMAIL"}
            </span>
            <span className="divider-line" />
          </div>

          {/* Form / Success State */}
          {submitted ? (
            <div className="scrib-success-box">
              <CheckCircle2 size={42} className="success-check" />
              <h3>Authentication Successful!</h3>
              <p>Entering Campus Circular workspace...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="scrib-form">
              {!isLogin && (
                <div className="scrib-field">
                  <label className="scrib-label">FULL NAME</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Siddharth Joshi"
                    value={formData.name}
                    onChange={handleChange}
                    className="scrib-input"
                    required
                  />
                </div>
              )}

              <div className="scrib-field">
                <label className="scrib-label">
                  {isLogin ? "WORK EMAIL ADDRESS" : "CAMPUS EMAIL ADDRESS"}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="student@campus.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="scrib-input"
                  required
                />
              </div>

              <div className="scrib-field">
                <label className="scrib-label">PASSWORD</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="scrib-input"
                  required
                />
              </div>

              {!isLogin && (
                <div className="scrib-field-row">
                  <div className="scrib-field half">
                    <label className="scrib-label">DEPARTMENT</label>
                    <select
                      name="dept"
                      value={formData.dept}
                      onChange={handleChange}
                      className="scrib-input select-input"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Film Studies">Film Studies</option>
                      <option value="Journalism">Journalism</option>
                      <option value="Mechanical Eng">Mechanical Eng</option>
                      <option value="Design">Design</option>
                      <option value="Biotech">Biotech</option>
                    </select>
                  </div>

                  <div className="scrib-field half">
                    <label className="scrib-label">ACADEMIC YEAR</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="scrib-input select-input"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Button (Clean text without any gemini sparkle emoji!) */}
              <button type="submit" className="scrib-submit-btn">
                {isLogin ? "Sign In to Workspace" : "Register Workspace"}
              </button>
            </form>
          )}

          {/* Toggle Link */}
          <div className="scrib-bottom-link">
            {isLogin ? (
              <span>
                Need access to Campus Circular?{" "}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setIsLogin(false)}
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setIsLogin(true)}
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
