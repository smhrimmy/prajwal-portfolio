const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../src/components/sections');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(templatesDir);
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const componentName = path.basename(file, '.tsx').toLowerCase();
  
  // Skip if already injected
  if (content.includes('data-portfolio-component=')) return;

  // Find the first <section or <div that comes after "return (" or "return "
  // We'll use a regex to inject it into the first top-level element inside the component
  const regex = /(return\s*\(\s*<\w+)([\s>])/;
  if (regex.test(content)) {
    content = content.replace(regex, `$1 data-portfolio-component="${componentName}"$2`);
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Injected into ${file}`);
  } else {
    // try fallback for return <div... without parenthesis
    const regex2 = /(return\s+<\w+)([\s>])/;
    if (regex2.test(content)) {
      content = content.replace(regex2, `$1 data-portfolio-component="${componentName}"$2`);
      fs.writeFileSync(file, content, 'utf8');
      modifiedCount++;
      console.log(`Injected into ${file} (fallback)`);
    } else {
      console.log(`Failed to inject into ${file}`);
    }
  }
});

console.log(`Total modified: ${modifiedCount}`);
