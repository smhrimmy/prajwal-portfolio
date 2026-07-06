import { createServerFn } from "@tanstack/react-start";
import { supabase } from "../lib/storage/supabaseAdapter";

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  content_html: string;
  content_md: string;
  excerpt: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  seo_title?: string;
  meta_description?: string;
}

export const getBlogs = createServerFn({ method: "GET" }).handler(async (): Promise<BlogPostData[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
  return data as BlogPostData[];
});

export const getBlogBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<BlogPostData | null> => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("Error fetching blog by slug:", error);
      return null;
    }
    return data as BlogPostData;
  });

export const saveBlog = createServerFn({ method: "POST" })
  .validator((post: Partial<BlogPostData>) => post)
  .handler(async ({ data: post }) => {
    const { data, error } = await supabase.from('articles').upsert(post).select().single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  });
