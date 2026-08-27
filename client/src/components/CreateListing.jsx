import React, { useState } from "react";
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, Shield, Info, Image as ImageIcon } from "lucide-react";
import "./CreateListing.css";

export default function CreateListing({ onBack, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Electronics",
    description: "",
    condition: "Like New",
    maxBorrowDays: 7,
    depositRequired: false,
    depositAmount: 500,
    pickupLocation: "Hostel 4 Lobby",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (onSubmitSuccess) onSubmitSuccess(formData);
    }, 1200);
  };

  return (
    <div className="create-listing-container animate-slide-up">
      <div className="create-listing-header">
        <button className="btn-secondary back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div>
          <h2 className="font-serif" style={{ fontSize: "1.5rem", color: "var(--receipt)" }}>
            List an Item for Peer Borrowing
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--receipt-dim)" }}>
            Share your unused tools, textbooks, or tech with students on your campus ledger.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="paper-card listing-success-card">
          <CheckCircle2 size={52} className="success-check-icon" />
          <h3 className="font-serif" style={{ fontSize: "1.6rem", color: "var(--receipt)" }}>
            Listing Published to Campus Registry!
          </h3>
          <p style={{ color: "var(--receipt-dim)", maxWidth: "400px", margin: "0 auto" }}>
            Your item standard agreement protocol is active. Nearby verified students can now request to borrow.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="create-listing-grid">
          {/* Main Form Fields */}
          <div className="paper-card listing-form-card">
            <h3 className="form-section-title">1. Item Information</h3>

            <div className="listing-field">
              <label>Listing Title *</label>
              <input
                type="text"
                placeholder="e.g. Sony Alpha A6400 Camera + 16-50mm Lens"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="listing-field-row">
              <div className="listing-field half">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Electronics">Electronics & Cameras</option>
                  <option value="Academics">Books & Textbooks</option>
                  <option value="Lab & Sci">Lab Equipment & Tools</option>
                  <option value="Music">Musical Instruments</option>
                  <option value="Sports">Sports & Outdoors</option>
                  <option value="Utility">Chargers & Cables</option>
                </select>
              </div>

              <div className="listing-field half">
                <label>Condition *</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                >
                  <option value="Mint / Brand New">Mint / Brand New</option>
                  <option value="Like New">Like New (Minimal Wear)</option>
                  <option value="Good">Good (Fully Functional)</option>
                  <option value="Fair">Fair (Has Scratches)</option>
                </select>
              </div>
            </div>

            <div className="listing-field">
              <label>Detailed Description</label>
              <textarea
                rows={4}
                placeholder="Describe accessories included, usage restrictions, specific care instructions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <h3 className="form-section-title" style={{ marginTop: "24px" }}>
              2. Upload Item Photos
            </h3>

            <div className="image-upload-zone">
              {imagePreview ? (
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="Item preview" className="uploaded-preview-img" />
                  <button
                    type="button"
                    className="change-img-btn"
                    onClick={() => setImagePreview(null)}
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <label className="upload-dropzone">
                  <Upload size={28} className="upload-icon" />
                  <span>Click or drag item photo here</span>
                  <span className="upload-hint">PNG, JPG up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>

            <h3 className="form-section-title" style={{ marginTop: "24px" }}>
              3. Lending Terms & Protocol
            </h3>

            <div className="listing-field-row">
              <div className="listing-field half">
                <label>Max Lending Period</label>
                <select
                  value={formData.maxBorrowDays}
                  onChange={(e) => setFormData({ ...formData, maxBorrowDays: e.target.value })}
                >
                  <option value={1}>1 Day (24 Hours)</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days (1 Week)</option>
                  <option value={14}>14 Days (2 Weeks)</option>
                </select>
              </div>

              <div className="listing-field half">
                <label>Preferred Pickup Point</label>
                <input
                  type="text"
                  placeholder="e.g. Library Desk or Hostel 4"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Right Side Card — Preview & Trust Shield */}
          <div className="listing-side-panel">
            <div className="paper-card listing-preview-card">
              <h3 className="font-serif" style={{ fontSize: "1.1rem", marginBottom: "12px", color: "var(--receipt)" }}>
                Live Listing Preview
              </h3>

              <div className="preview-image-container">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" />
                ) : (
                  <div className="preview-placeholder">
                    <ImageIcon size={32} />
                    <span>No image uploaded</span>
                  </div>
                )}
              </div>

              <div className="preview-details">
                <span className="badge-tag">{formData.category}</span>
                <h4 className="font-serif" style={{ fontSize: "1.15rem", margin: "6px 0", color: "var(--receipt)" }}>
                  {formData.title || "Untitled Listing"}
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--receipt-dim)", marginBottom: "12px" }}>
                  Condition: <strong style={{ color: "var(--ledger-gold)" }}>{formData.condition}</strong>
                </p>

                <div className="preview-lender-info">
                  <div className="avatar-circle">SJ</div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Siddharth Joshi</div>
                    <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ledger-gold)" }}>
                      Trust Score: 98/100
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary publish-btn">
                Publish Listing to Campus
              </button>
            </div>

            {/* Security Guarantee Box */}
            <div className="trust-guarantee-box">
              <Shield size={20} className="shield-icon" />
              <div>
                <h5 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ledger-gold)" }}>
                  Campus Mutual Trust Policy
                </h5>
                <p style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginTop: "2px" }}>
                  Every borrower undergoes ID verification. Condition logs & timestamps are stored on the peer ledger.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
