import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, ArrowRight, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { resources } from "../data/mockData.js";
import { recommendResourcesWithGroq } from "../utils/groqService.js";
import "./NeedFinder.css";

// 15 positions scattered across the screen viewport (x: -450 to +450, y: -300 to +300)
const SCATTERED_POSITIONS = [
  { x: -440, y: -240, scale: 0.95 },
  { x: -180, y: -290, scale: 1.1 },
  { x: 120, y: -270, scale: 0.9 },
  { x: 380, y: -220, scale: 1.05 },
  { x: -460, y: -30, scale: 0.85 },
  { x: 440, y: -40, scale: 1.0 },
  { x: -400, y: 180, scale: 1.0 },
  { x: 420, y: 160, scale: 0.95 },
  { x: -220, y: 260, scale: 0.9 },
  { x: 200, y: 250, scale: 1.05 },
  { x: -110, y: -110, scale: 0.8 },
  { x: 140, y: -100, scale: 0.85 },
  { x: -130, y: 100, scale: 0.8 },
  { x: 150, y: 90, scale: 0.85 },
  { x: 0, y: -320, scale: 0.9 },
];

const CATEGORIES = ["ALL CATEGORIES", "MEDIA & CAMERA", "AUDIO & LIGHTING", "INSTRUMENTS", "TECH & TOOLS"];

export default function NeedFinder() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [result, setResult] = useState(null); // { kitTitle, kitDescription, recommendedIds, reasoning }
  const [hasSearched, setHasSearched] = useState(false);

  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  // Store original positions for reset
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, resources.length);
  }, []);

  // Initial float animation
  useEffect(() => {
    // Gentle idle bobbing for scattered items
    itemRefs.current.forEach((el, index) => {
      if (el) {
        gsap.to(el, {
          y: `+=${(index % 2 === 0 ? 1 : -1) * 12}`,
          duration: 3 + (index % 4) * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });
  }, []);

  // Handle Groq Intent Submission & Animated Convergence
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setHasSearched(true);

    // Call Groq API service
    const recData = await recommendResourcesWithGroq(query.trim());
    setResult(recData);
    setLoading(false);

    // Animate items with GSAP:
    // Recommended items float into center forming a grid
    // Non-recommended items fade out and shrink
    const recommendedSet = new Set(recData.recommendedIds);
    const recArray = recData.recommendedIds;

    resources.forEach((resource, index) => {
      const el = itemRefs.current[index];
      if (!el) return;

      // Kill floating idle tween
      gsap.killTweensOf(el);

      if (recommendedSet.has(resource.id)) {
        // Calculate center cluster offset
        const matchRank = recArray.indexOf(resource.id);
        const totalMatches = recArray.length;
        
        // Arrange in a compact horizontal/grid cluster in middle
        const colWidth = 160;
        const totalWidth = (totalMatches - 1) * colWidth;
        const targetX = -totalWidth / 2 + matchRank * colWidth;
        const targetY = -70; // Position slightly above the result card

        gsap.to(el, {
          x: targetX,
          y: targetY,
          scale: 1.25,
          opacity: 1,
          zIndex: 40,
          duration: 1.2,
          ease: "back.out(1.4)",
        });
      } else {
        // Non-matches shrink & fade to background edges
        const pos = SCATTERED_POSITIONS[index % SCATTERED_POSITIONS.length];
        gsap.to(el, {
          x: pos.x * 1.3,
          y: pos.y * 1.3,
          scale: 0.45,
          opacity: 0.15,
          zIndex: 5,
          duration: 1.0,
          ease: "power2.out",
        });
      }
    });
  };

  // Reset view back to scattered stage
  const handleReset = () => {
    setResult(null);
    setHasSearched(false);
    setQuery("");

    resources.forEach((resource, index) => {
      const el = itemRefs.current[index];
      if (!el) return;

      const pos = SCATTERED_POSITIONS[index % SCATTERED_POSITIONS.length];
      gsap.to(el, {
        x: pos.x,
        y: pos.y,
        scale: pos.scale,
        opacity: 1,
        zIndex: 10,
        duration: 0.9,
        ease: "power3.out",
      });
    });
  };

  return (
    <div className="need-finder-root" ref={containerRef}>
      {/* Top Navbar */}
      <header className="need-finder-navbar">
        <button onClick={() => navigate(-1)} className="nf-back-btn">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="nf-brand-title" onClick={() => navigate("/")}>
          CAMPUS CIRCULAR • DISPATCH AI
        </div>
        <button onClick={() => navigate("/app")} className="nf-app-btn">
          Go to App
        </button>
      </header>

      {/* Scattered Vitra-style Canvas Container */}
      <div className="scattered-canvas">
        {/* Floating Items */}
        {resources.map((resource, index) => {
          const pos = SCATTERED_POSITIONS[index % SCATTERED_POSITIONS.length];
          const isMatched = result?.recommendedIds?.includes(resource.id);

          return (
            <div
              key={resource.id}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`scattered-item-node ${isMatched ? "matched-glow" : ""}`}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`,
              }}
              onClick={() => navigate(`/product/${resource.id}`)}
              title={`${resource.name} — ₹${resource.dailyRate}/day`}
            >
              <div className="scattered-item-img-box">
                <img
                  src={resource.image || "https://pngimg.com/uploads/photo_camera/photo_camera_PNG101641.png"}
                  alt={resource.name}
                  className="scattered-img"
                  onError={(e) => {
                    e.target.src = "https://pngimg.com/uploads/photo_camera/photo_camera_PNG101641.png";
                  }}
                />
              </div>
              <div className="scattered-item-label">
                <span className="item-label-name">{resource.name}</span>
                <span className="item-label-price">₹{resource.dailyRate}/day</span>
              </div>
            </div>
          );
        })}

        {/* Central Intent Card Overlay */}
        {!hasSearched && (
          <div className="central-intent-overlay animate-fade-in">
            <div className="intent-card-box">
              <div className="intent-card-header">
                <Sparkles size={20} className="sparkle-icon" />
                <span>AI CAMPUS DISPATCH</span>
              </div>

              <h1 className="intent-card-title">What do you need?</h1>
              <p className="intent-card-sub">
                Describe your project or event. Groq AI will analyze our campus catalog and cluster the exact gear you need right in front of you.
              </p>

              <form onSubmit={handleSearch} className="intent-input-form">
                <input
                  type="text"
                  placeholder="e.g. 'I need to make a reel and need equipment'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="intent-text-input"
                  autoFocus
                />
                <button type="submit" className="intent-submit-btn" disabled={loading}>
                  {loading ? (
                    <RefreshCw size={18} className="spin-icon" />
                  ) : (
                    <>
                      <span>Match Gear</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Preset Intent Pills */}
              <div className="preset-intents-row">
                <span className="preset-label">Try asking:</span>
                <button
                  type="button"
                  className="preset-pill"
                  onClick={() => {
                    setQuery("I need to make a reel and need equipment");
                  }}
                >
                  "Make a reel"
                </button>
                <button
                  type="button"
                  className="preset-pill"
                  onClick={() => {
                    setQuery("Need acoustic guitar and speaker for jam session");
                  }}
                >
                  "Jam session"
                </button>
                <button
                  type="button"
                  className="preset-pill"
                  onClick={() => {
                    setQuery("Projector and laptop for pitch presentation");
                  }}
                >
                  "Pitch presentation"
                </button>
              </div>
            </div>

            {/* Vitra-Style Bottom Category Filter Bar (Screenshot 2 Widget) */}
            <div className="vitra-category-widget">
              <button
                className="vitra-widget-arrow"
                onClick={() =>
                  setActiveCategoryIndex((prev) => (prev > 0 ? prev - 1 : CATEGORIES.length - 1))
                }
              >
                <ChevronLeft size={18} />
              </button>

              <div className="vitra-widget-center">
                <div className="vitra-widget-title">{CATEGORIES[activeCategoryIndex]}</div>
                <div className="vitra-widget-slider-track">
                  <div
                    className="vitra-widget-slider-thumb"
                    style={{
                      left: `${(activeCategoryIndex / (CATEGORIES.length - 1)) * 80 + 10}%`,
                    }}
                  />
                </div>
                <div className="vitra-widget-sub">EXPLORE ALL CAMPUS EQUIPMENT</div>
              </div>

              <button
                className="vitra-widget-arrow"
                onClick={() =>
                  setActiveCategoryIndex((prev) => (prev < CATEGORIES.length - 1 ? prev + 1 : 0))
                }
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Search Results Drawer / Overlay (State 3 - After Convergence) */}
        {hasSearched && result && (
          <div className="result-drawer-overlay animate-slide-up">
            <div className="result-drawer-card">
              <div className="result-drawer-top">
                <div>
                  <span className="ai-matched-stamp">GROQ AI RECOMMENDED BUNDLE</span>
                  <h2 className="result-kit-title">{result.kitTitle}</h2>
                  <p className="result-kit-desc">{result.kitDescription}</p>
                </div>

                <button onClick={handleReset} className="btn-reset-search">
                  <RefreshCw size={14} />
                  <span>New Search</span>
                </button>
              </div>

              <div className="recommended-items-list">
                {result.recommendedIds.map((id) => {
                  const item = resources.find((r) => r.id === id);
                  if (!item) return null;
                  const reason = result.reasoning?.[id] || `Recommended for your request.`;

                  return (
                    <div
                      key={item.id}
                      className="rec-item-card"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img src={item.image} alt={item.name} className="rec-item-thumb" />
                      <div className="rec-item-info">
                        <div className="rec-item-header">
                          <h4 className="rec-item-name">{item.name}</h4>
                          <span className="rec-item-price">₹{item.dailyRate}/day</span>
                        </div>
                        <p className="rec-item-reason">
                          <CheckCircle2 size={13} className="check-icon" /> {reason}
                        </p>
                      </div>
                      <button className="btn-rec-detail">View Details →</button>
                    </div>
                  );
                })}
              </div>

              <div className="result-drawer-footer">
                <button
                  className="btn-primary-dispatch"
                  onClick={() => navigate(`/product/${result.recommendedIds[0]}`)}
                >
                  Inspect Primary Item ({resources.find((r) => r.id === result.recommendedIds[0])?.name}) →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
