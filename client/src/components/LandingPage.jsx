import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, RefreshCw, Users } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import "./LandingPage.css";

// 14 Campus lendable items with transparent PNG cutouts
const ROTATING_ITEMS = [
  {
    id: 1,
    resourceId: 1,
    title: "DSLR Camera",
    category: "Media",
    image: "https://pngimg.com/uploads/photo_camera/photo_camera_PNG101641.png",
    x: -420,
    y: -360,
    size: 115,
    rotation: -18,
  },
  {
    id: 2,
    resourceId: 8,
    title: "Acoustic Guitar",
    category: "Music",
    image: "https://pngimg.com/uploads/guitar/guitar_PNG3338.png",
    x: -80,
    y: -490,
    size: 135,
    rotation: 25,
  },
  {
    id: 3,
    resourceId: 4,
    title: "Studio Headphones",
    category: "Audio",
    image: "https://pngimg.com/uploads/headphones/headphones_PNG101985.png",
    x: 280,
    y: -440,
    size: 110,
    rotation: -22,
  },
  {
    id: 4,
    resourceId: 6,
    title: "Academic Textbooks",
    category: "Books",
    image: "https://pngimg.com/uploads/book/book_PNG2111.png",
    x: 520,
    y: -310,
    size: 120,
    rotation: 15,
  },
  {
    id: 5,
    resourceId: 3,
    title: "Camera Tripod",
    category: "Media",
    image: "https://pngimg.com/uploads/tripod/tripod_PNG147.png",
    x: 570,
    y: -70,
    size: 130,
    rotation: -35,
  },
  {
    id: 6,
    resourceId: 11,
    title: "Cruiser Skateboard",
    category: "Sports",
    image: "https://pngimg.com/uploads/skateboard/skateboard_PNG11707.png",
    x: 510,
    y: 200,
    size: 125,
    rotation: 40,
  },
  {
    id: 7,
    resourceId: 5,
    title: "Laboratory Microscope",
    category: "Science",
    image: "https://pngimg.com/uploads/microscope/microscope_PNG101130.png",
    x: 430,
    y: 420,
    size: 115,
    rotation: -12,
  },
  {
    id: 8,
    resourceId: 10,
    title: "Campus Bicycle",
    category: "Mobility",
    image: "https://pngimg.com/uploads/bicycle/bicycle_PNG5380.png",
    x: 120,
    y: 500,
    size: 145,
    rotation: 8,
  },
  {
    id: 9,
    resourceId: 9,
    title: "Basketball",
    category: "Sports",
    image: "https://pngimg.com/uploads/basketball/basketball_PNG1094.png",
    x: -180,
    y: 480,
    size: 95,
    rotation: -20,
  },
  {
    id: 10,
    resourceId: 13,
    title: "Travel Backpack",
    category: "Utility",
    image: "https://pngimg.com/uploads/backpack/backpack_PNG6329.png",
    x: -440,
    y: 380,
    size: 120,
    rotation: 28,
  },
  {
    id: 11,
    resourceId: 7,
    title: "Game Controller",
    category: "Gaming",
    image: "https://pngimg.com/uploads/gamepad/gamepad_PNG59.png",
    x: -560,
    y: 150,
    size: 105,
    rotation: -30,
  },
  {
    id: 12,
    resourceId: 6,
    title: "Graphic Tablet",
    category: "Design",
    image: "https://pngimg.com/uploads/tablet/tablet_PNG8582.png",
    x: -540,
    y: -140,
    size: 110,
    rotation: 18,
  },
  {
    id: 13,
    resourceId: 14,
    title: "Mechanical Keyboard",
    category: "Tech",
    image: "https://pngimg.com/uploads/keyboard/keyboard_PNG5860.png",
    x: -260,
    y: -430,
    size: 120,
    rotation: -10,
  },
  {
    id: 14,
    resourceId: 12,
    title: "Drone Quadcopter",
    category: "Tech",
    image: "https://pngimg.com/uploads/drone/drone_PNG65.png",
    x: 460,
    y: -460,
    size: 115,
    rotation: 22,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const discRef = useRef(null);
  const rotationTweenRef = useRef(null);

  // Initialize Lenis smooth scroll & GSAP ultra-smooth rotation
  useEffect(() => {
    // Lenis Smooth Scroll Setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // GSAP high-precision 60/120fps disc rotation
    if (discRef.current) {
      rotationTweenRef.current = gsap.to(discRef.current, {
        rotation: 360,
        duration: 85,
        ease: "none",
        repeat: -1,
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (rotationTweenRef.current) {
        rotationTweenRef.current.kill();
      }
    };
  }, []);

  // Smooth slow-down when hovering items
  const handleItemMouseEnter = () => {
    if (rotationTweenRef.current) {
      gsap.to(rotationTweenRef.current, { timeScale: 0.15, duration: 0.8, ease: "power2.out" });
    }
  };

  const handleItemMouseLeave = () => {
    if (rotationTweenRef.current) {
      gsap.to(rotationTweenRef.current, { timeScale: 1, duration: 0.8, ease: "power2.inOut" });
    }
  };

  return (
    <div className="landing-container">
      {/* Minimal Top Navbar (Clean Black & White, No Dot) */}
      <motion.header
        className="landing-navbar"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="landing-brand" onClick={() => navigate("/")}>
          <span className="landing-brand-text">CAMPUS CIRCULAR</span>
        </div>
        <div className="landing-nav-actions">
          <Link to="/auth" className="nav-link-login">
            Log in
          </Link>
          <Link to="/auth" className="nav-btn-signup">
            Sign up
          </Link>
        </div>
      </motion.header>

      {/* Landing Stage */}
      <div className="landing-stage">
        {/* Central Hero Content (Static, Above the Rotating Disc) */}
        <motion.div
          className="landing-hero-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="hero-title">
            Share More. <br />
            <span className="hero-title-accent">Own Less.</span>
          </h1>

          <p className="hero-subtitle">
            Borrow cameras, lab gear, textbooks & instruments directly from students on your campus.
          </p>

          <div className="hero-cta-group">
            <motion.button
              className="landing-start-btn"
              onClick={() => navigate("/find")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span>AI Need Finder</span>
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              className="landing-auth-btn"
              onClick={() => navigate("/app")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Explore Listings
            </motion.button>
          </div>

          {/* Quick Stats Row in Clean Monochromatic Style */}
          <div className="hero-stats-row">
            <div className="stat-pill">
              <ShieldCheck size={15} />
              <span>Verified Identity</span>
            </div>
            <div className="stat-pill">
              <RefreshCw size={15} />
              <span>Zero Rental Fee</span>
            </div>
            <div className="stat-pill">
              <Users size={15} />
              <span>Student Ledgers</span>
            </div>
          </div>
        </motion.div>

        {/* Vitra-Style Rotating Disc Powered by GSAP */}
        <div className="orbit-disc-viewport">
          <div className="orbit-disc" ref={discRef}>
            {ROTATING_ITEMS.map((item) => (
              <div
                key={item.id}
                className="disc-item-anchor"
                style={{
                  transform: `translate(${item.x}px, ${item.y}px)`,
                }}
              >
                <div
                  className="disc-item-card"
                  style={{
                    width: `${item.size}px`,
                    height: `${item.size}px`,
                    transform: `rotate(${item.rotation}deg)`,
                  }}
                  onClick={() => navigate(`/product/${item.resourceId || item.id}`)}
                  onMouseEnter={handleItemMouseEnter}
                  onMouseLeave={handleItemMouseLeave}
                  title={`View ${item.title} Details`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="disc-item-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="disc-item-tooltip">
                    <span className="tooltip-title">{item.title}</span>
                    <span className="tooltip-cat">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer minimal info */}
      <footer className="landing-footer">
        <span className="footer-copyright">© 2026 Campus Circular</span>
        <div className="footer-links">
          <span>Trust Ledger</span>
          <span>•</span>
          <span>Campus Safety</span>
          <span>•</span>
          <span>Guidelines</span>
        </div>
      </footer>
    </div>
  );
}
