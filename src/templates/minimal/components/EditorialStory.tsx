import { useTemplateData } from "@/shared/TemplateContext";
import { minimalTokens as t } from "../tokens";

export function EditorialStory() {
  const { profile } = useTemplateData();
  
  return (
    <section data-portfolio-component="editorialstory" id="about" className={`${t.spacing.section} ${t.spacing.container}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-4">
          <h2 className={`${t.typography.mono} ${t.colors.textMuted} sticky top-32`}>
            01. The Story
          </h2>
        </div>
        <div className="lg:col-span-8">
          <div className={`${t.typography.heading} mb-12`}>
            {profile?.headline || "Designing systems that scale, with aesthetics that endure."}
          </div>
          <div className={`${t.typography.body} ${t.colors.textMuted} space-y-6 max-w-2xl`}>
            <p>
              I believe that software should be fundamentally invisible, leaving only the experience behind. 
              My approach focuses on stripping away the non-essential until only the pure intent of the product remains.
            </p>
            <p>
              When I'm not writing code, I'm usually exploring the intersection of typography, motion design, and brutalist architecture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
