import { useCmsStore } from "@/store/useCmsStore";
import { LocalJSONAdapter } from "@/lib/storage/localJSONAdapter";

const TEMPLATES = [
  { id: 'classic', name: 'Classic' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'bento', name: 'Bento' },
  { id: 'cyberpunk', name: 'Cyberpunk' },
  { id: 'glass', name: 'Glass OS' },
  { id: 'terminal', name: 'Terminal IDE' },
];

export function ThemeMarketplace() {
  const store = useCmsStore();

  const handleActivate = async (themeId: string) => {
    const storage = new LocalJSONAdapter();
    const updatedTheme = { ...store.theme, activeTemplate: themeId, id: themeId };
    store.setTheme(updatedTheme);
    await storage.saveTheme(updatedTheme);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Theme Marketplace</h1>
        <p className="text-muted-foreground">Discover, preview, and activate new themes for your Portfolio OS.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((theme) => {
          const isActive = store.theme?.id === theme.id;
          return (
            <div key={theme.id} className={`glass rounded-xl overflow-hidden group flex flex-col border ${isActive ? 'border-secondary/50' : 'border-transparent'}`}>
              <div className="aspect-video bg-zinc-900 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="text-lg font-bold font-mono text-white/50">{theme.name}</span>
                {isActive && (
                  <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded">
                    ACTIVE
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-lg">{theme.name} Template</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4 flex-1">High performance theme with 100% feature parity.</p>
                <div className="flex gap-2 mt-auto">
                  <a href={`/?preview=${theme.id}`} target="_blank" rel="noreferrer" className="flex-1 bg-white/10 hover:bg-white/20 text-sm py-2 rounded-lg font-medium transition-colors text-center">
                    Preview
                  </a>
                  <button 
                    onClick={() => handleActivate(theme.id)}
                    disabled={isActive}
                    className="flex-1 bg-secondary text-secondary-foreground text-sm py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isActive ? 'Activated' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
