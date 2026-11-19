import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "../lib/gsap";

// Remonte en haut à chaque changement de page, gère les ancres (/#circuits)
// et recalcule les positions des animations au scroll.
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let target = null;
    if (hash) {
      try {
        target = document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch {
        // Ignore malformed URL fragments instead of breaking navigation.
      }
      target?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

export default ScrollManager;
