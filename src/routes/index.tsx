import { createFileRoute } from '@tanstack/react-router'
import { getBlogs } from "../actions/blog";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Loader } from "@/components/onboarding/Loader";
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

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => {
    return await getBlogs();
  },
});

function Index() {
  const loaded = useAppStore((s) => s.loaded);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

      {mounted && !loaded && <Loader />}

      <FloatingNav />
      <ControlDock />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <GithubSection />
        <Blog posts={Route.useLoaderData()} />
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
