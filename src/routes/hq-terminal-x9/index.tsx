import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { login, checkAuth } from "../../actions/auth";
import { useCmsStore } from "../../store/useCmsStore";
import { LocalJSONAdapter } from "../../lib/storage/localJSONAdapter";
import { getSiteFn, getThemeFn, getProjectsFn, getSkillsFn } from "../../actions/storage";
// Import new OS Modules
import { Workspace } from "../../components/admin/Workspace";
import { ContentStudio } from "../../components/admin/ContentStudio";
import { WebsiteBuilder } from "../../components/admin/WebsiteBuilder";
import { ThemeMarketplace } from "../../components/admin/ThemeMarketplace";
import { AIStudio } from "../../components/admin/AIStudio";
import { DiagnosticsHub } from "../../components/admin/DiagnosticsHub";
import { DeploymentPipeline } from "../../components/admin/DeploymentPipeline";

// Icons
import { LayoutDashboard, PenTool, LayoutTemplate, Sparkles, Activity, Package, Settings, Menu, X, Play } from "lucide-react";

export const Route = createFileRoute("/hq-terminal-x9/")({
  component: AdminDashboard,
  loader: async () => {
    return await checkAuth();
  },
});

function AdminDashboard() {
  const { authenticated } = Route.useLoaderData();
  const [isAuth, setIsAuth] = useState(authenticated);
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState("workspace");
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const store = useCmsStore();

  useEffect(() => {
    if (isAuth) {
      getSiteFn().then(store.setSite);
      getThemeFn().then(store.setTheme);
      getProjectsFn().then(store.setProjects);
      getSkillsFn().then(store.setSkills);
    }
  }, [isAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login({ data: password });
    if (res.success) setIsAuth(true);
    else { setPassword(""); setShowLogin(false); }
  };

  if (!isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        {!showLogin ? (
          <div className="text-muted-foreground text-sm font-mono cursor-default select-none" onDoubleClick={() => setShowLogin(true)}>
            404 Not Found
          </div>
        ) : (
          <form onSubmit={handleLogin} className="glass p-8 rounded-2xl max-w-sm w-full flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
            <h1 className="text-2xl font-bold">Terminal Access</h1>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg bg-background/50 border border-white/10 px-4 py-2 outline-none focus:ring-1 focus:ring-secondary/50" placeholder="Enter Access Key" autoFocus />
            <button type="submit" className="bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90">Authenticate</button>
          </form>
        )}
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "workspace": return <Workspace />;
      case "content": return <ContentStudio />;
      case "builder": return <WebsiteBuilder />;
      case "marketplace": return <ThemeMarketplace />;
      case "ai": return <AIStudio />;
      case "diagnostics": return <DiagnosticsHub />;
      case "deployment": return <DeploymentPipeline />;
      default: return <Workspace />;
    }
  };

  const navItems = [
    { id: "workspace", label: "Workspace", icon: <LayoutDashboard className="w-5 h-5" />, mobileLabel: "🏠 Workspace" },
    { id: "content", label: "Content", icon: <PenTool className="w-5 h-5" />, mobileLabel: "📝 Content" },
    { id: "builder", label: "Builder", icon: <LayoutTemplate className="w-5 h-5" />, mobileLabel: "🎨 Builder" },
    { id: "ai", label: "AI Studio", icon: <Sparkles className="w-5 h-5" />, mobileLabel: "🤖 AI" },
  ];

  const moreItems = [
    { id: "marketplace", label: "Theme Marketplace", icon: <Package className="w-5 h-5" /> },
    { id: "diagnostics", label: "Diagnostics", icon: <Activity className="w-5 h-5" /> },
    { id: "deployment", label: "Deployment", icon: <Play className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:flex w-64 border-r border-border glass-strong flex-col shrink-0 z-20">
        <div className="p-4 font-bold border-b border-border text-lg tracking-tight">Portfolio OS</div>
        <div className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 mt-2">Core</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === item.id ? 'bg-secondary/20 text-secondary font-medium' : 'hover:bg-white/5 text-muted-foreground hover:text-white'}`}>
              {item.icon} {item.label}
            </button>
          ))}

          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 mt-6">Platform</div>
          {moreItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === item.id ? 'bg-secondary/20 text-secondary font-medium' : 'hover:bg-white/5 text-muted-foreground hover:text-white'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0 relative z-10">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-strong border-t border-border z-50 flex items-center justify-around px-2 pb-safe">
        {navItems.map(item => (
          <button key={item.id} onClick={() => { setActiveTab(item.id); setShowMoreDrawer(false); }} className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${activeTab === item.id ? 'text-secondary' : 'text-muted-foreground'}`}>
            <span className="text-xl mb-1">{item.mobileLabel.split(' ')[0]}</span>
            <span className="text-[10px] font-medium">{item.mobileLabel.split(' ')[1]}</span>
          </button>
        ))}
        <button onClick={() => setShowMoreDrawer(!showMoreDrawer)} className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${showMoreDrawer ? 'text-secondary' : 'text-muted-foreground'}`}>
          <span className="text-xl mb-1">⚙</span>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>

      {/* Mobile "More" Drawer */}
      {showMoreDrawer && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setShowMoreDrawer(false)}>
          <div className="absolute bottom-16 left-0 right-0 glass-strong border-t border-border p-4 rounded-t-2xl flex flex-col gap-2" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-muted-foreground uppercase text-xs tracking-wider mb-2 px-2">Platform Options</h3>
            {moreItems.map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setShowMoreDrawer(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === item.id ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>
                {item.icon} <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
