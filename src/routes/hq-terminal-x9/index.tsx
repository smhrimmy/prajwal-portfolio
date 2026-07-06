import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { login, checkAuth } from "../../actions/auth";
import { useCmsStore } from "../../store/useCmsStore";
import { LocalJSONAdapter } from "../../lib/storage/localJSONAdapter";
import { getArticlesFn, saveArticleFn, deleteArticleFn } from "../../actions/cms";
import { runPublishPipelineFn, getPublishStatusFn } from "../../actions/pipeline";
import { ArticleEditor } from "../../components/cms/ArticleEditor";
import { MediaLibrary } from "../../components/cms/MediaLibrary";
import * as pkg from "react-resizable-panels";
const PanelGroup = pkg.PanelGroup || (pkg as any).default?.PanelGroup;
const Panel = pkg.Panel || (pkg as any).default?.Panel;
const PanelResizeHandle = pkg.PanelResizeHandle || (pkg as any).default?.PanelResizeHandle;
import { Check, X, Loader2, Play } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("articles");
  const [articles, setArticles] = useState<any[]>([]);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  
  // Build Center state
  const [buildSession, setBuildSession] = useState<any>(null);

  const store = useCmsStore();
  const storage = new LocalJSONAdapter();

  const fetchArticles = async () => {
    const res = await getArticlesFn();
    setArticles(res);
  };

  useEffect(() => {
    if (isAuth) {
      storage.getSite().then(store.setSite);
      storage.getTheme().then(store.setTheme);
      storage.getProjects().then(store.setProjects);
      storage.getSkills().then(store.setSkills);
      fetchArticles();
    }
  }, [isAuth]);

  // Poll build status when on build center or when a build is running
  useEffect(() => {
    if (!isAuth) return;
    const interval = setInterval(async () => {
      const status = await getPublishStatusFn();
      if (status) setBuildSession(status);
    }, 1000);
    return () => clearInterval(interval);
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

  const handleSaveAndPublish = async () => {
    // 1. Save data to Supabase (Content Layer)
    await storage.updateSite(store.site);
    await storage.saveTheme(store.theme);
    await storage.updateProjects(store.projects);
    await storage.updateSkills(store.skills);
    store.createSnapshot("Saved site config");
    
    // 2. Trigger Generation Pipeline in background
    await runPublishPipelineFn({ data: { changes: [{ type: 'all' }] } });
    setActiveTab("build"); // Switch to build center to show progress
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
      <div className="w-64 border-r border-border glass-strong flex flex-col shrink-0">
        <div className="p-4 font-bold border-b border-border flex justify-between items-center">
          <span>CMS Dashboard</span>
          {buildSession?.status === 'running' && <Loader2 className="w-4 h-4 animate-spin text-secondary" />}
        </div>
        <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-2">Publishing</div>
          <button onClick={() => setActiveTab("articles")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'articles' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Articles & Drafts</button>
          <button onClick={() => setActiveTab("categories")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'categories' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Categories</button>
          <button onClick={() => setActiveTab("media")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'media' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Media Library</button>
          
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Portfolio</div>
          <button onClick={() => setActiveTab("overview")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'overview' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Site Overview</button>
          <button onClick={() => setActiveTab("projects")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'projects' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Projects</button>
          <button onClick={() => setActiveTab("skills")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'skills' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Skills</button>
          <button onClick={() => setActiveTab("theme")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'theme' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Theme Builder</button>
          
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-4">System</div>
          <button onClick={() => setActiveTab("build")} className={`flex justify-between items-center px-3 py-2 rounded-lg ${activeTab === 'build' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>
            <span>Build Center</span>
            {buildSession?.status === 'running' && <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>}
          </button>
          <button onClick={() => setActiveTab("snapshots")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'snapshots' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Revisions</button>
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={handleSaveAndPublish} className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90">
            <Play className="w-4 h-4 fill-current" /> Save & Publish
          </button>
        </div>
      </div>

      <div className="flex flex-1 w-full relative">
        {/* Editor Pane */}
        <div className="flex-1 min-w-[30%] max-w-[70%] flex flex-col bg-background/50 overflow-y-auto border-r border-border/50 resize-x">
          <div className="p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab === 'build' ? 'Build Center & Job Queue' : activeTab}</h2>
            
            {activeTab === "overview" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Name</label>
                  <input 
                    value={store.site?.name || ""} 
                    onChange={e => store.setSite({ ...store.site, name: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">GitHub Username</label>
                  <input 
                    value={store.site?.github_username || ""} 
                    onChange={e => store.setSite({ ...store.site, github_username: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Role</label>
                  <input 
                    value={store.site?.role || ""} 
                    onChange={e => store.setSite({ ...store.site, role: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Bio</label>
                  <textarea 
                    value={store.site?.bio || ""} 
                    onChange={e => store.setSite({ ...store.site, bio: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none h-32" 
                  />
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => store.setProjects([{ title: "New Project", description: "", link: "", tech: [], image: "" }, ...(store.projects || [])])}
                  className="bg-secondary/20 text-secondary px-4 py-2 rounded-lg w-fit"
                >
                  + Add Project
                </button>
                {(store.projects || []).map((proj, i) => (
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
                  onClick={() => store.setSkills([{ category: "New Category", items: [] }, ...(store.skills || [])])}
                  className="bg-secondary/20 text-secondary px-4 py-2 rounded-lg w-fit"
                >
                  + Add Skill Category
                </button>
                {(store.skills || []).map((skill, i) => (
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
                    value={store.theme?.accentColor || "#06b6d4"} 
                    onChange={e => store.setTheme({ ...store.theme, accentColor: e.target.value })}
                    className="w-full h-10 cursor-pointer rounded-md outline-none" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Glass Opacity (0.0 to 1.0)</label>
                  <input 
                    type="number"
                    step="0.05"
                    value={store.theme?.glassOpacity || 0.15} 
                    onChange={e => store.setTheme({ ...store.theme, glassOpacity: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Border Radius</label>
                  <input 
                    value={store.theme?.borderRadius || "0.75rem"} 
                    onChange={e => store.setTheme({ ...store.theme, borderRadius: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 outline-none" 
                  />
                </div>
              </div>
            )}

            {activeTab === "snapshots" && (
              <div className="flex flex-col gap-4">
                {(store.snapshots || []).length === 0 && <p className="text-muted-foreground">No snapshots yet. Save changes to create one.</p>}
                {(store.snapshots || []).map(s => (
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

            {activeTab === "build" && (
              <div className="flex flex-col gap-4">
                {!buildSession ? (
                  <div className="glass p-8 text-center text-muted-foreground rounded-lg border border-dashed border-border">
                    <p>No builds in progress.</p>
                    <p className="text-xs mt-2">Click "Save & Publish" to trigger the generation pipeline.</p>
                  </div>
                ) : (
                  <div className="glass p-6 rounded-lg flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                      <div>
                        <h3 className="font-bold text-lg">Release #{buildSession.id.slice(-6)}</h3>
                        <p className="text-xs text-muted-foreground">Started at {new Date(buildSession.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        buildSession.status === 'success' ? 'bg-success/20 text-success' :
                        buildSession.status === 'failed' ? 'bg-destructive/20 text-destructive' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {buildSession.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {buildSession.jobs.map((job: any) => (
                        <div key={job.id} className="flex flex-col gap-1">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              {job.status === 'success' && <Check className="w-4 h-4 text-success" />}
                              {job.status === 'error' && <X className="w-4 h-4 text-destructive" />}
                              {job.status === 'running' && <Loader2 className="w-4 h-4 text-secondary animate-spin" />}
                              {job.status === 'pending' && <div className="w-4 h-4 rounded-full border border-border" />}
                              {job.name}
                            </span>
                            <span className="text-xs text-muted-foreground">{job.message}</span>
                          </div>
                          {job.status === 'running' && (
                            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-secondary transition-all duration-300" style={{ width: `${job.progress}%` }} />
                            </div>
                          )}
                          {job.error && (
                            <div className="text-xs text-destructive bg-destructive/10 p-2 rounded mt-1">
                              {job.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "articles" && (
              <div className="flex flex-col gap-4 h-full">
                {editingArticle ? (
                  <ArticleEditor 
                    article={editingArticle} 
                    onSave={async (data) => {
                      await saveArticleFn({ data });
                      setEditingArticle(null);
                      fetchArticles();
                    }}
                    onCancel={() => setEditingArticle(null)}
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-muted-foreground">Manage your blog articles.</p>
                      <button 
                        onClick={() => setEditingArticle({ title: "", status: "draft" })} 
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
                      >
                        Write New Article
                      </button>
                    </div>
                    <div className="grid gap-4">
                      {articles.map((article: any) => (
                        <div key={article.id || article.slug} className="glass p-4 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-bold">{article.title}</div>
                            <div className="text-xs text-muted-foreground">{article.status} • {new Date(article.created_at || Date.now()).toLocaleDateString()}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingArticle(article)} className="text-xs px-3 py-1 bg-secondary/20 text-secondary rounded hover:bg-secondary/30">Edit</button>
                            <button onClick={async () => {
                              if(confirm("Delete article?")) {
                                await deleteArticleFn({ data: article.id });
                                fetchArticles();
                              }
                            }} className="text-xs px-3 py-1 bg-destructive/20 text-destructive rounded hover:bg-destructive/30">Delete</button>
                          </div>
                        </div>
                      ))}
                      {articles.length === 0 && (
                        <div className="glass p-8 text-center text-muted-foreground rounded-lg border border-dashed border-border">
                          No articles found. Start writing!
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "categories" && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">Manage article categories and tags.</p>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium">+ Add Category</button>
                </div>
                <div className="glass p-8 text-center text-muted-foreground rounded-lg border border-dashed border-border">
                  Categories Manager coming soon.
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="h-full">
                <MediaLibrary />
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
    </div>
  );
}
