import { CMSPluginWorker, BuilderContext } from '../types';
import fs from 'fs';
import path from 'path';

export const SiteBuilderWorker: CMSPluginWorker = {
  id: 'site-builder',
  name: 'Site Builder',
  description: 'Generates core static site JSON artifacts',
  shouldRun: () => true,
  execute: async (context: BuilderContext) => {
    const { releaseDir, dbData, reportProgress } = context;
    const { site, projects, skills, theme } = dbData;

    reportProgress(20, 'Generating site.json');
    fs.writeFileSync(path.join(releaseDir, 'site.json'), JSON.stringify(site || {}, null, 2));

    reportProgress(40, 'Generating theme.json');
    fs.writeFileSync(path.join(releaseDir, 'theme.json'), JSON.stringify(theme || {}, null, 2));

    reportProgress(60, 'Generating projects.json');
    fs.writeFileSync(path.join(releaseDir, 'projects.json'), JSON.stringify(projects || [], null, 2));

    reportProgress(80, 'Generating skills.json');
    fs.writeFileSync(path.join(releaseDir, 'skills.json'), JSON.stringify(skills || [], null, 2));

    reportProgress(100, 'Core artifacts generated');
  }
};
