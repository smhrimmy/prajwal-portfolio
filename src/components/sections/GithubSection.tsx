import { motion } from "framer-motion";
import { Star, Users, GitCommit, Github } from "lucide-react";
import { githubStats } from "@/data/socials";
import { SectionHeading, Reveal } from "@/components/ui/reveal";

function Heatmap() {
  // deterministic pseudo-random pattern (no hydration mismatch)
  const weeks = 26;
  const days = 7;
  const cells = Array.from({ length: weeks * days }, (_, i) => {
    const v = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    return Math.floor(Math.abs(v) * 5);
  });
  const shade = ["bg-muted", "bg-secondary/25", "bg-secondary/45", "bg-secondary/70", "bg-secondary"];
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto">
      {cells.map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: (i % 60) * 0.004 }}
          className={`h-3 w-3 rounded-sm ${shade[c]}`}
        />
      ))}
    </div>
  );
}

export function GithubSection({ stats }: { stats?: any }) {
  const currentStats = stats || {
    username: githubStats.username,
    followers: githubStats.followers,
    stars: githubStats.stars,
    repos: githubStats.repos,
    commitsThisYear: githubStats.commitsThisYear,
    languages: githubStats.languages,
    repositories: githubStats.repositories
  };

  const statBoxes = [
    { icon: Users, label: "Followers", value: currentStats.followers },
    { icon: Star, label: "Stars", value: currentStats.stars },
    { icon: GitCommit, label: "Commits '26", value: githubStats.commitsThisYear }, // Commits remain static until a more complex API fetches it
    { icon: Github, label: "Repos", value: currentStats.repos },
  ];
  return (
    <section id="github" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading kicker="// telemetry" title="GitHub Logs" subtitle={`Activity from @${currentStats.username}`} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statBoxes.map((s) => (
          <div key={s.label} className="glass corner-brackets rounded-2xl p-5 text-center">
            <s.icon className="mx-auto h-6 w-6 text-secondary" />
            <div className="mt-2 text-2xl font-black text-gradient">{s.value?.toLocaleString()}</div>
            <div className="font-mono text-[11px] uppercase text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <Reveal className="mt-6 glass rounded-2xl p-6">
        <div className="mb-4 font-mono text-xs uppercase tracking-wider text-secondary">Contribution Heatmap</div>
        <Heatmap />
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 font-mono text-xs uppercase tracking-wider text-secondary">Language Distribution</div>
          <div className="space-y-3">
            {currentStats.languages.map((l: any) => (
              <div key={l.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{l.name}</span>
                  <span className="text-muted-foreground">{l.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full"
                    style={{ background: l.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-3">
          {currentStats.repositories.map((r: any) => (
            <motion.a
              key={r.name}
              href={r.url || "#"}
              target="_blank"
              data-cursor="hover"
              whileHover={{ x: 4 }}
              className="glass flex items-center justify-between rounded-xl p-4"
            >
              <div>
                <div className="font-mono text-sm font-semibold text-secondary">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.langColor }} />
                  {r.lang}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" /> {r.stars}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
