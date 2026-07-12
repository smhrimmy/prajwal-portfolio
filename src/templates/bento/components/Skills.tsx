import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";

export function Skills() {
  const { skills } = useTemplateData();

  if (!skills || skills.length === 0) return null;

  return (
    <section data-portfolio-component="skills" id="skills" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Capabilities</h2>
      </div>

      <div className={`${t.grid.container} ${t.layout.gap}`}>
        {skills.map((categoryGroup: any, idx: number) => {
          return (
            <div key={idx} className={`${idx === 0 || idx === 3 ? t.grid.span2x1 : t.grid.span1x1} ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} flex flex-col`}>
              <div className="flex flex-col gap-1 mb-6">
                <span className={`text-[10px] font-bold tracking-widest uppercase ${t.colors.textMuted}`}>
                  Capability //
                </span>
                <h3 className="font-bold text-xl">{categoryGroup.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {categoryGroup.items?.map((item: string, i: number) => (
                  <span key={i} className={`px-2.5 py-1 text-xs font-medium rounded-md bg-black/5 dark:bg-white/5`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
