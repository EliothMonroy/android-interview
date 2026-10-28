(() => {
'use strict';
const sections = ['kotlin','coroutines','structures','algorithms','android','design'].map(id => window.PRIMERS.find(s => s.id === id));
const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { notify('Storage is unavailable. Changes last for this visit.'); } };
let completed = new Set(read('aifg-completed', []).filter?.(x => typeof x === 'string') || []);
let section, lesson;
let resourceRoute=false, resourceAlias=false, chapterRedirect=false;
let feedback = {};
let toastTimer;
function notify(message) { $('toast').textContent=message; $('toast').hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(() => $('toast').hidden=true,3000); }
const keyFor = (s,l) => `${s.id}/${l.id}`;
function route() {
 const [sid,lid,anchor] = location.hash.slice(1).split('/');
 section=sections.find(s=>s.id===sid)||sections[0];
 const alias=section.aliases?.[lid];
 const redirect=section.redirects?.[lid];
 chapterRedirect=Boolean(redirect);
 resourceAlias=Boolean(alias);
 resourceRoute=section.type==='course'&&(Boolean(alias)||anchor==='resources');
 lesson=section.lessons.find(l=>l.id===(alias||redirect||lid))||section.lessons[0];
 render();
 if(resourceRoute||chapterRedirect)focusLesson();
}
function navigate(s,l) { const hash=`#${s.id}/${l.id}`; if(location.hash===hash) render(); else location.hash=hash; }
function renderNav() {
 $('navigation').innerHTML=sections.map((s,i)=>`<button class="nav-item ${s===section?'active':''}" data-section="${s.id}" ${s===section?'aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${({kotlin:'Kt',coroutines:'Co',structures:'{ }',algorithms:'↗',android:'A',design:'◈'})[s.id]}</span><span class="nav-text">${escape(s.title)}<small>${s.lessons.length} ${s.type==='course'?'chapters':'lessons'}</small></span><span class="nav-count">${String(i+1).padStart(2,'0')}</span></button>`).join('');
 $('navigation').querySelectorAll('button').forEach(b=>b.onclick=()=>{const s=sections.find(s=>s.id===b.dataset.section);navigate(s,s.lessons[0]);});
}
function render() {
 renderNav();
 const index=section.lessons.indexOf(lesson), done=section.lessons.filter(l=>completed.has(keyFor(section,l))).length;
 const isDone=completed.has(keyFor(section,lesson));
 const isCourse=section.type==='course';
 $('current-section').textContent=section.title;
 document.title=`${lesson.title} · Android Interview`;
 $('main').innerHTML=`<div class="eyebrow">${isCourse?'COURSE':'PRIMER'} ${String(sections.indexOf(section)+1).padStart(2,'0')} <span> / </span> ANDROID INTERVIEW</div>
 <div class="section-heading"><h1>${escape(section.title)}</h1><p>${escape(section.subtitle)}</p></div>
 ${section.id==='kotlin'?`<div class="study-resource">${section.id==='kotlin'?'<a class="button" href="#coroutines">Study Kotlin Coroutines</a>':''}<a class="button" href="docs/study-guides/kotlin-coroutines-study-guide.pdf" target="_blank" rel="noopener noreferrer">Open coroutines study guide</a><span class="muted">42-page PDF · Opens in a new tab</span></div>`:''}
 <p class="study-note">${isCourse?'Read by topic. Examples explain behavior and tradeoffs; each chapter links to relevant official documentation.':'Use the quizzes for recall. Before an interview, write the examples from scratch, explain tradeoffs, and complete the practice lessons.'}</p>
 ${chapterRedirect?'<p class="study-note" id="course-redirect-note">This saved link opens the related reference topic. Your review history is unchanged.</p>':''}
 ${resourceAlias?'<p class="study-note" id="course-route-note">The former resources chapters now appear in the relevant chapter footer. This link opens a related chapter and its resources; existing review history is unchanged.</p>':''}
 <div class="section-meta"><span>${section.lessons.length} ${isCourse?'complete chapters':'bite-sized lessons'}</span><span>${done} / ${section.lessons.length} reviewed</span></div><div class="progress-track" role="progressbar" aria-label="${isCourse?'Chapters':'Lessons'} reviewed" aria-valuemin="0" aria-valuemax="${section.lessons.length}" aria-valuenow="${done}"><div style="width:${done/section.lessons.length*100}%"></div></div>
 ${isCourse?`<label class="chapter-picker">Jump to chapter <select id="chapter-picker">${section.groups.map(group=>`<optgroup label="${escape(group.label)}">${group.ids.map(id=>{const l=section.lessons.find(l=>l.id===id),i=section.lessons.indexOf(l);return `<option value="${l.id}" ${l===lesson?'selected':''}>${String(i+1).padStart(2,'0')} · ${escape(l.title)}</option>`;}).join('')}</optgroup>`).join('')}</select></label>`:''}
 <div class="lesson-layout"><nav class="lesson-list" aria-label="Lessons">${section.lessons.map((l,i)=>`${isCourse&&l.group!==section.lessons[i-1]?.group?`<span class="lesson-group">${escape(l.group)}</span>`:''}<button class="lesson-tab ${l===lesson?'active':''}" data-lesson="${l.id}" ${l===lesson?'aria-current="true"':''}><span class="lesson-number">${String(i+1).padStart(2,'0')}</span><span class="lesson-title">${escape(l.title)}</span><span class="lesson-status" aria-label="${completed.has(keyFor(section,l))?'Reviewed':'Not reviewed'}">${completed.has(keyFor(section,l))?'✓':'·'}</span></button>`).join('')}</nav>
 <article class="lesson-card ${isCourse?'course-lesson':''}">${isCourse?window.CoroutineCourse.render(lesson,highlight):`<div class="lesson-topline"><span class="badge">THE CONCEPT</span><span>LESSON ${String(index+1).padStart(2,'0')}</span></div><h2 class="lesson-heading">${escape(lesson.title)}</h2><p class="summary">${escape(lesson.summary)}</p><div class="use-case"><strong>When to use it</strong><p>${escape(lesson.useCase)}</p></div>
 <div class="code-header"><span>KOTLIN <span class="muted">/ example snippet</span></span><button class="copy-button" id="copy-code" data-copy-code="0">Copy code</button></div><pre tabindex="0" aria-label="Kotlin example"><code>${highlight(lesson.code)}</code></pre>
 <p class="pitfall"><strong>Watch out</strong> ${escape(lesson.pitfall)}</p>
 <details class="answer-card"><summary><span><span class="eyebrow">INTERVIEW PROMPT</span>${escape(lesson.question)}</span><span aria-hidden="true">+</span></summary><p>${escape(lesson.answer)}</p></details>
 ${section.id==='algorithms'?visualizerMarkup():''}
 <section class="quiz-card" aria-label="Knowledge check"><div class="eyebrow">CHECK YOUR UNDERSTANDING</div><h3>${escape(lesson.quiz.question)}</h3><div class="quiz-options">${lesson.quiz.options.map((o,i)=>`<button class="quiz-option" data-answer="${i}"><span>${String.fromCharCode(65+i)}</span>${escape(o)}</button>`).join('')}</div><p class="quiz-feedback" id="quiz-feedback" aria-live="polite"></p></section>`}
 <div class="lesson-actions"><button class="mark-button ${isDone?'reviewed':''}" id="mark" aria-pressed="${isDone}">${isDone?'✓ Reviewed':'Mark as reviewed'}</button>${isCourse?`<button class="next-button" id="previous" ${index===0?'disabled':''}>← Previous chapter</button>`:''}<button class="next-button" id="next">${index===section.lessons.length-1?'Next section':isCourse?'Next chapter':'Next lesson'} <span aria-hidden="true">→</span></button></div></article></div>
 ${isCourse?window.CoroutineCourse.renderResources(lesson):`<div class="section-sources"><span>GO DEEPER</span>${(section.sources||[]).map(s=>`<a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)} ↗</a>`).join('')}<small>Reference links require internet. Examples are focused snippets; Android examples assume the relevant project setup and imports.</small></div>`}`;
 $('main').querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>navigate(section,section.lessons.find(l=>l.id===b.dataset.lesson)));
 const examples=isCourse?lesson.blocks.filter(b=>b.type==='code').map(b=>b.code):[lesson.code];
 $('main').querySelectorAll('[data-copy-code]').forEach(button=>button.onclick=async()=>{try {await navigator.clipboard.writeText(examples[Number(button.dataset.copyCode)]);notify('Kotlin example copied.');} catch {notify('Select the code and use your device’s Copy command.');}});
 if($('chapter-picker'))$('chapter-picker').onchange=()=>navigate(section,section.lessons.find(l=>l.id===$('chapter-picker').value));
 if($('previous'))$('previous').onclick=()=>navigate(section,section.lessons[index-1]);
 $('mark').onclick=()=>{const key=keyFor(section,lesson); completed.has(key)?completed.delete(key):completed.add(key);write('aifg-completed',[...completed]);render();$('mark').focus();};
 $('next').onclick=()=>{if(index<section.lessons.length-1) navigate(section,section.lessons[index+1]);else{const s=sections[(sections.indexOf(section)+1)%sections.length];navigate(s,s.lessons[0]);}};
 $('main').querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.answer)));
 if(feedback[keyFor(section,lesson)]!==undefined) showAnswer(feedback[keyFor(section,lesson)]);
 if($('step-search')) setupVisualizer();
}
function highlight(code) {
 return String(code).split(/("(?:\\.|[^"\\])*"|\/\/[^\n]*|\b(?:fun|val|var|if|else|return|class|data|sealed|interface|object|for|while|in|when|is|as|suspend|override|private|import|package|true|false|null)\b)/g).map(part=>{
 const cls=part.startsWith('//')?'token-comment':part.startsWith('"')?'token-string':/^(fun|val|var|if|else|return|class|data|sealed|interface|object|for|while|in|when|is|as|suspend|override|private|import|package|true|false|null)$/.test(part)?'token-keyword':'';
 return cls?`<span class="${cls}">${escape(part)}</span>`:escape(part);
 }).join('');
}
function answer(i) { feedback[keyFor(section,lesson)]=i;showAnswer(i); }
function showAnswer(i) {
 const right=i===lesson.quiz.correct;
 $('quiz-feedback').textContent=`${right?'Correct.':'Not quite.'} ${lesson.quiz.explanation}`;
 $('quiz-feedback').className=`quiz-feedback ${right?'correct':'incorrect'}`;
 $('main').querySelectorAll('[data-answer]').forEach(b=>{const n=Number(b.dataset.answer);b.classList.toggle('selected',n===i);b.classList.toggle('correct',n===lesson.quiz.correct);b.classList.toggle('incorrect',n===i&&!right);b.setAttribute('aria-pressed',String(n===i));});
}
function visualizerMarkup() {return `<section class="practice-panel"><div class="eyebrow">ALGORITHM LAB</div><h3>Watch binary search narrow the field</h3><p>A sorted array. One comparison per step. O(log n) time, O(1) extra space.</p><div class="visualizer-controls"><label>Target <select id="search-target">${[3,7,12,18,24,31,42,56,99].map(n=>`<option value="${n}" ${n===31?'selected':''}>${n}</option>`).join('')}</select></label><button class="button" id="step-search">Step →</button><button class="text-button" id="reset-search">Restart</button></div><div id="array-bars" class="array-bars" aria-label="Sorted values"></div><p id="search-status" aria-live="polite"></p></section>`;}
function setupVisualizer() {
 const values=[3,7,12,18,24,31,42,56];let low=0,high=7,mid=-1,found=false,finished=false,steps=0;
 function draw(message) { $('array-bars').innerHTML=values.map((v,i)=>`<div class="array-bar ${i===mid?(found?'found':'active'):''} ${i<low||i>high?'discarded':''}"><span>${v}</span><small>${i}</small></div>`).join('');$('search-status').textContent=message;$('step-search').disabled=finished; }
 function reset(){low=0;high=7;mid=-1;found=false;finished=false;steps=0;draw('Choose a target, then step through the comparisons.');}
 $('step-search').onclick=()=>{if(finished)return;mid=Math.floor((low+high)/2);const target=Number($('search-target').value);steps++;let message=`Step ${steps}: index ${mid} holds ${values[mid]}. `;if(values[mid]===target){found=true;finished=true;message+=`Found ${target}!`;}else {if(values[mid]<target){low=mid+1;message+='Search the right half.';}else{high=mid-1;message+='Search the left half.';}if(low>high){finished=true;message+=' No candidates remain: target not found.';}}draw(message);};
 $('reset-search').onclick=reset;$('search-target').onchange=reset;reset();
}
let preference;try {preference=localStorage.getItem('aifg-theme')||'system';}catch{preference='system';}
if(!['system','light','dark'].includes(preference))preference='system';
$('theme').value=preference;
const media=matchMedia('(prefers-color-scheme: dark)');
function applyTheme(){document.documentElement.dataset.theme=preference==='system'?(media.matches?'dark':'light'):preference;}
$('theme').onchange=()=>{preference=$('theme').value;try{localStorage.setItem('aifg-theme',preference);}catch{notify('Theme will last for this visit.');}applyTheme();};
media.addEventListener('change',applyTheme);applyTheme();
$('reset-progress').onclick=()=>{if(confirm('Reset all reviewed lessons on this device?')){completed.clear();feedback={};write('aifg-completed',[]);render();notify('Progress reset.');}};
function focusLesson() { const target=resourceRoute?$('chapter-resources'):document.querySelector('.lesson-heading'); target.setAttribute('tabindex','-1'); target.focus(); }
document.querySelector('.skip-link').onclick=event=>{event.preventDefault();$('main').focus();};
window.addEventListener('hashchange',()=>{route();focusLesson();});route();
// Optional agent access uses the same local reviewed state as the visible UI.
if(document.modelContext?.registerTool) {
 try { Promise.resolve(document.modelContext.registerTool({
  name:'set_current_lesson_reviewed',
  description:'Set whether the currently visible lesson has been reviewed on this device.',
  inputSchema:{type:'object',properties:{reviewed:{type:'boolean'}},required:['reviewed'],additionalProperties:false},
  annotations:{readOnlyHint:false,untrustedContentHint:false},
  execute(input){
   if(!input || typeof input.reviewed!=='boolean' || Object.keys(input).some(k=>k!=='reviewed')) throw new Error('Provide only a boolean reviewed value.');
   const key=keyFor(section,lesson);
   if(completed.has(key)!==input.reviewed) $('mark').click();
   return {lesson:key,reviewed:completed.has(key)};
  }
 })).catch(()=>{}); } catch {}
}
if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
 navigator.serviceWorker.register('./sw.js').then(async registration=>{
  await navigator.serviceWorker.ready;
  if(registration.active) $('offline-status').textContent='✓ Ready for offline study';
 }).catch(()=>{$('offline-status').textContent='Offline cache unavailable · local files still work';});
}
})();
