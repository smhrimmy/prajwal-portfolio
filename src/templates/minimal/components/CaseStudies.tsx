import { useState } from "react";
import { useTemplateData } from "@/shared/TemplateContext";
import { minimalTokens as t } from "../tokens";

export function CaseStudies({ isFullPage = false }: { isFullPage?: boolean }) {
  const { projects } = useTemplateData();
  
  if (!projects || projects.length === 0) return null;

  const [expanded, setExpanded] = useState(false);
  const INITIAL_COUNT = 3;
  const currentProjects = isFullPage ? projects : (expanded ? projects : projects.slice(0, INITIAL_COUNT));
  const hasMore = !isFullPage && projects.length > INITIAL_COUNT;

  return (
    <section data-portfolio-component="casestudies" id="work" className={`${t.spacing.section} ${t.spacing.container}`}>
      <div className="mb-24 flex items-baseline justify-between">
        <h2 className={`${t.typography.mono} ${t.colors.textMuted}`}>
          02. Selected Work
        </h2>
      </div>

      <div className="flex flex-col gap-32">
        {currentProjects.map((project: any, i: number) => {
          // Create an asymmetric, staggered effect
          const isEven = i % 2 === 0;
          
          return (
            <div key={i} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center`}>
              <div className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className={`aspect-[4/3] bg-zinc-100 dark:bg-zinc-800/50 w-full overflow-hidden ${isEven ? '-rotate-1 hover:rotate-0' : 'rotate-1 hover:rotate-0'} transition-transform duration-700 ease-out shadow-lg`}>
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700">No Image</div>
                  )}
                </div>
              </div>
              
              <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <span className={`${t.typography.mono} ${t.colors.textMuted} mb-4 block`}>
                  {project.category || "Case Study"} — {project.year || "2024"}
                </span>
                <h3 className={`${t.typography.heading} text-3xl md:text-4xl mb-6`}>
                  {project.title}
                </h3>
                <p className={`${t.typography.body} ${t.colors.textMuted} mb-8`}>
                  {project.description}
                </p>
                <a href={project.github_url || project.live_url || "#"} className={`border-b ${t.colors.border} pb-1 hover:pr-4 transition-all duration-300`}>
                  View Case Study →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-32 flex justify-center border-t border-black/10 dark:border-white/10 pt-16">
          <button 
            onClick={() => setExpanded(!expanded)}
            className={`${t.typography.heading} text-2xl md:text-3xl hover:italic transition-all duration-300`}
          >
            {expanded ? "Hide Archive" : "View All Case Studies"} &rarr;
          </button>
        </div>
      )}
    </section>
  );
}
