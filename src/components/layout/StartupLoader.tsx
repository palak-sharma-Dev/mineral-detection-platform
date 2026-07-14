"use client";

import { useEffect, useState } from "react";

export function StartupLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--background)] px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[0.625rem] bg-[color:var(--primary)] text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-card">
          G
        </div>
        <p className="mt-4 text-base font-semibold text-[color:var(--foreground)]">GARUD AI</p>
        <p className="mt-2 text-sm text-[color:var(--foreground-secondary)]">
          Initializing Mineral Intelligence Platform...
        </p>
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-[color:var(--foreground-muted)]/14">
          <div className="garud-startup-line h-full rounded-full bg-[color:var(--primary)]" />
        </div>
      </div>
    </div>
  );
}
