import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/lib/storage/supabaseAdapter";

// --- Articles ---

export const getArticlesFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase
    .from("articles")
    .select(`*, author:authors(*), category:categories(*)`)
    .order("created_at", { ascending: false });
  if (error) console.error("getArticles Error:", error);
  return data || [];
});

export const getArticleBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { data, error } = await supabase
      .from("articles")
      .select(`*, author:authors(*), category:categories(*), seo:article_seo(*)`)
      .eq("slug", slug)
      .single();
    if (error && error.code !== "PGRST116") console.error("getArticleBySlug Error:", error);
    return data || null;
  });

export const saveArticleFn = createServerFn({ method: "POST" })
  .validator((article: any) => article)
  .handler(async ({ data: article }) => {
    const { id, title, slug, excerpt, status, content_html, content_md } = article;
    const finalId = id || crypto.randomUUID();
    
    const { error } = await supabase.from("articles").upsert({
      id: finalId,
      title,
      slug,
      excerpt,
      status,
      content_html,
      content_md,
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.error("saveArticle Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  });

export const deleteArticleFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      console.error("deleteArticle Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  });

// --- Categories ---

export const getCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) console.error("getCategories Error:", error);
  return data || [];
});

export const saveCategoryFn = createServerFn({ method: "POST" })
  .validator((category: any) => category)
  .handler(async ({ data: category }) => {
    if (!category.id) category.id = crypto.randomUUID();
    const { error } = await supabase.from("categories").upsert(category);
    if (error) {
      console.error("saveCategory Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  });

export const deleteCategoryFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error("deleteCategory Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  });

// --- Tags ---

export const getTagsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase.from("tags").select("*");
  if (error) console.error("getTags Error:", error);
  return data || [];
});

export const saveTagFn = createServerFn({ method: "POST" })
  .validator((tag: any) => tag)
  .handler(async ({ data: tag }) => {
    if (!tag.id) tag.id = crypto.randomUUID();
    const { error } = await supabase.from("tags").upsert(tag);
    if (error) {
      console.error("saveTag Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  });

export const deleteTagFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { error } = await supabase.from("tags").delete().eq("id", id);
    if (error) {
      console.error("deleteTag Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  });

// --- Media ---

export const getMediaFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase.from("media").select("*").order("uploaded_at", { ascending: false });
  if (error) console.error("getMedia Error:", error);
  return data || [];
});

export const saveMediaFn = createServerFn({ method: "POST" })
  .validator((media: any) => media)
  .handler(async ({ data: media }) => {
    if (!media.id) media.id = crypto.randomUUID();
    const { error } = await supabase.from("media").upsert(media);
    if (error) {
      console.error("saveMedia Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  });

export const deleteMediaFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) {
      console.error("deleteMedia Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  });
