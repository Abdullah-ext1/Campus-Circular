import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  ArrowLeft,
  LogOut,
  Sliders,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getCircularResources } from "../utils/api.js";
import { recommendResourcesWithGroq } from "../utils/groqService.js";
import { students } from "../data/mockData.js";
import CategoryIcon from "./CategoryIcon.jsx";
import "./ExplorePage.css";

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "camera", label: "Cameras" },
  { id: "tripod", label: "Tripods" },
  { id: "microphone", label: "Microphones & Audio" },
  { id: "lighting", label: "Lighting" },
  { id: "laptop", label: "Laptops" },
  { id: "instrument", label: "Instruments" },
  { id: "projector", label: "Projectors" },
  { id: "speaker", label: "Speakers" },
  { id: "tool", label: "Tools" },
  { id: "drone", label: "Drones" },
];

const CONDITIONS = [
  { id: "all", label: "Any Condition" },
  { id: "like-new", label: "Like New" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
  { id: "worn", label: "Worn" },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortKey, setSortKey] = useState("relevance");

  // AI Matching state
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiResult, setAiResult] = useState(null); // { hasResults, kitTitle, kitDescription, recommendedIds, reasoning }

  // Resource List & Pagination
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 28, total: 28, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch resources from API / Local
  const loadResources = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getCircularResources({
        q: searchQuery,
        category: selectedCategory,
        condition: selectedCondition,
        availability: selectedAvailability,
        maxPrice: maxPrice,
        sort: sortKey,
        page: page,
        limit: 28,
      });
      setResources(res.items);
      setPagination(res.pagination);
    } catch (e) {
      console.error("Failed to load resources", e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedCondition, selectedAvailability, maxPrice, sortKey]);

  useEffect(() => {
    loadResources(1);
  }, [loadResources]);

  // AI Groq Search Handler
  const handleAiSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAiSearching(true);
    try {
      const groqResponse = await recommendResourcesWithGroq(searchQuery);
      setAiResult(groqResponse);

      if (groqResponse.hasResults && groqResponse.recommendedIds?.length > 0) {
        // Re-order or filter current list with matched IDs first
        const matched = resources.filter((r) => groqResponse.recommendedIds.includes(r.id));
        const unmatched = resources.filter((r) => !groqResponse.recommendedIds.includes(r.id));
        setResources([...matched, ...unmatched]);
      } else {
        // Standard text search fallback
        loadResources(1);
      }
    } catch (err) {
      console.error("Groq exploration error:", err);
      loadResources(1);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleClearAi = () => {
    setAiResult(null);
    setSearchQuery("");
    loadResources(1);
  };

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSelectedAvailability("all");
    setMaxPrice(500);
    setSortKey("relevance");
    setAiResult(null);
    setSearchQuery("");
  };

  // Helper for owner lookup
  const getOwnerDetails = (ownerId) => {
    return students.find((s) => s.id === ownerId) || { name: "Campus Peer", trustScore: 90 };
  };

  return (
    <div className="explore-root">
      {/* ── Top Bar ── */}
      <header className="explore-topbar">
        <div className="explore-topbar-left">
          <button className="explore-back-btn" onClick={() => navigate("/")} title="Back to Landing">
            <ArrowLeft size={16} />
            <span>{t.nav.back}</span>
          </button>
          <div className="explore-brand" onClick={() => navigate("/")}>
            {t.nav.brand}
          </div>
        </div>

        {/* Global AI Search Bar */}
        <form className="explore-search-form" onSubmit={handleAiSearch}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="explore-search-input"
              placeholder={t.explore.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchQuery("")}>
                <X size={14} />
              </button>
            )}
          </div>
          <button type="submit" className="explore-ai-btn" disabled={isAiSearching}>
            {isAiSearching ? (
              <>
                <RefreshCw size={14} className="spin-icon" />
                <span>{t.explore.searchingWithAi}</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>{t.explore.smartSearchBtn}</span>
              </>
            )}
          </button>
        </form>

        {/* Topbar Right Controls */}
        <div className="explore-topbar-right">
          {/* Need Finder Shortcut */}
          <button
            className="explore-needfinder-btn"
            onClick={() => navigate("/find")}
            aria-label="Open Need Finder canvas"
            title="Open Interactive Need Finder"
          >
            <Sparkles size={14} />
            <span>Need Finder</span>
          </button>

          {/* List Gear Button for Lister or Admin */}
          {(user?.role === "lister" || user?.role === "admin") && (
            <button
              className="explore-listgear-btn"
              onClick={() => navigate("/app", { state: { subScreen: "createListing" } })}
              aria-label="Post a new gear listing"
            >
              <span>+ List Gear</span>
            </button>
          )}

          {/* User Account / Navigation */}
          {user ? (
            <div className="explore-user-badge">
              <div className="user-info-text">
                <span className="user-name">{user.name}</span>
                <span className="user-role-pill">{user.role?.toUpperCase()}</span>
              </div>
              {isAdmin && (
                <button
                  className="admin-link-btn"
                  onClick={() => navigate("/admin")}
                  title="Open Admin Console"
                  aria-label="Open Admin Console"
                >
                  Admin
                </button>
              )}
              <button className="logout-btn" onClick={logout} title="Sign Out" aria-label="Sign Out">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button className="explore-signin-btn" onClick={() => navigate("/auth")} aria-label="Sign in">
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* ── AI Results Spotlight Banner (When Groq matches) ── */}
      {aiResult && aiResult.hasResults && (
        <div className="ai-spotlight-banner">
          <div className="ai-spotlight-content">
            <div className="ai-badge">
              <Sparkles size={14} />
              <span>{t.explore.aiKitTitle}</span>
            </div>
            <h3 className="ai-kit-heading">{aiResult.kitTitle}</h3>
            <p className="ai-kit-desc">{aiResult.kitDescription}</p>
          </div>
          <button className="ai-clear-btn" onClick={handleClearAi}>
            <X size={14} />
            <span>{t.explore.clearAiResults}</span>
          </button>
        </div>
      )}

      {/* ── Main Container: Sidebar Filters + Items Grid ── */}
      <div className="explore-layout container">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-trigger">
          <button
            className="filter-toggle-btn"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal size={16} />
            <span>{t.explore.filtersTitle}</span>
          </button>
          <div className="results-count-mobile">
            {t.explore.showingResults.replace("{count}", resources.length).replace("{total}", pagination.total)}
          </div>
        </div>

        {/* ── LEFT SIDEBAR FILTERS ── */}
        <aside className={`explore-sidebar ${showMobileFilters ? "show-mobile" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">
              <Sliders size={16} />
              <h3>{t.explore.filtersTitle}</h3>
            </div>
            <button className="sidebar-reset-btn" onClick={resetAllFilters}>
              {t.explore.resetFilters}
            </button>
          </div>

          {/* Categories */}
          <div className="filter-group">
            <label className="filter-label">{t.explore.categoryLabel}</label>
            <div className="category-pills-list">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-pill ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <CategoryIcon category={cat.id === "all" ? "default" : cat.id} size={14} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="filter-group">
            <label className="filter-label">{t.explore.conditionLabel}</label>
            <div className="condition-chips">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond.id}
                  className={`condition-chip ${selectedCondition === cond.id ? "active" : ""}`}
                  onClick={() => setSelectedCondition(cond.id)}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="filter-group">
            <label className="filter-label">{t.explore.availabilityLabel}</label>
            <div className="availability-switch">
              <button
                className={`switch-btn ${selectedAvailability === "all" ? "active" : ""}`}
                onClick={() => setSelectedAvailability("all")}
              >
                {t.explore.allStatus}
              </button>
              <button
                className={`switch-btn ${selectedAvailability === "available" ? "active" : ""}`}
                onClick={() => setSelectedAvailability("available")}
              >
                {t.explore.availableOnly}
              </button>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="filter-group">
            <div className="price-label-row">
              <label className="filter-label">{t.explore.priceRangeLabel}</label>
              <span className="price-val-tag">Up to ₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-slider"
            />
            <div className="price-range-marks">
              <span>₹0</span>
              <span>₹250</span>
              <span>₹500+</span>
            </div>
          </div>

          {/* Sort Selection */}
          <div className="filter-group">
            <label className="filter-label">{t.explore.sortLabel}</label>
            <select
              className="explore-sort-select"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="relevance">{t.explore.sortRelevance}</option>
              <option value="priceLow">{t.explore.sortPriceLow}</option>
              <option value="priceHigh">{t.explore.sortPriceHigh}</option>
              <option value="rating">{t.explore.sortRating}</option>
              <option value="trust">{t.explore.sortTrust}</option>
            </select>
          </div>
        </aside>

        {/* ── RIGHT LISTINGS GRID ── */}
        <main className="explore-main">
          {/* Header Row */}
          <div className="main-header-row">
            <div className="results-counter">
              {t.explore.showingResults.replace("{count}", resources.length).replace("{total}", pagination.total)}
            </div>
            {aiResult && (
              <div className="ai-active-indicator">
                <Sparkles size={13} />
                <span>AI Intent Active</span>
              </div>
            )}
          </div>

          {/* Listings Grid */}
          <div className="listings-grid">
            {resources.map((item) => {
              const owner = getOwnerDetails(item.ownerId);
              const isAiPicked = aiResult?.recommendedIds?.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`explore-card ${isAiPicked ? "ai-highlighted-card" : ""}`}
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {/* Card Image Area */}
                  <div className="explore-card-media">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="explore-card-img"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&auto=format&fit=crop&q=80";
                      }}
                    />
                    {isAiPicked && (
                      <span className="ai-pick-tag">
                        <Sparkles size={11} /> AI MATCH
                      </span>
                    )}
                    <span className="card-cat-badge">{item.category?.toUpperCase()}</span>
                  </div>

                  {/* Card Body */}
                  <div className="explore-card-body">
                    <div className="card-title-row">
                      <h4 className="explore-card-title">{item.name}</h4>
                    </div>

                    <p className="explore-card-desc">{item.description}</p>

                    {/* AI Reasoning if available */}
                    {isAiPicked && aiResult?.reasoning?.[item.id] && (
                      <div className="ai-reason-pill">
                        <CheckCircle2 size={12} />
                        <span>{aiResult.reasoning[item.id]}</span>
                      </div>
                    )}

                    {/* Card Meta Row */}
                    <div className="explore-card-meta">
                      <div className="owner-trust">
                        <ShieldCheck size={14} className="trust-icon" />
                        <span>{owner.name}</span>
                        <span className="trust-score-num">{owner.trustScore}%</span>
                      </div>

                      <div className="card-condition-pill">{item.condition}</div>
                    </div>

                    {/* Card Footer Price & Action */}
                    <div className="explore-card-footer">
                      <div className="card-price">
                        {item.dailyRate === 0 ? (
                          <span className="free-price-badge">{t.explore.freeTag}</span>
                        ) : (
                          <>
                            <span className="price-num">₹{item.dailyRate}</span>
                            <span className="price-unit">{t.explore.dayUnit}</span>
                          </>
                        )}
                      </div>

                      <button className="card-view-btn">
                        <span>{t.explore.viewDetails}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {resources.length === 0 && !loading && (
            <div className="explore-empty-state">
              <AlertCircle size={44} className="empty-icon" />
              <h3>{t.explore.noResultsTitle}</h3>
              <p>{t.explore.noResultsDesc}</p>
              <button className="empty-reset-btn" onClick={resetAllFilters}>
                {t.explore.resetFilters}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
