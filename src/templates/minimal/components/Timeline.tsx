import { useTemplateData } from "@/shared/TemplateContext";
import { minimalTokens as t } from "../tokens";

export function Timeline() {
  const { experience } = useTemplateData();
  
  if (!experience || experience.length === 0) return null;

  return (
    <section data-portfolio-component="timeline" className={`${t.spacing.section} ${t.spacing.container}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-4">
          <h2 className={`${t.typography.mono} ${t.colors.textMuted} sticky top-32`}>
            03. Experience
          </h2>
        </div>
        
        <div className="lg:col-span-8 flex flex-col gap-16">
          {experience.map((job: any, i: number) => (
            <div key={i} className="group">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                <h3 className={`${t.typography.heading} text-2xl md:text-3xl`}>{job.role}</h3>
                <span className={`${t.typography.mono} ${t.colors.textMuted}`}>{job.period || "2020 - Present"}</span>
              </div>
              
              <div className="text-xl font-medium mb-6">@ {job.company}</div>
              
              <p className={`${t.typography.body} ${t.colors.textMuted} max-w-2xl`}>
                {job.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
