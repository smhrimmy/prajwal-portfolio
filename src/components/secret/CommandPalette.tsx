import { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Home, User, FolderGit2, Mail, Sun, Moon, TerminalSquare, Bot, FileText } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { profile } from "@/data/profile";

export function CommandPalette() {
  const open = useAppStore((s) => s.commandOpen);
  const setOpen = useAppStore((s) => s.setCommandOpen);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const theme = useAppStore((s) => s.theme);
  const setTerminalOpen = useAppStore((s) => s.setTerminalOpen);
  const setAssistantOpen = useAppStore((s) => s.setAssistantOpen);
  const unlock = useAppStore((s) => s.unlock);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
        unlock("command-palette");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen, unlock]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("home")}><Home className="mr-2 h-4 w-4" />Home</CommandItem>
          <CommandItem onSelect={() => go("about")}><User className="mr-2 h-4 w-4" />About</CommandItem>
          <CommandItem onSelect={() => go("projects")}><FolderGit2 className="mr-2 h-4 w-4" />Projects</CommandItem>
          <CommandItem onSelect={() => go("contact")}><Mail className="mr-2 h-4 w-4" />Contact</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { toggleTheme(); setOpen(false); }}>
            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle Theme
          </CommandItem>
          <CommandItem onSelect={() => { setTerminalOpen(true); setOpen(false); }}>
            <TerminalSquare className="mr-2 h-4 w-4" />Open Terminal
          </CommandItem>
          <CommandItem onSelect={() => { setAssistantOpen(true); setOpen(false); }}>
            <Bot className="mr-2 h-4 w-4" />Ask AI Assistant
          </CommandItem>
          <CommandItem onSelect={() => { window.open(profile.resumeUrl, "_blank"); setOpen(false); }}>
            <FileText className="mr-2 h-4 w-4" />Download Resume
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
