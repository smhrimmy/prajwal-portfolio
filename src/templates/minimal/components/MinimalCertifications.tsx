import { useTemplateData } from "@/shared/TemplateContext";
import { minimalTokens as t } from "../tokens";

export function MinimalCertifications() {
  const { certifications } = useTemplateData();
  
  if (!certifications || certifications.length === 0) return null;

  return (
    <section data-portfolio-component="minimalcertifications" className={`${t.spacing.section} ${t.spacing.container}`}>
      <div className="border-t border-black/10 dark:border-white/10 pt-16">
        <h2 className={`${t.typography.mono} ${t.colors.textMuted} mb-16`}>
          04. Credentials
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {certifications.map((cert: any, i: number) => (
            <article key={i} className="flex flex-col">
              <span className={`${t.typography.mono} text-xs uppercase tracking-widest text-black/50 dark:text-white/50 mb-4 block`}>
                {cert.date || "Issued"}
              </span>
              <h3 className={`${t.typography.heading} text-2xl leading-tight mb-2`}>
                {cert.name}
              </h3>
              <p className={`${t.typography.body} ${t.colors.textMuted}`}>
                {cert.issuer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
