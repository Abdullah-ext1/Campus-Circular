import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck, Trash2, RefreshCw } from "lucide-react";
import { resources, getStudent } from "../data/mockData.js";
import "./BundleCartPage.css";

export default function BundleCartPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get bundle data from location state or fallback to default bundle items (1, 3, 4)
  const defaultBundle = [1, 3, 4];
  const initialIds = location.state?.bundleIds || defaultBundle;
  const kitTitle = location.state?.kitTitle || "Content Creator Equipment Kit";
  const kitDescription =
    location.state?.kitDescription ||
    "Complete camera, audio & lighting bundle tailored for high quality campus video production.";

  const [selectedIds, setSelectedIds] = useState(initialIds);
  const [days, setDays] = useState(3);
  const [terms, setTerms] = useState({ term1: true, term2: true, term3: true });
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Load resources for selected IDs
  const cartItems = selectedIds
    .map((id) => resources.find((r) => r.id === id))
    .filter(Boolean);

  const removeItem = (id) => {
    if (cartItems.length <= 1) {
      alert("At least one equipment item is required in your rental bundle.");
      return;
    }
    setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  // Financial calculations
  const totalDailyRate = cartItems.reduce((sum, item) => sum + item.dailyRate, 0);
  const totalDeposit = cartItems.reduce((sum, item) => sum + item.deposit, 0);

  const discountPercent = days >= 7 ? 15 : days >= 5 ? 10 : days >= 3 ? 5 : 0;
  const rawSubtotal = totalDailyRate * days;
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const platformFee = 49;
  const finalTotal = rawSubtotal - discountAmount + platformFee + totalDeposit;

  const allTermsChecked = terms.term1 && terms.term2 && terms.term3;

  const handleConfirmOrder = () => {
    if (!allTermsChecked || isConfirmed) return;
    setIsConfirmed(true);

    try {
      const serialNo = `BRW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + days);

      const existing = JSON.parse(localStorage.getItem("cc_borrowings") || "[]");
      const newBorrowing = {
        id: serialNo,
        borrowerId: 8, // Siddharth
        resourceId: cartItems[0]?.id || 1,
        ownerId: cartItems[0]?.ownerId || 2,
        bundleItems: cartItems.map((item) => item.name),
        currentState: 1,
        timestamps: {
          requested: now.toISOString(),
          accepted: null,
          handover: null,
          borrowed: null,
          due: dueDate.toISOString(),
          returned: null,
        },
        isLate: false,
        deposit: totalDeposit,
        dailyRate: totalDailyRate,
        totalDays: days,
        platformFee,
        totalAmount: finalTotal,
        notes: `Bundle Rental (${cartItems.length} Items): ${kitTitle}`,
      };

      localStorage.setItem("cc_borrowings", JSON.stringify([newBorrowing, ...existing]));
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      navigate("/app");
    }, 1500);
  };

  return (
    <div className="bundle-cart-root">
      {/* Top Navbar */}
      <header className="bundle-cart-navbar">
        <button onClick={() => navigate(-1)} className="bcart-back-btn">
          <ArrowLeft size={18} />
          <span>Back to Need Finder</span>
        </button>
        <div className="bcart-brand" onClick={() => navigate("/")}>
          CAMPUS CIRCULAR
        </div>
        <button onClick={() => navigate("/app")} className="bcart-app-btn">
          Go to App
        </button>
      </header>

      {/* Main Content Stage */}
      <main className="bundle-cart-main">
        <div className="bundle-cart-container">
          {/* Header Banner */}
          <div className="bundle-cart-header">
            <span className="bcart-badge">EQUIPMENT BUNDLE CART</span>
            <h1 className="bcart-title">{kitTitle}</h1>
            <p className="bcart-desc">{kitDescription}</p>
          </div>

          {/* Grid Layout */}
          <div className="bundle-cart-grid">
            {/* Left Column: Cart Manifest */}
            <div className="bcart-items-col">
              <div className="bcart-section-label">
                <span>INCLUDED EQUIPMENT ({cartItems.length} ITEMS)</span>
              </div>

              <div className="bcart-items-list">
                {cartItems.map((item) => {
                  const owner = getStudent(item.ownerId);
                  return (
                    <div key={item.id} className="bcart-item-card">
                      <img src={item.image} alt={item.name} className="bcart-item-img" />

                      <div className="bcart-item-details">
                        <div className="bcart-item-header">
                          <h3 className="bcart-item-name">{item.name}</h3>
                          <span className="bcart-item-cat">{item.category.toUpperCase()}</span>
                        </div>

                        <div className="bcart-owner-row">
                          {owner?.verified && (
                            <span className="bcart-trust-badge">
                              <ShieldCheck size={12} /> {owner.trustScore} Trust Score
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bcart-item-price-side">
                        <div className="bcart-price-tag">
                          ₹{item.dailyRate}<small>/day</small>
                        </div>
                        <div className="bcart-deposit-tag">Deposit: ₹{item.deposit}</div>
                        <button
                          className="bcart-remove-btn"
                          onClick={() => removeItem(item.id)}
                          title="Remove item from bundle"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Security Guarantee Box */}
              <div className="bcart-guarantee-box">
                <ShieldCheck size={24} className="guarantee-icon" />
                <div>
                  <h4>100% Refundable Security Deposit Escrow</h4>
                  <p>
                    Deposits are securely held and returned instantly to your student ledger upon handover return inspection.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Rental Checkout */}
            <div className="bcart-checkout-col">
              <div className="bcart-checkout-card">
                {/* Stamp overlay when confirmed */}
                {isConfirmed && (
                  <div className="bcart-sealed-overlay">
                    <div className="bcart-sealed-stamp">
                      <CheckCircle2 size={32} />
                      <span>AGREEMENT SEALED</span>
                    </div>
                  </div>
                )}

                <h3 className="checkout-card-title">Rental Terms & Summary</h3>

                {/* Duration Selector */}
                <div className="bcart-duration-group">
                  <label className="duration-label">SELECT RENTAL DURATION</label>
                  <div className="duration-pills">
                    {[1, 2, 3, 5, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`duration-pill ${days === d ? "active" : ""}`}
                        onClick={() => setDays(d)}
                      >
                        <span className="pill-days">
                          {d} {d === 1 ? "Day" : "Days"}
                        </span>
                        {d >= 7 ? (
                          <span className="pill-save">15% OFF</span>
                        ) : d >= 5 ? (
                          <span className="pill-save">10% OFF</span>
                        ) : d >= 3 ? (
                          <span className="pill-save">5% OFF</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Financial Summary Table */}
                <div className="bcart-cost-table">
                  <div className="cost-row">
                    <span>
                      Bundle Rate ({days} {days === 1 ? "day" : "days"})
                    </span>
                    <span className="cost-val">₹{rawSubtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="cost-row discount-row">
                      <span>Duration Discount ({discountPercent}%)</span>
                      <span className="cost-val">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="cost-row">
                    <span>Peer Insurance & Trust Fee</span>
                    <span className="cost-val">₹{platformFee}</span>
                  </div>

                  <div className="cost-row deposit-row">
                    <span>Refundable Deposit (100% Return)</span>
                    <span className="cost-val">₹{totalDeposit}</span>
                  </div>

                  <div className="cost-divider" />

                  <div className="cost-total-row">
                    <div>
                      <span className="total-label">Grand Total Payable</span>
                      <span className="total-sub">Includes ₹{totalDeposit} refundable deposit</span>
                    </div>
                    <span className="total-val">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Terms Checkboxes */}
                <div className="bcart-terms-group">
                  <label className="term-checkbox-label">
                    <input
                      type="checkbox"
                      checked={terms.term1}
                      onChange={(e) => setTerms({ ...terms, term1: e.target.checked })}
                    />
                    <span>I agree to return all bundle equipment on or before the return deadline.</span>
                  </label>

                  <label className="term-checkbox-label">
                    <input
                      type="checkbox"
                      checked={terms.term2}
                      onChange={(e) => setTerms({ ...terms, term2: e.target.checked })}
                    />
                    <span>I accept responsibility for inspecting gear condition upon handover.</span>
                  </label>

                  <label className="term-checkbox-label">
                    <input
                      type="checkbox"
                      checked={terms.term3}
                      onChange={(e) => setTerms({ ...terms, term3: e.target.checked })}
                    />
                    <span>I acknowledge security deposit escrow & peer trust terms.</span>
                  </label>
                </div>

                {/* Submit Checkout Button */}
                <button
                  className="bcart-submit-btn"
                  disabled={!allTermsChecked || isConfirmed}
                  onClick={handleConfirmOrder}
                >
                  {isConfirmed ? (
                    <>
                      <RefreshCw size={18} className="spin-icon" />
                      <span>Processing Contract...</span>
                    </>
                  ) : (
                    <span>Confirm & Rent Bundle (₹{finalTotal}) →</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
