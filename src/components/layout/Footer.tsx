import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="relative border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="font-mono text-xs text-muted-foreground">
          <span className="text-gradient font-bold">{profile.name}</span> · built with motion, not templates
        </div>
        <div className="font-mono text-[11px] text-muted-foreground">
          Press <kbd className="rounded bg-muted px-1.5 py-0.5">⌘K</kbd> ·{" "}
          <kbd className="rounded bg-muted px-1.5 py-0.5">T</kbd> for terminal · try the Konami code
        </div>
        <div className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
