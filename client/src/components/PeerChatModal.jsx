import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  X,
  ShieldCheck,
  Check,
  CheckCheck,
  Sparkles,
  Tag,
  Clock,
  MapPin,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import TrustBadge from "./TrustBadge.jsx";
import "./PeerChatModal.css";

export default function PeerChatModal({
  isOpen,
  onClose,
  recipient = {
    id: 1,
    name: "Arjun Mehta",
    dept: "Film & Media Studies",
    room: "Hostel 4, Room 312",
    trustScore: 94,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    verified: true,
  },
  item = {
    id: 1,
    name: "Sony Alpha A7 III Mirrorless Camera",
    dailyRate: 350,
    deposit: 800,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80",
  },
  onAcceptOffer,
}) {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [negotiatedRate, setNegotiatedRate] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "peer",
      text: `Hey! Thanks for looking at my ${item?.name || "gear"}. It is in mint condition and available this week. Feel free to ask any questions or negotiate rental duration!`,
      timestamp: "Just now",
      isOffer: false,
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend) => {
    const text = (typeof textToSend === "string" ? textToSend : inputMessage).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOffer: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // Simulate smart peer bot reply
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Sounds good! I'm happy to help you with that.";
      let offerCard = null;

      const lower = text.toLowerCase();

      if (lower.includes("₹") || lower.includes("price") || lower.includes("rate") || lower.includes("discount") || lower.includes("negotiate")) {
        const discounted = Math.max(100, Math.round((item?.dailyRate || 300) * 0.85));
        setNegotiatedRate(discounted);
        replyText = `I can offer a peer discount of ₹${discounted}/day if you take it for 3+ days! How does that sound?`;
        offerCard = {
          discountedRate: discounted,
          originalRate: item?.dailyRate || 300,
        };
      } else if (lower.includes("pickup") || lower.includes("location") || lower.includes("where") || lower.includes("hostel")) {
        replyText = `We can meet directly at ${recipient?.room || "Hostel 4 Lobby"} or the campus central library entrance whenever you are free.`;
      } else if (lower.includes("cable") || lower.includes("batter") || lower.includes("sd") || lower.includes("included")) {
        replyText = `Yes! I include 2 original batteries, high-speed dual charger, 128GB V60 SD card, and a padded carry case at no extra charge.`;
      } else {
        replyText = `Sure thing! Feel free to seal the borrowing agreement and we can finalize the handover time.`;
      }

      const peerMsg = {
        id: Date.now() + 1,
        sender: "peer",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOffer: !!offerCard,
        offerData: offerCard,
      };

      setMessages((prev) => [...prev, peerMsg]);
    }, 1200);
  };

  const handleQuickOffer = (offerText) => {
    handleSendMessage(offerText);
  };

  const handleAcceptNegotiatedDeal = (offerPrice) => {
    if (onAcceptOffer) {
      onAcceptOffer({
        rate: offerPrice,
        lender: recipient,
        item,
      });
    } else {
      navigate(`/app/borrow/${item?.id || 1}`, {
        state: {
          resourceId: item?.id || 1,
          customRate: offerPrice,
        },
      });
    }
    onClose();
  };

  return (
    <div className="peer-chat-overlay" role="dialog" aria-modal="true" aria-labelledby="peer-chat-header">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.25 }}
        className="peer-chat-card paper-card"
      >
        {/* Header */}
        <div className="peer-chat-header">
          <div className="peer-header-left">
            <div className="peer-avatar-wrap">
              <img src={recipient.avatar} alt={recipient.name} className="peer-chat-avatar" />
              <span className="online-indicator" title="Active on Campus" />
            </div>
            <div>
              <div className="peer-name-row">
                <strong id="peer-chat-header" className="peer-chat-name">
                  {recipient.name}
                </strong>
                <TrustBadge score={recipient.trustScore} size="sm" showVerified={recipient.verified} />
              </div>
              <div className="peer-chat-dept font-mono">
                {recipient.dept} • {recipient.room}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="peer-chat-close-btn"
            onClick={onClose}
            aria-label="Close Chat Window"
          >
            <X size={18} />
          </button>
        </div>

        {/* Item Context Bar */}
        <div className="peer-chat-item-banner">
          <img src={item.image} alt={item.name} className="peer-item-thumb" />
          <div className="peer-item-details">
            <div className="peer-item-title">{item.name}</div>
            <div className="peer-item-price font-mono">
              Listed Rate: <strong>₹{item.dailyRate}/day</strong> • Deposit: <strong>₹{item.deposit}</strong>
            </div>
          </div>
          {negotiatedRate && (
            <div className="negotiated-pill font-mono">
              DEAL: ₹{negotiatedRate}/DAY
            </div>
          )}
        </div>

        {/* Messages List */}
        <div className="peer-chat-body">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message-row ${msg.sender === "user" ? "user-sent" : "peer-received"}`}>
              <div className="chat-bubble">
                <p className="chat-text">{msg.text}</p>
                <div className="chat-meta font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "user" && <CheckCheck size={12} className="check-icon" />}
                </div>

                {/* Lender Offer Card inside message */}
                {msg.isOffer && msg.offerData && (
                  <div className="lender-offer-card">
                    <div className="offer-badge font-mono">
                      <Tag size={12} /> SPECIAL PEER OFFER
                    </div>
                    <div className="offer-price-row">
                      <span className="strike font-mono">₹{msg.offerData.originalRate}/day</span>
                      <strong className="deal-price font-mono">₹{msg.offerData.discountedRate}/day</strong>
                    </div>
                    <button
                      type="button"
                      className="accept-deal-btn"
                      onClick={() => handleAcceptNegotiatedDeal(msg.offerData.discountedRate)}
                    >
                      <span>Accept & Start Agreement →</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-message-row peer-received">
              <div className="chat-bubble typing-bubble font-mono">
                <span>{recipient.name.split(" ")[0]} is typing</span>
                <span className="typing-dots">...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Negotiate Chips */}
        <div className="peer-quick-negotiate-chips" role="group" aria-label="Suggested quick replies">
          <button
            type="button"
            className="negotiate-chip font-mono"
            onClick={() => handleQuickOffer(`Can we do ₹${Math.round(item.dailyRate * 0.85)}/day for 3 days?`)}
          >
            Ask for ₹{Math.round(item.dailyRate * 0.85)}/day rate
          </button>
          <button
            type="button"
            className="negotiate-chip font-mono"
            onClick={() => handleQuickOffer("Is pickup available tonight at Hostel?")}
          >
            Ask about Pickup Time
          </button>
          <button
            type="button"
            className="negotiate-chip font-mono"
            onClick={() => handleQuickOffer("Are extra cables, SD cards & charger included?")}
          >
            Check Included Accessories
          </button>
        </div>

        {/* Chat Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="peer-chat-footer"
        >
          <input
            ref={inputRef}
            type="text"
            className="peer-chat-input"
            placeholder="Type a message or propose a daily rate..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            aria-label="Type message to seller"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="peer-chat-send-btn"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
