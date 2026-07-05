import { createServerFn } from "@tanstack/react-start";
import { SupabaseAdapter } from "@/lib/storage/supabaseAdapter";

export const getGithubStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const site = await SupabaseAdapter.getSite();
    const username = site.github_username || "O-FALLEN-ANGEL-O";

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

    // Calculate languages
    const langCounts: Record<string, number> = {};
    let totalReposWithLang = 0;
    
    // Sort top repositories by stars
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
