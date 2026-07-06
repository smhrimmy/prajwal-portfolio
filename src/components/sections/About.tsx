import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { Terminal, Wrench, Layers } from "lucide-react";

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-32" ref={containerRef}>
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Left Column: Sticky Narrative */}
        <div className="relative">
          <div className="sticky top-32">
            <h2 className="text-4xl font-black tracking-tighter sm:text-6xl">
              <span className="text-gradient animate-gradient-pan">The Story.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
            <div className="mt-8 font-mono text-xs uppercase tracking-widest text-secondary">
              // Core Philosophy
            </div>
            <div className="mt-4 border-l-2 border-secondary/30 pl-4 text-sm text-foreground/80 italic">
              "AI builds the foundation. Human creativity defines the identity. I believe in tools that empower rather than replace."
            </div>
          </div>
        </div>

        {/* Right Column: Moving Elements (Bento style narrative blocks) */}
        <div className="flex flex-col gap-8">
          <motion.div style={{ y: y1 }} className="glass corner-brackets rounded-3xl p-8">
            <Terminal className="mb-4 h-8 w-8 text-secondary" />
            <h3 className="mb-3 text-xl font-bold">What I Build</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I develop robust, interactive frontend applications and telemetry-style dashboards. I focus on high-performance React architectures, smooth framer-motion animations, and clean, type-safe code.
            </p>
          </motion.div>

          <motion.div style={{ y: y2 }} className="glass corner-brackets rounded-3xl p-8">
            <Layers className="mb-4 h-8 w-8 text-success" />
            <h3 className="mb-3 text-xl font-bold">How I Solve Problems</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Working in web support and freelance taught me that infrastructure matters just as much as the UI. When a deployment fails, DNS propagates incorrectly, or a server throws 500s, I dive into the logs and fix the root cause.
            </p>
          </motion.div>

          <motion.div style={{ y: y1 }} className="glass corner-brackets rounded-3xl p-8">
            <Wrench className="mb-4 h-8 w-8 text-accent" />
            <h3 className="mb-3 text-xl font-bold">My Setup</h3>
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
              <span className="rounded-md bg-white/5 px-2 py-1">VS Code / Cursor</span>
              <span className="rounded-md bg-white/5 px-2 py-1">WSL2 / Linux</span>
              <span className="rounded-md bg-white/5 px-2 py-1">Zsh + OhMyZsh</span>
              <span className="rounded-md bg-white/5 px-2 py-1">React + Vite + TS</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
