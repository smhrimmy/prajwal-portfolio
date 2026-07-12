import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";

export function Blog({ posts: propsPosts, isFullPage = false }: { posts?: any[]; isFullPage?: boolean }) {
  const { blog } = useTemplateData();
  const posts = propsPosts || blog || [];
  
  const INITIAL_COUNT = 4;
  const currentPosts = isFullPage ? posts : posts.slice(0, INITIAL_COUNT);
  
  if (!posts || posts.length === 0) return null;

  return (
    <section data-portfolio-component="blog" id="blog" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      {!isFullPage && (
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Writing</h2>
          <a href="/blog" className={`text-sm font-semibold ${t.colors.accents.linkSoft} px-3 py-1 rounded-full hover:opacity-80 motion-safe:transition-opacity`}>
            View All &rarr;
          </a>
        </div>
      )}

      <div className={`${t.grid.container} ${t.layout.gap} grid-flow-row-dense`}>
        {currentPosts.map((post: any, i: number) => {
          const isFeatured = i === 0;
          const spanClass = isFeatured ? t.grid.span2x2 : t.grid.span1x2;
          
          const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.description || post.excerpt,
            "datePublished": post.publishedAt || post.date,
          };

          return (
            <article 
              key={post.slug || post.id} 
              className={`${spanClass} ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover} flex flex-col`}
            >
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
              
              <a href={post.url || `/blog/${post.slug}`} className="flex flex-col h-full group">
                <time className={`text-xs font-bold tracking-wider uppercase mb-3 ${t.colors.textMuted}`}>
                  {new Date(post.publishedAt || post.date).toLocaleDateString()}
                </time>
                <h3 className={`font-bold mb-4 ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                  {post.title}
                </h3>
                <p className={`${t.colors.textMuted} text-sm leading-relaxed mb-6 flex-1 line-clamp-3`}>
                  {post.description || post.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 font-semibold text-sm">
                  <span className="group-hover:translate-x-1 motion-safe:transition-transform">Read article &rarr;</span>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
