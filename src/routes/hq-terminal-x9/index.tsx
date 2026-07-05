import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { generateArticleFn } from "../../actions/ai";
import { saveBlog } from "../../actions/blog";
import { login, checkAuth } from "../../actions/auth";
import { Loader } from "../../components/onboarding/Loader";

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
  
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(password);
    if (res.success) {
      setIsAuth(true);
    } else {
      setPassword(""); // clear password on fail
      setShowLogin(false); // hide form again
    }
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setStatus("Generating AI Content & Cover Image (this takes ~30 seconds)...");
    
    const aiRes = await generateArticleFn(topic);
    if (!aiRes.success) {
      setStatus("Error: " + aiRes.error);
      setLoading(false);
      return;
    }

    setStatus("Saving to Supabase Database...");
    
    const meta = aiRes.meta as any;
    
    const saveRes = await saveBlog({
      title: meta?.seo_title || topic,
      slug: meta?.slug || topic.toLowerCase().replace(/\s+/g, '-'),
      content: aiRes.content,
      excerpt: meta?.excerpt || "",
      category: meta?.category || "AI",
      seo_title: meta?.seo_title || topic,
      meta_description: meta?.meta_description || "",
      json_ld: meta?.json_ld || {},
      read_time: meta?.read_time || "5 min",
      image_url: aiRes.image_url,
      status: "draft" // Save as draft so admin can preview before publishing
    });

    if (saveRes.success) {
      setStatus("Successfully generated and saved as Draft in Supabase!");
    } else {
      setStatus("Error saving to database: " + saveRes.error);
    }
    setLoading(false);
  };

  if (!isAuth) {
    // Stealth mode: looks like a blank/404 page until you double click the text
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
            <button type="submit" className="bg-primary text-primary-foreground py-2 rounded-lg font-medium">
              Authenticate
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 pt-24 text-foreground max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">AI Content Pipeline</h1>
      
      <div className="glass p-8 rounded-2xl flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Topic or Keyword</label>
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The Future of AI in Frontend Development"
            className="w-full rounded-lg glass px-4 py-3 outline-none focus:ring-1 focus:ring-secondary/50"
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Processing AI Pipeline..." : "Generate & Save to Database"}
        </button>

        {status && (
          <div className="mt-4 p-4 rounded-lg bg-secondary/10 text-secondary border border-secondary/20">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
