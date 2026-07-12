import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";

export function Hero() {
  const { profile: site } = useTemplateData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": site?.name || "Developer",
    "jobTitle": site?.role || "Software Engineer",
    "description": site?.bio || "Building digital experiences.",
  };

  return (
    <header data-portfolio-component="hero" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className={`${t.grid.container} ${t.layout.gap}`}>
        
        {/* Main Identity Cell (3 columns on desktop) */}
        <div className={`col-span-1 md:col-span-3 row-span-2 ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover}`}>
          <div className="flex flex-col h-full justify-between gap-12">
            <div>
              <div className={`inline-flex px-3 py-1 rounded-full ${t.colors.accents.linkSoft} text-sm font-semibold mb-6`}>
                {site?.role || "Software Engineer"}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Hi, I'm {site?.name?.split(" ")[0] || "Guest"} <br/>
                <span className={t.colors.textMuted}>{site?.name?.split(" ").slice(1).join(" ") || "User"}</span>
              </h1>
            </div>
            <p className={`text-xl md:text-2xl ${t.colors.textMuted} leading-relaxed max-w-2xl font-medium`}>
              {site?.bio || "Building digital experiences."}
            </p>
          </div>
        </div>

        {/* Status Cell (1 column on desktop) */}
        <div className={`col-span-1 row-span-1 ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover} flex flex-col justify-center`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${t.colors.accents.status} ${t.motion.pulse}`} />
            <h3 className="font-semibold text-lg">Status</h3>
          </div>
          <p className={`${t.colors.textMuted} text-sm font-medium`}>
            Available for new opportunities and exciting projects.
          </p>
        </div>

        {/* Action Cell (1 column on desktop) */}
        <a href="#contact" className={`col-span-1 row-span-1 ${t.colors.accents.link} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover} flex items-center justify-center group`}>
          <span className="font-bold text-xl flex items-center gap-2">
            Let's Talk 
            <span className="group-hover:translate-x-1 motion-safe:transition-transform">&rarr;</span>
          </span>
        </a>

      </div>
    </header>
  );
}
