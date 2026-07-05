import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CodeRain } from "./CodeRain";
import { OpeningAnimation } from "./OpeningAnimation";
import { useAppStore } from "@/store/useAppStore";

const BOOT_LINES = [
  "$ initializing developer environment...",
  "$ mounting neural modules ......... ok",
  "$ loading design system .......... ok",
  "$ calibrating motion engine ...... ok",
  "$ awaiting operator input ........ READY",
];

export function Loader() {
  const setLoaded = useAppStore((s) => s.setLoaded);
  const setProgress = useAppStore((s) => s.setProgress);
  const [phase, setPhase] = useState<"boot" | "game" | "ready">("boot");
  const [lines, setLines] = useState<string[]>([]);
  const [pct, setPct] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // boot typing
  useEffect(() => {
    if (phase !== "boot") return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setLines(BOOT_LINES.slice(0, i));
      setPct(Math.min(35, i * 7));
      if (i >= BOOT_LINES.length) {
        clearInterval(id);
        setTimeout(() => setPhase("game"), 200);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  // auto-progress during 3D animation phase
  useEffect(() => {
    if (phase !== "game") return;
    let p = 35;
    const id = setInterval(() => {
      p += 2;
      if (p > 99) p = 99;
      setPct(p);
      setProgress(p);
    }, 25);
    return () => clearInterval(id);
  }, [phase]);

  const handleCollect = useCallback(
    (count: number) => {
      const p = 35 + count * 6.5;
      setPct(p);
      setProgress(p);
    },
    [setProgress],
  );

  const finish = useCallback(() => {
    setPct(100);
    setProgress(100);
    setPhase("ready");
    setTimeout(() => setLoaded(true), 600);
  }, [setLoaded, setProgress]);

  const skip = () => finish();

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        exit={{ opacity: 0, filter: "blur(12px)" }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-background"
      >
        <CodeRain className="absolute inset-0 h-full w-full opacity-25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,var(--background))]" />

        <div className="relative z-10 w-full max-w-2xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-secondary">
              System Boot
            </div>
            <h1 className="mt-2 text-2xl font-bold text-gradient sm:text-3xl">
              Initializing Developer Environment
            </h1>
          </motion.div>

          {/* terminal */}
          <div className="glass corner-brackets relative rounded-xl p-4 font-mono text-sm text-secondary-foreground/80">
            <div className="mb-2 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning" />
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
            </div>
            {lines.map((l, i) => (
              <div key={i} className="text-secondary/90">
                {l}
              </div>
            ))}
            {phase === "boot" && <span className="animate-pulse text-secondary">▋</span>}
          </div>

          {/* 3D animation */}
          <AnimatePresence mode="wait">
            {phase === "game" && !reduced && (
              <motion.div
                key="game"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4"
              >
                <div className="glass h-56 rounded-xl">
                  <OpeningAnimation onComplete={finish} />
                </div>
                <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground">
                  Constructing digital space — or{" "}
                  <button onClick={skip} className="text-secondary underline underline-offset-2">
                    skip intro
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* progress */}
          <div className="mt-5">
            <div className="mb-1 flex justify-between font-mono text-xs text-muted-foreground">
              <span>{phase === "ready" ? "SYSTEM READY" : "LOADING"}</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-secondary via-primary to-accent"
                animate={{ width: `${pct}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>

          <AnimatePresence>
            {phase === "ready" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 text-center"
                style={{ animation: "glitch-skew 0.3s infinite" }}
              >
                <div className="text-3xl font-black tracking-tight text-gradient sm:text-5xl">
                  SYSTEM READY
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
