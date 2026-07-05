import { createServerFn } from "@tanstack/react-start";
import { SupabaseAdapter } from "@/lib/storage/supabaseAdapter";

export const getSiteFn = createServerFn({ method: "GET" }).handler(async () => {
  return await SupabaseAdapter.getSite();
});

export const updateSiteFn = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    await SupabaseAdapter.updateSite(data);
    return { success: true };
  });

export const getProjectsFn = createServerFn({ method: "GET" }).handler(async () => {
  return await SupabaseAdapter.getProjects();
});

export const updateProjectsFn = createServerFn({ method: "POST" })
  .validator((d: any[]) => d)
  .handler(async ({ data }) => {
    await SupabaseAdapter.updateProjects(data);
    return { success: true };
  });

export const getSkillsFn = createServerFn({ method: "GET" }).handler(async () => {
  return await SupabaseAdapter.getSkills();
});

export const updateSkillsFn = createServerFn({ method: "POST" })
  .validator((d: any[]) => d)
  .handler(async ({ data }) => {
    await SupabaseAdapter.updateSkills(data);
    return { success: true };
  });

export const getThemeFn = createServerFn({ method: "GET" }).handler(async () => {
  return await SupabaseAdapter.getTheme();
});

export const updateThemeFn = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    await SupabaseAdapter.updateTheme(data);
    return { success: true };
  });
