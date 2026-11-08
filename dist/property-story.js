import { narrativeSection, mountNarrativeReadings, seekNarrativeReading, esc } from './narrative-system.js?v=20261108-public-team1';
import { retailStoryFrame } from './context-indices.js?v=20261108-formal1';
import { potentialMarkup, mountPotential, potentialReadings } from './property-potential.js?v=20261108-scroll1';
import { choiceReadings, choicePanels } from './property-choice.js?v=20261108-public-team1';
import { landMapMarkup, mountLandMap } from './property-land-map.js?v=20261108-release1';

const sources={
 attempt:'https://www.channelnewsasia.com/singapore/queensway-shopping-centre-en-bloc-attempt-faces-challenge-shop-owners-5710161',
 outcome:'https://www.channelnewsasia.com/singapore/queensway-shopping-centres-en-bloc-bid-falls-through-some-shop-owners-rejoice-5694191',
 resale:'data/queensway-resale.json',
 planning:'https://data.gov.sg/datasets/d_a8c3546b26712e35021f3a681d0353ae/view',
 statement:'https://isomer-user-content.by.gov.sg/467/411a4d45-c03d-4322-b57c-497714595cdd/MP25WrittenStatement.pdf',
 photo:'https://www.cdgarchitects.sg/queensway-shopping-centre',
 consent:'https://www.stratatb.gov.sg/general-proceedings/application/applicant/matters-under-ltsa/',
 price:'https://data.gov.sg/datasets/d_620ad30cf4aca7c1c25eb2eff9e4bedc/view',
 rent:'https://data.gov.sg/datasets/d_a6c0ffc105817820388fd7b46fc67b13/view',
 space:'https://eservice.ura.gov.sg/maps/',
 valuation:'https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf'
};
const clamp=p=>Math.max(0,Math.min(1,Number(p)||0));
const MARKET_READING_COUNT=4;
export const PROPERTY_VALUE_READING_COUNT=10;
const POTENTIAL_READING_COUNT=PROPERTY_VALUE_READING_COUNT-MARKET_READING_COUNT;
// One continuous timeline: the four market readings lead into six valuation readings.
export function propertyValueFrame(progress){
 const p=clamp(progress),reading=Math.min(PROPERTY_VALUE_READING_COUNT-1,Math.floor(p*PROPERTY_VALUE_READING_COUNT));
 const local=clamp(p*PROPERTY_VALUE_READING_COUNT-reading);
 const story=retailStoryFrame(reading>=MARKET_READING_COUNT?1:reading===2?local*.76:reading===3?.76+local*.24:0);
 return {...story,reading,phase:reading>=MARKET_READING_COUNT?1:0,potential:clamp((p*PROPERTY_VALUE_READING_COUNT-MARKET_READING_COUNT)/POTENTIAL_READING_COUNT)};
}
const listingDisplayNotes={"L01":["Advertisement describes a low-floor shop.","广告描述为低楼层商铺。"],"L02":["Half-shop rental · observed asking rent S$3,600 per month.","半铺出租 · 观察到的月租要价为 S$3,600。"],"L03":["Chart area: 196 sq ft, from the advertisement’s area field.","图表面积：196 平方英尺，采用广告面积字段。"],"L04":["Advertisement availability date: 31 October 2026.","广告可用日期：2026 年 10 月 31 日。"],"L05":["Ground-floor bare shop · asking rent S$2,600 per month.","首层毛坯商铺 · 月租要价 S$2,600。"],"L06":["Lease takeover · term field: two years; description: 18 months, ending May 2028.","接手租约 · 租期字段为两年；正文为 18 个月，至 2028 年 5 月。"],"L07":["Starting asking price · advertised with an existing tenancy.","起始要价 · 广告描述为带租约出售。"],"L08":["Advertised with a tenancy and en-bloc potential.","广告描述为带租约出售，并提及整售潜力。"],"L09":["Individual shop sale advertisement.","单间商铺出售广告。"],"L10":["The advertisement’s tenancy description refers to July 2025.","广告租约描述所指日期为 2025 年 7 月。"],"L11":["Food-and-beverage premises · details follow the advertiser’s description.","餐饮物业 · 详情依据广告描述。"],"L12":["Chart classification: sale, following the listing category and description.","图表分类为出售，采用广告类别与正文。"],"L13":["Negotiable asking price · advertisement mentions en-bloc potential.","要价可议 · 广告提及整售潜力。"],"L14":["A whole three-bedroom apartment in Queensway Tower.","Queensway Tower 的三卧整套住宅。"],"L15":["Serviced room · advertised utilities and services included; description dated December 2024.","服务式单间 · 广告称含公用事业及服务；正文日期为 2024 年 12 月。"],"L16":["Chart classification: sale, following the header and property category.","图表分类为出售，采用页面标题与物业类别。"],"L17":["Advertisement dated 20 October 2026; availability text refers to 1 November 2023.","广告日期为 2026 年 10 月 20 日；可用日期文字为 2023 年 11 月 1 日。"],"L19":["Business-history details follow the advertisement.","经营历史详情依据广告描述。"],"L20":["The advertisement describes an existing clothing-retail tenancy.","广告描述该单位有服装零售租约。"],"L23":["Chart area: 236 sq ft, from the page’s floor-area field.","图表面积：236 平方英尺，采用页面面积字段。"],"L24":["Advertised availability: 1 November 2026.","广告可用日期：2026 年 11 月 1 日。"],"L27":["Chart amount: S$1,200 per month, from the page header. The description lists S$1,500.","图表金额为每月 S$1,200，采用页面标题；正文列为 S$1,500。"],"L29":["ERA commercial listing, described as a retail stall of about 160 sq ft.","ERA 商业挂牌，描述为约 160 平方英尺的零售摊位。"]};
const sourceLink=(url,label)=>`<p><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a></p>`;
function notes(lang,key){
 const t=(en,zh)=>lang==='zh'?zh:en;
 return {
  collective:`<p>${t('Savills’ estimate, reported in May 2019, put the shopping centre and adjoining tower above S$500 million. The report brings together retirement, building condition, redevelopment, replacement housing and owners’ views on value.','2019 年 5 月的报道引用第一太平戴维斯的估计，将购物中心及相连住宅塔楼整体估值定为逾五亿新元。报道同时记录了退休、建筑状况、重建、替代住家与业主对于价值的考虑。')}</p>${sourceLink(sources.attempt,t('Historical estimate and owners’ views · May 2019','历史估计与业主观点 · 2019 年 5 月'))}`,
  units:`<h3>${t('Regional market series','区域市场序列')}</h3><p>${t('The chart follows 62 quarters of Central Region private-retail price and rent indices, from 2011 Q1 to 2026 Q2. Each series starts at its own 2011 Q1 level; the vertical axis shows percentage change from that base. Collected on 19 October 2026.','图表追踪中区私人零售物业的价格与租金指数，覆盖 2011 年第一季度至 2026 年第二季度的 62 个季度。每条线各以自身 2011 年第一季度为基准，纵轴表示相对基准的百分比变化。资料采集于 2026 年 10 月 19 日。')}</p><h3>${t('Individual property records','单元物业记录')}</h3><p>${t('The listing records collected on 19–20 October 2026 include 14 commercial sale advertisements, 13 commercial rental advertisements and 2 residential rental advertisements. Each point opens its area, asking amount, observation date and original advertisement. Diamonds mark half-shops, triangles mark lease takeovers, and squares mark distinct premises or mixed classifications. Details include the advertiser’s description and the figures used in the chart.','2026 年 10 月 19—20 日的挂牌记录包含 14 条商业出售、13 条商业出租及 2 条住宅出租广告。点击各点可查看面积、要价、观察日期与原广告。菱形标记半铺，三角形标记接手租约，方形标记特殊物业或混合分类。详情包括广告描述及图表所采用的数据。')}</p><p>${t('The 105 residential resale transactions span February 1995 to January 2026. The records were transcribed from URA REALIS screenshots.','105 条住宅转售交易覆盖 1995 年 2 月至 2026 年 1 月，依据 URA REALIS 截图整理。')}</p>${sourceLink(sources.price,t('URA / SingStat · price series','URA／SingStat · 价格序列'))}${sourceLink(sources.rent,t('URA / SingStat · rent series','URA／SingStat · 租金序列'))}${sourceLink('data/market-expanded.json',t('Dated advertisements and original links','挂牌记录与原始链接'))}${sourceLink(sources.resale,t('Residential resale records','住宅转售记录'))}`,
  potential:`<h3>${t('From completed value to land value','从完工价值到土地价值')}</h3><p>${t('The residual method starts with the completed project’s value and deducts development costs and the developer’s required return. The diagram explains those relationships. Project-specific appraisal considers the permitted scheme, market evidence, building costs, finance, purchase expenses and the timing of receipts and payments.','剩余估值法从完工项目的价值出发，扣除开发成本与开发商所需回报。图中展示各项之间的关系；具体项目评估还需结合获准方案、市场资料、建造成本、融资、收购费用及收支时间安排。')}</p>${sourceLink(sources.valuation,t('RICS · Valuation of development property, section 6.1','RICS ·《开发物业估值》第 6.1 节'))}<h3>${t('Queensway’s planning framework','女皇道的规划框架')}</h3><p>${t('The MP2025 record identifies Commercial & Residential use and the GPR code EVA. The competent authority assesses permitted development intensity through a specific development proposal.','MP2025 记录将地块划为商业与住宅用途，容积率代码为 EVA。主管机关通过具体开发方案评估许可开发强度。')}</p>${sourceLink(sources.statement,t('URA · Written Statement','URA · 书面说明'))}${sourceLink(sources.planning,t('URA · land-use dataset','URA · 土地用途数据'))}`,
  current:`<p>${t('The existing-setting map uses SLA OneMap orthophoto tiles retrieved on 7 November 2026. Building, HDB and address records identify the named facilities. OpenStreetMap outlines show building footprints.','现状环境图采用 2026 年 11 月 7 日获取的 SLA OneMap 正射影像。建筑、HDB 及地址资料用于辨认设施；OpenStreetMap 轮廓表示实体建筑。')}</p>${sourceLink('https://www.onemap.gov.sg/',t('SLA · OneMap imagery','SLA · OneMap 影像'))}${sourceLink('https://www.onemap.gov.sg/legal/opendatalicence.html',t('OneMap · data licence','OneMap · 数据许可'))}`,
  future:`<p>${t('The planning map uses the original colours of URA SPACE Master Plan 2025, retrieved on 20 October 2026. Zoning information and the map legend were consulted on 7 November 2026. Queensway is zoned Commercial & Residential, with the GPR code EVA. Table 1 of the Written Statement sets out the use mix; clauses 5.1–5.3 describe the authority’s assessment of development intensity.','规划图采用 2026 年 10 月 20 日获取的 URA SPACE《2025 总体规划》原色底图；分区资料与图例查阅日期为 2026 年 11 月 7 日。女皇道为商业与住宅用途，容积率代码为 EVA。《书面说明》表 1 规定用途组合，5.1—5.3 条说明主管机关对开发强度的评估。')}</p><p>${t('Numbered points mark official project addresses. HDB documents supply the housing figures; dated MOH and NUHS releases supply the hospital’s planned capacity and opening programme.','编号标出项目的官方地址。住宅户数来自 HDB 文件；医院规划规模与启用安排来自有日期的 MOH／NUHS 公告。')}</p>${sourceLink(sources.space,t('URA SPACE · original map','URA SPACE · 原始地图'))}${sourceLink(sources.statement,t('URA · Written Statement','URA · 书面说明'))}`
 }[key];
}
export function propertyStoryReadings(lang='en'){
 const t=(en,zh)=>lang==='zh'?zh:en,b=(title,body,key)=>({title,body,notes:notes(lang,key)});
 return {
  'property-value':[
   b(t('One whole property.<br><em>A shared asset.</em>','一项整体物业，<br><em>共同持有的资产。</em>'),t('In May 2019, Savills estimated the shopping centre and adjoining residential tower together at more than S$500 million. That figure asks what a buyer might pay for the whole complex. For each owner, the next question is how the value of an individual unit relates to that shared asset.','2019 年 5 月，第一太平戴维斯估计购物中心与相连住宅塔楼的整体价值逾五亿新元。这一金额衡量买方可能为整座综合体支付多少。对每位业主而言，接下来的问题是：自己持有的单元，与这项共同资产如何联系？'),'collective'),
   b(t('One unit.<br><em>An asking price.</em>','一个独立单元，<br><em>一份出售要价。</em>'),t('The October 2026 listing records include 14 commercial sale advertisements. One 172 sq ft shop was advertised from S$550,000. The scatter plot compares advertised area with asking price per sq ft; each point opens a specific listing. Owners can sell individual units, while a collective sale brings the whole property into one transaction.','2026 年 10 月的挂牌记录收录了 14 条商业出售广告。其中一间 172 平方英尺的商铺，挂牌起价为 55 万新元。散点图把广告面积与每平方英尺要价放在一起，点击各点可查看具体记录。业主可以分别出售单元，整售则把整座物业纳入同一笔交易。'),'units'),
   b(t('One shop’s price.<br><em>A wider market.</em>','一间店的价格，<br><em>处在怎样的市场？</em>'),t('The URA series track Central Region retail property: white for sale prices and gold for rents. Each line starts at its own 2011 Q1 level. The highlighted year places the 2019 collective-sale proposal in this wider market; both series recovered from mid-year levels by the end of that year. Regional trends provide the market context for an individual property.','URA 指数记录中区零售物业的变化：白线表示售价，金线表示租金，两条线各以自身 2011 年第一季度为起点。高亮年份对应 2019 年整售提议；到该年第四季度，两项指数均较年中回升。区域走势为单个物业提供了市场背景。'),'units'),
   b(t('The gap changes.<br><em>Over time.</em>','两条曲线的距离，<br><em>随时间变化。</em>'),t('Continue to 2026 Q2: prices were 10.4% below their 2011 Q1 level, while rents were 30.3% below theirs. They moved at different rates, with different implications for owning and using space. Use the selector to move from this regional picture to individual Queensway property records.','继续看到 2026 年第二季度：售价较自身 2011 年第一季度水平低 10.4%，租金则低 30.3%。它们以不同速度变化，也使拥有物业与使用空间面临不同处境。通过图表上方的选项，可以从区域背景进一步查看女皇道单元物业记录。'),'units'),
   ...potentialReadings(lang).map(reading=>b(reading.title,reading.body,'potential'))
  ],
  'property-use':[
   b(t("One address.<br><em>Work and home.</em>","同一个地址，<br><em>经营与居住。</em>"),t("Queensway’s shopping podium and residential tower share the corner of Queensway and Alexandra Road. The satellite view locates the buildings within a neighbourhood of homes, shops and healthcare. Select the nearby places to see how these uses sit alongside each other.","女皇道购物中心的商业裙楼与住宅塔楼，共处于 Queensway 和 Alexandra Road 的转角。卫星图把这组建筑放回由住家、商店与医疗设施组成的街区。点选周边地点，可以看这些用途如何彼此相邻。"),'current'),
   b(t("Mixed-use zoning.<br><em>A framework for change.</em>","商住混合用途，<br><em>变化的规划框架。</em>"),t("URA designates Queensway as Commercial & Residential. Its general rule places commercial uses below homes, with commercial and associated uses normally occupying up to 40% of maximum permitted floor area, subject to the authority’s approval. The site’s plot-ratio field reads EVA. The use mix and permitted intensity are assessed as part of a development proposal.","URA 将女皇道划为“商业与住宅”。一般规则将商业安排在住宅下方，商业及相关用途通常占最大允许楼面面积的 40% 以内，具体以主管机关批准为准。地块容积率字段记为 EVA；用途组合与许可强度会在开发方案评估中落实。"),'future')
  ],
  'property-choice':choiceReadings(lang)
 };
}
export function propertyStoryMarkup(lang='en'){
 const t=(en,zh)=>lang==='zh'?zh:en,readings=propertyStoryReadings(lang),labels=[t('Price & value','价格与价值'),t('Use & possibility','使用与可能性'),t('A shared decision','共同决定')];
 return Object.entries(readings).map(([id,items],i)=>narrativeSection({id,number:String(i+1).padStart(2,'0'),label:labels[i],...items[0],beats:items.length,branch:'property',lang,actions:id==='property-choice'?`<button data-go="shop-work">${t('Inside the shops','走进店铺')} <span aria-hidden="true">→</span></button><button data-go="chapter-bridge">${t('All perspectives','所有视角')}</button>`:''})).join('');
}
function phaseNav(lang,id,labels,indices=labels.map((_,i)=>i),count=labels.length){return `<nav class="ns-controls pn-phase-nav" aria-label="${lang==='zh'?'本章内容':'Chapter readings'}">${labels.map((label,i)=>`<button type="button" data-pn-phase="${i}" data-pn-reading="${indices[i]}" data-pn-section="${id}" data-pn-count="${count}" aria-pressed="${i===0}">${label}</button>`).join('')}</nav>`;}
export function propertyStoryVisuals(lang='en'){
 const t=(en,zh)=>lang==='zh'?zh:en;
 return `<section class="narrative-surface pn-value" data-property-visual="property-value" hidden inert aria-label="${t('Property evidence','物业证据')}"><div class="ns-field pn-field">
 ${phaseNav(lang,'property-value',[t('Property & market','物业与市场'),t('Potential','预期价值')],[0,MARKET_READING_COUNT],PROPERTY_VALUE_READING_COUNT)}
 <div class="pn-value-phase pn-market" data-pn-value="0"><div class="pn-whole" data-pn-whole>
 <p class="pn-whole-date">${t('MAY 2019 · SAVILLS ESTIMATE','2019 年 5 月 · 第一太平戴维斯估计')}</p>
 <strong class="pn-whole-amount">${t('S$500m+','逾五亿新元')}</strong>
 <p class="pn-whole-scope">${t('Shopping centre<br>+ adjoining residential tower','购物中心<br>＋相连住宅塔楼')}</p>
 <a href="${sources.attempt}" target="_blank" rel="noopener noreferrer" class="pn-record-details">${t('CNA / TODAY · 1 May 2019','CNA／TODAY · 2019 年 5 月 1 日')} ↗</a>
 </div><div data-pn-market-content hidden><div class="pn-evidence-control"><label for="pn-evidence-select">${t('Evidence','证据')}</label><select id="pn-evidence-select" data-pn-mode-select>${[['regional','Regional prices & rents','区域价格与租金'],['sale','Shop sale advertisements','商铺出售广告'],['rent','Shop rental advertisements','商铺出租广告'],['home-rent','Home rental advertisements','住宅出租广告'],['resale','Recorded home resales','住宅转售记录']].map(([id,en,zh])=>`<option value="${id}">${t(en,zh)}</option>`).join('')}</select></div><p class="pn-chart-context"><span data-pn-chart-context></span><span data-pn-chart-unit></span></p><div class="pn-chart-wrap"><svg data-pn-chart viewBox="0 0 640 330" role="group" aria-label="${t('Explore the property data','查看物业数据')}"></svg><p data-pn-chart-loading role="status">${t('Loading records…','正在载入记录…')}</p></div><p class="pn-chart-axis-label" data-pn-chart-axis></p><p class="pn-chart-key" data-pn-chart-key></p><div class="pn-price-record" data-pn-record aria-live="polite"></div><div class="pn-price-nav"><button data-pn-record-step="-1" aria-label="${t('Previous observation','上一条观察')}">←</button><span data-pn-record-count></span><button data-pn-record-step="1" aria-label="${t('Next observation','下一条观察')}">→</button></div></div></div>
 <div class="pn-value-phase pn-potential" data-pn-value="1" hidden>${potentialMarkup(lang)}</div>
 </div></section>
 <section class="narrative-surface pn-use" data-property-visual="property-use" hidden inert aria-label="${t('Existing satellite setting and future URA land use','现状卫星环境与未来 URA 土地用途')}"><div class="ns-field pn-field">
 ${phaseNav(lang,'property-use',[t('Existing satellite view','现状卫星影像'),t('URA land use','URA 未来用途')])}
 ${landMapMarkup(lang)}
 </div></section>
 <section class="narrative-surface pn-choice" data-property-visual="property-choice" hidden inert aria-label="${t('Collective consent, process and consequences','整售同意、程序与影响')}"><div class="ns-field pn-field pc-field">
 ${phaseNav(lang,'property-choice',[t('Consent','同意门槛'),t('Process','后续程序'),t('People','不同处境')])}
 ${choicePanels(lang)}
 </div></section>`;
}
export function mountPropertyStory(root=document,{lang='en'}={}){
 const t=(en,zh)=>lang==='zh'?zh:en,localized=v=>typeof v==='object'?(v?.[lang]||v?.en||''):String(v??'');
 const readings=propertyStoryReadings(lang),readingHandle=mountNarrativeReadings(root.querySelector('#property-land'),readings);
 const value=root.querySelector('[data-property-visual="property-value"]'),use=root.querySelector('[data-property-visual="property-use"]'),choice=root.querySelector('[data-property-visual="property-choice"]');
 const abort=new AbortController(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let valuePhase=-1,usePhase=-1,choicePhase=-1,listingData=null,homeData=null,indexData=null,mode='regional',selected=0;
 let valueProgress=0,manual=false,chartFrame=propertyValueFrame(0);
 const potential=mountPotential(value.querySelector('.pn-potential'),{lang,onSeek:index=>{
  seekNarrativeReading('property-value',MARKET_READING_COUNT+index,PROPERTY_VALUE_READING_COUNT);
 }});
 const land=mountLandMap(use.querySelector('.plm-main'),{lang,onExplain:(item,{phase})=>{
  const section=root.querySelector('#property-use'),copy=section.querySelector('.ns-reading'),title=copy.querySelector('h2'),body=copy.querySelector('.ns-body');
  const nextTitle=localized(item.title),nextBody=localized(item.body);
  if(body.textContent!==nextBody||title.innerHTML!==nextTitle){copy.getAnimations().forEach(animation=>animation.cancel());title.innerHTML=nextTitle;body.textContent=nextBody;if(!reduced.matches&&!use.hidden)copy.animate([{transform:'translateY(6px)'},{transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)'});}
  const selectedNotes=`<h3>${esc(localized(item.metric))}</h3><p>${esc(nextBody)}</p>${item.sources.map(source=>sourceLink(source.url,`${source.publisher} · ${source.date}`)).join('')}${notes(lang,phase?'future':'current')}`;
  section.querySelector('.ns-notes-mount').innerHTML=`<button type="button" class="ns-source" data-narrative-notes="${esc(selectedNotes)}">${t('Sources & notes','来源与说明')} <span aria-hidden="true">＋</span></button>`;
 }});
 const clipId='pn-market-reveal';
 const number=n=>new Intl.NumberFormat(lang==='zh'?'zh-SG':'en-SG',{maximumFractionDigits:0}).format(n),pct=n=>`${n>0?'+':n<0?'−':''}${Math.abs(n).toFixed(1)}%`;
 const chart=value.querySelector('[data-pn-chart]'),record=value.querySelector('[data-pn-record]');
 const read=async path=>{const r=await fetch(new URL(path,import.meta.url),{signal:abort.signal});if(!r.ok)throw Error(path);return r.json();};
 const rows=()=>mode==='regional'?(indexData?.series[0].points||[]):mode==='resale'?(homeData?.records||[]):(listingData?.records||[]).filter(r=>mode==='sale'?r.offer==='sale':mode==='rent'?r.offer==='rent'&&r.sector==='retail':r.offer==='rent'&&r.sector==='residential');
 function paintMarketFrame(){
  if(mode!=='regional'||!indexData)return;
  const index=manual?61:reduced.matches?chartFrame.selected:chartFrame.index,x=i=>82+i/61*524,y=n=>274-(n+40)/60*250;
  chart.querySelector('[data-pn-reveal]')?.setAttribute('width',String(x(index)-81));
  const witness=chart.querySelector('[data-pn-2019]');if(witness)witness.style.opacity=chartFrame.reading===2?'1':'0';
  chart.querySelectorAll('[data-pn-tip]').forEach((tip,i)=>{const points=indexData.series[i].points,lo=Math.floor(index),hi=Math.min(61,lo+1),v=points[lo].changeFromBasePct+(points[hi].changeFromBasePct-points[lo].changeFromBasePct)*(index-lo);tip.setAttribute('cx',String(x(index)));tip.setAttribute('cy',String(y(v)));tip.style.opacity=manual?'0':'1';});
  chart.dataset.guided=String(!manual);chart.dataset.revealedQuarter=String(index);
  chart.querySelector('[data-pn-index-selection]').style.opacity=manual?'1':'0';
 }
 function exploreRecord(index){manual=true;selectRecord(index);paintMarketFrame();}
 function selectRecord(index){
  const data=rows();if(!data.length)return;selected=(index+data.length)%data.length;
  chart.querySelectorAll('[data-pn-point]').forEach(dot=>{const active=Number(dot.dataset.pnPoint)===selected;dot.classList.toggle('is-selected',active);dot.setAttribute('tabindex',active?'0':'-1');});
  const row=data[selected];let detail;
  if(mode==='regional'){
   const price=indexData.series.find(s=>s.id==='price').points[selected],rent=indexData.series.find(s=>s.id==='rent').points[selected],quarter=row.quarter.replace('-',' ');
   record.innerHTML=`<div class="pn-regional-readout"><span class="pn-price-series">${t('Price','售价')} <strong>${pct(price.changeFromBasePct)}</strong></span><span class="pn-rent-series">${t('Rent','租金')} <strong>${pct(rent.changeFromBasePct)}</strong></span></div>`;
   detail=`<p>${quarter} · ${t('Central Region private retail','中区私人零售物业')}</p><p>${t('Change from 2011 Q1','相对 2011 年第一季度变化')}：${t('price','售价')} ${pct(price.changeFromBasePct)}；${t('rent','租金')} ${pct(rent.changeFromBasePct)}。</p>${sourceLink(sources.price,t('Official price series','官方价格序列'))}${sourceLink(sources.rent,t('Official rent series','官方租金序列'))}`;
   record.insertAdjacentHTML('beforeend',`<button class="pn-record-details" data-narrative-notes="${esc(detail)}">${quarter} ＋</button>`);
   const x=82+selected/61*524,y=n=>274-(n+40)/60*250;
   chart.querySelector('[data-pn-index-selection]').innerHTML=`<path d="M${x} 24V274"/><circle class="pn-price-mark" cx="${x}" cy="${y(price.changeFromBasePct)}" r="6"/><circle class="pn-rent-mark" cx="${x}" cy="${y(rent.changeFromBasePct)}" r="6"/>`;
  }else{
   const home=mode==='resale',rental=mode==='rent'||mode==='home-rent',amount=home?row.priceSgd:row.askingSgd,category=home?t('Recorded home resale','住宅转售'):localized(listingData.groupLabels?.[row.comparisonGroup]||row.comparisonGroup);
   const note=home?t('Residential transaction records transcribed from URA REALIS.','依据 URA REALIS 整理的住宅交易记录。'):listingDisplayNotes[row.id]?.[lang==='zh'?1:0]||'';
   const flags=home?'':(row.flags||[]).filter(f=>['half_shop','lease_takeover','food_beverage_listing','whole_apartment','serviced_room'].includes(f)).map(f=>localized(listingData.flagLabels?.[f]||f)).join(' · '),qualifier=home?'':localized(listingData.qualifierLabels?.[row.askingQualifier]);
   detail=`<p>${esc(category)} · ${esc(home?row.date:row.listedOn||t('Property listing','物业挂牌'))}</p><p>${t('Area','面积')} ${number(row.areaSqft)} ${t('sq ft','平方英尺')} · S$${new Intl.NumberFormat(lang==='zh'?'zh-SG':'en-SG',{maximumFractionDigits:2}).format(home?row.pricePsf:row.askingPsf??amount/row.areaSqft)}${rental?t(' / sq ft / month','／平方英尺／月'):t(' / sq ft','／平方英尺')}</p>${!home?`<p>${t('Advertisement observed','广告观察日期')} ${row.observedOn||'2026-10-19–20'}</p>`:''}${qualifier&&row.askingQualifier!=='not_stated'?`<p>${esc(qualifier)}</p>`:''}${flags?`<p>${esc(flags)}</p>`:''}${note?`<p>${esc(note)}</p>`:''}${sourceLink(home?sources.resale:row.sourceUrl,t('Original record','原始记录'))}`;
   record.innerHTML=`<div><strong>S$${number(amount)}${rental?`<small>${t('/ month','／月')}</small>`:''}</strong><span>${number(row.areaSqft)} ${t('sq ft','平方英尺')} · ${esc(category)}</span></div><button class="pn-record-details" data-narrative-notes="${esc(detail)}">${t('Record','记录')} ＋</button>`;
  }
  value.querySelector('[data-pn-record-count]').textContent=`${selected+1} / ${data.length}`;
 }
 function drawChart(){
  const data=rows();if(!data.length)return;selected=Math.max(0,Math.min(selected,data.length-1));
  const context=value.querySelector('[data-pn-chart-context]'),unit=value.querySelector('[data-pn-chart-unit]'),axis=value.querySelector('[data-pn-chart-axis]'),key=value.querySelector('[data-pn-chart-key]');
  if(mode==='regional'){
   const x=i=>82+i/61*524,y=n=>274-(n+40)/60*250;
   chart.innerHTML=`<defs><clipPath id="${clipId}"><rect data-pn-reveal x="81" y="15" width="1" height="270"/></clipPath></defs><path class="pn-axis" d="M82 24V274H606"/><path class="pn-zero" d="M82 ${y(0)}H606"/>${[-40,-20,0,20].map(n=>`<text class="pn-tick" x="68" y="${y(n)+7}" text-anchor="end">${n>0?'+':''}${n}%</text>`).join('')}${[[0,'2011'],[16,'2015'],[32,'2019'],[48,'2023'],[61,'2026']].map(([i,n])=>`<text class="pn-tick" x="${x(i)}" y="314" text-anchor="${i===0?'start':i===61?'end':'middle'}">${n}</text>`).join('')}<g class="pn-market-year" data-pn-2019 style="opacity:0"><rect x="${x(31.5)}" y="24" width="${x(35.5)-x(31.5)}" height="250"/><text x="${x(33.5)}" y="12" text-anchor="middle">${t('2019 · sale proposal','2019 · 整售提议')}</text></g><g clip-path="url(#${clipId})">${indexData.series.map(s=>`<path class="pn-series-line pn-${s.id}-line" d="${s.points.map((p,i)=>(i?'L':'M')+x(i).toFixed(2)+' '+y(p.changeFromBasePct).toFixed(2)).join(' ')}"/>`).join('')}</g>${indexData.series.map(s=>`<circle data-pn-tip class="pn-${s.id}-mark" r="5.5"/>`).join('')}<g class="pn-index-selection" data-pn-index-selection></g>${data.map((p,i)=>`<rect class="pn-index-hit" data-pn-point="${i}" role="button" tabindex="${i===selected?'0':'-1'}" aria-label="${esc(p.quarter)}" x="${x(i)-4.3}" y="20" width="8.6" height="260"/>`).join('')}`;
   context.textContent=t('Central Region · 62 quarters','中区 · 62 个季度');unit.textContent=t('From 2011 Q1','相对 2011 Q1');axis.textContent=t('2011 Q1–2026 Q2 · regional series','2011 Q1—2026 Q2 · 区域序列');
   key.innerHTML=`<span class="pn-price-series">● ${t('Price','售价')}</span><span class="pn-rent-series">● ${t('Rent','租金')}</span><span>${t('Central Region retail','中区零售物业')}</span>`;
  }else{
   const home=mode==='resale',rental=mode==='rent'||mode==='home-rent',left=94,right=622,top=34,bottom=274;
   const vals=data.map(r=>home?r.pricePsf:r.askingPsf??r.askingSgd/r.areaSqft),max=Math.max(...vals),ceil=rental?Math.ceil(max/10)*10:Math.ceil(max/500)*500,y=n=>bottom-n/ceil*(bottom-top);
   const amin=Math.min(...data.map(r=>r.areaSqft)),amax=Math.max(...data.map(r=>r.areaSqft)),low=Date.UTC(1995,0,1),high=Date.UTC(2026,11,31);
   const areaX=n=>left+(Math.log(n)-Math.log(amin))/(Math.log(amax)-Math.log(amin)||1)*(right-left),x=r=>home?left+(Date.parse(r.date+'T00:00:00Z')-low)/(high-low)*(right-left):areaX(r.areaSqft);
   const ticks=home?[1995,2005,2015,2026]:[amin,...[1000].filter(n=>n>amin*1.3&&n<amax*.8),amax],tickX=n=>home?left+(Date.UTC(n,0,1)-low)/(high-low)*(right-left):areaX(n);
   const shape=r=>r.flags?.includes('half_shop')?'<path class="pn-dot" d="M0 -7L7 0L0 7L-7 0Z"/>':r.flags?.includes('lease_takeover')?'<path class="pn-dot" d="M0 -8L7 6L-7 6Z"/>':['food_beverage','retail_stall'].includes(r.comparisonGroup)||r.flags?.includes('title_category_mismatch')?'<rect class="pn-dot pn-special-dot" x="-5.8" y="-5.8" width="11.6" height="11.6"/>':'<circle class="pn-dot" r="4.8"/>';
   chart.innerHTML=`<text class="pn-unit-label" x="${left}" y="14">${rental?t("Asking rent · S$/sq ft/month","租金要价 · 新元／平方英尺／月"):home?t("Resale price · S$/sq ft","转售价格 · 新元／平方英尺"):t("Asking price · S$/sq ft","出售要价 · 新元／平方英尺")}</text><path class="pn-axis" d="M${left} ${top}V${bottom}H${right}"/>${[0,ceil/2,ceil].map(n=>`<text class="pn-tick" x="${left-12}" y="${y(n)+7}" text-anchor="end">${number(n)}</text>`).join('')}${ticks.map((n,i)=>`<text class="pn-tick" x="${tickX(n)}" y="314" text-anchor="${i===0?'start':i===ticks.length-1?'end':'middle'}">${home?n:number(n)}</text>`).join('')}${data.map((r,i)=>`<g data-pn-point="${i}" role="button" tabindex="${i===selected?'0':'-1'}" aria-label="${esc((home?r.date:r.id)+', S$'+number(home?r.priceSgd:r.askingSgd))}" transform="translate(${x(r).toFixed(2)} ${y(vals[i]).toFixed(2)})"><circle class="pn-dot-hit" r="13"/><circle class="pn-dot-halo" r="10"/>${shape(r)}</g>`).join('')}`;
   context.textContent=home?t('105 home resales · 1995–2026','105 条住宅转售 · 1995—2026'):t(`${data.length} ${mode==='home-rent'?'home':'shop'} ads · Oct 2026`,`${data.length} 条${mode==='home-rent'?'住宅':'商铺'}广告 · 2026 年 10 月`);
   unit.textContent=rental?t('S$ / sq ft / month','新元／平方英尺／月'):t('S$ / sq ft','新元／平方英尺');axis.textContent=home?t('Transaction year','成交年份'):t('Advertised area · sq ft · log scale','广告面积 · 平方英尺 · 对数刻度');
   key.textContent=mode==='rent'?t('◆ Half-shop   ▲ Lease takeover','◆ 半铺   ▲ 接手租约'):mode==='sale'?t('□ Premises with special classifications','□ 特殊物业分类'):mode==='home-rent'?t('A whole apartment and a serviced room','一套整租住宅与一间服务式房间'):t('Recorded residential transactions','住宅转售交易记录');
  }
  value.querySelector('[data-pn-chart-loading]').hidden=true;selectRecord(mode==='regional'&&!manual?chartFrame.selected:selected);paintMarketFrame();
 }
 function switchPhase(section,selector,index,previous,immediate){section.querySelectorAll(selector).forEach((view,i)=>{view.getAnimations().forEach(a=>a.cancel());view.hidden=i!==index;view.inert=i!==index;if(i===index&&previous!==-1&&!immediate&&!reduced.matches)view.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.16,1,.3,1)'});});section.querySelectorAll('[data-pn-reading]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.pnPhase)===index)));}
 function click(e){const point=e.target.closest('[data-pn-point]');if(point&&value.contains(point)){exploreRecord(Number(point.dataset.pnPoint));return;}const b=e.target.closest('button');if(!b)return;if(b.dataset.pnReading!==undefined){seekNarrativeReading(b.dataset.pnSection,Number(b.dataset.pnReading),Number(b.dataset.pnCount));return;}if(b.dataset.pnRecordStep){exploreRecord(selected+Number(b.dataset.pnRecordStep));return;}}
 function change(e){if(e.target.matches('[data-pn-mode-select]')){manual=true;mode=e.target.value;selected=mode==='regional'?chartFrame.selected:0;drawChart();}}
 function hover(e){const point=e.target.closest('[data-pn-point]');if(point&&value.contains(point))exploreRecord(Number(point.dataset.pnPoint));}
 function key(e){const point=e.target.closest('[data-pn-point]');if(!point||!value.contains(point))return;if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();exploreRecord(e.key==='Home'?0:e.key==='End'?rows().length-1:Number(point.dataset.pnPoint)+(e.key==='ArrowRight'?1:-1));chart.querySelector(`[data-pn-point="${selected}"]`)?.focus();}if([' ','Enter'].includes(e.key)){e.preventDefault();exploreRecord(Number(point.dataset.pnPoint));}}
 root.addEventListener('click',click);value.addEventListener('change',change);value.addEventListener('pointerover',hover);value.addEventListener('focusin',hover);root.addEventListener('keydown',key);
 Promise.all([read('./data/market-expanded.json'),read('./data/queensway-resale.json'),read('./data/retail-indices.json')]).then(([list,homes,indices])=>{listingData=list;homeData=homes;indexData=indices;drawChart();}).catch(e=>{if(e.name!=='AbortError')value.querySelector('[data-pn-chart-loading]').textContent=t('View the property records under Sources.','在“来源”中查看物业记录。');});

 const dispose=()=>{abort.abort();potential.destroy();land.destroy();readingHandle.destroy();root.removeEventListener('click',click);value.removeEventListener('change',change);value.removeEventListener('pointerover',hover);value.removeEventListener('focusin',hover);root.removeEventListener('keydown',key);value.querySelectorAll('.pn-value-phase').forEach(e=>e.getAnimations().forEach(a=>a.cancel()));use.querySelectorAll('.pn-use-phase').forEach(e=>e.getAnimations().forEach(a=>a.cancel()));};
 dispose.setProgress=(id,p,immediate=false)=>{readingHandle.setProgress(id,p,immediate);if(id==='property-value'){
  const moved=Math.abs(p-valueProgress)>.00001;valueProgress=p;chartFrame=propertyValueFrame(p);
  if(moved)manual=false;
  const index=chartFrame.phase,phaseChanged=index!==valuePhase;
  if(phaseChanged){switchPhase(value,'[data-pn-value]',index,valuePhase,immediate);valuePhase=index;}
  if(index===1){potential.setProgress(chartFrame.potential,phaseChanged||immediate);return;}
  const marketContent=value.querySelector('[data-pn-market-content]'),whole=value.querySelector('[data-pn-whole]');
  whole.hidden=chartFrame.reading!==0;marketContent.hidden=chartFrame.reading===0;
  const guidedMode=chartFrame.reading===1?'sale':'regional';
  if(!manual&&mode!==guidedMode){mode=guidedMode;value.querySelector('[data-pn-mode-select]').value=mode;selected=mode==='regional'?chartFrame.selected:0;drawChart();}

  if(!manual&&mode==='regional'){if(selected!==chartFrame.selected)selectRecord(chartFrame.selected);paintMarketFrame();}
 }if(id==='property-use'){const index=Math.min(1,Math.floor(clamp(p)*2)),changed=index!==usePhase;if(changed){usePhase=index;use.querySelectorAll('[data-pn-reading]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.pnPhase)===index)));}land.setProgress(p,immediate||changed);}if(id==='property-choice'){const index=Math.min(2,Math.floor(clamp(p)*3));if(index!==choicePhase){switchPhase(choice,'[data-pn-choice]',index,choicePhase,true);choicePhase=index;const copy=root.querySelector('#property-choice .ns-reading');copy.getAnimations().forEach(a=>a.cancel());if(!reduced.matches&&!immediate)copy.animate([{transform:'translateY(6px)'},{transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)'});}}};
 return dispose;
}
