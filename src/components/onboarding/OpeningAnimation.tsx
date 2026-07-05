import { useEffect } from "react";
import { motion } from "framer-motion";

export function OpeningAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative flex h-56 w-full items-center justify-center overflow-hidden [perspective:1000px]">
      <motion.div
        className="relative h-24 w-24 [transform-style:preserve-3d]"
        animate={{
          rotateX: [0, 180, 360],
          rotateY: [0, 180, 360],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
        }}
      >
        {/* Front */}
        <div className="absolute inset-0 border-2 border-secondary bg-secondary/10 shadow-[0_0_15px_var(--secondary)] [transform:translateZ(48px)]" />
        {/* Back */}
        <div className="absolute inset-0 border-2 border-secondary bg-secondary/10 shadow-[0_0_15px_var(--secondary)] [transform:rotateY(180deg)_translateZ(48px)]" />
        {/* Right */}
        <div className="absolute inset-0 border-2 border-secondary bg-secondary/10 shadow-[0_0_15px_var(--secondary)] [transform:rotateY(90deg)_translateZ(48px)]" />
        {/* Left */}
        <div className="absolute inset-0 border-2 border-secondary bg-secondary/10 shadow-[0_0_15px_var(--secondary)] [transform:rotateY(-90deg)_translateZ(48px)]" />
        {/* Top */}
        <div className="absolute inset-0 border-2 border-secondary bg-secondary/10 shadow-[0_0_15px_var(--secondary)] [transform:rotateX(90deg)_translateZ(48px)]" />
        {/* Bottom */}
        <div className="absolute inset-0 border-2 border-secondary bg-secondary/10 shadow-[0_0_15px_var(--secondary)] [transform:rotateX(-90deg)_translateZ(48px)]" />
      </motion.div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-secondary animate-pulse">
        GENERATING 3D SPACE...
      </div>
    </div>
  );
}
