require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase keys in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('Starting migration...');
  
  // Site
  const site = JSON.parse(fs.readFileSync('src/data/cms/site.json', 'utf8'));
  let res = await supabase.from('site').upsert({ id: 1, ...site });
  if (res.error) console.error('Site Error:', res.error.message);
  else console.log('Migrated site config');

  // Theme
  const theme = JSON.parse(fs.readFileSync('src/data/cms/theme.json', 'utf8'));
  res = await supabase.from('theme').upsert({ id: 1, ...theme });
  if (res.error) console.error('Theme Error:', res.error.message);
  else console.log('Migrated theme config');

  // Projects
  const projects = JSON.parse(fs.readFileSync('src/data/cms/projects.json', 'utf8'));
  if (projects.length > 0) {
    res = await supabase.from('projects').delete().neq('id', '000');
    if (res.error) console.error('Projects Delete Error:', res.error.message);
    res = await supabase.from('projects').insert(projects);
    if (res.error) console.error('Projects Insert Error:', res.error.message);
    else console.log('Migrated projects');
  }

  // Skills
  const skills = JSON.parse(fs.readFileSync('src/data/cms/skills.json', 'utf8'));
  if (skills.length > 0) {
    res = await supabase.from('skills').delete().neq('id', 0);
    if (res.error) console.error('Skills Delete Error:', res.error.message);
    res = await supabase.from('skills').insert(skills);
    if (res.error) console.error('Skills Insert Error:', res.error.message);
    else console.log('Migrated skills');
  }

  console.log('Migration script finished.');
}

migrate();
