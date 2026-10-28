/* Dependency-free rendering for the independently authored coroutines reference. */
(() => {
 'use strict';
 const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function safeHref(value) {
  if(/^#coroutines\/coroutines-\d{2}(?:\/resources)?$/.test(value))return value;
  try { const url=new URL(value);return url.protocol==='https:'?url.href:''; } catch { return ''; }
 }
 function runs(parts) {
  return parts.map(part => {
   let result=escape(part.text).replace(/\n/g,'<br>');
   const href=part.href&&safeHref(part.href);
   if(href)result=`<a href="${escape(href)}"${href.startsWith('#')?'':' target="_blank" rel="noopener noreferrer"'}>${result}</a>`;
   return part.strong?`<strong>${result}</strong>`:result;
  }).join('');
 }
 function render(chapter,highlight) {
  let example=0;
  return `<div class="lesson-topline"><span class="badge">${escape(chapter.stage)}</span><a href="#coroutines/${chapter.id}/resources">Chapter resources ↓</a></div>
   <h2 class="lesson-heading">${escape(chapter.title)}</h2><p class="summary">${escape(chapter.summary)}</p>
   <div class="course-content">${chapter.blocks.map(block => {
    switch(block.type) {
     case 'paragraph':return `<p${block.small?' class="course-reading"':''}>${runs(block.runs)}</p>`;
     case 'heading':return `<h3>${escape(block.text)}</h3>`;
     case 'code':return `<div class="code-header"><span>KOTLIN / EXAMPLE ${++example}</span><button class="copy-button" data-copy-code="${example-1}" aria-label="Copy code example ${example}">Copy code</button></div><pre tabindex="0" aria-label="Kotlin example ${example}"><code>${highlight(block.code)}</code></pre>`;
     case 'note':return `<aside class="course-note"><h3>${escape(block.title)}</h3><p>${runs(block.runs)}</p></aside>`;
     case 'checkpoint':return `<details class="answer-card course-checkpoint"><summary><span>${escape(block.prompt)}</span><span aria-hidden="true">+</span></summary><p>${runs(block.runs)}</p></details>`;
     case 'table':return `<div class="course-table-wrap" role="region" aria-label="${escape(chapter.title)} comparison" tabindex="0"><table><thead><tr>${block.headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row=>`<tr>${row.map(cell=>`<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
     default:throw new Error(`Unknown course block: ${block.type}`);
    }
   }).join('')}</div>`;
 }
 function renderResources(chapter) {
  return `<footer class="section-sources course-resources" id="chapter-resources" tabindex="-1" aria-labelledby="resources-heading"><h3 id="resources-heading">Go deeper · Chapter resources</h3>${chapter.sources.map(source=>`<p class="course-reference"><a data-reference-link href="${escape(safeHref(source.url))}" target="_blank" rel="noopener noreferrer">${escape(source.title)} ↗</a><span>${escape(source.description)}</span></p>`).join('')}<p class="course-reference"><a href="docs/study-guides/kotlin-coroutines-study-guide.pdf" target="_blank" rel="noopener noreferrer">Optional companion PDF ↗</a><span>A separate study guide for further reading.</span></p><small>Chapter content and the companion PDF are available offline after caching. External documentation requires internet.</small></footer>`;
 }
 window.CoroutineCourse={render,renderResources};
})();
