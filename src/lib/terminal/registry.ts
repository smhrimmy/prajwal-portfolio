import { VirtualFileSystem } from "./vfs";
import { linuxCommands } from "./commands/linux";
import { portfolioCommands } from "./commands/portfolio";
import { devopsCommands } from "./commands/devops";
import { aiCommands } from "./commands/ai";

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

export const defaultRegistry = new CommandRegistry();

// Register all modular commands
[
  ...linuxCommands,
  ...portfolioCommands,
  ...devopsCommands,
  ...aiCommands
].forEach(cmd => defaultRegistry.register(cmd));
