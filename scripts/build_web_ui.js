const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'C:/Users/Tharunkumar/.gemini/antigravity/scratch/uzhavan-hub';
const stitchHtmlPath = path.join(ROOT_DIR, 'client/public/code.html');
const stitchHtml = fs.readFileSync(stitchHtmlPath, 'utf8');

console.log('Read code.html successfully. Length:', stitchHtml.length);
