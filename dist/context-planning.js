import {readData,esc,landLabel} from './research-utils.js?v=20261020-revision3';

const ADDRESS=[103.8033972877883,1.287595189398704],R=6378137,SCALE=Math.cos(ADDRESS[1]*Math.PI/180);
const mercator=([lng,lat])=>[R*lng*Math.PI/180,R*Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))];
const ORIGIN=mercator(ADDRESS);
const project=point=>{const [x,y]=mercator(point);return[(x-ORIGIN[0])*SCALE,-(y-ORIGIN[1])*SCALE];};
const rings=geometry=>geometry.type==='MultiPolygon'?geometry.coordinates:[geometry.coordinates];
const polygonPath=geometry=>rings(geometry).map(polygon=>polygon.map(ring=>ring.map((point,i)=>`${i?'L':'M'}${project(point).map(n=>n.toFixed(2)).join(' ')}`).join(' ')+'Z').join(' ')).join(' ');
const category=value=>value.includes('RESIDENTIAL')?(value.includes('COMMERCIAL')?'homes commerce':'homes'):value==='COMMERCIAL'||value==='HOTEL'?'commerce':['HEALTH & MEDICAL CARE','EDUCATIONAL INSTITUTION','CIVIC & COMMUNITY INSTITUTION'].includes(value)?'care':'other';
const numericGpr=value=>typeof value==='number'&&Number.isFinite(value)?String(value):/^\d+(\.\d+)?$/.test(String(value??'').trim())?String(value).trim():'—';
const inRing=([x,y],ring)=>{let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;};
const containsPoint=(geometry,point)=>rings(geometry).some(polygon=>inRing(point,polygon[0])&&!polygon.slice(1).some(hole=>inRing(point,hole)));
const clamp=value=>Math.max(0,Math.min(1,value));
const localIds=['anchorpoint','ikea','alexandra-village','alexandra-hospital','queenstown'];
let serial=0;

export function mountContextPlanning(container,{lang='en',propertyStory=false,onNarrativeChange,onRangeChange}={}){
  const id=++serial,t=(en,zh)=>lang==='zh'?zh:en,choose=value=>typeof value==='object'?(value?.[lang]??value?.en??''):(value??'');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let alive=true,ready=false,active=false,progress=0,stage=-1,manual=false,frame=0,features=[],anchors=[],projects=[],queenswayId=190360,selected=190360,radius=1200,group='',view=[-1400,-1050,2800,2200],rasterBounds=null,resizeObserver,lastSize=null;
  container.innerHTML=`<div class="c-plan-loading" role="status">${t('Opening URA SPACE…','正在展开URA SPACE…')}</div>`;
  const loadAsset=name=>fetch(new URL(`./assets/ura-space-2025/${name}`,import.meta.url)).then(response=>{if(!response.ok)throw new Error(name);return response.json();});
  const aspect=()=>{const box=container.getBoundingClientRect();return box.width>0&&box.height>0?box.width/box.height:1.3;};
  const featureAt=coordinates=>features.find(item=>containsPoint(item.geometry,coordinates));
  const stories=()=>propertyStory?[
    {title:{en:'Shops and homes,\nplanned together.',zh:'商铺与住家，\n共同规划。'},description:{en:'Master Plan 2025 designates the Queensway zone Commercial & Residential. Its plot-ratio field records EVA. The permitted intensity and details of any proposal depend on planning assessment.',zh:'《2025 总体规划》将女皇道对应分区划为商业与住宅用途，容积率字段记为 EVA。具体方案可获准的开发强度与细节，须由规划主管机关评估。'},kicker:{en:'FUTURE LAND USE · MASTER PLAN 2025',zh:'未来土地用途 · 2025 总体规划'}},
    {title:{en:'More homes.\nA changing neighbourhood.',zh:'更多住家。\n街区正在改变。'},description:{en:'Queensway Canopy and Stirling Horizon add planned housing nearby. Alexandra Hospital’s redevelopment will add healthcare capacity in phases. These projects change the setting in which a future Queensway would operate.',zh:'Queensway Canopy 与 Stirling Horizon 为周边增加规划住宅。亚历山大医院重建将分期增加医疗服务容量。这些项目改变了未来女皇道所处的街区环境。'},kicker:{en:'FUTURE LAND USE · NEARBY PROJECTS',zh:'未来土地用途 · 周边项目'}},
    {title:{en:'Back to\nthe site itself.',zh:'回到\n女皇道这处土地。'},description:{en:'The plan frames the mix of uses that can be considered. A specific redevelopment would need an approved proposal and, for a collective sale, a decision among owners.',zh:'总体规划划定了可以考虑的用途组合。具体重建须有获准的方案。若通过集体出售推进，也需要业主共同作出决定。'},kicker:{en:'FUTURE LAND USE · QUEENSWAY',zh:'未来土地用途 · 女皇道'}}
  ]:[
    {title:{en:'Everyday places,\nside by side.',zh:'日常所需，\n汇聚于此。'},description:{en:'Queensway shares its neighbourhood with homes, Anchorpoint, IKEA Alexandra and Alexandra Village. Alexandra Hospital and Queenstown MRT extend this setting into care and transport. These named places locate the mall within the area’s everyday services.',zh:'Queensway与住宅、安可坊、宜家亚历山大和亚历山大村共享街区。亚历山大医院与女皇镇地铁站进一步连接医疗和交通功能。这些具体地点呈现了商场在街区日常服务中的位置。'},kicker:{en:'THE EXISTING NEIGHBOURHOOD',zh:'现有街区'}},
    {title:{en:'The surroundings\nare changing.',zh:'商场周围，\n变化正在发生。'},description:{en:'North of Queensway, Queensway Canopy’s 996 homes and Stirling Horizon’s 1,126 BTO flats add residential growth. Southwest, Alexandra Hospital is under construction, with phased opening planned from 2028. These official projects place the mall’s established shops within a changing neighbourhood.',zh:'Queensway北侧，Queensway Canopy的996套住宅与Stirling Horizon的1126套预购组屋带来住宅增长。西南侧，亚历山大医院正在建设，计划自2028年起分阶段启用。这些官方项目，将商场既有商铺置于正在变化的街区之中。'},kicker:{en:'HOUSING & HEALTHCARE',zh:'住房与医疗'}},
    {title:{en:'A changing district.\nAn everyday role.',zh:'街区向前，\n日常在此延续。'},description:{en:'Housing and healthcare development place Queensway’s established shops within a changing service landscape. This leads to the people at the heart of our project: what role do their trades, relationships and familiar meeting places play as the surrounding neighbourhood evolves?',zh:'住房与医疗项目，使Queensway既有商铺处在持续变化的服务环境中。故事由此转向项目中的人：当周边街区不断发展，他们的行业、人际关系与熟悉的相聚空间，发挥着怎样的作用？'},kicker:{en:'BACK TO QUEENSWAY',zh:'回到QUEENSWAY'}}
  ];
  const clampView=target=>{if(!rasterBounds)return target;const ratio=target[2]/target[3],width=Math.min(target[2],rasterBounds[2]*.98,rasterBounds[3]*.98*ratio),height=width/ratio;return[Math.max(rasterBounds[0],Math.min(rasterBounds[0]+rasterBounds[2]-width,target[0]+(target[2]-width)/2)),Math.max(rasterBounds[1],Math.min(rasterBounds[1]+rasterBounds[3]-height,target[1]+(target[3]-height)/2)),width,height];};
  const fitPoints=(points,{padding=1.45,minWidth=2000}={})=>{
    const projected=points.map(project),xs=projected.map(p=>p[0]),ys=projected.map(p=>p[1]);
    const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys),ratio=aspect(),width=Math.max(minWidth,(xmax-xmin)*padding,(ymax-ymin)*padding*ratio),height=width/ratio;
    return[(xmin+xmax-width)/2,(ymin+ymax-height)/2-80,width,height];
  };
  const storyView=()=>{
    if(propertyStory&&stage!==1)return fitPoints([ADDRESS],{minWidth:1000});
    const places=stage===0?anchors.filter(a=>localIds.includes(a.id)):projects;
    return fitPoints([ADDRESS,...places.map(p=>p.coordinates)],{padding:stage===0?1.9:2.15,minWidth:stage===2?2100:2200});
  };
  const updateView=()=>{
    const svg=container.querySelector('.c-plan-svg');if(!svg)return;
    svg.setAttribute('viewBox',view.join(' '));
    const box=svg.getBoundingClientRect(),unit=(box.width||700)/view[2];
    container.querySelectorAll('[data-c-plan-position]').forEach(marker=>{
      const [x,y]=marker.dataset.cPlanPosition.split(',').map(Number);
      marker.style.left=`${(x-view[0])/view[2]*100}%`;marker.style.top=`${(y-view[1])/view[3]*100}%`;
      marker.classList.toggle('is-outside',x<view[0]+view[2]*.025||x>view[0]+view[2]*.975||y<view[1]+view[3]*.05||y>view[1]+view[3]*.90);
    });
    container.querySelectorAll('.c-plan-ring-label').forEach(label=>label.setAttribute('font-size',String(10/unit)));
    const scale=container.querySelector('.c-plan-scale'),metres=view[2]<1800?200:500;
    scale.style.setProperty('--scale-width',`${metres*unit}px`);scale.querySelector('span').textContent=`${metres} m`;
  };
  const moveTo=(target,animate=true)=>{
    target=clampView(target);cancelAnimationFrame(frame);
    if(!animate||reduced.matches){view=[...target];updateView();return;}
    const from=[...view],start=performance.now(),duration=1250;
    const tick=now=>{if(!alive)return;const p=clamp((now-start)/duration),eased=p*p*p*(p*(p*6-15)+10);view=from.map((value,i)=>value+(target[i]-value)*eased);updateView();if(p<1)frame=requestAnimationFrame(tick);};
    frame=requestAnimationFrame(tick);
  };
  const notify=()=>{const sources=projects.flatMap(item=>(item.sources??[]).map((source,index)=>({...source,id:`space-${item.id}-${index+1}`})));const payload={stageIndex:Math.max(0,stage),stageCount:3,...stories()[Math.max(0,stage)],sourceIds:stage===0||(propertyStory&&stage===2)?['P07','P08','P09']:sources.map(source=>source.id),sources};if(typeof onNarrativeChange==='function')onNarrativeChange(payload);};
  const closeDetail=()=>{const detail=container.querySelector('.c-plan-detail');detail.hidden=true;detail.replaceChildren();container.querySelectorAll('[data-c-plan-project]').forEach(button=>button.classList.remove('is-selected'));};
  const pause=()=>{manual=true;container.querySelector('.c-plan-root').dataset.manual='true';};
  const setStage=(next,force=false)=>{
    if(!ready)return;if(stage===next&&!force)return;stage=next;
    const root=container.querySelector('.c-plan-root');root.dataset.stage=String(stage);
    root.querySelectorAll('.c-plan-chapter-mark i').forEach((mark,index)=>mark.classList.toggle('is-active',index===stage));
    container.querySelector('.c-plan-stage-name').textContent=choose(stories()[stage].kicker);
    if(!manual){closeDetail();selected=queenswayId;root.classList.remove('is-inspecting');root.querySelectorAll('[data-c-plan-zone]').forEach(path=>path.classList.remove('is-selected'));root.dataset.group='';root.querySelectorAll('[data-c-plan-group]').forEach(button=>button.setAttribute('aria-pressed','false'));moveTo(storyView(),active);}
    notify();
  };
  const syncProgress=()=>{const next=progress<.34?0:progress<.7?1:2;setStage(next);container.querySelector('.c-plan-root')?.style.setProperty('--plan-progress',String(progress));};
  const resume=()=>{manual=false;container.querySelector('.c-plan-root').dataset.manual='false';container.querySelectorAll('.c-plan-footnotes details').forEach(detail=>detail.open=false);container.querySelector('.c-plan-root').classList.remove('is-exploring');setStage(progress<.34?0:progress<.7?1:2,true);};
  const describeZone=(feature,name)=>{
    if(!feature)return;selected=Number(feature.properties.OBJECTID);const p=feature.properties,root=container.querySelector('.c-plan-root');root.classList.add('is-inspecting');
    container.querySelectorAll('[data-c-plan-zone]').forEach(path=>path.classList.toggle('is-selected',Number(path.dataset.cPlanZone)===selected));
    const selection=container.querySelector('.c-plan-selection');selection.innerHTML=`<span>${esc(name??(selected===queenswayId?'QUEENSWAY':String(p.SUBZONE_N??'').replaceAll('_',' ')))}</span><strong>${esc(landLabel(p.LU_DESC,lang))}</strong><small>${t('GPR','容积率')} <b>${numericGpr(p.GPR)}</b></small>`;
    const select=container.querySelector('[data-c-plan-select]');if([...select.options].some(option=>Number(option.value)===selected))select.value=String(selected);
  };
  const showProject=projectId=>{
    const item=projects.find(item=>item.id===projectId);if(!item)return;pause();closeDetail();
    const feature=featureAt(item.coordinates);if(feature)describeZone(feature,choose(item.name));
    container.querySelectorAll('[data-c-plan-project]').forEach(button=>button.classList.toggle('is-selected',button.dataset.cPlanProject===projectId));
    const source=item.sources?.[0],asset=item.image?.path??item.image?.src??item.image??item.imagePath;
    const image=typeof asset==='string'?`<a class="c-plan-detail-image" data-image-kind="${String(item.image?.kind??'').includes('photograph')?'photo':'page'}" href="${esc(item.image?.originalFile??item.image?.sourceUrl??source?.url??asset)}" target="_blank" rel="noopener"><img src="${esc(asset)}" alt="${esc(choose(item.image?.caption??item.imageAlt??item.name))}" loading="lazy"></a><p class="c-plan-image-caption">${esc(choose(item.image?.caption))}</p>`:'';
    const detail=container.querySelector('.c-plan-detail');detail.hidden=false;
    detail.innerHTML=`<button class="c-plan-detail-close" data-c-plan-detail-close aria-label="${t('Close project details','关闭项目详情')}">×</button>${image}<div class="c-plan-detail-copy"><p class="c-plan-detail-date">${esc(source?.publisher??'')} · ${esc(source?.date??item.date??'')}</p><h3>${esc(choose(item.name))}</h3><p class="c-plan-detail-status">${esc(choose(item.status))}</p><p>${esc(choose(item.summary))}</p>${source?`<a href="${esc(source.url)}" target="_blank" rel="noopener">${t('Read the official project page','阅读官方项目原页')} ↗</a>`:''}</div>`;
    detail.querySelector('[data-c-plan-detail-close]')?.focus({preventScroll:true});
  };
  const updateRange=()=>{
    const root=container.querySelector('.c-plan-root');root.dataset.radius=String(radius);
    root.querySelectorAll('[data-c-plan-range]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.cPlanRange)===radius)));
    root.querySelectorAll('[data-c-plan-ring]').forEach(circle=>circle.classList.toggle('is-active',Number(circle.dataset.cPlanRing)===radius));
    const ratio=aspect(),height=Math.max(radius*2.6,radius*2.6/ratio),width=height*ratio;moveTo([-width/2,-height/2,width,height]);
    if(typeof onRangeChange==='function')onRangeChange({radius});
  };
  const click=event=>{
    const button=event.target.closest('button');
    if(button?.hasAttribute('data-c-plan-resume')){resume();return;}
    if(button?.hasAttribute('data-c-plan-detail-close')){closeDetail();container.querySelector('.c-plan-resume')?.focus({preventScroll:true});return;}
    if(button?.dataset.cPlanProject){showProject(button.dataset.cPlanProject);return;}
    if(button?.dataset.cPlanAnchor){const item=anchors.find(a=>a.id===button.dataset.cPlanAnchor);if(item){pause();closeDetail();describeZone(featureAt(item.coordinates),choose(item.name));}return;}
    if(button?.dataset.cPlanRange){pause();radius=Number(button.dataset.cPlanRange);updateRange();return;}
    if(button?.hasAttribute('data-c-plan-group')){pause();group=group===button.dataset.cPlanGroup?'':button.dataset.cPlanGroup;container.querySelector('.c-plan-root').dataset.group=group;container.querySelectorAll('[data-c-plan-group]').forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.cPlanGroup===group)));return;}
    if(button?.dataset.cPlanZoom){pause();const width=Math.max(700,Math.min(4400,view[2]*Number(button.dataset.cPlanZoom))),height=width/aspect();moveTo([view[0]+(view[2]-width)/2,view[1]+(view[3]-height)/2,width,height]);return;}
    if(button?.hasAttribute('data-c-plan-reset')){resume();return;}
    const zone=event.target.closest('[data-c-plan-zone]');if(zone){pause();closeDetail();describeZone(features.find(f=>Number(f.properties.OBJECTID)===Number(zone.dataset.cPlanZone)));}
  };
  const change=event=>{if(!event.target.matches('[data-c-plan-select]'))return;pause();closeDetail();const feature=features.find(f=>Number(f.properties.OBJECTID)===Number(event.target.value));if(feature){describeZone(feature);moveTo(fitPoints(rings(feature.geometry).flatMap(p=>p.flatMap(r=>r)),{padding:1.5,minWidth:1300}));}};
  const toggle=event=>{if(!event.target.matches('.c-plan-footnotes details'))return;const open=event.target.open;if(open)container.querySelectorAll('.c-plan-footnotes details').forEach(detail=>{if(detail!==event.target)detail.open=false;});if(event.target.matches('.c-plan-explore'))container.querySelector('.c-plan-root').classList.toggle('is-exploring',open);if(open)pause();};
  const key=event=>{if(event.key==='Escape'){closeDetail();container.querySelector('.c-plan-explore').open=false;}};
  Promise.all([loadAsset('manifest.json'),readData('planning-ura-space.geojson'),loadAsset('anchors.json'),readData('space-development-evidence.json?v=20261108-release1')]).then(([source,zones,places,evidence])=>{
    if(!alive)return;queenswayId=source.queenswayZoneId;selected=queenswayId;features=zones.features.filter(f=>['Polygon','MultiPolygon'].includes(f.geometry?.type));anchors=places.anchors.filter(anchor=>localIds.includes(anchor.id));projects=(evidence.projects??[]).filter(p=>Array.isArray(p.coordinates));
    const tileSize=2*Math.PI*R/2**source.zoom*SCALE;
    const positions=source.tiles.map(tile=>({tile,left:(tile.x/2**tile.z*2*Math.PI*R-Math.PI*R-ORIGIN[0])*SCALE,top:-(Math.PI*R-tile.y/2**tile.z*2*Math.PI*R-ORIGIN[1])*SCALE}));
    const minX=Math.min(...positions.map(p=>p.left)),minY=Math.min(...positions.map(p=>p.top));rasterBounds=[minX,minY,Math.max(...positions.map(p=>p.left))+tileSize-minX,Math.max(...positions.map(p=>p.top))+tileSize-minY];
    const tiles=positions.map(({tile,left,top})=>`<image href="${esc(new URL(tile.image,import.meta.url).href)}" x="${left.toFixed(3)}" y="${top.toFixed(3)}" width="${(tileSize+.1).toFixed(3)}" height="${(tileSize+.1).toFixed(3)}"/>`).join('');
    const projectZones=new Set(projects.map(p=>featureAt(p.coordinates)?.properties.OBJECTID).filter(Boolean));
    const neighbourhoodZones=new Set(anchors.map(p=>featureAt(p.coordinates)?.properties.OBJECTID).filter(Boolean));
    const nearest=[...features].sort((a,b)=>Math.hypot(...project(rings(a.geometry)[0][0][0]))-Math.hypot(...project(rings(b.geometry)[0][0][0]))).slice(0,140);
    container.innerHTML=`<div class="c-plan-root" data-stage="0" data-manual="false" data-group="">
      <svg class="c-plan-svg" viewBox="${view.join(' ')}" role="img" aria-label="${t('URA SPACE Master Plan 2025. Queensway, nearby services and official housing and healthcare project locations.','URA SPACE 2025总体规划：Queensway、周边服务，以及官方住房和医疗项目的位置。')}"><g class="c-plan-official">${tiles}</g><g class="c-plan-zones">${features.map(feature=>{const p=feature.properties;return `<path data-c-plan-zone="${p.OBJECTID}" data-group="${category(p.LU_DESC)}" class="${Number(p.OBJECTID)===queenswayId?'c-plan-qsc ':''}${projectZones.has(p.OBJECTID)?'c-plan-project-zone ':''}${neighbourhoodZones.has(p.OBJECTID)?'c-plan-local-zone':''}" d="${polygonPath(feature.geometry)}" fill-rule="evenodd" vector-effect="non-scaling-stroke"><title>${esc(landLabel(p.LU_DESC,lang))} · GPR ${numericGpr(p.GPR)}</title></path>`;}).join('')}</g><g class="c-plan-rings" aria-hidden="true">${[400,800,1200].map(distance=>`<circle data-c-plan-ring="${distance}" r="${distance}" vector-effect="non-scaling-stroke"/><text class="c-plan-ring-label" x="${distance*.71}" y="${-distance*.71}">${distance===1200?'1,200':distance} m</text>`).join('')}</g></svg>
      <div class="c-plan-vignette" aria-hidden="true"></div>
      <div class="c-plan-stage-label"><span class="c-plan-stage-name"></span><div class="c-plan-chapter-mark" aria-hidden="true"><i></i><i></i><i></i></div></div>
      <div class="c-plan-place" data-c-plan-position="0,0" aria-hidden="true"><i></i><span>QUEENSWAY<br><small>${t('SHOPPING CENTRE','购物中心')}</small></span></div>
      ${anchors.map(anchor=>{const [x,y]=project(anchor.coordinates);return `<button class="c-plan-anchor c-plan-anchor-${anchor.id}" data-c-plan-anchor="${anchor.id}" data-c-plan-position="${x},${y}" aria-label="${esc(choose(anchor.name))}"><i>${anchor.category==='rail'?'M':''}</i><span>${esc(choose(anchor.name))}</span></button>`;}).join('')}
      ${projects.map((item,index)=>{const [x,y]=project(item.coordinates);return `<button class="c-plan-project c-plan-project-${index}" data-c-plan-project="${esc(item.id)}" data-c-plan-position="${x},${y}" aria-label="${esc(choose(item.name))} · ${t('Read official project evidence','阅读官方项目资料')}"><i>${String(index+1).padStart(2,'0')}</i><span>${esc(choose(item.shortName??item.name))}<small>${esc(choose(item.mapLabel??item.metric??item.status))}</small></span></button>`;}).join('')}
      <div class="c-plan-selection" aria-live="polite"></div>
      <div class="c-plan-north" aria-hidden="true">N<span>↑</span></div>
      <div class="c-plan-tools"><button data-c-plan-zoom=".75" aria-label="${t('Zoom in','放大')}">+</button><button data-c-plan-zoom="1.34" aria-label="${t('Zoom out','缩小')}">−</button><button data-c-plan-reset aria-label="${t('Return to the guided view','回到引导视图')}">⌖</button></div>
      <button class="c-plan-resume" data-c-plan-resume>${t('Resume the story','继续跟随故事')} <span aria-hidden="true">↗</span></button>
      <aside class="c-plan-detail" hidden aria-label="${t('Official project evidence','官方项目资料')}"></aside>
      <div class="c-plan-scale" aria-hidden="true"><span></span><i></i></div>
      <div class="c-plan-footnotes"><details class="c-plan-explore"><summary>${t('Explore the map','自由探索地图')}</summary><div class="c-plan-explore-body"><fieldset class="c-plan-range-controls"><legend>${t('Straight-line distance from Queensway','距Queensway的直线距离')}</legend><div>${[400,800,1200].map(distance=>`<button data-c-plan-range="${distance}" aria-pressed="${distance===radius}">${distance===1200?'1,200':distance} m</button>`).join('')}</div></fieldset><fieldset class="c-plan-legend"><legend>${t('Highlight land use','高亮土地用途')}</legend><div>${[['homes','Homes','住宅'],['commerce','Commerce','商业'],['care','Care & learning','医疗与教育']].map(([key,en,zh])=>`<button data-c-plan-group="${key}" aria-pressed="false"><i></i>${t(en,zh)}</button>`).join('')}</div></fieldset><label for="c-plan-select-${id}">${t('Inspect a planning zone','查看规划分区')}</label><select id="c-plan-select-${id}" data-c-plan-select>${nearest.map(feature=>`<option value="${feature.properties.OBJECTID}" ${Number(feature.properties.OBJECTID)===queenswayId?'selected':''}>${Number(feature.properties.OBJECTID)===queenswayId?'Queensway · ':''}${esc(landLabel(feature.properties.LU_DESC,lang))} · ${feature.properties.OBJECTID}</option>`).join('')}</select></div></details><details class="c-plan-sources"><summary>${t('Map & project sources','地图与项目来源')}</summary><div><p>${t('URA SPACE Master Plan 2025 supplies the official base map and land-use zones. Numbered markers locate official development projects; coloured shapes follow the MP2025 planning zones. Each project marker opens its dated source.','URA SPACE 2025总体规划提供官方底图与土地用途分区。编号标记定位官方发展项目，彩色区块沿用MP2025规划分区。点击项目标记，可阅读带有日期的原始来源。')}</p><p>${t('Local destinations: SLA OneMap. MRT footprint: URA. Optional distance rings measure straight-line distance from Queensway.','周边目的地：SLA OneMap；地铁站位置：URA。可选距离圈以Queensway为中心，表示直线距离。')}</p><a href="https://eservice.ura.gov.sg/maps/" target="_blank" rel="noopener">URA SPACE ↗</a><a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener">SLA OneMap ↗</a>${projects.map(item=>item.sources?.[0]?`<a href="${esc(item.sources[0].url)}" target="_blank" rel="noopener">${esc(choose(item.name))} ↗</a>`:'').join('')}</div></details></div>
      <div class="c-plan-credit">URA SPACE · MP2025 / SLA OneMap</div>
    </div>`;
    ready=true;stage=-1;syncProgress();view=clampView(storyView());updateView();container.addEventListener('click',click);container.addEventListener('change',change);container.addEventListener('toggle',toggle,true);container.addEventListener('keydown',key);
    resizeObserver=new ResizeObserver(()=>{if(!alive||!ready)return;const box=container.getBoundingClientRect(),size=[Math.round(box.width),Math.round(box.height)];if(lastSize&&lastSize[0]===size[0]&&lastSize[1]===size[1])return;lastSize=size;if(manual){const height=view[2]/aspect();moveTo([view[0],view[1]+(view[3]-height)/2,view[2],height],false);}else moveTo(storyView(),false);});resizeObserver.observe(container);
  }).catch(error=>{console.error('Planning map:',error);if(alive)container.innerHTML=`<div class="c-plan-loading"><a href="https://eservice.ura.gov.sg/maps/" target="_blank" rel="noopener">${t('Explore the map in URA SPACE','在URA SPACE中探索地图')} ↗</a></div>`;});
  return {
    setActive(next){const changed=active!==Boolean(next);active=Boolean(next);if(!ready||!changed)return;if(!active){manual=false;container.querySelector('.c-plan-root').dataset.manual='false';container.querySelectorAll('.c-plan-footnotes details').forEach(detail=>detail.open=false);container.querySelector('.c-plan-root').classList.remove('is-exploring');closeDetail();}else{syncProgress();moveTo(storyView(),false);}},
    setProgress(next){progress=clamp(Number(next)||0);if(ready&&!manual)syncProgress();},
    setView(){},
    setRange(next){if(![400,800,1200].includes(Number(next))||!ready)return;radius=Number(next);pause();container.querySelector('.c-plan-explore').open=true;updateRange();},
    destroy(){alive=false;cancelAnimationFrame(frame);resizeObserver?.disconnect();container.removeEventListener('click',click);container.removeEventListener('change',change);container.removeEventListener('toggle',toggle,true);container.removeEventListener('keydown',key);}
  };
}
