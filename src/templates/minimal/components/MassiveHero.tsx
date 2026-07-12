import { useTemplateData } from "@/shared/TemplateContext";
import { minimalTokens as t } from "../tokens";
import { motion } from "framer-motion";

export function MassiveHero() {
  const { profile } = useTemplateData();
  
  const title = profile?.title || "Creative Developer";
  const parts = title.split(" ");
  
  return (
    <section data-portfolio-component="massivehero" className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20">
      <div className="max-w-7xl">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`${t.typography.mono} mb-8 ${t.colors.textMuted}`}
        >
          {profile?.name || "Prajwal"} — {profile?.location || "Global"}
        </motion.p>
        
        <h1 className={`${t.typography.display}`}>
          {parts.map((part: string, i: number) => (
            <motion.span 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 + (i * 0.1), ease: [0.2, 0.65, 0.3, 0.9] }}
              className="block"
            >
              {part}
            </motion.span>
          ))}
        </h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 md:mt-32 max-w-xl"
        >
          <p className={`${t.typography.body} text-2xl`}>
            {profile?.bio || "Building digital experiences with relentless focus on simplicity and typography."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
