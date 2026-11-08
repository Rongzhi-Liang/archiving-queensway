const external=(url,label)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;

function researchContent(lang){
 const t=(en,zh)=>lang==='zh'?zh:en;
 const groups=[
  {name:t('HISTORY','历史'),start:1,items:[t('How does Queensway fit into Singapore’s history of strata ownership and mixed-use malls?','女皇道在新加坡分层产权与商住综合体的发展历史中处于什么位置？')]},
  {name:t('PROPERTY & LAND','物业与土地'),start:2,items:[
   t('How do today’s uses relate to the land uses shown in the planning map?','今天的建筑使用与规划图中的土地用途有何联系？'),
   t('What do zoning, plot ratio and development conditions mean for the site’s future?','规划分区、容积率与开发条件如何影响场地的未来？'),
   t('How do a project’s scale, costs, timing and potential income shape its value?','项目规模、成本、时间与潜在收入如何共同影响开发价值？'),
   t('What do asking prices, recorded transactions and regional indices each tell us?','挂牌要价、实际成交与区域指数各自说明了什么？')
  ]},
  {name:t('SHOPKEEPERS & TENANTS','店主与租户'),start:6,items:[
   t('What kinds of businesses share the mall’s three retail floors?','商场的三层商铺容纳了哪些不同的生意？'),
   t('How do the histories of the building, its businesses and the people who work here intersect?','建筑、商家与在此工作的人，各自的历史如何交会？'),
   t('Why do shopkeepers choose Queensway as a place to work?','商户为什么选择在女皇道经营？'),
   t('How do family ties, neighbouring businesses and collector networks support everyday trade?','家庭联系、邻店往来与收藏者网络如何支持日常经营？'),
   t('What does a shop mean in the working life of its owner or employee?','一家店在店主或员工的工作经历中意味着什么？')
  ]},
  {name:t('VISITORS & CUSTOMERS','顾客与访客'),start:11,items:[
   t('Which goods, services and interests bring people to Queensway?','哪些商品、服务与兴趣吸引人们来到女皇道？'),
   t('What do shopkeepers and employees say about the connections that bring customers back?','店主与员工如何讲述那些让顾客再次回来的联系？'),
   t('How do the mall’s location and layout connect people with shops and services?','商场的位置与内部布局如何连接人们、商铺和服务？'),
   t('How do visitors describe their own experiences of Queensway?','访客如何描述自己在女皇道的经历？')
  ]}
 ];
 const source=(url,title,detail)=>`<li>${external(url,title)}<small>${detail}</small></li>`;
 const sources=[
  {title:t('Interviews, photographs & shop records','采访、照片与商户资料'),items:[
   `<li>${t('Interviews with shopkeepers and employees','店主与员工采访')}<small>${t('Accounts from Frank, Pamela, Stephen, Karolina at Dirty Laundry, Ishak at Newlink Sports, and Kelvin at Toybros. Attributed audio excerpts accompany the relevant stories.','Frank、Pamela、Stephen、Dirty Laundry 的 Karolina、Newlink Sports 的 Ishak 及 Toybros 的 Kelvin 的访谈。具名录音节选嵌入对应叙事。')}</small></li>`,
   `<li>${t('Shop directory','商户目录')}<small>${t('Business names, floors, unit numbers and uses. Directory accessed on 8 November 2026; individual entries can be explored in the archive.','商家名称、楼层、铺号与用途。目录查阅于2026年11月8日；具体条目可在档案探索页查阅。')}</small></li>`,
   `<li>${t('Photograph collection & floor plans','图像档案与楼层图')}<small>${t('Photograph collection and floor plans: Archiving Queensway. Each photograph is presented with the business name and location it depicts. Image credits accompany the photographs.','图像档案与楼层图：Archiving Queensway。照片注明所呈现的商家与位置，并附影像署名。')}</small></li>`,
   `<li>${t('Project design & interview accounts','项目设计与采访整理')}<small>${t('Research and interview accounts by Archiving Queensway connect property, livelihoods and everyday use through the experiences of people and places.','Archiving Queensway 的研究与采访整理通过人物和地点的经历，连接物业、生计与日常使用。')}</small></li>`
  ]},
  {title:t('History, planning & property','历史、规划与物业'),items:[
   source('https://anatomy.sg/Singapore-Strata-Malls-Book','Chua & Chan (2024), Singapore Strata Malls: A Retrospective for the Future',t('Historical context for strata ownership and Singapore’s malls.','分层产权与新加坡商场发展的历史背景。')),
   source('https://eservice.ura.gov.sg/maps/','URA SPACE · MP2025',t('URA Master Plan 2025 designates the Queensway site as Commercial & Residential, with EVA in the plot-ratio field.','URA 2025 总体规划将女皇道场地列为商业与住宅用途，容积率字段标注为 EVA。')),
   source('data/market-expanded.json',t('Dated advertisements and original links','挂牌记录与原始链接'),t('29 observations from 19–20 October 2026, retaining dates, property categories and asking amounts.','2026年10月19—20日的29条观察，保留日期、物业类别与挂牌要价。')),
   source('data/retail-indices.json',t('Regional retail price and rent series','区域零售物业价格与租金序列'),t('Central Region series, 2011 Q1–2026 Q2, each rebased to its own 2011 Q1 level.','中区序列覆盖2011年第一季度至2026年第二季度，分别以自身2011年第一季度为基准。')),
   source('data/queensway-resale.json',t('Residential resale records','住宅转售记录'),t('105 residential transactions from URA REALIS, transcribed from screenshots by Archiving Queensway.','105条住宅交易，来源为 URA REALIS，由 Archiving Queensway 依据截图转录。')),
   source('data/research-sources.json',t('Historical, planning and market references','历史、规划与市场参考资料'),t('Original links and dates for documents, published reporting, planning rules and market records.','文件、公开报道、规划规定与市场记录的原始链接及日期。'))
  ]},
  {title:t('Maps & geographic references','地图与地理参照'),items:[
   source('https://www.onemap.gov.sg/',t('OneMap satellite imagery','OneMap 卫星影像'),t('Imagery retrieved 7 November 2026 locates buildings and surrounding places. OneMap © contributors | Singapore Land Authority.','2026年11月7日获取的影像用于辨认建筑及周边地点。OneMap © contributors | Singapore Land Authority。')),
   source('https://www.onemap.gov.sg/legal/opendatalicence.html','SLA OneMap · Singapore Open Data Licence',t('Geographic reference and attribution for OneMap material.','OneMap地理资料的参照与使用署名。')),
   `<li>${external('https://openfreemap.org/','OpenFreeMap')} · ${external('https://www.openstreetmap.org/copyright','OpenStreetMap / ODbL')} · ${external('https://maplibre.org/','MapLibre')}<small>${t('Map tiles, building outlines and map rendering. Floor plans: Archiving Queensway.','地图瓦片、建筑轮廓与地图显示。楼层图制作：Archiving Queensway。')}</small></li>`
  ]},
  {title:t('Participation & project context','参与入口与项目背景'),items:[
   `<li>${external('https://queenswayshoppingcentreproject.ushahidi.io/posts/create/2',t('Shopkeeper questionnaire','店主问卷'))} · ${external('https://queenswayshoppingcentreproject.ushahidi.io/posts/create/3',t('Visitor questionnaire','访客问卷'))}<small>${t('Published project questionnaires on Ushahidi. Complete and submit your contribution on the relevant form.','项目在Ushahidi发布的问卷。请在对应表单填写并提交。')}</small></li>`
  ]}
 ];
 return {groups,sources};
}

const projectPeople=[
 {name:'Amira Paramitha',en:'PhD student in Architecture',zh:'建筑学博士研究生',
  bioEn:[
   'Amira is a PhD student in the Department of Architecture at the National University of Singapore. Her action research focuses on community participation at the neighbourhood scale, particularly in housing and water systems, as well as the impact of water infrastructure on public spaces in urban kampungs.',
   'Through her research and projects, she emphasizes participatory approaches to developing designs and action plans for community-led urban upgrading.'
  ],bioZh:[
   'Amira 是新加坡国立大学建筑系的博士研究生。她的行动研究聚焦邻里尺度的社区参与，尤其关注住房与水系统，以及水基础设施对城市甘榜公共空间的影响。',
   '在研究与项目实践中，她强调以参与式方法共同制定设计方案与行动计划，推动由社区主导的城市更新。'
  ]},
 {name:'Danielle Berboso',en:'Master of Architecture student',zh:'建筑学硕士研究生',
  bioEn:[
   'Danielle Berboso is a Masters of Architecture student at the National University of Singapore. Her interests lie in emergent creative communities and the potentials of civic involvement within the creative space. Her research specialises in community engagement and archiving of community histories as driving forces for urban regeneration.',
   'She aspires to activate spaces threatened by redevelopment pressures as future communal anchors while protecting their existing ecosystems.'
  ],bioZh:[
   'Danielle Berboso 是新加坡国立大学建筑学硕士研究生。她关注新兴创意社群，以及创意空间中的公民参与潜力。她的研究着重探讨社区参与和社区历史存档如何推动城市再生。',
   '她希望激活面临重建压力的空间，使其成为未来社区生活的重要据点，同时保护这些空间既有的社群生态。'
  ]},
 {name:'Liang Rongzhi',en:'Master of Urban Planning student',zh:'城市规划硕士研究生',
  bioEn:[
   'Liang Rongzhi is a Master of Urban Planning student at the National University of Singapore. His interests include urban economics, housing, transport, community development and environmental resilience. He explores how planning decisions and urban change shape access to opportunities, services and everyday spaces.',
   'His work brings together quantitative research, spatial analysis and interactive visualisation to understand relationships between people, infrastructure and the built environment, and to make complex urban issues more accessible to a wider audience.'
  ],bioZh:[
   'Liang Rongzhi 是新加坡国立大学城市规划硕士研究生。他关注城市经济、住房、交通、社区发展与环境韧性，探索规划决策和城市变化如何影响人们获取机会、服务与日常空间。',
   '他的工作结合定量研究、空间分析与交互式可视化，以理解人与基础设施、建成环境之间的关系，并让更广泛的公众理解复杂的城市议题。'
  ]}
];
const projectT=lang=>(en,zh)=>lang==='zh'?zh:en;
const projectLink=(action,label)=>`<button class="pi-text-link" type="button" data-action="${action}">${label}<span aria-hidden="true">↗</span></button>`;
const projectGo=(id,label)=>`<button class="pi-text-link" type="button" data-go="${id}">${label}<span aria-hidden="true">↗</span></button>`;
const readerShell=(lang,{kicker,title,intro,body,extra=''})=>`<article class="project-reader" lang="${lang==='zh'?'zh':'en'}"><header class="pr-intro"><p class="pr-kicker">${kicker}</p><h2>${title}</h2><p class="pr-lead">${intro}</p>${extra}</header><div class="pr-body">${body}</div></article>`;

/** The archive continues through three concrete stages, with one expanded at a time. */
export function projectInformationMarkup(lang='en'){
 const t=projectT(lang);
 const stages=[
  {id:'record',label:t('Trace the sources','回到资料'),status:t('DOCUMENTS & PHOTOGRAPHS','文件与照片'),title:t('A source for every account.','每一份叙述，都有来处。'),copy:t('Follow the property records, directory entries, interview materials and original photographs behind the story.','沿着物业记录、目录条目、采访材料与原始照片，找到故事的依据。'),action:'sources',link:t('Browse the sources','查阅资料来源')},
  {id:'care',label:t('Read the method','理解方法'),status:t('RESEARCH & INTERPRETATION','研究与解释'),title:t('See how the pieces connect.','看见资料如何相连。'),copy:t('Dates, places and the type of evidence stay with each record. The method explains how they become maps, comparisons and narratives.','日期、地点与资料类型伴随每条记录。研究方法说明它们如何成为地图、比较和叙事。'),action:'methods',link:t('Read the research method','阅读研究方法')},
  {id:'future',label:t('Add or correct a record','补充与更正'),status:t('PROJECT QUESTIONNAIRES','项目问卷'),title:t('Bring your experience into view.','让你的经历被看见。'),copy:t('Use the published project questionnaires to share an experience or provide details for a correction.','通过项目现有问卷分享经历，或提供需要更正的资料。'),action:'stewardship',link:t('Contribution and correction details','查看参与及更正方式')}
 ];
 return `<section id="chapter-project" class="story-step afterword-section project-information" data-scene="13" data-afterword-label="${t('About the project','关于项目')}" aria-labelledby="pi-title">
 <div class="pi-intro pi-reading"><p class="pi-kicker">${t('04 / ABOUT THE PROJECT','04／关于项目')}</p><h2 id="pi-title">${t('One place.<br><em>A shared record.</em>','同一个地方，<br><em>共同留下记录。</em>')}</h2><p class="pi-lead">${t('Archiving Queensway brings property, working life and everyday relationships into one record. Read the evidence, meet the team and share what you know.','Archiving Queensway 将物业、工作与日常关系放进同一份记录。你可以查阅依据、认识团队，并分享自己知道的故事。')}</p><p class="pi-status">${t('National University of Singapore<br>DEP5118 · Community Data Gathering and Visualisation<br>Technical Assignment','新加坡国立大学<br>DEP5118 · 社区数据收集与可视化<br>Technical Assignment')}</p><div class="pi-intro-actions">${projectLink('about',t('Meet the team','认识项目团队'))}${projectLink('methods',t('How the archive is made','了解研究方法'))}</div></div>
 <div class="pi-main pi-visual" aria-label="${t('Sources, method and participation','来源、方法与参与')}"><p class="pi-stage-instruction">${t('Follow the work behind the story.','了解故事背后的研究。')}</p><div class="pi-stages">${stages.map((stage,i)=>`<div class="pi-stage" data-stage="${stage.id}"><button id="pi-stage-${stage.id}" class="pi-stage-toggle" type="button" data-project-stage="${stage.id}" aria-controls="pi-stage-body-${stage.id}" aria-expanded="${i===0}"><span class="pi-stage-number" aria-hidden="true">0${i+1}</span><span>${stage.label}</span><span class="pi-stage-sign" aria-hidden="true">${i===0?'−':'+'}</span></button><div class="pi-stage-body" id="pi-stage-body-${stage.id}" role="region" aria-labelledby="pi-stage-${stage.id}" ${i===0?'':'hidden'}><p class="pi-stage-status">${stage.status}</p><h3>${stage.title}</h3><p class="pi-stage-copy">${stage.copy}</p>${projectLink(stage.action,stage.link)}</div></div>`).join('')}</div></div>
 </section>`;
}

export function mountProjectInformation(root,{lang='en'}={}){
 const section=root?.matches?.('.project-information')?root:root?.querySelector?.('.project-information');
 if(!section)return ()=>{};
 const controller=new AbortController(),{signal}=controller;
 const buttons=[...section.querySelectorAll('[data-project-stage]')];
 const setStage=(value,focus=false)=>{
  if(!['record','care','future'].includes(value))value='record';
  buttons.forEach(button=>{
   const selected=button.dataset.projectStage===value;
   button.setAttribute('aria-expanded',String(selected));
   button.querySelector('.pi-stage-sign').textContent=selected?'−':'+';
   const panel=section.querySelector(`#pi-stage-body-${button.dataset.projectStage}`);
   panel.hidden=!selected;
   if(selected&&focus)button.focus();
  });
  try{sessionStorage.setItem('qsc-project-stage',value);}catch{}
 };
 let saved='record';try{saved=sessionStorage.getItem('qsc-project-stage')||saved;}catch{}setStage(saved);
 section.addEventListener('click',event=>{const button=event.target.closest('[data-project-stage]');if(button&&section.contains(button))setStage(button.dataset.projectStage);},{signal});
 section.addEventListener('keydown',event=>{
  const button=event.target.closest('[data-project-stage]');if(!button)return;
  const index=buttons.indexOf(button);let next=index;
  if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%buttons.length;
  else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index-1+buttons.length)%buttons.length;
  else if(event.key==='Home')next=0;else if(event.key==='End')next=buttons.length-1;else return;
  event.preventDefault();setStage(buttons[next].dataset.projectStage,true);
 },{signal});
 return ()=>controller.abort();
}

export function methodsMarkup(lang='en'){
 const t=projectT(lang),{groups}=researchContent(lang);
 const visuals=[
  [t('Physical setting and planning','实体环境与规划'),t('OneMap satellite imagery, building records, URA MP2025 zoning and dated public project documents. Existing uses and planned uses are identified separately.','OneMap卫星影像、建筑资料、URA MP2025分区与有日期的公共项目文件；分别标明现状使用与规划用途。')],
  [t('Property value','物业价值'),t('Dated advertisements, Central Region indices and recorded home resales. Each series keeps its own property category, time period and measurement.','有日期的挂牌、中区指数及住宅转售记录；各组资料保留自身物业类别、时间范围与计量口径。')],
  [t('People and places','人物与地点'),t('Interviews, edited accounts, the shop directory and original photographs connect people and businesses to their locations in the mall.','采访、叙述整理、商户目录与原始照片，将人物和商家与其在商场中的位置相连。')],
  [t('Participation','参与'),t('The site links directly to the project’s published shopkeeper and visitor questionnaires on Ushahidi.','网站直接连接项目在Ushahidi发布的店主及访客问卷。')]
 ];
 return readerShell(lang,{kicker:t('METHODS / REVISED 8 NOVEMBER 2026','研究方法／2026年11月8日修订'),title:t('Gather carefully.<br>Keep the context.','认真收集，<br>保留资料语境。'),intro:t('A market record and a personal account answer different questions. We connect them while retaining their sources, dates and meanings.','市场记录与个人叙述回答不同的问题。我们将它们联系起来，同时保留各自的来源、日期与意义。'),extra:projectLink('sources',t('Browse the sources','查阅资料来源')),body:`
 <section><h3>${t('01 / Keep the original context','01／保留原始语境')}</h3><p>${t('Each record includes its date, property category, name and unit number. Photographs retain their original framing and credit. A shopfront identifies a place; an interview carries a person’s account.','每条记录附有日期、物业类别、人名与铺号。照片保留完整画面并注明作者；门面辨认地点，采访承载人物叙述。')}</p></section>
 <section><h3>${t('02 / Choose the right spatial scale','02／采用合适的空间尺度')}</h3><p>${t('Shop records connect to directory units, while area maps establish the mall’s setting. Regional market indices provide context for individual property records.','商铺记录对应目录铺位，区域地图呈现商场环境；区域市场指数为具体物业记录提供背景。')}</p></section>
 <section><h3>${t('03 / Separate evidence and interpretation','03／区分资料与解释')}</h3><p>${t('Interviews remain attributed to their speakers. Editorial summaries explain relationships across the material; asking prices, transaction prices and planning conditions retain their different meanings.','采访注明讲述者。编辑整理解释资料之间的联系；挂牌价、成交价与规划条件保留不同含义。')}</p></section>
 <section><h3>${t('From source to visual','从资料到可视化')}</h3><div class="pr-details">${visuals.map(([name,body])=>`<details><summary>${name}<span aria-hidden="true">＋</span></summary><p>${body}</p></details>`).join('')}</div></section>
 <section><h3>${t('Research questions','研究问题')}</h3><div class="pr-details">${groups.map(group=>`<details><summary>${group.name}<span aria-hidden="true">＋</span></summary><ol start="${group.start}">${group.items.map(item=>`<li>${item}</li>`).join('')}</ol></details>`).join('')}</div></section>
 <section><h3>${t('Details matter','细节很重要')}</h3><p>${t('If a name, photograph, location or account needs correcting, identify the page and the supporting information through the relevant project questionnaire.','如人名、照片、地点或叙述需要更正，请通过对应项目问卷指出页面及支持资料。')}</p>${projectLink('stewardship',t('How to provide a correction','如何提供更正信息'))}</section>`});
}

export function sourcesMarkup(lang='en'){
 const t=projectT(lang),{sources}=researchContent(lang);
 return readerShell(lang,{kicker:t('SOURCES / REVISED 8 NOVEMBER 2026','来源与影像／2026年11月8日修订'),title:t('Every account<br>has a source.','每一份叙述，<br>都有来处。'),intro:t('Follow the documents, photographs and map data behind the site. Source dates and attribution remain with the records.','查阅网站背后的文件、照片与地图数据；记录保留来源日期和归属。'),extra:projectLink('methods',t('How the materials are used','了解资料使用方法')),body:`
 <section><h3>${t('Sources & credits','资料来源与署名')}</h3><div class="pr-details pr-source-groups">${sources.map((section,i)=>`<details ${i===0?'open':''}><summary>${section.title}<span aria-hidden="true">＋</span></summary><ul class="pr-source-list">${section.items.join('')}</ul></details>`).join('')}</div></section>
 <section><h3>${t('Images keep their attribution','影像保留归属')}</h3><p>${t('Original shop photographs, historical images and document facsimiles retain their source references. Map credits identify OneMap / SLA, URA, OpenFreeMap and OpenStreetMap where used.','店铺原照、历史影像与文件图像保留来源。地图按使用情况标注OneMap／SLA、URA、OpenFreeMap与OpenStreetMap。')}</p></section>`});
}

/** Preserve the current (lang) and legacy (type, lang) interfaces. */
export function aboutMarkup(typeOrLang='en',legacyLang){
 const lang=legacyLang??(typeOrLang==='zh'?'zh':'en'),t=projectT(lang);
 if(typeOrLang==='partners')return stewardshipMarkup(lang);
 return readerShell(lang,{kicker:t('THE PROJECT TEAM','项目团队'),title:t('Three perspectives.<br>One shared inquiry.','三种专业视角，<br>一份共同探索。'),intro:t('We are three researchers in architecture and urban planning at the National University of Singapore. Archiving Queensway brings our interests in community participation, urban change and everyday places together.','我们是来自新加坡国立大学建筑学与城市规划专业的三位研究者。Archiving Queensway 将我们对社区参与、城市变化与日常空间的关注汇集在一起。'),extra:`<p class="pr-team-context">${t('DEP5118 · Community Data Gathering and Visualisation<br>Technical Assignment','DEP5118 · 社区数据收集与可视化<br>Technical Assignment')}</p>${projectLink('methods',t('Our research approach','我们的研究方法'))}`,body:`
 <div class="pr-team-profiles">${projectPeople.map((person,i)=>`<section class="pr-person" aria-labelledby="pr-person-${i}"><header><p class="pr-degree">${t(person.en,person.zh)}</p><h3 id="pr-person-${i}" lang="en">${person.name}</h3></header>${t(person.bioEn,person.bioZh).map(paragraph=>`<p>${paragraph}</p>`).join('')}</section>`).join('')}</div>`});
}

/** The established action name now opens participation and correction information. */
export function stewardshipMarkup(lang='en'){
 const t=projectT(lang);
 return readerShell(lang,{kicker:t('PARTICIPATION & CORRECTIONS','参与与更正'),title:t('Share an experience.<br>Help a record stay accurate.','分享一段经历，<br>让记录更准确。'),intro:t('Choose the project questionnaire that matches your connection to Queensway. The form opens on Ushahidi, where you can complete and submit it.','按你与女皇道的联系选择项目问卷，在打开的Ushahidi页面填写并提交。'),extra:projectGo('chapter-future',t('Return to participation','回到参与页面')),body:`
 <section><h3>${t('Share your account','分享你的经历')}</h3><div class="pr-contact-links">${external('https://queenswayshoppingcentreproject.ushahidi.io/posts/create/2',t('Shopkeeper and employee questionnaire','店主与员工问卷'))}${external('https://queenswayshoppingcentreproject.ushahidi.io/posts/create/3',t('Visitor and customer questionnaire','访客与顾客问卷'))}</div><p>${t('Include the shop or place, the period you are describing and the experience you want to share. Follow the questions and information on the form.','请说明店铺或地点、你描述的时间，以及希望分享的经历，并按问卷中的问题和说明填写。')}</p></section>
 <section><h3>${t('Point to the record that needs attention','指出需要更正的记录')}</h3><p>${t('In the relevant questionnaire, identify the page or story, shop name and unit number. Explain which detail should change and include a source or date that helps establish it.','在对应问卷中注明页面或故事、店名与铺号，说明哪一项需要更正，并附上有助于核实的来源或日期。')}</p><p>${t('For a photograph or quotation, describe the image or passage clearly so it can be located.','涉及照片或引语时，请明确描述图像或段落，便于定位。')}</p></section>
 <section><h3>${t('Follow the source','同时查阅来源')}</h3><p>${t('The shop directory and references show the sources behind each page and help locate the details you want to add or correct.','商户目录与参考资料呈现各页的资料来源，便于找到需要补充或更正的细节。')}</p>${projectLink('sources',t('Browse the sources','查阅资料来源'))}</section>`});
}
