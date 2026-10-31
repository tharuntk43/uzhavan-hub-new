const fs = require('fs');
const path = 'C:/Users/Tharunkumar/.gemini/antigravity/scratch/uzhavan-hub/client/src/layouts/AppLayout.jsx';
let content = fs.readFileSync(path, 'utf8');

const marker = '{/* ALL 23 MODULES DIRECTORY MODAL */}';
const parts = content.split(marker);

if (parts.length > 2) {
  // Grab the modal code from parts[1] up to </nav>
  const endNavIdx = parts[1].indexOf('</nav>');
  const modalCode = parts[1].slice(0, endNavIdx).trim();

  // Remove the modal from each piece
  const cleanParts = parts.map((p, idx) => {
    if (idx === 0) return p;
    const endIdx = p.indexOf('</nav>');
    return p.slice(endIdx);
  });

  let reassembled = cleanParts.join('');

  // Now append modalCode right before the last closing </div>\n  );\n}
  const lastNav = reassembled.lastIndexOf('</nav>');
  const insertPos = lastNav + '</nav>'.length;

  reassembled = reassembled.slice(0, insertPos) + '\n\n      {/* ALL 23 MODULES DIRECTORY MODAL */}\n      ' + modalCode + '\n' + reassembled.slice(insertPos);

  fs.writeFileSync(path, reassembled, 'utf8');
  console.log('AppLayout cleaned successfully. New length:', reassembled.length);
} else {
  console.log('No cleanup needed, parts length is:', parts.length);
}
