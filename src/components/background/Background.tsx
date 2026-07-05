import { useEffect, useState } from "react";

/** Aurora mesh gradient + cursor-reactive spotlight + noise. */
export function Background() {
  const [pos, setPos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      setPos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-background" />
      {/* aurora blobs */}
      <div className="absolute left-[-10%] top-[-10%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.28),transparent_60%)] blur-3xl animate-float-slow" />
      <div className="absolute right-[-10%] top-[10%] h-[50vw] w-[50vw] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.22),transparent_60%)] blur-3xl animate-float-slow [animation-delay:2s]" />
      <div className="absolute bottom-[-15%] left-[20%] h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.2),transparent_60%)] blur-3xl animate-float-slow [animation-delay:4s]" />
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at 50% 40%, black, transparent 80%)",
        }}
      />
      {/* cursor spotlight */}
      <div
        className="absolute inset-0 transition-[background] duration-300"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(6,182,212,0.08), transparent 40%)`,
        }}
      />
      {/* noise */}
      <div className="noise-overlay absolute inset-0 opacity-[0.03]" />
    </div>
  );
}
