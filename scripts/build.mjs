import { mkdir, copyFile } from 'node:fs/promises';
const files=['index.html','styles.css','app.js','content-kotlin.js','content-android.js','sw.js','icon.svg','manifest.webmanifest'];
await mkdir('dist',{recursive:true});
await Promise.all(files.map(file=>copyFile(file,`dist/${file}`)));
console.log(`Built ${files.length} self-contained static assets in dist/`);
