import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import { useCmsStore } from "@/store/useCmsStore";
import { projectCategories } from "@/data/projects"; // fallback or kept for categories
import { SectionHeading } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Projects() {
  const storeProjects = useCmsStore((s) => s.projects);
  const [cat, setCat] = useState("All");
  
  // Extract unique categories from dynamic projects (or fallback to static if needed)
  const dynamicCategories = ["All", ...Array.from(new Set(storeProjects.map(p => p.category).filter(Boolean)))];
  const cats = dynamicCategories.length > 1 ? dynamicCategories : projectCategories;

  const filtered = cat === "All" ? storeProjects : storeProjects.filter((p) => p.category === cat);

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading kicker="// registry" title="Digital Artifacts" subtitle="A curated collection of experimental systems and shipped products." />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
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

      <motion.div layout className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.article
              layout
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -6 }}
              className={cn(
                "glass corner-brackets group relative flex flex-col overflow-hidden rounded-2xl p-6",
                p.featured && "sm:col-span-2 lg:col-span-2",
              )}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
                style={{ background: p.accent }}
              />
              {p.image && (
                <div className="mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-2xl aspect-[16/9] border-b border-border/50">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>OBJ_ID: {p.codename}</span>
                <span className="rounded-full bg-muted px-2 py-0.5">{p.category}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((t: string) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-3">
                <a href={p.live} data-cursor="hover" className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1.5 text-xs font-medium text-secondary ring-1 ring-secondary/40 transition-colors hover:bg-secondary/25">
                  <ExternalLink className="h-3.5 w-3.5" /> Live
                </a>
                <a href={p.github} data-cursor="hover" className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium transition-colors hover:text-foreground">
                  <Github className="h-3.5 w-3.5" /> Code
                </a>
                <ArrowUpRight className="ml-auto h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-secondary" />
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
