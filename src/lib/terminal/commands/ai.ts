import { CommandDefinition } from "../registry";
import { askTerminalFn } from "@/actions/terminal-ai";

export const aiCommands: CommandDefinition[] = [
  {
    name: "ask",
    description: "Ask the AI assistant a question",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: ask <question>";
      const query = ctx.args.join(" ");
      const res = await askTerminalFn({ data: query });
      if (!res.success) return `\x1b[1;31mAI Error:\x1b[0m ${res.error}`;
      return `\x1b[1;35mAI:\x1b[0m ${res.text}`;
    }
  }
];
