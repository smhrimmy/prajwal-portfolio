import { createFileRoute } from "@tanstack/react-router";
import { getBlogBySlug } from "../actions/blog";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionHeading } from "../components/ui/reveal";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  loader: async ({ params }) => {
    const post = await getBlogBySlug({ data: params.slug });
    // In TanStack Start we usually unwrap server functions. If it returns null, we handle it.
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: loaderData.seo_title || loaderData.title },
        { name: "description", content: loaderData.meta_description || loaderData.excerpt },
        { property: "og:title", content: loaderData.seo_title || loaderData.title },
        { property: "og:description", content: loaderData.meta_description || loaderData.excerpt },
        { property: "og:image", content: loaderData.image_url },
        { property: "og:type", content: "article" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(loaderData.json_ld || {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": loaderData.title,
            "image": [loaderData.image_url],
            "datePublished": loaderData.published_at,
            "author": [{
              "@type": "Person",
              "name": "Prajwal DL"
            }]
          })
        }
      ]
    };
  },
  staleTime: 1000 * 60 * 60, // Cache loader data client-side for 1 hour
  headers: () => {
    return {
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    };
  }
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background text-foreground pb-24 pt-32">
      <div className="max-w-3xl mx-auto px-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground mb-6">
            <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-secondary">Tech</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span>5 min read</span>
          </div>
          
          <SectionHeading kicker="// article" title={post.title} />
        </header>

        <article 
          className="prose prose-invert prose-secondary max-w-none prose-headings:font-bold prose-a:text-secondary hover:prose-a:text-secondary/80"
          dangerouslySetInnerHTML={{ __html: post.content_html || "" }}
        />
      </div>
    </main>
  );
}
