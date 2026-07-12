import fs from 'fs';
import path from 'path';

// Import original data
import { projects } from '../src/data/projects';
import { skills } from '../src/data/skills';
import { experiences, education, certifications } from '../src/data/experience';
import { profile, stats } from '../src/data/profile';
import { socials, githubStats } from '../src/data/socials';

async function seedData() {
  console.log("Compiling old data...");

  // Site Object
  const site = {
    name: profile.name,
    role: profile.role,
    bio: profile.bio,
    email: profile.email,
    location: profile.location,
    calendarUrl: profile.calendarUrl,
    resumeUrl: profile.resumeUrl,
    rotatingTitles: profile.rotatingTitles,
    socials: socials,
    github: githubStats,
    stats: stats,
    experience: experiences.map((e, idx) => ({ id: `exp_${idx}`, ...e })),
    education: education.map((e, idx) => ({ id: `edu_${idx}`, ...e })),
    certifications: certifications.map((c, idx) => ({ id: `cert_${idx}`, ...c })),
    timeline: [] 
  };

  const cmsDir = path.join(process.cwd(), 'src/data/cms');
  const pubDir = path.join(process.cwd(), 'public/generated');
  
  if (!fs.existsSync(cmsDir)) fs.mkdirSync(cmsDir, { recursive: true });
  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

  console.log("Writing site.json");
  const siteStr = JSON.stringify(site, null, 2);
  fs.writeFileSync(path.join(cmsDir, 'site.json'), siteStr);
  fs.writeFileSync(path.join(pubDir, 'site.json'), siteStr);

  console.log("Writing projects.json");
  const parsedProjects = projects.map((p, i) => ({ id: p.id || `proj_${i}`, ...p }));
  const projStr = JSON.stringify(parsedProjects, null, 2);
  fs.writeFileSync(path.join(cmsDir, 'projects.json'), projStr);
  fs.writeFileSync(path.join(pubDir, 'projects.json'), projStr);

  console.log("Writing skills.json");
  const parsedSkills = skills.map((s, i) => ({ id: `skill_${i}`, ...s }));
  const skillStr = JSON.stringify(parsedSkills, null, 2);
  fs.writeFileSync(path.join(cmsDir, 'skills.json'), skillStr);
  fs.writeFileSync(path.join(pubDir, 'skills.json'), skillStr);

  console.log("Data files generated in src/data/cms and public/generated!");
}

seedData().catch(console.error);
