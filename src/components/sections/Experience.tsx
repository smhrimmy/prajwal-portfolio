import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ChevronDown } from "lucide-react";
import { experiences } from "@/data/experience";
import { SectionHeading } from "@/components/ui/reveal";

export function Experience() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="experience" className="relative mx-auto max-w-4xl px-6 py-28">
      <SectionHeading kicker="// work_history" title="Experience" subtitle="Roles, missions and impact over time." />

      <div className="relative">
        <div className="absolute left-5 top-2 h-full w-px bg-gradient-to-b from-secondary via-primary to-transparent" />
        {experiences.map((e, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={e.company}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05 }}
              className="relative mb-4 pl-14"
            >
              <span className="absolute left-2.5 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-background ring-2 ring-secondary/50">
                <span className={`h-2 w-2 rounded-full ${e.current ? "bg-success animate-pulse" : "bg-secondary"}`} />
              </span>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                data-cursor="hover"
                className="glass corner-brackets w-full rounded-2xl p-5 text-left transition-colors hover:border-secondary/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-secondary">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-semibold">{e.role}</div>
                      <div className="text-sm text-muted-foreground">{e.company}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden font-mono text-xs text-secondary sm:block">{e.period}</span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 space-y-2 overflow-hidden text-sm text-muted-foreground"
                    >
                      {e.achievements.map((a, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="mt-1 text-secondary">▹</span>
                          {a}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
