import React, { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

const STORAGE_KEY = "cc_a11y_prefs";

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            highContrast: false,
            fontSize: "normal", // 'normal' | 'large' | 'xlarge'
            dyslexicFont: false,
            focusRings: false,
            highlightLinks: false,
            reducedMotion: false,
            screenReaderHelper: false,
            colorFilter: "none", // 'none' | 'monochrome'
          };
    } catch {
      return {
        highContrast: false,
        fontSize: "normal",
        dyslexicFont: false,
        focusRings: false,
        highlightLinks: false,
        reducedMotion: false,
        screenReaderHelper: false,
        colorFilter: "none",
      };
    }
  });

  // Synchronize CSS classes on document root whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn("Unable to save accessibility preferences", e);
    }

    const root = document.documentElement;

    // High Contrast
    if (prefs.highContrast) root.classList.add("a11y-high-contrast");
    else root.classList.remove("a11y-high-contrast");

    // Font Size
    root.classList.remove("a11y-large-text", "a11y-xlarge-text");
    if (prefs.fontSize === "large") root.classList.add("a11y-large-text");
    if (prefs.fontSize === "xlarge") root.classList.add("a11y-xlarge-text");

    // Dyslexic Font
    if (prefs.dyslexicFont) root.classList.add("a11y-dyslexic");
    else root.classList.remove("a11y-dyslexic");

    // Enhanced Focus Rings
    if (prefs.focusRings) root.classList.add("a11y-focus-rings");
    else root.classList.remove("a11y-focus-rings");

    // Highlight Links & Interactive Elements
    if (prefs.highlightLinks) root.classList.add("a11y-highlight-links");
    else root.classList.remove("a11y-highlight-links");

    // Reduced Motion
    if (prefs.reducedMotion) root.classList.add("a11y-reduced-motion");
    else root.classList.remove("a11y-reduced-motion");

    // Color Filter (Monochrome)
    if (prefs.colorFilter === "monochrome") root.classList.add("a11y-monochrome");
    else root.classList.remove("a11y-monochrome");
  }, [prefs]);

  const toggleHighContrast = () =>
    setPrefs((p) => ({ ...p, highContrast: !p.highContrast }));

  const setFontSize = (size) =>
    setPrefs((p) => ({ ...p, fontSize: size }));

  const toggleDyslexicFont = () =>
    setPrefs((p) => ({ ...p, dyslexicFont: !p.dyslexicFont }));

  const toggleFocusRings = () =>
    setPrefs((p) => ({ ...p, focusRings: !p.focusRings }));

  const toggleHighlightLinks = () =>
    setPrefs((p) => ({ ...p, highlightLinks: !p.highlightLinks }));

  const toggleReducedMotion = () =>
    setPrefs((p) => ({ ...p, reducedMotion: !p.reducedMotion }));

  const toggleScreenReaderHelper = () =>
    setPrefs((p) => ({ ...p, screenReaderHelper: !p.screenReaderHelper }));

  const toggleMonochrome = () =>
    setPrefs((p) => ({
      ...p,
      colorFilter: p.colorFilter === "monochrome" ? "none" : "monochrome",
    }));

  const resetAccessibility = () =>
    setPrefs({
      highContrast: false,
      fontSize: "normal",
      dyslexicFont: false,
      focusRings: false,
      highlightLinks: false,
      reducedMotion: false,
      screenReaderHelper: false,
      colorFilter: "none",
    });

  // Web Speech API Voice Narration
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...prefs,
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
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
