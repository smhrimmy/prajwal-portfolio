import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";

export function BentoFAQ() {
  const { faq } = useTemplateData();
  
  if (!faq || faq.length === 0) return null;

  return (
    <section data-portfolio-component="faq" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
      </div>

      <div className={`${t.grid.container} ${t.layout.gap} grid-flow-row-dense`}>
        {faq.map((item: any, i: number) => {
          return (
            <article 
              key={i} 
              className={`${t.grid.span1x1} ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover} flex flex-col justify-center`}
            >
              <h3 className="font-bold text-lg mb-3">{item.question}</h3>
              <p className={`${t.colors.textMuted} text-sm leading-relaxed`}>{item.answer}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
