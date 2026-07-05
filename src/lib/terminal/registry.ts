import { VirtualFileSystem } from "./vfs";

export type CommandContext = {
  args: string[];
  vfs: VirtualFileSystem;
  setTheme: (theme: string) => void;
  navigate: (path: string) => void;
};

export type CommandDefinition = {
  name: string;
  description: string;
  execute: (ctx: CommandContext) => string | Promise<string>;
};

export class CommandRegistry {
  private commands = new Map<string, CommandDefinition>();

  register(cmd: CommandDefinition) {
    this.commands.set(cmd.name, cmd);
  }

  get(name: string) {
    return this.commands.get(name);
  }

  getAll() {
    return Array.from(this.commands.values());
  }

  async execute(input: string, ctx: CommandContext): Promise<string> {
    const parts = input.trim().split(/\s+/);
    const cmdName = parts[0];
    if (!cmdName) return "";
    
    const cmd = this.commands.get(cmdName);
    if (!cmd) return `command not found: ${cmdName}. type 'help'`;
    
    ctx.args = parts.slice(1);
    try {
      return await cmd.execute(ctx);
    } catch (e: any) {
      return `${cmdName}: error executing command - ${e.message}`;
    }
  }
}

// Built-in commands
export const defaultRegistry = new CommandRegistry();

defaultRegistry.register({
  name: "help",
  description: "Show available commands",
  execute: (ctx) => {
    return `Available commands:\n` + defaultRegistry.getAll().map(c => `  ${c.name.padEnd(10)} ${c.description}`).join("\n");
  }
});

defaultRegistry.register({
  name: "pwd",
  description: "Print working directory",
  execute: (ctx) => ctx.vfs.getPwd()
});

defaultRegistry.register({
  name: "ls",
  description: "List directory contents",
  execute: (ctx) => {
    const target = ctx.args[0] || ".";
    const path = ctx.vfs.resolvePath(target);
    const node = ctx.vfs.getNode(path);
    if (!node) return `ls: cannot access '${target}': No such file or directory`;
    if (node.type === 'file') return target;
    
    const entries = Object.keys(node.contents).sort();
    return entries.map(e => {
      const isDir = node.contents[e].type === 'dir';
      return isDir ? `\x1b[1;34m${e}/\x1b[0m` : e;
    }).join("  ");
  }
});

defaultRegistry.register({
  name: "cd",
  description: "Change directory",
  execute: (ctx) => {
    const target = ctx.args[0] || "/home/guest";
    const res = ctx.vfs.changeDirectory(target);
    if (!res.success) return res.error || "";
    return "";
  }
});

defaultRegistry.register({
  name: "cat",
  description: "Read a file",
  execute: (ctx) => {
    if (ctx.args.length === 0) return "cat: missing operand";
    const target = ctx.args[0];
    const path = ctx.vfs.resolvePath(target);
    const node = ctx.vfs.getNode(path);
    if (!node) return `cat: ${target}: No such file or directory`;
    if (node.type === 'dir') return `cat: ${target}: Is a directory`;
    return node.content;
  }
});

defaultRegistry.register({
  name: "whoami",
  description: "Print current user",
  execute: () => "guest"
});

defaultRegistry.register({
  name: "date",
  description: "Print current date",
  execute: () => new Date().toString()
});

defaultRegistry.register({
  name: "echo",
  description: "Print arguments",
  execute: (ctx) => ctx.args.join(" ")
});

// Easter eggs and portfolio commands
defaultRegistry.register({
  name: "sudo",
  description: "Execute a command as superuser",
  execute: (ctx) => {
    if (ctx.args.join(" ") === "hire prajwal") return "\x1b[1;32mPermission granted.\nCandidate accepted.\x1b[0m";
    return `[sudo] password for guest: \nSorry, try again.`;
  }
});

defaultRegistry.register({
  name: "matrix",
  description: "Enter the matrix",
  execute: () => "\x1b[1;32mWake up, Neo...\nFollow the white rabbit.\x1b[0m"
});

defaultRegistry.register({
  name: "projects",
  description: "Navigate to projects section",
  execute: (ctx) => {
    ctx.navigate("#projects");
    return "Navigating to Projects...";
  }
});

defaultRegistry.register({
  name: "resume",
  description: "Download resume",
  execute: () => "Initiating download sequence for resume.pdf..."
});

defaultRegistry.register({
  name: "theme",
  description: "Change website theme (e.g. theme cyber)",
  execute: (ctx) => {
    if (ctx.args.length === 0) return "Usage: theme [cyber|minimal]";
    const t = ctx.args[0];
    ctx.setTheme(t);
    return `Applied theme: ${t}`;
  }
});

defaultRegistry.register({
  name: "mkdir",
  description: "Make directories",
  execute: (ctx) => {
    if (ctx.args.length === 0) return "mkdir: missing operand";
    const target = ctx.args[0];
    const res = ctx.vfs.mkdir(target);
    if (!res.success) return res.error || "";
    return "";
  }
});

defaultRegistry.register({
  name: "touch",
  description: "Change file timestamps (or create empty file)",
  execute: (ctx) => {
    if (ctx.args.length === 0) return "touch: missing file operand";
    const target = ctx.args[0];
    const res = ctx.vfs.touch(target);
    if (!res.success) return res.error || "";
    return "";
  }
});

defaultRegistry.register({
  name: "rm",
  description: "Remove files or directories",
  execute: (ctx) => {
    if (ctx.args.length === 0) return "rm: missing operand";
    const target = ctx.args[0];
    const res = ctx.vfs.rm(target);
    if (!res.success) return res.error || "";
    return "";
  }
});
