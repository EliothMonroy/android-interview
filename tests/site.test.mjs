import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const pdfManifest=JSON.parse(await readFile('tests/fixtures/coroutines-pdf-manifest.json','utf8'));
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
test('the coroutines web reference is independent of the workbook and renders all topics',()=>{
 const {w,d,close}=boot({},'#coroutines');
 try {
  const course=w.PRIMERS.find(s=>s.id==='coroutines');
  assert.equal(course.lessons.length,32);
  const ids=Array.from(course.lessons,l=>l.id);assert.equal(new Set(ids).size,ids.length);
  assert.deepEqual([...d.querySelectorAll('#chapter-picker option')].map(o=>o.value),ids);
  assert.deepEqual(Array.from(course.groups).flatMap(g=>Array.from(g.ids)),ids);
  for(const chapter of course.lessons){
   assert.equal(chapter.sourcePage,undefined);assert.ok(chapter.sources.length);
   go(w,`coroutines/${chapter.id}`);
   assert.equal(d.querySelector('h2').textContent,chapter.title);
   const article=d.querySelector('.course-lesson');
   assert.ok(article.querySelectorAll('p').length>=2,chapter.id);
   assert.doesNotMatch(article.textContent,/\b(?:pages?\s+\d|source page|code ?lab|exercise\s+\d|week\s+\d|capstone|worked solution|fixture on)\b/i,chapter.id);
   assert.equal(article.querySelector('a[href*=".pdf"]'),null);
   const snippets=chapter.blocks.filter(b=>b.type==='code');
   assert.deepEqual([...article.querySelectorAll('pre code')].map(n=>n.textContent),Array.from(snippets,b=>b.code));
   const sources=[...d.querySelectorAll('#chapter-resources a[data-reference-link]')];assert.equal(sources.length,chapter.sources.length);
   for(const link of sources){assert.ok(/^https:\/\//.test(link.href));assert.equal(link.target,'_blank');assert.equal(link.rel,'noopener noreferrer');}
   for(const link of d.querySelectorAll('.course-content a[href^="#coroutines/"]'))assert.ok(ids.includes(link.hash.split('/')[1]),link.href);
  }
 }finally{close();}
});
test('saved workbook links open related topics without migrating review history',()=>{
 const saved=['coroutines/coroutines-03','coroutines/coroutines-35','coroutines/coroutines-41','coroutines/coroutines-08','android/compose'];
 const {w,d,close}=boot({'aifg-completed':JSON.stringify(saved)},'#coroutines');
 try {
  for(const [oldId,target] of Object.entries({'03':'07','29':'01','30':'01','31':'01','32':'40','33':'40','35':'27','36':'28'})){
   assert.equal(d.querySelector(`[data-lesson="coroutines-${oldId}"]`),null);
   go(w,`coroutines/coroutines-${oldId}`);
   assert.equal(d.querySelector('[aria-current="true"]').dataset.lesson,`coroutines-${target}`);
   assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'false');
   assert.equal(d.activeElement,d.querySelector('h2'));
  }
  for(const [oldId,target] of [['41','07'],['42','21']]){
   go(w,`coroutines/coroutines-${oldId}`);assert.equal(d.querySelector('[aria-current="true"]').dataset.lesson,`coroutines-${target}`);
   assert.equal(d.activeElement.id,'chapter-resources');
  }
  go(w,'coroutines/coroutines-08');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  assert.equal(d.querySelector('.progress-track').getAttribute('aria-valuenow'),'1');
  assert.deepEqual(JSON.parse(w.localStorage.getItem('aifg-completed')),saved);
 }finally{close();}
});
test('reference navigation, copying, interview answers and independent progress work',async()=>{
 const {w,d,close}=boot({'aifg-completed':'["kotlin/kotlin-null"]'},'#coroutines/coroutines-08');
 try {
  let copied;Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async text=>{copied=text;}}});
  const button=d.querySelector('[data-copy-code]');assert.ok(button);await button.onclick();assert.equal(copied,d.querySelector('pre code').textContent);
  d.getElementById('mark').click();assert.deepEqual(JSON.parse(w.localStorage.getItem('aifg-completed')),['kotlin/kotlin-null','coroutines/coroutines-08']);
  const picker=d.getElementById('chapter-picker');picker.value='coroutines-18';picker.onchange();w.dispatchEvent(new w.HashChangeEvent('hashchange'));
  assert.equal(d.activeElement,d.querySelector('h2'));
  const course=w.PRIMERS.find(s=>s.id==='coroutines'),questionChapter=course.lessons.find(l=>l.blocks.some(b=>b.type==='checkpoint'));assert.ok(questionChapter);
  go(w,`coroutines/${questionChapter.id}`);const checkpoint=d.querySelector('.course-checkpoint');assert.equal(checkpoint.open,false);checkpoint.querySelector('summary').click();assert.equal(checkpoint.open,true);
  const style=d.createElement('style');style.textContent=await readFile('styles.css','utf8');d.head.appendChild(style);assert.notEqual(w.getComputedStyle(checkpoint.querySelector('summary > span')).transform,'rotate(45deg)');
  go(w,'coroutines/coroutines-08/resources');assert.equal(d.activeElement.id,'chapter-resources');
  go(w,'coroutines/coroutines-02');d.getElementById('next').click();w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert.equal(d.querySelector('[aria-current="true"]').dataset.lesson,'coroutines-04');
  d.getElementById('previous').click();w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert.equal(d.querySelector('[aria-current="true"]').dataset.lesson,'coroutines-02');
  go(w,'coroutines/coroutines-40');d.getElementById('next').click();w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert.equal(d.querySelector('h1').textContent,'Data Structures Primer');
 }finally{close();}
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
 assert.equal(createHash('sha256').update(await readFile('docs/study-guides/kotlin-coroutines-study-guide.pdf')).digest('hex'),pdfManifest.pdfSha256);
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
 cacheMap.set('https://guide.test/app.js?v=11','cached js');handlers.fetch({request:{url:'https://guide.test/app.js?v=11',method:'GET',mode:'cors'},respondWith:p=>pending=p});assert.equal(await pending,'cached js');
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
  const expected={kotlin:19,coroutines:32,structures:12,algorithms:19,android:31,design:21};
  for(const s of w.PRIMERS)assert.equal(s.lessons.length,expected[s.id]);
  assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  go(w,'android/compose');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  go(w,'kotlin/kotlin-null');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  go(w,'design/design-walkthrough');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'false');
 } finally {close();}
});
