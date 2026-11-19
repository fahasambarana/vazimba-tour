import { useEffect, useState } from "react";

function BackgroundCarousel({ images, className = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (
      images.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [images.length]);

  if (!images.length) return null;
  const visibleIndex = activeIndex % images.length;

  return (
    <div className={`hero-image-carousel ${className}`} aria-hidden="true">
      {images.map((image, index) => (
        <img
          key={`${image}-${index}`}
          className={index === visibleIndex ? "is-active" : ""}
          src={image}
          alt=""
          decoding="async"
        />
      ))}
    </div>
  );
}

export default BackgroundCarousel;
