const stories={"en":{"developer":{"label":"PROPERTY & LAND","heading":"What could this land become?"},"owner":{"label":"SHOPKEEPERS & TENANTS","heading":"What livelihoods does it hold?"},"visitor":{"label":"VISITORS & CUSTOMERS","heading":"Why do people return?"}},"zh":{"developer":{"label":"物业与土地","heading":"这片土地，可以带来什么？"},"owner":{"label":"店主与租户","heading":"这里承载着怎样的生计？"},"visitor":{"label":"顾客与访客","heading":"这里为什么让人一次次回来？"}}};
export function narrativeHeading(id,lang='en'){return (stories[lang]||stories.en)[id]?.heading||''}
const css=`
#story-root.story-step{display:block;position:relative;min-height:120svh;padding:0;pointer-events:none;z-index:12}
/* Each entrance owns one persistent title throughout the scroll. */
.bridge-question-slot strong{visibility:hidden!important;font-family:var(--display,var(--serif));letter-spacing:-.035em}
#story-root .story-heading{position:fixed;z-index:16;left:50%;top:50%;width:80vw;max-width:none;margin:0;display:block;text-align:center;transform:translate(-50%,-50%);font:400 clamp(36px,4vw,70px)/1.13 var(--display,var(--serif));letter-spacing:-.035em;color:#f4f1ed;opacity:0;visibility:hidden;pointer-events:none;will-change:transform,opacity,left,top}

body.narrative-active .chapter-rail,body.narrative-active .story-hud,body.narrative-active .map-caption{opacity:0;pointer-events:none}
body.narrative-ending-active .story-stage{visibility:hidden}
#property-choice .ns-actions,#shop-stay .ns-actions,#visitor-memory .ns-actions{display:none}
#story-ending.story-step{display:block;position:relative;min-height:120svh;height:120svh;padding:0;z-index:12;background:#151515;pointer-events:auto}
#story-ending .ending-viewport{position:sticky;top:0;width:100%;height:100svh;overflow:hidden;isolation:isolate}
#story-ending .ending-title{outline:none;position:absolute;z-index:2;top:46%;left:50%;transform:translate(-50%,-50%);width:62vw;max-width:1000px;margin:0;text-align:center;text-wrap:balance;color:#f4f1ed;font:400 clamp(36px,4vw,70px)/1.13 var(--display,var(--serif));letter-spacing:-.035em;pointer-events:none}
#story-ending .ending-nav{position:absolute;inset:0;pointer-events:none}
#story-ending .liquid-hit{position:absolute;z-index:3;top:16%;bottom:25%;width:min(24vw,360px);min-width:200px;padding:0;border:0;background:none;cursor:pointer;touch-action:manipulation;visibility:hidden;opacity:0;pointer-events:none;transition:opacity .5s,visibility .5s}
#story-ending .liquid-hit.left{left:0;text-align:left}#story-ending .liquid-hit.right{right:0;text-align:right}
#story-ending .liquid-hit::before{content:'';position:absolute;z-index:-1;top:-30%;bottom:-30%;width:42vw;pointer-events:none;opacity:.7;transition:opacity .4s}
#story-ending .liquid-hit.left::before{left:0;background:radial-gradient(ellipse at left,#98663838,transparent 72%)}
#story-ending .liquid-hit.right::before{right:0;background:radial-gradient(ellipse at right,#98663838,transparent 72%)}
#story-ending .liquid-label{position:absolute;top:50%;width:calc(100% - 50px);transform:translateY(-50%);color:#b7b1a7;font:12px/1.5 var(--sans);letter-spacing:.04em}
#story-ending .left .liquid-label{left:28px}#story-ending .right .liquid-label{right:28px}
#story-ending .liquid-label b{display:block;color:#e8c38f;margin-bottom:8px}
#story-ending :is(.liquid-label,.ending-down)>b{font:700 clamp(20px,2vw,28px)/1.3 var(--serif);letter-spacing:0}
#story-ending .ending-down{position:absolute;z-index:3;bottom:0;left:50%;transform:translateX(-50%);height:25%;width:64%;padding:0 16px 3svh;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:12px;border:0;background:none;color:#e8c38f;cursor:pointer;visibility:hidden;opacity:0;pointer-events:none;transition:opacity .5s,visibility .5s;font:400 clamp(20px,2vw,28px)/1.3 var(--serif)}
#story-ending .ending-down::before{content:'';position:absolute;z-index:-1;bottom:0;left:50%;transform:translateX(-50%);width:100vw;height:38svh;pointer-events:none;opacity:.8;background:radial-gradient(ellipse at 50% 110%,#98663840,transparent 68%);transition:opacity .4s}
#story-ending .ending-down span{font:14px/1.5 var(--sans);letter-spacing:.03em;color:#b7b1a7}
#story-ending.is-ending :is(.liquid-hit,.ending-down){opacity:1;visibility:visible;pointer-events:auto}
#story-ending :is(.liquid-hit,.ending-down):is(:hover,:focus-visible)::before{opacity:1}
#story-ending :is(.liquid-hit,.ending-down):focus-visible{outline:1px solid #e8c38f;outline-offset:-10px;border-radius:4px}
@media(max-width:700px){
 #story-root .story-heading{width:86vw;font-size:clamp(32px,8.2vw,45px)}
 #story-ending .ending-title{top:37%;width:86vw;font-size:clamp(32px,8.2vw,45px);line-height:1.2}
 #story-ending .liquid-hit{top:53%;bottom:auto;height:18%;width:48%;min-width:0}
 #story-ending .liquid-label{width:calc(100% - 28px);font-size:11px}#story-ending .left .liquid-label{left:14px}#story-ending .right .liquid-label{right:14px}
 #story-ending .liquid-hit::before{width:65vw;top:-50%;bottom:-50%}
 #story-ending .ending-down{height:23%;width:88%;gap:10px}#story-ending .ending-down span{font-size:12px}
}
@media(prefers-reduced-motion:reduce){#story-ending :is(.liquid-hit,.ending-down),#story-ending :is(.liquid-hit,.ending-down)::before{transition:none}}

`;
export function mountStoryMap(root,{endingRoot,lens:initialLens='owner',lang='en',onLensChange=()=>{}}={}){
 const ids=['developer','owner','visitor'];let lens=ids.includes(initialLens)?initialLens:'owner',destroyed=false,locked=false,animationTimer=0,presentation=null,switchingTarget=null,endingAnimation=null;
 const t=(en,zh)=>lang==='zh'?zh:en,current=()=>stories[lang]||stories.en;
 function edge(side,id){if(!id)return '';const label=lang==='zh'?current()[id].label:{developer:'Property & Land',owner:'Shopkeepers & Tenants',visitor:'Visitors & Customers'}[id];return '<button type="button" class="liquid-hit '+side+'" data-edge="'+side+'" data-target="'+id+'" tabindex="-1" aria-hidden="true" inert aria-label="'+t('Switch to ','切换至 ')+label+'"><span class="liquid-label"><b>'+(side==='left'?'← ':'')+label+(side==='right'?' →':'')+'</b><span>'+t('EXPLORE ANOTHER PERSPECTIVE','切换视角')+'</span></span></button>'}

 root.innerHTML='<style>'+css+'</style>'+ids.map(id=>'<h2 class="story-heading" data-title="'+id+'" aria-hidden="true">'+current()[id].heading+'</h2>').join('')+
  '<button class="property-start" data-go="property-enbloc">'+t('Follow the property story','进入物业叙事')+' <span aria-hidden="true">↓</span></button>'+
  '<button class="property-start shop-start" data-go="shop-work">'+t('Follow the shopkeepers’ story','进入店主与租户叙事')+' <span aria-hidden="true">↓</span></button>'+
  '<button class="property-start visitor-start" data-go="visitor-route">'+t('Follow the visitors’ stories','进入顾客叙事')+' <span aria-hidden="true">↓</span></button>';
 const titles=ids.map(id=>root.querySelector('[data-title="'+id+'"]'));
 function renderEdges(){const which=ids.indexOf(lens);root.dataset.lens=lens;root.setAttribute('aria-label',current()[lens].label);endingRoot.dataset.lens=lens;endingRoot.innerHTML='<div class="ending-viewport"><h2 class="ending-title" id="story-ending-title">'+current()[lens].heading+'</h2><nav class="ending-nav" aria-label="'+t('Explore another perspective','切换叙事视角')+'">'+edge('left',ids[which-1])+edge('right',ids[which+1])+'</nav><button type="button" class="ending-down" data-go="chapter-converge" tabindex="-1" aria-hidden="true" inert><b>'+t('Where the stories meet','三种视角的交汇')+'</b><span>'+t('SCROLL DOWN TO CONTINUE','继续向下，走向结尾')+' ↓</span></button></div>';}
 function setEnding(ending){root.dataset.ending=String(ending);endingRoot.classList.toggle('is-ending',ending);endingRoot.querySelectorAll('[data-edge],.ending-down').forEach(hit=>{hit.inert=!ending;hit.tabIndex=ending?0:-1;hit.setAttribute('aria-hidden',String(!ending));});}
 const mix=(a,b,p)=>a+(b-a)*p;
 function setPresentation(state){
  presentation=state;const {progress:p,other,anchors,reveals,visible,titleOpacity=1}=state;
  const size=innerWidth<=700?Math.min(45,Math.max(32,innerWidth*.082)):Math.min(70,Math.max(36,innerWidth*.04));
  const width=innerWidth*(innerWidth<=700?.86:.80);
  titles.forEach((title,i)=>{
   const a=anchors[i],selected=ids[i]===lens,amount=reveals[i]*(selected?1:other);
   const opacity=visible?amount*titleOpacity:0;
   title.style.left=mix(a.x,innerWidth*.5,p)+'px';title.style.top=mix(a.y,innerHeight*.5,p)+'px';
   title.style.width=mix(a.width,width,p)+'px';title.style.fontSize=mix(a.size,size,p)+'px';
   title.style.lineHeight=String(mix(a.leading,1.13,p));title.style.letterSpacing=mix(a.tracking,-size*.035,p)+'px';
   title.style.opacity=String(opacity);title.style.visibility=opacity>.001||(locked&&ids[i]===switchingTarget)?'visible':'hidden';
   title.style.color=p===0?a.color:'rgb('+[244,241,237].map((v,j)=>Math.round(mix(a.rgb[j],v,p))).join(',')+')';
   title.setAttribute('aria-hidden',String(opacity<.05));
  });
 }
 function setLens(next){if(!ids.includes(next)||next===lens)return;setEnding(false);lens=next;renderEdges();setEnding(false);if(presentation)setPresentation(presentation);onLensChange(next)}
 function slideSwitch(next,direction){
  if(locked||!ids.includes(next)||next===lens)return;locked=true;switchingTarget=next;
  if(endingRoot.classList.contains('is-ending')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const pane=endingRoot.querySelector('.ending-viewport'),distance=(direction==='left'?1:-1)*60;let finished=false;
   const done=()=>{if(finished||destroyed)return;finished=true;clearTimeout(animationTimer);endingAnimation?.cancel();endingAnimation=null;locked=false;switchingTarget=null;setLens(next)};
   try{endingAnimation=pane.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX('+distance+'px)'}],{duration:320,easing:'ease-in',fill:'forwards'});endingAnimation.finished.then(done,done);}catch{done()}
   animationTimer=setTimeout(done,500);return;
  }
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||presentation?.titleOpacity<.05){setLens(next);locked=false;switchingTarget=null;return}
  const old=titles[ids.indexOf(lens)],incoming=titles[ids.indexOf(next)];incoming.style.visibility='visible';
  const d=(direction==='left'?-1:1)*innerWidth;let finished=false,animations=[];
  const done=()=>{if(finished||destroyed)return;finished=true;clearTimeout(animationTimer);animations.forEach(a=>a.cancel());locked=false;switchingTarget=null;setLens(next)};
  const options={duration:700,easing:'cubic-bezier(.22,.7,.18,1)',fill:'forwards'};
  try{animations=[old.animate([{transform:'translate(-50%,-50%) translateX(0)',opacity:1},{transform:'translate(-50%,-50%) translateX('+(-d)+'px)',opacity:0}],options),incoming.animate([{transform:'translate(-50%,-50%) translateX('+d+'px)',opacity:0},{transform:'translate(-50%,-50%) translateX(0)',opacity:1}],options)];Promise.all(animations.map(a=>a.finished)).then(done,done)}catch{done()}
  animationTimer=setTimeout(done,1200);
 }
 const activate=hit=>{if(endingRoot.classList.contains('is-ending'))slideSwitch(hit.dataset.target,hit.dataset.edge)};
 const click=e=>{const hit=e.target.closest('[data-edge]');if(hit){e.preventDefault();activate(hit)}};
 const key=e=>{const hit=e.target.closest?.('[data-edge]');if(hit&&(e.key==='Enter'||e.key===' ')){e.preventDefault();activate(hit)}};
 endingRoot.addEventListener('click',click);endingRoot.addEventListener('keydown',key);renderEdges();setEnding(false);
 return {setLens,setPresentation,setEnding,destroy(){destroyed=true;clearTimeout(animationTimer);endingAnimation?.cancel();titles.forEach(el=>el.getAnimations().forEach(a=>a.cancel()));endingRoot.removeEventListener('click',click);endingRoot.removeEventListener('keydown',key)}};
}
