/* Scroll-driven opening. Copy paraphrases recorded interviews with Frank, Pamela
 * and Stephen; photographs have separate source records. */
const people = [
  { id:'frank', name:'Frank', shop:"Frank’s Leathersmith", unit:'#02-41F', image:'S_Frank.JPG',
    en:{title:'A craft.<br><em>Passed on.</em>',text:'Frank learned leatherwork in his father’s workshop. After a period of retirement, he returned to the trade at Queensway in 2012.',alt:'Frank seated at his leatherworking bench, surrounded by tools and materials.'},
    zh:{title:'一门手艺。<br><em>代代相传。</em>',text:'Frank 在父亲的工坊里学会皮革手艺。退休一段时间后，他于 2012 年在女皇道重新做起这门生意。',alt:'Frank 坐在皮革工作台前，身旁是工具与材料。'} },
  { id:'pamela', name:'Pamela', shop:'Blueprint Principles', unit:'#02-40 / #02-20', image:'S_Pamela.JPG',
    en:{title:'Another place.<br><em>To begin again.</em>',text:'After leaving Peace Centre, Pamela brought Blueprint Principles to Queensway. Clothes donated by friends help sustain the social enterprise and the charities it supports.',alt:'The team’s photograph of Pamela at Blueprint Principles, with clothing and jewellery displayed around the shop.'},
    zh:{title:'另一个地方。<br><em>重新开始。</em>',text:'离开 Peace Centre 后，Pamela 将 Blueprint Principles 带到女皇道。朋友捐赠的衣物，支持着这家社会企业及其帮助的慈善机构。',alt:'小组提供的 Pamela 在 Blueprint Principles 的照片，店内陈列着衣物与饰品。'} },
  { id:'stephen', name:'Stephen', shop:'Kalibak’s Kave', unit:'#02-10', image:'S_Stephen.JPG',
    en:{title:'More than comics.<br><em>A community.</em>',text:'After more than twenty years in book retail, Stephen turned his comics hobby into Kalibak’s Kave. In the shop, new customers became friends.',alt:'Stephen standing among shelves of comics and collectibles at Kalibak’s Kave.'},
    zh:{title:'因漫画，<br><em>而相聚。</em>',text:'从事图书零售二十多年后，Stephen 把漫画爱好发展成 Kalibak’s Kave。在店里，新顾客渐渐成了朋友。',alt:'Stephen 站在 Kalibak’s Kave 的漫画与收藏品书架之间。'} }
];
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*t*(t*(t*6-15)+10);};
export function openingMarkup(lang='en') {
 const zh=lang==='zh';
 return `<section class="story-step opening" id="chapter-0" data-scene="0" aria-label="${zh?'女皇道的三段故事，向下滚动阅读':'Three Queensway stories. Scroll down to read.'}">
  <div class="opening-stage">
   <h1 class="opening-sr">${zh?'女皇道：在这里生活的人':'Queensway: the lives within'}</h1>
   ${people.map((p,i)=>{const c=p[lang];return `<article class="opening-slide opening-${p.id}${i===0?' is-current is-visible':''}" data-opening-slide="${i}" style="--layer:${i};--image-opacity:${i===0?1:0};--copy-opacity:${i===0?1:0}">
    <div class="opening-image-field" aria-hidden="true"><img class="opening-halo" src="assets/team/display/${p.id}-halo.webp" width="320" height="240" alt="" decoding="async"><div class="opening-photo-frame"><img class="opening-photo" src="assets/team/display/${p.id}-2400.webp" srcset="assets/team/display/${p.id}-1200.webp 1200w, assets/team/display/${p.id}-2400.webp 2400w" sizes="(max-width:700px) 150vw, 90vw" width="2400" height="1800" alt="" decoding="async" ${i===0?'fetchpriority="high"':''}></div></div>
    <span class="opening-sr">${c.alt}</span>
    <div class="opening-copy"><h2>${c.title}</h2><p class="opening-excerpt">${c.text}</p><p class="opening-person"><strong>${p.name}</strong><span>${p.shop}</span><small>${p.unit}</small></p></div>
   </article>`;}).join('')}
   <div class="opening-bottom"><div class="opening-count" aria-hidden="true"><span data-opening-count>01</span><i></i><span>03</span></div><p class="opening-scroll"><span>${zh?'向下滚动，走进他们的女皇道':'SCROLL INTO THEIR QUEENSWAY'}</span><i aria-hidden="true"></i></p><span class="opening-status">${zh?'小组实地采访':'FIELD INTERVIEWS'}</span></div>
  </div>
 </section>`;
}
export function mountOpening(root,{lang='en'}={}) {
 const slides=[...root.querySelectorAll('.opening-slide')],stage=root.querySelector('.opening-stage'),count=root.querySelector('[data-opening-count]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let index=-1,modal=false,frame=0,lastTime=0,position=0,target=0,velocity=0,initialized=false,top=0,travel=1;
 function measure(){top=root.getBoundingClientRect().top+scrollY;travel=Math.max(1,root.offsetHeight-stage.clientHeight);}
 function paint(p){
  const ab=smooth(.16,.42,p),bc=smooth(.49,.75,p);
  // Keep the underlying image visible while image and text fades run independently.
  const images=[ab===1?0:1,bc===1?0:ab,bc];
  const copy=[1-smooth(.16,.29,p),smooth(.29,.42,p)*(1-smooth(.49,.62,p)),smooth(.62,.75,p)];
  const next=bc>=.5?2:ab>=.5?1:0;
  slides.forEach((slide,i)=>{
   const visible=images[i]>.0001||copy[i]>.0001;
   slide.classList.toggle('is-visible',visible);
   slide.style.setProperty('--image-opacity',images[i].toFixed(4));
   slide.style.setProperty('--copy-opacity',copy[i].toFixed(4));
   if(visible){
    slide.style.setProperty('--drift',reduced.matches?'0px':`${((p-i*.33)*-7).toFixed(2)}px`);
    slide.style.setProperty('--image-scale',reduced.matches?'1':String(1.012+p*.012));
   }
   slide.classList.toggle('is-current',i===next);
  });
  root.style.setProperty('--opening-progress',String(p));
  stage.style.opacity=String(1-smooth(.90,1,p));
  if(index!==next){index=next;count.textContent=String(next+1).padStart(2,'0');root.dataset.story=people[next].id;}
 }
 function tick(time){
  frame=0;
  const dt=lastTime?Math.min(.04,(time-lastTime)/1000):1/60;lastTime=time;
  // Exact critically damped spring: continuous velocity through wheel and trackpad input.
  const omega=14,offset=position-target,b=velocity+omega*offset,decay=Math.exp(-omega*dt);
  position=target+(offset+b*dt)*decay;
  velocity=(velocity-omega*b*dt)*decay;
  if(Math.abs(target-position)<.00001&&Math.abs(velocity)<.0001){position=target;velocity=0;}
  paint(position);
  if((position!==target||velocity!==0)&&!modal)frame=requestAnimationFrame(tick);else lastTime=0;
 }
 function updateScroll(instant=false){
  const raw=(scrollY-top)/travel;target=clamp(raw);
  if(!initialized||instant||reduced.matches||raw<0||raw>1.1){
   cancelAnimationFrame(frame);frame=0;lastTime=0;velocity=0;position=target;paint(position);initialized=true;
  }else if(!frame&&!modal&&position!==target){lastTime=0;frame=requestAnimationFrame(tick);}
 }
 function resize(){measure();updateScroll(true);}
 const observer=new ResizeObserver(resize);observer.observe(root);observer.observe(stage);
 reduced.addEventListener('change',resize);
 root.querySelectorAll('.opening-image-field img').forEach(img=>img.decode?.().catch(()=>{}));
 measure();updateScroll(true);
 return {updateScroll,getIndex:()=>index,setActive:()=>{},setModal:value=>{
  modal=value;root.inert=modal;
  if(modal){cancelAnimationFrame(frame);frame=0;lastTime=0;velocity=0;}else updateScroll(true);
 },destroy:()=>{cancelAnimationFrame(frame);observer.disconnect();reduced.removeEventListener('change',resize);}};
}
