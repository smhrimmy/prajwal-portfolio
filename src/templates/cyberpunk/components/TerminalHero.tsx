import { useState, useEffect } from "react";
import { useTemplateData } from "@/shared/TemplateContext";
import { cyberpunkTokens as t } from "../tokens";

export function TerminalHero() {
  const { profile: site } = useTemplateData();
  const [bootSequence, setBootSequence] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const lines = [
      "INIT SYSTEM...",
      "LOADING KERNEL MODULES...",
      "ESTABLISHING SECURE CONNECTION...",
      "DECRYPTING PROFILE DATA...",
      "ACCESS GRANTED."
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < lines.length) {
        setBootSequence(prev => [...prev, lines[current]]);
        current++;
      } else {
        setIsBooted(true);
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <section data-portfolio-component="terminalhero" className={`border-l-4 ${t.colors.borderGlow} pl-6 py-4 flex flex-col gap-6`}>
      <div className={`text-sm ${t.colors.textMuted} flex flex-col gap-1`}>
        {bootSequence.map((line, i) => (
          <div key={i}>{`> ${line}`}</div>
        ))}
        {!isBooted && <div className={t.motion.blink}>_</div>}
      </div>

      {isBooted && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">
            {site?.name || "GUEST_USER"}
          </h1>
          <h2 className={`text-xl md:text-2xl ${t.colors.textMuted} mb-6 uppercase tracking-widest`}>
            {site?.role || "SYSTEM_OPERATOR"}
          </h2>
          <p className="max-w-2xl leading-relaxed bg-black/50 p-4 border border-dashed border-[#00ff41]/20">
            {site?.bio || "Awaiting input..."}
          </p>
        </div>
      )}
    </section>
  );
}
