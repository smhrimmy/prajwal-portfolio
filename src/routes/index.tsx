import { createFileRoute } from '@tanstack/react-router'
import { getBlogs } from "../actions/blog";
import { useEffect, useState } from "react";
import { Background } from "@/components/background/Background";
import { Particles } from "@/components/background/Particles";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { ControlDock } from "@/components/layout/ControlDock";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Certifications } from "@/components/sections/Certifications";
import { GithubSection } from "@/components/sections/GithubSection";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { Assistant } from "@/components/ai/Assistant";
import { CommandPalette } from "@/components/secret/CommandPalette";
import { Terminal } from "@/components/secret/Terminal";
import { SecretFeatures } from "@/components/secret/SecretFeatures";

import { getSiteFn, getProjectsFn, getSkillsFn, getThemeFn } from "../actions/storage";
import { getGithubStatsFn } from "../actions/github";

export const Route = createFileRoute("/")({
  component: Index,
  staleTime: 1000 * 60 * 60, // Cache loader data client-side for 1 hour
  headers: () => {
    return {
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    };
  },
  loader: async () => {
    const [blogs, site, projects, skills, theme, github] = await Promise.all([
      getBlogs(),
      getSiteFn(),
      getProjectsFn(),
      getSkillsFn(),
      getThemeFn(),
      getGithubStatsFn()
    ]);
    return { blogs, site, projects, skills, theme, github };
  },
});

import { useCmsStore } from "@/store/useCmsStore";

function Index() {
  const [mounted, setMounted] = useState(false);
  const data = Route.useLoaderData();
  const { setSite, setProjects, setSkills, setTheme } = useCmsStore();

  useEffect(() => {
    setMounted(true);
    // Hydrate CMS store with server data
    if (data.site) setSite(data.site);
    if (data.projects) setProjects(data.projects);
    if (data.skills) setSkills(data.skills);
    if (data.theme) setTheme(data.theme);
  }, [data]);

  return (
    <>
      <Background />
      <Particles />
      {mounted && (
        <>
          <CustomCursor />
          <SmoothScroll />
        </>
      )}

      <FloatingNav />
      <ControlDock />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <GithubSection stats={data.github} />
        <Blog posts={data.blogs} />
        <Contact />
      </main>
      <Footer />

      {mounted && (
        <>
          <Assistant />
          <CommandPalette />
          <Terminal />
          <SecretFeatures />
        </>
      )}
    </>
  );
}
