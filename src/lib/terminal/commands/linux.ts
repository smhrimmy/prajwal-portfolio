import { CommandDefinition } from "../registry";

export const linuxCommands: CommandDefinition[] = [
  {
    name: "help",
    description: "Show available commands",
    execute: (ctx) => {
      // registry gives us access to getAll through a workaround or we can just print available basic commands
      return `\x1b[1;32mAvailable Commands:\x1b[0m
  help        Show this message
  clear       Clear the terminal
  pwd         Print working directory
  ls          List directory contents
  tree        List contents in a tree-like format
  cd          Change directory
  cat         Read a file
  mkdir       Make directories
  rm          Remove files or directories
  touch       Change file timestamps (or create empty file)
  echo        Print arguments
  whoami      Print current user
  date        Print current date
  history     Print command history

\x1b[1;34mPortfolio Commands:\x1b[0m
  resume, projects, skills, experience, blog, hire, theme

\x1b[1;33mDevOps Commands:\x1b[0m
  whois, dns, ping, headers, ssl, ports, ip
  
\x1b[1;35mAI Commands:\x1b[0m
  ask <query> Ask the terminal AI assistant
`;
    }
  },
  {
    name: "pwd",
    description: "Print working directory",
    execute: (ctx) => ctx.vfs.getPwd()
  },
  {
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
  },
  {
    name: "cd",
    description: "Change directory",
    execute: (ctx) => {
      const target = ctx.args[0] || "/home/guest";
      const res = ctx.vfs.changeDirectory(target);
      if (!res.success) return res.error || "";
      return "";
    }
  },
  {
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
  },
  {
    name: "whoami",
    description: "Print current user",
    execute: () => "guest"
  },
  {
    name: "date",
    description: "Print current date",
    execute: () => new Date().toString()
  },
  {
    name: "echo",
    description: "Print arguments",
    execute: (ctx) => ctx.args.join(" ")
  },
  {
    name: "mkdir",
    description: "Make directories",
    execute: (ctx) => {
      if (ctx.args.length === 0) return "mkdir: missing operand";
      const target = ctx.args[0];
      const res = ctx.vfs.mkdir(target);
      if (!res.success) return res.error || "";
      return "";
    }
  },
  {
    name: "touch",
    description: "Change file timestamps (or create empty file)",
    execute: (ctx) => {
      if (ctx.args.length === 0) return "touch: missing file operand";
      const target = ctx.args[0];
      const res = ctx.vfs.touch(target);
      if (!res.success) return res.error || "";
      return "";
    }
  },
  {
    name: "rm",
    description: "Remove files or directories",
    execute: (ctx) => {
      if (ctx.args.length === 0) return "rm: missing operand";
      const target = ctx.args[0];
      const res = ctx.vfs.rm(target);
      if (!res.success) return res.error || "";
      return "";
    }
  },
  {
    name: "sudo",
    description: "Execute a command as superuser",
    execute: (ctx) => {
      if (ctx.args.join(" ") === "hire prajwal") return "\x1b[1;32mPermission granted.\nCandidate accepted.\x1b[0m";
      return `[sudo] password for guest: \nSorry, try again.`;
    }
  },
  {
    name: "matrix",
    description: "Enter the matrix",
    execute: () => "\x1b[1;32mWake up, Neo...\nFollow the white rabbit.\x1b[0m"
  },
  {
    name: "tree",
    description: "List contents in a tree-like format",
    execute: (ctx) => {
      const target = ctx.args[0] || ".";
      const path = ctx.vfs.resolvePath(target);
      const rootNode = ctx.vfs.getNode(path);
      if (!rootNode) return `tree: ${target}: No such file or directory`;
      
      let out = `${target}\n`;
      let fileCount = 0;
      let dirCount = 0;

      const walk = (node: any, prefix: string) => {
        if (node.type === 'file') return;
        const keys = Object.keys(node.contents).sort();
        keys.forEach((k, i) => {
          const isLast = i === keys.length - 1;
          const child = node.contents[k];
          
          if (child.type === 'dir') {
            dirCount++;
            out += `${prefix}${isLast ? '└── ' : '├── '}\x1b[1;34m${k}\x1b[0m\n`;
            walk(child, prefix + (isLast ? '    ' : '│   '));
          } else {
            fileCount++;
            out += `${prefix}${isLast ? '└── ' : '├── '}${k}\n`;
          }
        });
      };

      walk(rootNode, "");
      out += `\n${dirCount} directories, ${fileCount} files`;
      return out;
    }
  },
  {
    name: "history",
    description: "Print command history",
    execute: () => {
      try {
        const saved = localStorage.getItem("devos_cmd_history");
        if (saved) {
          const arr = JSON.parse(saved) as string[];
          return arr.map((c, i) => `  ${i+1}  ${c}`).join("\n");
        }
      } catch(e) {}
      return "";
    }
  }
];
