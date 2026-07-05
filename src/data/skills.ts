export type SkillCategory = "Frontend" | "Backend" | "AI" | "Cloud" | "DevOps" | "Tools";

export interface Skill {
  name: string;
  level: number; // 0-100
  xp: number;
  rank: string;
  category: SkillCategory;
}

export const skills: Skill[] = [
  { name: "React / Next.js", level: 88, xp: 12400, rank: "EXPERT", category: "Frontend" },
  { name: "HTML / CSS / JS", level: 92, xp: 14200, rank: "ARCH_MAGE", category: "Frontend" },
  { name: "Tailwind CSS", level: 85, xp: 9800, rank: "MASTER", category: "Frontend" },
  { name: "UI / UX Design", level: 80, xp: 8600, rank: "LEAD", category: "Frontend" },
  { name: "Node / Express", level: 74, xp: 7200, rank: "ADVANCED", category: "Backend" },
  { name: "PHP / MySQL", level: 78, xp: 8400, rank: "LEAD", category: "Backend" },
  { name: "REST APIs", level: 76, xp: 7600, rank: "ADVANCED", category: "Backend" },
  { name: "AI / Prompting", level: 68, xp: 5200, rank: "SPECIALIST", category: "AI" },
  { name: "DNS Management", level: 90, xp: 13100, rank: "MASTER", category: "Cloud" },
  { name: "Hosting / cPanel", level: 88, xp: 11800, rank: "EXPERT", category: "Cloud" },
  { name: "WordPress", level: 93, xp: 15200, rank: "ARCH_MAGE", category: "Tools" },
  { name: "Git / Linux", level: 72, xp: 6100, rank: "ADVANCED", category: "DevOps" },
  { name: "Troubleshooting", level: 90, xp: 13400, rank: "MASTER", category: "DevOps" },
  { name: "Microsoft Excel", level: 82, xp: 8900, rank: "LEAD", category: "Tools" },
];

export const skillCategories: SkillCategory[] = [
  "Frontend",
  "Backend",
  "AI",
  "Cloud",
  "DevOps",
  "Tools",
];
