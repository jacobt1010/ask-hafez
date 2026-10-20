"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type CascadeContextValue = {
  navigateWithCascade: (path: string) => void;
};

const CascadeContext = createContext<CascadeContextValue | null>(null);

const LAYER_COUNT = 6;
const STAGGER_MS = 120;
const LAYER_DURATION_MS = 900;
const TOTAL_MS = STAGGER_MS * (LAYER_COUNT - 1) + LAYER_DURATION_MS;
const NAVIGATE_AT_MS = 700;

export function CascadeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const navigateWithCascade = useCallback(
    (path: string) => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];

      setActive(true);
      timeouts.current.push(setTimeout(() => router.push(path), NAVIGATE_AT_MS));
      timeouts.current.push(setTimeout(() => setActive(false), TOTAL_MS + 50));
    },
    [router]
  );

  return (
    <CascadeContext.Provider value={{ navigateWithCascade }}>
      {children}
      {active && (
        <div className="cascade-overlay" aria-hidden="true">
          {Array.from({ length: LAYER_COUNT }).map((_, i) => (
            <div
              key={i}
              className="cascade-layer"
              style={{
                animationDelay: `${i * STAGGER_MS}ms`,
                animationDuration: `${LAYER_DURATION_MS}ms`,
              }}
            />
          ))}
        </div>
      )}
    </CascadeContext.Provider>
  );
}

export function useCascade() {
  const ctx = useContext(CascadeContext);
  if (!ctx) {
    throw new Error("useCascade must be used within a CascadeProvider");
  }
  return ctx;
}
