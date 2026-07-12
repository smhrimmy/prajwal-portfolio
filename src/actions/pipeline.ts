import { createServerFn } from "@tanstack/react-start";
import { QueueManager } from "../lib/cms/queue/QueueManager";
import { PreflightValidatorWorker } from "../lib/cms/validators/PreflightValidator";
import { SiteBuilderWorker } from "../lib/cms/builders/SiteBuilder";
import { BlogBuilderWorker } from "../lib/cms/builders/BlogBuilder";
import { SearchBuilderWorker } from "../lib/cms/builders/SearchBuilder";
import { AIBuilderWorker } from "../lib/cms/builders/AIBuilder";
import { supabase } from "../lib/storage/supabaseAdapter";

// Initialize the queue manager lazily so it never runs on the client
const getQueue = () => {
  const queue = QueueManager.getInstance();
  queue.registerWorker(PreflightValidatorWorker);
  queue.registerWorker(SiteBuilderWorker);
  queue.registerWorker(BlogBuilderWorker);
  queue.registerWorker(SearchBuilderWorker);
  queue.registerWorker(AIBuilderWorker);
  return queue;
};

export const runPublishPipelineFn = createServerFn({ method: "POST" })
  .validator((d: { changes: { type: string, id?: string }[] }) => d)
  .handler(async (ctx) => {
    // 1. Fetch all required state from Supabase to feed the pipeline
    // In a massive CMS, we might only fetch what changed, but for our scale, fetching all is fine for the builders.
    const [
      { data: site },
      { data: projects },
      { data: skills },
      { data: themeDb },
      { data: articles }
    ] = await Promise.all([
      supabase.from("site").select("*").eq("id", 1).single(),
      supabase.from("projects").select("*"),
      supabase.from("skills").select("*").order("id", { ascending: true }),
      supabase.from("theme").select("*").eq("id", 1).single(),
      supabase.from("articles").select("*").eq("status", "published").order("created_at", { ascending: false })
    ]);

    let theme = { ...(themeDb || {}) };
    try {
      const fs = await import('fs');
      const path = await import('path');
      const configPath = path.join(process.cwd(), 'src', 'data', 'cms', 'engine_config.json');
      if (fs.existsSync(configPath)) {
        const localConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        theme = { ...theme, ...localConfig };
      }
    } catch (e) {
      console.error("Failed to read local engine config in pipeline", e);
    }

    const dbData = { site, projects, skills, theme, articles };

    // 2. Start the pipeline in the background and get a session ID
    const sessionId = await getQueue().startPipeline(ctx.data.changes, dbData);

    return { success: true, sessionId };
  });

export const getPublishStatusFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const session = getQueue().getCurrentSession();
    return session || null;
  });
