"use client";

import { useEffect, useState } from "react";

import { SpeciverseMark } from "@/components/brand/speciverse-mark";

export function SplashScreen() {
  const [phase, setPhase] = useState<"play" | "leave" | "done">("play");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduce ? 500 : 2500;
    const fade = reduce ? 200 : 700;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const leaveTimer = window.setTimeout(() => setPhase("leave"), hold);
    const doneTimer = window.setTimeout(() => {
      document.body.style.overflow = previous;
      setPhase("done");
    }, hold + fade);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`splash${phase === "leave" ? " splash-leave" : ""}`} aria-hidden={phase === "leave"}>
      <div className="splash-lockup">
        <SpeciverseMark className="splash-mark" animated />
        <p className="splash-word">
          Speci<em>Verse</em>
        </p>
        <p className="splash-tag">A living field guide</p>
      </div>
    </div>
  );
}
