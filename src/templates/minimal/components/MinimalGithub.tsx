import { useState, useEffect } from "react";
import { getGithubContributions } from "@/actions/github";
import { useTemplateData } from "@/shared/TemplateContext";
import { minimalTokens as t } from "../tokens";

export function MinimalGithub() {
  const { profile } = useTemplateData();
  const username = profile?.github_username || "O-FALLEN-ANGEL-O";
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGithub() {
      try {
        const days = await getGithubContributions(username);
        if (days && days.length > 0) setData(days);
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    fetchGithub();
  }, [username]);

  if (loading || data.length === 0) return null;

  return (
    <section data-portfolio-component="minimalgithub" className={`${t.spacing.section} ${t.spacing.container}`}>
      <div className="border-t border-black/10 dark:border-white/10 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className={`${t.typography.mono} ${t.colors.textMuted} mb-6`}>
            05. Open Source
          </h2>
          <h3 className={`${t.typography.heading} text-3xl mb-4`}>Code Contributions</h3>
          <p className={`${t.typography.body} ${t.colors.textMuted}`}>
            A visual record of commits, pull requests, and code reviews across the ecosystem.
          </p>
        </div>
        
        <div className="lg:col-span-8 flex items-center justify-end overflow-x-auto pb-4">
          <div className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayOfWeek) => (
              <div key={dayOfWeek} className="flex gap-1">
                {data.filter((_, i) => i % 7 === dayOfWeek).slice(-40).map((day, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 transition-colors ${
                      day.count === 0 ? "bg-black/5 dark:bg-white/5" :
                      day.count < 3 ? "bg-black/20 dark:bg-white/20" :
                      day.count < 6 ? "bg-black/50 dark:bg-white/50" :
                      "bg-black dark:bg-white"
                    }`}
                    title={`${day.count} contributions on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
