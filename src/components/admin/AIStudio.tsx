import { useState } from "react";

export function AIStudio() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResponse("");
    
    // Simulate API call
    setTimeout(() => {
      if (activeTool === 'article') {
        setResponse("# The Future of Web Dev\n\nWeb development is evolving rapidly. With the rise of AI tools, developers are focusing more on architecture and less on boilerplate. Here are three trends to watch:\n\n1. AI-Assisted Coding\n2. Edge Computing\n3. Full-stack Type Safety (tRPC, Zod)\n\nThese trends will shape the next decade of the web.");
      } else if (activeTool === 'seo') {
        setResponse("**SEO Analysis Complete**\n\nTitle: 90/100 (Good length)\nKeywords found: web development, react, next.js\nSuggestions:\n- Add meta description\n- Include 'portfolio' in H1\n- Add alt text to 3 images");
      } else {
        setResponse("This project was built to solve the complex problem of state management in large-scale applications. By leveraging a custom React hook combined with a unified Zustand store, we reduced re-renders by 40% and improved developer experience significantly.");
      }
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-8 h-full">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Studio</h1>
          <p className="text-muted-foreground">Your intelligent content generation hub.</p>
        </div>
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/5">
          <input 
            type="password" 
            placeholder="OpenAI API Key (Optional)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-transparent border-none text-xs text-white px-2 py-1 outline-none w-48"
          />
          <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-zinc-500'}`} title={apiKey ? 'Connected' : 'Using Local Mock'} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => setActiveTool('article')}
          className={`glass p-6 rounded-xl text-left transition-colors group ${activeTool === 'article' ? 'border-primary/50 bg-primary/5' : 'hover:bg-white/5 border-transparent'}`}
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            📝
          </div>
          <h3 className="font-bold text-lg mb-1">Article Generator</h3>
          <p className="text-sm text-muted-foreground">Write full SEO-optimized blog posts from a prompt.</p>
        </button>

        <button 
          onClick={() => setActiveTool('seo')}
          className={`glass p-6 rounded-xl text-left transition-colors group ${activeTool === 'seo' ? 'border-primary/50 bg-primary/5' : 'hover:bg-white/5 border-transparent'}`}
        >
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            🔍
          </div>
          <h3 className="font-bold text-lg mb-1">SEO Optimizer</h3>
          <p className="text-sm text-muted-foreground">Analyze and improve your metadata and keywords.</p>
        </button>

        <button 
          onClick={() => setActiveTool('project')}
          className={`glass p-6 rounded-xl text-left transition-colors group ${activeTool === 'project' ? 'border-primary/50 bg-primary/5' : 'hover:bg-white/5 border-transparent'}`}
        >
          <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            ✨
          </div>
          <h3 className="font-bold text-lg mb-1">Project Describer</h3>
          <p className="text-sm text-muted-foreground">Turn bullet points into compelling project narratives.</p>
        </button>
      </div>

      {activeTool ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
          <div className="glass p-6 rounded-xl flex flex-col gap-4">
            <h2 className="font-bold text-lg">Input Prompt</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              className="flex-1 bg-black/40 border border-white/10 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-primary text-primary-foreground py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors hover:bg-primary/90"
            >
              {isGenerating ? "Generating..." : "Generate Content"}
            </button>
          </div>
          <div className="glass p-6 rounded-xl flex flex-col gap-4">
            <h2 className="font-bold text-lg">Output</h2>
            <div className="flex-1 bg-black/40 border border-white/10 rounded-lg p-4 overflow-y-auto whitespace-pre-wrap font-mono text-sm text-zinc-300">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                  <span className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></span>
                  Synthesizing {apiKey ? 'via API' : '(Local Mock)'}...
                </div>
              ) : (
                response || <span className="text-muted-foreground italic">Generated content will appear here...</span>
              )}
            </div>
            {response && (
              <button 
                className="bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-medium transition-colors"
                onClick={() => navigator.clipboard.writeText(response)}
              >
                Copy to Clipboard
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 glass p-8 rounded-xl flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold mb-2">Select an AI Tool</h2>
          <p className="text-muted-foreground max-w-md">Choose a tool from above to start generating content. The AI Studio integrates directly with your Content Studio.</p>
        </div>
      )}
    </div>
  );
}
