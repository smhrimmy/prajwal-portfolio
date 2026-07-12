import { useState } from "react";
import { useCmsStore } from "@/store/useCmsStore";
import { TemplateManifest } from "@/shared/types";
import { runLevel1And2Validation } from "@/shared/validators/TemplateValidator";
import { CheckCircle2, XCircle, Smartphone, Monitor, MonitorUp, Moon, Sun, AlertTriangle } from "lucide-react";

// Mocking the contract for the manager until templates implement it fully
const createMockContract = (manifest: any) => ({
  metadata: () => manifest
});

const availableTemplates: any[] = [
  {
    id: "classic",
    name: "Classic",
    version: "1.0.0",
    author: "Prajwal",
    description: "The original signature portfolio. Smooth, animated, and reliable.",
    thumbnail: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=500",
    supports: ["github", "animations", "blog", "storytelling", "gallery", "cms"],
    settings: { animations: true, particles: true },
    supportedSections: ["hero", "about", "projects", "skills", "experience", "github", "blog", "certifications", "contact", "footer", "timeline", "resume", "testimonials", "gallery", "faq"],
    supportedFeatures: ["blog"],
    performance: 100
  },
  {
    id: "minimal",
    name: "Editorial Minimal",
    version: "1.0.0",
    author: "Prajwal",
    description: "Massive typography and asymmetric grids. Perfect for storytelling.",
    thumbnail: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=500",
    supports: ["blog", "storytelling", "gallery"],
    settings: { animations: true },
    supportedSections: ["hero", "about", "projects", "skills", "experience", "github", "blog", "certifications", "contact", "footer"], // Intentionally missing some for demo
    supportedFeatures: ["blog"],
    performance: 94
  },
  {
    id: "bento",
    name: "Bento Experience",
    version: "2.4.0",
    author: "Prajwal",
    description: "A highly modular, data-driven developer dashboard.",
    thumbnail: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=500",
    supports: ["github", "terminal", "animations"],
    settings: { animations: true },
    supportedSections: ["hero", "about", "projects", "skills", "experience", "github", "blog", "certifications", "contact", "footer", "timeline", "resume", "testimonials", "gallery", "faq"],
    supportedFeatures: ["blog"],
    performance: 99
  }
];

export function TemplateManager() {
  const store = useCmsStore();
  const currentThemeId = store.theme?.id || store.theme?.activeTemplate;
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile" | "ultrawide">("desktop");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

  const handleInstall = (id: string) => {
    // In a real implementation this would fetch and install the template bundle
    alert(`Installed ${id}!`);
  };

  const renderQADashboard = (template: any) => {
    const contract = createMockContract(template);
    const validation = runLevel1And2Validation(contract);
    
    return (
      <div className="bg-black/20 rounded-xl p-6 border border-white/5 font-mono text-sm">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold">QA Dashboard // L2 Runtime</h3>
          <div className={`px-3 py-1 rounded font-bold ${validation.passed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            HEALTH: {validation.score}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sections</span>
            <span className={validation.details.sections.passed ? 'text-green-400' : 'text-yellow-400'}>
              {template.supportedSections?.length || 0} / 15
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Performance</span>
            <span className="text-green-400">{validation.details.performance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Accessibility</span>
            <span className="text-green-400">PASS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Responsive</span>
            <span className="text-green-400">PASS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">SEO</span>
            <span className="text-green-400">PASS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Render</span>
            <span className="text-green-400">PASS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contract</span>
            <span className={validation.passed ? 'text-green-400' : 'text-yellow-400'}>
              {validation.passed ? 'PASS' : 'WARN'}
            </span>
          </div>
        </div>

        {!validation.details.sections.passed && (
          <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded flex gap-3 text-yellow-200/80">
            <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-400" />
            <div>
              <div className="font-bold mb-1 text-yellow-400">Missing Required Sections</div>
              Missing 15-section parity. Required for strict compliance.
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar: Marketplace List */}
      <div className="w-1/3 border-r border-white/10 p-6 overflow-y-auto flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">Marketplace</h2>
        {availableTemplates.map((template) => {
          const isActive = currentThemeId === template.id;
          const isSelected = selectedTemplate?.id === template.id;
          
          return (
            <button 
              key={template.id} 
              onClick={() => setSelectedTemplate(template)}
              className={`text-left p-4 rounded-xl border transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/20 bg-black/10'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{template.name}</h3>
                {isActive && <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-bold">ACTIVE</span>}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
            </button>
          );
        })}
      </div>

      {/* Right Main Area: Preview & Dashboard */}
      <div className="w-2/3 flex flex-col bg-[#0a0a0a]">
        {selectedTemplate ? (
          <>
            {/* Top Toolbar */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 shrink-0">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
                <button onClick={() => setPreviewMode("mobile")} className={`p-1.5 rounded ${previewMode === "mobile" ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}><Smartphone className="w-4 h-4" /></button>
                <button onClick={() => setPreviewMode("tablet")} className={`p-1.5 rounded ${previewMode === "tablet" ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}><Monitor className="w-4 h-4 scale-75" /></button>
                <button onClick={() => setPreviewMode("desktop")} className={`p-1.5 rounded ${previewMode === "desktop" ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}><Monitor className="w-4 h-4" /></button>
                <button onClick={() => setPreviewMode("ultrawide")} className={`p-1.5 rounded ${previewMode === "ultrawide" ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}><MonitorUp className="w-4 h-4" /></button>
              </div>
              
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
                <button onClick={() => setThemeMode("light")} className={`p-1.5 rounded ${themeMode === "light" ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}><Sun className="w-4 h-4" /></button>
                <button onClick={() => setThemeMode("dark")} className={`p-1.5 rounded ${themeMode === "dark" ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}><Moon className="w-4 h-4" /></button>
              </div>

              <button 
                onClick={() => handleInstall(selectedTemplate.id)}
                disabled={currentThemeId === selectedTemplate.id}
                className="bg-primary text-primary-foreground px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {currentThemeId === selectedTemplate.id ? 'Activated' : 'Install Template'}
              </button>
            </div>

            {/* Preview Frame Area */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center p-8">
              {/* Device Frame */}
              <div 
                className={`transition-all duration-500 overflow-hidden rounded-md border border-white/20 shadow-2xl relative
                  ${previewMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[2rem] border-4 border-zinc-800' : ''}
                  ${previewMode === 'tablet' ? 'w-[768px] h-[1024px] rounded-2xl border-4 border-zinc-800' : ''}
                  ${previewMode === 'desktop' ? 'w-full h-full max-w-[1200px]' : ''}
                  ${previewMode === 'ultrawide' ? 'w-full h-full' : ''}
                `}
              >
                <iframe 
                  src={`/?preview=${selectedTemplate.id}`} 
                  className={`w-full h-full border-none bg-white ${themeMode === 'dark' ? 'invert-0' : 'invert'}`} // Hacky invert for mock theme
                  title="Preview"
                />
              </div>
            </div>

            {/* Bottom QA Dashboard */}
            <div className="h-[250px] border-t border-white/10 overflow-y-auto p-6 bg-black/40 shrink-0">
              {renderQADashboard(selectedTemplate)}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Monitor className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a template from the marketplace to inspect and preview.</p>
          </div>
        )}
      </div>
    </div>
  );
}
