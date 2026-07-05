import { useEffect, useRef } from "react";

/** Matrix-style code rain on canvas. */
export function CodeRain({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const chars = "01<>/{}[]=+*ABCDEF#$%&";
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const fontSize = 14;
    let cols = Math.floor(w / fontSize);
    let drops = Array(cols).fill(1);

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      cols = Math.floor(w / fontSize);
      drops = Array(cols).fill(1);
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(5,8,22,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#06b6d4";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className={className} />;
}
