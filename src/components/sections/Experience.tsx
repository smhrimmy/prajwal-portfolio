import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, GitMerge, ArrowUpRight } from "lucide-react";
import { experiences as staticExperiences } from "@/data/experience";
import { SectionHeading } from "@/components/ui/reveal";
import { useCmsStore } from "@/store/useCmsStore";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Experience({ isFullPage = false }: { isFullPage?: boolean }) {
  const cmsStore = useCmsStore();
  const rawExperiences = (cmsStore as any).experience?.length > 0 ? (cmsStore as any).experience : staticExperiences;

  const INITIAL_COUNT = 4;
  const currentExperiences = isFullPage ? rawExperiences : rawExperiences.slice(0, INITIAL_COUNT);
  const hasMore = !isFullPage && rawExperiences.length > INITIAL_COUNT;

  return (
    <section data-portfolio-component="experience" id="experience" className={cn("relative mx-auto max-w-5xl", isFullPage ? "px-0 py-0" : "px-6 py-28")}>
      {!isFullPage && (
        <SectionHeading kicker="// the_journey" title="Experience" subtitle="A timeline of shipped products, resolved incidents, and technical growth." />
      )}

      <div className="relative mt-12">
        <div className="absolute left-6 top-4 h-[calc(100%-2rem)] w-0.5 bg-gradient-to-b from-border via-secondary/20 to-transparent lg:left-1/2 lg:-translate-x-1/2" />
        
        {currentExperiences.map((e: any, i: number) => {
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={e.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative mb-16 flex flex-col pl-16 lg:flex-row lg:items-center lg:pl-0 ${
                isEven ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline Icon */}
              <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-background bg-secondary/10 text-secondary shadow-xl lg:left-1/2 lg:-translate-x-1/2">
                {e.current ? (
                  <GitPullRequest className="h-5 w-5 animate-pulse" />
                ) : (
                  <GitCommit className="h-5 w-5" />
                )}
              </div>

              {/* Content Box */}
              <div className={`lg:w-1/2 ${isEven ? "lg:pl-16 text-left" : "lg:pr-16 lg:text-right"}`}>
                <div className="glass corner-brackets relative rounded-3xl p-6 lg:p-8">
                  <div className={`mb-4 flex flex-wrap items-center gap-3 ${!isEven && "lg:justify-end"}`}>
                    <span className="rounded bg-secondary/20 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-secondary">
                      {e.period}
                    </span>
                    <span className="text-sm text-muted-foreground">{e.location}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black tracking-tight text-foreground">{e.role}</h3>
                  <div className="mt-1 font-mono text-sm text-secondary">@ {e.company}</div>
                  
                  <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {e.achievements?.map((a: string, j: number) => (
                      <p key={j} className="flex gap-3">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary/50 ${!isEven && "lg:hidden"}`} />
                        <span className="flex-1">{a}</span>
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary/50 hidden ${!isEven && "lg:block"}`} />
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Link
            to="/timeline"
            className="group flex items-center gap-2 rounded-full glass px-6 py-3 font-mono text-xs uppercase transition-all hover:bg-secondary hover:text-secondary-foreground"
          >
            Career Archive
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
