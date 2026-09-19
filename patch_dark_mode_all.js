const fs = require('fs');
const path = require('path');

const mappings = {
  'bg-white': 'bg-white dark:bg-slate-800',
  'bg-slate-50': 'bg-slate-50 dark:bg-slate-900',
  'bg-slate-100': 'bg-slate-100 dark:bg-slate-800/50',
  'text-slate-900': 'text-slate-900 dark:text-white',
  'text-slate-800': 'text-slate-800 dark:text-slate-100',
  'text-slate-700': 'text-slate-700 dark:text-slate-200',
  'text-slate-600': 'text-slate-600 dark:text-slate-300',
  'text-slate-500': 'text-slate-500 dark:text-slate-400',
  'border-slate-100': 'border-slate-100 dark:border-slate-700/50',
  'border-slate-200': 'border-slate-200 dark:border-slate-700',
  'border-slate-300': 'border-slate-300 dark:border-slate-600',
  'divide-slate-100': 'divide-slate-100 dark:divide-slate-700/50',
  'divide-slate-200': 'divide-slate-200 dark:divide-slate-700',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // We want to match className="<classes>" or className={`<classes>`}
  // Instead of complex AST parsing, we can just replace words safely inside class attributes.
  // A simple approach is to use a regex that matches `className="..."` or `className={...}`
  
  const classNameRegex = /className=(["'])(.*?)\1|className=\{`([^`]+)`\}/g;
  
  content = content.replace(classNameRegex, (match, quote, p2, p3) => {
    let classString = p2 || p3;
    let isTemplate = !!p3;
    
    // Split by whitespace to check exact classes
    let classes = classString.split(/\s+/);
    let newClasses = [];
    
    classes.forEach(cls => {
      // If we find a class we map, and it's not already preceded or followed by a dark variant
      if (mappings[cls]) {
        // Check if a dark: version of this base already exists in the array
        const baseType = cls.split('-')[0]; // e.g., 'bg', 'text', 'border'
        const hasDark = classes.some(c => c.startsWith(`dark:${baseType}-`));
        if (!hasDark) {
          newClasses.push(mappings[cls]);
        } else {
          newClasses.push(cls);
        }
      } else {
        newClasses.push(cls);
      }
    });
    
    // Flatten in case mappings returned string with spaces
    newClasses = newClasses.join(' ').split(/\s+/).filter(Boolean);
    // Remove duplicates
    newClasses = [...new Set(newClasses)].join(' ');

    if (isTemplate) {
      return `className={\`${newClasses}\`}`;
    } else {
      return `className="${newClasses}"`;
    }
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

walkDir('./src');
