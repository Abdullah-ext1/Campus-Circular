import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Type,
  Sparkles,
  Volume2,
  Minimize2,
  X,
  RotateCcw,
  Zap,
  Sliders,
  Keyboard,
  HelpCircle,
} from "lucide-react";
import { useAccessibility } from "../contexts/AccessibilityContext.jsx";
import "./AccessibilityWidget.css";

export default function AccessibilityWidget({ forceFloating = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  const {
    highContrast,
    fontSize,
    dyslexicFont,
    focusRings,
    highlightLinks,
    reducedMotion,
    screenReaderHelper,
    colorFilter,
    toggleHighContrast,
    setFontSize,
    toggleDyslexicFont,
    toggleFocusRings,
    toggleHighlightLinks,
    toggleReducedMotion,
    toggleScreenReaderHelper,
    toggleMonochrome,
    resetAccessibility,
    speakText,
  } = useAccessibility();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
      // Alt + A shortcut to toggle accessibility
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && triggerRef.current && !triggerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleTestNarration = () => {
    speakText("Campus Circular Accessibility mode is active. Screen reader assistance and high contrast options are enabled.");
  };

  return (
    <div className={`a11y-widget-root ${forceFloating ? "a11y-floating" : ""}`}>
      {/* Bottom Left Floating Trigger Button */}
      <button
        ref={triggerRef}
        className={`a11y-trigger-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility Options (Alt+A)"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="Accessibility & Contrast Settings (Alt+A)"
      >
        <div className="a11y-trigger-icon-wrap">
          <Eye size={20} className="a11y-main-icon" />
        </div>
        <span className="a11y-trigger-label">Accessibility</span>
      </button>

      {/* Slide-up Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            className="a11y-modal-backdrop"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-heading"
          >
            <div className="a11y-modal-card">
              {/* Header */}
              <div className="a11y-modal-header">
                <div className="a11y-header-title-wrap">
                  <div className="a11y-badge-icon">
                    <Eye size={18} />
                  </div>
                  <div>
                    <h2 id="a11y-heading" className="a11y-title">
                      Accessibility Assistant
                    </h2>
                    <p className="a11y-subtitle">WCAG 2.1 AA Compliant Display & Controls</p>
                  </div>
                </div>

                <div className="a11y-header-actions">
                  <button
                    type="button"
                    className="a11y-icon-btn"
                    onClick={() => setShowKeyboardGuide(!showKeyboardGuide)}
                    title="Keyboard Shortcuts"
                    aria-label="Toggle Keyboard Shortcuts Cheat Sheet"
                  >
                    <Keyboard size={16} />
                  </button>
                  <button
                    type="button"
                    className="a11y-icon-btn"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Accessibility Menu"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Keyboard Guide Dropdown */}
              {showKeyboardGuide && (
                <div className="a11y-keyboard-guide animate-slide-up">
                  <div className="a11y-kb-title">
                    <Keyboard size={14} /> <span>Quick Keyboard Navigation</span>
                  </div>
                  <div className="a11y-kb-grid">
                    <div><kbd>Tab</kbd> Move focus forward</div>
                    <div><kbd>Shift</kbd>+<kbd>Tab</kbd> Move focus backward</div>
                    <div><kbd>Enter</kbd> / <kbd>Space</kbd> Activate buttons & items</div>
                    <div><kbd>Alt</kbd>+<kbd>A</kbd> Toggle accessibility menu</div>
                    <div><kbd>Esc</kbd> Close active dialogs</div>
                  </div>
                </div>
              )}

              {/* Toggles Grid */}
              <div className="a11y-controls-list">
                {/* 1. High Contrast Mode */}
                <div className="a11y-toggle-row">
                  <div className="a11y-toggle-info">
                    <span className="a11y-toggle-title">High Contrast & Sharp Borders</span>
                    <span className="a11y-toggle-desc">Boosts dark/light contrast and element outlines</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={highContrast}
                    className={`a11y-switch ${highContrast ? "on" : ""}`}
                    onClick={toggleHighContrast}
                    aria-label="Toggle High Contrast Mode"
                  >
                    <span className="a11y-switch-handle" />
                  </button>
                </div>

                {/* 2. Text Scaling */}
                <div className="a11y-toggle-row">
                  <div className="a11y-toggle-info">
                    <span className="a11y-toggle-title">Text Size Zoom</span>
                    <span className="a11y-toggle-desc">Scale all labels and paragraphs</span>
                  </div>
                  <div className="a11y-size-btn-group" role="group" aria-label="Text Size Selection">
                    <button
                      type="button"
                      className={`a11y-size-btn ${fontSize === "normal" ? "active" : ""}`}
                      onClick={() => setFontSize("normal")}
                      aria-pressed={fontSize === "normal"}
                    >
                      100%
                    </button>
                    <button
                      type="button"
                      className={`a11y-size-btn ${fontSize === "large" ? "active" : ""}`}
                      onClick={() => setFontSize("large")}
                      aria-pressed={fontSize === "large"}
                    >
                      115%
                    </button>
                    <button
                      type="button"
                      className={`a11y-size-btn ${fontSize === "xlarge" ? "active" : ""}`}
                      onClick={() => setFontSize("xlarge")}
                      aria-pressed={fontSize === "xlarge"}
                    >
                      130%
                    </button>
                  </div>
                </div>

                {/* 3. Dyslexia-Friendly Typography */}
                <div className="a11y-toggle-row">
                  <div className="a11y-toggle-info">
                    <span className="a11y-toggle-title">Dyslexia-Friendly Font</span>
                    <span className="a11y-toggle-desc">Enhances letter tracking, line height & weight</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={dyslexicFont}
                    className={`a11y-switch ${dyslexicFont ? "on" : ""}`}
                    onClick={toggleDyslexicFont}
                    aria-label="Toggle Dyslexia-Friendly Font"
                  >
                    <span className="a11y-switch-handle" />
                  </button>
                </div>

                {/* 4. Bold Focus Ring Indicators */}
                <div className="a11y-toggle-row">
                  <div className="a11y-toggle-info">
                    <span className="a11y-toggle-title">High-Visibility Focus Indicators</span>
                    <span className="a11y-toggle-desc">Bold 3px outlines for keyboard Tab navigation</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={focusRings}
                    className={`a11y-switch ${focusRings ? "on" : ""}`}
                    onClick={toggleFocusRings}
                    aria-label="Toggle High-Visibility Focus Rings"
                  >
                    <span className="a11y-switch-handle" />
                  </button>
                </div>

                {/* 5. Highlight All Links & Cards */}
                <div className="a11y-toggle-row">
                  <div className="a11y-toggle-info">
                    <span className="a11y-toggle-title">Highlight Links & Clickables</span>
                    <span className="a11y-toggle-desc">Underlines interactive buttons and link elements</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={highlightLinks}
                    className={`a11y-switch ${highlightLinks ? "on" : ""}`}
                    onClick={toggleHighlightLinks}
                    aria-label="Toggle Link Highlights"
                  >
                    <span className="a11y-switch-handle" />
                  </button>
                </div>

                {/* 6. Reduced Motion / Pause Orbits */}
                <div className="a11y-toggle-row">
                  <div className="a11y-toggle-info">
                    <span className="a11y-toggle-title">Pause Animations & Orbit</span>
                    <span className="a11y-toggle-desc">Stops background motion and floating rotations</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={reducedMotion}
                    className={`a11y-switch ${reducedMotion ? "on" : ""}`}
                    onClick={toggleReducedMotion}
                    aria-label="Toggle Reduced Motion"
                  >
                    <span className="a11y-switch-handle" />
                  </button>
                </div>

                {/* 7. Colorblind / Monochrome */}
                <div className="a11y-toggle-row">
                  <div className="a11y-toggle-info">
                    <span className="a11y-toggle-title">Monochrome (Color-Neutral)</span>
                    <span className="a11y-toggle-desc">High contrast grayscale filter</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={colorFilter === "monochrome"}
                    className={`a11y-switch ${colorFilter === "monochrome" ? "on" : ""}`}
                    onClick={toggleMonochrome}
                    aria-label="Toggle Monochrome Grayscale Mode"
                  >
                    <span className="a11y-switch-handle" />
                  </button>
                </div>

                {/* 8. Text to Speech Reader */}
                <div className="a11y-toggle-row">
                  <div className="a11y-toggle-info">
                    <span className="a11y-toggle-title">Voice Narration Helper</span>
                    <span className="a11y-toggle-desc">Audio speech synthesis assistant</span>
                  </div>
                  <button
                    type="button"
                    className="a11y-test-speak-btn"
                    onClick={handleTestNarration}
                    aria-label="Speak Narration Sample"
                  >
                    <Volume2 size={14} />
                    <span>Test Voice</span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="a11y-modal-footer">
                <button
                  type="button"
                  className="a11y-reset-btn"
                  onClick={resetAccessibility}
                  aria-label="Reset all accessibility settings to default"
                >
                  <RotateCcw size={13} />
                  <span>Reset Defaults</span>
                </button>
                <button
                  type="button"
                  className="a11y-done-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
