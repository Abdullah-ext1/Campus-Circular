import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ShieldCheck, CheckCircle2, User, ChevronRight } from "lucide-react";
import { getResource, getStudent } from "../data/mockData.js";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const resourceId = parseInt(id, 10) || 1;
  const resource = getResource(resourceId);
  const owner = getStudent(resource.ownerId);

  if (!resource) {
    return (
      <div className="product-page-container">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <button onClick={() => navigate("/")} className="btn-back">
            ← Return to Landing Page
          </button>
        </div>
      </div>
    );
  }

  const rating = owner?.avgRating || 4.9;
  const reviewsCount = owner?.lendCount ? owner.lendCount * 2 + 3 : 24;

  return (
    <div className="product-page-root">
      {/* Top Header / Navigation */}
      <header className="product-navbar">
        <button onClick={() => navigate(-1)} className="product-nav-back">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="product-brand" onClick={() => navigate("/")}>
          <span className="product-brand-title">CAMPUS CIRCULAR</span>
        </div>

        <div className="product-nav-right">
          <button onClick={() => navigate("/app")} className="product-nav-app-btn">
            Go to App Shell
          </button>
        </div>
      </header>

      {/* Main Split Layout Container (noon.world inspired) */}
      <main className="product-main-stage">
        <div className="product-split-grid">
          {/* Left Column: Product Image Showcase */}
          <div className="product-gallery-col">
            <div className="product-image-card">
              <div className="product-condition-badge">
                CONDITION: {resource.condition}% OK
              </div>
              <img
                src={resource.image || "https://pngimg.com/uploads/photo_camera/photo_camera_PNG101641.png"}
                alt={resource.name}
                className="product-hero-image"
                onError={(e) => {
                  e.target.src = "https://pngimg.com/uploads/photo_camera/photo_camera_PNG101641.png";
                }}
              />
              <div className="product-location-tag">
                📍 Pick up at {resource.location}
              </div>
            </div>
          </div>

          {/* Right Column: Product Description & Lender Info */}
          <div className="product-details-col">
            {/* Rating Row */}
            <div className="product-rating-row">
              <div className="stars-group">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#000" color="#000" />
                ))}
              </div>
              <span className="rating-score">({rating})</span>
              <span className="rating-count">• {reviewsCount} campus verifications</span>
            </div>

            {/* Product Title */}
            <h1 className="product-title-text">{resource.name.toUpperCase()}</h1>

            {/* Feature Pills (noon.world style) */}
            <div className="product-tags-row">
              <span className="tag-pill">{resource.category.toUpperCase()}</span>
              {resource.tags?.map((tag, idx) => (
                <span key={idx} className="tag-pill">
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
              <span className="tag-pill">Max {resource.maxDuration} Days</span>
            </div>

            {/* Main Description */}
            <div className="product-description-box">
              <p className="description-lead">{resource.description}</p>
              {resource.borrowingConditions && (
                <p className="borrowing-notes">
                  <strong>Owner note:</strong> "{resource.borrowingConditions}"
                </p>
              )}
            </div>

            {/* Accessories Checklist */}
            {resource.accessories && resource.accessories.length > 0 && (
              <div className="accessories-section">
                <h4 className="section-mini-title">INCLUDED ACCESSORIES:</h4>
                <div className="accessories-grid">
                  {resource.accessories.map((acc, i) => (
                    <div key={i} className="accessory-chip">
                      <CheckCircle2 size={13} />
                      <span>{acc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="product-divider" />

            {/* Pricing / Terms Selector (noon.world style rate options) */}
            <div className="rate-options-section">
              <h4 className="section-mini-title">RENTAL & DEPOSIT RATES:</h4>
              <div className="rate-cards-grid">
                <div className="rate-card active">
                  <div className="rate-label">Daily Rate</div>
                  <div className="rate-price">₹{resource.dailyRate}</div>
                  <div className="rate-sub">per 24 hours</div>
                </div>
                <div className="rate-card">
                  <div className="rate-label">Hourly Rate</div>
                  <div className="rate-price">₹{resource.hourlyRate}</div>
                  <div className="rate-sub">per hour</div>
                </div>
                <div className="rate-card deposit-card">
                  <div className="rate-label">Security Deposit</div>
                  <div className="rate-price">₹{resource.deposit}</div>
                  <div className="rate-sub">100% refundable</div>
                </div>
              </div>
            </div>

            <div className="product-divider" />

            {/* Owner & Trust Score Section (Clickable to Profile) */}
            <div className="owner-profile-section">
              <h4 className="section-mini-title">ITEM CUSTODIAN & LENDER:</h4>

              <div
                className="owner-card-interactive"
                onClick={() => navigate(`/profile/${owner.id}`)}
                title={`View ${owner.name}'s profile`}
              >
                <div className="owner-card-left">
                  <div className="owner-avatar-circle">{owner.initials}</div>
                  <div className="owner-meta">
                    <div className="owner-name-row">
                      <span className="owner-name">{owner.name}</span>
                      {owner.verified && (
                        <span className="owner-verified-tag">
                          <ShieldCheck size={12} /> VERIFIED
                        </span>
                      )}
                    </div>
                    <div className="owner-subtext">
                      {owner.dept} • Year {owner.year}
                    </div>
                    <div className="owner-stats-text">
                      Joined {owner.joinedMonth} • {owner.lendCount} successful lends
                    </div>
                  </div>
                </div>

                <div className="owner-card-right">
                  <div className="trust-score-badge">
                    <div className="score-num">{owner.trustScore}</div>
                    <div className="score-label">TRUST SCORE</div>
                  </div>
                  <ChevronRight size={18} className="arrow-icon" />
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="product-cta-group">
              <button
                className="btn-borrow-now"
                onClick={() => navigate("/app", { state: { resourceId: resource.id } })}
              >
                <span>Draft Borrowing Agreement</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="product-footer">
        <span>© 2026 Campus Circular • Peer Trust Ledger</span>
        <span>Verified Campus Resource Protocol</span>
      </footer>
    </div>
  );
}
