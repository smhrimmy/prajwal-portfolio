import { useEffect, useState } from "react";
import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";

type StatusResult = { state: 'available' | 'busy' | 'offline'; lastPing: string };

// Mock interface for uptime as requested
async function getStatus(): Promise<StatusResult> {
  // In a real implementation, this would fetch from a ping service
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        state: 'available',
        lastPing: new Date().toISOString()
      });
    }, 500); // simulate network latency
  });
}

export function About() {
  const { profile: site } = useTemplateData();
  const [status, setStatus] = useState<StatusResult | null>(null);

  useEffect(() => {
    getStatus().then(setStatus).catch(() => {
      setStatus({ state: 'offline', lastPing: new Date().toISOString() });
    });
  }, []);

  return (
    <section data-portfolio-component="about" id="about" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">About</h2>
      </div>

      <div className={`${t.grid.container} ${t.layout.gap}`}>
        
        {/* Main About Cell (2x2) */}
        <article className={`md:col-span-2 md:row-span-2 ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} flex flex-col justify-center`}>
          <h3 className="text-2xl font-bold mb-4">Background</h3>
          <p className={`${t.colors.textMuted} leading-relaxed md:text-lg mb-6`}>
            {site?.bio || "I'm a developer focused on building scalable, accessible, and highly performant applications."}
          </p>
          <div className="mt-auto">
            <a href="#projects" className={`inline-flex px-4 py-2 font-semibold rounded-lg ${t.colors.accents.linkSoft} hover:opacity-80 motion-safe:transition-opacity`}>
              View My Work
            </a>
          </div>
        </article>

        {/* Location / Uptime Cell (1x1) */}
        <aside className={`col-span-1 row-span-1 ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover} flex flex-col justify-between items-start`}>
          <div className="mb-4">
            <span className={`text-xs font-bold tracking-widest uppercase ${t.colors.textMuted}`}>[ Location ]</span>
          </div>
          <div className="mt-auto">
            <h3 className="font-semibold text-lg">{site?.location || "Planet Earth"}</h3>
          </div>
        </aside>

        {/* System Status Cell (1x1) */}
        <aside className={`col-span-1 row-span-1 ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover} flex flex-col justify-between items-start`}>
          <div className="mb-4">
            <span className={`text-xs font-bold tracking-widest uppercase ${t.colors.textMuted}`}>[ System Status ]</span>
          </div>
          <div className="mt-auto flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${t.colors.accents.status} ${status?.state === 'available' ? t.motion.pulse : ''}`} />
              <h3 className="font-semibold text-lg capitalize">{status?.state || 'Pinging'}</h3>
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
}
