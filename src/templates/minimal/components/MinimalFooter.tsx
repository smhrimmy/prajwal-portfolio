import { useTemplateData } from "@/shared/TemplateContext";
import { minimalTokens as t } from "../tokens";

export function MinimalFooter() {
  const { profile, contact } = useTemplateData();
  
  return (
    <footer data-portfolio-component="minimalfooter" id="contact" className={`${t.spacing.section} ${t.spacing.container} border-t ${t.colors.border}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className={`${t.typography.heading} mb-8`}>Let's build something beautiful.</h2>
          <a href={`mailto:${contact?.email || profile?.email || "hello@example.com"}`} className="text-2xl border-b border-zinc-300 dark:border-zinc-700 pb-1 hover:pr-4 transition-all duration-300">
            {contact?.email || profile?.email || "hello@example.com"}
          </a>
        </div>
        
        <div className="flex flex-col md:items-end justify-end">
          <div className={`${t.typography.mono} ${t.colors.textMuted} flex gap-6`}>
            <a href={contact?.github || "#"} className="hover:text-black dark:hover:text-white transition-colors">GitHub</a>
            <a href={contact?.twitter || "#"} className="hover:text-black dark:hover:text-white transition-colors">Twitter</a>
            <a href={contact?.linkedin || "#"} className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
          </div>
          <div className={`${t.typography.mono} ${t.colors.textMuted} mt-8 text-xs`}>
            © {new Date().getFullYear()} {profile?.name || "Portfolio"}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
