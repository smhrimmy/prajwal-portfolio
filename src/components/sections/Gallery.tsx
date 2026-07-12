import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/reveal";
import { useCmsStore } from "@/store/useCmsStore";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Gallery({ isFullPage = false }: { isFullPage?: boolean }) {
  const cmsStore = useCmsStore();
  const gallery = (cmsStore as any).gallery || [
    { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085", caption: "Workspace" },
    { url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c", caption: "Code" },
    { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97", caption: "Desk" },
    { url: "https://images.unsplash.com/photo-1551033406-611cf9a28f67", caption: "Coffee" },
  ];
  
  const [displayCount, setDisplayCount] = useState(8);
  const currentImages = isFullPage ? gallery : gallery.slice(0, displayCount);
  const hasMore = !isFullPage && gallery.length > displayCount;
  const showViewAll = displayCount >= 24;

  if (gallery.length === 0) return null;

  const handleLoadMore = () => setDisplayCount(prev => prev + 8);

  return (
    <section data-portfolio-component="gallery" id="gallery" className={cn("relative mx-auto max-w-6xl", isFullPage ? "px-0 py-0" : "px-6 py-28")}>
      {!isFullPage && (
        <SectionHeading kicker="// visual_log" title="Gallery" subtitle="Glimpses of life, workspaces, and moments." />
      )}
      
      <div className="mt-12 columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
        {currentImages.map((img: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative mb-4 overflow-hidden rounded-xl bg-muted/20"
          >
            <img 
              src={img.url} 
              alt={img.caption || "Gallery image"} 
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105" 
              loading="lazy" 
            />
            {img.caption && (
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-xs font-medium text-white">{img.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          {showViewAll ? (
            <Link
              to="/gallery"
              className="group flex items-center gap-2 rounded-full bg-secondary/10 px-6 py-3 font-mono text-xs uppercase text-secondary transition-all hover:bg-secondary hover:text-secondary-foreground"
            >
              View Full Gallery
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              onClick={handleLoadMore}
              className="group flex items-center gap-2 rounded-full glass px-6 py-3 font-mono text-xs uppercase transition-all hover:bg-secondary/10 hover:text-secondary"
            >
              Load More
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
