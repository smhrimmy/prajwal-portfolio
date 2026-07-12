import { PortfolioData } from "../../shared/types";
import { TemplateProvider } from "../../shared/TemplateContext";
import { cyberpunkTokens as t } from "./tokens";
import { TextureSystem } from "@/shared/components/TextureSystem";
import { TerminalHero } from "./components/TerminalHero";
import { FloatingPanels } from "./components/FloatingPanels";
import { TerminalComms } from "./components/TerminalComms";

import { TemplateContract } from "@/shared/contracts/TemplateContract";

function CyberpunkHome() {
  return (
    <>
      <TerminalHero />
      <FloatingPanels />
      <TerminalComms />
    </>
  );
}

function CyberpunkProjects() {
  return (
    <div className="flex flex-col gap-6">
      <div className={`p-6 ${t.colors.surface} ${t.utils.panel} ${t.colors.border}`}>
        <h2 className="text-3xl font-bold uppercase tracking-widest text-[#00ff41] mb-6">Archive // Projects</h2>
        <FloatingPanels isProjectsOnly />
      </div>
    </div>
  );
}

function CyberpunkBlog() {
  return (
    <div className="flex flex-col gap-6">
      <div className={`p-6 ${t.colors.surface} ${t.utils.panel} ${t.colors.border}`}>
        <h2 className="text-3xl font-bold uppercase tracking-widest text-[#00ff41] mb-6">Transmissions // Blog</h2>
        <FloatingPanels isBlogOnly />
      </div>
    </div>
  );
}

export default function CyberpunkTemplate({ data, route = "/" }: { data: PortfolioData; route?: string }) {
  const PageComponent = contract.pages()[route] || CyberpunkHome;

  return (
    <TemplateProvider data={data}>
      <div className={`min-h-screen ${t.colors.bg} ${t.colors.text} ${t.typography.mono} selection:bg-[#00ff41] selection:text-black relative overflow-hidden flex flex-col`}>
        <TextureSystem type="crt" opacity={1} />
        
        {/* Persistent HUD Navigation */}
        <nav className={`fixed top-0 left-0 w-full z-50 ${t.colors.surface} border-b ${t.colors.border} p-4 flex justify-between items-center text-xs backdrop-blur-md bg-black/80`}>
          <div>SYS_ID: {data.profile?.name?.toUpperCase() || "ADMIN"} // v9.0.2</div>
          <div className="flex gap-4">
            <a href="/" className="hover:text-white transition-colors">[ HOME ]</a>
            <a href="/projects" className="hover:text-white transition-colors">[ ARCHIVE ]</a>
            <a href="/blog" className="hover:text-white transition-colors">[ NETWORK ]</a>
          </div>
        </nav>

        <main className="flex-1 mt-16 p-4 md:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full z-10">
          <PageComponent />
        </main>
        
        <footer className={`border-t ${t.colors.border} p-4 text-xs text-center ${t.colors.textMuted} mt-auto z-10`}>
          CONNECTION SECURE // {new Date().getFullYear()} // EOF
        </footer>
      </div>
    </TemplateProvider>
  );
}

export const contract: TemplateContract = {
  metadata: () => ({
    id: "cyberpunk",
    name: "Cyberpunk",
    version: "1.0",
    author: "System",
    description: "A terminal-inspired HUD interface.",
    thumbnail: "/thumbnails/cyberpunk.png"
  }),
  navigation: () => ({ type: "top", items: [] }),
  layout: () => ({ type: "flow", width: "constrained", spacing: "tight" }),
  theme: () => ({ type: "dark" }),
  animations: () => ({ enabled: true }),
  pages: () => ({
    "/": CyberpunkHome,
    "/projects": CyberpunkProjects,
    "/blog": CyberpunkBlog,
  }),
  components: () => ({}),
  capabilities: () => ["blog", "projects", "experience"],
  validate: () => ({ isHealthy: true, score: 90, missingSections: ["Gallery", "Resume"], missingFeatures: [], l2_diagnostics: {} })
};
