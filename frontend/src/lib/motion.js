import { gsap, ScrollTrigger, useGSAP } from "./gsap";

// Hook : exécute les animations dans le scope d'un ref, nettoyé automatiquement
export function useMotion(cb, { scope, dependencies = [] }) {
  useGSAP(
    () => {
      if (!scope.current) return;
      const mm = gsap.matchMedia(scope.current);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        cb(scope.current);
      });
      return () => mm.revert();
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}

// Apparition au scroll, par lots (cartes, articles, figures…)
export function batchReveal(
  root,
  selector,
  { x = 0, y = 28, stagger = 0.1, start = "top 88%" } = {},
) {
  const items = gsap.utils.toArray(selector, root);
  if (!items.length) return;
  gsap.set(items, { autoAlpha: 0, x, y });
  ScrollTrigger.batch(items, {
    start,
    once: true,
    onEnter: (els) =>
      gsap.to(els, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger,
        clearProps: "transform,opacity,visibility", // garde tes :hover CSS fonctionnels
      }),
  });
}

// Entrée en cascade des éléments d'un en-tête de page
export function introStagger(root, selector) {
  gsap.from(gsap.utils.toArray(selector, root), {
    autoAlpha: 0,
    y: 30,
    stagger: 0.12,
    duration: 0.8,
    ease: "power3.out",
  });
}
