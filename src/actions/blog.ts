import { createServerFn } from "@tanstack/react-start";
import { supabase } from "../lib/supabase";

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  seo_title: string;
  meta_description: string;
  json_ld: any;
  read_time: string;
  image_url: string;
  status: 'draft' | 'published';
  published_at: string;
  created_at: string;
}

export const getBlogs = createServerFn({ method: "GET" }).handler(async (): Promise<BlogPostData[]> => {
  return [
    {
      id: "dummy-1",
      slug: "future-of-ai",
      title: "The Future of AI in Web Development",
      content: "<p>This is a dummy article...</p>",
      excerpt: "Exploring how AI is reshaping frontend engineering.",
      category: "AI",
      seo_title: "The Future of AI in Web Development",
      meta_description: "A look into AI tools for developers.",
      json_ld: {},
      read_time: "5 min",
      image_url: "",
      status: "published",
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
  ];
});

export const getBlogBySlug = createServerFn({ method: "GET" }).validator((slug: string) => slug).handler(async ({ data: slug }): Promise<BlogPostData | null> => {
  return {
    id: "dummy-1",
    slug: slug,
    title: "The Future of AI in Web Development",
    content: "<p>This is a dummy article...</p>",
    excerpt: "Exploring how AI is reshaping frontend engineering.",
    category: "AI",
    seo_title: "The Future of AI in Web Development",
    meta_description: "A look into AI tools for developers.",
    json_ld: {},
    read_time: "5 min",
    image_url: "",
    status: "published",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
});

export const saveBlog = createServerFn({ method: "POST" }).validator((post: Partial<BlogPostData>) => post).handler(async ({ data: post }) => {
  return { success: true, data: { ...post, id: "dummy-new" } };
});
