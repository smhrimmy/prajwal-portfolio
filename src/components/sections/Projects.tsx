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

      <motion.div layout className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => {
            const isFeatured = p.featured;
            
            return (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className={cn(
                  "glass corner-brackets group relative flex flex-col overflow-hidden rounded-3xl p-6 lg:p-8",
                  isFeatured ? "sm:col-span-2 lg:col-span-2 bg-black/20" : "col-span-1"
                )}
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-30"
                  style={{ background: p.accent }}
                />
                
                {isFeatured ? (
                  <div className="flex flex-col gap-6 h-full lg:flex-row">
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between font-mono text-[10px] uppercase text-secondary">
                          <span>// {p.category}</span>
                        </div>
                        <h3 className="mt-4 text-3xl font-black tracking-tight">{p.title}</h3>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                      </div>
                      
                      <div className="mt-8">
                        <div className="flex flex-wrap gap-2">
                          {p.tags.map((t: string) => (
                            <span key={t} className="rounded border border-white/5 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white/70">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                          <a href={p.live} className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background transition-transform hover:scale-105">
                            Launch
                          </a>
                          <a href={p.github} className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs font-medium hover:text-secondary">
                            Source
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 rounded-xl bg-black/50 border border-white/10 p-4 font-mono text-xs overflow-hidden flex flex-col shadow-inner">
                      <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 mb-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-warning/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-success/80" />
                        <span className="ml-2 text-white/30">system.log</span>
                      </div>
                      <div className="text-success opacity-80 leading-relaxed">
                        &gt; Initializing {p.codename}...<br/>
                        &gt; Compiling dependencies...<br/>
                        &gt; Build successful. 0 errors, 0 warnings.<br/>
                        &gt; Deploying to production architecture...<br/>
                        &gt; System online.
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                      <span>{p.codename}</span>
                      <span className="text-secondary">{p.category}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map((t: string) => (
                        <span key={t} className="rounded border border-border bg-muted/30 px-2 py-0.5 font-mono text-[10px] text-secondary">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                      <div className="flex gap-3">
                        <a href={p.live} className="text-muted-foreground hover:text-foreground transition-colors"><ExternalLink className="h-4 w-4" /></a>
                        <a href={p.github} className="text-muted-foreground hover:text-foreground transition-colors"><Github className="h-4 w-4" /></a>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-secondary" />
                    </div>
                  </>
                )}
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
