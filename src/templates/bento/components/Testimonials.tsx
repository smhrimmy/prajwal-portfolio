import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";

export function BentoTestimonials() {
  const { testimonials } = useTemplateData();
  
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section data-portfolio-component="testimonials" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Endorsements</h2>
      </div>

      <div className={`flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 ${t.utils.hideScrollbar}`}>
        {testimonials.map((item: any, i: number) => {
          return (
            <article 
              key={i} 
              className={`snap-center shrink-0 w-[85vw] md:w-[400px] ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} flex flex-col`}
            >
              <p className={`${t.colors.text} text-sm md:text-base leading-relaxed italic mb-6 flex-1`}>
                "{item.quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto border-t border-black/5 dark:border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold">
                  {item.author?.[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.author}</h4>
                  <p className={`text-xs ${t.colors.textMuted}`}>{item.role}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
