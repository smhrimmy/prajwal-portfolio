import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { generateOutlineFn, improveGrammarFn, generateSeoMetadataFn } from '../../actions/ai';

export function ArticleEditor({ article, onSave, onCancel }: { article: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [status, setStatus] = useState(article?.status || "draft");
  const [coverImage, setCoverImage] = useState(article?.image_url || "");
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiSidebar, setShowAiSidebar] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: article?.content_html || "",
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] border border-border p-4 rounded-lg bg-background text-foreground',
      },
    },
  });

  const handleSave = () => {
    onSave({
      ...article,
      title,
      slug,
      excerpt,
      status,
      // image_url: coverImage, // Skipped for now due to DB schema cache issue
      content_html: editor?.getHTML() || "",
      content_md: editor?.getText() || "",
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (article?.id) handleSave();
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [title, slug, excerpt, status, coverImage, editor?.getHTML()]);

  // AI Actions
  const handleGenerateOutline = async () => {
    if (!title) return alert("Please enter a title first!");
    setAiLoading(true);
    const res = await generateOutlineFn({ data: title });
    if (res.success && res.outline) {
      editor?.chain().focus().insertContent(res.outline.replace(/\n/g, '<br>')).run();
    } else {
      alert("AI Error: " + res.error);
    }
    setAiLoading(false);
  };

  const handleImproveGrammar = async () => {
    const text = editor?.getText();
    if (!text) return alert("Editor is empty!");
    setAiLoading(true);
    const res = await improveGrammarFn({ data: text });
    if (res.success && res.content) {
      editor?.commands.setContent(res.content.replace(/\n/g, '<br>'));
    } else {
      alert("AI Error: " + res.error);
    }
    setAiLoading(false);
  };

  const handleGenerateSeo = async () => {
    const text = editor?.getText();
    if (!text) return alert("Editor is empty!");
    setAiLoading(true);
    const res = await generateSeoMetadataFn({ data: text });
    if (res.success && res.metadata) {
      if (!title) setTitle(res.metadata.meta_title);
      setExcerpt(res.metadata.meta_description);
      if (!slug) setSlug(res.metadata.suggested_slug);
      alert(`SEO Generated! Keyword: ${res.metadata.focus_keyword}`);
    } else {
      alert("AI Error: " + res.error);
    }
    setAiLoading(false);
  };



  return (
    <div className="flex flex-col h-full bg-background/50 rounded-xl border border-border overflow-hidden relative">
      <div className="flex justify-between items-center p-4 border-b border-border bg-muted/20">
        <div className="flex gap-4 items-center">
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">← Back</button>
          <h2 className="font-bold">{article?.id ? "Edit Article" : "New Article"}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAiSidebar(!showAiSidebar)} className={`px-3 py-1 rounded text-sm border font-medium ${showAiSidebar ? 'bg-secondary/20 text-secondary border-secondary/50' : 'border-border'}`}>✨ AI Assistant</button>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-background border border-border rounded px-2 py-1 text-sm">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-1 rounded font-medium text-sm">Save</button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Title</label>
              <input 
                value={title} 
                onChange={e => {
                  setTitle(e.target.value);
                  if (!article?.id && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                  }
                }} 
                className="w-full bg-muted/50 border border-border rounded px-3 py-2 text-lg font-bold" 
                placeholder="Article Title"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Slug</label>
              <input 
                value={slug} 
                onChange={e => setSlug(e.target.value)} 
                className="w-full bg-muted/50 border border-border rounded px-3 py-2 text-sm font-mono" 
                placeholder="article-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Excerpt / Meta Description</label>
              <textarea 
                value={excerpt} 
                onChange={e => setExcerpt(e.target.value)} 
                className="w-full bg-muted/50 border border-border rounded px-3 py-2 h-20 text-sm" 
                placeholder="Brief summary for SEO..."
              />
            </div>
            <div className="space-y-1 flex flex-col">
              <label className="text-xs font-bold text-muted-foreground uppercase">Cover Image URL</label>
              <input 
                value={coverImage} 
                onChange={e => setCoverImage(e.target.value)} 
                className="w-full bg-muted/50 border border-border rounded px-3 py-2 text-sm" 
                placeholder="https://..."
              />
              {coverImage && (
                <div className="mt-2 h-10 w-20 rounded bg-cover bg-center border border-border" style={{ backgroundImage: `url(${coverImage})`}} />
              )}
            </div>
          </div>

          {/* TipTap Toolbar */}
          <div className="border border-border rounded-t-lg bg-muted/30 p-2 flex gap-2 flex-wrap sticky top-0 z-10 backdrop-blur-sm">
            <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive('bold') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}>Bold</button>
            <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive('italic') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}>Italic</button>
            <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive('underline') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}>Underline</button>
            <div className="w-px h-4 bg-border self-center mx-1" />
            <button onClick={() => editor?.chain().focus().setTextAlign('left').run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive({ textAlign: 'left' }) ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}>Left</button>
            <button onClick={() => editor?.chain().focus().setTextAlign('center').run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive({ textAlign: 'center' }) ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}>Center</button>
            <button onClick={() => editor?.chain().focus().setTextAlign('right').run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive({ textAlign: 'right' }) ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}>Right</button>
            <div className="w-px h-4 bg-border self-center mx-1" />
            <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}>H2</button>
            <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}>H3</button>
            <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded text-sm ${editor?.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}>Bullet List</button>
          </div>
          
          <EditorContent editor={editor} />
        </div>

        {/* AI Sidebar */}
        {showAiSidebar && (
          <div className="w-80 border-l border-border bg-muted/10 flex flex-col p-4 animate-in slide-in-from-right">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">✨ AI Assistant</h3>
            <div className="flex flex-col gap-3">
              <button onClick={handleGenerateOutline} disabled={aiLoading} className="text-left p-3 rounded-lg border border-border bg-background hover:border-secondary/50 transition-colors">
                <div className="font-bold text-sm">Generate Outline</div>
                <div className="text-xs text-muted-foreground mt-1">Creates a structured markdown outline based on your title.</div>
              </button>
              
              <button onClick={handleImproveGrammar} disabled={aiLoading} className="text-left p-3 rounded-lg border border-border bg-background hover:border-secondary/50 transition-colors">
                <div className="font-bold text-sm">Improve Writing</div>
                <div className="text-xs text-muted-foreground mt-1">Fixes grammar and improves readability of the current content.</div>
              </button>

              <button onClick={handleGenerateSeo} disabled={aiLoading} className="text-left p-3 rounded-lg border border-border bg-background hover:border-secondary/50 transition-colors">
                <div className="font-bold text-sm">Auto-SEO</div>
                <div className="text-xs text-muted-foreground mt-1">Generates an optimized Meta Description and Slug from your content.</div>
              </button>



              {aiLoading && (
                <div className="mt-4 text-center text-xs text-secondary animate-pulse">
                  AI is working...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
