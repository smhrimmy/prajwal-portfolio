import { useState } from "react";
import { PortfolioData } from "../../shared/types";
import { TemplateProvider } from "../../shared/TemplateContext";
import { terminalTokens as t } from "./tokens";
import { TerminalLayout } from "./components/TerminalLayout";

import { TemplateContract } from "@/shared/contracts/TemplateContract";

function TerminalHome() {
  return <TerminalLayout initialCommand="whoami" />;
}

function TerminalProjects() {
  return <TerminalLayout initialCommand="projects --all" />;
}

function TerminalBlog() {
  return <TerminalLayout initialCommand="blog --all" />;
}

export default function TerminalTemplate({ data, route = "/" }: { data: PortfolioData; route?: string }) {
  const PageComponent = contract.pages()[route] || TerminalHome;

  return (
    <TemplateProvider data={data}>
      <div className={`min-h-screen ${t.colors.bg} ${t.colors.text} ${t.typography.mono} selection:bg-white/20 relative overflow-hidden flex flex-col`}>
        {/* Top bar mimicking a window or IDE header */}
        <header className={`h-8 w-full ${t.colors.surface} ${t.colors.border} border-b flex items-center px-4 justify-between shrink-0`}>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className={`${t.colors.textMuted} text-xs flex gap-4`}>
            <span>prajwal@dev-server: ~{route === '/' ? '' : route}</span>
            <div className="flex gap-4">
              <a href="/" className="hover:text-white transition-colors">home</a>
              <a href="/projects" className="hover:text-white transition-colors">projects</a>
              <a href="/blog" className="hover:text-white transition-colors">blog</a>
            </div>
          </div>
          <div />
        </header>

        {/* Main Terminal Window */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <PageComponent />
        </main>
      </div>
    </TemplateProvider>
  );
}

export const contract: TemplateContract = {
  metadata: () => ({
    id: "terminal",
    name: "Terminal IDE",
    version: "1.0",
    author: "System",
    description: "A developer-focused command line interface.",
    thumbnail: "/thumbnails/terminal.png"
  }),
  navigation: () => ({ type: "top", items: [] }),
  layout: () => ({ type: "flow", width: "full", spacing: "tight" }),
  theme: () => ({ type: "dark" }),
  animations: () => ({ enabled: false }),
  pages: () => ({
    "/": TerminalHome,
    "/projects": TerminalProjects,
    "/blog": TerminalBlog,
  }),
  components: () => ({}),
  capabilities: () => ["blog", "projects", "experience"],
  validate: () => ({ isHealthy: true, score: 90, missingSections: ["Gallery", "Resume", "Timeline"], missingFeatures: [], l2_diagnostics: {} })
};
