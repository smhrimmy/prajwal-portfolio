import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";

export function Experience() {
  const { experience } = useTemplateData();

  if (!experience || experience.length === 0) return null;

  return (
    <section data-portfolio-component="experience" id="experience" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
      </div>

      <div className={`${t.grid.container} ${t.layout.gap}`}>
        {experience.map((exp: any, i: number) => {
          const spanClass = t.grid.span2x1;
          
          return (
            <article key={exp.id} className={`${spanClass} ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-bold text-xl">{exp.role}</h3>
                  <div className={`font-semibold ${t.colors.textMuted}`}>{exp.company}</div>
                </div>
                <div className={`text-sm font-medium px-3 py-1 rounded-full ${t.colors.bg} ${t.colors.textMuted} w-fit`}>
                  {exp.period || `${exp.startDate} - ${exp.endDate || "Present"}`}
                </div>
              </div>
              <p className={`text-sm ${t.colors.textMuted} leading-relaxed`}>
                {exp.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
