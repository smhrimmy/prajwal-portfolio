import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
// We use the Service Role Key here because this code only runs on the SERVER (within TanStack Start Server Functions).
// This allows us to bypass RLS and perform admin-level read/writes safely.
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase credentials missing. Ensure .env has VITE_SUPABASE_URL and SUPABASE_SECRET_KEY.");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

export const SupabaseAdapter = {
  getSite: async () => {
    const { data, error } = await supabase.from("site").select("*").eq("id", 1).single();
    if (error && error.code !== "PGRST116") console.error("getSite Error:", error);
    return data || {};
  },
  
  updateSite: async (data: any) => {
    const { error } = await supabase.from("site").upsert({ id: 1, ...data });
    if (error) console.error("updateSite Error:", error);
    return !error;
  },
  
  getProjects: async () => {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) console.error("getProjects Error:", error);
    return data || [];
  },
  
  updateProjects: async (data: any[]) => {
    // Delete all projects and insert the new array
    const { error: deleteError } = await supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all
    if (deleteError) {
      console.error("updateProjects Delete Error:", deleteError);
      return false;
    }
    if (data.length > 0) {
      const { error: insertError } = await supabase.from("projects").insert(data);
      if (insertError) {
        console.error("updateProjects Insert Error:", insertError);
        return false;
      }
    }
    return true;
  },
  
  getSkills: async () => {
    const { data, error } = await supabase.from("skills").select("*").order("id", { ascending: true });
    if (error) console.error("getSkills Error:", error);
    return data || [];
  },
  
  updateSkills: async (data: any[]) => {
    // Upsert skills based on their ID, or delete/insert all
    const { error: deleteError } = await supabase.from("skills").delete().neq("id", 0);
    if (deleteError) {
      console.error("updateSkills Delete Error:", deleteError);
      return false;
    }
    if (data.length > 0) {
      // Remove id if present so Postgres auto-generates it? 
      // Actually we mapped them to IDs in local JSON? Local JSON has no IDs.
      const { error: insertError } = await supabase.from("skills").insert(data);
      if (insertError) {
        console.error("updateSkills Insert Error:", insertError);
        return false;
      }
    }
    return true;
  },
  
  getTheme: async () => {
    const { data, error } = await supabase.from("theme").select("*").eq("id", 1).single();
    if (error && error.code !== "PGRST116") console.error("getTheme Error:", error);
    
    let localConfig = {};
    try {
      const fs = await import('fs');
      const path = await import('path');
      const configPath = path.join(process.cwd(), 'src', 'data', 'cms', 'engine_config.json');
      if (fs.existsSync(configPath)) {
        localConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    } catch (e) {
      console.error("Failed to read local engine config", e);
    }
    
    return { ...(data || {}), ...localConfig };
  },
  
  updateTheme: async (data: any) => {
    // Extract engine and overrides to store locally
    const { engine, overrides, ...dbData } = data;
    
    try {
      const fs = await import('fs');
      const path = await import('path');
      const configPath = path.join(process.cwd(), 'src', 'data', 'cms', 'engine_config.json');
      fs.writeFileSync(configPath, JSON.stringify({ engine, overrides }, null, 2));
    } catch (e) {
      console.error("Failed to write local engine config", e);
    }

    const { error } = await supabase.from("theme").upsert({ id: 1, ...dbData });
    if (error) console.error("updateTheme Error:", error);
    return !error;
  }
};
