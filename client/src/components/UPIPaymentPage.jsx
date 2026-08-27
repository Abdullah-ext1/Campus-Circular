import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Copy,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  FileText,
  UploadCloud,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { resources, getStudent } from "../data/mockData.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import AccessibilityWidget from "./AccessibilityWidget.jsx";
import upiQrImage from "../assets/upi_qr.jpg";
import "./UPIPaymentPage.css";

export default function UPIPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAuth();

  // Payment data passed from Cart or Direct Borrowing
  const paymentState = location.state || {};
  const totalAmount = paymentState.totalAmount || 849;
  const items = paymentState.items || ["Sony A7 III Mirrorless", "Camera Tripod"];
  const orderId = paymentState.orderId || `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const days = paymentState.days || 3;
  const deposit = paymentState.deposit || 500;
  const platformFee = paymentState.platformFee || 49;

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
  const [utrNumber, setUtrNumber] = useState("");
  const [payerName, setPayerName] = useState(user?.name || "Siddharth Joshi");
  const [payerPhone, setPayerPhone] = useState("9876543210");
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const upiId = "ammarshaikh09909@okaxis";

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      alert("Please enter the 12-digit UPI Reference / UTR Number from your banking app.");
      return;
    }

    setIsProcessing(true);

    const newPaymentRecord = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      orderId,
      items,
      amount: totalAmount,
      deposit,
      platformFee,
      days,
      payerName,
      payerPhone,
      studentId: user?.id || 8,
      utrNumber: utrNumber.trim(),
      timestamp: new Date().toISOString(),
      status: "PENDING_APPROVAL", // PENDING_APPROVAL | APPROVED | REJECTED
      upiId,
    };

    // Save to localStorage for Admin Dashboard
    try {
      const existingPayments = JSON.parse(localStorage.getItem("cc_pending_payments") || "[]");
      localStorage.setItem("cc_pending_payments", JSON.stringify([newPaymentRecord, ...existingPayments]));

      // Also create borrowing entry in pending payment state
      const existingBorrowings = JSON.parse(localStorage.getItem("cc_borrowings") || "[]");
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + days);

      const newBorrowing = {
        id: `BRW-${Date.now().toString().slice(-4)}`,
        borrowerId: user?.id || 8,
        resourceId: 1,
        ownerId: 2,
        bundleItems: items,
        currentState: 1,
        timestamps: {
          requested: new Date().toISOString(),
          accepted: null,
          handover: null,
          borrowed: null,
          due: dueDate.toISOString(),
          returned: null,
        },
        isLate: false,
        deposit,
        dailyRate: Math.round((totalAmount - deposit - platformFee) / days),
        totalDays: days,
        platformFee,
        totalAmount,
        notes: `UPI Payment Pending Verification (UTR: ${utrNumber})`,
        paymentStatus: "PENDING_APPROVAL",
        utrNumber: utrNumber.trim(),
      };

      localStorage.setItem("cc_borrowings", JSON.stringify([newBorrowing, ...existingBorrowings]));
    } catch (err) {
      console.warn("Storage error", err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSubmitted(true);
    }, 1000);
  };

  return (
    <div className="upi-payment-root">
      <AccessibilityWidget />

      {/* Top Navbar */}
      <header className="upi-navbar" role="banner">
        <button className="upi-back-btn" onClick={() => navigate(-1)} aria-label="Go Back">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="upi-nav-brand font-sans" onClick={() => navigate("/")}>
          campus circular.
        </div>

        <div className="upi-nav-secure font-mono">
          <ShieldCheck size={16} className="secure-icon" />
          <span>256-BIT ENCRYPTED</span>
        </div>
      </header>

      <main className="upi-main-stage" role="main">
        <AnimatePresence mode="wait">
          {!paymentSubmitted ? (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="upi-checkout-layout"
            >
              {/* Left Column: QR Code & UPI Scan Box */}
              <section className="upi-card qr-section" aria-labelledby="qr-heading">
                <div className="qr-header">
                  <div className="qr-badge font-mono">
                    <Clock size={14} />
                    <span>SESSION EXPIRES IN {formatTimer(timeLeft)}</span>
                  </div>
                  <h1 id="qr-heading" className="qr-title font-serif">
                    Scan & Pay with UPI
                  </h1>
                  <p className="qr-subtitle">
                    Scan with Google Pay, PhonePe, Paytm, BHIM, or any banking app
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="qr-frame-wrapper">
                  <div className="qr-box">
                    <img
                      src={upiQrImage}
                      alt="Google Pay / PhonePe UPI QR Code for Ammar"
                      className="real-upi-qr-img"
                      style={{
                        width: "240px",
                        height: "auto",
                        borderRadius: "8px",
                        display: "block",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div className="qr-amount-pill font-mono">
                    AMOUNT: <strong>₹{totalAmount}</strong>
                  </div>
                </div>

                {/* 1-Click Copy UPI */}
                <div className="upi-id-copy-row">
                  <div className="upi-id-text">
                    <span className="font-mono label">UPI ID:</span>
                    <strong className="font-mono val">{upiId}</strong>
                  </div>
                  <button
                    type="button"
                    className={`upi-copy-btn ${copied ? "copied" : ""}`}
                    onClick={handleCopyUpi}
                    aria-label="Copy UPI ID to clipboard"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={14} /> <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> <span>COPY ID</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="upi-apps-icons font-mono">
                  <span>GPAY</span> • <span>PHONEPE</span> • <span>PAYTM</span> • <span>BHIM</span> • <span>CRED</span>
                </div>
              </section>

              {/* Right Column: Order Summary & UTR Verification Form */}
              <section className="upi-card form-section" aria-labelledby="verify-heading">
                {/* Order Summary Box */}
                <div className="order-summary-box">
                  <div className="summary-header">
                    <span className="font-mono ref-no">{orderId}</span>
                    <span className="stamp stamp-gold font-serif">PEER ESCROW</span>
                  </div>

                  <h3 className="summary-items-title font-sans">
                    {items.length === 1 ? items[0] : `${items[0]} + ${items.length - 1} more`}
                  </h3>

                  <div className="summary-breakdown-list">
                    <div className="breakdown-row">
                      <span>Rental Duration</span>
                      <strong>{days} Days</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>Refundable Security Deposit</span>
                      <strong className="font-mono">₹{deposit}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>Platform Trust Guarantee</span>
                      <strong className="font-mono">₹{platformFee}</strong>
                    </div>
                    <div className="breakdown-row total-row">
                      <span>Total Payable</span>
                      <strong className="font-mono total-amt">₹{totalAmount}</strong>
                    </div>
                  </div>
                </div>

                {/* Payment Reference Verification Form */}
                <form onSubmit={handleSubmitPayment} className="utr-submit-form">
                  <h2 id="verify-heading" className="verify-title font-serif">
                    Step 2: Confirm Transaction
                  </h2>
                  <p className="verify-desc">
                    After completing the payment in your UPI app, enter the 12-digit UTR / Reference ID below for instant admin verification.
                  </p>

                  <div className="form-field-group">
                    <label htmlFor="utr-field">UPI Reference / UTR Number (12 Digits) *</label>
                    <input
                      id="utr-field"
                      type="text"
                      required
                      placeholder="e.g. 423891084291 or UPI-849201"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="font-mono utr-input"
                    />
                  </div>

                  <div className="form-field-row">
                    <div className="form-field-group">
                      <label htmlFor="payer-name">Payer Student Name</label>
                      <input
                        id="payer-name"
                        type="text"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                      />
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="payer-phone">Registered Phone</label>
                      <input
                        id="payer-phone"
                        type="text"
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="trust-note-box">
                    <ShieldCheck size={18} className="trust-icon" />
                    <div>
                      <strong>Escrow Security Guarantee</strong>
                      <p>
                        Your funds remain securely held in campus protocol escrow until physical condition inspection is sealed at handover.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="submit-payment-btn"
                  >
                    {isProcessing ? "Verifying Transaction..." : "Submit Payment for Admin Approval →"}
                  </button>
                </form>
              </section>
            </motion.div>
          ) : (
            /* SUCCESS CONFIRMATION SCREEN */
            <motion.div
              key="confirmation-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="payment-success-card paper-card"
            >
              <div className="success-icon-wrap">
                <CheckCircle2 size={48} className="success-check" />
              </div>

              <span className="stamp stamp-gold font-serif" style={{ marginBottom: "10px" }}>
                TRANSACTION RECORDED
              </span>

              <h1 className="font-serif success-title">
                Payment Submitted for Admin Approval!
              </h1>

              <p className="success-desc">
                Your payment of <strong className="font-mono">₹{totalAmount}</strong> (UTR:{" "}
                <span className="font-mono">{utrNumber}</span>) has been routed to the Admin Dashboard for instant verification.
              </p>

              <div className="status-timeline-card">
                <div className="status-step active">
                  <div className="step-dot font-mono">1</div>
                  <div>
                    <strong>UPI Payment Submitted</strong>
                    <div className="step-time font-mono">Just Now</div>
                  </div>
                </div>

                <div className="status-step pending">
                  <div className="step-dot font-mono">2</div>
                  <div>
                    <strong>Admin Verification Pending</strong>
                    <div className="step-time font-mono">Typically within 5-10 minutes</div>
                  </div>
                </div>

                <div className="status-step">
                  <div className="step-dot font-mono">3</div>
                  <div>
                    <strong>Equipment Handover Unlocked</strong>
                    <div className="step-time font-mono">Hostel meetup scheduled</div>
                  </div>
                </div>
              </div>

              <div className="success-actions-row">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => navigate("/app", { state: { targetTab: "activity" } })}
                >
                  Go to Active Loans & Tracking →
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/admin")}
                >
                  View in Admin Console (Demo Mode)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
