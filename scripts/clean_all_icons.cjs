const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../client/src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('material-symbols-outlined')) {
    console.log(`Processing: ${file}`);

    // Ensure Icon is imported
    if (!content.includes('LucideIcons.jsx')) {
      content = `import { Icon } from '../components/icons/LucideIcons.jsx';\n` + content;
    } else if (!content.includes('Icon')) {
      content = content.replace(/import\s*\{([^}]+)\}\s*from\s*['"]\.\.\/components\/icons\/LucideIcons\.jsx['"]/, 'import { $1, Icon } from "../components/icons/LucideIcons.jsx"');
    }

    // Replace material-symbols-outlined with Icon
    content = content.replace(/<span\s+className=["']material-symbols-outlined([^"']*)["'](?:\s+id=["'][^"']+["'])?>([^<]+)<\/span>/g, (match, extraClasses, iconName) => {
      const trimmedIcon = iconName.trim();
      const cleanClasses = extraClasses.trim();
      return `<Icon name="${trimmedIcon}" className="${cleanClasses}" />`;
    });

    // Also replace simple instances without extra classes
    content = content.replace(/<span\s+className=["']material-symbols-outlined["']>([^<]+)<\/span>/g, (match, iconName) => {
      return `<Icon name="${iconName.trim()}" />`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${file}`);
  }
});

console.log('Icon migration complete!');
