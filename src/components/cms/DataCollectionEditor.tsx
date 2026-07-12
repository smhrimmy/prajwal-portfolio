import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "boolean" | "list" | "color" | "image";
}

interface DataCollectionEditorProps {
  title: string;
  items: any[];
  schema: FieldDef[];
  onSave: (items: any[]) => Promise<void>;
}

export function DataCollectionEditor({ title, items, schema, onSave }: DataCollectionEditorProps) {
  const [data, setData] = useState<any[]>(items || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleAddNew = () => {
    const newItem = { id: crypto.randomUUID() };
    schema.forEach((f) => {
      if (f.type === "list") newItem[f.key] = [];
      else if (f.type === "boolean") newItem[f.key] = false;
      else newItem[f.key] = "";
    });
    setEditingId(newItem.id);
    setEditForm(newItem);
  };

  const handleSaveForm = () => {
    const existingIndex = data.findIndex(i => i.id === editingId);
    let newData = [...data];
    if (existingIndex >= 0) {
      newData[existingIndex] = editForm;
    } else {
      newData = [editForm, ...newData];
    }
    setData(newData);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(i => i.id !== id));
  };

  const handleCommit = async () => {
    setIsSaving(true);
    await onSave(data);
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground text-sm">Manage your {title.toLowerCase()} collection.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAddNew}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            + Add New
          </button>
          <button 
            onClick={handleCommit}
            disabled={isSaving}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : <><Check size={16} /> Publish Changes</>}
          </button>
        </div>
      </div>

      {editingId ? (
        <div className="glass p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-lg">Edit Item</h4>
            <button onClick={() => setEditingId(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
          </div>
          
          <div className="flex flex-col gap-4">
            {schema.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{field.label}</label>
                
                {field.type === "text" && (
                  <input 
                    type="text" 
                    value={editForm[field.key] || ""} 
                    onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                    className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                )}
                
                {field.type === "color" && (
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={editForm[field.key] || "#000000"} 
                      onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                      className="bg-transparent w-10 h-10 border-0 p-0 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={editForm[field.key] || ""} 
                      onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 transition-colors font-mono"
                    />
                  </div>
                )}
                
                {field.type === "textarea" && (
                  <textarea 
                    value={editForm[field.key] || ""} 
                    onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                    className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 min-h-[100px] transition-colors"
                  />
                )}
                
                {field.type === "boolean" && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!editForm[field.key]} 
                      onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.checked })}
                      className="w-5 h-5 accent-primary bg-black/40 border border-white/10 rounded"
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                )}
                
                {field.type === "image" && (
                  <input 
                    type="text" 
                    placeholder="Image URL"
                    value={editForm[field.key] || ""} 
                    onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                    className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                )}
                
                {field.type === "list" && (
                  <input 
                    type="text" 
                    placeholder="Comma separated values"
                    value={(editForm[field.key] || []).join(", ")} 
                    onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value.split(",").map((s: string) => s.trim()) })}
                    className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button onClick={() => setEditingId(null)} className="px-5 py-2 rounded-lg font-medium hover:bg-white/5 transition-colors">Cancel</button>
            <button onClick={handleSaveForm} className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors">Done</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((item) => (
            <div key={item.id} className="glass p-5 rounded-xl flex flex-col gap-2 group hover:border-white/20 transition-all">
              <div className="flex justify-between items-start">
                <h4 className="font-bold line-clamp-1">{item.title || item.name || item.company || item.role || item.id}</h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(item)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description || item.excerpt || item.content || item.category || "No description"}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto pt-4">
                {schema.filter(f => f.type === "list" && item[f.key]?.length > 0).map(f => (
                   <span key={f.key} className="text-[10px] uppercase font-bold tracking-wider bg-white/5 px-2 py-1 rounded">
                     {item[f.key].length} {f.label}
                   </span>
                ))}
              </div>
            </div>
          ))}
          
          {data.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl">
              <p className="text-muted-foreground">No items found. Click "+ Add New" to start.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
