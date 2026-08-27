import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Flame,
  Clock,
  MapPin,
  MessageSquare,
  ThumbsUp,
  ArrowLeft,
  X,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Share2,
  Tag,
  ShieldCheck,
  Send,
  Zap,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import TrustBadge from "./TrustBadge.jsx";
import CategoryIcon from "./CategoryIcon.jsx";
import AccessibilityWidget from "./AccessibilityWidget.jsx";
import PeerChatModal from "./PeerChatModal.jsx";
import "./WantedBoardPage.css";

const INITIAL_WANTED_POSTS = [
  {
    id: 101,
    title: "Urgent: TI-84 Plus CE Graphing Calculator",
    category: "lab",
    urgency: "urgent", // urgent | normal | flexible
    duration: "2 Days",
    bounty: 150,
    studentName: "Meera Patel",
    studentDept: "Electronics & Communication",
    studentHostel: "Hostel 7, Room 204",
    trustScore: 95,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    description: "Need a TI-84 or TI-Nspire graphing calculator for Digital Signal Processing midterm exam this Friday afternoon. Willing to pay ₹150 deposit guarantee.",
    neededBy: "Tomorrow, 2:00 PM",
    upvotes: 6,
    responses: 3,
    createdAt: "2 hours ago",
    tags: ["DSP Exam", "Calculator", "ECE"],
    isFulfilled: false,
  },
  {
    id: 102,
    title: "Sony 24-70mm f/2.8 GM Lens (E-Mount)",
    category: "camera",
    urgency: "urgent",
    duration: "3 Days",
    bounty: 450,
    studentName: "Arjun Mehta",
    studentDept: "Film & Media Studies",
    studentHostel: "Hostel 4, Room 312",
    trustScore: 94,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    description: "Shooting annual graduation convocation documentary. Need a fast standard zoom for low-light auditorium coverage. Will take utmost care!",
    neededBy: "Saturday Morning",
    upvotes: 11,
    responses: 2,
    createdAt: "5 hours ago",
    tags: ["Convocation", "Sony Lens", "Video"],
    isFulfilled: false,
  },
  {
    id: 103,
    title: "Temperature Controlled Soldering Station + Desoldering Pump",
    category: "tool",
    urgency: "normal",
    duration: "1 Day",
    bounty: 100,
    studentName: "Vikram Singh",
    studentDept: "Robotics & Mechatronics",
    studentHostel: "Hostel 1, Room 503",
    trustScore: 88,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    description: "Urgent fix required on custom PCB header pins for our Robocon autonomous rover prototype.",
    neededBy: "Sunday Evening",
    upvotes: 4,
    responses: 1,
    createdAt: "1 day ago",
    tags: ["Robotics", "Soldering", "Hardware"],
    isFulfilled: false,
  },
  {
    id: 104,
    title: "Raspberry Pi 4 (8GB) with Power Supply & SD Card",
    category: "laptop",
    urgency: "normal",
    duration: "1 Week",
    bounty: 300,
    studentName: "Kavya Nair",
    studentDept: "Computer Engineering",
    studentHostel: "Hostel 2, Room 405",
    trustScore: 98,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    description: "Need an edge computing node to test lightweight computer vision model deployment before final project submission.",
    neededBy: "28 Aug",
    upvotes: 8,
    responses: 4,
    createdAt: "1 day ago",
    tags: ["Edge AI", "Raspberry Pi", "IoT"],
    isFulfilled: false,
  },
  {
    id: 105,
    title: "Amaran 100d / Godox SL60W Continuous Studio Light",
    category: "lighting",
    urgency: "flexible",
    duration: "2 Days",
    bounty: 250,
    studentName: "Priya Sharma",
    studentDept: "Design & Animation",
    studentHostel: "Hostel 7, Room 108",
    trustScore: 91,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    description: "Looking for a softbox or key light for hostel room product photography portfolio setup.",
    neededBy: "Next Week",
    upvotes: 3,
    responses: 0,
    createdAt: "2 days ago",
    tags: ["Lighting", "Portfolios", "Softbox"],
    isFulfilled: false,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "camera", label: "Cameras & Optics" },
  { id: "audio", label: "Audio & Microphones" },
  { id: "lighting", label: "Lighting & Grip" },
  { id: "laptop", label: "Computing & Chips" },
  { id: "tool", label: "Tools & Soldering" },
  { id: "lab", label: "Lab Gear & Instruments" },
  { id: "vr", label: "VR & Drones" },
];

export default function WantedBoardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang } = useLanguage();

  // Posts State (Persisted)
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("cc_wanted_posts");
      return saved ? JSON.parse(saved) : INITIAL_WANTED_POSTS;
    } catch {
      return INITIAL_WANTED_POSTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cc_wanted_posts", JSON.stringify(posts));
    } catch (e) {
      console.warn("Could not persist wanted posts", e);
    }
  }, [posts]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all"); // all | urgent | normal | flexible

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);
  const [activePostToLend, setActivePostToLend] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New Post Form State
  const [newPost, setNewPost] = useState({
    title: "",
    category: "camera",
    urgency: "urgent",
    duration: "2 Days",
    bounty: 150,
    neededBy: "Tomorrow",
    description: "",
    tagsInput: "",
  });

  // Offer Lend Form State
  const [lendOffer, setLendOffer] = useState({
    gearName: "",
    message: "",
    handoverLocation: "Hostel Lobby or Campus Library",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.description.trim()) {
      alert("Please provide an item title and description.");
      return;
    }

    const tags = newPost.tagsInput
      ? newPost.tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
      : [newPost.category];

    const postItem = {
      id: Date.now(),
      title: newPost.title.trim(),
      category: newPost.category,
      urgency: newPost.urgency,
      duration: newPost.duration,
      bounty: Number(newPost.bounty) || 0,
      studentName: user?.name || "Siddharth Joshi",
      studentDept: user?.dept || "Computer Engineering",
      studentHostel: "Hostel 3, Room 410",
      trustScore: 92,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      description: newPost.description.trim(),
      neededBy: newPost.neededBy || "This Week",
      upvotes: 1,
      responses: 0,
      createdAt: "Just now",
      tags: tags.length > 0 ? tags : ["Equipment"],
      isFulfilled: false,
    };

    setPosts([postItem, ...posts]);
    setIsCreateOpen(false);
    setNewPost({
      title: "",
      category: "camera",
      urgency: "urgent",
      duration: "2 Days",
      bounty: 150,
      neededBy: "Tomorrow",
      description: "",
      tagsInput: "",
    });
    showToast("Hardware Request posted live to Campus Board.");
  };

  const handleUpvote = (id) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  const handleOpenLendModal = (post) => {
    setActivePostToLend(post);
    setLendOffer({
      gearName: post.title,
      message: `Hey ${post.studentName}, I have this gear in great condition and can lend it for your project!`,
      handoverLocation: "Hostel Quad or Library Entrance",
    });
    setIsLendModalOpen(true);
  };

  const handleSubmitLendOffer = (e) => {
    e.preventDefault();
    if (!activePostToLend) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === activePostToLend.id ? { ...p, responses: p.responses + 1 } : p
      )
    );

    setIsLendModalOpen(false);
    showToast(`Your lending offer sent to ${activePostToLend.studentName}.`);
  };

  // Filtered Posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;

    const matchesUrgency =
      selectedUrgency === "all" || post.urgency === selectedUrgency;

    return matchesSearch && matchesCategory && matchesUrgency;
  });

  return (
    <div className="wanted-page-root">
      {/* Universal Accessibility Widget (Bottom Left) */}
      <AccessibilityWidget />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="wanted-toast-banner"
            role="alert"
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="wanted-navbar" role="banner">
        <div className="wanted-nav-left">
          <button
            className="wanted-back-btn"
            onClick={() => navigate("/")}
            aria-label="Back to Home"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>
          <div
            className="wanted-nav-brand"
            onClick={() => navigate("/")}
            role="button"
            tabIndex={0}
            aria-label="Campus Circular Home"
          >
            campus circular.
          </div>
          <span className="wanted-badge font-mono">WANTED BOARD</span>
        </div>

        <div className="wanted-nav-right">
          <button
            className="wanted-explore-btn"
            onClick={() => navigate("/explore")}
            aria-label="Browse Available Catalog"
          >
            Explore Catalog
          </button>
          <button
            className="wanted-create-hero-btn"
            onClick={() => setIsCreateOpen(true)}
            aria-label="Create a new hardware request post"
          >
            <Plus size={16} />
            <span>Post Hardware Want</span>
          </button>
        </div>
      </header>

      {/* Hero Headline Section */}
      <section className="wanted-hero-banner" aria-labelledby="wanted-main-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="wanted-hero-inner"
        >
          <div className="wanted-hero-tag font-mono">
            <Flame size={14} className="wanted-fire-icon" />
            <span>PEER DEMAND & WISH-BOARD PROTOCOL</span>
          </div>

          <h1 id="wanted-main-heading" className="wanted-hero-title font-serif">
            Can't Find The Hardware You Need? <br />
            <span className="wanted-hero-sub">Post Your Request & Get Matched by Peers.</span>
          </h1>

          <p className="wanted-hero-desc">
            Broadcast required tools, cameras, audio interfaces, and lab instruments across hostels and departments. 
            Peers with idle gear can answer within minutes.
          </p>

          <div className="wanted-hero-stats">
            <div className="wanted-stat-pill">
              <strong>{posts.length}</strong> Active Requests
            </div>
            <div className="wanted-stat-pill">
              <strong>₹250</strong> Avg Bounty Reward
            </div>
            <div className="wanted-stat-pill">
              <strong>96%</strong> Match Rate on Campus
            </div>
          </div>
        </motion.div>
      </section>

      {/* Filter and Search Bar */}
      <main className="wanted-main-container" role="main">
        <div className="wanted-controls-bar">
          {/* Search Bar */}
          <div className="wanted-search-wrapper">
            <Search size={16} className="wanted-search-icon" />
            <input
              type="text"
              className="wanted-search-input"
              placeholder="Search requested gear, camera models, lab tools, or hostel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search hardware request posts"
            />
            {searchQuery && (
              <button
                type="button"
                className="wanted-clear-search"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search text"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Urgency Filter Chips */}
          <div className="wanted-urgency-filters" role="group" aria-label="Filter by Urgency">
            <button
              className={`wanted-filter-chip ${selectedUrgency === "all" ? "active" : ""}`}
              onClick={() => setSelectedUrgency("all")}
              aria-pressed={selectedUrgency === "all"}
            >
              All Needs ({posts.length})
            </button>
            <button
              className={`wanted-filter-chip urgent ${selectedUrgency === "urgent" ? "active" : ""}`}
              onClick={() => setSelectedUrgency("urgent")}
              aria-pressed={selectedUrgency === "urgent"}
            >
              <Flame size={13} style={{ marginRight: "4px", verticalAlign: "middle" }} />
              <span>Urgent (24h)</span>
            </button>
            <button
              className={`wanted-filter-chip ${selectedUrgency === "normal" ? "active" : ""}`}
              onClick={() => setSelectedUrgency("normal")}
              aria-pressed={selectedUrgency === "normal"}
            >
              <Clock size={13} style={{ marginRight: "4px", verticalAlign: "middle" }} />
              <span>This Week</span>
            </button>
            <button
              className={`wanted-filter-chip ${selectedUrgency === "flexible" ? "active" : ""}`}
              onClick={() => setSelectedUrgency("flexible")}
              aria-pressed={selectedUrgency === "flexible"}
            >
              <Sparkles size={13} style={{ marginRight: "4px", verticalAlign: "middle" }} />
              <span>Flexible</span>
            </button>
          </div>
        </div>

        {/* Category Select Strip */}
        <div className="wanted-cat-strip" role="group" aria-label="Filter by Category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`wanted-cat-pill ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
              aria-pressed={selectedCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts Feed Grid */}
        <div className="wanted-feed-grid">
          {filteredPosts.length === 0 ? (
            <div className="wanted-empty-card">
              <Sparkles size={36} className="wanted-empty-icon" />
              <h3>No hardware requests match your filter</h3>
              <p>Be the first student to post this item request!</p>
              <button
                className="wanted-create-hero-btn"
                onClick={() => setIsCreateOpen(true)}
                style={{ marginTop: "16px" }}
              >
                <Plus size={16} /> Post Equipment Want
              </button>
            </div>
          ) : (
            filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`wanted-post-card ${post.urgency === "urgent" ? "is-urgent" : ""}`}
              >
                {/* Post Top Meta */}
                <div className="wanted-card-header">
                  <div className="wanted-user-meta">
                    <img
                      src={post.avatar}
                      alt={`${post.studentName} profile photo`}
                      className="wanted-avatar"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div>
                      <div className="wanted-name-row">
                        <strong className="wanted-author">{post.studentName}</strong>
                        <TrustBadge score={post.trustScore} size="sm" showVerified={true} />
                      </div>
                      <div className="wanted-dept-text">
                        {post.studentDept} • {post.studentHostel}
                      </div>
                    </div>
                  </div>

                  <div className="wanted-card-badges">
                    {post.urgency === "urgent" ? (
                      <span className="wanted-urgency-badge urgent font-mono" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Flame size={11} /> URGENT
                      </span>
                    ) : post.urgency === "normal" ? (
                      <span className="wanted-urgency-badge normal font-mono" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={11} /> THIS WEEK
                      </span>
                    ) : (
                      <span className="wanted-urgency-badge flexible font-mono" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Sparkles size={11} /> FLEXIBLE
                      </span>
                    )}
                  </div>
                </div>

                {/* Post Title & Description */}
                <h3 className="wanted-post-title font-serif">{post.title}</h3>
                <p className="wanted-post-desc">{post.description}</p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="wanted-tags-row">
                    {post.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="wanted-tag font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Specs & Timeline Box */}
                <div className="wanted-specs-box">
                  <div className="wanted-spec-item">
                    <span className="wanted-spec-label font-mono">DURATION NEEDED</span>
                    <span className="wanted-spec-val">{post.duration}</span>
                  </div>
                  <div className="wanted-spec-item">
                    <span className="wanted-spec-label font-mono">REQUIRED BY</span>
                    <span className="wanted-spec-val">{post.neededBy}</span>
                  </div>
                  <div className="wanted-spec-item">
                    <span className="wanted-spec-label font-mono">BOUNTY OFFER</span>
                    <span className="wanted-spec-bounty font-mono">
                      {post.bounty > 0 ? `₹${post.bounty}` : "Peer Exchange"}
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="wanted-card-footer">
                  <div className="wanted-footer-stats font-mono">
                    <button
                      type="button"
                      className="wanted-upvote-btn"
                      onClick={() => handleUpvote(post.id)}
                      aria-label={`Upvote request. Currently ${post.upvotes} upvotes`}
                    >
                      <ThumbsUp size={13} />
                      <span>{post.upvotes} Need This</span>
                    </button>
                    <span className="wanted-responses-count">
                      <MessageSquare size={13} /> {post.responses} Offers
                    </span>
                  </div>

                  <button
                    type="button"
                    className="wanted-lend-action-btn"
                    onClick={() => handleOpenLendModal(post)}
                    aria-label={`Offer to lend equipment to ${post.studentName}`}
                  >
                    <span>I Can Lend This →</span>
                  </button>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </main>

      {/* CREATE POST MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="wanted-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="create-modal-title">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="wanted-modal-card paper-card"
            >
              <div className="wanted-modal-header">
                <div>
                  <span className="wanted-badge font-mono">BROADCAST NEED</span>
                  <h2 id="create-modal-title" className="font-serif" style={{ fontSize: "1.4rem", margin: "4px 0 0" }}>
                    Create Hardware Want Post
                  </h2>
                </div>
                <button
                  type="button"
                  className="wanted-modal-close"
                  onClick={() => setIsCreateOpen(false)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="wanted-modal-form">
                <div className="wanted-form-group">
                  <label htmlFor="w-title">Equipment / Item Name *</label>
                  <input
                    id="w-title"
                    type="text"
                    required
                    placeholder="e.g. Sony A7 III Body or Logic Analyzer 24MHz"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>

                <div className="wanted-form-row">
                  <div className="wanted-form-group">
                    <label htmlFor="w-cat">Category</label>
                    <select
                      id="w-cat"
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    >
                      <option value="camera">Cameras & Lenses</option>
                      <option value="audio">Audio & Microphones</option>
                      <option value="lighting">Studio Lighting</option>
                      <option value="laptop">Computing & Chips</option>
                      <option value="tool">Tools & Soldering</option>
                      <option value="lab">Lab Gear & Instruments</option>
                      <option value="vr">VR & Drones</option>
                    </select>
                  </div>

                  <div className="wanted-form-group">
                    <label htmlFor="w-urgency">Urgency</label>
                    <select
                      id="w-urgency"
                      value={newPost.urgency}
                      onChange={(e) => setNewPost({ ...newPost, urgency: e.target.value })}
                    >
                      <option value="urgent">Urgent (Within 24h)</option>
                      <option value="normal">Normal (This Week)</option>
                      <option value="flexible">Flexible (Semester)</option>
                    </select>
                  </div>
                </div>

                <div className="wanted-form-row">
                  <div className="wanted-form-group">
                    <label htmlFor="w-duration">Duration Needed</label>
                    <input
                      id="w-duration"
                      type="text"
                      placeholder="e.g. 2 Days or 1 Weekend"
                      value={newPost.duration}
                      onChange={(e) => setNewPost({ ...newPost, duration: e.target.value })}
                    />
                  </div>

                  <div className="wanted-form-group">
                    <label htmlFor="w-bounty">Bounty Offer (₹)</label>
                    <input
                      id="w-bounty"
                      type="number"
                      placeholder="e.g. 200 (or 0 for free loan)"
                      value={newPost.bounty}
                      onChange={(e) => setNewPost({ ...newPost, bounty: e.target.value })}
                    />
                  </div>
                </div>

                <div className="wanted-form-group">
                  <label htmlFor="w-neededby">Required By Date / Time</label>
                  <input
                    id="w-neededby"
                    type="text"
                    placeholder="e.g. Tomorrow by 3:00 PM"
                    value={newPost.neededBy}
                    onChange={(e) => setNewPost({ ...newPost, neededBy: e.target.value })}
                  />
                </div>

                <div className="wanted-form-group">
                  <label htmlFor="w-desc">Project Context & Purpose *</label>
                  <textarea
                    id="w-desc"
                    required
                    rows={3}
                    placeholder="Describe what lab project, shoot, or hackathon you need this for..."
                    value={newPost.description}
                    onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  />
                </div>

                <div className="wanted-form-group">
                  <label htmlFor="w-tags">Tags (Comma separated)</label>
                  <input
                    id="w-tags"
                    type="text"
                    placeholder="e.g. Midterms, Robotics, Robocon"
                    value={newPost.tagsInput}
                    onChange={(e) => setNewPost({ ...newPost, tagsInput: e.target.value })}
                  />
                </div>

                <div className="wanted-modal-footer">
                  <button
                    type="button"
                    className="wanted-btn-cancel"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="wanted-btn-submit">
                    Post to Campus Board →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEND OFFER MODAL */}
      <AnimatePresence>
        {isLendModalOpen && activePostToLend && (
          <div className="wanted-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="lend-modal-title">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="wanted-modal-card paper-card"
            >
              <div className="wanted-modal-header">
                <div>
                  <span className="wanted-badge font-mono">PEER MATCHING</span>
                  <h2 id="lend-modal-title" className="font-serif" style={{ fontSize: "1.4rem", margin: "4px 0 0" }}>
                    Offer Gear to {activePostToLend.studentName}
                  </h2>
                </div>
                <button
                  type="button"
                  className="wanted-modal-close"
                  onClick={() => setIsLendModalOpen(false)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitLendOffer} className="wanted-modal-form">
                <div className="wanted-summary-box">
                  <div className="font-mono" style={{ fontSize: "0.75rem", color: "#666" }}>
                    REQUESTED GEAR
                  </div>
                  <strong style={{ fontSize: "1.05rem", color: "#111", display: "block" }}>
                    {activePostToLend.title}
                  </strong>
                  <div style={{ fontSize: "0.82rem", color: "#444", marginTop: "2px" }}>
                    Location: {activePostToLend.studentHostel} • Due in {activePostToLend.duration}
                  </div>
                </div>

                <div className="wanted-form-group">
                  <label htmlFor="l-gear">Your Gear Spec / Model *</label>
                  <input
                    id="l-gear"
                    type="text"
                    required
                    value={lendOffer.gearName}
                    onChange={(e) => setLendOffer({ ...lendOffer, gearName: e.target.value })}
                  />
                </div>

                <div className="wanted-form-group">
                  <label htmlFor="l-msg">Message & Handover Protocol *</label>
                  <textarea
                    id="l-msg"
                    required
                    rows={3}
                    value={lendOffer.message}
                    onChange={(e) => setLendOffer({ ...lendOffer, message: e.target.value })}
                  />
                </div>

                <div className="wanted-form-group">
                  <label htmlFor="l-loc">Proposed Campus Handover Spot</label>
                  <input
                    id="l-loc"
                    type="text"
                    value={lendOffer.handoverLocation}
                    onChange={(e) => setLendOffer({ ...lendOffer, handoverLocation: e.target.value })}
                  />
                </div>

                <div className="wanted-modal-footer">
                  <button
                    type="button"
                    className="wanted-btn-cancel"
                    onClick={() => setIsLendModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="wanted-btn-submit">
                    Send Lending Offer →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
