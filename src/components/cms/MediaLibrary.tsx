import React, { useState, useEffect } from "react";
import { getMediaFn, saveMediaFn, deleteMediaFn } from "../../actions/cms";
import { createClient } from "@supabase/supabase-js";

// Client-side supabase client (only uses public anon key, not service key)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const clientSupabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function MediaLibrary({ onSelect }: { onSelect?: (url: string) => void }) {
  const [media, setMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      const data = await getMediaFn();
      setMedia(data);
    } catch(e) {
      console.error("Failed to fetch media. Check Supabase keys.", e);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!clientSupabase) {
      alert("Supabase VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing in .env!");
      return;
    }

    const file = e.target.files[0];
    setUploading(true);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await clientSupabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = clientSupabase.storage.from('media').getPublicUrl(filePath);

      // Save to database
      await saveMediaFn({
        data: {
          url: publicUrl,
          filename: file.name,
          type: file.type,
          size: file.size
        }
      });

      fetchMedia();
    } catch (error: any) {
      alert("Error uploading file: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if(!confirm("Delete this media?")) return;
    try {
      await deleteMediaFn({ data: id });
      fetchMedia();
    } catch (e: any) {
      alert("Error deleting: " + e.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50 rounded-xl border border-border">
      <div className="flex justify-between items-center p-4 border-b border-border bg-muted/20">
        <h2 className="font-bold">Media Library</h2>
        <label className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium cursor-pointer">
          {uploading ? "Uploading..." : "Upload File"}
          <input type="file" className="hidden" accept="image/*,video/*,application/pdf" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto">
        {media.map(m => (
          <div key={m.id} className="relative group glass rounded-lg border border-border overflow-hidden aspect-square flex flex-col items-center justify-center">
            {m.type?.startsWith('image') ? (
              <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4 break-all">
                <span className="font-bold text-xs uppercase">{m.type}</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
              <span className="text-xs text-center truncate w-full" title={m.filename}>{m.filename}</span>
              {onSelect && (
                <button onClick={() => onSelect(m.url)} className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-xs">Select</button>
              )}
              <button onClick={() => handleDelete(m.id, m.url)} className="bg-destructive text-destructive-foreground px-3 py-1 rounded text-xs">Delete</button>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <div className="col-span-full text-center p-8 text-muted-foreground">
            No media found. Upload something!
          </div>
        )}
      </div>
    </div>
  );
}
