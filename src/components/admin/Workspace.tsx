import { useCmsStore } from "@/store/useCmsStore";
import { Play } from "lucide-react";

export function Workspace() {
  const store = useCmsStore();
  
  return (
    <div className="flex flex-col gap-8 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Good Evening, Prajwal</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-xl flex flex-col gap-2">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-bold">Content</span>
          <span className="text-2xl font-bold">{store.projects?.length || 0} Projects</span>
        </div>
        <div className="glass p-6 rounded-xl flex flex-col gap-2">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-bold">Skills</span>
          <span className="text-2xl font-bold">{store.skills?.length || 0} Listed</span>
        </div>
        <div className="glass p-6 rounded-xl flex flex-col gap-2">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-bold">Template</span>
          <span className="text-2xl font-bold capitalize">{store.theme?.activeTemplate || 'Classic'}</span>
        </div>
        <div className="glass p-6 rounded-xl flex flex-col gap-2">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-bold">Health</span>
          <span className="text-2xl font-bold text-green-500">100% OK</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>Timeline Events</span>
              <span className="text-white font-mono">{store.site?.timeline?.length || 0}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 py-2">
              <span>Experience Roles</span>
              <span className="text-white font-mono">{store.site?.experience?.length || 0}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span>Active Features</span>
              <span className="text-white font-mono">{Object.keys(store.theme?.settings || {}).length}</span>
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Site URL</h2>
          <div className="text-sm text-muted-foreground mb-4">
            Your portfolio is live at:
          </div>
          <a href="/" target="_blank" className="text-primary hover:underline font-mono bg-primary/10 px-4 py-2 rounded-lg break-all">
            prajwal.dev
          </a>
        </div>
      </div>
    </div>
  );
}
