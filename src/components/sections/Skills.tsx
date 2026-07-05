import { useState } from "react";
import { motion } from "framer-motion";
import { useCmsStore } from "@/store/useCmsStore";
import { SectionHeading } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Skills() {
  const storeSkills = useCmsStore((s) => s.skills);
  const categories = ["All", ...storeSkills.map(s => s.category).filter(Boolean)];
  const [cat, setCat] = useState("All");
  
  const filtered = cat === "All" ? storeSkills : storeSkills.filter((s) => s.category === cat);

  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading kicker="// proficiency" title="Skill Shards" subtitle="Compiled expertise across the stack." />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
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

      <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {filtered.map((s, i) => (
          <motion.div
            layout
            key={s.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="glass corner-brackets group relative flex flex-col gap-4 rounded-2xl p-6"
          >
            <div className="font-bold text-lg">{s.category}</div>
            <div className="flex flex-wrap gap-2">
              {(s.items || []).map((item: string) => (
                <span key={item} className="px-3 py-1 bg-muted/50 border border-border rounded-md text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
