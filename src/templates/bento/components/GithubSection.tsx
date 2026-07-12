import { useEffect, useState } from "react";
import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";
import { getGithubContributions } from "@/actions/github";

type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export function GithubSection() {
  const { profile: site } = useTemplateData();
  const [data, setData] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeatmap() {
      // Use the github username if available, else extract from github link, else fallback
      let username = "octocat";
      if (site?.socialLinks) {
        const ghLink = site.socialLinks.find((l: any) => l.platform.toLowerCase() === "github");
        if (ghLink) {
          const parts = ghLink.url.split("/");
          username = parts[parts.length - 1] || "octocat";
        }
      }
      try {
        const days = await getGithubContributions(username);
        if (days && days.length > 0 && days.some((d: any) => d.level > 0)) {
          setData(days);
        } else {
          throw new Error("Empty or zero data");
        }
      } catch (err) {
        // Fallback mock data
        const mockDays = [];
        for (let i = 0; i < 364; i++) {
          const date = new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000);
          const rand = Math.random();
          let level: 0 | 1 | 2 | 3 | 4 = 0;
          if (rand > 0.9) level = 4;
          else if (rand > 0.7) level = 3;
          else if (rand > 0.4) level = 2;
          else if (rand > 0.2) level = 1;
          
          mockDays.push({
            date: date.toISOString().split('T')[0],
            count: level * 5,
            level
          });
        }
        setData(mockDays);
      } finally {
        setLoading(false);
      }
    }
    fetchHeatmap();
  }, [site]);

  // SVG parameters
  const cellSize = 10;
  const cellGap = 3;
  const numWeeks = 52;
  const numDays = 7;
  const width = numWeeks * (cellSize + cellGap) - cellGap;
  const height = numDays * (cellSize + cellGap) - cellGap;

  const getColorForLevel = (level: number) => {
    switch(level) {
      case 4: return "currentColor";
      case 3: return "rgba(16, 185, 129, 0.8)"; // emerald-500
      case 2: return "rgba(16, 185, 129, 0.5)";
      case 1: return "rgba(16, 185, 129, 0.3)";
      default: return "rgba(16, 185, 129, 0.05)";
    }
  };

  return (
    <section data-portfolio-component="githubsection" id="github" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Open Source</h2>
      </div>

      <div className={`${t.grid.container} ${t.layout.gap}`}>
        
        {/* Heatmap Cell (2x1) */}
        <article className={`md:col-span-2 row-span-1 ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} flex flex-col justify-between overflow-x-auto`}>
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <h3 className="font-bold">Contributions</h3>
          </div>
          
          <div className="text-emerald-500">
            {loading ? (
              <div className={`w-full h-[100px] ${t.motion.pulse} bg-black/5 dark:bg-white/5 rounded-md`} />
            ) : (
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-auto min-w-[600px] text-emerald-500"
                style={{ shapeRendering: "crispEdges" }}
              >
                {data.map((day, i) => {
                  const week = Math.floor(i / numDays);
                  const dayOfWeek = i % numDays;
                  return (
                    <rect 
                      key={day.date}
                      x={week * (cellSize + cellGap)}
                      y={dayOfWeek * (cellSize + cellGap)}
                      width={cellSize}
                      height={cellSize}
                      rx={2} // matching small radius
                      fill={getColorForLevel(day.level)}
                    >
                      <title>{`${day.count} contributions on ${day.date}`}</title>
                    </rect>
                  );
                })}
              </svg>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
