import { CommandDefinition } from "../registry";

export const portfolioCommands: CommandDefinition[] = [
  {
    name: "projects",
    description: "Navigate to projects section",
    execute: (ctx) => {
      ctx.navigate("#projects");
      return "Navigating to Projects...";
    }
  },
  {
    name: "resume",
    description: "Download resume",
    execute: () => "Initiating download sequence for resume.pdf..."
  },
  {
    name: "theme",
    description: "Change website theme (e.g. theme cyber)",
    execute: (ctx) => {
      if (ctx.args.length === 0) return "Usage: theme [cyber|minimal]";
      const t = ctx.args[0];
      ctx.setTheme(t);
      return `Applied theme: ${t}`;
    }
  },
  {
    name: "skills",
    description: "Navigate to skills section",
    execute: (ctx) => {
      ctx.navigate("#skills");
      return "Navigating to Skills...";
    }
  },
  {
    name: "experience",
    description: "Navigate to experience section",
    execute: (ctx) => {
      ctx.navigate("#experience");
      return "Navigating to Experience...";
    }
  },
  {
    name: "education",
    description: "Navigate to education section",
    execute: (ctx) => {
      ctx.navigate("#education");
      return "Navigating to Education...";
    }
  },
  {
    name: "blog",
    description: "Navigate to blog section",
    execute: (ctx) => {
      ctx.navigate("#blog");
      return "Navigating to Blog...";
    }
  },
  {
    name: "contact",
    description: "Navigate to contact section",
    execute: (ctx) => {
      ctx.navigate("#contact");
      return "Navigating to Contact...";
    }
  },
  {
    name: "hire",
    description: "Hire Prajwal",
    execute: (ctx) => {
      ctx.navigate("#contact");
      return "\x1b[1;32mExcellent choice.\x1b[0m Redirecting to contact form...";
    }
  },
  {
    name: "github",
    description: "Open GitHub profile",
    execute: () => {
      window.open("https://github.com/", "_blank");
      return "Opening GitHub...";
    }
  },
  {
    name: "linkedin",
    description: "Open LinkedIn profile",
    execute: () => {
      window.open("https://linkedin.com/", "_blank");
      return "Opening LinkedIn...";
    }
  }
];
