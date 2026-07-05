import { useEffect, useRef, useState } from "react";

const SNIPPETS = ["React", "Next.js", "TypeScript", "Node", "Python", "AI", "Cloud", "Docker", "Git", "Linux"];

interface Item {
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  collected: boolean;
}
interface Bug {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function MiniGame({
  onCollect,
  onComplete,
}: {
  onCollect: (count: number) => void;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [collected, setCollected] = useState(0);
  const [hit, setHit] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0;
    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const items: Item[] = SNIPPETS.map((label) => ({
      label,
      x: rand(60, w - 60),
      y: rand(60, h - 60),
      vx: rand(-0.7, 0.7),
      vy: rand(-0.7, 0.7),
      collected: false,
    }));
    const bugs: Bug[] = Array.from({ length: 5 }, () => ({
      x: rand(40, w - 40),
      y: rand(40, h - 40),
      vx: rand(-1.6, 1.6),
      vy: rand(-1.6, 1.6),
    }));

    const player = { x: w / 2, y: h / 2 };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      player.x = e.clientX - r.left;
      player.y = e.clientY - r.top;
    };
    const onTouch = (e: TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      player.x = e.touches[0].clientX - r.left;
      player.y = e.touches[0].clientY - r.top;
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onTouch, { passive: true });

    let count = 0;
    let hitCooldown = 0;
    let raf = 0;

    const bounce = (o: { x: number; y: number; vx: number; vy: number }, pad: number) => {
      o.x += o.vx;
      o.y += o.vy;
      if (o.x < pad || o.x > w - pad) o.vx *= -1;
      if (o.y < pad || o.y > h - pad) o.vy *= -1;
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);

      // player glow
      const grd = ctx.createRadialGradient(player.x, player.y, 0, player.x, player.y, 26);
      grd.addColorStop(0, "rgba(6,182,212,0.9)");
      grd.addColorStop(1, "rgba(6,182,212,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e6faff";
      ctx.beginPath();
      ctx.arc(player.x, player.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // items
      ctx.font = "600 13px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      for (const it of items) {
        if (it.collected) continue;
        bounce(it, 40);
        const d = Math.hypot(it.x - player.x, it.y - player.y);
        if (d < 34) {
          it.collected = true;
          count++;
          setCollected(count);
          onCollect(count);
          if (count >= SNIPPETS.length && !doneRef.current) {
            doneRef.current = true;
            setTimeout(onComplete, 600);
          }
        }
        ctx.save();
        ctx.shadowColor = "#4f46e5";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "rgba(79,70,229,0.18)";
        const tw = ctx.measureText(it.label).width + 20;
        ctx.beginPath();
        ctx.roundRect(it.x - tw / 2, it.y - 12, tw, 24, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(120,180,255,0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#c8d6ff";
        ctx.fillText(it.label, it.x, it.y + 4);
        ctx.restore();
      }

      // bugs
      for (const b of bugs) {
        bounce(b, 16);
        const d = Math.hypot(b.x - player.x, b.y - player.y);
        if (d < 22 && hitCooldown <= 0) {
          hitCooldown = 60;
          setHit(true);
          setTimeout(() => setHit(false), 400);
        }
        ctx.save();
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (hitCooldown > 0) hitCooldown--;

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
    };
  }, [onCollect, onComplete]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={ref}
        className={`h-full w-full rounded-xl transition-shadow ${hit ? "shadow-[0_0_0_2px_var(--destructive)]" : ""}`}
      />
      <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 font-mono text-xs text-secondary">
        COLLECTED {collected}/{SNIPPETS.length} — avoid the red bugs
      </div>
    </div>
  );
}
