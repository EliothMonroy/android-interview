import { mkdir, copyFile } from 'node:fs/promises';
const files=['index.html','styles.css','app.js','content-kotlin.js','content-android.js','content-design-extra.js','content-interview-extra.js','content-kotlin-review.js','content-android-review.js','content-design-review.js','sw.js','icon.svg','manifest.webmanifest'];
await mkdir('dist',{recursive:true});
await Promise.all(files.map(file=>copyFile(file,`dist/${file}`)));
console.log(`Built ${files.length} self-contained static assets in dist/`);
