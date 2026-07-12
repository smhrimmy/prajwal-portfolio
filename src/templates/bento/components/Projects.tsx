import { useRef } from "react";
import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";

export function Projects({ isFullPage = false }: { isFullPage?: boolean }) {
  const { projects } = useTemplateData();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current || isFullPage) return;
    isDown.current = true;
    sliderRef.current.classList.add('active');
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current || isFullPage) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // scroll-fast
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (!projects || projects.length === 0) return null;

  return (
    <section data-portfolio-component="projects" id="projects" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      {!isFullPage && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        </div>
      )}

      <div 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={isFullPage ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` : `flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 ${t.utils.hideScrollbar} cursor-grab active:cursor-grabbing`}
      >
        {projects.map((p: any, i: number) => {
          const isFeatured = p.featured || i === 0;
          
          const img = p.image || p.imageUrl;
          const jsonLd = {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": p.title,
            "description": p.description,
            "url": p.url || p.githubUrl || "",
            "image": img || ""
          };

          return (
            <article 
              key={p.id} 
              className={`${t.colors.surface} ${t.colors.border} ${isFullPage ? 'w-full' : 'snap-center shrink-0 w-[85vw] md:w-[600px] lg:w-[700px]'} ${t.layout.radius} ${t.utils.card} flex flex-col hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-grab active:cursor-grabbing`}
            >
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
              
              <a href={p.url || p.githubUrl || p.live || "#"} target="_blank" rel="noreferrer" className="flex flex-col h-full group">
                <div className={`w-full ${isFeatured ? 'h-64 md:h-80' : 'h-56'} bg-black/5 dark:bg-white/5 border-b ${t.colors.border} overflow-hidden shrink-0`}>
                  {img ? (
                    <img src={img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-500 pointer-events-none" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-medium opacity-50 uppercase tracking-widest">
                      No Preview
                    </div>
                  )}
                </div>
                
                <div className={`${t.layout.padding} flex flex-col flex-1`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className={`text-xl ${isFeatured ? 'md:text-2xl' : ''} font-bold`}>{p.title}</h3>
                    {isFeatured && (
                      <span className={`shrink-0 px-2 py-1 text-xs font-bold uppercase rounded-md ${t.colors.accents.featuredSoft}`}>
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <p className={`${t.colors.textMuted} mb-6 flex-1 text-sm ${isFeatured ? 'md:text-base' : ''} leading-relaxed`}>
                    {p.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {p.tags?.slice(0, isFeatured ? 6 : 3).map((tag: string) => (
                      <span key={tag} className={`px-2 py-1 text-xs font-medium rounded-md ${t.colors.bg} ${t.colors.textMuted} ${t.colors.border}`}>
                        {tag}
                      </span>
                    ))}
                    {p.tags?.length > (isFeatured ? 6 : 3) && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-md ${t.colors.bg} ${t.colors.textMuted} ${t.colors.border}`}>
                        +{p.tags.length - (isFeatured ? 6 : 3)}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
