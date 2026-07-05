import { useEffect, useRef, useState } from "react";

/** Custom glowing cursor with magnetic hover feel + particle trail. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(true);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("no-cursor");
    setHidden(false);

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a,button,[data-cursor='hover'],input,textarea"));
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("no-cursor");
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-1 -mt-1 h-2 w-2 rounded-full bg-secondary"
        style={{ boxShadow: "0 0 12px 2px var(--neon-secondary)" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-secondary/60 transition-[width,height,opacity] duration-200"
        style={{
          width: hovering ? 52 : 30,
          height: hovering ? 52 : 30,
          marginLeft: hovering ? -26 : -15,
          marginTop: hovering ? -26 : -15,
          opacity: hovering ? 0.9 : 0.5,
          background: hovering ? "rgba(6,182,212,0.08)" : "transparent",
        }}
      />
    </>
  );
}
