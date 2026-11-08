import { interviewAudioSourceNotesMarkup } from './interview-audio.js?v=20261108-public-team1';
export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const noteButton=(notes,lang)=>notes?`<button type="button" class="ns-source" data-narrative-notes="${esc(notes)}">${lang==='zh'?'来源与说明':'Sources & notes'} <span aria-hidden="true">＋</span></button>`:'';
export function narrativeSection({id,number,label,title,body,notes='',actions='',beats=1,branch,lang='en'}){
 const count=Math.max(1,Number(beats)),n=String(number).padStart(2,'0');
 return `<section id="${esc(id)}" class="story-step narrative-chapter" data-scene="4" data-chapter-key="${esc(id)}" data-${branch}-step="${n}" data-${branch}-label="${esc(label)}" data-ns-count="${count}" aria-labelledby="${esc(id)}-title" style="--ns-beats:${count}"><div class="ns-viewport"><div class="scene-copy ns-copy"><p class="scene-kicker ns-kicker"><span>${n}</span><span>${esc(label)}</span></p><div class="ns-reading"><h2 id="${esc(id)}-title">${title}</h2><p class="scene-body ns-body">${body}</p></div><div class="ns-reading-tools"><div class="ns-notes-mount">${noteButton(notes,lang)}</div>${count>1?`<nav class="ns-readings" aria-label="${lang==='zh'?'本章阅读':'Chapter readings'}"><button type="button" data-ns-direction="-1" aria-label="${lang==='zh'?'上一段':'Previous reading'}">←</button><span data-ns-count-label>1 / ${count}</span><button type="button" data-ns-direction="1" aria-label="${lang==='zh'?'下一段':'Next reading'}">→</button></nav>`:''}</div>${actions?`<div class="ns-actions">${actions}</div>`:''}</div></div></section>`;
}
export function seekNarrativeReading(id,index,count){const section=document.getElementById(id);if(!section)return;const i=Math.max(0,Math.min(count-1,index));window.scrollTo({top:scrollY+section.getBoundingClientRect().top+(i+.14)/count*Math.max(1,section.offsetHeight-innerHeight),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
export function mountNarrativeReadings(root,readings){
 const states=new Map();
 function setProgress(id,p,immediate=false){const items=readings[id],section=root?.querySelector('#'+id);if(!items?.length||!section)return;const index=Math.min(items.length-1,Math.floor(Math.max(0,p)*items.length));section.style.setProperty('--ns-progress',p);if(states.get(id)===index)return;const prev=states.get(id),item=items[index],mount=section.querySelector('.ns-reading');states.set(id,index);section.dataset.nsReading=String(index);
  mount.getAnimations().forEach(a=>a.cancel());mount.querySelector('h2').innerHTML=item.title;mount.querySelector('.ns-body').textContent=item.body;section.querySelector('.ns-notes-mount').innerHTML=noteButton(item.notes,document.documentElement.lang);
  const label=section.querySelector('[data-ns-count-label]');if(label)label.textContent=`${index+1} / ${items.length}`;
  section.querySelectorAll('[data-ns-direction]').forEach(b=>{b.disabled=Number(b.dataset.nsDirection)<0?index===0:index===items.length-1;});
  if(prev!==undefined&&!immediate&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&section.classList.contains('is-active'))mount.animate([{opacity:0,transform:`translateY(${index>prev?10:-10}px)`},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.16,1,.3,1)'});
 }
 const click=e=>{const button=e.target.closest('[data-ns-direction]');if(!button)return;const section=button.closest('.narrative-chapter'),items=readings[section?.id];if(items)seekNarrativeReading(section.id,(states.get(section.id)||0)+Number(button.dataset.nsDirection),items.length);};root?.addEventListener('click',click);
 return {setProgress,destroy(){root?.removeEventListener('click',click);}};
}
export function mountNarrativeNotes(root=document){
 const dialog=document.createElement('dialog');dialog.className='ns-source-dialog';dialog.setAttribute('aria-labelledby','ns-source-title');document.body.append(dialog);let trigger=null;
 const click=e=>{const button=e.target.closest('[data-narrative-notes]');if(!button)return;trigger=button;const zh=document.documentElement.lang==='zh',section=button.closest('.narrative-chapter');
  const players=section?[...section.querySelectorAll('.interview-audio'),...document.querySelectorAll(`[data-shop-visual="${CSS.escape(section.id)}"] .interview-audio`)]:[];
  const player=players.find(node=>!node.closest('[hidden]'));
  const recordingNotes=player?interviewAudioSourceNotesMarkup(zh?'zh':'en',player.dataset.interviewSet,player.dataset.interviewTopic):'';
  dialog.innerHTML=`<header><h2 id="ns-source-title">${zh?'来源与说明':'Sources & notes'}</h2><form method="dialog"><button aria-label="${zh?'关闭说明':'Close notes'}">×</button></form></header><div class="ns-source-content">${button.dataset.narrativeNotes}${recordingNotes}</div>`;dialog.showModal();};
 const close=()=>trigger?.focus({preventScroll:true});root.addEventListener('click',click);dialog.addEventListener('close',close);return ()=>{root.removeEventListener('click',click);dialog.removeEventListener('close',close);dialog.remove();};
}
