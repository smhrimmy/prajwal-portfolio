import { PortfolioData } from "../../shared/types";
import { TemplateProvider } from "../../shared/TemplateContext";
import { minimalTokens as t } from "./tokens";
import { MinimalNavbar } from "./components/MinimalNavbar";
import { MassiveHero } from "./components/MassiveHero";
import { EditorialStory } from "./components/EditorialStory";
import { CaseStudies } from "./components/CaseStudies";
import { Timeline } from "./components/Timeline";
import { Writing } from "./components/Writing";
import { MinimalSkills } from "./components/MinimalSkills";
import { MinimalCertifications } from "./components/MinimalCertifications";
import { MinimalGithub } from "./components/MinimalGithub";
import { MinimalFooter } from "./components/MinimalFooter";
import { TextureSystem } from "@/shared/components/TextureSystem";
import { TemplateContract } from "@/shared/contracts/TemplateContract";

function MinimalHome() {
  return (
    <>
      <MassiveHero />
      <EditorialStory />
      <MinimalSkills />
      <CaseStudies />
      <Timeline />
      <MinimalCertifications />
      <MinimalGithub />
      <Writing />
    </>
  );
}

function MinimalProjects() {
  return (
    <div className={`${t.spacing.container} pt-32`}>
      <h1 className={`${t.typography.heading} text-5xl md:text-7xl mb-16`}>Archive.</h1>
      <CaseStudies isFullPage />
    </div>
  );
}

function MinimalBlog() {
  return (
    <div className={`${t.spacing.container} pt-32`}>
      <h1 className={`${t.typography.heading} text-5xl md:text-7xl mb-16`}>Index.</h1>
      <Writing isFullPage />
    </div>
  );
}

export default function MinimalTemplate({ data, route = "/" }: { data: PortfolioData; route?: string }) {
  const PageComponent = contract.pages()[route] || MinimalHome;
  
  return (
    <TemplateProvider data={data}>
      <div className={`min-h-screen ${t.colors.bg} ${t.colors.text} selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black font-sans relative overflow-x-hidden`}>
        <TextureSystem type="paper" opacity={0.6} />
        <MinimalNavbar />
        
        <main>
          <PageComponent />
        </main>
        
        <MinimalFooter />
      </div>
    </TemplateProvider>
  );
}

export const contract: TemplateContract = {
  metadata: () => ({
    id: "minimal",
    name: "Minimal",
    version: "1.0",
    author: "System",
    description: "A typography-first editorial template.",
    thumbnail: "/thumbnails/minimal.png"
  }),
  navigation: () => ({ type: "top", items: [] }),
  layout: () => ({ type: "flow", width: "full", spacing: "relaxed" }),
  theme: () => ({ type: "light" }),
  animations: () => ({ enabled: true }),
  pages: () => ({
    "/": MinimalHome,
    "/projects": MinimalProjects,
    "/blog": MinimalBlog,
  }),
  components: () => ({}),
  capabilities: () => ["blog", "projects", "experience"],
  validate: () => ({ isHealthy: true, score: 95, missingSections: ["Gallery", "Contact", "FAQ", "Resume"], missingFeatures: [], l2_diagnostics: {} })
};
