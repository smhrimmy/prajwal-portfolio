import { createServerFn } from "@tanstack/react-start";
import { getGithubStatsFn } from "./github";
import { BlogPostData } from "./blog";
import fs from "fs";
import path from "path";

export interface SiteDataCache {
  site: any;
  projects: any[];
  skills: any[];
  theme: any;
  blogs: BlogPostData[];
  github: any;
}

// Helper to safely read JSON from the generated folder
const readGeneratedJson = (filename: string, fallback: any) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'generated', filename);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {
    console.error(`Failed to read generated ${filename}`, e);
  }
  return fallback;
};

// This endpoint aggregates the statically generated JSON files.
// It serves as the Delivery Layer, guaranteeing sub-millisecond responses without hitting Supabase.
export const getSiteDataFn = createServerFn({ method: "GET" }).handler(async (): Promise<SiteDataCache> => {
  
  const site = readGeneratedJson('site.json', {});
  const projects = readGeneratedJson('projects.json', []);
  const skills = readGeneratedJson('skills.json', []);
  const theme = readGeneratedJson('theme.json', {});
  
  // Blog index contains the list of published posts
  const blogs = readGeneratedJson('blog/index.json', []);
  return {
    site,
    projects,
    skills,
    theme,
    blogs,
  };
});
