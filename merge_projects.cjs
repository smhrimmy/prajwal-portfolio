const fs = require('fs');

const chunk = fs.readFileSync('chunk.js', 'utf8');

// Regex to capture the array content: i=[{...}]
const arrMatch = chunk.match(/i=\[(\{title:.*?\}\])(?:,c=)/);
if (!arrMatch) {
  console.log("Could not find array");
  process.exit(1);
}

const rawArrStr = '[' + arrMatch[1];
// The string is essentially raw JS code: {title:"...",description:"...",...}
// We can't parse it directly as JSON because keys aren't quoted.
// Let's use a quick script to evaluate it.
const evalScript = `
  const i = ${rawArrStr};
  console.log(JSON.stringify(i));
`;

const result = eval(rawArrStr);

const currentProjects = JSON.parse(fs.readFileSync('src/data/cms/projects.json', 'utf8'));

// Convert the fetched projects to our schema
const newProjects = result.map((p, index) => {
  return {
    id: "prax_" + index,
    title: p.title,
    codename: p.title.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase(),
    description: p.description,
    tags: p.tech || [],
    category: "Full Stack", // generic fallback
    github: "#",
    live: p.liveUrl || "#",
    featured: index < 2, // feature the first two
    accent: p.gradient && p.gradient.includes('cyan') ? '#06b6d4' : '#8b5cf6',
    image: p.image
  }
});

// Merge
// We will append the new ones to the end, but check for exact title duplicates.
const existingTitles = new Set(currentProjects.map(p => p.title.toLowerCase().trim()));
let added = 0;
for (const np of newProjects) {
  if (!existingTitles.has(np.title.toLowerCase().trim())) {
    currentProjects.push(np);
    added++;
  }
}

fs.writeFileSync('src/data/cms/projects.json', JSON.stringify(currentProjects, null, 2));
console.log(`Merged ${added} new projects successfully.`);
