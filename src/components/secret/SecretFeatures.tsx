import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

const LABELS: Record<string, string> = {
  "command-palette": "Command Palette Opened",
  terminal: "Terminal Hacker",
  "theme-switcher": "Theme Bender",
  "ai-chat": "First Contact (AI)",
  konami: "Konami Master 🎮",
  "konami-active": "Konami Master 🎮",
};

export function SecretFeatures() {
  const achievements = useAppStore((s) => s.achievements);
  const unlock = useAppStore((s) => s.unlock);
  const setKonami = useAppStore((s) => s.setKonami);
  const konami = useAppStore((s) => s.konami);
  const setCommandOpen = useAppStore((s) => s.setCommandOpen);
  const setTerminalOpen = useAppStore((s) => s.setTerminalOpen);
  const seen = useRef<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const idx = useRef(0);

  // konami + shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e || !e.key) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[idx.current]) {
        idx.current++;
        if (idx.current === KONAMI.length) {
          idx.current = 0;
          setKonami(true);
          unlock("konami");
          setTimeout(() => setKonami(false), 6000);
        }
      } else {
        idx.current = key === KONAMI[0] ? 1 : 0;
      }
      // shortcuts
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (key === "t") setTerminalOpen(true);
      if (key === "/") { e.preventDefault(); setCommandOpen(true); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setKonami, unlock, setCommandOpen, setTerminalOpen]);

  // achievement toasts
  useEffect(() => {
    const latest = achievements[achievements.length - 1];
    if (latest && !seen.current.has(latest)) {
      seen.current.add(latest);
      setToast(LABELS[latest] ?? latest);
      const id = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(id);
    }
  }, [achievements]);

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 40, x: "-50%" }}
            className="glass-strong fixed bottom-6 left-1/2 z-[60] flex items-center gap-3 rounded-full px-5 py-3 shadow-2xl"
          >
            <Trophy className="h-5 w-5 text-warning" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-warning">Achievement Unlocked</div>
              <div className="text-sm font-semibold">{toast}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {konami && (
        <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl"
              initial={{ y: -50, x: `${(i * 2.5) % 100}vw`, rotate: 0 }}
              animate={{ y: "110vh", rotate: 360 }}
              transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: (i % 10) * 0.2 }}
            >
              {["🎮", "⚡", "🚀", "💾", "🕹️"][i % 5]}
            </motion.span>
          ))}
        </div>
      )}
    </>
  );
}
