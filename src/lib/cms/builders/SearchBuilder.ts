import { CMSPluginWorker, BuilderContext } from '../types';
import fs from 'fs';
import path from 'path';

export const SearchBuilderWorker: CMSPluginWorker = {
  id: 'search-builder',
  name: 'Search Builder',
  description: 'Generates global search index',
  shouldRun: () => true,
  execute: async (context: BuilderContext) => {
    const { releaseDir, dbData, reportProgress } = context;
    const { projects, articles, skills } = dbData;

    reportProgress(10, 'Indexing content...');
    
    const index = {
      projects: (projects || []).map((p: any) => ({ title: p.title, description: p.description, type: 'project' })),
      articles: (articles || []).map((a: any) => ({ title: a.title, description: a.description, type: 'article', slug: a.slug })),
      skills: (skills || []).map((s: any) => ({ category: s.category, items: s.items, type: 'skill' }))
    };

    reportProgress(70, 'Writing index...');
    fs.writeFileSync(path.join(releaseDir, 'search-index.json'), JSON.stringify(index, null, 2));

    reportProgress(100, 'Search index generated');
  }
};
