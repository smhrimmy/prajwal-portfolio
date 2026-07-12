import { useState } from "react";
import { useTemplateData } from "@/shared/TemplateContext";
import { cyberpunkTokens as t } from "../tokens";

export function FloatingPanels({ isProjectsOnly = false, isBlogOnly = false }: { isProjectsOnly?: boolean; isBlogOnly?: boolean }) {
  const { projects, experience, skills, blog, certifications } = useTemplateData();
  const [expandedProjects, setExpandedProjects] = useState(false);
  const [expandedBlog, setExpandedBlog] = useState(false);
  const INITIAL_COUNT = 3;

  const currentProjects = (expandedProjects || isProjectsOnly) ? projects : projects?.slice(0, INITIAL_COUNT);
  const hasMoreProjects = !isProjectsOnly && projects?.length > INITIAL_COUNT;

  const currentBlog = (expandedBlog || isBlogOnly) ? blog : blog?.slice(0, INITIAL_COUNT);
  const hasMoreBlog = !isBlogOnly && blog?.length > INITIAL_COUNT;

  if (isProjectsOnly) {
    return (
      <div data-portfolio-component="floatingpanels" className="flex flex-col gap-6">
        {currentProjects?.map((p: any, i: number) => (
          <article key={i} className="flex flex-col md:flex-row gap-4 border border-dashed border-[#00ff41]/20 p-4 hover:bg-[#00ff41]/5 transition-colors">
            <div className="md:w-1/3 aspect-video bg-zinc-900 border border-[#00ff41]/30 relative overflow-hidden group">
              {p.image && (
                <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity mix-blend-screen grayscale group-hover:grayscale-0" />
              )}
              <div className="absolute top-0 left-0 w-full h-full bg-[#00ff41]/20 pointer-events-none mix-blend-overlay"></div>
            </div>
            <div className="md:w-2/3 flex flex-col justify-center">
              <h4 className="text-lg font-bold mb-1 uppercase">{p.title}</h4>
              <p className={`text-sm ${t.colors.textMuted} mb-3`}>{p.description}</p>
              <div className="flex gap-4 text-xs">
                <a href={p.url || "#"} className="hover:text-white underline decoration-[#00ff41]/50 underline-offset-4">EXECUTE</a>
                <a href={p.githubUrl || "#"} className="hover:text-white underline decoration-[#00ff41]/50 underline-offset-4">SOURCE</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (isBlogOnly) {
    return (
      <div className="flex flex-col gap-4">
        {currentBlog?.map((p: any, i: number) => (
          <article key={i} className="flex justify-between items-start gap-4 border border-dashed border-[#00ff41]/20 p-4 hover:bg-[#00ff41]/5 transition-colors">
            <div>
              <h4 className="font-bold text-base mb-1">{p.title}</h4>
              <p className={`text-xs ${t.colors.textMuted}`}>{p.description}</p>
            </div>
            <span className="text-[#0df] text-xs shrink-0">{p.date || 'UNKNOWN'}</span>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="sys-logs">
      {/* Network / Projects Panel */}
      <section className={`lg:col-span-2 ${t.colors.surface} ${t.utils.panel} ${t.colors.border} p-6 ${t.motion.glitchHover}`}>
        <div className="flex justify-between items-center border-b border-[#00ff41]/30 pb-2 mb-4">
          <h3 className="text-xl font-bold uppercase tracking-widest">Data_Nodes</h3>
          <span className="text-xs bg-[#00ff41]/20 px-2 py-1">[ ACTIVE ]</span>
        </div>
        
        <div className="flex flex-col gap-6">
          {currentProjects?.map((p: any, i: number) => (
            <article key={i} className="flex flex-col md:flex-row gap-4 border border-dashed border-[#00ff41]/20 p-4 hover:bg-[#00ff41]/5 transition-colors">
              <div className="md:w-1/3 aspect-video bg-zinc-900 border border-[#00ff41]/30 relative overflow-hidden group">
                {p.image && (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity mix-blend-screen grayscale group-hover:grayscale-0" />
                )}
                <div className="absolute top-0 left-0 w-full h-full bg-[#00ff41]/20 pointer-events-none mix-blend-overlay"></div>
              </div>
              <div className="md:w-2/3 flex flex-col justify-center">
                <h4 className="text-lg font-bold mb-1 uppercase">{p.title}</h4>
                <p className={`text-sm ${t.colors.textMuted} mb-3`}>{p.description}</p>
                <div className="flex gap-4 text-xs">
                  <a href={p.url || "#"} className="hover:text-white underline decoration-[#00ff41]/50 underline-offset-4">EXECUTE</a>
                  <a href={p.githubUrl || "#"} className="hover:text-white underline decoration-[#00ff41]/50 underline-offset-4">SOURCE</a>
                </div>
              </div>
            </article>
          ))}
          {hasMoreProjects && (
            <button 
              onClick={() => setExpandedProjects(!expandedProjects)}
              className="mt-4 border border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/30 font-mono text-sm py-3 transition-colors animate-pulse uppercase tracking-widest"
            >
              {expandedProjects ? "[ ABORT: COLLAPSE_DATA ]" : "[ EXECUTE: FETCH_MORE ]"}
            </button>
          )}
        </div>

        {/* Transmissions / Blog */}
        {blog && blog.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center border-b border-[#00ff41]/30 pb-2 mb-4">
              <h3 className="text-xl font-bold uppercase tracking-widest">Transmissions</h3>
              <span className="text-xs bg-[#00ff41]/20 px-2 py-1">[ RSS_FEED ]</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {currentBlog?.map((p: any, i: number) => (
                <article key={i} className="flex justify-between items-start gap-4 border border-dashed border-[#00ff41]/20 p-4 hover:bg-[#00ff41]/5 transition-colors">
                  <div>
                    <h4 className="font-bold text-base mb-1">{p.title}</h4>
                    <p className={`text-xs ${t.colors.textMuted}`}>{p.description}</p>
                  </div>
                  <span className="text-[#0df] text-xs shrink-0">{p.date || 'UNKNOWN'}</span>
                </article>
              ))}
              {hasMoreBlog && (
                <button 
                  onClick={() => setExpandedBlog(!expandedBlog)}
                  className="mt-2 text-[#00ff41] hover:text-white underline decoration-[#00ff41]/50 underline-offset-4 font-mono text-xs uppercase transition-colors"
                >
                  {expandedBlog ? "[ TRUNCATE ]" : "[ DECRYPT_ARCHIVE ]"}
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Side Panel: Experience & Skills */}
      <section className="flex flex-col gap-6">
        
        <div className={`${t.colors.surface} ${t.utils.panel} ${t.colors.border} p-6 ${t.motion.glitchHover}`}>
          <div className="border-b border-[#00ff41]/30 pb-2 mb-4">
            <h3 className="text-xl font-bold uppercase tracking-widest">History_Log</h3>
          </div>
          <div className="flex flex-col gap-4">
            {experience?.map((exp: any, i: number) => (
              <div key={i} className="border-l-2 border-[#00ff41]/50 pl-3">
                <h4 className="font-bold uppercase">{exp.role}</h4>
                <div className="text-xs text-[#0df] mb-1">{exp.company} // {exp.period || exp.startDate}</div>
                <p className={`text-sm ${t.colors.textMuted}`}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${t.colors.surface} ${t.utils.panel} ${t.colors.border} p-6 ${t.motion.glitchHover}`}>
          <div className="border-b border-[#00ff41]/30 pb-2 mb-4">
            <h3 className="text-xl font-bold uppercase tracking-widest">Modules</h3>
          </div>
          <div className="flex flex-col gap-4">
            {skills?.slice(0, 3).map((group: any, i: number) => (
              <div key={i}>
                <div className="text-xs uppercase mb-2 text-[#0df]">[{group.category}]</div>
                <div className="flex flex-wrap gap-2">
                  {group.items?.slice(0, 5).map((skill: string, j: number) => (
                    <span key={j} className="text-xs border border-[#00ff41]/30 px-2 py-1 bg-[#00ff41]/5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {certifications && certifications.length > 0 && (
          <div className={`${t.colors.surface} ${t.utils.panel} ${t.colors.border} p-6 ${t.motion.glitchHover}`}>
            <div className="border-b border-[#00ff41]/30 pb-2 mb-4">
              <h3 className="text-xl font-bold uppercase tracking-widest">Clearances</h3>
            </div>
            <div className="flex flex-col gap-4">
              {certifications?.map((cert: any, i: number) => (
                <div key={i}>
                  <h4 className="font-bold text-sm uppercase text-[#0df]">{cert.name}</h4>
                  <div className="text-xs text-[#00ff41]/70">{cert.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
