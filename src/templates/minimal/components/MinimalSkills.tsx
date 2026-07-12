import { useTemplateData } from "@/shared/TemplateContext";
import { minimalTokens as t } from "../tokens";

export function MinimalSkills() {
  const { skills } = useTemplateData();
  
  if (!skills || skills.length === 0) return null;

  return (
    <section data-portfolio-component="minimalskills" className={`${t.spacing.section} ${t.spacing.container}`}>
      <div className="mb-24">
        <h2 className={`${t.typography.mono} ${t.colors.textMuted} mb-6`}>
          03. Capabilities & Toolkit
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        {skills.map((group: any, idx: number) => (
          <div key={idx} className="border-t border-black/10 dark:border-white/10 pt-6">
            <h3 className={`${t.typography.heading} text-2xl mb-8`}>{group.category}</h3>
            <ul className="flex flex-col gap-4">
              {group.items?.map((item: string, i: number) => (
                <li key={i} className={`${t.typography.body} text-lg`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
