import { useRouter } from "@tanstack/react-router";
import { useCmsStore } from "@/store/useCmsStore";
import { Save, X } from "lucide-react";
import { LocalJSONAdapter } from "@/lib/storage/localJSONAdapter";

export function PreviewActionBar({ templateId }: { templateId: string }) {
  const router = useRouter();
  const cmsStore = useCmsStore();
  const storage = new LocalJSONAdapter();

  const handleExit = () => {
    // Remove preview from URL
    router.navigate({ to: "/", search: {} });
  };

  const handleApply = async () => {
    // Update local store
    const newTheme = { ...cmsStore.theme, activeTemplate: templateId, id: templateId };
    cmsStore.setTheme(newTheme);
    // Attempt to save to backend (if applicable)
    try {
      await storage.saveTheme(newTheme);
    } catch (e) {
      console.error("Failed to save theme:", e);
    }
    // Remove preview from URL
    router.navigate({ to: "/", search: {} });
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-black text-white p-3 flex justify-between items-center z-[9999] shadow-lg text-sm font-medium">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>Preview Mode: <span className="text-gray-400 capitalize">{templateId}</span> Template</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleExit} className="hover:text-gray-300 transition flex items-center gap-2">
          <X size={16} /> Exit Preview
        </button>
        <button onClick={handleApply} className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-200 transition flex items-center gap-2">
          <Save size={16} /> Apply Template
        </button>
      </div>
    </div>
  );
}
