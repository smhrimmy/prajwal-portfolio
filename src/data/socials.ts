export const socials = [
  { name: "Website", handle: "praxel.space", url: "https://praxel.space/", icon: "link" },
  { name: "LinkedIn", handle: "prajwal-d-l", url: "https://linkedin.com/in/prajwal-d-l-118198370/", icon: "linkedin" },
  { name: "Phone", handle: "+91 8105561638", url: "tel:+918105561638", icon: "phone" },
  { name: "Email", handle: "pdlkpt@gmail.com", url: "mailto:pdlkpt@gmail.com", icon: "mail" },
] as const;

export const githubStats = {
  username: "prajwaldl",
  followers: 128,
  stars: 342,
  commitsThisYear: 1204,
  repos: 36,
  languages: [
    { name: "TypeScript", pct: 38, color: "#3178c6" },
    { name: "JavaScript", pct: 27, color: "#f7df1e" },
    { name: "PHP", pct: 15, color: "#777bb4" },
    { name: "CSS", pct: 12, color: "#264de4" },
    { name: "Python", pct: 8, color: "#3572A5" },
  ],
  repositories: [
    { name: "portfolio-engine", desc: "Animated portfolio system", stars: 84, lang: "TypeScript", langColor: "#3178c6" },
    { name: "wp-support-toolkit", desc: "WordPress diagnostics tools", stars: 41, lang: "PHP", langColor: "#777bb4" },
    { name: "atlas-dashboard", desc: "Telemetry dashboard concept", stars: 63, lang: "TypeScript", langColor: "#3178c6" },
    { name: "landing-lab", desc: "High-converting landing pages", stars: 29, lang: "JavaScript", langColor: "#f7df1e" },
  ],
};

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
}

export const blogCategories = ["All", "Frontend", "Career", "DevOps", "Design"];

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "Building Cinematic Loading Experiences",
    excerpt: "How gamified onboarding replaces boring spinners and boosts perceived performance.",
    category: "Frontend",
    date: "Jun 2026",
    readTime: "6 min",
  },
  {
    id: "b2",
    title: "Debugging DNS & Hosting Like a Pro",
    excerpt: "Lessons from thousands of support tickets on shared hosting environments.",
    category: "DevOps",
    date: "May 2026",
    readTime: "8 min",
  },
  {
    id: "b3",
    title: "Micro-Interactions That Feel Premium",
    excerpt: "The subtle motion details that separate good UI from award-winning UI.",
    category: "Design",
    date: "Apr 2026",
    readTime: "5 min",
  },
  {
    id: "b4",
    title: "From Support Engineer to Full Stack Dev",
    excerpt: "My path breaking into web development and what actually mattered.",
    category: "Career",
    date: "Mar 2026",
    readTime: "7 min",
  },
];
