import { PortfolioData } from "../../shared/types";
import { TemplateProvider } from "../../shared/TemplateContext";
import { bentoTokens as t } from "./tokens";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Certifications } from "./components/Certifications";
import { GithubSection } from "./components/GithubSection";
import { Blog } from "./components/Blog";
import { Contact } from "./components/Contact";
import { TextureSystem } from "@/shared/components/TextureSystem";
import { BentoTimeline } from "./components/Timeline";
import { BentoTestimonials } from "./components/Testimonials";
import { BentoFAQ } from "./components/FAQ";

import { TemplateContract } from "@/shared/contracts/TemplateContract";

function BentoHome() {
  return (
    <>
      <Hero />
      <About />
      <BentoTimeline />
      <Skills />
      <Projects />
      <Experience />
      <BentoTestimonials />
      <Certifications />
      <GithubSection />
      <BentoFAQ />
      <Blog />
      <Contact />
    </>
  );
}

function BentoProjects() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4">
      <h1 className="text-5xl font-black mb-12 tracking-tight text-center">Bento Archive</h1>
      <Projects isFullPage />
    </div>
  );
}

function BentoBlog() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4">
      <h1 className="text-5xl font-black mb-12 tracking-tight text-center">Bento Index</h1>
      <Blog isFullPage />
    </div>
  );
}

export default function BentoTemplate({ data, route = "/" }: { data: PortfolioData; route?: string }) {
  const PageComponent = contract.pages()[route] || BentoHome;

  return (
    <TemplateProvider data={data}>
      <div className={`min-h-screen ${t.colors.bg} ${t.colors.text} selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black font-sans`}>
        <TextureSystem type="noise" opacity={0.4} />
        
        <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${t.colors.surface} ${t.colors.border} rounded-full px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-white/5 flex items-center gap-6 text-sm font-semibold backdrop-blur-xl`}>
          <a href="/" className="hover:opacity-70 transition-opacity">Home</a>
          <a href="/projects" className="hover:opacity-70 transition-opacity">Projects</a>
          <a href="/blog" className="hover:opacity-70 transition-opacity">Blog</a>
        </nav>

        <main className="flex flex-col gap-8 md:gap-12 pt-24 pb-12">
          <PageComponent />
        </main>

        <footer className="max-w-7xl mx-auto px-4 mt-24 text-center">
          <div className={`h-px w-full ${t.colors.border} mb-8`} />
          <p className={`${t.colors.textMuted} text-sm font-medium`}>
            © {new Date().getFullYear()} {data.profile?.name || data.theme.author}. Built with the Bento Experience.
          </p>
        </footer>
      </div>
    </TemplateProvider>
  );
}

export const contract: TemplateContract = {
  metadata: () => ({
    id: "bento",
    name: "Bento",
    version: "1.0",
    author: "System",
    description: "A playful, grid-based interface.",
    thumbnail: "/thumbnails/bento.png"
  }),
  navigation: () => ({ type: "top", items: [] }),
  layout: () => ({ type: "bento", width: "constrained", spacing: "tight" }),
  theme: () => ({ type: "dark" }),
  animations: () => ({ enabled: true }),
  pages: () => ({
    "/": BentoHome,
    "/projects": BentoProjects,
    "/blog": BentoBlog
  }),
  components: () => ({}),
  capabilities: () => ["blog", "projects", "experience"],
  validate: () => ({ isHealthy: true, score: 95, missingSections: ["Gallery", "Resume"], missingFeatures: [], l2_diagnostics: {} })
};
