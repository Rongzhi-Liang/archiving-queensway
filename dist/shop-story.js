import { interviewAudioMarkup, mountInterviewAudio } from './interview-audio.js?v=20261108-public-team1';
import { narrativeSection, esc } from './narrative-system.js?v=20261110-about-clean3';
import { shopSources, shopPlaces, shopChapters, ishakReading } from './shop-story-data.js?v=20261108-release1';
const choose=(value,lang)=>value[lang==='zh'?'zh':'en'];
const place=id=>shopPlaces.find(p=>p.id===id);
function notes(item,lang){
 const t=(en,zh)=>lang==='zh'?zh:en;
 const publicSource=item.id==='shop-work'?`<p><a href="${esc(shopSources.strata)}" target="_blank" rel="noopener noreferrer">${t('BCA · strata management','BCA · 分层物业管理')} ↗</a></p>`:'';
 return `<p>${esc(choose(item.note,lang))}</p><p>${t('Sources: interview recordings, the shop directory and photography by Archiving Queensway.','资料来源：采访录音、商户目录；摄影：Archiving Queensway。')}</p>${publicSource}`;
}
export function shopStoryReadings(lang='en'){
 return Object.fromEntries(shopChapters.map(item=>[item.id,[{title:choose(item.title,lang),body:choose(item.body,lang),notes:notes(item,lang)}]]));
}
export function shopStoryMarkup(lang='en'){
 return shopChapters.map((item,i)=>{
  const section=narrativeSection({id:item.id,number:String(i+1).padStart(2,'0'),label:choose(item.label,lang),title:choose(item.title,lang),body:choose(item.body,lang),notes:notes(item,lang),branch:'shop',lang});
  const audio=item.id==='shop-network'?`<div class="ns-interview"><div data-sm-audio-person="toys">${interviewAudioMarkup(lang,'toybros','shop-toybros')}</div><div data-sm-audio-person="sports" hidden>${interviewAudioMarkup(lang,'ishak-work','shop-ishak-work')}</div></div>`:item.id==='shop-stay'?`<div class="ns-interview">${interviewAudioMarkup(lang,'pamela-business','shop-pamela-business')}</div>`:'';
  return audio?section.replace('<div class="ns-reading-tools">',`${audio}<div class="ns-reading-tools">`):section;
 }).join('');
}
function photo(id,lang){
 const p=place(id),t=(en,zh)=>lang==='zh'?zh:en;
 return `<figure class="sm-photo"><div class="sm-image"><img src="assets/shop-photos/${p.image}" alt="${esc(choose(p.alt,lang))}" width="1280" height="960" decoding="async"></div><figcaption><strong>${esc(p.name)}</strong><span>${t('Photo: Archiving Queensway ·','摄影：Archiving Queensway ·')} #${p.unit}</span></figcaption></figure>`;
}
const shell=(id,label,content)=>`<section class="narrative-surface sm-surface" data-shop-visual="${id}" aria-label="${esc(label)}" hidden inert><div class="ns-field sm-field">${content}</div></section>`;
export function shopStoryVisuals(lang='en'){
 const t=(en,zh)=>lang==='zh'?zh:en;
 return shell('shop-work',t('Dirty Laundry: making a unit work','Dirty Laundry：经营的自主空间'),`
  <p class="sm-eyebrow">${t('A tenant’s account · Dirty Laundry','租店经营者的叙述 · Dirty Laundry')}</p>
  ${photo('dirty',lang)}
  <blockquote class="sm-quote">${t('“I can open whenever I want.”','“我可以自己决定什么时候开门。”')}<cite>${t('Karolina · interview excerpt','Karolina · 采访节选，中文译文')}</cite></blockquote>
  ${interviewAudioMarkup(lang)}`)
 +shell('shop-mix',t('Selected businesses on the floor plan','楼层图上的精选商户'),`
  <div class="sm-map-top"><nav class="ns-controls" aria-label="${t('Choose a floor','选择楼层')}"><button type="button" data-sm-floor="2" aria-pressed="true">${t('Level 2','二楼')}</button><button type="button" data-sm-floor="3" aria-pressed="false">${t('Level 3','三楼')}</button></nav><span>${t('Selected businesses','精选商户')}</span></div>
  <div class="sm-map" aria-busy="true"><p role="status">${t('Loading the floor plan…','正在载入楼层图……')}</p></div>
  <div class="sm-map-detail" aria-live="polite"></div>
  <label class="sm-shop-select"><span>${t('Find a shop','选择店铺')}</span><select aria-label="${t('Choose a mapped business','选择图中商户')}">${shopPlaces.map(p=>`<option value="${p.id}">${esc(p.name)} · #${p.unit}</option>`).join('')}</select></label>
  <p class="sm-map-credit">${t('Floor plans: Archiving Queensway','楼层图：Archiving Queensway')}</p>`)
 +shell('shop-network',t('Partnerships and working lives','经营伙伴与工作经历'),`
  <nav class="ns-controls sm-story-tabs" aria-label="${t('Choose a working experience','选择经营与工作经历')}"><button type="button" data-sm-person="toys" aria-pressed="true">${t('Toybros · partners','Toybros · 合伙经营')}</button><button type="button" data-sm-person="sports" aria-pressed="false">${t('Ishak · work','Ishak · 工作延续')}</button></nav>
  <div data-sm-person-panel="toys">${photo('toys',lang)}<p class="sm-quote">${t('Customers visit to talk as well as browse.','顾客来到店里，也为了聊天与相聚。')}<cite>${t('Kelvin · interview account','Kelvin · 采访转述')}</cite></p><div class="sm-sequence" aria-label="${t('Relationships described in the account','叙述中的经营联系')}"><span>${t('Collector friends','收藏者朋友')}</span><i>→</i><span>${t('A shared shop','合伙开店')}</span><i>→</i><span>${t('Neighbouring partners','邻店合作')}</span></div></div>
  <div data-sm-person-panel="sports" hidden>${photo('sports',lang)}<p class="sm-context">${t('Newlink Sports · Shop interior','Newlink Sports · 店内空间')}</p><div class="sm-employment"><div><b>2011</b><span>${t('Starts work in Queensway','开始在女皇道工作')}</span></div><i>→</i><div><b>2018</b><span>${t('Joins Newlink after the earlier shop closes','原店关闭后，转到 Newlink')}</span></div></div></div>`)
 +shell('shop-stay',t('Blueprint Principles and the conditions for continuing','Blueprint Principles 与经营延续的条件'),`
  <p class="sm-eyebrow">${t('Blueprint Principles · beyond a new address','Blueprint Principles · 地址改变之后')}</p>
  ${photo('blueprint',lang)}
  <div class="sm-continuity" aria-label="${t('Questions raised by the accounts','由人物经历提出的问题')}"><div><strong>${t('Space','空间')}</strong><span>${t('Can the work fit?','经营能否安顿？')}</span></div><div><strong>${t('Costs','成本')}</strong><span>${t('Can the business manage?','生意能否负担？')}</span></div><div><strong>${t('Connections','联系')}</strong><span>${t('Can the links continue?','日常能否接续？')}</span></div></div>
`);
}
export function mountShopStory(root=document,{lang='en'}={}){
 const body=root.querySelector('#shopkeepers'),stage=root.querySelector('#shop-visual-stage');
 const t=(en,zh)=>lang==='zh'?zh:en,reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const interviewPlayers=[
  {scene:'shop-work',element:stage.querySelector('[data-shop-visual="shop-work"] .interview-audio')},
  {scene:'shop-network',person:'toys',element:body.querySelector('[data-sm-audio-person="toys"] .interview-audio')},
  {scene:'shop-network',person:'sports',element:body.querySelector('[data-sm-audio-person="sports"] .interview-audio')},
  {scene:'shop-stay',element:body.querySelector('#shop-stay .interview-audio')}
 ].map(item=>({...item,visual:stage.querySelector(`[data-shop-visual="${item.scene}"]`),controller:mountInterviewAudio(item.element,{lang})}));
 const pauseHiddenAudio=()=>interviewPlayers.forEach(item=>{if(stage.hidden||item.visual.hidden||item.element.closest('[data-sm-audio-person]')?.hidden)item.controller.pause();});
 const audioVisibility=new MutationObserver(pauseHiddenAudio);
 [...new Set(interviewPlayers.map(item=>item.visual))].forEach(visual=>audioVisibility.observe(visual,{attributes:true,attributeFilter:['hidden']}));
 audioVisibility.observe(stage,{attributes:true,attributeFilter:['hidden']});
 let disposed=false,regions=null,selected='toys',floor=2,person='toys',active=null;
 try{const saved=JSON.parse(sessionStorage.getItem('qsc-shop-reading')||'null');if(shopPlaces.some(p=>p.id===saved?.selected)){selected=saved.selected;floor=place(selected).floor;}if(saved?.person==='sports')person='sports';}catch{}
 const save=()=>{try{sessionStorage.setItem('qsc-shop-reading',JSON.stringify({selected,person}));}catch{}};
 const animate=node=>{if(!node||reduce.matches)return;node.getAnimations().forEach(a=>a.cancel());node.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.16,1,.3,1)'});};
 function showPerson(next,immediate=false){
  if(person!==next)interviewPlayers.filter(item=>item.scene==='shop-network').forEach(item=>item.controller.pause());
  person=next;const item=next==='sports'?ishakReading:shopChapters[2],section=body.querySelector('#shop-network');
  section.querySelector('h2').innerHTML=choose(item.title,lang);section.querySelector('.ns-body').textContent=choose(item.body,lang);section.querySelector('[data-narrative-notes]').dataset.narrativeNotes=notes(item,lang);
  stage.querySelectorAll('[data-sm-person]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.smPerson===next)));
  stage.querySelectorAll('[data-sm-person-panel]').forEach(panel=>{panel.hidden=panel.dataset.smPersonPanel!==next;if(!panel.hidden&&!immediate)animate(panel);});
  section.querySelectorAll('[data-sm-audio-person]').forEach(panel=>{panel.hidden=panel.dataset.smAudioPerson!==next;});
  pauseHiddenAudio();
  if(!immediate)animate(section.querySelector('.ns-reading'));save();
 }
 function renderMap(immediate=false){
  if(disposed)return;const host=stage.querySelector('.sm-map'),p=place(selected);
  stage.querySelectorAll('[data-sm-floor]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.smFloor)===floor?'true':'false'));
  if(regions){
   host.innerHTML=`<svg viewBox="0 0 1024 768" role="group" aria-label="${esc(t(`Level ${floor}: choose a highlighted shop`,`${floor} 楼：选择高亮店铺`))}"><image class="sm-plan-base" href="assets/floorplans/floor-${floor}.svg" width="1024" height="768"/><g>${shopPlaces.filter(item=>item.floor===floor).map((item,i)=>{const r=regions.floors[String(floor)].find(r=>r.id===item.unit);if(!r)return '';return `<g class="sm-unit${item.id===selected?' is-selected':''}" role="button" tabindex="0" data-sm-place="${item.id}" aria-pressed="${item.id===selected}" aria-label="${esc(`${item.name} · #${item.unit} · ${choose(item.trade,lang)}`)}"><path d="${esc(r.d)}"/><circle class="sm-map-hit" cx="${r.x}" cy="${r.y}" r="36"/><circle class="sm-map-pin" cx="${r.x}" cy="${r.y}" r="21"/><text x="${r.x}" y="${r.y+1}" text-anchor="middle" dominant-baseline="middle">${i+1}</text></g>`;}).join('')}</g></svg>`;
   host.setAttribute('aria-busy','false');if(!immediate)animate(host);
  }
  stage.querySelector('.sm-map-detail').innerHTML=`<img src="assets/shop-photos/${p.image}" width="1280" height="960" alt="${esc(choose(p.alt,lang))}"><div><p class="sm-trade">${esc(choose(p.trade,lang))}</p><h3>${esc(p.name)}</h3><p>#${p.unit} · ${esc(choose(p.detail,lang))}</p></div>`;
  stage.querySelector('.sm-shop-select select').value=selected;save();
 }
 const selectPlace=id=>{if(!shopPlaces.some(p=>p.id===id))return;const oldFloor=floor;selected=id;floor=place(id).floor;renderMap(oldFloor===floor);animate(stage.querySelector('.sm-map-detail'));};
 const click=e=>{const floorButton=e.target.closest('[data-sm-floor]'),placeButton=e.target.closest('[data-sm-place]'),personButton=e.target.closest('[data-sm-person]');if(floorButton){floor=Number(floorButton.dataset.smFloor);selected=shopPlaces.find(p=>p.floor===floor).id;renderMap();}else if(placeButton){selectPlace(placeButton.dataset.smPlace);stage.querySelector(`[data-sm-place="${selected}"]`)?.focus({preventScroll:true});}else if(personButton){showPerson(personButton.dataset.smPerson);}};
 const change=e=>{if(e.target.matches('.sm-shop-select select'))selectPlace(e.target.value);};
 const key=e=>{const point=e.target.closest('[data-sm-place]');if(point&&['Enter',' '].includes(e.key)){e.preventDefault();point.dispatchEvent(new MouseEvent('click',{bubbles:true}));}const tab=e.target.closest('[data-sm-person],[data-sm-floor]');if(tab&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const peers=[...tab.parentNode.querySelectorAll('button')],i=e.key==='Home'?0:e.key==='End'?peers.length-1:(peers.indexOf(tab)+(e.key==='ArrowRight'?1:-1)+peers.length)%peers.length;peers[i].focus();peers[i].click();}};
 stage.addEventListener('click',click);stage.addEventListener('change',change);stage.addEventListener('keydown',key);
 showPerson(person,true);renderMap(true);
 fetch('data/floor-regions.json').then(r=>{if(!r.ok)throw Error('plan');return r.json();}).then(data=>{if(disposed)return;regions=data;renderMap(true);}).catch(()=>{if(disposed)return;const map=stage.querySelector('.sm-map');map.setAttribute('aria-busy','false');map.innerHTML=`<p role="status">${t('Select a shop below to explore its photograph and details. Refresh to reload the floor plan.','选择下方店铺，查看原照与说明。刷新页面可重新载入楼层图。')}</p>`;});
 const dispose=()=>{disposed=true;audioVisibility.disconnect();interviewPlayers.forEach(item=>item.controller.destroy());stage.removeEventListener('click',click);stage.removeEventListener('change',change);stage.removeEventListener('keydown',key);stage.getAnimations({subtree:true}).forEach(a=>a.cancel());};
 dispose.setProgress=(id,p,immediate=false)=>{const visual=stage.querySelector(`[data-shop-visual="${id}"]`);if(!visual)return;visual.style.setProperty('--sm-progress',reduce.matches?1:Math.min(1,Math.max(0,p)));if(active!==id){interviewPlayers.filter(item=>item.scene!==id).forEach(item=>item.controller.pause());active=id;if(!immediate)animate(visual.querySelector('.sm-field'));}};
 return dispose;
}
