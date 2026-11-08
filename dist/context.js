import {readData,esc,pick,sourceItems,sourcesMarkup} from './research-utils.js?v=20261020-revision3';
import {mountContextMarket} from './context-market.js?v=20261020-revision3';
import {mountContextPlanning} from './context-planning.js?v=20261108-release1';
import {mountContextDocuments,sourceDisplayFrame,sourceImageMarkup} from './context-documents.js?v=20261108-release1';
import {mountContextIndices} from './context-indices.js?v=20261105-propertyvisuals';

/** A photographic history flows into markets, neighbourhood geography and original papers. */
export function mountContext(container,{lang='en',start='timeline',inline=false,stepAnchor=null,propertySlots={},onNavigate=()=>{},onCompare=()=>{},onReturn=()=>{},onChapterChange=()=>{}}={}){
 const t=(en,zh)=>lang==='zh'?zh:en,p=value=>pick(value,lang),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let alive=true,active=-1,frame=0,dispose=()=>{},navigate=()=>{},selectScene=()=>{},deactivateScene=()=>{},updateHistory=()=>{};
 container.innerHTML=`<div class="c-data-error" role="status">${t('Opening the archive…','正在展开档案…')}</div>`;
 const ready=Promise.all([readData('history-scenes.json?v=20261108-release1'),readData('market-expanded.json'),readData('research-sources.json?v=20261021-archive2')]).then(([history,listingData,sourceData])=>{
  if(!alive)return;
  const scenes=history.scenes,sources=[...sourceItems(sourceData),...sourceItems(listingData.sources||[])];
  const headline=value=>{const raw=p(value);if(raw.includes('<em>'))return raw;if(raw.includes('\n')){const [first,...rest]=raw.split('\n');return `${esc(first)}<br><em>${esc(rest.join(' '))}</em>`;}const split=lang==='zh'?raw.indexOf('，'):raw.indexOf('. ');return split>0?`${esc(raw.slice(0,split+1))}<br><em>${esc(raw.slice(split+1).trim())}</em>`:esc(raw);};
  const beats=[...scenes.map(s=>({...s,chapter:'timeline',visual:'photo',title:headline(s.title),body:p(s.body),date:p(s.date),ids:s.sourceIds||[]})),
   {id:'market',chapter:'prices',visual:'market',date:t('QUEENSWAY · PROPERTY LISTINGS','QUEENSWAY · 物业挂牌'),title:t('One place.<br><em>Two markets.</em>','同一个地方，<br><em>两个市场。</em>'),body:t('Rent shapes the monthly cost of running a shop. Sale prices express the cost of owning a piece of the building. Explore both on the same chart, then select a point to meet the space behind the price.','租金构成经营一家店的每月空间成本；售价体现拥有这栋建筑一部分的资产成本。在同一张图中探索两者，点选数据，查看价格背后的具体空间。'),ids:[...new Set(listingData.records.map(r=>r.sourceId).filter(Boolean))]},
   {id:'regional',chapter:'prices',visual:'indices',date:t("2011–2018 · The market before 2019","2011—2018年 · 2019年之前的市场"),title:t("A changing market.<br><em>Different pressures.</em>","市场在变，<br><em>处境各有不同。</em>"),body:t("After rising earlier in the decade, Central Region shop prices and rents fell. By 2018, both were below their 2011 starting levels. Price shapes an owner’s asset value; rent is a tenant’s expense and a landlord’s income. The same market can mean different things to different people.","中区商铺售价与租金先升后降，到2018年均低于2011年的起点。售价关系到业主的资产价值；租金是租户的支出，也是出租业主的收入。同样的市场变化，落到每个人身上，意义并不相同。"),ids:['C01','C02']},
   {id:'planning',chapter:'planning',visual:'planning',date:t('URA SPACE · MASTER PLAN 2025','URA SPACE · 2025年总体规划'),title:t('A neighbourhood<br><em>within reach.</em>','一座商场，<br><em>连接周边生活。</em>'),body:t('Queensway sits among homes, shops, healthcare and transport. Follow the 400, 800 and 1,200 metre rings to see how nearby uses form a shared neighbourhood. Select a planning zone or a local landmark to explore the places around the mall.','Queensway周围分布着住宅、商业、医疗与交通设施。沿400、800与1,200米距离圈，观察这些用途如何组成共同的生活圈。点选规划分区或周边地标，探索商场与街区的联系。'),ids:['P07','P08','P09']},
   {id:'documents',chapter:'documents',visual:'document',date:t('EIGHT ORIGINAL PAGES · ONE PLACE','八张原始页面 · 同一个地方'),title:t('Open the papers.<br><em>Read the place.</em>','翻开原件，<br><em>读懂这个地方。</em>'),body:t('History, ownership, planning, prices and rents each leave a paper trail. Select a sheet to bring it to the front and follow the highlighted passage.','历史、产权、规划、价格与租金，都留下了文字记录。点选一张纸，让它移至最上方，并沿高亮段落展开阅读。'),ids:[]},
   {id:'return',chapter:'return',visual:'photo',...{image:'assets/team/S_Pamela.JPG',mediaType:'photo',imageAlt:{en:'Pamela inside Blueprint Principles.',zh:'Pamela 在 Blueprint Principles 店内。'},credit:{en:'Photograph: Archiving Queensway',zh:'摄影：Archiving Queensway'},sourceUrl:'assets/team/S_Pamela.JPG',imageSourceUrl:'assets/team/S_Pamela.JPG',imageDateRelation:{en:'Pamela · Blueprint Principles, Queensway',zh:'Pamela · Queensway的Blueprint Principles'}},date:t('BACK TO THE PEOPLE','回到人的故事'),title:t('Value grows<br><em>through people.</em>','人的生活，<br><em>让价值生长。</em>'),body:t('Land, income and ownership meet the work, relationships and memories of the people here. Continue their stories to see how these forms of value share the same place.','土地、收入与产权，与这里人们的工作、关系及记忆交汇。继续他们的故事，看这些价值如何共同存在于同一个地方。'),ids:[]}
  ].filter(beat=>!inline||beat.id!=='return');
  const indexOf=id=>beats.findIndex(b=>b.id===id),nav=[['timeline',t('History','历史'),0],['prices',t('Markets','市场'),indexOf('market')],['planning',t('Neighbourhood','街区'),indexOf('planning')],['documents',t('Papers','文件'),indexOf('documents')]];
  container.innerHTML=`<div class="context-story context-revision${inline?' context-integrated':''}" data-visual="photo" data-beat="0">
   <div class="c-stage" aria-label="${t('A photographic and data-led story','历史影像与数据故事')}"><div class="c-photo-background"><figure class="c-photo-layer"><img alt=""></figure><figure class="c-photo-layer"><img alt=""></figure></div><div class="c-stage-shade" aria-hidden="true"></div><div class="c-map-era" aria-hidden="true"></div>
    <div class="c-visual c-market-mount" inert></div><div class="c-visual c-index-mount" inert></div><div class="c-visual c-planning-mount" inert></div><div class="c-visual c-document-mount" inert></div>
    <div class="c-timeline" style="--event-count:${scenes.length}" aria-label="${t('History timeline','历史时间轴')}"><div class="c-timeline-rule"><i></i></div>${scenes.map((s,i)=>`<button data-c-jump="${i}"><i></i><span>${esc(p(s.date))}</span></button>`).join('')}</div>
    <a class="c-photo-credit" target="_blank" rel="noopener"></a><button class="c-history-enlarge" data-c-history-enlarge hidden>${t('Read the original page','放大阅读原页')} ↗</button>
   </div>
   <nav class="c-nav" aria-label="${t('Story chapters','故事章节')}">${nav.map(([id,label,i])=>`<button data-c-jump="${i}" data-c-nav="${id}">${label}</button>`).join('')}</nav>
   <div class="c-steps">${beats.map((b,i)=>`<section class="c-step${inline?' story-step evidence-step':''}" id="ev-${b.id}" data-c-step="${i}" data-evidence-id="${b.id}" data-chapter-key="${b.chapter==='timeline'?'chapter-history':'ev-'+b.id}" data-evidence-visual="${b.visual}" data-nav-label="${esc(b.date+' · '+b.title.replace(/<[^>]+>/g,' '))}" aria-labelledby="ev-title-${b.id}"><div class="c-copy${inline?' scene-copy':''}"><p class="c-kicker${inline?' scene-kicker':''}"><span>${String(i+1).padStart(2,'0')}</span><span class="c-date">${b.date}</span></p><h${i===0&&!inline?'1':'2'} id="ev-title-${b.id}">${b.title}</h${i===0&&!inline?'1':'2'}><p class="c-deck${inline?' scene-body':''}">${b.body}</p>${b.id==='return'?`<div class="c-return"><button data-c-return>${t('Continue the main story','继续主线故事')} ↗</button><button data-c-compare>${t('Compare perspectives','并置三种视角')} ↗</button></div>`:`<button class="c-source-link" data-c-sources="${i}">${t('References','参考来源')} <span>＋</span></button>`}</div></section>`).join('')}</div>
   <div class="c-progress"><span data-c-count>01</span><i><b></b></i><span>${beats.length}</span><span class="c-scroll-hint">${t('SCROLL TO UNFOLD','向下滚动，展开故事')} ↓</span></div>
   <div class="c-records-backdrop" hidden></div><${inline?'dialog':'aside'} class="c-records" hidden role="dialog" aria-modal="true" aria-label="${t('References','参考来源')}"><header><span>${t('FROM THE ARCHIVE','资料原点')}</span><button data-c-close-sources aria-label="${t('Close references','关闭来源')}">×</button></header><div class="c-records-body"></div></${inline?'dialog':'aside'}>
  </div>`;
  const root=container.querySelector('.context-story'),dialog=root.closest('dialog'),scrollRoot=dialog||window,steps=[...root.querySelectorAll('.c-step')],stage=root.querySelector('.c-stage'),copies=steps.map(step=>step.querySelector('.c-copy'));
  if(inline){
   // Narrative sections are peers of every other main chapter; only their visuals stay on the shared stage.
   const historyPart=document.createElement('section');
   historyPart.id='chapter-history';historyPart.className='story-chapter vertical-history';
   historyPart.setAttribute('aria-label',t('History · timeline','历史 · 时间轴'));
   const historicalSteps=steps.filter(step=>step.dataset.chapterKey==='chapter-history');
   const spine=document.createElement('div');spine.className='history-spine';spine.setAttribute('aria-hidden','true');spine.innerHTML='<i></i><b></b>';
   historyPart.append(spine);
   historicalSteps.forEach((step,index)=>{
    const beat=beats[index],year=beat.id==='origins'?'1970s':String(beat.year),detail=p(beat.date);
    step.classList.add('history-moment');step.dataset.side=index%2?'right':'left';step.dataset.historyIndex=String(index);
    const figure=document.createElement('figure');figure.className='history-media';figure.dataset.media=beat.mediaType||'photo';
    figure.innerHTML=`<button class="history-image-button" data-c-history-enlarge="${index}" aria-label="${esc(t('Enlarge historical image: ','放大历史影像：')+detail)}"><span class="history-image-surface">${sourceImageMarkup(beat,p(beat.imageAlt)).replace('<img ','<img loading="lazy" decoding="async" ')}</span><span class="history-image-open" aria-hidden="true">↗</span></button><figcaption><a href="${esc(beat.imageSourceUrl||beat.sourceUrl)}" target="_blank" rel="noopener">${esc(p(beat.credit))} ↗</a></figcaption>`;
    const crop=figure.querySelector('.c-source-crop');if(crop)crop.style.aspectRatio=String(crop.dataset.sourceRatio);
    const date=document.createElement('div');date.className='history-date';
    date.innerHTML=`<button data-c-jump="${index}" aria-label="${esc(detail)}"><span class="history-date-year">${year}</span><small class="history-date-detail">${esc(detail)}</small></button>`;
    step.append(date,figure);historyPart.append(step);
   });
   steps.filter(step=>['regional','planning','documents'].includes(step.dataset.evidenceId)).forEach(step=>{
    step.classList.add('guided-evidence');
    const viewport=document.createElement('div');viewport.className='guided-copy-viewport';
    viewport.append(step.querySelector('.scene-copy'));step.append(viewport);
   });
   const moved=Object.entries({market:'02',regional:'02',planning:'05'}).map(([id,order])=>{
    const slot=propertySlots[id],step=steps[indexOf(id)];
    if(!slot||!step)return null;
    step.dataset.propertyStep=order;
    step.dataset.chapterKey=id==='regional'?'ev-market':'ev-'+id;
    step.dataset.propertyLabel=id==='planning'?t('Future land use','未来土地用途'):t('Property values','物业价值');
    step.dataset.scene='4';
    step.querySelector('.scene-kicker span').textContent=step.dataset.propertyStep;
    if(id==='market'){
     const beat=beats[indexOf(id)];
     beat.date=t('PROPERTY VALUE · UNIT LISTINGS','物业价值 · 单元挂牌');
     beat.title=t('A price for<br><em>a particular space.</em>','一个单元，<br><em>一份要价。</em>');
     beat.body=t('Across 29 advertisements observed on 19–20 October 2026, 14 offered units for sale and 15 for rent. Floor area and asking amount vary from one space to another. Switch between the two markets and select a point to read the advertisement behind it.',
      '2026年10月19—20日观察到的29条广告中，14条出售、15条出租。不同空间的广告面积与要价各不相同。切换租售市场，点选数据，查看背后的具体广告。');
     step.querySelector('h2').innerHTML=beat.title;
     step.querySelector('.c-date').textContent=beat.date;
     step.querySelector('.c-deck').textContent=beat.body;
    }
    if(id==='regional'){
     const beat=beats[indexOf(id)];
     beat.date=t('PROPERTY VALUE · REGIONAL MARKET','物业价值 · 区域市场');
     step.querySelector('.c-date').textContent=beat.date;
    }
    slot.replaceWith(step);
    return step;
   });
   stepAnchor.replaceWith(historyPart,...steps.filter(step=>step.dataset.chapterKey!=='chapter-history'&&!moved.includes(step)));
   root.querySelector('.c-steps').remove();
   root.querySelector('.c-nav').remove();
   root.querySelector('.c-progress').remove();
  }
  let historyAnimation=0,historyTime=0;
  const historyPart=inline?document.querySelector('#chapter-history'):null;
  const historyMotion=historyPart?[...historyPart.querySelectorAll('.history-moment')].map(element=>({element,reveal:0,parallax:0,targetReveal:0,targetParallax:0})):[];
  function paintHistory(time){
   historyAnimation=0;if(!alive)return;
   const delta=Math.min(50,historyTime?time-historyTime:16);historyTime=time;
   const easing=reduced.matches?1:1-Math.exp(-delta/115);let moving=false;
   historyMotion.forEach(motion=>{
    motion.reveal+=(motion.targetReveal-motion.reveal)*easing;
    motion.parallax+=(motion.targetParallax-motion.parallax)*easing;
    if(Math.abs(motion.targetReveal-motion.reveal)>.002||Math.abs(motion.targetParallax-motion.parallax)>.002)moving=true;
    motion.element.style.setProperty('--history-reveal',String(motion.reveal));
    motion.element.style.setProperty('--history-parallax',String(reduced.matches?0:motion.parallax));
   });
   if(moving)historyAnimation=requestAnimationFrame(paintHistory);
  }
  updateHistory=()=>{
   if(!historyPart||!alive)return;
   const h=innerHeight,group=historyPart.getBoundingClientRect();
   if(group.bottom<0||group.top>h)return;
   historyMotion.forEach(motion=>{
    const box=motion.element.getBoundingClientRect();
    motion.targetReveal=reduced.matches?1:Math.max(0,Math.min(1,(h*.98-box.top)/(h*.35)));
    motion.targetParallax=Math.max(-1,Math.min(1,(h*.5-box.top-box.height*.5)/h));
    motion.element.classList.toggle('is-past',box.bottom<h*.5);
   });
   const nodes=historyPart.querySelectorAll('.history-date');
   const first=nodes[0].getBoundingClientRect(),last=nodes[nodes.length-1].getBoundingClientRect();
   const nodeOffset=innerWidth<=700?18:-15;
   const start=first.top+nodeOffset,end=last.top+nodeOffset;
   const spine=historyPart.querySelector('.history-spine');spine.style.top=(start-group.top)+'px';spine.style.height=(end-start)+'px';
   historyPart.style.setProperty('--history-progress',String(Math.max(0,Math.min(1,(h*.52-start)/(end-start)))));
   if(!historyAnimation){historyTime=0;historyAnimation=requestAnimationFrame(paintHistory);}
  };
  let pendingFocus=-1,pendingFocusTop=0,lastFocus=null,photoIndex=-1,currentPhoto='',photoToken=0,selectedDocument=null;
  const market=mountContextMarket(root.querySelector('.c-market-mount'),{lang,data:listingData,sources});
  const narrativeStates=new Map();let regionalReadings=[],paperReadings=[],paperPages=[],motionSuspended=false;
  function updateNarrative(id,narrative){
   const index=indexOf(id),copy=copies[index],title=headline(narrative.title),body=p(narrative.description);
   const previous=narrativeStates.get(id),signature=title+body;
   if(previous?.signature===signature)return;
   copy.querySelectorAll('.c-reading-outgoing').forEach(el=>el.remove());
   const parts=[copy.querySelector('.c-kicker'),copy.querySelector('h2'),copy.querySelector('.c-deck')];
   parts.forEach(el=>el.getAnimations().forEach(animation=>animation.cancel()));
   const direction=(narrative.stageIndex??0)<(previous?.stage??0)?-1:1;
   const animate=previous&&steps[index].classList.contains('is-active')&&!reduced.matches&&!document.hidden&&!motionSuspended&&!(['regional','documents'].includes(id)&&innerWidth<=700);
   let outgoing;
   if(animate){
    outgoing=document.createElement('div');outgoing.className='c-reading-outgoing';outgoing.inert=true;outgoing.setAttribute('aria-hidden','true');
    parts.forEach(el=>{const old=el.cloneNode(true);old.removeAttribute('id');old.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));outgoing.append(old);});
   }
   narrativeStates.set(id,{signature,stage:narrative.stageIndex??0});
   copy.querySelector('h2').innerHTML=title;copy.querySelector('.c-deck').textContent=body;
   if(narrative.kicker){copy.querySelector('.c-date').textContent=p(narrative.kicker);beats[index].date=p(narrative.kicker);}
   beats[index].title=title;beats[index].body=body;
   if(narrative.sourceIds)beats[index].ids=[...narrative.sourceIds];
   for(const source of narrative.sources||[])if(!sources.some(item=>item.id===source.id))sources.push(source);
   steps[index].dataset.guidedPhase=String(narrative.stageIndex??0);
   if(animate){
    copy.append(outgoing);
    const exit=outgoing.animate([{opacity:1,transform:'translate3d(0,0,0)'},{opacity:0,transform:'translate3d(0,'+(-12*direction)+'px,0)'}],{duration:210,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
    exit.onfinish=()=>outgoing.remove();
    parts.forEach((el,i)=>el.animate([{opacity:0,transform:'translate3d(0,'+(16*direction)+'px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:480,delay:100+i*35,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
   }
  }
   const paperHeadlines={heritage:t('Built into<br><em>everyday life.</em>','日常生活，<br><em>在此扎根。</em>'),'mixed-use':t('Shops and homes.<br><em>Planned together.</em>','商铺与住家，<br><em>共同规划。</em>'),'retail-price':t('An asset.<br><em>A wider market.</em>','一项资产，<br><em>置身更大市场。</em>'),'retail-rent':t('A place to trade.<br><em>A monthly cost.</em>','经营的空间，<br><em>每月的投入。</em>'),'collective-consent':t('Many owners.<br><em>One agreement.</em>','许多业主，<br><em>一份协议。</em>')};
  function appendMobileReadings(id,stories){
   if(!inline)return;
   const index=indexOf(id),group=document.createElement('div');group.className='c-mobile-readings';
   const number=steps[index].dataset.propertyStep||(id==='documents'?'07':'05');
   group.innerHTML=stories.map((story,i)=>'<article class="c-mobile-reading" data-reading="'+i+'"><p class="c-kicker"><span>' +number+'</span><span>'+esc(p(story.kicker))+'</span></p><h2>'+headline(story.title)+'</h2><p class="c-deck">'+esc(p(story.description))+'</p><button class="c-source-link" data-c-sources="'+index+'">'+t('References','参考来源')+' <span>＋</span></button></article>').join('');
   steps[index].append(group);
  }
  function mobileReadings(stories){regionalReadings=stories;appendMobileReadings('regional',stories);}
  const paperReading=(doc,i,turn=i)=>({title:paperHeadlines[doc.id]||headline(doc.narrativeTitle||doc.title),description:p(doc.narrative||doc.note),kicker:p(doc.sourceLabel||doc.title),stageIndex:turn});
  const indices=mountContextIndices(root.querySelector('.c-index-mount'),{lang,propertyStory:!!propertySlots.regional,onLensChange:lens=>updateNarrative('regional',lens),onStoriesReady:mobileReadings});
  const planning=mountContextPlanning(root.querySelector('.c-planning-mount'),{lang,propertyStory:!!propertySlots.planning,onNarrativeChange:narrative=>updateNarrative('planning',narrative)});
  const documents=mountContextDocuments(root.querySelector('.c-document-mount'),{lang,onChange:(doc,i,turn)=>{
   selectedDocument=doc;updateNarrative('documents',paperReading(doc,i,turn));
  },onReady:pages=>{paperPages=pages;paperReadings=pages.map((doc,i)=>paperReading(doc,i));appendMobileReadings('documents',paperReadings);}});
  function fitHistoryCrops(){
   [...root.querySelectorAll('.c-photo-layer .c-source-crop'),...(historyPart?.querySelectorAll('.history-media .c-source-crop')||[])].forEach(crop=>{const box=crop.parentElement.getBoundingClientRect(),ratio=Number(crop.dataset.sourceRatio),width=Math.min(box.width,box.height*ratio);crop.style.width=width+'px';crop.style.height=width/ratio+'px';});
  }
  function showPhoto(beat){
   if(!beat.image)return;root.dataset.media=beat.mediaType||'photo';root.querySelector('[data-c-history-enlarge]').hidden=beat.mediaType!=='document';
   const credit=root.querySelector('.c-photo-credit');credit.href=beat.imageSourceUrl||beat.sourceUrl;credit.innerHTML=`<span>${esc(p(beat.imageDateRelation))}</span><span>${esc(p(beat.credit))} ↗</span>`;
   if(currentPhoto===beat.image)return;currentPhoto=beat.image;const token=++photoToken;photoIndex=(photoIndex+1)%2;
   const layers=[...root.querySelectorAll('.c-photo-layer')],next=layers[photoIndex];next.dataset.media=beat.mediaType||'photo';next.innerHTML=sourceImageMarkup(beat,p(beat.imageAlt));const img=next.querySelector('img');fitHistoryCrops();
   const reveal=()=>{if(!alive||token!==photoToken)return;layers.forEach(layer=>{layer.classList.toggle('is-current',layer===next);layer.setAttribute('aria-hidden',String(layer!==next));});};
   if(img.complete)reveal();else img.onload=reveal;
  }
  let historyViewer=null,historyViewerResize=null;
  function openHistoryPage(index=active){
   const beat=beats[index];if(!beat?.image||historyViewer)return;
   const focus=document.activeElement,readerPage=beat.viewerFullPage?{...beat,displayCrop:null}:beat;let scale=1;
   const viewer=document.createElement('dialog');historyViewer=viewer;viewer.className='c-history-dialog';viewer.setAttribute('aria-label',t('Original historical page','历史原始页面'));
   viewer.innerHTML=`<header><span>${esc(p(beat.credit))}</span><button data-history-close>${t('Back to story','返回故事')} ×</button></header><div class="c-history-tools"><button data-history-zoom>${t('Enlarge','放大')} +</button><button data-history-fit>${t('Fit page','适合页面')}</button><a href="${esc(beat.sourceUrl)}" target="_blank" rel="noopener">${t('Original publication','原始出版物')} ↗</a></div><div class="c-history-viewport" tabindex="0">${sourceImageMarkup(readerPage,p(beat.imageAlt))}</div><footer>${esc(p(beat.imageDateRelation))}</footer>`;
   document.body.append(viewer);const image=viewer.querySelector('img'),viewport=viewer.querySelector('.c-history-viewport');
   const fit=()=>{const display=sourceDisplayFrame(readerPage),ratio=readerPage.displayCrop?display.width/display.height:(image.naturalWidth||1280)/(image.naturalHeight||720),surface=viewport.querySelector('.c-source-crop')||image;const width=Math.min(viewport.clientWidth-40,(viewport.clientHeight-40)*ratio)*scale;surface.style.width=width+'px';surface.style.maxWidth='none';if(readerPage.displayCrop)surface.style.height=width/ratio+'px';};
   const close=()=>{historyViewerResize?.disconnect();historyViewerResize=null;viewer.close();viewer.remove();historyViewer=null;document.body.classList.remove('context-history-open');focus?.focus({preventScroll:true});};
   viewer.addEventListener('click',event=>{if(event.target.closest('[data-history-close]'))close();if(event.target.closest('[data-history-zoom]')){scale=Math.min(5,scale*1.5);fit();}if(event.target.closest('[data-history-fit]')){scale=1;fit();}});
   viewer.addEventListener('cancel',event=>{event.preventDefault();event.stopPropagation();close();});viewer.showModal();if(inline)document.body.classList.add('context-history-open');image.onload=fit;if(image.complete)fit();historyViewerResize=new ResizeObserver(fit);historyViewerResize.observe(viewport);
  }
  function activate(index,immediate=false){
   const beat=beats[index],instant=immediate||document.hidden||reduced.matches;
   // Safari can suspend a fixed layer's CSS transition in an occluded window.
   // Reassert the outer stage on every selection, including an unchanged scene.
   root.querySelectorAll('.c-visual').forEach(el=>{
    const shown=el.classList.contains({'market':'c-market-mount','indices':'c-index-mount','planning':'c-planning-mount','document':'c-document-mount'}[beat.visual]||'__none');
    el.style.transition=instant?'none':'';
    el.style.opacity=shown?'1':'0';el.style.visibility=shown?'visible':'hidden';el.style.pointerEvents=shown?'auto':'none';
    el.inert=!shown;el.setAttribute('aria-hidden',String(!shown));
   });
   if(index===active)return;active=index;root.dataset.visual=beat.visual;root.dataset.beat=String(index);root.dataset.chapter=beat.chapter;root.querySelector('.c-photo-background').setAttribute('aria-hidden',String(beat.visual!=='photo'));
   if(!inline){
    steps.forEach((el,i)=>{el.classList.toggle('is-active',i===index);el.inert=i!==index;el.setAttribute('aria-hidden',String(i!==index));});
    copies.forEach((el,i)=>{el.classList.toggle('is-active',i===index);el.inert=i!==index;el.setAttribute('aria-hidden',String(i!==index));});
   }
   onChapterChange(beat.chapter);
   indices.setActive?.(beat.visual==='indices');planning.setActive?.(beat.visual==='planning');
   if(beat.visual==='photo')showPhoto(beat);
   root.querySelector('.c-map-era').textContent=beat.chapter==='timeline'?String(beat.year||''):'';
   if(!inline)root.querySelector('[data-c-count]').textContent=String(index+1).padStart(2,'0');
   root.querySelectorAll('[data-c-nav]').forEach(button=>button.setAttribute('aria-current',button.dataset.cNav===beat.chapter?'step':'false'));
   root.querySelectorAll('.c-timeline button').forEach((button,i)=>{button.classList.toggle('is-past',i<index);button.setAttribute('aria-current',i===index?'step':'false');});
   const timeline=root.querySelector('.c-timeline'),current=timeline.querySelector('[aria-current=step]');if(current&&innerWidth<=700)timeline.scrollTo({left:Math.max(0,current.offsetLeft-timeline.clientWidth/2+current.clientWidth/2),behavior:reduced.matches?'instant':'smooth'});
  }
  function update(){
   frame=0;if(!alive)return;
   const top=dialog?.getBoundingClientRect().top||0,h=dialog?.clientHeight||innerHeight,probe=top+h*.52;
   let index=0;for(let i=0;i<steps.length;i++)if(steps[i].getBoundingClientRect().top<=probe)index=i;
   activate(index);
   if(pendingFocus===index&&!stage.inert&&Math.abs((dialog?dialog.scrollTop:scrollY)-pendingFocusTop)<2){pendingFocus=-1;const heading=copies[index].querySelector('h1,h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}
   const box=steps[index].getBoundingClientRect(),progress=Math.max(0,Math.min(1,(probe-box.top)/box.height));
   root.style.setProperty('--story-progress',String((index+progress)/beats.length));
   root.style.setProperty('--time-progress',String(Math.min(1,(index+progress)/(scenes.length-1))));
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  function resize(){fitHistoryCrops();updateHistory();if(!inline){jump(Math.max(0,active),true);schedule();}}
  function jump(index,instant=false){const target=steps[index];if(!target)return;if(inline){onNavigate(target.id);return;}pendingFocus=index;const top=dialog?dialog.scrollTop+target.getBoundingClientRect().top-dialog.getBoundingClientRect().top:target.getBoundingClientRect().top+scrollY;pendingFocusTop=top;scrollRoot.scrollTo({top,behavior:instant||reduced.matches?'instant':'smooth'});schedule();}
  function openSources(index,narrative=null,paperDocument=selectedDocument){
   const beat=narrative?{...beats[index],title:headline(narrative.title),body:p(narrative.description),date:p(narrative.kicker),ids:narrative.sourceIds||beats[index].ids}:beats[index];lastFocus=document.activeElement;
   const image=beat.image?`<p>${esc(p(beat.imageDateRelation))}</p><p>${esc(p(beat.credit))}</p><a href="${esc(beat.sourceUrl)}" target="_blank" rel="noopener">${t('Read the original publication','阅读原始出版物')} ↗</a>`:'';
   const paper=beat.id==='documents'&&paperDocument?`<h3>${esc(p(paperDocument.title))}</h3><p>${esc(p(paperDocument.sourceLabel))}</p><a href="${esc(paperDocument.sourceUrl)}" target="_blank" rel="noopener">${t('Read the original','阅读原件')} ↗</a>`:'';
   root.querySelector('.c-records-body').innerHTML=`<p class="c-kicker">${beat.date}</p><h2>${beat.title}</h2>${image}${paper}${beat.id==='market'?`<p>${t('Each point links an advertisement’s asking amount, advertised area and publication details.','每个数据点关联一条广告的要价、广告面积与发布信息。')}</p><a href="data/market-expanded.json" target="_blank" rel="noopener">${t('Explore the listing records','查看挂牌记录')} ↗</a>`:''}${sourcesMarkup(beat.ids,sources,lang)}<details class="c-all-records"><summary>${t('Explore the historical record','展开历史记录')}</summary>${scenes.map(s=>`<article><small>${esc(p(s.date))}</small><h3>${esc(p(s.title))}</h3><p>${esc(p(s.body))}</p><a href="${esc(s.sourceUrl)}" target="_blank" rel="noopener">${esc(p(s.credit))} ↗</a></article>`).join('')}</details>`;
   if(['regional','planning'].includes(beat.id)){const references=root.querySelector('.ev-sources');references.open=true;references.querySelector('summary span').textContent=t(`${beat.ids.length} sources`,`${beat.ids.length}条来源`);}
   const records=root.querySelector('.c-records');records.hidden=false;if(inline){records.showModal();document.body.classList.add('context-sources-open');}else root.querySelector('.c-records-backdrop').hidden=false;root.classList.add('records-open');stage.inert=true;if(!inline){root.querySelector('.c-steps').inert=true;root.querySelector('.c-nav').inert=true;}root.querySelector('[data-c-close-sources]').focus({preventScroll:true});
  }
  function closeSources(){const records=root.querySelector('.c-records');if(inline){records.close();document.body.classList.remove('context-sources-open');}records.hidden=true;root.querySelector('.c-records-backdrop').hidden=true;root.classList.remove('records-open');stage.inert=false;if(!inline){root.querySelector('.c-steps').inert=false;root.querySelector('.c-nav').inert=false;}lastFocus?.focus({preventScroll:true});}
  function click(event){const button=event.target.closest('button');if(event.target.matches('.c-records-backdrop'))closeSources();if(!button)return;if(button.dataset.cJump!==undefined)jump(+button.dataset.cJump);if(button.dataset.cSources!==undefined){const sourceIndex=+button.dataset.cSources,reading=Number(button.closest('.c-mobile-reading')?.dataset.reading),isPaper=beats[sourceIndex].id==='documents';openSources(sourceIndex,(isPaper?paperReadings:regionalReadings)[reading],isPaper?paperPages[reading]||selectedDocument:selectedDocument);}if(button.hasAttribute('data-c-close-sources'))closeSources();if(button.hasAttribute('data-c-return'))onReturn();if(button.hasAttribute('data-c-compare'))onCompare();if(button.hasAttribute('data-c-history-enlarge'))openHistoryPage(button.dataset.cHistoryEnlarge===''?active:Number(button.dataset.cHistoryEnlarge));}
  function key(event){if(!root.classList.contains('records-open'))return;if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeSources();}if(event.key==='Tab'){const focusable=[...root.querySelector('.c-records').querySelectorAll('button,a,summary')].filter(el=>el.getClientRects().length),first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}
  function cancel(event){if(root.classList.contains('records-open')){event.preventDefault();closeSources();}}
  root.addEventListener('click',click);root.addEventListener('keydown',key);dialog?.addEventListener('cancel',cancel);root.querySelector('.c-records').addEventListener('cancel',cancel);if(inline)steps.forEach(step=>step.addEventListener('click',click));else scrollRoot.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize);
  active=-1;activate(0);if(!inline)schedule();
  let guidedFrame=0,guidedTime=0,guidedId='',guidedValue=0,guidedTarget=0;
  const paintGuided=()=>{if(guidedId==='regional')indices.setProgress(guidedValue);if(guidedId==='planning')planning.setProgress(guidedValue);if(guidedId==='documents')documents.setProgress(guidedValue);};
  function settleGuided(){cancelAnimationFrame(guidedFrame);guidedFrame=0;guidedTime=0;guidedValue=guidedTarget;paintGuided();}
  function tickGuided(time){
   guidedFrame=0;if(!alive)return;
   const dt=Math.min(50,guidedTime?time-guidedTime:16.67);guidedTime=time;
   guidedValue+=(guidedTarget-guidedValue)*(1-Math.exp(-dt/95));
   if(Math.abs(guidedTarget-guidedValue)<.00002)guidedValue=guidedTarget;
   paintGuided();
   if(guidedValue!==guidedTarget)guidedFrame=requestAnimationFrame(tickGuided);else guidedTime=0;
  }
  function motionPreference(){if(document.hidden||reduced.matches)settleGuided();if(reduced.matches){copies.forEach(copy=>{copy.getAnimations({subtree:true}).forEach(animation=>animation.cancel());copy.querySelectorAll('.c-reading-outgoing').forEach(el=>el.remove());});}}
  document.addEventListener('visibilitychange',motionPreference);reduced.addEventListener('change',motionPreference);
  selectScene=(id,progress=0,immediate=false)=>{
   motionSuspended=immediate;const index=indexOf(id);if(index<0)return;
   if(immediate){copies[index].getAnimations({subtree:true}).forEach(animation=>animation.cancel());copies[index].querySelectorAll('.c-reading-outgoing').forEach(el=>el.remove());}
   activate(index,immediate);
   root.style.setProperty('--time-progress',String(Math.min(1,(index+progress)/(scenes.length-1))));
   if(!['regional','planning','documents'].includes(id)){cancelAnimationFrame(guidedFrame);guidedFrame=0;guidedTime=0;guidedId='';return;}
   const changed=guidedId!==id;guidedId=id;guidedTarget=progress;
   if(changed||immediate||document.hidden||reduced.matches){settleGuided();return;}
   if(!guidedFrame&&guidedTarget!==guidedValue){if(Math.abs(guidedTarget-guidedValue)>.00002)guidedFrame=requestAnimationFrame(tickGuided);else settleGuided();}
  };
  deactivateScene=()=>{
   if(active<0)return;
   active=-1;
   cancelAnimationFrame(guidedFrame);guidedFrame=0;guidedTime=0;guidedId='';
   indices.setActive?.(false);planning.setActive?.(false);
  };
  navigate=chapter=>{const id={timeline:'origins',prices:'market',planning:'planning',process:'documents',documents:'documents'}[chapter]||chapter;jump(Math.max(0,indexOf(id)));};
  const entry=indexOf({timeline:'origins',prices:'market',planning:'planning',process:'documents',documents:'documents'}[start]||'origins');
  if(!inline)requestAnimationFrame(()=>{if(alive){jump(Math.max(0,entry),true);update();const heading=copies[Math.max(0,entry)].querySelector('h1,h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}});
  dispose=()=>{cancelAnimationFrame(guidedFrame);document.removeEventListener('visibilitychange',motionPreference);reduced.removeEventListener('change',motionPreference);copies.forEach(copy=>copy.getAnimations({subtree:true}).forEach(animation=>animation.cancel()));cancelAnimationFrame(historyAnimation);historyViewerResize?.disconnect();historyViewer?.close();historyViewer?.remove();if(inline){root.querySelector('.c-records').close();document.body.classList.remove('context-sources-open','context-history-open');}market.destroy();indices.destroy();planning.destroy();documents.destroy();root.removeEventListener('click',click);steps.forEach(step=>step.removeEventListener('click',click));root.removeEventListener('keydown',key);dialog?.removeEventListener('cancel',cancel);scrollRoot.removeEventListener('scroll',schedule);window.removeEventListener('resize',resize);};
 }).catch(()=>{if(alive)container.innerHTML=`<div class="c-data-error">${t('Reopen this chapter to refresh the archive.','重新打开本章，刷新档案。')}</div>`;});
 const cleanup=()=>{alive=false;cancelAnimationFrame(frame);dispose();};
 cleanup.ready=ready;
 cleanup.updateHistory=()=>{if(alive)updateHistory();};
 cleanup.setScene=(id,progress,immediate=false)=>{if(alive)selectScene(id,progress,immediate);};
 cleanup.deactivate=()=>{if(alive)deactivateScene();};
 cleanup.go=chapter=>ready.then(()=>{if(alive)navigate(chapter);});
 return cleanup;
}
