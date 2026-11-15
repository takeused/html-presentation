(() => {
 function initializeEditor(){
 'use strict';
 const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
 let embedded={};try{embedded=JSON.parse(q('#savedTextEdits').textContent)}catch{}
 const storageKey='tesla-deck-text-edits-v1'+(typeof embedded.documentId==='string'?':'+embedded.documentId.slice(0,80):'');
 const state={active:false,records:{},originals:new Map(),last:new WeakMap(),focused:null,selected:null,storageOK:true,exporting:false};
 let pristine=null;
 const fields=[
  '.slide h1','.slide h2','.slide h3','.slide h4','.slide p','.slide figcaption','.slide figcaption > span',
  '.slide .cover-flow span','.slide .stamp','.slide .road-node strong','.slide .road-node small',
  '.slide .tech-option small','.slide .big-stat','.slide .op-head strong','.slide .annual-metric strong',
  '.slide .caution > strong','#annualFinancialSummaryValue','#trimVisualCaption','#trimVisualTag','#trimNote','#roadTitle',
  'dialog h2','dialog h3','dialog p','dialog .fin-stat strong','#roadSheetFacts','#roadSheetChecks','#techModalFlow'
 ].join(',');
 const additionalFields='.slide .road-title-button > span:first-child,.slide .tech-option > span:first-child';
 let serial=0,observer;
 const roots=()=>[q('#slides'),...all('dialog')];
 function cleanHTML(html){
  const template=document.createElement('template');template.innerHTML=html;
  const allowed=new Set(['BR','EM','STRONG','B','I','SMALL','SPAN','A','UL','OL','LI','P']);
  function clean(node){
   if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.textContent);
   if(node.nodeType!==Node.ELEMENT_NODE||['SCRIPT','STYLE','IFRAME','OBJECT','SVG','MATH','IMG','VIDEO','INPUT'].includes(node.tagName))return document.createDocumentFragment();
   if(!allowed.has(node.tagName)){const fragment=document.createDocumentFragment();node.childNodes.forEach(child=>fragment.append(clean(child)));if(node.tagName==='DIV')fragment.append(document.createElement('br'));return fragment}
   const el=document.createElement(node.tagName.toLowerCase());
   if(node.tagName==='BR'&&node.classList.contains('mobile-br'))el.className='mobile-br';
   if(node.tagName==='A'){
    try{const href=new URL(node.getAttribute('href')||'',location.href);if(['https:','http:'].includes(href.protocol)){el.href=href.href;el.target='_blank';el.rel='noopener'}}catch{}
   }
   node.childNodes.forEach(child=>el.append(clean(child)));return el;
  }
  const box=document.createElement('div');template.content.childNodes.forEach(node=>box.append(clean(node)));return box.innerHTML;
 }
 function context(el){
  const id=el.id,slide=el.closest('.slide');
  if(id.startsWith('annual')&&!['annualSelector'].includes(id)){
   const year=slide?.querySelector('[data-year].selected')?.dataset.year||'2';
   if(id.startsWith('annualFinancial'))return 'year:'+year+';finance:'+(slide?.querySelector('[data-annual-finance].selected')?.dataset.annualFinance||'profit');
   return 'year:'+year;
  }
  if(el.closest('#financeSectorSheet'))return 'business:'+(el.closest('#financeSectorSheet').dataset.business||'0');
  if(el.closest('#financeMetricModal'))return 'metric:'+(el.closest('#financeMetricModal').dataset.metric||'profit');
  if(['financeChartTitle','financeInsightTitle','financeInsight'].includes(id))return 'finance:'+(slide?.querySelector('[data-finance].selected')?.dataset.finance||'segments');
  if(['trimName','trimLabel','trimTitle','trimText','trimNote','trimVisualCaption','trimVisualTag'].includes(id))return 'trim:'+(slide?.querySelector('#trimLever')?.value||'0');
  if(['roadTitle','roadText','roadNext'].includes(id))return 'road:'+(slide?.querySelector('[data-road].selected')?.dataset.road||'0');
  if(el.closest('#roadSheet')&&id.startsWith('roadSheet'))return 'road:'+(el.closest('#roadSheet').querySelector('[data-sheet-road].selected')?.dataset.sheetRoad||'0');
  if(['techTitle','techText'].includes(id))return 'tech:'+(slide?.querySelector('[data-tech].selected')?.dataset.tech||'1');
  if(el.closest('#techModal')&&id.startsWith('techModal'))return 'tech:'+(el.closest('#techModal').querySelector('[data-modal-tech].selected')?.dataset.modalTech||'1');
  return 'static';
 }
 function key(el){return el.dataset.textEdit+'|'+context(el)}
 function recordFor(el,id){
  const record=state.records[id];
  // A published wording revision supersedes edits saved for an older revision.
  return el.dataset.textRevision&&record?.revision!==el.dataset.textRevision?undefined:record;
 }
 function register(){
  const used=new Set(all('[data-text-edit]').map(el=>el.dataset.textEdit));
  // Register additions after the original fields to keep saved text IDs stable.
  [...all(fields),...all(additionalFields)].forEach(el=>{
   if(el.closest('.video-slide')||el.parentElement?.closest('[data-text-edit]')||el.querySelector('button,input,select,textarea,canvas,video,[id]'))return;
   if(!el.dataset.textEdit){let id=el.id?'id:'+el.id:'';if(!id){do{id='text:'+String(++serial).padStart(3,'0')}while(used.has(id))}el.dataset.textEdit=id;used.add(id)}
   if(state.active){el.contentEditable='true';el.spellcheck=false}
  });
 }
 function loadRecords(value){
  if(value?.version!==1||!value.records||typeof value.records!=='object')return {};
  const result={};Object.entries(value.records).slice(0,1000).forEach(([id,record])=>{
   if(id.length<180&&typeof record?.html==='string'&&typeof record?.original==='string'&&record.html.length<50000&&record.original.length<50000)result[id]={html:cleanHTML(record.html),original:cleanHTML(record.original),...(typeof record.revision==='string'&&record.revision.length<=80?{revision:record.revision}:{})};
  });return result;
 }
 state.records=loadRecords(embedded);
 try{const local=localStorage.getItem(storageKey);if(local)state.records=loadRecords(JSON.parse(local))}catch{state.storageOK=false}
 function status(message){
  q('#editorSaveStatus').textContent=message||(state.storageOK?`이 브라우저에 자동 저장 · ${Object.keys(state.records).length}개 문구`:'브라우저 저장을 사용할 수 없습니다 · HTML로 보관하세요');
  q('#editorRestore').disabled=!state.selected||!state.records[key(state.selected)];
 }
 function persist(){
  try{localStorage.setItem(storageKey,JSON.stringify({version:1,records:state.records}));state.storageOK=true}catch{state.storageOK=false}
  status();
 }
 function observe(){roots().forEach(root=>observer.observe(root,{childList:true,characterData:true,subtree:true}))}
 function apply(){
  observer?.disconnect();register();if(!pristine&&q('#editorToggle'))pristine=document.documentElement.cloneNode(true);
  all('[data-text-edit]').forEach(el=>{
   if(state.active&&el===state.focused)return;
   const id=key(el),previous=state.last.get(el),record=recordFor(el,id),raw=el.innerHTML;
   if(!previous||previous.id!==id||previous.html!==raw)state.originals.set(id,record?.original??cleanHTML(raw));
   if(record){
    if(el.innerHTML!==record.html)el.innerHTML=record.html;
    el.dataset.textOverride='true';el.removeAttribute('aria-label');
   }else delete el.dataset.textOverride;
   state.last.set(el,{id,html:el.innerHTML});
  });
  if(observer)observe();
 }
 function saveField(el){
  const id=key(el),html=cleanHTML(el.innerHTML),original=state.originals.get(id)??recordFor(el,id)?.original??html;
  if(html===original)delete state.records[id];else state.records[id]={html,original,...(el.dataset.textRevision?{revision:el.dataset.textRevision}:{})};
  if(state.records[id])el.dataset.textOverride='true';else delete el.dataset.textOverride;
  state.last.set(el,{id,html:el.innerHTML});persist();
 }
 function setMode(active){
  if(state.focused)saveField(state.focused);
  state.focused=null;state.active=active;document.body.classList.toggle('text-edit-mode',active);
  q('#editorToggle').setAttribute('aria-pressed',String(active));q('#editorToggle').textContent=active?'편집 중':'글자 편집';q('#textEditorBar').hidden=!active;
  window.deckPresentation?.editModeChanged(active);apply();
  all('[data-text-edit]').forEach(el=>{if(active){el.contentEditable='true';el.spellcheck=false}else{el.removeAttribute('contenteditable');el.removeAttribute('spellcheck')}});
  status();
 }
 window.deckEditor={get active(){return state.active}};
 observer=new MutationObserver(apply);apply();observe();
 // Saved text also renders in presentation mode; editing is an explicit toggle.
 if(!q('#editorToggle'))return;

 document.addEventListener('focusin',event=>{
  if(!state.active)return;const el=event.target.closest('[data-text-edit]');if(!el)return;
  state.focused=state.selected=el;status();
 },true);
 document.addEventListener('focusout',event=>{
  if(!state.active)return;const el=event.target.closest('[data-text-edit]');if(!el)return;
  saveField(el);state.focused=null;queueMicrotask(apply);
 },true);
 document.addEventListener('input',event=>{if(state.active){const el=event.target.closest('[data-text-edit]');if(el)saveField(el)}},true);
 document.addEventListener('click',event=>{
  const el=state.active&&event.target.closest('[data-text-edit]');
  if(el){if(document.activeElement!==el)el.focus({preventScroll:true});event.preventDefault();event.stopImmediatePropagation()}
 },true);
 for(const type of ['pointerenter','pointermove','focus'])document.addEventListener(type,event=>{
  if(!state.active)return;const el=event.target;if(el.closest?.('[data-text-edit]')||el.matches?.('button')&&el.querySelector('[data-text-edit]'))event.stopImmediatePropagation();
 },true);
 document.addEventListener('keydown',event=>{
  if(!state.active||!event.target.closest('[data-text-edit]'))return;
  event.stopImmediatePropagation();
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='s'){event.preventDefault();downloadHTML()}
 },true);
 document.addEventListener('paste',event=>{
  if(!state.active||!event.target.closest('[data-text-edit]'))return;
  event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain'));
 },true);
 q('#editorToggle').addEventListener('click',()=>setMode(!state.active));
 q('#editorDone').addEventListener('click',()=>setMode(false));
 q('#editorRestore').addEventListener('click',()=>{
  const el=state.selected;if(!el)return;const id=key(el),record=state.records[id];if(!record)return;
  observer.disconnect();el.innerHTML=record.original;delete state.records[id];delete el.dataset.textOverride;state.originals.set(id,record.original);state.last.set(el,{id,html:el.innerHTML});persist();observe();el.focus();
 });

 const assets=new Map();
 function assetURL(ref){const url=new URL(ref,location.href);if(url.origin!==location.origin)throw new Error('현재 발표자료의 파일만 포함할 수 있습니다.');return url.href}
 async function fetchText(ref){const response=await fetch(assetURL(ref),{credentials:'same-origin'});if(!response.ok)throw new Error('발표자료 파일을 불러오지 못했습니다.');return response.text()}
 function asDataURL(ref){
  if(ref.startsWith('data:'))return Promise.resolve(ref);
  const url=assetURL(ref);if(assets.has(url))return assets.get(url);
  const promise=fetch(url,{credentials:'same-origin'}).then(async response=>{
   if(!response.ok)throw new Error('이미지·영상 파일을 불러오지 못했습니다.');
   const blob=await response.blob();return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
  });assets.set(url,promise);promise.catch(()=>assets.delete(url));return promise;
 }
 async function embedCSS(css,base){
  const matches=[...css.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g)];
  for(const match of matches){if(match[2].startsWith('data:')||match[2].startsWith('#'))continue;const value=await asDataURL(new URL(match[2],base).href);css=css.replaceAll(match[0],`url('${value}')`)}
  return css;
 }
 async function downloadHTML(){
  if(state.exporting)return;if(state.focused)saveField(state.focused);
  state.exporting=true;q('#editorDownload').disabled=true;q('#editorDownload').setAttribute('aria-busy','true');status('HTML 준비 중 · 이미지와 영상까지 포함합니다');
  try{
   const clone=pristine.cloneNode(true);
   clone.querySelectorAll('[contenteditable]').forEach(el=>{el.removeAttribute('contenteditable');el.removeAttribute('spellcheck')});
   clone.querySelector('body').classList.remove('text-edit-mode','video-mode');
   clone.querySelectorAll('.slide').forEach((slide,i)=>{slide.hidden=i!==0;slide.classList.toggle('active',i===0);});
   clone.querySelectorAll('[data-count]').forEach(el=>{const value=+el.dataset.count,decimals=+(el.dataset.decimals||0);el.textContent=(el.dataset.countSign||'')+value.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});delete el.dataset.running});
   clone.querySelector('#textEditorBar').hidden=true;
   clone.querySelector('#editorToggle').setAttribute('aria-pressed','false');clone.querySelector('#editorToggle').textContent='글자 편집';
   clone.querySelectorAll('video').forEach(video=>video.removeAttribute('autoplay'));
   clone.querySelector('#currentPage').textContent='01';clone.querySelector('#currentTitle').textContent=clone.querySelector('.slide').dataset.title;
   clone.querySelector('#prev').disabled=true;clone.querySelector('#next').disabled=false;clone.querySelector('#progress').style.width=(100/clone.querySelectorAll('.slide').length)+'%';
   clone.querySelectorAll('.rail button').forEach((button,i)=>{if(i===0)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current')});
   const payload=JSON.stringify({version:1,documentId:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),records:state.records}).replaceAll('<','\\u003c');clone.querySelector('#savedTextEdits').textContent=payload;
   for(const link of [...clone.querySelectorAll('link[rel="stylesheet"][href]')]){const href=link.getAttribute('href'),style=document.createElement('style');style.textContent=await embedCSS(await fetchText(href),new URL(href,location.href));link.replaceWith(style)}
   for(const el of clone.querySelectorAll('img[src],video[src],[poster]')){
    for(const attribute of ['src','poster']){const ref=el.getAttribute(attribute);if(ref&&!ref.startsWith('data:'))el.setAttribute(attribute,await asDataURL(ref))}
   }
   for(const script of [...clone.querySelectorAll('script[src]')]){const inline=document.createElement('script');inline.textContent=(await fetchText(script.getAttribute('src'))).replace(/<\/script/gi,'<\\/script');script.replaceWith(inline)}
   const blob=new Blob(['<!doctype html>\n'+clone.outerHTML],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob);
   const anchor=document.createElement('a');anchor.href=url;anchor.download='테슬라_발표자료_'+clone.querySelectorAll('.slide').length+'장_편집본.html';anchor.hidden=true;document.body.append(anchor);anchor.click();
   setTimeout(()=>{URL.revokeObjectURL(url);anchor.remove()},60000);status('HTML 다운로드 완료 · 영상과 수정한 문구를 포함했습니다');
  }catch(error){status('다운로드하지 못했습니다 · '+(error.message||'다시 시도해 주세요'))}
  finally{state.exporting=false;q('#editorDownload').disabled=false;q('#editorDownload').removeAttribute('aria-busy')}
 }
 q('#editorDownload').addEventListener('click',downloadHTML);
 }
 // Capture the export template only after all player scripts have been parsed.
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeEditor,{once:true});else initializeEditor();
})();
