import { mountOpeningInterviews } from './interview-context.js?v=20261110-flow2';
import { siteHeaderMarkup, siteFooterMarkup, mountSiteNavigation, navigationLabel } from './site-navigation.js?v=20261110-about-scroll1';
import { mountStoryMap, narrativeHeading } from './story-map.js?v=20261110-ending-type1';
import { visitorStoryMarkup, visitorStoryVisuals, mountVisitorStory } from './visitor-story.js?v=20261110-about-clean3';
import { shopStoryMarkup, shopStoryVisuals, mountShopStory } from './shop-story.js?v=20261110-about-clean3';
import { propertyStoryMarkup, propertyStoryVisuals, mountPropertyStory } from './property-story.js?v=20261110-about-clean3';
import { mountNarrativeNotes } from './narrative-system.js?v=20261110-about-clean3';
import { openingMarkup, mountOpening } from './opening.js?v=20261108-formal1';
import { createGeoStage } from './geo-stage.js?v=20261108-formal1';
import { mountFloorExplorer } from './floor-explorer.js?v=20261108-release1';
import { mountContext } from './context.js?v=20261110-about-clean3';
import { convergeMarkup, mountConverge } from './community-converge.js?v=20261110-about-clean3';
import { mountAfterwordMotion } from './afterword-motion.js?v=20261108-formal1';
import { explorationMarkup, mountExploration } from './community-explore.js?v=20261110-about-clean3';
import { dialogueMarkup, mountDialogue } from './community-dialogue.js?v=20261110-about-clean3';
import { methodsMarkup, stewardshipMarkup, sourcesMarkup, projectInformationMarkup, projectDetailsMarkup } from './archive-notes.js?v=20261110-about-scroll1';

let lang='en';try{lang=localStorage.getItem('qsc-language')==='zh'?'zh':'en';}catch{}
const t=(en,zh)=>lang==='zh'?zh:en;
const app=document.querySelector('#app'),reader=document.querySelector('#reader'),readerBody=document.querySelector('#reader-content');
let storyHandle=null,selectedLens='owner';try{const saved=JSON.parse(sessionStorage.getItem('qsc-inline-story')||'null');if(saved?.lens)selectedLens=saved.lens;else selectedLens=sessionStorage.getItem('qsc-main-lens')||'owner'}catch{}
let geo,opening,openingInterviews,context,floorExplorer,narrativeStages=[],disposeNarrativeVisuals,active='chapter-0',lastActive='',readerCleanup,raf=0,scrollFallback=0,free=false,steps=[],pendingNavigation=null;
let siteNavigation=null,exploration=null,dialogue=null,convergence=null,afterwordMotion=null;
let directoryOpen=false,directoryReturnPosition=null;
let floorReturn=false,floorReturnPosition=null,propertyVisualControllers=[],shopVisualControllers=[],visitorVisualControllers=[];
const narrativeStep='[data-property-step],[data-shop-step],[data-visitor-step]';
const sceneNames=()=>[t('The people','这里的人'),t('The corner','街角'),t('The building','建筑'),t('Inside the mall','商场内部'),t('Three narratives','三条叙事'),t('Shop accounts','商户记录'),t('Working lives','经营与生活'),t('Visitors','顾客与访客'),t('Side by side','并置'),t('Your story','你的故事'),t('The future','未来')];
const icon='<span aria-hidden="true">↗</span>';
function next(i,label){return `<button class="next-chapter" data-go="${i}">${label||t('Keep going','继续探索')} <span aria-hidden="true">↓</span></button>`;}
function actions(html){return `<div class="scene-actions">${html}</div>`;}
function scene(index,eyebrow,title,body,extra='',klass='') {return `<section class="story-step ${klass}" id="chapter-${index}" data-scene="${index}" aria-labelledby="title-${index}"><div class="scene-copy"><p class="scene-kicker">${eyebrow}</p><h2 id="title-${index}">${title}</h2>${body?`<p class="scene-body">${body}</p>`:''}${extra}</div></section>`;}
function render(){
 const oldActive=active;siteNavigation?.destroy();disposeNarrativeVisuals?.();storyHandle?.destroy();storyHandle=null;floorExplorer?.destroy();opening?.destroy();openingInterviews?.destroy();geo?.destroy();context?.();
 exploration?.();dialogue?.destroy();convergence?.();afterwordMotion?.();
 if(raf){cancelAnimationFrame(raf);raf=0;}clearTimeout(scrollFallback);scrollFallback=0;
 document.documentElement.lang=lang;
 document.body.classList.toggle('directory-active',directoryOpen);
 document.body.classList.toggle('resources-active',active==='ev-documents');
 app.innerHTML=`
 <div class="story-stage" aria-hidden="false"><div id="geography"></div><div id="floor-explorer-stage"></div><div class="stage-vignette" aria-hidden="true"></div><div class="stage-grain" aria-hidden="true"></div><div id="context-stage" inert></div><div id="property-visual-stage" class="narrative-visual-stage" hidden inert>
 ${propertyStoryVisuals(lang)}
 </div><div id="shop-visual-stage" class="narrative-visual-stage" hidden inert>
 ${shopStoryVisuals(lang)}
 </div><div id="visitor-visual-stage" class="narrative-visual-stage" hidden inert>
 ${visitorStoryVisuals(lang)}
 </div></div>
 ${siteHeaderMarkup(lang)}
 <nav class="chapter-rail" aria-label="${t('Story chapters','故事章节')}"></nav>
 <div class="map-caption"><span class="map-caption-dot"></span><span id="map-scene-label">SINGAPORE</span><button data-action="map" id="explore-map">${t('Explore map','探索地图')} ⌖</button></div>
 <div class="story-hud"><span id="hud-current">00</span><div class="hud-line"><i></i></div><span id="hud-total">24</span><button data-action="methods">${t('Sources','来源')}</button></div>
 <main id="main"><div id="story-content" ${directoryOpen?'hidden':''}>
 ${openingMarkup(lang)}
 ${scene(1,navigationLabel('chapter-1',lang),t('A city.<br>A corner.<br><em>A world within.</em>','一座城。<br>一个街角。<br><em>一方世界。</em>'),t('The map brings us to Queensway. Inside this building, property, work and everyday life occupy the same ground.','地图将我们带到女皇道。在同一栋建筑里，物业、生计与日常生活占据着同一片空间。'),next(2))}
 ${scene(2,navigationLabel('chapter-2',lang),t('A mall held<br>in <em>many hands.</em>','握在许多人<br><em>手中的商场。</em>'),t('Individually owned units. Shared corridors. New homes and a rebuilt hospital are planned or under way nearby, and a collective sale has already been tried once. Different ideas of value meet here, now.','各自持有的产权单元，共同使用的走廊。周边的新住宅和医院重建已在规划或施工中，整售也已尝试过一次。此刻，不同的价值观在这里相遇。'),'')}
 <div id="context-insertion"></div>
 ${scene(3,navigationLabel('chapter-3',lang),t('Follow the corridors.<br><em>Meet the shops.</em>','沿着走廊，<br><em>走进店铺。</em>'),t('Explore three retail floors through the floor plans and shop directory. Pause on a floor, then hover over or select a coloured unit to see its shop, trade and matching photograph.','沿着楼层图和商户目录，探索三层商铺。停留在一层，悬停或点选填色铺位，查看店名、业态和对应照片。'),`<div class="floor-story-links"><button type="button" data-go="chapter-explore">${t('Browse the directory','浏览商户目录')} ↗</button><button type="button" data-go="chapter-bridge">${t('Three perspectives','三种视角')} ↓</button></div><button type="button" class="shop-floor-return" data-go="${floorReturnPosition?.id||'shop-work'}" ${floorReturn?'':'hidden'}>← ${floorReturnPosition?.id==='chapter-explore'?t('Back to the directory','返回商户目录'):t('Back to the story','返回故事')}</button>`,'interior-step')}
 <section class="story-step bridge-step" id="chapter-bridge" data-scene="3" data-chapter-key="chapter-bridge" aria-labelledby="bridge-title">
  <div class="bridge-panel">
   <div class="bridge-copy"><p class="bridge-kicker"><span></span> ${t('THREE PERSPECTIVES','三种视角')}</p><h2 id="bridge-title">${t('When we say<br>this mall has value,<br><em>what do we mean?</em>','当我们说<br>这座商场有价值，<br><em>我们在说什么？</em>')}</h2><p class="bridge-intro">${t('In 2019, the proposed collective sale brought different hopes for the future of this place into a shared discussion.','2019 年集体出售的讨论，让不同人对这座商场未来的期待浮现出来。')}</p></div>
   <svg class="waterfall-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path class="waterfall-boundary waterfall-left"/><path class="waterfall-boundary waterfall-right"/></svg>
   <div class="bridge-choices" aria-label="${t('Three perspectives','三种视角')}">
    <button type="button" class="bridge-choice" data-story-entry="developer"><span><b>${t('PROPERTY & LAND','物业与土地')}</b><span class="bridge-question-slot"><strong><span class="question-sans">${narrativeHeading('developer',lang)}</span><span class="question-serif" aria-hidden="true">${narrativeHeading('developer',lang)}</span></strong></span></span><i aria-hidden="true">↗</i></button>
    <button type="button" class="bridge-choice" data-story-entry="owner"><span><b>${t('SHOPKEEPERS & TENANTS','店主与租户')}</b><span class="bridge-question-slot"><strong><span class="question-sans">${narrativeHeading('owner',lang)}</span><span class="question-serif" aria-hidden="true">${narrativeHeading('owner',lang)}</span></strong></span></span><i aria-hidden="true">↗</i></button>
    <button type="button" class="bridge-choice" data-story-entry="visitor"><span><b>${t('VISITORS & CUSTOMERS','顾客与访客')}</b><span class="bridge-question-slot"><strong><span class="question-sans">${narrativeHeading('visitor',lang)}</span><span class="question-serif" aria-hidden="true">${narrativeHeading('visitor',lang)}</span></strong></span></span><i aria-hidden="true">↗</i></button>
   </div><p class="bridge-invitation">${t('CHOOSE A PERSPECTIVE · SCROLL DOWN TO FOLLOW','选择一个视角 · 向下滚动继续')}</p>
  </div></section>
 <section class="story-step narrative-flow" id="story-root" data-scene="4"></section>
 <div id="property-land" ${selectedLens==='developer'?'':'hidden'}>${propertyStoryMarkup(lang)}<div id="legacy-property-evidence" hidden inert><div id="property-market-slot"></div><div id="property-regional-slot"></div><div id="property-planning-slot"></div></div></div>
 <div id="shopkeepers" ${selectedLens==='owner'?'':'hidden'}>${shopStoryMarkup(lang)}</div>
 <div id="visitors" ${selectedLens==='visitor'?'':'hidden'}>${visitorStoryMarkup(lang)}</div>
 <section class="story-step narrative-ending" id="story-ending" data-scene="4" data-chapter-key="story-root" aria-labelledby="story-ending-title"></section>
 <div id="afterword" class="afterword-root">${convergeMarkup(lang)}${dialogueMarkup(lang)}${projectInformationMarkup(lang)}</div>
 <div id="resources-view"><div id="resources-insertion"></div></div>
 <div class="afterword-root">${projectDetailsMarkup(lang)}</div></div><div id="directory-view" class="afterword-root" ${directoryOpen?'':'hidden'}>${explorationMarkup(lang)}</div></main>
 ${siteFooterMarkup(lang)}`;
 {const skip=document.querySelector('.skip-link');if(skip)skip.textContent=t('Skip to the story','跳到正文');}
 siteNavigation=mountSiteNavigation(document,{lang});
 opening=mountOpening(document.querySelector('#chapter-0'),{lang});
 openingInterviews=mountOpeningInterviews(document.querySelector('#chapter-0'),{lang,onModal:value=>opening.setModal(value)});
 geo=createGeoStage(document.querySelector('#geography'),{lang});
 floorExplorer=mountFloorExplorer(document.querySelector('#floor-explorer-stage'),{lang});
 dialogue=mountDialogue(document,{lang,onStewardship:()=>openReader('stewardship')});
 exploration=mountExploration(document,{lang,onFloor:floor=>go('chapter-3',{floor}),onNavigate:id=>go(id)});
 convergence=mountConverge(document);
 afterwordMotion=mountAfterwordMotion(document.querySelector('#main'));
 const property=document.querySelector('#property-land'),shops=document.querySelector('#shopkeepers'),visitors=document.querySelector('#visitors');
 const propertyVisualStage=document.querySelector('#property-visual-stage');
 const shopVisualStage=document.querySelector('#shop-visual-stage');
 const visitorVisualStage=document.querySelector('#visitor-visual-stage');
 narrativeStages=[
   [propertyVisualStage,'data-property-visual'],
   [shopVisualStage,'data-shop-visual'],
   [visitorVisualStage,'data-visitor-visual']
 ];
 propertyVisualControllers=[mountPropertyStory(document,{lang})];
 shopVisualControllers=[mountShopStory(document,{lang})];
 visitorVisualControllers=[mountVisitorStory(document,{lang})];
 const disposeNotes=mountNarrativeNotes(document);
 disposeNarrativeVisuals=()=>{
   [...propertyVisualControllers,...shopVisualControllers,...visitorVisualControllers].forEach(dispose=>dispose());
   disposeNotes();
 };
 storyHandle=mountStoryMap(document.querySelector('#story-root'),{endingRoot:document.querySelector('#story-ending'),lens:selectedLens,lang,onLensChange:value=>{
   const leavingNarrative=active==='story-ending'||document.getElementById(active)?.matches(narrativeStep);
   selectedLens=value;
   lastActive='';
   property.hidden=value!=='developer';
   shops.hidden=value!=='owner';
   visitors.hidden=value!=='visitor';
   rebuildChapters();
   document.querySelectorAll('[data-story-entry]').forEach(el=>el.classList.toggle('is-selected',el.dataset.storyEntry===value));
   try{sessionStorage.setItem('qsc-main-lens',value)}catch{}
   if(leavingNarrative){
     const title=document.querySelector('#story-root');
     const top=title.getBoundingClientRect().top+scrollY;
     window.scrollTo({top:top+Math.max(0,(title.offsetHeight-innerHeight)/2),behavior:'instant'});
     updateScroll(true);
     const heading=title.querySelector(`[data-title="${value}"]`);
     heading.tabIndex=-1;
     heading.focus({preventScroll:true});
   }else scheduleScrollUpdate();
 }});
 document.querySelectorAll('[data-story-entry]').forEach(el=>el.classList.toggle('is-selected',el.dataset.storyEntry===selectedLens));
 lastActive='';active=oldActive;pendingNavigation=null;
 rebuildChapters();
 context=mountContext(document.querySelector('#context-stage'),{lang,inline:true,stepAnchor:document.querySelector('#context-insertion'),resourceAnchor:document.querySelector('#resources-insertion'),propertySlots:{market:property.querySelector('#property-market-slot'),regional:property.querySelector('#property-regional-slot'),planning:property.querySelector('#property-planning-slot'),decision:property.querySelector('#property-decision-slot'),documents:property.querySelector('#property-documents-slot')},onNavigate:id=>go(id)});
 updateScroll();
 return Promise.all([context.ready,exploration?.ready]).then(()=>{rebuildChapters();lastActive='';updateScroll();document.fonts?.ready.then(scheduleScrollUpdate);});
}
function visibleStorySteps(){return [...document.querySelectorAll('#main .story-step')].filter(section=>!section.closest('[hidden]'));}
function rebuildChapters(){
 steps=visibleStorySteps();
 const names=sceneNames(),chapters=[];
 const evidenceNames={market:t('Property listings','物业挂牌'),indices:t('Retail market','零售市场'),planning:t('Neighbourhood','街区'),document:t('Original papers','原始文件')};
 steps.forEach(section=>{
  const id=section.dataset.chapterKey||section.id;
  let index=chapters.findIndex(chapter=>chapter.id===id);
  if(index<0){
   index=chapters.length;
   const label=section.dataset.navLabel||section.dataset.afterwordLabel||section.dataset.propertyLabel||section.dataset.shopLabel||section.dataset.visitorLabel||navigationLabel(id,lang,{lens:selectedLens})||(id==='chapter-history'?t('History · timeline','历史 · 时间轴'):evidenceNames[section.dataset.evidenceVisual]||names[Number(section.dataset.scene)]);
   chapters.push({id,label});
  }
  section.dataset.order=String(index);
 });
 document.querySelector('.chapter-rail').innerHTML=chapters.map((chapter,index)=>`<button data-go="${chapter.id}" aria-label="${chapter.label}" title="${chapter.label}"><span></span><b>${chapter.label}</b></button>`).join('');
 document.querySelector('#hud-total').textContent=String(chapters.length-1).padStart(2,'0');
 document.documentElement.style.setProperty('--chapter-count',String(chapters.length));
}
function setActive(section){
 if(section.id===lastActive)return;
 lastActive=active=section.id;
 siteNavigation?.setActive({sectionId:section.id,lens:selectedLens});
 document.body.classList.toggle('resources-active',section.id==='ev-documents');
 const evidence=!!section.dataset.evidenceId,index=evidence?2:Number(section.dataset.scene);
 const afterword=section.hasAttribute('data-afterword-label');
 const ending=section.id==='story-ending';
 document.body.classList.toggle('afterword-active',afterword);
 document.body.classList.toggle('narrative-ending-active',ending);
 document.querySelector('.story-stage').inert=afterword||ending;
 opening?.setActive(!evidence&&index===0);
 document.body.dataset.chapter=evidence?'evidence':String(index);
 document.body.classList.toggle('bridge-active',section.id==='chapter-bridge');
 const narrative=section.id==='story-root'||ending||section.matches(narrativeStep);
 document.body.classList.toggle('narrative-active',narrative);
 document.body.classList.toggle('property-active',section.hasAttribute('data-property-step'));
 document.body.classList.toggle('shop-active',section.hasAttribute('data-shop-step'));
 document.body.classList.toggle('visitor-active',section.hasAttribute('data-visitor-step'));
 let hasVisual=false;
 for(const [stage,attribute] of narrativeStages){
   const visual=stage.querySelector(`[${attribute}="${section.id}"]`);
   stage.hidden=!visual;
   stage.inert=!visual;
   stage.querySelectorAll(`[${attribute}]`).forEach(panel=>{
     panel.hidden=panel!==visual;
     panel.inert=panel!==visual;
   });
   hasVisual||=!!visual;
 }
 document.body.classList.toggle('narrative-visual-active',hasVisual);
 document.body.classList.toggle('evidence-active',evidence);
 document.body.classList.remove('floor-inspect');
 document.querySelector('#floor-explorer-stage').inert=section.id!=='chapter-3';
 steps.forEach(el=>el.classList.toggle('is-active',el===section));
 document.querySelectorAll('.chapter-rail button').forEach(el=>el.setAttribute('aria-current',String(el.dataset.go===(section.dataset.chapterKey||section.id))));
 const views=['city','corner','site','people','developer','people','people','visitor','shared','shared','wishes'];
 if(!narrative&&!afterword)geo?.setView(views[index]);
 const order=section.dataset.order??document.querySelector('#story-root').dataset.order;
 document.querySelector('#hud-current').textContent=section.dataset.propertyStep||section.dataset.shopStep||section.dataset.visitorStep||String(order).padStart(2,'0');
 const branchRoot=section.closest('#property-land,#shopkeepers,#visitors');
 document.querySelector('#hud-total').textContent=String(branchRoot?branchRoot.querySelectorAll('.narrative-chapter').length:document.querySelectorAll('.chapter-rail button').length-1).padStart(2,'0');
 const labels=[t('SINGAPORE / QUEENSWAY','新加坡／女皇道'),t('QUEENSTOWN / THE NEIGHBOURHOOD','女皇镇／周边街区'),t('OSM BUILDING FOOTPRINTS','OSM 建筑轮廓'),t('FLOOR PLANS / SHOP DIRECTORY','楼层图／商户目录'),t('PROPERTY / DEVELOPMENT','物业／开发'),t('SHOP ACCOUNTS','商户记录'),t('TRADES AND LIVELIHOODS','手艺与生计'),t('PLACES CONNECTED BY A STORY','故事连接的地点'),t('ONE PLACE / THREE PERSPECTIVES','一处空间／三种视角'),t('YOUR PLACE IN THE STORY','你在故事中的位置'),t('DECORATIVE LIGHTS / POSSIBLE FUTURES','氛围光点／未来的可能')];
 const evidenceLabels={photo:t('QUEENSWAY / THROUGH THE YEARS','QUEENSWAY／岁月中的商场'),market:t('QUEENSWAY / PROPERTY LISTINGS','QUEENSWAY／物业挂牌'),indices:t('QUEENSWAY / THE REGIONAL MARKET','QUEENSWAY／区域市场'),planning:t('QUEENSWAY / MASTER PLAN 2025','QUEENSWAY／2025年总体规划'),document:t('QUEENSWAY / ORIGINAL PAPERS','QUEENSWAY／原始档案')};
 document.querySelector('#map-scene-label').textContent=evidence?evidenceLabels[section.dataset.evidenceVisual]:labels[index];
 document.querySelector('#explore-map').hidden=afterword||evidence||section.hasAttribute('data-property-step')||section.hasAttribute('data-shop-step')||section.hasAttribute('data-visitor-step');
 if(afterword)document.querySelector('#map-scene-label').textContent=section.dataset.afterwordLabel;
 if(section.dataset.propertyLabel)document.querySelector('#map-scene-label').textContent=t('PROPERTY & LAND / ','物业与土地／')+section.dataset.propertyLabel;
 if(section.dataset.shopLabel)document.querySelector('#map-scene-label').textContent=t('SHOPKEEPERS & TENANTS / ','店主与租户／')+section.dataset.shopLabel;
 if(section.dataset.visitorLabel)document.querySelector('#map-scene-label').textContent=t('VISITORS & CUSTOMERS / ','顾客与访客／')+section.dataset.visitorLabel;
}
const clamp=value=>Math.max(0,Math.min(1,value));
function updateScroll(immediate=false){
 if(raf)cancelAnimationFrame(raf);raf=0;clearTimeout(scrollFallback);scrollFallback=0;
 const afterword=document.querySelector('#afterword');
 const storyExitTop=afterword&&!afterword.closest('[hidden]')?afterword.getBoundingClientRect().top:innerHeight;
 document.documentElement.style.setProperty('--footer-story-offset',`${Math.min(0,storyExitTop-innerHeight)}px`);
 const max=document.documentElement.scrollHeight-innerHeight;
 const frames=steps.map(el=>({el,bounds:el.getBoundingClientRect()})).filter(frame=>frame.bounds.height>0);
 document.documentElement.style.setProperty('--total-progress',max?clamp(scrollY/max):0);
 const probe=innerHeight*.5;
 const visible=(frames.find(({bounds:r})=>r.top<=probe&&r.bottom>probe)||frames.findLast(({bounds:r})=>r.top<=probe)||frames[0])?.el;
 document.body.classList.toggle('motion-immediate',immediate===true&&!!visible?.matches('[data-property-step],[data-shop-step],[data-visitor-step]'));
 const ease=value=>{const x=clamp(value);return x*x*(3-2*x);};
 frames.forEach(({el,bounds:r})=>{
  if(el.classList.contains('history-moment')||el.id==='chapter-0')return;
  const enter=ease((innerHeight*.82-r.top)/(innerHeight*.62)),leave=ease((r.bottom-innerHeight*.16)/(innerHeight*.52));
  el.style.setProperty('--reading-opacity',String(.16+.84*Math.min(enter,leave)));
  el.style.setProperty('--reading-shift',(20*(1-enter)-12*(1-leave)).toFixed(2)+'px');
 });
 if(visible)setActive(visible);
 storyHandle?.setEnding(visible?.id==='story-ending');
 opening?.updateScroll();
 context?.updateHistory();
 const bridgeFrame=frames.find(frame=>frame.el.id==='chapter-bridge');
 const titleFrame=frames.find(frame=>frame.el.id==='story-root');
 if(bridgeFrame){
   const step=bridgeFrame.el,bounds=bridgeFrame.bounds;
   const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   const b=reduced?1:clamp((probe-bounds.top)/(innerHeight*1.65));
   const p=ease((-bounds.top/innerHeight-1.10)/.95), other=1-ease((p-.03)/.30);
   document.documentElement.style.setProperty('--bridge-scene-opacity',String(1-ease((p-.06)/.65)));
   if(bounds.top<innerHeight&&bounds.bottom>0&&active!=='chapter-3')floorExplorer?.setBridge(b);
   step.style.setProperty('--bridge-copy',(ease((b-.05)/.20)*other).toFixed(3));
   step.style.setProperty('--bridge-other',other.toFixed(3));
   step.style.setProperty('--bridge-hint',(ease((b-.55)/.20)*other).toFixed(3));
   step.classList.toggle('is-unfolding',p>.025);
   const choices=[...step.querySelectorAll('.bridge-choice')], index=Math.max(0,['developer','owner','visitor'].indexOf(selectedLens));
   choices.forEach((el,i)=>{const v=reduced?1:ease((b-.28-i*.10)/.19);el.style.setProperty('--choice-reveal',String(v*(i===index?1:other)));});
   if(choices.length===3){
    const rects=choices.map(el=>el.getBoundingClientRect());
    const anchors=choices.map(el=>{const title=el.querySelector('strong'),r=title.getBoundingClientRect(),s=getComputedStyle(title),size=parseFloat(s.fontSize),rgb=(s.color.match(/[\d.]+/g)||[244,241,237]).slice(0,3).map(Number);return {x:r.left+r.width/2,y:r.top+r.height/2,width:r.width,size,leading:parseFloat(s.lineHeight)/size||1.4,tracking:parseFloat(s.letterSpacing)||0,color:s.color,rgb};});
    const reveals=choices.map((el,i)=>reduced?1:ease((b-.28-i*.10)/.19));
    const titleOpacity=titleFrame
      ?ease((titleFrame.bounds.bottom-innerHeight*.51)/(innerHeight*.26)):1;
    storyHandle?.setPresentation({progress:p,other,anchors,reveals,visible:bounds.top<innerHeight,titleOpacity});
    const x=v=>Math.max(0,Math.min(1000,v/innerWidth*1000)),xs=[x(rects[0].left),x((rects[0].right+rects[1].left)/2),x((rects[1].right+rects[2].left)/2),x(rects[2].right)];
    const l=xs[index],r=xs[index+1],endL=l*(1-p),endR=r+(1000-r)*p,y0=(rects[index].top/innerHeight*1000)*(1-p)-120*p,y1=1080;
    const path=(from,to)=>'M '+from+' '+y0+' C '+from+' '+(y0+(y1-y0)*.25)+' '+to+' '+(y0+(y1-y0)*.75)+' '+to+' '+y1;
    step.querySelector('.waterfall-left').setAttribute('d',path(l,endL));step.querySelector('.waterfall-right').setAttribute('d',path(r,endR));
    step.style.setProperty('--waterfall-line',String(ease(p/.13)*(1-ease((p-.88)/.12))));
   }
  }
 const activeFrame=frames.find(frame=>frame.el.id===active);
 if(activeFrame){
  const {el:step,bounds}=activeFrame;
  if(step.id==='chapter-3')floorExplorer?.setProgress(clamp(-bounds.top/Math.max(1,bounds.height-innerHeight)),immediate);
  let progress=(step.classList.contains('narrative-chapter')||step.classList.contains('guided-evidence')||step.classList.contains('property-guided')||step.classList.contains('shop-guided')||step.classList.contains('visitor-guided'))?clamp(-bounds.top/Math.max(1,bounds.height-innerHeight)):clamp((probe-bounds.top)/bounds.height);
  if(['ev-regional','ev-documents'].includes(step.id)&&innerWidth<=700){
   const readings=[...step.querySelectorAll('.c-mobile-reading')],line=innerHeight*.73;
   const positions=readings.map(el=>({el,box:el.getBoundingClientRect(),title:el.querySelector('h2').getBoundingClientRect()}));
   const which=Math.max(0,positions.findLastIndex(item=>item.title.top<=line)),reading=positions[which],cuts=step.id==='ev-documents'?Array.from({length:readings.length+1},(_,i)=>i/readings.length):[0,.28,.52,.76,1];
   if(reading){const local=clamp((line-reading.title.top)/Math.max(1,reading.box.height-(which===readings.length-1?innerHeight*.45:0)));progress=cuts[which]+local*(cuts[which+1]-cuts[which]);}
  }
  document.documentElement.style.setProperty('--scene-progress',clamp((innerHeight-bounds.top)/(bounds.height+innerHeight)));
  if(step.dataset.evidenceId)context?.setScene(step.dataset.evidenceId,progress,immediate===true);
  if(step.hasAttribute('data-property-step')){propertyVisualControllers.forEach(controller=>controller.setProgress?.(step.id,progress,immediate===true));}
  if(step.hasAttribute('data-shop-step')){shopVisualControllers.forEach(controller=>controller.setProgress?.(step.id,progress,immediate===true));}
  if(step.hasAttribute('data-visitor-step')){visitorVisualControllers.forEach(controller=>controller.setProgress?.(step.id,progress,immediate===true));}
 }
 const host=document.querySelector('#context-stage');
 // Property evidence fades by chapter; the remaining evidence shares one stage.
 const property=visible?.hasAttribute('data-property-step');
 const resourceFrame=frames.find(frame=>frame.el.id==='ev-documents');
 const inResources=resourceFrame&&resourceFrame.bounds.top<innerHeight&&resourceFrame.bounds.bottom>0;
 const evidenceFrames=property||inResources
   ?frames.filter(frame=>frame.el===(inResources?resourceFrame.el:visible)&&frame.el.dataset.evidenceId)
   :frames.filter(frame=>frame.el.dataset.chapterKey==='chapter-history');
 const first=evidenceFrames[0],last=evidenceFrames.at(-1);
 const fade=first?Math.min(clamp((innerHeight-first.bounds.top)/innerHeight),clamp(last.bounds.bottom/innerHeight)):0;
 const blend=fade*fade*(3-2*fade);
 host.style.opacity=String(blend);
 host.style.transform=inResources?`translateY(${Math.min(0,resourceFrame.bounds.bottom-innerHeight)}px)`:'';
 const mapOpacity=['chapter-3','chapter-9','chapter-10'].includes(active)?.15:1;
 document.querySelector('#geography').style.opacity=blend>0?String(mapOpacity*(1-blend*(['photo','indices'].includes(visible?.dataset.evidenceVisual)?1:.92))):'';
 document.querySelector('.stage-vignette').style.opacity=String(1-blend);
 host.inert=!visible?.dataset.evidenceId||blend<=.001;
 if(first?.bounds.top>probe)context?.setScene(first.el.dataset.evidenceId,0);
 else if(last?.bounds.bottom<=probe)context?.setScene(last.el.dataset.evidenceId,1);
 else if(!first)context?.deactivate();
 if(pendingNavigation){
  const distance=Math.abs(scrollY-pendingNavigation.top);
  if(distance<2){
   const target=document.getElementById(pendingNavigation.id);
   const heading=target?.querySelector(target.id==='story-root'?`[data-title="${selectedLens}"]`:'h1,h2');
   pendingNavigation=null;
   if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  }
 }
}
function scheduleScrollUpdate(){
 // Safari suspends animation frames in background windows; keep the reading state current.
 if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;updateScroll(true);return;}
 if(!raf){
  raf=requestAnimationFrame(()=>updateScroll());
  // Safari may pause rAF in an occluded window without marking the document hidden.
  scrollFallback=setTimeout(()=>{if(raf){cancelAnimationFrame(raf);raf=0;updateScroll(true);}},80);
 }
}
document.addEventListener('visibilitychange',()=>{if(raf)cancelAnimationFrame(raf);raf=0;clearTimeout(scrollFallback);scrollFallback=0;scheduleScrollUpdate();});
window.addEventListener('scroll',scheduleScrollUpdate,{passive:true});
window.addEventListener('resize',scheduleScrollUpdate,{passive:true});
function cancelPendingNavigation(){
 if(!pendingNavigation)return;
 pendingNavigation=null;
 window.scrollTo({top:scrollY,behavior:'instant'});
 scheduleScrollUpdate();
}
// Cancel menu-driven smooth scrolling when the reader interacts.
for(const event of ['wheel','touchstart','pointerdown'])window.addEventListener(event,cancelPendingNavigation,{passive:true});
window.addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Escape'].includes(event.key))cancelPendingNavigation();},{capture:true});
window.addEventListener('resize',cancelPendingNavigation,{passive:true});
function captureScrollPosition(){
 const section=document.getElementById(active)||steps[0];
 const top=section.getBoundingClientRect().top+scrollY;
 return {id:section.id,fraction:(scrollY+innerHeight*.5-top)/Math.max(1,section.offsetHeight)};
}
function restoreScrollPosition(position){
 const section=document.getElementById(position.id);
 if(!section)return;
 const top=section.getBoundingClientRect().top+scrollY;
 window.scrollTo({top:top+position.fraction*section.offsetHeight-innerHeight*.5,behavior:'instant'});
 updateScroll();
}
function go(target,{floor,lens,writeHistory=true}={}){
 if(reader.open){reader.addEventListener('close',()=>go(target,{floor,lens,writeHistory}),{once:true});closeReader();return;}
 if(free)toggleExplore();
 siteNavigation?.close();
 const aliases={'property-enbloc':'property-value','property-resale':'property-value','property-potential':'property-value','property-current':'property-use','ev-planning':'property-use','property-decision':'property-choice','property-closing':'property-choice','ev-market':'property-value','ev-regional':'property-value','shop-space':'shop-work','shop-people':'shop-work','shop-tenure':'shop-stay','shop-continuity':'shop-stay','visitor-browse':'visitor-discovery','visitor-companion':'visitor-discovery','visitor-britney':'visitor-discovery','visitor-memory':'visitor-discovery','visitor-closing':'story-ending','visitor-regulars':'visitor-return'};
 const id=aliases[target]||(/^\d+$/.test(String(target))?`chapter-${target}`:target);
 if(writeHistory&&(id==='ev-documents'||active==='ev-documents'||id==='chapter-explore'||directoryOpen)){
   history.replaceState({target:active},'',location.href);
   history.pushState({target:id},'',`${location.pathname}${location.search}#${id==='ev-documents'?'resources':id}`);
 }
 if(['developer','owner','visitor'].includes(lens))storyHandle?.setLens(lens);
 const targetElement=document.getElementById(id);
 if((floor&&active!=='chapter-3')||id==='shop-work'){
   if(floor)floorReturnPosition=captureScrollPosition();
   floorReturn=!!floor&&floorReturnPosition?.id!=='chapter-explore';
   const returnButton=document.querySelector('.shop-floor-return');
   returnButton.hidden=!floorReturn;
   if(floor){returnButton.dataset.go=floorReturnPosition.id;returnButton.textContent=floorReturnPosition.id==='chapter-explore'?t('← Back to the directory','← 返回商户目录'):t('← Back to the story','← 返回故事');}
 }
 const leavingDirectory=directoryOpen&&id!=='chapter-explore';
 if(id==='chapter-explore'&&!directoryOpen){
   directoryReturnPosition=active==='chapter-3'?captureScrollPosition():directoryReturnPosition;
   directoryOpen=true;
 }else if(leavingDirectory)directoryOpen=false;
 if(id==='chapter-explore'||leavingDirectory){
   document.querySelector('#story-content').hidden=directoryOpen;
   document.querySelector('#directory-view').hidden=!directoryOpen;
   document.body.classList.toggle('directory-active',directoryOpen);
   lastActive='';rebuildChapters();
 }
 if(targetElement?.closest('[hidden]')){
   if(targetElement.hasAttribute('data-property-step'))storyHandle?.setLens('developer');
   if(targetElement.hasAttribute('data-shop-step'))storyHandle?.setLens('owner');
   if(targetElement.hasAttribute('data-visitor-step'))storyHandle?.setLens('visitor');
 }
 const section=targetElement?.matches('.story-chapter')?targetElement.querySelector('.story-step'):targetElement;
 if(!section)return;
 const copy=section.querySelector('.scene-copy');
 const start=section.getBoundingClientRect().top+scrollY;
 let top=start;
 if(id==='chapter-0')top=0;
 else if(leavingDirectory&&id==='chapter-3'&&!floor&&directoryReturnPosition){top=start+directoryReturnPosition.fraction*section.offsetHeight-innerHeight*.5;}
 else if(section.hasAttribute('data-afterword-label')||id==='ev-documents')top=start;
 else if(id==='chapter-3'&&[1,2,3].includes(floor)){
   top+=[0,.94,.58,.25][floor]*Math.max(0,section.offsetHeight-innerHeight);
 }
 else if(id==='story-root'||id==='story-ending'||id==='chapter-bridge')top+=Math.max(0,(section.offsetHeight-innerHeight)/2);
 else if(id!=='chapter-3'&&!section.matches(`.narrative-step,.guided-evidence,${narrativeStep}`)){
   top=innerWidth>700?start+(section.offsetHeight-innerHeight)/2:(copy?.getBoundingClientRect().top??section.getBoundingClientRect().top)+scrollY-innerHeight*.48;
 }
 pendingNavigation={id:section.id,top:Math.max(0,Math.min(top,document.documentElement.scrollHeight-innerHeight))};
 window.scrollTo({top:pendingNavigation.top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 scheduleScrollUpdate();
}
function toggleExplore(){free=!free;document.body.classList.toggle('exploring',free);geo.setFree(free);document.querySelector('#explore-map').textContent=free?t('Return to story ×','回到故事 ×'):t('Explore map ⌖','探索地图 ⌖');}
function closeReader(){reader.close();}
function goContext(chapter='timeline'){
 if(chapter==='documents'||chapter==='document'){go('ev-documents');return;}
 if(active==='ev-documents'){go('chapter-history');return;}
 if(free)toggleExplore();
 siteNavigation?.close();
 const navigate=()=>context?.go(chapter||'timeline');
 if(reader.open){reader.addEventListener('close',navigate,{once:true});closeReader();}else navigate();
}
reader.addEventListener('close',()=>{readerCleanup?.();readerCleanup=null;readerBody.replaceChildren();document.body.classList.remove('reader-open');opening?.setModal(false);});
document.querySelector('.reader-close').addEventListener('click',closeReader);
function openReader(type,role){
 if(type==='context'){goContext(role);return;}
 // Resolve legacy story and comparison routes to their current sections.
 if(type==='story'||type==='comparison'){go(type==='comparison'?'chapter-bridge':'chapter-explore');return;}
 if(type==='participate'){dialogue?.openForm();go('chapter-future');return;}
 opening?.setModal(true);readerCleanup?.();readerCleanup=null;readerBody.replaceChildren();
 reader.className='reader-light reader-project';reader.scrollTop=0;
 const labels={methods:t('HOW THE ARCHIVE IS MADE','档案如何形成'),sources:t('SOURCES & IMAGE CREDITS','来源与影像署名'),stewardship:t('KEEPING THE ARCHIVE ALIVE','让档案延续')};
 document.querySelector('#reader-title').textContent=labels[type];
 document.querySelector('.reader-close').innerHTML=`${active==='ev-documents'?t('Back to resources','返回资源页'):t('Back to the story','返回故事')} <span aria-hidden="true">×</span>`;
 document.querySelector('.reader-close').ariaLabel=active==='ev-documents'?t('Close and return to resources','关闭并返回资源页'):t('Close and return to story','关闭并返回故事');
 const markup={methods:methodsMarkup,sources:sourcesMarkup,stewardship:stewardshipMarkup}[type];
 readerBody.innerHTML=markup(lang);
 if(!reader.open){reader.showModal();document.body.classList.add('reader-open');}
 const heading=readerBody.querySelector('h1,h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
}

function selectPerspective(link){if(!link)return;selectedLens=link.dataset.storyEntry;storyHandle?.setLens(selectedLens);document.querySelectorAll('[data-story-entry]').forEach(el=>el.classList.toggle('is-selected',el===link));try{sessionStorage.setItem('qsc-main-lens',selectedLens)}catch{}}
document.addEventListener('pointerover',e=>{const link=e.target.closest?.('[data-story-entry]');if(link&&active==='chapter-bridge')selectPerspective(link)});
document.addEventListener('click',e=>{
 const entry=e.target.closest('[data-story-entry]');
 if(entry&&(e.button==null||e.button===0)){
  e.preventDefault();selectPerspective(entry);const section=document.querySelector('#chapter-bridge');
  if(section){const start=section.getBoundingClientRect().top+scrollY;window.scrollTo({top:Math.max(scrollY,start+innerHeight*1.20),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}return;
 }
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-property-next')||b.dataset.propertyLens==='owner'){go('shop-work');return;}
 if(b.dataset.propertyLens==='visitor'||b.hasAttribute('data-shop-next')){go('visitor-route');return;}
 if(b.classList.contains('shop-floor-return')&&floorReturnPosition){const position=floorReturnPosition;pendingNavigation=null;floorReturn=false;b.hidden=true;floorReturnPosition=null;if(position.id==='chapter-explore')go(position.id);else restoreScrollPosition(position);return;}
 if(b.dataset.go!==undefined){go(b.dataset.go,{lens:b.dataset.navLens,floor:[1,2,3].includes(Number(b.dataset.floor))?Number(b.dataset.floor):undefined});return;}
 if(b.dataset.story==='visitor'){go('visitor-route');return;}
 if(b.dataset.story){go('chapter-explore');return;}
 switch(b.dataset.action){
  case 'language':{const position=captureScrollPosition(),documentId=active==='ev-documents'?context?.getSelectedDocument():null;lang=lang==='en'?'zh':'en';try{localStorage.setItem('qsc-language',lang);}catch{}render().then(async()=>{restoreScrollPosition(position);updateScroll(true);if(documentId&&context?.getSelectedDocument()!==documentId)await context?.setSelectedDocument(documentId);});break;}
  case 'context':openReader('context',b.dataset.evidenceTarget);break;
  case 'comparison':go('chapter-bridge');break;
  case 'participate':openReader('participate');break;
  case 'material':go('chapter-explore');break;
  case 'methods':case 'sources':case 'stewardship':openReader(b.dataset.action);break;
  case 'map':toggleExplore();break;
  case 'interior':document.body.classList.toggle('floor-inspect');break;
 }
});
window.addEventListener('popstate',()=>go(history.state?.target||(location.hash==='#resources'?'ev-documents':location.hash.slice(1)||'chapter-0'),{writeHistory:false}));
render().then(()=>{
 const query=new URLSearchParams(location.search);
 const storyTarget={property:'property-value',shop:'shop-work',visitor:'visitor-route'}[query.get('story')]||{converge:'chapter-converge',explore:'chapter-explore',future:'chapter-future',project:'chapter-project',resources:'ev-documents',directory:'chapter-explore'}[query.get('section')];
 if(storyTarget){go(storyTarget,{writeHistory:false});history.replaceState({target:storyTarget},'',`${location.pathname}${storyTarget==='ev-documents'?'#resources':storyTarget==='chapter-explore'?'#chapter-explore':''}`);return;}
 if(location.hash==='#resources'){go('ev-documents',{writeHistory:false});return;}
 if(location.hash&&document.getElementById(location.hash.slice(1))){go(location.hash.slice(1),{writeHistory:false});return;}
 let returning=new URLSearchParams(location.search).get('return')==='bridge';
 try{if(sessionStorage.getItem('qsc-return-bridge')==='1'){returning=true;sessionStorage.removeItem('qsc-return-bridge')}sessionStorage.removeItem('qsc-inline-story')}catch{}
 if(returning){const bridge=document.querySelector('#chapter-bridge');if(bridge){window.scrollTo({top:bridge.getBoundingClientRect().top+scrollY+innerHeight*1.06,behavior:'instant'});updateScroll(true)}history.replaceState(null,'',location.pathname)}
});
