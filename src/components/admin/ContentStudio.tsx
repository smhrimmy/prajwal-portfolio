import { useState, useEffect } from "react";
import { ArticleEditor } from "../cms/ArticleEditor";
import { MediaLibrary } from "../cms/MediaLibrary";
import { getArticlesFn, saveArticleFn, deleteArticleFn } from "@/actions/cms";
import { X, Check } from "lucide-react";
import { useCmsStore } from "@/store/useCmsStore";
import { DataCollectionEditor } from "../cms/DataCollectionEditor";
import { updateProjectsFn, updateSkillsFn, updateSiteFn } from "@/actions/storage";

export function ContentStudio() {
  const [activeTab, setActiveTab] = useState("articles");
  const [articles, setArticles] = useState<any[]>([]);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const store = useCmsStore();

  const fetchArticles = async () => {
    const res = await getArticlesFn();
    setArticles(res);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSaveArticle = async (data: any) => {
    await saveArticleFn({ data });
    setEditingArticle(null);
    fetchArticles();
  };

  return (
    <div className="flex h-full w-full">
      <div className="w-48 shrink-0 border-r border-border p-4 flex flex-col gap-2 bg-background/50 z-10">
        <h2 className="font-bold text-muted-foreground text-xs uppercase tracking-wider mb-2">Content</h2>
        <button onClick={() => { setActiveTab("articles"); setEditingArticle(null); }} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'articles' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Articles</button>
        <button onClick={() => setActiveTab("projects")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'projects' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Projects</button>
        <button onClick={() => setActiveTab("skills")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'skills' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Skills</button>
        <button onClick={() => setActiveTab("experience")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'experience' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Experience</button>
        <button onClick={() => setActiveTab("timeline")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'timeline' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Timeline</button>
        <button onClick={() => setActiveTab("media")} className={`text-left px-3 py-2 rounded-lg ${activeTab === 'media' ? 'bg-secondary/20 text-secondary' : 'hover:bg-white/5'}`}>Media</button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-zinc-950 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-background to-background opacity-50 z-0"></div>
        <div className="relative z-10 max-w-5xl mx-auto h-full">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight capitalize">{activeTab} Studio</h2>
          </div>

          {activeTab === 'articles' && (
            <div className="flex flex-col gap-6 h-full">
              {editingArticle ? (
                <div className="flex-1 animate-in slide-in-from-right-4">
                  <ArticleEditor 
                    article={editingArticle} 
                    onSave={handleSaveArticle}
                    onCancel={() => setEditingArticle(null)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Manage your markdown publications.</p>
                    <button 
                      onClick={() => setEditingArticle({ title: '', content_html: '' })}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 text-sm"
                    >
                      + New Article
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articles.map((article: any) => (
                      <div key={article.id} className="glass p-5 rounded-xl flex flex-col gap-3 group hover:border-secondary/30 transition-colors">
                        <h4 className="font-bold line-clamp-1">{article.title}</h4>
                        <div className="text-xs text-muted-foreground font-mono bg-black/20 rounded px-2 py-1 self-start">
                          {article.slug}
                        </div>
                        <div className="flex gap-2 mt-auto pt-4">
                          <button 
                            onClick={() => setEditingArticle(article)}
                            className="text-xs flex-1 bg-white/5 hover:bg-white/10 py-2 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={async () => {
                              await deleteArticleFn({ data: article.id });
                              fetchArticles();
                            }}
                            className="text-xs flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'media' && <MediaLibrary />}
          
          {activeTab === 'projects' && (
            <DataCollectionEditor
              title="Projects"
              items={store.projects}
              schema={[
                { key: 'title', label: 'Title', type: 'text' },
                { key: 'codename', label: 'Codename', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'category', label: 'Category', type: 'text' },
                { key: 'github', label: 'GitHub Link', type: 'text' },
                { key: 'live', label: 'Live Link', type: 'text' },
                { key: 'image', label: 'Image URL', type: 'image' },
                { key: 'accent', label: 'Accent Color', type: 'color' },
                { key: 'tags', label: 'Tags', type: 'list' },
                { key: 'featured', label: 'Featured', type: 'boolean' }
              ]}
              onSave={async (items) => {
                store.setProjects(items);
                await updateProjectsFn({ data: items });
              }}
            />
          )}

          {activeTab === 'skills' && (
            <DataCollectionEditor
              title="Skills"
              items={store.skills}
              schema={[
                { key: 'name', label: 'Skill Name', type: 'text' },
                { key: 'icon', label: 'Icon (URL or class)', type: 'text' },
                { key: 'category', label: 'Category', type: 'text' },
                { key: 'level', label: 'Proficiency (%)', type: 'text' }
              ]}
              onSave={async (items) => {
                store.setSkills(items);
                await updateSkillsFn({ data: items });
              }}
            />
          )}

          {activeTab === 'experience' && (
            <DataCollectionEditor
              title="Experience"
              items={store.site?.experience || []}
              schema={[
                { key: 'role', label: 'Role/Title', type: 'text' },
                { key: 'company', label: 'Company', type: 'text' },
                { key: 'duration', label: 'Duration', type: 'text' },
                { key: 'location', label: 'Location', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'achievements', label: 'Key Achievements (comma separated)', type: 'list' }
              ]}
              onSave={async (items) => {
                const newSite = { ...store.site, experience: items };
                store.setSite(newSite);
                await updateSiteFn({ data: newSite });
              }}
            />
          )}

          {activeTab === 'timeline' && (
            <DataCollectionEditor
              title="Timeline"
              items={store.site?.timeline || []}
              schema={[
                { key: 'year', label: 'Year', type: 'text' },
                { key: 'title', label: 'Event Title', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' }
              ]}
              onSave={async (items) => {
                const newSite = { ...store.site, timeline: items };
                store.setSite(newSite);
                await updateSiteFn({ data: newSite });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
