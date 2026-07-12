import { PortfolioData } from "../../shared/types";
import { TemplateProvider } from "../../shared/TemplateContext";
import { glassTokens as t } from "./tokens";
import { GlassHUD } from "./components/GlassHUD";
import { GlassStack } from "./components/GlassStack";
import { TextureSystem } from "@/shared/components/TextureSystem";

import { TemplateContract } from "@/shared/contracts/TemplateContract";

function GlassHome() {
  return <GlassStack />;
}

function GlassProjects() {
  return (
    <>
      <h2 className="text-4xl font-bold mb-12 text-center text-zinc-900 dark:text-zinc-100">Featured Canvas</h2>
      <GlassStack isProjectsOnly />
    </>
  );
}

function GlassBlog() {
  return (
    <>
      <h2 className="text-4xl font-bold mb-12 text-center text-zinc-900 dark:text-zinc-100">Thoughts</h2>
      <GlassStack isBlogOnly />
    </>
  );
}

export default function GlassTemplate({ data, route = "/" }: { data: PortfolioData; route?: string }) {
  const PageComponent = contract.pages()[route] || GlassHome;

  return (
    <TemplateProvider data={data}>
      <div className={`min-h-screen ${t.colors.bg} ${t.colors.text} ${t.typography.sans} relative overflow-hidden`}>
        <TextureSystem type="noise" opacity={0.15} />
        
        {/* Soft Ambient Lighting Orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        
        <GlassHUD />
        
        <main className="max-w-7xl mx-auto px-4 md:px-12 pt-32 pb-32 relative z-10 flex flex-col gap-24">
          <PageComponent />
        </main>
      </div>
    </TemplateProvider>
  );
}

export const contract: TemplateContract = {
  metadata: () => ({
    id: "glass",
    name: "Glass OS",
    version: "1.0",
    author: "System",
    description: "A spatial computing inspired interface.",
    thumbnail: "/thumbnails/glass.png"
  }),
  navigation: () => ({ type: "top", items: [] }),
  layout: () => ({ type: "flow", width: "full", spacing: "relaxed" }),
  theme: () => ({ type: "dark" }),
  animations: () => ({ enabled: true }),
  pages: () => ({
    "/": GlassHome,
    "/projects": GlassProjects,
    "/blog": GlassBlog,
  }),
  components: () => ({}),
  capabilities: () => ["blog", "projects", "experience"],
  validate: () => ({ isHealthy: true, score: 90, missingSections: ["Gallery", "Resume"], missingFeatures: [], l2_diagnostics: {} })
};
