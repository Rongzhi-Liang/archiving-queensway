import {esc,pick,sourceItems} from './research-utils.js?v=20261020-revision3';

/** Two asking-price bands share one area scale; every point retains its source. */
export function mountContextMarket(container,{lang='en',data,sources=[]}={}){
 const zh=lang==='zh',t=(en,cn)=>zh?cn:en,p=value=>pick(value,lang);
 const fmt=(n,d=0)=>new Intl.NumberFormat(zh?'zh-SG':'en-SG',{maximumFractionDigits:d}).format(n);
 const records=(data?.records??[]).filter(r=>['rent','sale'].includes(r.offer)&&Number.isFinite(r.areaSqft)&&r.areaSqft>0&&Number.isFinite(r.askingSgd)&&r.askingSgd>0);
 const sourceList=sourceItems(data?.sources??sources),visible=new Set(['rent','sale']),position=new Map();
 const counts={rent:records.filter(r=>r.offer==='rent').length,sale:records.filter(r=>r.offer==='sale').length};
 let alive=true,frame=0,selected='',lastPoint=null,width=600,height=370,activeOffer='',popupOpen=false;
 const psf=row=>row.askingSgd/row.areaSqft,unit=offer=>offer==='rent'?t('S$/sqft/month','新元/平方英尺/月'):t('S$/sqft','新元/平方英尺');
 const category=row=>p(data?.groupLabels?.[row.comparisonGroup])||t('Mall shop','商场铺位');
 const date=value=>{if(!value)return '';const parsed=new Date(`${value}T12:00:00Z`);return Number.isNaN(+parsed)?value:new Intl.DateTimeFormat(zh?'zh-SG':'en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(parsed);};
 const href=value=>{try{const url=new URL(value);return /^https?:$/.test(url.protocol)?url.href:'';}catch{return '';}};
 const pointLabel=row=>`${row.id} · ${category(row)} · ${t(row.offer==='rent'?'Asking rent':'Asking sale price',row.offer==='rent'?'出租要价':'出售要价')} S$${fmt(row.askingSgd)}${row.offer==='rent'?t(' per month','／月'):''} · ${fmt(row.areaSqft)} ${t('sqft','平方英尺')} · ${fmt(psf(row),2)} ${unit(row.offer)}`;
 const observed=data?.observationWindow?`${data.observationWindow.start.slice(8)}–${data.observationWindow.end.slice(8)} OCT ${data.observationWindow.end.slice(0,4)}`:date(data?.asOf||'2026-10-19');
 container.innerHTML=`<div class="c-market" role="group" aria-label="${t('Queensway rental and sale asking prices','Queensway 出租与出售要价')}">
  <header class="c-market-toolbar"><div><span class="c-market-eyebrow">${t('QUEENSWAY · ASKING TERMS','QUEENSWAY · 挂牌条件')}</span><span class="c-market-count">${records.length} ${t('advertisements','条广告')}</span></div><div class="c-market-layers" role="group" aria-label="${t('Visible price layers','显示的价格图层')}"><button data-c-market-layer="rent" aria-pressed="true"><i></i>${t('Rent','出租')} <small>${counts.rent}</small></button><button data-c-market-layer="sale" aria-pressed="true"><i></i>${t('Sale','出售')} <small>${counts.sale}</small></button></div></header>
  <div class="c-market-plot"><svg class="c-market-svg" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="${t('Two aligned scatter plots. Asking rent per square foot per month above; asking sale price per square foot below. Shared logarithmic area scale. Select a point to open its advertisement.','上下两幅对齐散点图：上方为每平方英尺月租要价，下方为每平方英尺出售要价，共享面积对数轴。点选数据查看广告。')}"><g class="c-market-axes" aria-hidden="true"></g><g class="c-market-dots">${records.map(row=>`<g class="c-market-dot c-market-${row.offer}" data-c-market-id="${esc(row.id)}" role="button" tabindex="0" aria-label="${esc(pointLabel(row))}" aria-haspopup="dialog" aria-expanded="false"><circle class="c-market-hit" r="11"/><circle class="c-market-ring" r="9"/><circle class="c-market-mark" r="4.2"/><text class="c-market-point-id" x="10" y="-9">${esc(row.id)}</text></g>`).join('')}</g></svg></div>
  <footer class="c-market-foot"><span>${t('Retrieved','检索于')} ${esc(observed)}</span><span>${t('Select a point to explore','点选数据，查看挂牌')} ↗</span></footer>
  <aside class="c-market-popup" hidden role="dialog" aria-label="${t('Advertisement details','挂牌详情')}"></aside>
 </div>`;
 const root=container.querySelector('.c-market'),plot=root.querySelector('.c-market-plot'),svg=root.querySelector('svg'),axes=root.querySelector('.c-market-axes'),popup=root.querySelector('.c-market-popup');
 const nodes=new Map([...root.querySelectorAll('[data-c-market-id]')].map(node=>[node.dataset.cMarketId,node]));
 const orderedRows=()=>records.filter(row=>visible.has(row.offer)).sort((a,b)=>a.offer.localeCompare(b.offer)||a.areaSqft-b.areaSqft||psf(a)-psf(b));
 function scaleTop(max){const rough=max/3,power=10**Math.floor(Math.log10(rough)),n=rough/power,step=(n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*power;return {max:Math.ceil(max/step)*step,step};}
 function draw(){
  if(!alive)return;
  const rect=plot.getBoundingClientRect();width=Math.max(265,rect.width||width);height=Math.max(225,rect.height||height);
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  const left=width<400?43:55,right=18,gap=43,bottom=38,top=26,bandHeight=(height-top-bottom-gap)/2;
  const maxArea=Math.max(...records.map(r=>r.areaSqft),3000),minArea=Math.min(...records.map(r=>r.areaSqft),100);
  const x=value=>left+(Math.log10(value)-Math.log10(minArea))/(Math.log10(maxArea)-Math.log10(minArea))*(width-left-right);
  const xTicks=(width<400?[100,200,500,1000,3000]:[100,200,500,1000,2000,3000]).filter(value=>value>=minArea&&value<=maxArea);
  let markup='';
  for(const [band,offer] of ['rent','sale'].entries()){
   const yTop=top+band*(bandHeight+gap),yBottom=yTop+bandHeight,values=records.filter(row=>row.offer===offer),scale=scaleTop(Math.max(...values.map(psf),1));
   const y=value=>yBottom-value/scale.max*bandHeight,ticks=[];for(let value=0;value<=scale.max;value+=scale.step)ticks.push(value);
   markup+=`<g class="c-market-band c-market-band-${offer}${visible.has(offer)?'':' is-muted'}"><text class="c-market-band-title" x="${left}" y="${yTop-12}">${offer==='rent'?t('ASKING RENT','出租要价'):t('ASKING SALE PRICE','出售要价')}</text><text class="c-market-band-unit" text-anchor="end" x="${width-right}" y="${yTop-12}">${esc(unit(offer))}</text>${ticks.map(value=>`<line x1="${left}" y1="${y(value)}" x2="${width-right}" y2="${y(value)}"/><text class="c-market-tick" text-anchor="end" x="${left-9}" y="${y(value)+3}">${fmt(value)}</text>`).join('')}<path class="c-market-axis" d="M${left} ${yTop}V${yBottom}H${width-right}"/></g>`;
   for(const row of values){const node=nodes.get(row.id);position.set(row.id,{x:x(row.areaSqft),y:y(psf(row))});node.style.transform=`translate(${x(row.areaSqft)}px,${y(psf(row))}px)`;}
  }
  markup+=xTicks.map(value=>`<text class="c-market-tick" text-anchor="${value===minArea?'start':value===maxArea?'end':'middle'}" x="${x(value)}" y="${height-bottom+17}">${fmt(value)}</text>`).join('');
  markup+=`<text class="c-market-xunit" text-anchor="end" x="${width-right}" y="${height-2}">${t('Advertised area · sqft · log scale','广告面积 · 平方英尺 · 对数刻度')}</text>`;
  axes.innerHTML=markup;syncLayers();if(popupOpen)placePopup();
 }
 function syncLayers(){
  for(const row of records){const node=nodes.get(row.id),shown=visible.has(row.offer);node.classList.toggle('is-hidden',!shown);node.classList.toggle('is-selected',row.id===selected);node.setAttribute('aria-hidden',String(!shown));node.tabIndex=shown?0:-1;node.setAttribute('aria-expanded',String(popupOpen&&row.id===selected));}
  root.querySelectorAll('[data-c-market-layer]').forEach(button=>{const shown=visible.has(button.dataset.cMarketLayer);button.setAttribute('aria-pressed',String(shown));button.setAttribute('aria-disabled',String(shown&&visible.size===1));});
  root.querySelectorAll('.c-market-band').forEach(band=>band.classList.toggle('is-muted',!visible.has(band.classList.contains('c-market-band-rent')?'rent':'sale')));
 }
 function attributes(row){
  if(row.attributes)return p(row.attributes);
  const names={half_shop:t('Half shop','半间店铺'),lease_takeover:t('Lease takeover','接手租约'),whole_apartment:t('Whole apartment','整套住宅'),serviced_room:t('Serviced room','服务式单间'),food_beverage_listing:t('Food & beverage premises','餐饮物业')};
  const parts=(row.flags??[]).filter(flag=>names[flag]).map(flag=>names[flag]);const floor=p(row.floor);if(floor&&!['Not disclosed','Not stated','未披露','未注明'].includes(floor))parts.push(floor);return [...new Set(parts)].join(' · ');
 }
 function placePopup(){const anchor=position.get(selected);if(!anchor)return;const plotBox=plot.getBoundingClientRect(),rootBox=root.getBoundingClientRect(),popupBox=popup.getBoundingClientRect();popup.style.left=`${Math.max(0,Math.min(rootBox.width-popupBox.width,anchor.x+14))}px`;popup.style.top=`${Math.max(45,Math.min(rootBox.height-popupBox.height-5,anchor.y+plotBox.top-rootBox.top-popupBox.height/2))}px`;}
 function openPoint(id){
  const row=records.find(item=>item.id===id);if(!row||!visible.has(row.offer))return;
  selected=id;activeOffer=row.offer;lastPoint=nodes.get(id);popupOpen=true;popup.hidden=false;popup.dataset.offer=row.offer;
  const source=sourceList.find(item=>(item.id??item.source_id)===row.sourceId),url=href(row.sourceUrl||source?.url),qualifier=row.askingQualifier==='not_stated'?'':p(data?.qualifierLabels?.[row.askingQualifier]),attribute=attributes(row),observedOn=row.observedOn??data?.observationWindow?.start??data?.asOf;
  popup.innerHTML=`<button class="c-market-popup-close" data-c-market-close aria-label="${t('Close listing','关闭挂牌')}">×</button><p class="c-market-popup-kicker">${esc(row.id)} · ${esc(category(row))}</p><span class="c-market-popup-label">${row.offer==='rent'?t('Asking rent','出租要价'):t('Asking sale price','出售要价')}</span><strong class="c-market-popup-price">S$${fmt(row.askingSgd)}${row.offer==='rent'?`<small>${t('/ month','／月')}</small>`:''}</strong>${qualifier?`<span class="c-market-qualifier">${esc(qualifier)}</span>`:''}<div class="c-market-popup-metrics"><span><small>${t('AREA','面积')}</small><b>${fmt(row.areaSqft)} <em>${t('sqft','平方英尺')}</em></b></span><span><small>${esc(unit(row.offer))}</small><b>${fmt(psf(row),2)}</b></span></div>${attribute?`<p class="c-market-attributes">${esc(attribute)}</p>`:''}<div class="c-market-popup-source">${url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(source?.publisher??row.sourcePublisher??t('Listing source','挂牌来源'))} ↗</a>`:''}<small>${t('Listed','刊登')} ${esc(date(row.listedOn))}<br>${t('Retrieved','检索')} ${esc(date(observedOn))}</small></div>`;
  const ordered=orderedRows(),index=ordered.findIndex(item=>item.id===id);
  popup.insertAdjacentHTML('beforeend',`<div class="c-market-popup-nav"><button data-c-market-next="-1" aria-label="${t('Previous advertisement','上一条广告')}">←</button><span>${String(index+1).padStart(2,'0')} / ${ordered.length}</span><button data-c-market-next="1" aria-label="${t('Next advertisement','下一条广告')}">→</button></div>`);
  syncLayers();placePopup();
 }
 function closePopup(restore=false){popupOpen=false;popup.hidden=true;syncLayers();if(restore)lastPoint?.focus({preventScroll:true});}
 function highlight(id){if(popupOpen)return;selected=id;syncLayers();}
 function click(event){
  const point=event.target.closest('[data-c-market-id]');if(point){openPoint(point.dataset.cMarketId);return;}
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-c-market-close')){closePopup(true);return;}
  if(button.dataset.cMarketNext){const ordered=orderedRows(),index=ordered.findIndex(row=>row.id===selected);openPoint(ordered[(index+Number(button.dataset.cMarketNext)+ordered.length)%ordered.length].id);popup.querySelector(`[data-c-market-next="${button.dataset.cMarketNext}"]`)?.focus({preventScroll:true});return;}
  if(button.dataset.cMarketLayer){const offer=button.dataset.cMarketLayer;if(visible.has(offer)&&visible.size===1)return;visible.has(offer)?visible.delete(offer):visible.add(offer);if(popupOpen&&!visible.has(activeOffer))closePopup();if(popupOpen)openPoint(selected);else syncLayers();}
 }
 function hover(event){const point=event.target.closest('[data-c-market-id]');if(point)highlight(point.dataset.cMarketId);}
 function key(event){
  if(event.key==='Escape'&&popupOpen){event.preventDefault();event.stopPropagation();closePopup(true);return;}
  const node=event.target.closest('[data-c-market-id]');if(!node)return;
  if(['Enter',' '].includes(event.key)){event.preventDefault();openPoint(node.dataset.cMarketId);return;}
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();
  const rows=orderedRows();
  const index=rows.findIndex(row=>row.id===node.dataset.cMarketId),next=event.key==='Home'?0:event.key==='End'?rows.length-1:(index+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)+rows.length)%rows.length;
  if(popupOpen)closePopup();nodes.get(rows[next].id)?.focus({preventScroll:true});highlight(rows[next].id);
 }
 root.addEventListener('click',click);root.addEventListener('pointerover',hover);root.addEventListener('focusin',hover);root.addEventListener('keydown',key);
 const observer=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);});observer.observe(plot);draw();
 return {setOffer(){/* Compatibility: the combined view retains both price bands. */},destroy(){alive=false;observer.disconnect();cancelAnimationFrame(frame);root.removeEventListener('click',click);root.removeEventListener('pointerover',hover);root.removeEventListener('focusin',hover);root.removeEventListener('keydown',key);}};
}
