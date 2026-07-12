import { useState } from "react";
import { useTemplateData } from "@/shared/TemplateContext";
import { minimalTokens as t } from "../tokens";
import { Link } from "@tanstack/react-router";

export function Writing({ posts: propsPosts, isFullPage = false }: { posts?: any[], isFullPage?: boolean }) {
  const { blog } = useTemplateData();
  const posts = propsPosts || blog || [];
  
  const [expanded, setExpanded] = useState(false);
  const INITIAL_COUNT = 3;
  const currentPosts = isFullPage ? posts : (expanded ? posts : posts.slice(0, INITIAL_COUNT));
  const hasMore = !isFullPage && posts.length > INITIAL_COUNT;

  if (!posts || posts.length === 0) return null;

  return (
    <section data-portfolio-component="writing" className={`${t.spacing.section} ${t.spacing.container}`}>
      <div className="mb-16">
        <h2 className={`${t.typography.mono} ${t.colors.textMuted}`}>
          06. Notes & Transmissions
        </h2>
      </div>

      <div className="flex flex-col">
        {currentPosts.map((post: any, i: number) => (
            <Link 
              key={i} 
              to={`/blog/${post.slug || post.id}`}
              className={`group border-b ${t.colors.border} py-8 md:py-12 flex flex-col md:flex-row md:items-baseline justify-between gap-4`}
            >
              <h3 className={`${t.typography.heading} text-2xl md:text-3xl group-hover:pl-4 transition-all duration-300`}>
                {post.title}
              </h3>
              <span className={`${t.typography.mono} ${t.colors.textMuted} shrink-0`}>
                {post.date ? new Date(post.date).getFullYear() : "2024"}
              </span>
            </Link>
          ))}
          
          {hasMore && (
            <div className="mt-16 flex justify-center pt-8">
              <button 
                onClick={() => setExpanded(!expanded)}
                className={`${t.typography.heading} text-xl md:text-2xl hover:italic transition-all duration-300`}
              >
                {expanded ? "Hide Archive" : "View All Articles"} &rarr;
              </button>
            </div>
          )}
        </div>
    </section>
  );
}
