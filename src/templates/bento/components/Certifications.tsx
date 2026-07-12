import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";

export function Certifications() {
  const { certifications } = useTemplateData();

  if (!certifications || certifications.length === 0) return null;

  return (
    <section data-portfolio-component="certifications" id="certifications" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Certifications</h2>
      </div>

      <div className={`${t.grid.container} ${t.layout.gap}`}>
        {certifications.map((cert: any) => {
          const spanClass = t.grid.span1x1;
          
          return (
            <article key={cert.id} className={`${spanClass} ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover} flex flex-col justify-center text-center items-center`}>
              <div className="mb-4">
                <span className={`text-[10px] font-bold tracking-widest uppercase ${t.colors.textMuted} px-2 py-1 border ${t.colors.border} rounded`}>
                  Credential
                </span>
              </div>
              <h3 className="font-bold mb-1">{cert.name}</h3>
              <div className={`text-sm ${t.colors.textMuted} mb-2`}>{cert.issuer}</div>
              {cert.date && (
                <div className={`text-xs font-semibold px-2 py-1 rounded-md ${t.colors.bg} ${t.colors.textMuted}`}>
                  {cert.date}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
