import { useState } from "react";
import { motion } from "framer-motion";
import { skills, skillCategories, type SkillCategory } from "@/data/skills";
import { SectionHeading } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

function Ring({ level }: { level: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg width="64" height="64" className="-rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--muted)" strokeWidth="5" />
      <motion.circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: c - (c * level) / 100 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Skills() {
  const [cat, setCat] = useState<SkillCategory | "All">("All");
  const filtered = cat === "All" ? skills : skills.filter((s) => s.category === cat);

  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading kicker="// proficiency" title="Skill Shards" subtitle="Compiled expertise across the stack." />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {(["All", ...skillCategories] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            data-cursor="hover"
            className={cn(
              "rounded-full px-4 py-1.5 font-mono text-xs transition-colors",
              cat === c
                ? "bg-secondary/20 text-secondary ring-1 ring-secondary/50"
                : "glass text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s, i) => (
          <motion.div
            layout
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="glass corner-brackets group relative flex items-center gap-4 rounded-2xl p-5"
          >
            <div className="relative shrink-0">
              <Ring level={s.level} />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {s.level}%
              </span>
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold">{s.name}</div>
              <div className="mt-0.5 font-mono text-[11px] text-secondary">RANK · {s.rank}</div>
              <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                XP {s.xp.toLocaleString()}
              </div>
            </div>
            <span className="absolute right-4 top-4 font-mono text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {s.category}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
