"use server";
import { createServerFn } from "@tanstack/react-start";
import { SupabaseAdapter } from "@/lib/storage/supabaseAdapter";

type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

// Simple mock/cache for github contributions
let cache: { data: ContributionDay[], timestamp: number } | null = null;
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours

export async function getGithubContributions(username: string): Promise<ContributionDay[]> {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return cache.data;
    }

    const res = await fetch(`https://api.github.com/users/${username}/events/public`, {
      headers: {
        "User-Agent": "Portfolio-Bento-Engine"
      },
      next: { revalidate: 14400 } // Next.js/Vinxi cache pattern
    } as any);

    if (!res.ok) {
      throw new Error(`GitHub API failed: ${res.status}`);
    }

    const events = await res.json();
    
    const calendar: Record<string, number> = {};
    for (const ev of events) {
      const date = ev.created_at.split("T")[0];
      calendar[date] = (calendar[date] || 0) + 1;
    }

    const days: ContributionDay[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const count = calendar[dateStr] || 0;
      
      let level: 0|1|2|3|4 = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5 && count <= 8) level = 3;
      else if (count > 8) level = 4;

      days.push({ date: dateStr, count, level });
    }

    cache = { data: days, timestamp: Date.now() };
    return days;
  } catch (err) {
    console.warn("GitHub fetch failed, falling back to static placeholder", err);
    const days: ContributionDay[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({ 
        date: d.toISOString().split("T")[0], 
        count: 0, 
        level: (i % 7 === 0) ? 1 : 0 
      });
    }
    return days;
  }
}

export const getGithubStatsFn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async ({ data: username }) => {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`)
    ]);

    if (!userRes.ok || !reposRes.ok) {
      throw new Error("Failed to fetch from GitHub API");
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const stars = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

    const langCounts: Record<string, number> = {};
    let totalReposWithLang = 0;
    
    const topRepos = repos
      .filter((r: any) => !r.fork)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
      .map((r: any) => ({
        name: r.name,
        desc: r.description || "No description provided",
        stars: r.stargazers_count,
        lang: r.language || "Unknown",
        langColor: getLangColor(r.language),
        url: r.html_url
      }));

    repos.forEach((r: any) => {
      if (r.language) {
        langCounts[r.language] = (langCounts[r.language] || 0) + 1;
        totalReposWithLang++;
      }
    });

    const languages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({
        name,
        pct: Math.round((count / totalReposWithLang) * 100),
        color: getLangColor(name)
      }));

    return {
      username,
      followers: user.followers,
      stars,
      repos: user.public_repos,
      commitsThisYear: 0,
      languages,
      repositories: topRepos
    };
  } catch (err) {
    console.error("GitHub fetch error:", err);
    return null;
  }
});

function getLangColor(lang: string | null) {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600"
  };
  return lang ? (colors[lang] || "#8b949e") : "#8b949e";
}
