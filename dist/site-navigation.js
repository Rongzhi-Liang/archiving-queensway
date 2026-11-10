const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const select=(lang,en,zh)=>lang==='zh'?zh:en;
function siteSections(lang){
 const t=(en,zh)=>select(lang,en,zh);
 const chapter=(id,en,zh)=>({id,label:t(en,zh)});
 const action=(key,en,zh)=>({action:key,label:t(en,zh)});
 return [
  {key:'overview',title:t('Overview','概览'),entry:chapter('chapter-0','Start from the beginning','从开头阅读'),chapters:[
   chapter('chapter-0','The people','这里的人'),chapter('chapter-1','The corner','街角'),chapter('chapter-2','The building','建筑'),
   chapter('chapter-history','History & timeline','历史与时间线'),chapter('chapter-3','Inside the mall & floors','商场内部与楼层')
  ]},
  {key:'stories',title:t('Three perspectives','三种视角'),entry:chapter('chapter-bridge','Choose a perspective','选择视角'),chapters:[chapter('chapter-converge','Common ground','共同结论')],branches:[
   {title:t('Property & Land','物业与土地'),lens:'developer',chapters:[chapter('property-value','Price & value','价格与价值'),chapter('property-use','Use & possibility','使用与可能性'),chapter('property-choice','A shared decision','共同决定')]},
   {title:t('Shopkeepers & Tenants','店主与租户'),lens:'owner',chapters:[chapter('shop-work','Room to run a shop','经营的空间'),chapter('shop-mix','Different ways to trade','商户的差异'),chapter('shop-network','Working relationships','经营中的关系'),chapter('shop-stay','Making a move work','搬迁后的经营')]},
   {title:t('Visitors & Customers','顾客与访客'),lens:'visitor',chapters:[chapter('visitor-route','Reasons to visit','为何而来'),chapter('visitor-discovery','Finding something else','顺路的发现'),chapter('visitor-return','A familiar connection','熟悉的联系')]}
  ]},
  {key:'future',title:t('Future & participation','未来与参与'),entry:chapter('chapter-future','Future & participation','未来与参与'),chapters:[chapter('chapter-future','Future & participation','未来与参与')],tools:[
   {title:t('Project questionnaires','项目问卷'),items:[{href:'https://queenswayshoppingcentreproject.ushahidi.io/posts/create/2',label:t('Shop owners, tenants & employees','店主、租户与员工')},{href:'https://queenswayshoppingcentreproject.ushahidi.io/posts/create/3',label:t('Customers, visitors & neighbours','顾客、访客与街区邻居')}]}
  ]},
  {key:'about',title:t('About the project','关于项目'),entry:chapter('chapter-project','Project overview','项目总览'),chapters:[
   chapter('chapter-project','Project overview','项目总览'),chapter('ev-documents','Resources & sources','资源与来源'),
   chapter('chapter-team','The team','项目团队'),chapter('chapter-methods','Research methods','研究方法')
  ],tools:[
   {title:t('Credits & stewardship','署名与维护'),items:[action('sources','Sources & image credits','来源与影像署名'),action('stewardship','Contributions & corrections','补充与更正')]}
  ]}
 ];
}
export function navigationLabel(sectionId,lang='en',{lens='owner'}={}){
 const sections=siteSections(lang),stories=sections.find(s=>s.key==='stories');
 if(sectionId==='story-root')return stories.branches.find(b=>b.lens===lens)?.title||stories.title;
 if(sectionId==='chapter-explore')return select(lang,'Directory','商户目录');
 if(sectionId==='story-ending')return select(lang,'End of this perspective','本条叙事结尾');
 const current=sectionId.startsWith('ev-')&&sectionId!=='ev-documents'?'chapter-history':sectionId;
 const entries=sections.flatMap(s=>[...s.chapters,...(s.branches||[]).flatMap(b=>b.chapters),s.entry]);
 return entries.find(item=>item.id===current)?.label||'';
}

const mark=()=>`<span class="qnav-mark" aria-hidden="true">Q<span>⌖</span></span>`;
function navLink(item,role='standard'){
 const attributes=item.id?`data-go="${item.id}" data-qnav-section="${item.id}"${item.lens?` data-nav-lens="${item.lens}"`:''}`:item.action?`data-action="${item.action}"`:`href="${esc(item.href)}" target="_blank" rel="noopener noreferrer"`;
 const tag=item.href?'a':'button';
 return `<${tag}${tag==='button'?' type="button"':''} class="qn-link qn-${role}" ${attributes}>${esc(item.label)}${item.href?'<span class="qn-external" aria-hidden="true"> ↗</span>':''}</${tag}>`;
}
const navList=(items,role='standard')=>`<ul class="qn-list">${items.map((item,i)=>`<li style="--item:${i}">${navLink(item,role)}</li>`).join('')}</ul>`;
const branchRoot=branch=>({id:'story-root',lens:branch.lens,label:branch.title});
const branchEnd=(branch,lang)=>({id:'story-ending',lens:branch.lens,label:select(lang,'End of this perspective','本条叙事结尾')});
function menuContents(section,lang){
 const t=(en,zh)=>select(lang,en,zh);
 const group=(title,items,role='standard')=>`<section class="qnav-group"><h2>${esc(title)}</h2>${navList(items,role)}</section>`;
 if(section.branches)return `<div class="qnav-grid qnav-stories-grid"><section class="qnav-group qnav-lead"><h2>${t('Explore the perspectives','选择一种视角')}</h2>${navList(section.branches.map(branchRoot),'major')}<div class="qnav-related">${navLink(section.entry)}${navList(section.chapters)}</div></section>${section.branches.map(branch=>`<section class="qnav-group qnav-branch-group" data-qnav-lens="${branch.lens}"><h2>${esc(branch.title)}</h2>${navList(branch.chapters)}<div class="qnav-related">${navLink(branchEnd(branch,lang))}</div></section>`).join('')}</div>`;
 const main=group(section.title,section.chapters,'major');
 const extra=section.tools||[{title:t('Continue exploring','继续探索'),items:section.key==='overview'?[{id:'chapter-bridge',label:t('Three perspectives','三种视角')}]:[{id:'chapter-bridge',label:t('Revisit the perspectives','回到三种视角')},{id:'chapter-future',label:t('Share your experience','分享你的经历')}]}];
 return `<div class="qnav-grid">${main}${extra.map(g=>group(g.title,g.items)).join('')}</div>`;
}
export function siteHeaderMarkup(lang='en'){
 const t=(en,zh)=>select(lang,en,zh),sections=siteSections(lang);
 return `<header class="qnav" data-qnav>
 <div class="qnav-bar"><button type="button" class="qnav-brand" data-go="chapter-0" aria-label="${t('Archiving Queensway · Back to the beginning','Archiving Queensway · 返回开头')}">${mark()}<span class="qnav-name">Archiving<br>Queensway</span></button>
 <nav class="qnav-primary" aria-label="${t('Main navigation','全站导航')}">${sections.map(s=>`<button type="button" ${s.direct?`data-go="${s.entry.id}" data-qnav-section="${s.entry.id}"`:`data-qnav-toggle="${s.key}" aria-controls="qnav-${s.key}-panel" aria-expanded="false"`} data-qnav-zone="${s.key}">${esc(s.title)}</button>`).join('')}</nav>
 <div class="qnav-tools"><button type="button" class="qnav-language" data-action="language" aria-label="${t('Switch to Chinese','切换为英文')}">${t('中文','EN')}</button><button type="button" class="qnav-mobile-toggle" data-qnav-toggle="mobile" aria-controls="qnav-mobile-panel" aria-expanded="false" aria-label="${t('Site navigation','全站导航')}"><span class="qnav-menu-icon" aria-hidden="true"></span></button></div></div>
 <div class="qnav-local"><div class="qnav-local-inner"><span class="qnav-location" data-qnav-location>${esc(sections[0].title)}</span><nav class="qnav-local-links" data-qnav-local-links aria-label="${t('Chapters in this section','本部分章节')}">${sections[0].chapters.map(item=>navLink(item,'local')).join('')}</nav></div></div>
 <div class="qnav-scrim" data-qnav-dismiss hidden></div>
 <div class="qnav-flyout" hidden>${sections.map(s=>`<nav class="qnav-panel" id="qnav-${s.key}-panel" data-qnav-panel="${s.key}" aria-label="${esc(s.title)}" hidden inert><div class="qnav-panel-inner">${menuContents(s,lang)}</div></nav>`).join('')}</div>
 <div class="qnav-mobile-panel" id="qnav-mobile-panel" data-qnav-panel="mobile" hidden inert><nav aria-label="${t('Complete site navigation','完整全站导航')}"><div class="qnav-mobile-home">${sections.map((s,i)=>`<button type="button" ${s.direct?`data-go="${s.entry.id}" data-qnav-section="${s.entry.id}"`:`data-qnav-mobile-open="${s.key}"`} style="--item:${i}">${esc(s.title)}<span aria-hidden="true">${s.direct?'↗':'›'}</span></button>`).join('')}</div>${sections.map(s=>`<div class="qnav-mobile-view" data-mobile-view="${s.key}" hidden inert><button type="button" class="qnav-mobile-back" data-qnav-mobile-back><span aria-hidden="true">‹</span> ${t('All sections','全部栏目')}</button>${menuContents(s,lang)}</div>`).join('')}</nav></div></header>`;
}
// The footer keeps a concise directory while sharing destinations with the full menu.
function footerSections(lang){
 const t=(en,zh)=>select(lang,en,zh);
 const [overview,stories,future,about]=siteSections(lang);
 const tools=about.tools.flatMap(group=>group.items),tool=key=>tools.find(item=>item.action===key);
 return [
  {key:overview.key,title:overview.title,items:overview.chapters},
  {key:stories.key,title:stories.title,items:[...stories.branches.map(branchRoot),...stories.chapters]},
  {key:future.key,title:future.title,items:[
   {...future.entry,label:t('Share your experience','分享你的经历')},
   ...future.tools[0].items.map((item,i)=>({...item,label:i===0?t('Business questionnaire','商户问卷'):t('Visitor questionnaire','访客问卷')})),
   tool('stewardship')
  ]},
  {key:about.key,title:about.title,items:[...about.chapters,tool('sources')]}
 ];
}
function footerSection(section){
 return `<section class="qfoot-section qfoot-section-${section.key}" data-footer-section="${section.key}"><h2><button type="button" data-footer-toggle="${section.key}" aria-controls="qfoot-${section.key}-body" aria-expanded="true">${esc(section.title)}<span aria-hidden="true" class="qfoot-chevron"></span></button></h2><div class="qfoot-panel" id="qfoot-${section.key}-body"><div class="qfoot-panel-inner">${navList(section.items)}</div></div></section>`;
}
export function siteFooterMarkup(lang='en'){
 const t=(en,zh)=>select(lang,en,zh);
 return `<footer class="qfoot" id="site-footer" data-qfoot><div class="qfoot-inner"><nav class="qfoot-directory" aria-label="${t('Site directory','全站目录')}">${footerSections(lang).map(footerSection).join('')}</nav><div class="qfoot-bottom"><p>${t('DEP5118 · Community Data Gathering and Visualisation<br>Technical Assignment · National University of Singapore','DEP5118 · 社区数据收集与可视化<br>Technical Assignment · 新加坡国立大学')}</p><button type="button" data-go="chapter-0">${t('Back to the beginning','返回开头')} <span aria-hidden="true">↑</span></button><button type="button" data-action="language" aria-label="${t('Switch to Chinese','切换为英文')}"><span lang="en"${lang==='en'?' class="qfoot-current-language"':''}>English</span><span aria-hidden="true"> / </span><span lang="zh"${lang==='zh'?' class="qfoot-current-language"':''}>中文</span></button></div></div></footer>`;
}

/** Navigation owns its disclosure motion; app.js owns all story routing. */
export function mountSiteNavigation(root=document,{lang='en'}={}){
 const header=root.querySelector('[data-qnav]'),footer=root.querySelector('[data-qfoot]');
 const media=matchMedia('(max-width:1080px)'),footerMedia=matchMedia('(max-width:760px)'),hoverMedia=matchMedia('(hover:hover) and (pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const panels=header?[...header.querySelectorAll('[data-qnav-panel]')]:[],toggles=header?[...header.querySelectorAll('[data-qnav-toggle]')]:[];
 const flyout=header?.querySelector('.qnav-flyout'),scrim=header?.querySelector('.qnav-scrim'),mobile=header?.querySelector('.qnav-mobile-panel'),mobileHome=header?.querySelector('.qnav-mobile-home');
 let openKey=null,trigger=null,openMode=null,mobileView=null,destroyed=false,hoverTimer=0,closeTimer=0,exitTimer=0,frame=0,oldOverflow=null;
 const panelTimers=new Map(),backgroundState=new Map(),sections=siteSections(lang);
 const about=sections.find(section=>section.key==='about');
 const localLinks=header?.querySelector('[data-qnav-local-links]'),locationLabel=header?.querySelector('[data-qnav-location]');
 let localKey='overview';
 const duration=()=>reduced.matches?0:400;
 const focusable=container=>[...container.querySelectorAll('button:not([disabled]),a[href]')].filter(e=>e.getClientRects().length&&!e.closest('[inert]'));
 function lockScroll(lock){if(lock&&oldOverflow===null){oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';[...header.parentElement.children].filter(e=>e!==header).forEach(e=>{backgroundState.set(e,e.hasAttribute('inert'));e.inert=true;});}else if(!lock&&oldOverflow!==null){document.documentElement.style.overflow=oldOverflow;oldOverflow=null;backgroundState.forEach((value,e)=>e.inert=value);backgroundState.clear();}}
 function clearHover(){clearTimeout(hoverTimer);clearTimeout(closeTimer);}
 function retire(panel){panel.classList.remove('is-active');panel.inert=true;panel.setAttribute('aria-hidden','true');clearTimeout(panelTimers.get(panel));panelTimers.set(panel,setTimeout(()=>{if(panel.dataset.qnavPanel!==openKey)panel.hidden=true;},duration()));}
 function hideAll(){panels.forEach(p=>{p.hidden=true;p.inert=true;p.classList.remove('is-active');});if(flyout)flyout.hidden=true;if(scrim)scrim.hidden=true;}
 function close({restoreFocus=false,immediate=false}={}){
  clearHover();clearTimeout(exitTimer);cancelAnimationFrame(frame);const previous=trigger;openKey=null;trigger=null;openMode=null;
  toggles.forEach(b=>b.setAttribute('aria-expanded','false'));panels.forEach(retire);if(header){delete header.dataset.open;header.style.setProperty('--panel-height','0px');}
  lockScroll(false);if(immediate||reduced.matches)hideAll();else exitTimer=setTimeout(hideAll,duration());
  if(restoreFocus&&previous?.isConnected)previous.focus({preventScroll:true});
 }
 function mobilePage(key,{focus=true}={}){
  mobileView=key;mobileHome.hidden=!!key;mobileHome.inert=!!key;
  mobile.querySelectorAll('[data-mobile-view]').forEach(view=>{const active=view.dataset.mobileView===key;view.hidden=!active;view.inert=!active;view.classList.toggle('is-current-view',active);});
  mobile.scrollTop=0;if(focus){const target=key?mobile.querySelector(`[data-mobile-view="${key}"] .qnav-mobile-back`):mobileHome.querySelector('button');target?.focus({preventScroll:true});}
 }
 function resizePanel(){if(openKey&&openKey!=='mobile'){const active=panels.find(p=>p.dataset.qnavPanel===openKey);header.style.setProperty('--panel-height',`${active?.scrollHeight||0}px`);}}
 function open(key,{focusFirst=false,mode='click'}={}){
  if(destroyed)return;clearHover();if(key===openKey){if(mode!=='hover')openMode=mode;if(focusFirst)focusable(panels.find(p=>p.dataset.qnavPanel===key))[0]?.focus({preventScroll:true});return;}
  const next=panels.find(p=>p.dataset.qnavPanel===key),button=toggles.find(b=>b.dataset.qnavToggle===key);if(!next||!button)return;
  clearTimeout(exitTimer);cancelAnimationFrame(frame);panels.filter(p=>p!==next&&!p.hidden).forEach(retire);clearTimeout(panelTimers.get(next));
  openKey=key;trigger=button;openMode=mode;next.hidden=false;next.inert=false;next.removeAttribute('aria-hidden');next.scrollTop=0;scrim.hidden=false;
  if(key==='mobile'){flyout.hidden=true;mobilePage(null,{focus:false});lockScroll(true);}else{flyout.hidden=false;lockScroll(false);}
  toggles.forEach(b=>b.setAttribute('aria-expanded',String(b===button)));
  // Commit the collapsed state before transitioning, and retain the shell between categories.
  void next.offsetHeight;header.dataset.open=key;resizePanel();
  frame=requestAnimationFrame(()=>{next.classList.add('is-active');if(focusFirst)focusable(next)[0]?.focus({preventScroll:true});});
 }
 function toggleFooter(button){if(!footerMedia.matches)return;const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));const section=button.closest('[data-footer-section]'),body=section.querySelector('.qfoot-panel');section.classList.toggle('is-expanded',!expanded);body.inert=expanded;body.setAttribute('aria-hidden',String(expanded));}
 function click(event){
  const target=event.target instanceof Element?event.target:null;if(!target)return;
  const toggle=target.closest('[data-qnav-toggle]');if(toggle&&header?.contains(toggle)){const key=toggle.dataset.qnavToggle;if(openKey===key&&openMode!=='hover')close({restoreFocus:true});else open(key,{focusFirst:event.detail===0});return;}
  const next=target.closest('[data-qnav-mobile-open]');if(next){mobilePage(next.dataset.qnavMobileOpen);return;}
  if(target.closest('[data-qnav-mobile-back]')){const previous=mobileView;mobilePage(null,{focus:false});mobileHome.querySelector(`[data-qnav-mobile-open="${previous}"]`)?.focus({preventScroll:true});return;}
  const foot=target.closest('[data-footer-toggle]');if(foot){toggleFooter(foot);return;}
  if(target.closest('button[data-go],button[data-action],a[href]')&&(header?.contains(target)||footer?.contains(target))){close({immediate:true});return;}
  if(target.closest('[data-qnav-dismiss]')||!header?.contains(target))close();
 }
 function pointerover(event){
  if(media.matches||!hoverMedia.matches||event.pointerType==='touch')return;
  const target=event.target instanceof Element?event.target:null;if(!target)return;
  const toggle=target.closest('.qnav-primary>[data-qnav-toggle]');
  if(toggle){clearHover();if(openKey!==toggle.dataset.qnavToggle)hoverTimer=setTimeout(()=>open(toggle.dataset.qnavToggle,{mode:'hover'}),openKey?60:120);}
  else if(target.closest('.qnav-panel'))clearHover();
  else if(openKey)leave();
 }
 function leave(){clearHover();if(openKey&&openKey!=='mobile')closeTimer=setTimeout(()=>close(),180);}
 function keydown(event){
  const target=event.target instanceof Element?event.target:null;if(!target)return;
  const primary=target.closest('.qnav-primary>button');
  if(primary&&['ArrowLeft','ArrowRight'].includes(event.key)){const items=[...header.querySelectorAll('.qnav-primary>button')],index=items.indexOf(primary),next=items[(index+(event.key==='ArrowRight'?1:-1)+items.length)%items.length];event.preventDefault();next.focus({preventScroll:true});if(openKey){if(next.dataset.qnavToggle)open(next.dataset.qnavToggle,{mode:'keyboard'});else close();}return;}
  const toggle=target.closest('[data-qnav-toggle]');
  if(toggle&&header?.contains(toggle)){
   if(event.key==='ArrowDown'){event.preventDefault();open(toggle.dataset.qnavToggle,{focusFirst:true,mode:'keyboard'});return;}
  }
  if(event.key==='Escape'&&openKey){event.preventDefault();close({restoreFocus:true});return;}
  if(event.key==='Tab'&&openKey==='mobile'){const items=focusable(header),first=items[0],last=items.at(-1);if(event.shiftKey&&target===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&target===last){event.preventDefault();first?.focus();}return;}
  const panel=target.closest('[data-qnav-panel]');if(!panel||panel.inert||!['Home','End'].includes(event.key))return;const items=focusable(panel);event.preventDefault();(event.key==='Home'?items[0]:items.at(-1))?.focus({preventScroll:true});
 }
 function focusin(event){if(openKey&&!header?.contains(event.target))close();}
 function breakpoint(){close({immediate:true});}
 function syncFooter(){footer?.querySelectorAll('[data-footer-section]').forEach(section=>{const b=section.querySelector('[data-footer-toggle]'),body=section.querySelector('.qfoot-panel'),expanded=!footerMedia.matches;section.classList.toggle('is-expanded',expanded);b.setAttribute('aria-expanded',String(expanded));b.tabIndex=expanded?-1:0;b.disabled=expanded;body.inert=!expanded;body.setAttribute('aria-hidden',String(!expanded));});}
 function setActive({sectionId='',lens=''}={}){
  if(destroyed)return;
  const branch=sectionId.startsWith('property-')?'developer':sectionId.startsWith('shop-')?'owner':sectionId.startsWith('visitor-')?'visitor':['story-root','story-ending'].includes(sectionId)?lens:null;
  const current=sectionId.startsWith('ev-')&&sectionId!=='ev-documents'?'chapter-history':sectionId;
  const zone=branch||['story-root','story-ending','chapter-bridge','chapter-converge'].includes(current)?'stories':current==='chapter-future'?'future':about.chapters.some(chapter=>chapter.id===current)?'about':'overview';
  const section=sections.find(s=>s.key===zone),currentBranch=section.branches?.find(b=>b.lens===branch);
  const nextLocalKey=current==='chapter-explore'?'directory-detail':zone+(currentBranch?`-${currentBranch.lens}`:'');
  if(localLinks&&nextLocalKey!==localKey){
   localKey=nextLocalKey;
   const items=current==='chapter-explore'?[{id:'chapter-3',label:select(lang,'← Inside the mall & floors','← 商场内部与楼层')}]:currentBranch?[{...section.entry,label:section.title},...currentBranch.chapters]:section.branches?[...section.branches.map(branchRoot),...section.chapters]:section.chapters;
   const localLabels={
    'chapter-explore':select(lang,'Browse all shops','浏览全部商户'),
    'chapter-future':select(lang,'Share your experience','分享你的经历')
   };
   localLinks.innerHTML=items.map(item=>navLink(localLabels[item.id]?{...item,label:localLabels[item.id]}:item,'local')).join('');
  }
  if(locationLabel)locationLabel.textContent=current==='chapter-explore'?select(lang,'Directory','商户目录'):currentBranch?.title||section.title;
  [header,footer].forEach(container=>{
   container?.querySelectorAll('[data-qnav-section]').forEach(b=>{const active=(b.dataset.qnavSection===current||(container===footer&&b.dataset.qnavSection==='story-root'&&!!branch))&&(!b.dataset.navLens||b.dataset.navLens===(branch||lens));b.classList.toggle('is-current',active);if(active)b.setAttribute('aria-current','location');else b.removeAttribute('aria-current');});
   container?.querySelectorAll('[data-qnav-lens]').forEach(g=>g.classList.toggle('is-current-branch',g.dataset.qnavLens===branch));
  });
  const localCurrent=localLinks?.querySelector('[aria-current]');
  if(localCurrent&&localLinks.scrollWidth>localLinks.clientWidth){const start=localCurrent.offsetLeft-localLinks.offsetLeft;localLinks.scrollTo({left:Math.max(0,start-(localLinks.clientWidth-localCurrent.offsetWidth)/2),behavior:'instant'});}
  header?.querySelectorAll('[data-qnav-zone]').forEach(b=>{const active=b.dataset.qnavZone===zone;b.classList.toggle('is-current',active);if(active)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
 }
 root.addEventListener('click',click);root.addEventListener('keydown',keydown);root.addEventListener('focusin',focusin);header?.addEventListener('pointerover',pointerover);header?.addEventListener('pointerleave',leave);scrim?.addEventListener('pointerenter',leave);media.addEventListener('change',breakpoint);footerMedia.addEventListener('change',syncFooter);window.addEventListener('resize',resizePanel);syncFooter();
 const observer=typeof ResizeObserver==='function'?new ResizeObserver(resizePanel):null;header?.querySelectorAll('.qnav-panel-inner').forEach(e=>observer?.observe(e));
 const destroy=()=>{if(destroyed)return;destroyed=true;close({immediate:true});panelTimers.forEach(clearTimeout);observer?.disconnect();root.removeEventListener('click',click);root.removeEventListener('keydown',keydown);root.removeEventListener('focusin',focusin);header?.removeEventListener('pointerover',pointerover);header?.removeEventListener('pointerleave',leave);scrim?.removeEventListener('pointerenter',leave);media.removeEventListener('change',breakpoint);footerMedia.removeEventListener('change',syncFooter);window.removeEventListener('resize',resizePanel);};
 destroy.destroy=destroy;destroy.setActive=setActive;destroy.close=close;return destroy;
}
