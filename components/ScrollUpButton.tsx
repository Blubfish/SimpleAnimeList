"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollUpButton() {
  const [visibleButton, setVisibleButton] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisibleButton(window.scrollY > 2000);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!visibleButton) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed right-4 bottom-4 z-50 inline-flex size-11 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-black/30 ring-1 ring-orange-300/30 transition hover:-translate-y-0.5 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300/50 sm:right-6 sm:bottom-6"
    >
      <ArrowUp size={20} color="black" />
    </button>
  );
}
