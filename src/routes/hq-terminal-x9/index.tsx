import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { login, checkAuth } from "../../actions/auth";
import { useCmsStore } from "../../store/useCmsStore";
import { LocalJSONAdapter } from "../../lib/storage/localJSONAdapter";

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
  const [activeTab, setActiveTab] = useState("overview");

  const store = useCmsStore();
  const storage = new LocalJSONAdapter();

  useEffect(() => {
    if (isAuth) {
      storage.getSite().then(store.setSite);
      storage.getTheme().then(store.setTheme);
      storage.getProjects().then(store.setProjects);
      storage.getSkills().then(store.setSkills);
    }
  }, [isAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login({ data: password });
    if (res.success) {
      setIsAuth(true);
    } else {
      setPassword("");
      setShowLogin(false);
    }
  };

  const handleSave = async () => {
    await storage.updateSite(store.site);
    await storage.saveTheme(store.theme);
    await storage.updateProjects(store.projects);
    await storage.updateSkills(store.skills);
    store.createSnapshot("Saved site config");
    alert("Saved successfully!");
  };

  if (!isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        {!showLogin ? (
          <div 
            className="text-muted-foreground text-sm font-mono cursor-default select-none"
            onDoubleClick={() => setShowLogin(true)}
          >
            404 Not Found
          </div>
        ) : (
          <form onSubmit={handleLogin} className="glass p-8 rounded-2xl max-w-sm w-full flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
            <h1 className="text-2xl font-bold">Terminal Access</h1>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg bg-background/50 border border-white/10 px-4 py-2 outline-none focus:ring-1 focus:ring-secondary/50"
              placeholder="Enter Access Key"
              autoFocus
            />
            <button type="submit" className="bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90">
              Authenticate
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r border-border glass-strong flex flex-col">
        <div className="p-4 font-bold border-b border-border">CMS Dashboard</div>
        <div className="flex-1 flex flex-col gap-1 p-4">
          <button onClick={() => setActiveTab("overview")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'overview' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Site Overview</button>
          <button onClick={() => setActiveTab("projects")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'projects' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Projects</button>
          <button onClick={() => setActiveTab("skills")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'skills' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Skills</button>
          <button onClick={() => setActiveTab("theme")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'theme' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Theme Builder</button>
          <button onClick={() => setActiveTab("snapshots")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'snapshots' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>History (Snapshots)</button>
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={handleSave} className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90">
            Save Changes
          </button>
        </div>
      </div>

      {/* Editor Pane */}
      <div className="flex-1 border-r border-border flex flex-col bg-background/50 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab}</h2>
          
          {activeTab === "overview" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Name</label>
                <input 
                  value={store.site.name || ""} 
                  onChange={e => store.setSite({ ...store.site, name: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">GitHub Username</label>
                <input 
                  value={store.site.github_username || ""} 
                  onChange={e => store.setSite({ ...store.site, github_username: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Role</label>
                <input 
                  value={store.site.role || ""} 
                  onChange={e => store.setSite({ ...store.site, role: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Bio</label>
                <textarea 
                  value={store.site.bio || ""} 
                  onChange={e => store.setSite({ ...store.site, bio: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none h-32" 
                />
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => store.setProjects([{ title: "New Project", description: "", link: "", tech: [], image: "" }, ...store.projects])}
                className="bg-secondary/20 text-secondary px-4 py-2 rounded-lg w-fit"
              >
                + Add Project
              </button>
              {store.projects.map((proj, i) => (
                <div key={i} className="glass p-4 rounded-lg flex flex-col gap-3">
                  <input 
                    value={proj.title} 
                    onChange={e => {
                      const newP = [...store.projects];
                      newP[i].title = e.target.value;
                      store.setProjects(newP);
                    }}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none font-bold" 
                    placeholder="Project Title"
                  />
                  <textarea 
                    value={proj.description} 
                    onChange={e => {
                      const newP = [...store.projects];
                      newP[i].description = e.target.value;
                      store.setProjects(newP);
                    }}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none h-20" 
                    placeholder="Description"
                  />
                  <input 
                    value={proj.image || ""} 
                    onChange={e => {
                      const newP = [...store.projects];
                      newP[i].image = e.target.value;
                      store.setProjects(newP);
                    }}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                    placeholder="Image URL (e.g. https://example.com/img.png)"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">ID: {i}</span>
                    <button 
                      onClick={() => store.setProjects(store.projects.filter((_, idx) => idx !== i))}
                      className="text-xs bg-destructive text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "skills" && (
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => store.setSkills([{ category: "New Category", items: [] }, ...store.skills])}
                className="bg-secondary/20 text-secondary px-4 py-2 rounded-lg w-fit"
              >
                + Add Skill Category
              </button>
              {store.skills.map((skill, i) => (
                <div key={i} className="glass p-4 rounded-lg flex flex-col gap-3">
                  <input 
                    value={skill.category} 
                    onChange={e => {
                      const newS = [...store.skills];
                      newS[i].category = e.target.value;
                      store.setSkills(newS);
                    }}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none font-bold" 
                    placeholder="Category Name"
                  />
                  <input 
                    value={(skill.items || []).join(", ")} 
                    onChange={e => {
                      const newS = [...store.skills];
                      newS[i].items = e.target.value.split(",").map((s: string) => s.trim());
                      store.setSkills(newS);
                    }}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                    placeholder="Comma separated skills (e.g. React, Node.js)"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">ID: {i}</span>
                    <button 
                      onClick={() => store.setSkills(store.skills.filter((_, idx) => idx !== i))}
                      className="text-xs bg-destructive text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "theme" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Accent Color</label>
                <input 
                  type="color"
                  value={store.theme.accentColor || "#06b6d4"} 
                  onChange={e => store.setTheme({ ...store.theme, accentColor: e.target.value })}
                  className="w-full h-10 cursor-pointer rounded-md outline-none" 
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Glass Opacity (0.0 to 1.0)</label>
                <input 
                  type="number"
                  step="0.05"
                  value={store.theme.glassOpacity || 0.15} 
                  onChange={e => store.setTheme({ ...store.theme, glassOpacity: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Border Radius</label>
                <input 
                  value={store.theme.borderRadius || "0.75rem"} 
                  onChange={e => store.setTheme({ ...store.theme, borderRadius: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                />
              </div>
            </div>
          )}

          {activeTab === "snapshots" && (
            <div className="flex flex-col gap-4">
              {store.snapshots.length === 0 && <p className="text-muted-foreground">No snapshots yet. Save changes to create one.</p>}
              {store.snapshots.map(s => (
                <div key={s.id} className="glass p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-bold">{s.message}</div>
                    <div className="text-xs text-muted-foreground">{new Date(s.timestamp).toLocaleTimeString()}</div>
                  </div>
                  <button onClick={() => store.restoreSnapshot(s.id)} className="text-xs px-3 py-1 bg-secondary/20 text-secondary rounded">Restore</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Preview Pane */}
      <div className="flex-1 bg-white relative">
        <div className="absolute top-0 left-0 bg-muted/80 text-xs px-2 py-1 text-foreground border border-border z-50 rounded-br-lg">Live Preview</div>
        <iframe src="/" className="w-full h-full border-none pointer-events-auto" />
      </div>
    </div>
  );
}
