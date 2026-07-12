import { useState } from "react";
import { useTemplateData } from "@/shared/TemplateContext";
import { glassTokens as t } from "../tokens";

export function GlassStack({ isProjectsOnly = false, isBlogOnly = false }: { isProjectsOnly?: boolean; isBlogOnly?: boolean }) {
  const { profile, projects, experience, skills, blog, certifications, contact } = useTemplateData();
  const [expandedProjects, setExpandedProjects] = useState(false);
  const INITIAL_COUNT = 3;

  const currentProjects = (expandedProjects || isProjectsOnly) ? projects : projects?.slice(0, INITIAL_COUNT);
  const hasMoreProjects = !isProjectsOnly && projects?.length > INITIAL_COUNT;

  if (isProjectsOnly) {
    return (
      <div data-portfolio-component="glassstack" className="flex flex-col gap-12 relative perspective-[2000px]">
        {currentProjects?.map((p: any, i: number) => (
          <article 
            key={i}
            className={`${t.colors.surface} ${t.utils.panel} ${t.layout.radius} overflow-hidden flex flex-col md:flex-row group ${t.motion.float}`}
          >
            <div className="md:w-1/2 aspect-video md:aspect-auto bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
              {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />}
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-4">{p.title}</h3>
              <p className={`${t.colors.textMuted} text-lg mb-8 leading-relaxed`}>{p.description}</p>
              <div className="flex gap-4">
                <a href={p.url || "#"} className="px-6 py-3 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:scale-105 transition-transform shadow-xl">
                  View Project
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (isBlogOnly) {
    return (
      <div className="flex flex-col gap-6">
        {blog?.map((post: any, i: number) => (
          <a key={i} href={`/blog/${post.slug || post.id}`} className={`group flex flex-col gap-2 pb-4 ${t.colors.surface} ${t.utils.panel} ${t.layout.radius} p-8`}>
            <h3 className="font-bold text-2xl group-hover:text-indigo-500 transition-colors">{post.title}</h3>
            <p className={`${t.colors.textMuted} line-clamp-3`}>{post.description}</p>
            <span className="text-sm text-indigo-500 font-medium mt-2">{post.date}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-24 relative">
      
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500 bg-clip-text text-transparent">
          {profile?.name || "Designer & Engineer"}
        </h1>
        <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-2xl font-light">
          {profile?.short_bio || "Crafting spatial interfaces and immersive digital experiences."}
        </p>
      </section>

      {/* Projects Layer */}
      <section id="projects" className="relative z-10">
        <h2 className="text-2xl font-semibold mb-12">Featured Canvas</h2>
        <div className="flex flex-col gap-12 relative perspective-[2000px]">
          {currentProjects?.map((p: any, i: number) => (
            <article 
              key={i}
              className={`${t.colors.surface} ${t.utils.panel} ${t.layout.radius} overflow-hidden flex flex-col md:flex-row group ${t.motion.float}`}
            >
              <div className="md:w-1/2 aspect-video md:aspect-auto bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />}
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-4">{p.title}</h3>
                <p className={`${t.colors.textMuted} text-lg mb-8 leading-relaxed`}>{p.description}</p>
                <div className="flex gap-4">
                  <a href={p.url || "#"} className="px-6 py-3 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:scale-105 transition-transform shadow-xl">
                    View Project
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {hasMoreProjects && (
          <div className="mt-16 flex justify-center">
            <button 
              onClick={() => setExpandedProjects(!expandedProjects)}
              className="px-8 py-4 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-lg font-semibold hover:-translate-y-1 transition-transform"
            >
              {expandedProjects ? "Collapse Canvas" : "Expand All Cards"}
            </button>
          </div>
        )}
      </section>

      {/* Skills & Experience */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className={`${t.colors.surface} ${t.utils.panel} ${t.layout.radius} p-8 md:p-12`}>
          <h2 className="text-2xl font-semibold mb-8">Capabilities</h2>
          <div className="flex flex-col gap-6">
            {skills?.slice(0, 4).map((group: any, i: number) => (
              <div key={i}>
                <h3 className="font-bold text-sm text-indigo-500 mb-2">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items?.map((item: string, j: number) => (
                    <span key={j} className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-sm font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${t.colors.surface} ${t.utils.panel} ${t.layout.radius} p-8 md:p-12`}>
          <h2 className="text-2xl font-semibold mb-8">Journey</h2>
          <div className="flex flex-col gap-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-200 dark:before:bg-zinc-800">
            {experience?.map((exp: any, i: number) => (
              <div key={i} className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-6 h-6 bg-white dark:bg-black rounded-full border-4 border-indigo-500 shadow-lg" />
                <h3 className="font-bold text-lg">{exp.role}</h3>
                <div className="text-sm font-medium text-indigo-500 mb-2">{exp.company} • {exp.period || exp.startDate}</div>
                <p className={`text-sm ${t.colors.textMuted} leading-relaxed`}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog & Certifications */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className={`${t.colors.surface} ${t.utils.panel} ${t.layout.radius} p-8 md:p-12`}>
          <h2 className="text-2xl font-semibold mb-8">Thoughts</h2>
          <div className="flex flex-col gap-6">
            {blog?.slice(0, 3).map((post: any, i: number) => (
              <a key={i} href={`/blog/${post.slug || post.id}`} className="group flex flex-col gap-2 border-b border-black/5 dark:border-white/5 pb-4">
                <h3 className="font-bold text-lg group-hover:text-indigo-500 transition-colors">{post.title}</h3>
                <p className={`text-sm ${t.colors.textMuted} line-clamp-2`}>{post.description}</p>
                <span className="text-xs text-indigo-500 font-medium mt-1">{post.date}</span>
              </a>
            ))}
          </div>
        </div>

        <div className={`${t.colors.surface} ${t.utils.panel} ${t.layout.radius} p-8 md:p-12 flex flex-col gap-8`}>
          <div>
            <h2 className="text-2xl font-semibold mb-6">Credentials</h2>
            <div className="flex flex-col gap-4">
              {certifications?.map((cert: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
                  <div>
                    <h4 className="font-bold">{cert.name}</h4>
                    <p className={`text-sm ${t.colors.textMuted}`}>{cert.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Connect</h2>
            <div className="flex flex-col gap-4">
              <a href={contact?.github || "#"} className="flex justify-between items-center group">
                <span className="font-medium group-hover:text-indigo-500 transition-colors">GitHub</span>
                <span className="text-indigo-500">→</span>
              </a>
              <a href={contact?.twitter || "#"} className="flex justify-between items-center group">
                <span className="font-medium group-hover:text-indigo-500 transition-colors">Twitter</span>
                <span className="text-indigo-500">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
