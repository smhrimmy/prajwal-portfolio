import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Code2, Terminal, Cpu, Cloud, GitBranch } from "lucide-react";
import { profile } from "@/data/profile";
import { useMagnetic } from "@/lib/motion";

function useTyping(words: readonly string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const current = words[i % words.length];
    const speed = del ? 45 : 90;
    const t = setTimeout(() => {
      if (!del) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDel(true), 1400);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setDel(false);
          setI((v) => v + 1);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return text;
}

const floatIcons = [
  { Icon: Code2, x: "8%", y: "22%", d: 0 },
  { Icon: Terminal, x: "86%", y: "18%", d: 1 },
  { Icon: Cpu, x: "14%", y: "72%", d: 2 },
  { Icon: Cloud, x: "82%", y: "68%", d: 1.5 },
  { Icon: GitBranch, x: "50%", y: "12%", d: 0.5 },
];

export function Hero() {
  const typed = useTyping(profile.rotatingTitles);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.4);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      setTilt({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-6 pt-24">
      {floatIcons.map(({ Icon, x, y, d }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute hidden text-secondary/30 md:block"
          style={{ left: x, top: y }}
          animate={{ y: [0, -18, 0], x: tilt.x * (i % 2 ? -1 : 1) * 0.4 }}
          transition={{ y: { duration: 5 + d, repeat: Infinity, ease: "easeInOut" } }}
        >
          <Icon className="h-8 w-8" />
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 text-center"
        style={{ transform: `perspective(1000px) rotateY(${tilt.x * 0.15}deg) rotateX(${-tilt.y * 0.15}deg)` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 font-mono text-xs text-success"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          {profile.available ? "Available for Work" : "Currently Busy"}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-sm text-secondary"
        >
          {profile.handle} · {profile.location}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-3 text-5xl font-black leading-none tracking-tighter sm:text-7xl md:text-8xl"
        >
          <span className="text-gradient animate-gradient-pan">{profile.name}</span>
        </motion.h1>

        <div className="mt-5 flex h-8 items-center justify-center font-mono text-lg text-muted-foreground sm:text-2xl">
          <span className="text-secondary">&gt;</span>
          <span className="ml-2 text-foreground">{typed}</span>
          <span className="ml-0.5 animate-pulse text-secondary">▋</span>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground sm:text-base">
          {profile.bio}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            ref={ctaRef}
            href="#projects"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground neon-glow transition-transform hover:scale-105"
          >
            View My Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={profile.resumeUrl}
            data-cursor="hover"
            className="inline-flex items-center gap-2 rounded-full border border-border glass px-6 py-3 text-sm font-semibold transition-colors hover:border-secondary/50"
          >
            <Download className="h-4 w-4" />
            Resume
          </a>
        </div>
      </motion.div>
    </section>
  );
}
