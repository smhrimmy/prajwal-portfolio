import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function Blog({ posts = [] }: { posts?: any[] }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      (Array.isArray(posts) ? posts : []).filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (p.title.toLowerCase().includes(q.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(q.toLowerCase())),
      ),
    [cat, q],
  );

  return (
    <section id="blog" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading kicker="// transmissions" title="Latest Articles" subtitle="Notes on frontend, motion and the craft." />

      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-wrap gap-2">
          {["All", "Frontend", "DevOps", "AI", "Design", "Career"].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              data-cursor="hover"
              className={cn(
                "rounded-full px-4 py-1.5 font-mono text-xs transition-colors",
                cat === c ? "bg-secondary/20 text-secondary ring-1 ring-secondary/50" : "glass text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-full glass py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-secondary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((p, i) => (
          <Link
            key={p.id}
            to={`/blog/${p.slug}`}
            className="glass corner-brackets group relative rounded-2xl p-6 block"
          >
            <motion.div
            data-cursor="hover"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass corner-brackets group relative rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
              <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-secondary">{p.category}</span>
              <span>{p.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {p.readTime}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold leading-snug">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-secondary" />
            </motion.div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center font-mono text-sm text-muted-foreground">
            No transmissions found.
          </p>
        )}
      </div>
    </section>
  );
}
