import { useState } from "react";
import { useCmsStore } from "@/store/useCmsStore";
import { LocalJSONAdapter } from "@/lib/storage/localJSONAdapter";
import { Check } from "lucide-react";
import { updateThemeFn } from "@/actions/storage";
import { runPublishPipelineFn } from "@/actions/pipeline";

const TEMPLATES = ['classic', 'minimal', 'bento', 'cyberpunk', 'glass', 'terminal'];

export function WebsiteBuilder() {
  const store = useCmsStore();
  const [previewTheme, setPreviewTheme] = useState(store.theme?.activeTemplate || 'classic');
  const [isSaving, setIsSaving] = useState(false);

  const handlePublish = async () => {
    setIsSaving(true);
    const updatedTheme = { ...store.theme, activeTemplate: previewTheme };
    store.setTheme(updatedTheme);
    
    await updateThemeFn({ data: updatedTheme });
    await runPublishPipelineFn({ data: { changes: [{ type: "theme" }] } });
    setIsSaving(false);
  };

  return (
    <div className="flex h-full w-full bg-background relative overflow-hidden z-10">
      {/* Visual Editor Sidebar */}
      <div className="w-72 shrink-0 border-r border-border bg-background p-4 flex flex-col gap-6 overflow-y-auto shadow-xl z-20">
        <div>
          <h2 className="font-bold mb-1 text-lg">Website Builder</h2>
          <p className="text-xs text-muted-foreground">Live customize your active template.</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Template</h3>
          <div className="flex flex-col gap-1">
            {TEMPLATES.map(t => (
              <button 
                key={t}
                onClick={() => setPreviewTheme(t)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${previewTheme === t ? 'bg-secondary/20 text-secondary font-medium border border-secondary/30' : 'hover:bg-white/5 text-muted-foreground hover:text-white border border-transparent'}`}
              >
                <span className="capitalize">{t}</span>
                {store.theme?.id === t && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">LIVE</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Customization</h3>
          
          <div className="flex flex-col gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
            <h4 className="text-xs font-semibold text-white">Theme Settings</h4>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-muted-foreground">Animations</span>
              <input 
                type="checkbox" 
                checked={store.theme?.settings?.animations !== false}
                onChange={(e) => store.setTheme({ ...store.theme, settings: { ...store.theme?.settings, animations: e.target.checked } })}
                className="w-4 h-4 accent-secondary"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-muted-foreground">Particles (Bg)</span>
              <input 
                type="checkbox" 
                checked={!!store.theme?.settings?.particles}
                onChange={(e) => store.setTheme({ ...store.theme, settings: { ...store.theme?.settings, particles: e.target.checked } })}
                className="w-4 h-4 accent-secondary"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 p-3 bg-black/20 rounded-xl border border-white/5 mt-2">
            <h4 className="text-xs font-semibold text-white">Layout Options</h4>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-muted-foreground">Dark Mode</span>
              <input 
                type="checkbox" 
                checked={store.theme?.settings?.darkMode !== false}
                onChange={(e) => store.setTheme({ ...store.theme, settings: { ...store.theme?.settings, darkMode: e.target.checked } })}
                className="w-4 h-4 accent-secondary"
              />
            </label>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Primary Accent</span>
              <div className="flex gap-2">
                {['#22c55e', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316'].map(color => (
                  <button 
                    key={color}
                    onClick={() => store.setTheme({ ...store.theme, settings: { ...store.theme?.settings, accentColor: color } })}
                    className={`w-6 h-6 rounded-full border-2 ${store.theme?.settings?.accentColor === color ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-3 bg-black/20 rounded-xl border border-white/5 mt-2">
            <h4 className="text-xs font-semibold text-white">Typography</h4>
            <select 
              value={store.theme?.settings?.fontFamily || 'inter'}
              onChange={(e) => store.setTheme({ ...store.theme, settings: { ...store.theme?.settings, fontFamily: e.target.value } })}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="inter">Inter (Modern)</option>
              <option value="playfair">Playfair Display (Serif)</option>
              <option value="fira-code">Fira Code (Mono)</option>
              <option value="outfit">Outfit (Geometric)</option>
            </select>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border">
          <button 
            onClick={handlePublish}
            disabled={isSaving || store.theme?.id === previewTheme}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
          >
            {isSaving ? "Publishing..." : (store.theme?.id === previewTheme ? "Current Theme" : "Publish Theme")}
          </button>
        </div>
      </div>

      {/* Live Preview Pane */}
      <div className="flex-1 bg-zinc-950 p-4 md:p-8 flex items-center justify-center relative overflow-hidden z-0">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="w-full h-full max-w-[1400px] bg-background rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col relative z-10">
          {/* Browser Chrome */}
          <div className="h-10 border-b border-border bg-zinc-900/80 backdrop-blur-md flex items-center px-4 gap-4 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 max-w-md mx-auto bg-black/60 border border-white/5 rounded-md h-6 flex items-center justify-center text-xs text-muted-foreground font-mono truncate px-4">
              localhost:5173/?preview={previewTheme}
            </div>
            <div className="flex gap-2">
              <button className="text-xs text-muted-foreground hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors">Mobile</button>
              <button className="text-xs text-white bg-white/10 px-2 py-1 rounded">Desktop</button>
            </div>
          </div>
          <iframe 
            src={`/?preview=${previewTheme}`} 
            className="w-full flex-1 bg-background"
            title="Live Preview"
          />
        </div>
      </div>
    </div>
  );
}
