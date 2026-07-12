import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";

export function BentoTimeline() {
  const { timeline } = useTemplateData();
  
  if (!timeline || timeline.length === 0) return null;

  return (
    <section data-portfolio-component="timeline" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Timeline</h2>
      </div>

      <div className={`flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 ${t.utils.hideScrollbar}`}>
        {timeline.map((item: any, i: number) => {
          return (
            <article 
              key={i} 
              className={`snap-center shrink-0 w-[85vw] md:w-[400px] ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} flex flex-col`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-3 h-3 rounded-full bg-zinc-900 dark:bg-zinc-100`} />
                <span className={`text-sm font-bold uppercase tracking-widest ${t.colors.textMuted}`}>{item.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className={`${t.colors.textMuted} text-sm leading-relaxed`}>{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
