import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Lenis from "lenis";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import "./LandingPage.css";

// 28 Moon Items orbiting the Central Earth Text
const ORBIT_MOON_ITEMS = [
  // Ring 1 - Inner Orbit Moons (~420-500px radius)
  { id: 1, resourceId: 1, title: "DSLR Camera", category: "Media", image: "https://pngimg.com/uploads/photo_camera/photo_camera_PNG101641.png", x: -420, y: -340, size: 110, rotation: -22 },
  { id: 2, resourceId: 8, title: "Acoustic Guitar", category: "Music", image: "https://pngimg.com/uploads/guitar/guitar_PNG3338.png", x: -80, y: -480, size: 130, rotation: 25 },
  { id: 3, resourceId: 4, title: "Studio Headphones", category: "Audio", image: "https://pngimg.com/uploads/headphones/headphones_PNG101985.png", x: 280, y: -430, size: 105, rotation: -18 },
  { id: 4, resourceId: 6, title: "Academic Textbooks", category: "Books", image: "https://pngimg.com/uploads/book/book_PNG2111.png", x: 500, y: -300, size: 115, rotation: 16 },
  { id: 5, resourceId: 3, title: "Camera Tripod", category: "Media", image: "https://pngimg.com/uploads/tripod/tripod_PNG147.png", x: 550, y: -60, size: 125, rotation: -32 },
  { id: 6, resourceId: 11, title: "Cruiser Skateboard", category: "Sports", image: "https://pngimg.com/uploads/skateboard/skateboard_PNG11707.png", x: 490, y: 210, size: 120, rotation: 36 },
  { id: 7, resourceId: 5, title: "Laboratory Microscope", category: "Science", image: "https://pngimg.com/uploads/microscope/microscope_PNG101130.png", x: 420, y: 410, size: 110, rotation: -14 },
  { id: 8, resourceId: 10, title: "Campus Bicycle", category: "Mobility", image: "https://pngimg.com/uploads/bicycle/bicycle_PNG5380.png", x: 110, y: 490, size: 140, rotation: 10 },
  { id: 9, resourceId: 9, title: "Basketball", category: "Sports", image: "https://pngimg.com/uploads/basketball/basketball_PNG1094.png", x: -170, y: 470, size: 95, rotation: -22 },
  { id: 10, resourceId: 13, title: "Travel Backpack", category: "Utility", image: "https://pngimg.com/uploads/backpack/backpack_PNG6329.png", x: -430, y: 370, size: 115, rotation: 28 },
  { id: 11, resourceId: 7, title: "Game Controller", category: "Gaming", image: "https://pngimg.com/uploads/gamepad/gamepad_PNG59.png", x: -540, y: 140, size: 105, rotation: -28 },
  { id: 12, resourceId: 6, title: "Graphic Tablet", category: "Design", image: "https://pngimg.com/uploads/tablet/tablet_PNG8582.png", x: -520, y: -130, size: 110, rotation: 18 },

  // Ring 2 - Outer Orbit Moons (~720-880px radius)
  { id: 13, resourceId: 16, title: "PlayStation 5 Console", category: "Gaming", image: "https://pngimg.com/uploads/gamepad/gamepad_PNG59.png", x: -740, y: -480, size: 135, rotation: -15 },
  { id: 14, resourceId: 17, title: "Ninebot E-Scooter", category: "Mobility", image: "https://pngimg.com/uploads/bicycle/bicycle_PNG5380.png", x: -120, y: -760, size: 155, rotation: 20 },
  { id: 15, resourceId: 18, title: "GoPro HERO12", category: "Camera", image: "https://pngimg.com/uploads/photo_camera/photo_camera_PNG101641.png", x: 460, y: -710, size: 120, rotation: -25 },
  { id: 16, resourceId: 19, title: "Meta Quest 3 VR", category: "Gaming", image: "https://pngimg.com/uploads/gamepad/gamepad_PNG59.png", x: 760, y: -410, size: 130, rotation: 18 },
  { id: 17, resourceId: 20, title: "4-Person Camping Tent", category: "Utility", image: "https://pngimg.com/uploads/backpack/backpack_PNG6329.png", x: 820, y: -70, size: 140, rotation: -30 },
  { id: 18, resourceId: 21, title: "Korg Minilogue Synth", category: "Music", image: "https://pngimg.com/uploads/keyboard/keyboard_PNG5860.png", x: 800, y: 340, size: 135, rotation: 22 },
  { id: 19, resourceId: 22, title: "Wacom Cintiq 16", category: "Design", image: "https://pngimg.com/uploads/tablet/tablet_PNG8582.png", x: 600, y: 660, size: 130, rotation: -14 },
  { id: 20, resourceId: 23, title: "Apple Watch Series 9", category: "Utility", image: "https://pngimg.com/uploads/backpack/backpack_PNG6329.png", x: 160, y: 780, size: 125, rotation: 16 },
  { id: 21, resourceId: 24, title: "Focusrite Scarlett Interface", category: "Audio", image: "https://pngimg.com/uploads/headphones/headphones_PNG101985.png", x: -300, y: 740, size: 120, rotation: -28 },
  { id: 22, resourceId: 25, title: "Sigma 85mm f/1.4 Art Lens", category: "Camera", image: "https://pngimg.com/uploads/photo_camera/photo_camera_PNG101641.png", x: -660, y: 540, size: 125, rotation: 24 },
  { id: 23, resourceId: 26, title: "Sony XM5 Headphones", category: "Audio", image: "https://pngimg.com/uploads/headphones/headphones_PNG101985.png", x: -820, y: 200, size: 130, rotation: -18 },
  { id: 24, resourceId: 27, title: "100-Inch Tripod Screen", category: "Projector", image: "https://pngimg.com/uploads/tripod/tripod_PNG147.png", x: -840, y: -190, size: 145, rotation: 32 },
  { id: 25, resourceId: 28, title: "DJI Ronin Gimbal", category: "Media", image: "https://pngimg.com/uploads/tripod/tripod_PNG147.png", x: -620, y: -460, size: 130, rotation: -22 },
  { id: 26, resourceId: 15, title: "Aputure 100x Studio Light", category: "Lighting", image: "https://pngimg.com/uploads/microscope/microscope_PNG101130.png", x: 660, y: -560, size: 125, rotation: 12 },
  { id: 27, resourceId: 14, title: "Mechanical Keyboard", category: "Tech", image: "https://pngimg.com/uploads/keyboard/keyboard_PNG5860.png", x: -250, y: -420, size: 120, rotation: -10 },
  { id: 28, resourceId: 12, title: "Drone Quadcopter", category: "Tech", image: "https://pngimg.com/uploads/drone/drone_PNG65.png", x: 440, y: -450, size: 115, rotation: 22 },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const landingT = t.landing;

  const moonOrbitRef = useRef(null);
  const orbitTweenRef = useRef(null);

  // Initialize Lenis smooth scroll & Moon-to-Earth GSAP continuous orbit
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // Continuous 90s smooth Moon Orbit around Central Earth Text
    if (moonOrbitRef.current) {
      orbitTweenRef.current = gsap.to(moonOrbitRef.current, {
        rotation: 360,
        duration: 90,
        ease: "none",
        repeat: -1,
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (orbitTweenRef.current) orbitTweenRef.current.kill();
    };
  }, []);

  // On Hover: slow orbit & counter-rotate card to -discRotation
  const handleItemMouseEnter = (item, e) => {
    if (orbitTweenRef.current) {
      gsap.to(orbitTweenRef.current, { timeScale: 0.08, duration: 0.8, ease: "power2.out" });
    }

    const currentDiscRot = gsap.getProperty(moonOrbitRef.current, "rotation") || 0;
    gsap.to(e.currentTarget, {
      rotation: -currentDiscRot,
      scale: 1.45,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleItemMouseLeave = (item, e) => {
    if (orbitTweenRef.current) {
      gsap.to(orbitTweenRef.current, { timeScale: 1, duration: 0.8, ease: "power2.inOut" });
    }

    gsap.to(e.currentTarget, {
      rotation: item.rotation,
      scale: 1.0,
      duration: 0.35,
      ease: "power2.inOut",
    });
  };

  return (
    <div className="vitra-landing-container">
      {/* Top Navbar */}
      <header className="vitra-navbar">
        <div className="vitra-logo-center" onClick={() => navigate("/")}>
          {landingT.brand}
        </div>
        <div className="vitra-nav-right">
          <button className="vitra-nav-btn" onClick={() => navigate("/auth")}>
            {landingT.getStarted}
          </button>
        </div>
      </header>

      {/* Main Stage */}
      <main className="vitra-stage">
        {/* Central "Earth" Hero Box */}
        <div className="vitra-hero-center">
          <h1 className="vitra-hero-title">
            {landingT.heroTitle} <br />
            <span className="vitra-hero-title-sub">{landingT.heroTitleLine2}</span>
          </h1>

          <p className="vitra-hero-desc">{landingT.heroSubtitle}</p>

          <div className="vitra-hero-actions">
            <button className="vitra-start-btn" onClick={() => navigate("/find")}>
              {landingT.startBtn}
            </button>
            <button className="vitra-secondary-btn" onClick={() => navigate("/explore")}>
              {landingT.exploreBtn}
            </button>
          </div>
        </div>

        {/* Moon Orbit System (Rotating around Earth text) */}
        <div className="orbit-moon-viewport">
          <div className="orbit-moon-disc" ref={moonOrbitRef}>
            {ORBIT_MOON_ITEMS.map((item) => (
              <div
                key={item.id}
                className="moon-item-anchor"
                style={{
                  transform: `translate(${item.x}px, ${item.y}px)`,
                }}
              >
                <div
                  className="moon-item-card"
                  style={{
                    width: `${item.size}px`,
                    height: `${item.size}px`,
                    transform: `rotate(${item.rotation}deg)`,
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter(item, e)}
                  onMouseLeave={(e) => handleItemMouseLeave(item, e)}
                  onClick={() => navigate(`/product/${item.resourceId || item.id}`)}
                  title={`View ${item.title} Details`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="moon-item-cutout"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />

                  {/* Upright Level Details Tooltip */}
                  <div className="moon-item-tooltip">
                    <span className="moon-tooltip-title">{item.title}</span>
                    <span className="moon-tooltip-cat">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Multilingual Footer (EN, Hindi = HI, Marathi = MR) */}
      <footer className="vitra-footer">
        <div className="vitra-meta-languages">
          <span
            className={`lang ${lang === "EN" ? "active" : ""}`}
            onClick={() => setLang("EN")}
          >
            EN
          </span>
          <span
            className={`lang ${lang === "HI" ? "active" : ""}`}
            onClick={() => setLang("HI")}
          >
            हिंदी
          </span>
          <span
            className={`lang ${lang === "MR" ? "active" : ""}`}
            onClick={() => setLang("MR")}
          >
            मराठी
          </span>
        </div>
        <div className="vitra-meta-copy">{landingT.footerCopy}</div>
      </footer>
    </div>
  );
}
