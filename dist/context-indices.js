import {readData,esc,pick} from './research-utils.js?v=20261020-revision3';

/** Scroll positions reveal only the quarters reached by the current narrative. */
export function retailStoryFrame(progress){
 const p=Math.min(1,Math.max(0,progress)),ease=v=>Math.min(1,Math.max(0,v));
 const stage=p<.28?0:p<.52?1:p<.76?2:3;
 const index=stage===0?31*ease((p-.025)/.225):stage===1?31+3*ease((p-.28)/.20):stage===2?34+ease((p-.52)/.07):35+26*ease((p-.76)/.20);
 return {stage,index,selected:Math.floor(index+1e-8)};
}
export function mountContextIndices(container,{lang='en',propertyStory=false,onLensChange=()=>{},onNarrativeChange=null,onStoriesReady=()=>{}}={}){
 const zh=lang==='zh',t=(en,cn)=>zh?cn:en,clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const number=value=>new Intl.NumberFormat(zh?'zh-SG':'en-SG',{minimumFractionDigits:1,maximumFractionDigits:1}).format(value);
 const quarter=value=>zh?value.replace('-Q','年第')+'季度':value.replace('-',' ');
 const percentage=value=>`${value>0?'+':value<0?'−':''}${number(Math.abs(value))}%`;
 const seriesLabel=id=>id==='price'?t('Price','售价'):t('Rent','租金');
 const stages=propertyStory?[
  {
   title:{en:'From one shop\nto a wider market.',zh:'从一间店铺，\n到更广的市场。'},
   description:{en:'The listing chart shows individual asking prices. The URA series track how private retail sale prices and rents moved across the Central Region. Each line starts from its own 2011 Q1 level.',zh:'挂牌图展示单个单位的要价。URA 指数追踪整个中区私人零售物业的售价和租金变化，两条线分别以各自的 2011 年第一季度水平为起点。'},
   kicker:{en:'PROPERTY VALUE · THE REGIONAL MARKET',zh:'物业价值 · 区域市场'},
   sourceIds:['C01','C02']
  },
  {
   title:{en:'Two measures.\nDifferent movements.',zh:'两种指标。\n各有变化轨迹。'},
   description:{en:'By the end of 2018, both series were below their starting levels. Rent was about 15% lower than its 2011 Q1 level. The price index was about 3% lower.',zh:'到 2018 年末，两条指数均低于各自的起点。相比 2011 年第一季度，租金指数约低 15%，售价指数约低 3%。'},
   kicker:{en:'PROPERTY VALUE · BEFORE 2019',zh:'物业价值 · 2019 年之前'},
   sourceIds:['C01','C02']
  },
  {
   title:{en:'The 2019 market\nin context.',zh:'把 2019 年放回\n市场的时间线上。'},
   description:{en:'The chart marks the year of the Queensway proposal. Central Region prices and rents both recovered from their mid-year readings by the end of 2019. These are regional movements alongside the local case.',zh:'图中标出女皇道提出整售的年份。到 2019 年末，中区售价和租金指数都从年中水平回升。区域走势为这个个案提供同一时期的市场背景。'},
   kicker:{en:'PROPERTY VALUE · 2019 CONTEXT',zh:'物业价值 · 2019 年市场背景'},
   sourceIds:['C01','C02','H04']
  },
  {
   title:{en:'The gap changes\nover time.',zh:'两条曲线之间的距离\n随时间变化。'},
   description:{en:'By 2026 Q2, the Central Region price and rent indices were about 10% and 30% below their respective 2011 Q1 levels. Those different movements are part of the market context for judging a possible redevelopment.',zh:'到 2026 年第二季度，中区售价与租金指数分别较各自的 2011 年第一季度水平低约 10% 和 30%。这两种走势是评估潜在重建项目时可参考的市场背景。'},
   kicker:{en:'PROPERTY VALUE · TO 2026 Q2',zh:'物业价值 · 截至 2026 年第二季度'},
   sourceIds:['C01','C02']
  }
 ]:[
  {
    "title": {
      "en": "A changing market.\nDifferent pressures.",
      "zh": "市场在变，\n处境各有不同。"
    },
    "description": {
      "en": "After rising earlier in the decade, Central Region shop prices and rents fell. By 2018, both were below their 2011 starting levels. Price shapes an owner’s asset value; rent is a tenant’s expense and a landlord’s income. The same market can mean different things to different people.",
      "zh": "中区商铺售价与租金先升后降，到2018年均低于2011年的起点。售价关系到业主的资产价值；租金是租户的支出，也是出租业主的收入。同样的市场变化，落到每个人身上，各有意义。"
    },
    "kicker": {
      "en": "2011–2018 · The market before 2019",
      "zh": "2011—2018年 · 2019年之前的市场"
    },
    "sourceIds": [
      "C02",
      "C01"
    ]
  },
  {
    "title": {
      "en": "2019: sell together,\nor stay?",
      "zh": "2019年：\n卖掉，还是留下？"
    },
    "description": {
      "en": "In April 2019, Queensway moved ahead with signatures for a collective sale. Some saw a chance to retire or leave an ageing building. Others weighed their valuations, regular customers and the cost of a comparable home. Each household and business faced its own choice.",
      "zh": "2019年4月，Queensway推进集体出售协议签署。有人希望出售退休，或离开老旧建筑；有人看重物业估价，有人珍惜熟客，也有住户衡量购买同类住家的成本。出售，对每个人意味着不同的未来。"
    },
    "kicker": {
      "en": "April 2019 · Different futures",
      "zh": "2019年4月 · 不同的未来"
    },
    "sourceIds": [
      "H04",
      "H05",
      "C02",
      "C01"
    ]
  },
  {
    "title": {
      "en": "The sale stopped.\nDifferences remained.",
      "zh": "尝试结束，\n日常继续。"
    },
    "description": {
      "en": "The attempt ended in 2019. Tenants were informed in October; the agent confirmed the outcome on 26 November. Selling could turn property into money; staying could preserve a business, customers or a home. Owners held the decision, while tenants and visitors also had a stake.",
      "zh": "租户于2019年10月获知尝试结束，经纪人于11月26日确认。出售能把物业变成资金；留下能延续生意、熟客关系或一个家。决定由业主作出，租户与访客的生活也与之相连。"
    },
    "kicker": {
      "en": "October–November 2019 · The turning point",
      "zh": "2019年10—11月 · 关键转折"
    },
    "sourceIds": [
      "H05",
      "H04",
      "C02",
      "C01"
    ]
  },
  {
    "title": {
      "en": "A place to work.\nRoom to begin again.",
      "zh": "生意仍在，\n新的可能也在。"
    },
    "description": {
      "en": "For Marilyn Tan in 2019, affordable rent helped keep embroidery production going, even as footfall weakened. Lower rent later drew Hon Liang Lung to Queensway; strong custom supported a second outlet in 2025. A place can offer room to work and begin again, alongside its continuing difficulties.",
      "zh": "2019年，Marilyn Tan谈到客流减少，也说可负担的租金让刺绣生产得以继续。后来，较低租金吸引Hon Liang Lung入驻，客流又支持他在2025年扩店。困难持续存在，这里也继续为谋生和新尝试提供空间。"
    },
    "kicker": {
      "en": "After 2019 · Life carries on",
      "zh": "2019年之后 · 生活继续"
    },
    "sourceIds": [
      "H05",
      "H09",
      "C02",
      "C01",
      "C03"
    ]
  }
];
 onStoriesReady(stages);
 const localSources={
  sale:'https://www.channelnewsasia.com/singapore/queensway-shopping-centre-en-bloc-attempt-faces-challenge-shop-owners-5710161',
  marilyn:'https://www.channelnewsasia.com/singapore/queensway-shopping-centres-en-bloc-bid-falls-through-some-shop-owners-rejoice-5694191',
  hon:'https://www.channelnewsasia.com/cna-insider/big-read/strata-titled-malls-shopping-retail-business-survival-dying-out-5875511'
 };
 let alive=true,data=null,root,svg,plot,readout,range,observer,frame=0,active=false,manual=false,progress=0,stage=-1,selected=0,reveal=0;
 let width=560,height=265,left=38,right=92,top=30,bottom=25,yMin=-40,yMax=20,clipId=`retail-reveal-${Math.random().toString(36).slice(2,9)}`;
 let selectionKey='',labelKey='',eventKey='';
 const visible=new Set(['price','rent']);
 const x=index=>left+index/(data.quartersPerSeries-1)*(width-left-right);
 const y=value=>height-bottom-(value-yMin)/(yMax-yMin)*(height-top-bottom);
 const notify=()=>{const detail={...stages[stage],stageIndex:stage,stageCount:stages.length};(onNarrativeChange||onLensChange)(detail);};
 container.innerHTML=`<div class="c-indices-loading" role="status">${t('Opening the wider market…','正在展开区域市场…')}</div>`;
 function stageNote(){
  if(propertyStory){
   const notes=[
    t('White tracks retail sale prices. Gold tracks rents. The vertical axis shows percentage change from 2011 Q1.', '白线表示零售物业售价，金线表示租金。纵轴为相对 2011 年第一季度的百分比变化。'),
    t('2018 Q4 · Price −3.4% · Rent −15.1% from the respective 2011 Q1 levels.', '2018 年第四季度 · 相对各自的 2011 年第一季度水平，售价 −3.4%，租金 −15.1%。'),
    t('By 2019 Q4, both lines had risen from 2019 Q2.', '到 2019 年第四季度，两条指数均较该年第二季度回升。'),
    t('2026 Q2 · Price −10.4% · Rent −30.3%. Open the quarter explorer to read the series.', '2026 年第二季度 · 售价 −10.4%，租金 −30.3%。打开季度浏览可查看序列。')
   ];
   return '<p>'+notes[stage]+'</p>';
  }
  if(stage===0)return '<span class="c-indices-note-date">0%</span><p>'+t('Each line starts at its own 2011 level. −20% means one fifth below that level. White: shop sale prices. Gold: rents.','两条线各自从2011年的水平出发。−20%即比当时低五分之一。白线是商铺售价，金线是租金。')+'</p>';
  if(stage===1)return '<div class="c-indices-choices"><div><strong>'+t('Why sell?','为何想卖？')+'</strong><p>'+t('Retirement · ageing premises · an exit','退休 · 建筑老化 · 退出机会')+'</p></div><div><strong>'+t('Why stay?','为何想留？')+'</strong><p>'+t('Valuations · regular customers · a home','估价分歧 · 熟客关系 · 一个家')+'</p></div></div>';
  if(stage===2)return '<div class="c-indices-turning"><strong>'+t('Different interests, one decision','不同的利益，共同的决定')+'</strong><p>'+t('Regional prices and rents recovered in late 2019. The sale process depended on owner consent; the curves show the market setting.','中区售价与租金在2019年下半年有所回升。整售程序取决于业主同意，曲线呈现同一时期的市场背景。')+'</p></div>';
  return '<div class="c-indices-testimony"><a href="'+localSources.marilyn+'" target="_blank" rel="noopener noreferrer"><span>2019</span><strong>98 Designs</strong><small>'+t('Affordable space to keep producing','可负担的空间，让生产继续')+' ↗</small></a><a href="'+localSources.hon+'" target="_blank" rel="noopener noreferrer"><span>2025</span><strong>Honsieponsie</strong><small>'+t('A second outlet at Queensway','在Queensway开设第二家店')+' ↗</small></a></div>';
 }
 function updateSelection(){
  if(!alive||!data||!root)return;
  const key=[selected,manual,...visible].join(':');if(key===selectionKey)return;selectionKey=key;
  const label=quarter(data.series[0].points[selected].quarter);range.value=String(selected);root.querySelector('.c-indices-current-quarter').textContent=data.series[0].points[selected].quarter.replace('-',' ');
  range.setAttribute('aria-valuetext',`${label}; ${data.series.map(s=>`${seriesLabel(s.id)} ${percentage(s.points[selected].changeFromBasePct)}`).join('; ')}`);
  const cross=svg.querySelector('.c-indices-crosshair');cross.style.opacity=manual?'1':'0';
  cross.innerHTML=`<line x1="${x(selected)}" x2="${x(selected)}" y1="${top}" y2="${height-bottom}"/>${data.series.filter(s=>visible.has(s.id)).map(s=>`<circle class="c-indices-dot c-indices-${s.id}" cx="${x(selected)}" cy="${y(s.points[selected].changeFromBasePct)}" r="4"/>`).join('')}`;
  readout.innerHTML=`<span class="c-indices-selected-quarter">${esc(label)}</span>${data.series.map(s=>`<span class="c-indices-${s.id}${visible.has(s.id)?'':' is-muted'}">${seriesLabel(s.id)} <strong>${percentage(s.points[selected].changeFromBasePct)}</strong></span>`).join('')}`;
 }
 function updateReveal(){
  if(!data||!root)return;
  const index=(manual?1:reveal)*(data.quartersPerSeries-1),cursor=x(selected);
  svg.querySelector('clipPath rect').setAttribute('width',String(Math.max(1,x(index)-left+1)));
  const key=[selected,manual,...visible].join(':');
  if(key!==labelKey){labelKey=key;
  const positions=data.series.map(s=>({s,v:s.points[selected].changeFromBasePct,cy:y(s.points[selected].changeFromBasePct)}));
  if(Math.abs(positions[0].cy-positions[1].cy)<35){const mid=(positions[0].cy+positions[1].cy)/2;positions[0].cy=mid-18;positions[1].cy=mid+18;}
  svg.querySelector('.c-indices-end-labels').innerHTML=positions.map(({s,v,cy})=>`<g class="c-indices-end c-indices-${s.id}${visible.has(s.id)?'':' is-hidden'}"><circle cx="${cursor}" cy="${y(v)}" r="3"/><path d="M${cursor+4} ${y(v)}L${cursor+11} ${cy}"/><text x="${cursor+15}" y="${cy-2}">${seriesLabel(s.id)}<tspan x="${cursor+15}" dy="17">${percentage(v)}</tspan></text></g>`).join('');
  svg.querySelectorAll('[data-index-series]').forEach(line=>line.classList.toggle('is-hidden',!visible.has(line.dataset.indexSeries)));
  }
  root.dataset.stage=String(stage);root.dataset.mode=manual?'explore':'guided';
  const tips=svg.querySelectorAll('.c-indices-drawing-tip');
  tips.forEach((tip,i)=>{const points=data.series[i].points,lo=Math.floor(index),hi=Math.min(points.length-1,lo+1),fraction=index-lo,value=points[lo].changeFromBasePct+(points[hi].changeFromBasePct-points[lo].changeFromBasePct)*fraction;tip.setAttribute('cx',String(x(index)));tip.setAttribute('cy',String(y(value)));tip.style.opacity=!manual&&visible.has(data.series[i].id)?'.85':'0';});
  if(eventKey===String(stage))return;eventKey=String(stage);
  const eventTrack=root.querySelector('.c-indices-event-track');eventTrack.innerHTML=propertyStory
   ?t('<b>URA · CENTRAL REGION</b><span>Private retail space · 2011 Q1–2026 Q2</span>','<b>URA · 中区</b><span>私人零售物业 · 2011 年第一季度至 2026 年第二季度</span>')
   :stage===1?t('<b>2019</b><span>20 APR · Signatures proceed</span>','<b>2019</b><span>4月20日 · 推进协议签署</span>'):stage===2?t('<b>2019</b><span>OCT · Tenants informed</span><span>26 NOV · Agent confirms</span>','<b>2019</b><span>10月 · 通知租户</span><span>11月26日 · 经纪人确认</span>'):stage===3?t('<b>AFTER 2019</b><span>Business continues · the market keeps changing</span>','<b>2019年之后</b><span>生意继续，市场仍在变化</span>'):t('<b>READING THE LINES</b><span>Asset value · cost of space</span>','<b>读懂两条线</b><span>资产价值 · 使用空间的成本</span>');
 }
 function setProgress(next){
  progress=clamp(next);if(!data||!root||manual)return;
  const story=retailStoryFrame(progress),nextStage=story.stage;
  if(nextStage!==stage){stage=nextStage;root.querySelector('.c-indices-note').innerHTML=stageNote();root.querySelectorAll('.c-indices-story-progress i').forEach((dot,i)=>dot.classList.toggle('is-active',i<=stage));notify();}
  selected=story.selected;reveal=(reduced.matches?selected:story.index)/(data.quartersPerSeries-1);updateReveal();updateSelection();
 }
 function setActive(value){
  const entering=!!value&&!active;active=!!value;
  if(entering&&manual){manual=false;visible.add('price');visible.add('rent');root?.querySelector('.c-indices-explore-panel').setAttribute('hidden','');root?.querySelector('[data-indices-explore]').setAttribute('aria-expanded','false');updateToggleStates();}
  if(entering)setProgress(progress);
 }
 function updateToggleStates(){root?.querySelectorAll('[data-c-index-toggle]').forEach(b=>{const shown=visible.has(b.dataset.cIndexToggle);b.setAttribute('aria-pressed',String(shown));b.setAttribute('aria-disabled',String(shown&&visible.size===1));});}
 function select(index){selected=clamp(Math.round(index),0,data.quartersPerSeries-1);updateReveal();updateSelection();}
 function draw(){
  if(!alive||!data)return;
  const rect=plot.getBoundingClientRect();width=Math.max(260,rect.width||width);height=Math.max(145,rect.height||height);left=44;right=width<400?82:100;selectionKey='';labelKey='';eventKey='';
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  const ticks=[-40,-20,0,20],xTicks=data.series[0].points.map((point,index)=>({point,index})).filter(({point})=>point.quarter.endsWith('Q1')&&(width<400?[2011,2015,2019,2026]:[2011,2015,2019,2023,2026]).includes(+point.quarter.slice(0,4)));
  svg.querySelector('clipPath rect').setAttribute('x',String(left-1));svg.querySelector('clipPath rect').setAttribute('height',String(height));
  svg.querySelector('.c-indices-axes').innerHTML=`${ticks.map(v=>`<line class="${v===0?'c-indices-base':''}" x1="${left}" x2="${width-right}" y1="${y(v)}" y2="${y(v)}"/><text x="${left-8}" y="${y(v)+3}" text-anchor="end">${v>0?'+':v<0?'−':''}${Math.abs(v)}%</text>`).join('')}${xTicks.map(({point,index})=>`<text x="${x(index)}" y="${height-7}" text-anchor="${index===0?'start':index>55?'end':'middle'}">${point.quarter.slice(0,4)}</text>`).join('')}<text class="c-indices-origin" x="${left}" y="${top-13}">${t('0% = the 2011 level','0% = 2011年的水平')}</text>`;
  const paths=data.series.map(s=>({s,path:s.points.map((p,i)=>`${i?'L':'M'}${x(i).toFixed(2)} ${y(p.changeFromBasePct).toFixed(2)}`).join(' ')}));
  svg.querySelector('.c-indices-context-lines').innerHTML=paths.map(({s,path})=>`<path class="c-indices-line c-indices-${s.id}" data-index-series="${s.id}" d="${path}"/>`).join('');
  svg.querySelector('.c-indices-lines').innerHTML=paths.map(({s,path})=>`<path class="c-indices-line c-indices-${s.id}" data-index-series="${s.id}" d="${path}"/>`).join('');
  svg.querySelector('.c-indices-witnesses').innerHTML='<rect x="'+x(31.5)+'" y="'+top+'" width="'+(x(35.5)-x(31.5))+'" height="'+(height-bottom-top)+'"/><line x1="'+x(33.5)+'" x2="'+x(33.5)+'" y1="'+top+'" y2="'+(height-bottom)+'"/><text x="'+x(33.5)+'" y="'+(top-12)+'" text-anchor="middle">'+t('2019 · Sale attempt','2019 · 整售尝试')+'</text>';
  updateReveal();updateSelection();
 }
 function onPointer(event){
  if(!data||!manual||event.type==='pointermove'&&event.pointerType!=='mouse')return;
  const box=svg.getBoundingClientRect(),position=(event.clientX-box.left)/box.width*width;select((position-left)/(width-left-right)*(data.quartersPerSeries-1));
 }
 function onInput(event){if(event.target===range)select(+range.value);}
 function resume(){manual=false;visible.add('price');visible.add('rent');root.querySelector('.c-indices-explore-panel').hidden=true;root.querySelector('[data-indices-explore]').setAttribute('aria-expanded','false');updateToggleStates();setProgress(progress);}
 function onClick(event){
  if(event.target.closest('[data-indices-explore]')){if(manual){resume();return;}manual=true;root.querySelector('.c-indices-explore-panel').hidden=false;root.querySelector('[data-indices-explore]').setAttribute('aria-expanded','true');updateReveal();updateSelection();range.focus({preventScroll:true});return;}
  if(event.target.closest('[data-indices-resume]')){resume();root.querySelector('[data-indices-explore]').focus({preventScroll:true});return;}
  const button=event.target.closest('[data-c-index-toggle]');if(!button)return;
  const id=button.dataset.cIndexToggle;if(visible.has(id)&&visible.size===1)return;visible.has(id)?visible.delete(id):visible.add(id);updateToggleStates();updateReveal();updateSelection();
 }
 const ready=readData('retail-indices.json').then(result=>{
  if(!alive)return;
  if(result.series?.length!==2||!result.series.every(s=>s.points?.length===62&&s.points.every(p=>Number.isFinite(p.changeFromBasePct))))throw new Error('Regional series are incomplete');
  data=result;
  container.innerHTML=`<div class="c-indices" role="group" aria-label="${t('Central Region retail market: a guided comparison','中区零售物业市场：引导式比较')}">
  <header class="c-indices-header"><div><span>${t('CENTRAL REGION · PRIVATE RETAIL','中区 · 私人零售物业')}</span><strong>${t('Change since 2011 Q1 (%)','相对2011年第一季度的变化（%）')}</strong></div><div class="c-indices-period"><span class="c-indices-current-quarter">2011 Q1</span><div class="c-indices-story-progress" aria-hidden="true"><i></i><i></i><i></i><i></i></div></div></header>
  <div class="c-indices-plot"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('Retail property prices and rents: percentage change from each series’ own 2011 Q1 level. Price in white; rent in gold.','零售物业价格与租金：各自相对2011年第一季度水平的百分比变化。白色为价格，金色为租金。')}"><defs><clipPath id="${clipId}"><rect x="0" y="0" width="0" height="500"/></clipPath></defs><g class="c-indices-axes" aria-hidden="true"></g><g class="c-indices-context-lines" aria-hidden="true"></g><g class="c-indices-lines" clip-path="url(#${clipId})" aria-hidden="true"></g><g class="c-indices-witnesses" aria-hidden="true"></g><g class="c-indices-end-labels" aria-hidden="true"></g><g aria-hidden="true"><circle class="c-indices-drawing-tip" r="2" fill="#eee"/><circle class="c-indices-drawing-tip" r="2" fill="#edbb73"/></g><g class="c-indices-crosshair" aria-hidden="true"></g></svg></div>
  <div class="c-indices-event-track"></div><div class="c-indices-note" aria-live="polite"></div>
  <footer class="c-indices-foot"><span>URA / SingStat · ${t('Regional context · 62 quarters','区域市场背景 · 62个季度')}</span><div><button type="button" data-indices-explore aria-expanded="false">${t('Explore quarters','探索季度')} <span aria-hidden="true">＋</span></button><details class="c-indices-sources"><summary>${t('Sources','来源')} <span aria-hidden="true">＋</span></summary><div class="c-indices-source-panel"><p>${t('Central Region private retail property. Each series is expressed as percentage change from its own 2011 Q1 value: (quarterly index ÷ base-quarter index − 1) × 100. The original official base is 1998 Q4 = 100.','中区私人零售物业。各序列显示相对于自身2011年第一季度值的百分比变化：（当期指数÷基期指数−1）×100。官方原始基期为1998年第四季度＝100。')}</p><p>${t('The two series describe Central Region sale-price and rental movements. Their separation compares changes from the same starting quarter. The 2019 band locates the collective-sale discussion; event dates follow the cited reporting.','两条曲线呈现整个中区的售价与租金走势，线间距离比较相对同一基期的变动。2019年色带对应整售讨论，事件日期沿用所引报道的记载。')}</p>${data.series.map(s=>`<a href="${esc(s.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(s.sourceId)} · ${esc(pick(s.label,lang))} ↗</a>`).join('')}<a href="${esc(data.provenance.crossCheckSourceUrl)}" target="_blank" rel="noopener noreferrer">C03 · ${t('URA 2026 Q2 release','URA 2026年第二季度公报')} ↗</a><a href="${localSources.sale}" target="_blank" rel="noopener noreferrer">H04 · ${t('Sale debate · May 2019','整售分歧 · 2019年5月')} ↗</a><a href="${localSources.marilyn}" target="_blank" rel="noopener noreferrer">H05 · Marilyn Tan · 2019 ↗</a><a href="${localSources.hon}" target="_blank" rel="noopener noreferrer">H09 · Hon Liang Lung · ${t('reported January 2026','报道于2026年1月')} ↗</a><a href="data/retail-indices.json" target="_blank" rel="noopener noreferrer">${t('Data & calculations','数据与计算')} ↗</a></div></details></div></footer>
  <div class="c-indices-explore-panel" hidden><div class="c-indices-explore-top"><span>${t('Read any quarter','读取任意季度')}</span><button type="button" data-indices-resume>${t('Resume story','继续故事')} ↗</button></div><div class="c-indices-toggle-group" role="group" aria-label="${t('Visible series','显示序列')}">${data.series.map(s=>`<button class="c-indices-${s.id}" data-c-index-toggle="${s.id}" aria-pressed="true" aria-disabled="false"><i></i>${seriesLabel(s.id)}</button>`).join('')}</div><label class="c-indices-slider"><span class="c-indices-sr">${t('Quarter. Use left and right arrows.','季度。使用左右方向键。')}</span><input type="range" min="0" max="${data.quartersPerSeries-1}" step="1" value="0" aria-label="${t('Selected quarter','所选季度')}"/></label><div class="c-indices-readout" aria-live="polite" aria-atomic="true"></div></div></div>`;
  root=container.querySelector('.c-indices');plot=root.querySelector('.c-indices-plot');svg=plot.querySelector('svg');range=root.querySelector('input');readout=root.querySelector('.c-indices-readout');root.addEventListener('click',onClick);range.addEventListener('input',onInput);svg.addEventListener('pointermove',onPointer);svg.addEventListener('click',onPointer);
  observer=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);});observer.observe(plot);setProgress(progress);draw();
 }).catch(()=>{if(alive)container.innerHTML=`<div class="c-indices-loading">${t('Reopen the story to refresh the regional indices.','重新打开故事，刷新区域指数。')}</div>`;});
 return {ready,setActive,setProgress,destroy(){alive=false;observer?.disconnect();cancelAnimationFrame(frame);root?.removeEventListener('click',onClick);range?.removeEventListener('input',onInput);svg?.removeEventListener('pointermove',onPointer);svg?.removeEventListener('click',onPointer);}};
}
