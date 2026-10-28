/* Native, dependency-free rendering for the complete coroutines guide. */
(() => {
 'use strict';
 const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const chapterLink = (page,currentPage) => Number(page)>40 ? `#coroutines/coroutines-${String(currentPage).padStart(2,'0')}/resources` : `#coroutines/coroutines-${String(page).padStart(2,'0')}`;
 function text(value,currentPage) {
  return escape(value).replace(/\b(pages?\s+)(\d{1,2})(?=\b)/gi, (match,label,page) =>
   Number(page)>=1&&Number(page)<=42 ? `${label}<a href="${chapterLink(page,currentPage)}">${page}</a>` : match);
 }
 function runs(parts,currentPage) {
  return parts.map(part => {
   let result = text(part.text,currentPage).replace(/\n/g,'<br>');
   if(part.href) {
    // Imported source links are restricted to HTTPS, never executable markup.
    const url = new URL(part.href);
    result = url.protocol==='https:' ? `<a data-source-link href="${escape(url.href)}" target="_blank" rel="noopener noreferrer">${escape(part.text)}</a>` : escape(part.text);
   }
   return part.strong ? `<strong>${result}</strong>` : result;
  }).join('');
 }
 function timeline() {
  return `<figure class="course-timeline" aria-label="Teaching timeline: orders fails at 50 milliseconds while profile would need 100 milliseconds.">
   <figcaption data-source-text>THE QUESTION THAT DRIVES THE GUIDE</figcaption>
   <div class="timeline-ticks"><span data-source-text>0 ms</span><span data-source-text>50 ms</span><span data-source-text>100 ms</span></div>
   <div class="timeline-lanes"><span class="timeline-label profile-label" data-source-text>profile</span><span class="timeline-label orders-label" data-source-text>orders</span><span class="timeline-failure" data-source-text>failure</span><span class="timeline-success" data-source-text>success?</span><i class="profile-lane" aria-hidden="true"></i><i class="orders-lane" aria-hidden="true"></i></div>
  </figure>`;
 }
 function render(chapter,highlight) {
  let example=0;
  return `<div class="lesson-topline"><span class="badge" data-source-text>${escape(chapter.stage)}</span><a href="docs/study-guides/kotlin-coroutines-study-guide.pdf#page=${chapter.sourcePage}" target="_blank" rel="noopener noreferrer">Source page ${chapter.sourcePage} ↗</a></div>
   <h2 class="lesson-heading" data-source-text>${escape(chapter.title)}</h2><p class="summary" data-source-text>${escape(chapter.summary)}</p>
   <div class="course-content">${chapter.blocks.map(block => {
    switch(block.type) {
     case 'paragraph':return `<p${block.small?' class="course-reading"':''} data-source-text>${runs(block.runs,chapter.sourcePage)}</p>`;
     case 'heading':return `<h3 data-source-text>${escape(block.text)}</h3>`;
     case 'code':return `<div class="code-header"><span>KOTLIN / EXAMPLE ${++example}</span><button class="copy-button" data-copy-code="${example-1}" aria-label="Copy code example ${example}">Copy code</button></div><pre tabindex="0" aria-label="Kotlin example ${example}"><code data-source-text>${highlight(block.code)}</code></pre>`;
     case 'note':return `<aside class="course-note"><h3 data-source-text>${escape(block.title)}</h3><p data-source-text>${runs(block.runs,chapter.sourcePage)}</p></aside>`;
     case 'checkpoint':return `<details class="answer-card course-checkpoint"><summary><span data-source-text>${escape(block.prompt)}</span><span aria-hidden="true">+</span></summary><p data-source-text>${runs(block.runs,chapter.sourcePage)}</p></details>`;
     case 'table':return `<div class="course-table-wrap" role="region" aria-label="${escape(chapter.title)} table" tabindex="0"><table><thead><tr>${block.headers.map(h=>`<th scope="col" data-source-text>${escape(h)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row=>`<tr>${row.map((cell,column)=>`<td data-source-text>${block.headers[column]==='Pages'?`<a href="${chapterLink(cell.split('-')[0],chapter.sourcePage)}">${escape(cell)}</a>`:text(cell,chapter.sourcePage)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
     case 'timeline':return timeline();
     default:throw new Error(`Unknown course block: ${block.type}`);
    }
   }).join('')}</div>`;
 }
 function renderResources(section,chapter) {
  const references=section.references.filter(ref=>!ref.numbers.length||ref.numbers.some(n=>chapter.referenceNumbers.includes(n)));
  return `<footer class="section-sources course-resources" id="chapter-resources" tabindex="-1" aria-labelledby="resources-heading"><h3 id="resources-heading">Go deeper · Chapter resources</h3>${references.map(ref=>`<p class="course-reference" data-resource-id="${ref.id}">${runs(ref.block.runs,chapter.sourcePage)}</p>`).join('')}<small>Reference links require internet. The original PDF remains available above.</small></footer>`;
 }
 window.CoroutineCourse={render,renderResources};
})();
