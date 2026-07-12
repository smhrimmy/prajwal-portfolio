import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCmsStore } from "@/store/useCmsStore";
import { SectionHeading } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Skills() {
  const storeSkills = useCmsStore((s) => s.skills);
  const categories = ["All", ...Array.from(new Set(storeSkills.map(s => s.category).filter(Boolean)))];
  const [cat, setCat] = useState("All");
  
  const filtered = cat === "All" ? storeSkills : storeSkills.filter((s) => s.category === cat);

  return (
    <section data-portfolio-component="skills" id="skills" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading kicker="// proficiency" title="Tech Stack" subtitle="Core technologies, frameworks, and tools I use to build and operate." />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            data-cursor="hover"
            className={cn(
              "rounded-full px-5 py-2 font-mono text-xs transition-colors",
              cat === c
                ? "bg-secondary/20 text-secondary ring-1 ring-secondary/50 font-bold"
                : "glass text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <motion.div
              layout
              key={s.category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="glass corner-brackets group relative flex flex-col gap-5 rounded-2xl p-6 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <div className="font-mono text-sm tracking-widest uppercase text-foreground">{s.category}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(s.items || []).map((item: string) => (
                  <span key={item} className="px-2.5 py-1.5 bg-muted/30 border border-border/50 rounded text-xs font-medium text-muted-foreground transition-colors hover:text-secondary hover:border-secondary/30">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
