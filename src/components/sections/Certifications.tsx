import { motion } from "framer-motion";
import { BadgeCheck, GraduationCap, ShieldCheck } from "lucide-react";
import { certifications, education } from "@/data/experience";
import { SectionHeading, RevealGroup, RevealItem } from "@/components/ui/reveal";

export function Certifications() {
  return (
    <section data-portfolio-component="certifications" id="certifications" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading kicker="// credentials" title="Certifications & Education" subtitle="Verified achievements and academic background." />

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {certifications.map((c) => (
          <RevealItem key={c.name}>
            <motion.div whileHover={{ y: -6, rotateX: 6 }} className="glass corner-brackets group relative h-full rounded-2xl p-6" style={{ transformStyle: "preserve-3d" }}>
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 text-secondary">
                  <BadgeCheck className="h-6 w-6" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">{c.year}</span>
              </div>
              <h3 className="mt-4 font-semibold leading-tight">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.issuer}</p>
              <a
                href={c.verifyUrl}
                data-cursor="hover"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1.5 text-xs font-medium text-secondary ring-1 ring-secondary/40 transition-colors hover:bg-secondary/25"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Verify
              </a>
            </motion.div>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {education.map((e) => (
          <div key={e.school} className="glass flex items-start gap-4 rounded-2xl p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-accent">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div>
              <div className="font-semibold">{e.degree}</div>
              <div className="text-sm text-muted-foreground">{e.school}</div>
              <div className="mt-1 font-mono text-xs text-secondary">{e.period} · {e.location}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
