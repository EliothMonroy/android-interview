import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const pdfManifest=JSON.parse(await readFile('tests/fixtures/coroutines-pdf-manifest.json','utf8'));
const referenceManifest=JSON.parse(await readFile('tests/fixtures/coroutines-reference-manifest.json','utf8'));
const html=await readFile('index.html','utf8');
const scriptPaths=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match=>match[1].split('?')[0]);
const code=await Promise.all(scriptPaths.map(f=>readFile(f,'utf8')));
function boot(saved={},hash='') {
 const dom=new JSDOM(html,{url:`https://guide.test/${hash}`,runScripts:'outside-only'});
 const w=dom.window;
 w.matchMedia=()=>({matches:false,addEventListener(){}});
 w.confirm=()=>true;
 for(const [k,v] of Object.entries(saved)) w.localStorage.setItem(k,v);
 for(const js of code)w.eval(js);
 return {w,d:w.document,close:()=>w.close()};
}
function go(w,hash){w.location.hash=hash;w.dispatchEvent(new w.HashChangeEvent('hashchange'));}
test('instructional PDF pages retain every word and snippet after course reorganization',async()=>{
 const {w,d,close}=boot({},'#coroutines');
 const sha=text=>createHash('sha256').update(text).digest('hex');
 try {
  assert.equal(sha(await readFile('docs/study-guides/kotlin-coroutines-study-guide.pdf')),pdfManifest.pdfSha256);
  assert.equal(d.querySelector('h1').textContent,'Kotlin Coroutines');
  assert.equal(d.querySelectorAll('#navigation button').length,6);
  for(const page of pdfManifest.pages.filter(p=>p.page<=40)){
   go(w,`coroutines/${page.id}`);
   assert.equal(d.querySelector('h2').textContent,page.title);
   const article=d.querySelector('.course-lesson');assert.ok(article,`page ${page.page} must render as web content`);
   const text=[...article.querySelectorAll('[data-source-text]')].map(n=>n.textContent).join('');
   assert.equal(sha(text.replace(/\s/g,'')),page.textSha256,`page ${page.page}: original content lost or altered`);
   assert.deepEqual([...article.querySelectorAll('pre code')].map(n=>sha(n.textContent)),page.codeSha256);
   assert.equal(article.querySelectorAll('table').length,page.tableCount);
   assert.deepEqual([...article.querySelectorAll('a[data-source-link]')].map(a=>a.href),page.links);
  }
 } finally {close();}
});
test('course resources live in relevant footers and preserve both complete source reference pages',()=>{
 const {w,d,close}=boot({},'#coroutines');const found=new Map();
 try {
  for(const page of pdfManifest.pages.filter(p=>p.page<=40)){
   go(w,`coroutines/${page.id}`);
   const footer=d.getElementById('chapter-resources');assert.ok(footer);
   for(const node of footer.querySelectorAll('[data-resource-id]'))found.set(node.dataset.resourceId,{text:node.textContent,links:[...node.querySelectorAll('a[data-source-link]')].map(a=>a.href)});
  }
  for(const source of referenceManifest){
   const blocks=source.blockIds.map(id=>{assert.ok(found.has(id),`missing original reference block ${id}`);return found.get(id);});
   assert.equal(createHash('sha256').update(blocks.map(b=>b.text).join('').replace(/\s/g,'')).digest('hex'),source.bodySha256);
   assert.deepEqual(blocks.flatMap(b=>b.links),pdfManifest.pages.find(p=>p.page===source.sourcePage).links);
  }
  go(w,'coroutines/coroutines-03');assert.ok(d.querySelector('#chapter-resources a[href="https://kotlinlang.org/docs/coroutines-basics.html"]'));
  assert.equal(d.querySelector('#chapter-resources a[href$="/-shared-flow/"]'),null);
  go(w,'coroutines/coroutines-23');assert.ok(d.querySelector('#chapter-resources a[href$="/-state-flow/"]'));
 }finally{close();}
});
test('the course groups its plan and prerequisites while keeping old reading links and progress valid',()=>{
 const {w,d,close}=boot({'aifg-completed':'["coroutines/coroutines-41","coroutines/coroutines-35","android/compose"]'},'#coroutines');
 try {
  const options=[...d.querySelectorAll('#chapter-picker option')].map(o=>o.value);
  assert.equal(options.length,40);
  assert.deepEqual(options.slice(0,8),['coroutines-01','coroutines-02','coroutines-29','coroutines-30','coroutines-31','coroutines-03','coroutines-35','coroutines-04']);
  assert.ok(options.indexOf('coroutines-28')<options.indexOf('coroutines-36'));
  assert.ok(options.indexOf('coroutines-39')<options.indexOf('coroutines-34'));
  assert.equal(options.at(-1),'coroutines-40');
  assert.equal(d.querySelectorAll('#chapter-picker optgroup[label="FIVE-WEEK STUDY PLAN"] option').length,3);
  assert.equal(d.querySelector('[data-lesson="coroutines-41"]'),null);
  go(w,'coroutines/coroutines-41');assert.equal(d.querySelector('h2').textContent,'Set up a small Kotlin lab');
  assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'false');
  assert.equal(d.activeElement.id,'chapter-resources');assert.match(d.getElementById('course-route-note').textContent,/footer/i);
  go(w,'coroutines/coroutines-35');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  go(w,'coroutines/coroutines-08');const resourcesLink=d.querySelector('a[href="#coroutines/coroutines-08/resources"]');assert.ok(resourcesLink);go(w,resourcesLink.getAttribute('href').slice(1));assert.equal(d.activeElement.id,'chapter-resources');
  go(w,'coroutines/coroutines-31');d.getElementById('next').click();w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert.equal(d.querySelector('h2').textContent,'Set up a small Kotlin lab');
  go(w,'coroutines/coroutines-03');d.getElementById('next').click();w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert.equal(d.querySelector('h2').textContent,'Run snippets and discover tests');
  assert.deepEqual(JSON.parse(w.localStorage.getItem('aifg-completed')),['coroutines/coroutines-41','coroutines/coroutines-35','android/compose']);
 }finally{close();}
});
test('course navigation, independent review progress, checkpoints and per-example copying work',async()=>{
 const {w,d,close}=boot({'aifg-completed':'["kotlin/kotlin-null"]'},'#coroutines/coroutines-03');
 try {
  let copied;Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async text=>{copied=text;}}});
  const buttons=d.querySelectorAll('[data-copy-code]');assert.equal(buttons.length,2);
  const second=d.querySelectorAll('pre code')[1].textContent;await buttons[1].onclick();assert.equal(copied,second);
  d.getElementById('mark').click();
  assert.deepEqual(JSON.parse(w.localStorage.getItem('aifg-completed')),['kotlin/kotlin-null','coroutines/coroutines-03']);
  const picker=d.getElementById('chapter-picker');picker.value='coroutines-33';picker.onchange();w.dispatchEvent(new w.HashChangeEvent('hashchange'));
  const checkpoint=d.querySelector('.course-checkpoint');assert.ok(checkpoint);assert.equal(checkpoint.open,false);
  checkpoint.querySelector('summary').click();assert.equal(checkpoint.open,true);assert.match(checkpoint.querySelector('p').textContent,/permits suspension/);
  assert.equal(d.activeElement,d.querySelector('h2'));
  go(w,'coroutines/coroutines-35');const setup=d.querySelector('a[href="#coroutines/coroutines-27"]');assert.ok(setup,'page references must link to native chapters');
  go(w,'coroutines/coroutines-40');d.getElementById('next').click();w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert.equal(d.querySelector('h1').textContent,'Data Structures Primer');
  go(w,'kotlin/kotlin-null');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
 } finally {close();}
});
test('opening a checkpoint keeps its question text upright',async()=>{
 const {w,d,close}=boot({},'#coroutines/coroutines-33');
 try {
  const style=d.createElement('style');style.textContent=await readFile('styles.css','utf8');d.head.appendChild(style);
  const checkpoint=d.querySelector('.course-checkpoint');checkpoint.querySelector('summary').click();
  assert.ok(checkpoint.open);
  assert.notEqual(w.getComputedStyle(checkpoint.querySelector('summary [data-source-text]')).transform,'rotate(45deg)');
 } finally {close();}
});
test('all primers render all interview lessons with valid quizzes and sources',()=>{
 const {w,d,close}=boot();
 try {
 assert.equal(w.PRIMERS.length,6);let count=0;
 for(const s of w.PRIMERS.filter(s=>s.type!=='course')){assert.ok(s.sources.every(x=>x.url.startsWith('https://')));const ids=new Set();for(const l of s.lessons){count++;for(const field of ['title','summary','useCase','code','pitfall','question','answer']) assert.ok(typeof l[field] === 'string' && l[field].trim(), `${s.id}/${l.id} missing ${field}`);assert.ok(!ids.has(l.id));ids.add(l.id);assert.ok(l.quiz.correct>=0&&l.quiz.correct<l.quiz.options.length);go(w,`${s.id}/${l.id}`);assert.equal(d.querySelector('h2').textContent,l.title);assert.equal(d.querySelector('pre code').textContent,l.code);d.querySelector(`[data-answer="${l.quiz.correct}"]`).click();assert.match(d.getElementById('quiz-feedback').textContent,/^Correct\./);}}
 assert.equal(count,102);
 } finally {close();}
});
test('progress persists, can be toggled, and resets',()=>{
 const {w,d,close}=boot();try{d.getElementById('mark').click();assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');const saved=w.localStorage.getItem('aifg-completed');const second=boot({'aifg-completed':saved});assert.equal(second.d.getElementById('mark').getAttribute('aria-pressed'),'true');second.close();d.getElementById('mark').click();assert.equal(w.localStorage.getItem('aifg-completed'),'[]');d.getElementById('mark').click();d.getElementById('reset-progress').click();assert.equal(w.localStorage.getItem('aifg-completed'),'[]');}finally{close();}
});
test('themes, invalid route, next lesson, wrong quiz, copy fallback',async()=>{
 const {w,d,close}=boot({},'#unknown');try{assert.equal(d.querySelector('h1').textContent,'Kotlin Primer');const theme=d.getElementById('theme');theme.value='dark';theme.onchange();assert.equal(d.documentElement.dataset.theme,'dark');theme.value='system';theme.onchange();assert.equal(d.documentElement.dataset.theme,'light');d.querySelector('[data-answer="0"]').click();assert.match(d.getElementById('quiz-feedback').textContent,/Not quite/);await d.getElementById('copy-code').onclick();assert.match(d.getElementById('toast').textContent,/Select the code/);d.getElementById('next').click();w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert.match(d.querySelector('h2').textContent,/Collections/);}finally{close();}
});
test('binary search completes for found and absent targets and restarts',()=>{
 const {w,d,close}=boot({},'#algorithms');try{for(const target of [3,7,12,18,24,31,42,56,99]){const select=d.getElementById('search-target');select.value=String(target);select.onchange();let steps=0;while(!d.getElementById('step-search').disabled&&steps++<10)d.getElementById('step-search').click();assert.ok(steps<=4);assert.match(d.getElementById('search-status').textContent,target===99?/not found/:/Found/);}d.getElementById('reset-search').click();assert.equal(d.getElementById('step-search').disabled,false);}finally{close();}
});
test('malformed saved progress cannot prevent startup',()=>{
 for(const value of ['oops','{}','null','42','"text"']){const {d,close}=boot({'aifg-completed':value});assert.ok(d.querySelector('h2'));close();}
});
test('Kotlin lessons expose the packaged coroutines PDF in a new tab',async()=>{
 const {w,d,close}=boot({},'#kotlin/kotlin-null');
 try {
  for(const lesson of w.PRIMERS.find(s=>s.id==='kotlin').lessons){
   go(w,`kotlin/${lesson.id}`);
   const link=d.querySelector('a[href="docs/study-guides/kotlin-coroutines-study-guide.pdf"]');
   assert.ok(link,'Kotlin Primer must link to the study guide');
   assert.equal(link.textContent,'Open coroutines study guide');
   assert.equal(link.target,'_blank');assert.ok(link.rel.split(' ').includes('noopener'));
  }
  for(const section of ['structures','algorithms','android','design']){go(w,section);assert.equal(d.querySelector('a[href="docs/study-guides/kotlin-coroutines-study-guide.pdf"]'),null);}
 } finally {close();}
 execFileSync(process.execPath,['scripts/build.mjs']);
 assert.deepEqual(await readFile('dist/docs/study-guides/kotlin-coroutines-study-guide.pdf'),await readFile('docs/study-guides/kotlin-coroutines-study-guide.pdf'));
 for(const script of scriptPaths)assert.deepEqual(await readFile(`dist/${script}`),await readFile(script));
});
test('offline PDF navigation serves the document instead of the app shell',async()=>{
 const handlers={};const pdfURL='https://guide.test/docs/study-guides/kotlin-coroutines-study-guide.pdf';let assets=[];
 const document=new Response(await readFile('docs/study-guides/kotlin-coroutines-study-guide.pdf'),{headers:{'Content-Type':'application/pdf'}});
 const scope={self:{location:{origin:'https://guide.test'},registration:{scope:'https://guide.test/'},addEventListener:(t,f)=>handlers[t]=f,skipWaiting:async()=>{}},caches:{open:async()=>({addAll:async a=>{assets=a;}}),match:async r=>r.url===pdfURL?document:new Response('<html>App shell</html>')},fetch:async()=>{throw new Error('offline');},URL};
 vm.runInNewContext(await readFile('sw.js','utf8'),scope);
 let pending;handlers.install({waitUntil:p=>pending=p});await pending;
 assert.ok(assets.includes('./docs/study-guides/kotlin-coroutines-study-guide.pdf'),'PDF must be available after offline setup');
 handlers.fetch({request:{url:pdfURL,method:'GET',mode:'navigate'},respondWith:p=>pending=p});
 const response=await pending;assert.equal(response.headers.get('Content-Type'),'application/pdf');
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile('docs/study-guides/kotlin-coroutines-study-guide.pdf'));
});
test('service worker caches every local dependency and falls back offline',async()=>{
 const handlers={};const cacheMap=new Map();let added=[];const deleted=[];
 const scope={self:{location:{origin:'https://guide.test'},registration:{scope:'https://guide.test/'},addEventListener:(t,f)=>handlers[t]=f,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>({addAll:async assets=>{added=assets;}}),keys:async()=>['android-field-guide-old','unrelated'],delete:async k=>deleted.push(k),match:async k=>cacheMap.get(typeof k==='string'?k:k.url)},fetch:async()=>{throw new Error('offline');},URL};
 vm.runInNewContext(await readFile('sw.js','utf8'),scope);
 let pending;handlers.install({waitUntil:p=>pending=p});await pending;
 for(const asset of added)await access(asset==='./'?'index.html':asset.split('?')[0]);
 for(const file of [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(x=>x[1]).filter(x=>!x.startsWith('http')))assert.ok(added.includes(`./${file}`));
 handlers.activate({waitUntil:p=>pending=p});await pending;assert.deepEqual(deleted,['android-field-guide-old']);
 cacheMap.set('./index.html','offline page');handlers.fetch({request:{url:'https://guide.test/',method:'GET',mode:'navigate'},respondWith:p=>pending=p});assert.equal(await pending,'offline page');
 cacheMap.set('https://guide.test/app.js?v=9','cached js');handlers.fetch({request:{url:'https://guide.test/app.js?v=9',method:'GET',mode:'cors'},respondWith:p=>pending=p});assert.equal(await pending,'cached js');
});
test('skip link preserves current lesson and navigation focuses new heading',()=>{
 const {w,d,close}=boot({},'#android/compose');try{const link=d.querySelector('.skip-link');link.click();assert.equal(w.location.hash,'#android/compose');assert.equal(d.activeElement.id,'main');go(w,'design/rest');assert.equal(d.activeElement,d.querySelector('.lesson-heading'));}finally{close();}
});
test('optional model context tool uses reviewed state and rejects invalid input',()=>{
 const dom=new JSDOM(html,{url:'https://guide.test/',runScripts:'outside-only'});const w=dom.window;let tool;
 w.matchMedia=()=>({matches:false,addEventListener(){}});w.document.modelContext={registerTool(t){tool=t;}};
 try{for(const js of code)w.eval(js);assert.equal(tool.name,'set_current_lesson_reviewed');assert.equal(tool.annotations.readOnlyHint,false);assert.equal(tool.execute({reviewed:true}).reviewed,true);assert.equal(w.document.getElementById('mark').getAttribute('aria-pressed'),'true');assert.throws(()=>tool.execute({reviewed:'yes'}));assert.equal(tool.execute({reviewed:false}).reviewed,false);}finally{w.close();}
});
test('expanded syllabus preserves original IDs and saved review history',()=>{
 const {w,d,close}=boot({'aifg-completed':'["kotlin/kotlin-null","android/compose","design/graphql"]'},'#design/graphql');
 try {
  const expected={kotlin:19,coroutines:40,structures:12,algorithms:19,android:31,design:21};
  for(const s of w.PRIMERS)assert.equal(s.lessons.length,expected[s.id]);
  assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  go(w,'android/compose');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  go(w,'kotlin/kotlin-null');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  go(w,'design/design-walkthrough');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'false');
 } finally {close();}
});
