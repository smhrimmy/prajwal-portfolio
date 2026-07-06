const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d+=c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function run() {
  const jsUrl = 'https://www.praxel.space/assets/ProjectsSection-BTFJ0wLK.js';
  console.log("Fetching", jsUrl);
  
  const js = await fetch(jsUrl);
  
  // Find project objects
  // The structure is likely: {title:"Ai Blogging system",description:"...",tags:["..."],category:"...",github:"...",live:"...",image:"..."}
  const projRegex = /title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*tags:\s*\[([^\]]+)\],\s*category:\s*"([^"]+)",\s*github:\s*"([^"]*)",\s*live:\s*"([^"]*)",\s*image:\s*"([^"]+)"/g;
  
  let projects = [];
  let m;
  while ((m = projRegex.exec(js)) !== null) {
    projects.push({
      id: "p" + Math.random().toString(36).substr(2, 9),
      title: m[1],
      codename: m[1].toUpperCase().replace(/\s+/g, '-').slice(0, 10),
      description: m[2],
      tags: m[3].replace(/"/g, '').split(','),
      category: m[4],
      github: m[5] || "#",
      live: m[6] || "#",
      image: m[7]
    });
  }
  
  if (projects.length > 0) {
    console.log("Extracted Projects:", JSON.stringify(projects, null, 2));
    require('fs').writeFileSync('extracted_projects.json', JSON.stringify(projects, null, 2));
  } else {
    console.log("Regex didn't match. Printing full chunk to analyze:");
    console.log(js);
  }
}

run();
