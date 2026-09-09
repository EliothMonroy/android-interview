import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import vm from 'node:vm';
const html=await readFile('index.html','utf8');
const code=await Promise.all(['content-kotlin.js','content-android.js','content-design-extra.js','content-interview-extra.js','content-kotlin-review.js','content-android-review.js','content-design-review.js','app.js'].map(f=>readFile(f,'utf8')));
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
test('all five primers render all interview lessons with valid quizzes and sources',()=>{
 const {w,d,close}=boot();
 try {
 assert.equal(w.PRIMERS.length,5);let count=0;
 for(const s of w.PRIMERS){assert.ok(s.sources.every(x=>x.url.startsWith('https://')));const ids=new Set();for(const l of s.lessons){count++;for(const field of ['title','summary','useCase','code','pitfall','question','answer']) assert.ok(typeof l[field] === 'string' && l[field].trim(), `${s.id}/${l.id} missing ${field}`);assert.ok(!ids.has(l.id));ids.add(l.id);assert.ok(l.quiz.correct>=0&&l.quiz.correct<l.quiz.options.length);go(w,`${s.id}/${l.id}`);assert.equal(d.querySelector('h2').textContent,l.title);assert.equal(d.querySelector('pre code').textContent,l.code);d.querySelector(`[data-answer="${l.quiz.correct}"]`).click();assert.match(d.getElementById('quiz-feedback').textContent,/^Correct\./);}}
 assert.equal(count,99);
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
test('service worker caches every local dependency and falls back offline',async()=>{
 const handlers={};const cacheMap=new Map();let added=[];const deleted=[];
 const scope={self:{location:{origin:'https://guide.test'},registration:{scope:'https://guide.test/'},addEventListener:(t,f)=>handlers[t]=f,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>({addAll:async assets=>{added=assets;}}),keys:async()=>['android-field-guide-old','unrelated'],delete:async k=>deleted.push(k),match:async k=>cacheMap.get(typeof k==='string'?k:k.url)},fetch:async()=>{throw new Error('offline');},URL};
 vm.runInNewContext(await readFile('sw.js','utf8'),scope);
 let pending;handlers.install({waitUntil:p=>pending=p});await pending;
 for(const asset of added)await access(asset==='./'?'index.html':asset.split('?')[0]);
 for(const file of [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(x=>x[1]).filter(x=>!x.startsWith('http')))assert.ok(added.includes(`./${file}`));
 handlers.activate({waitUntil:p=>pending=p});await pending;assert.deepEqual(deleted,['android-field-guide-old']);
 cacheMap.set('./index.html','offline page');handlers.fetch({request:{url:'https://guide.test/',method:'GET',mode:'navigate'},respondWith:p=>pending=p});assert.equal(await pending,'offline page');
 cacheMap.set('https://guide.test/app.js?v=4','cached js');handlers.fetch({request:{url:'https://guide.test/app.js?v=4',method:'GET',mode:'cors'},respondWith:p=>pending=p});assert.equal(await pending,'cached js');
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
  const expected={kotlin:19,structures:12,algorithms:19,android:28,design:21};
  for(const s of w.PRIMERS)assert.equal(s.lessons.length,expected[s.id]);
  assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  go(w,'android/compose');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  go(w,'kotlin/kotlin-null');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'true');
  go(w,'design/design-walkthrough');assert.equal(d.getElementById('mark').getAttribute('aria-pressed'),'false');
 } finally {close();}
});
