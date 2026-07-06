import { CMSPluginWorker, BuilderContext } from '../types';
import fs from 'fs';
import path from 'path';

export const AIBuilderWorker: CMSPluginWorker = {
  id: 'ai-builder',
  name: 'AI Knowledge Builder',
  description: 'Generates LLM-optimized knowledge context',
  shouldRun: () => true,
  execute: async (context: BuilderContext) => {
    const { releaseDir, dbData, reportProgress } = context;
    const { site, projects, skills } = dbData;

    reportProgress(50, 'Assembling knowledge graph...');
    
    const knowledge = {
      identity: site?.name || "Developer",
      bio: site?.bio || "",
      portfolio_context: "This is a portfolio OS. The following projects and skills represent the developer's experience.",
      projects: (projects || []).map((p: any) => ({ name: p.title, tech: p.tech, what_it_does: p.description })),
      skills: skills || [],
      terminal_commands: ["help", "ls", "cd", "cat", "clear", "echo", "whoami", "gui", "theme", "resume"]
    };

    reportProgress(80, 'Writing knowledge.json...');
    fs.writeFileSync(path.join(releaseDir, 'knowledge.json'), JSON.stringify(knowledge, null, 2));

    reportProgress(100, 'AI Knowledge generated');
  }
};
