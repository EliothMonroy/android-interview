import { mkdir, copyFile } from 'node:fs/promises';
import { dirname } from 'node:path';
const files=['index.html','styles.css','app.js','content-kotlin.js','content-android.js','content-design-extra.js','content-interview-extra.js','content-kotlin-review.js','content-android-review.js','content-design-review.js','sw.js','icon.svg','manifest.webmanifest','docs/study-guides/kotlin-coroutines-study-guide.pdf'];
await mkdir('dist',{recursive:true});
await Promise.all(files.map(async file=>{const target=`dist/${file}`;await mkdir(dirname(target),{recursive:true});await copyFile(file,target);}));
console.log(`Built ${files.length} self-contained static assets in dist/`);
