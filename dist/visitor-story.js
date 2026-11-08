import { interviewAudioMarkup, mountInterviewAudio } from './interview-audio.js?v=20261108-public-team1';
import { narrativeSection, mountNarrativeReadings, seekNarrativeReading, esc } from './narrative-system.js?v=20261108-public-team1';
import { visitorReadings, visitorPhotos, visitorLabels } from './visitor-story-data.js?v=20261108-public-copy1';
const text=(lang,en,zh)=>lang==='zh'?zh:en;
const ids=['visitor-route','visitor-discovery','visitor-return'];

export function visitorStoryMarkup(lang='en'){
 const readings=visitorReadings(lang),labels=visitorLabels(lang);
 return ids.map((id,i)=>{
  const section=narrativeSection({id,number:i+1,label:labels[id],...readings[id][0],beats:readings[id].length,branch:'visitor',lang});
  return id==='visitor-return'?section.replace('<div class="ns-reading-tools">',`<div class="ns-interview">${interviewAudioMarkup(lang,'ishak-customers','visitor-ishak-customers')}</div><div class="ns-reading-tools">`):section;
 }).join('');
}
const shell=(id,label,content)=>`<section class="narrative-surface vs-surface" data-visitor-visual="${id}" aria-label="${esc(label)}" hidden inert><div class="ns-field vs-field">${content}</div></section>`;
function tabs(lang,id,labels){return `<nav class="ns-controls vs-tabs" aria-label="${text(lang,'Choose a reading','选择本章内容')}">${labels.map((label,i)=>`<button type="button" data-vs-seek="${id}" data-vs-index="${i}" aria-pressed="${i===0}">${esc(label)}</button>`).join('')}</nav>`;}
function photo(item,lang){
 return `<figure class="vs-photo"><button type="button" class="vs-photo-open" data-vs-photo aria-label="${text(lang,'Enlarge original photograph','放大原照片')}"><img src="${item.src}" alt="${esc(item.alt)}" decoding="async"><span aria-hidden="true">↗</span></button><figcaption><strong>${esc(item.caption)}</strong><span>${esc(item.credit)}</span></figcaption></figure>`;
}
export function visitorStoryVisuals(lang='en'){
 const t=(en,zh)=>text(lang,en,zh),photos=visitorPhotos(lang);
 return shell('visitor-route',t('Everyday activities at Queensway','女皇道的日常活动'),photo(photos.activities,lang))
 +shell('visitor-discovery',t('Discovering another shop','发现另一家店'),photo(photos.discovery,lang))
 +shell('visitor-return',t('A continuing customer relationship','持续的顾客关系'),`
  ${tabs(lang,'visitor-return',[t('Before the journey','出发之前'),t('Returning customers','熟客再来')])}
  <div class="vs-return-scene">
   <div class="vs-return-photo">${photo(photos.ishak,lang)}</div>
   <div class="vs-return-visual" aria-live="polite"><div class="vs-return-steps" aria-label="${t('Enquire, reserve, visit','询问、预留、到店')}"><span data-vs-step="0"></span><i aria-hidden="true">→</i><span data-vs-step="1"></span><i aria-hidden="true">→</i><span data-vs-step="2"></span></div><p data-vs-return-caption></p></div>
  </div>`);
}

export function mountVisitorStory(root=document,{lang='en'}={}){
 const t=(en,zh)=>text(lang,en,zh),stage=root.querySelector('#visitor-visual-stage'),body=root.querySelector('#visitors'),content=visitorReadings(lang),readings=mountNarrativeReadings(body,content),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const returnVisual=stage.querySelector('[data-visitor-visual="visitor-return"]'),audioElement=body.querySelector('#visitor-return .interview-audio'),interview=mountInterviewAudio(audioElement,{lang});
 const pauseHiddenAudio=()=>{if(stage.hidden||returnVisual.hidden)interview.pause();};
 const audioVisibility=new MutationObserver(pauseHiddenAudio);
 audioVisibility.observe(stage,{attributes:true,attributeFilter:['hidden']});
 audioVisibility.observe(returnVisual,{attributes:true,attributeFilter:['hidden']});
 let active=null,photoTrigger=null;
 const beats=new Map();
 const animate=(node,immediate=false)=>{if(!node)return;node.getAnimations().forEach(a=>a.cancel());if(!immediate&&!reduced.matches)node.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.16,1,.3,1)'});};
 const returnSteps=[
  [t('Enquire','询问'),t('Reserve','预留'),t('Visit','到店')],
  [t('Discuss','交流'),t('Get to know','熟悉'),t('Return','再来')]
 ];
 const returnCaptions=[
  t('Ask about a model or size. Have it set aside. Try it in the shop.','问清型号或尺码，留好商品，再到店试一试。'),
  t('A price discussion can grow into a familiar connection.','从一次价格交流，逐渐建立熟悉的联系。')
 ];
 function showBeat(id,index,immediate=false){
  const visual=stage.querySelector(`[data-visitor-visual="${id}"]`);if(!visual)return;
  visual.dataset.beat=String(index);
  visual.querySelectorAll('[data-vs-seek]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.vsIndex)===index?'true':'false'));
  if(id==='visitor-return'){
   interview.pause();interview.setClip(content[id][index].key,{reset:true});
   visual.querySelectorAll('[data-vs-step]').forEach((el,i)=>{el.textContent=returnSteps[index][i];});
   visual.querySelector('.vs-return-steps').setAttribute('aria-label',returnSteps[index].join(', '));
   visual.querySelector('[data-vs-return-caption]').textContent=returnCaptions[index];
   animate(visual.querySelector('.vs-return-visual'),immediate);
  }
 }
 const dialog=document.createElement('dialog');dialog.className='vs-photo-dialog';dialog.setAttribute('aria-label',t('Original photograph','原始照片'));dialog.innerHTML=`<form method="dialog"><button aria-label="${t('Close photograph','关闭照片')}">${t('Close','关闭')} ×</button></form><img alt=""><p></p>`;document.body.append(dialog);
 const close=()=>{if(photoTrigger?.isConnected)photoTrigger.focus({preventScroll:true});};dialog.addEventListener('close',close);
 const click=e=>{
  const seek=e.target.closest('[data-vs-seek]'),imageButton=e.target.closest('[data-vs-photo]');
  if(seek)seekNarrativeReading(seek.dataset.vsSeek,Number(seek.dataset.vsIndex),content[seek.dataset.vsSeek].length);
  else if(imageButton){const img=imageButton.querySelector('img');photoTrigger=imageButton;dialog.querySelector('img').src=img.src;dialog.querySelector('img').alt=img.alt;dialog.querySelector('p').textContent=imageButton.closest('figure').querySelector('figcaption').innerText;dialog.showModal();}
 };
 const clipChange=e=>{
  const index=content['visitor-return'].findIndex(item=>item.key===e.detail?.id);
  if(index<0||beats.get('visitor-return')===index)return;
  interview.pause();seekNarrativeReading('visitor-return',index,content['visitor-return'].length);
 };
 audioElement.addEventListener('interviewclipchange',clipChange);
 const key=e=>{
  const tab=e.target.closest('button[data-vs-seek]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();const peers=[...tab.parentNode.querySelectorAll('button')],i=e.key==='Home'?0:e.key==='End'?peers.length-1:(peers.indexOf(tab)+(e.key==='ArrowRight'?1:-1)+peers.length)%peers.length;peers[i].focus();peers[i].click();
 };
 stage.addEventListener('click',click);stage.addEventListener('keydown',key);
 ids.forEach(id=>showBeat(id,0,true));
 pauseHiddenAudio();
 const dispose=()=>{readings.destroy();audioVisibility.disconnect();audioElement.removeEventListener('interviewclipchange',clipChange);interview.destroy();stage.removeEventListener('click',click);stage.removeEventListener('keydown',key);dialog.removeEventListener('close',close);dialog.remove();stage.getAnimations({subtree:true}).forEach(a=>a.cancel());};
 dispose.setProgress=(id,p,immediate=false)=>{
  if(!content[id])return;readings.setProgress(id,p,immediate);
  const index=Math.min(content[id].length-1,Math.floor(Math.max(0,p)*content[id].length));
  if(beats.get(id)!==index){beats.set(id,index);showBeat(id,index,immediate);}
  if(active!==id){interview.pause();active=id;animate(stage.querySelector(`[data-visitor-visual="${id}"] .vs-field`),immediate);}
 };
 return dispose;
}
