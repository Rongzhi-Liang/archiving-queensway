const clamp=n=>Math.max(0,Math.min(1,Number(n)||0));
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const R=6378137,ADDRESS=[103.8033972877883,1.287595189398704],SCALE=Math.cos(ADDRESS[1]*Math.PI/180)*.34;
const mercator=([lon,lat])=>[R*lon*Math.PI/180,R*Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))];
const origin=mercator(ADDRESS);
const projectXY=([x,y])=>[320+(x-origin[0])*SCALE,278-(y-origin[1])*SCALE];
export const landProject=point=>projectXY(mercator(point));
export function landFrame(p){const progress=clamp(p),phase=progress<.5?0:1,local=phase?Math.min(1,(progress-.5)*2):progress*2;return {phase,index:Math.min(3,Math.floor(local*4))};}
const path=geometry=>(geometry.type==='MultiPolygon'?geometry.coordinates:[geometry.coordinates]).map(polygon=>polygon.map(ring=>'M'+ring.map(point=>landProject(point).map(n=>n.toFixed(2)).join(',')).join('L')+'Z').join('')).join('');

export function landMapMarkup(lang='en'){
 const t=(en,zh)=>lang==='zh'?zh:en;
 return `<div class="plm-main" data-plm-main>
  <p class="plm-label" data-plm-label>${t('Opening the map…','正在载入地图…')}</p>
  <figure class="plm-map"><svg data-plm-map viewBox="0 0 640 450" role="group" aria-label="${t('Queensway and its surroundings','女皇道及周边环境')}"></svg><p class="plm-status" data-plm-status role="status">${t('Loading map evidence…','正在载入地图资料…')}</p></figure>
  <nav class="plm-topics" data-plm-topics aria-label="${t('Places on the map','地图上的地点')}"></nav>
  <div class="plm-caption"><strong data-plm-metric></strong><p data-plm-caption></p></div>
  <div class="plm-legend" data-plm-legend aria-label="${t('URA land-use legend','URA 土地用途图例')}" hidden></div>
  <div class="plm-attribution"><a data-plm-logo-link target="_blank" rel="noopener noreferrer" hidden><img data-plm-logo alt=""></a><p data-plm-credit></p></div>
  <p class="plm-note" data-plm-note></p>
 </div>`;
}

function imageMarkup(manifest){
 if(Array.isArray(manifest.tiles))return manifest.tiles.map(tile=>{const n=2**tile.z,world=2*Math.PI*R,mx=tile.x/n*world-Math.PI*R,my=Math.PI*R-tile.y/n*world,[x,y]=projectXY([mx,my]),size=world/n*SCALE;if(x>641||y>451||x+size<0||y+size<0)return '';return `<image data-plm-image data-src="${esc(tile.image)}" x="${x}" y="${y}" width="${size+.08}" height="${size+.08}"/>`;}).join('');
 const image=manifest.image?.path||manifest.image,extent=manifest.extent||manifest.bbox;
 if(image&&Array.isArray(extent)&&extent.length===4){const sr=String(manifest.spatialReference||'EPSG:3857'),topLeft=sr.includes('4326')?mercator([extent[0],extent[3]]):[extent[0],extent[3]],bottomRight=sr.includes('4326')?mercator([extent[2],extent[1]]):[extent[2],extent[1]],[x,y]=projectXY(topLeft),[right,bottom]=projectXY(bottomRight);return `<image data-plm-image data-src="${esc(image)}" x="${x}" y="${y}" width="${right-x}" height="${bottom-y}"/>`;}
 throw new Error('Map imagery manifest has no georeferenced images');
}

export function mountLandMap(container,{lang='en',onExplain=()=>{}}={}){
 if(!container)return {setProgress(){},destroy(){}};
 const t=(en,zh)=>lang==='zh'?zh:en,local=value=>typeof value==='object'?(value?.[lang]||value?.en||''):String(value??'');
 const abort=new AbortController(),svg=container.querySelector('[data-plm-map]'),topics=container.querySelector('[data-plm-topics]'),status=container.querySelector('[data-plm-status]');
 let evidence=null,progress=0,phase=0,index=0,manual=null,alive=true,lastPhase=-1,lastExplanation='',layers=[];
 const imageState=[{pending:0,failed:0},{pending:0,failed:0}];
 const read=async relative=>{const response=await fetch(new URL(relative,import.meta.url),{signal:abort.signal});if(!response.ok)throw new Error(`Map evidence unavailable: ${relative}`);return response.json();};
 function showStatus(){
  const state=imageState[phase];status.hidden=state.pending===0&&state.failed===0;
  if(state.pending)status.textContent=t('Loading map imagery…','正在载入地图影像…');
  else if(state.failed)status.innerHTML=`${t('Reload the map imagery.','请重新载入地图影像。')} <button type="button" data-plm-retry>${t('Retry','重试')}</button>`;
 }
 function loadImages(layer,i,retry=false){
  const images=[...layer.querySelectorAll('[data-plm-image]')],state=imageState[i];state.pending=images.length;state.failed=0;
  images.forEach(image=>{let settled=false;const settle=failed=>{if(settled||!alive)return;settled=true;state.pending--;if(failed)state.failed++;if(phase===i)showStatus();};image.addEventListener('load',()=>settle(false),{once:true,signal:abort.signal});image.addEventListener('error',()=>settle(true),{once:true,signal:abort.signal});const source=image.dataset.src;image.setAttribute('href',retry?source+(source.includes('?')?'&':'?')+'retry='+Date.now():source);});
  if(phase===i)showStatus();
 }
 function drawLegend(){
  const fallback=[{label:{en:'Commercial + residential',zh:'商住'},color:'#77b7c9',secondaryColor:'#eadb66'},{label:{en:'Residential',zh:'住宅'},color:'#e8b37c'},{label:{en:'Medical',zh:'医疗'},color:'#c82c42'},{label:{en:'Business 1',zh:'工业 B1'},color:'#b8a1bd'},{label:{en:'Park',zh:'公园'},color:'#15974a'}];
  container.querySelector('[data-plm-legend]').innerHTML=(evidence.planning.legend||fallback).map(item=>`<span><i style="background:${item.secondaryColor?`repeating-linear-gradient(135deg,${esc(item.color)} 0 4px,${esc(item.color)} 4px,${esc(item.secondaryColor)} 4px 8px)`:esc(item.color)}"></i>${esc(local(item.label))}</span>`).join('');
 }
 function render(force=false){
  if(!evidence||!alive)return;
  const frame=landFrame(progress);phase=frame.phase;index=manual??frame.index;
  const items=phase?evidence.future:evidence.current;index=Math.max(0,Math.min(items.length-1,index));const item=items[index],metadata=phase?evidence.planning:evidence.satellite;
  const changed=lastPhase!==phase;
  if(changed){
   layers.forEach((layer,i)=>{layer.style.display=i===phase?'':'none';layer.setAttribute('aria-hidden',String(i!==phase));});
   container.dataset.plmPhase=phase?'future':'current';
   svg.setAttribute('aria-label',local(metadata.label));
   container.querySelector('[data-plm-label]').textContent=local(metadata.label);
   topics.innerHTML=items.map((entry,i)=>`<button type="button" data-plm-topic="${i}" aria-pressed="false"><span>${i+1}</span> ${esc(local(entry.short))}</button>`).join('');
   const markers=svg.querySelector('[data-plm-markers]');markers.innerHTML=items.map((entry,i)=>{const [x,y]=landProject(entry.coordinates);return `<g class="plm-marker" data-plm-marker="${i}" role="button" tabindex="0" aria-label="${esc(local(entry.short))}" aria-pressed="false" transform="translate(${x},${y})"><circle class="plm-marker-hit" r="28"/><circle class="plm-marker-ring" r="24"/><circle class="plm-marker-dot" r="17"/><text y="7" text-anchor="middle">${i+1}</text></g>`;}).join('');
   svg.querySelector('[data-plm-buildings]').style.display=phase?'none':'';svg.querySelector('[data-plm-zone]').style.display=phase?'':'none';svg.querySelector('[data-plm-references]').style.display=phase?'none':'';
   container.querySelector('[data-plm-legend]').hidden=!phase;
   const credit=container.querySelector('[data-plm-credit]');credit.innerHTML=metadata.creditUrl?`<a href="${esc(metadata.creditUrl)}" target="_blank" rel="noopener noreferrer">${esc(local(metadata.credit))}</a>`:esc(local(metadata.credit));
   if(metadata.extraCredit)credit.innerHTML+=` · <a href="${esc(metadata.extraCredit.url)}" target="_blank" rel="noopener noreferrer">${esc(metadata.extraCredit.label)}</a>`;
   container.querySelector('[data-plm-note]').textContent=local(metadata.note);
   const logo=metadata.logo,logoLink=container.querySelector('[data-plm-logo-link]');logoLink.hidden=!logo;
   if(logo){const img=container.querySelector('[data-plm-logo]');img.src=typeof logo==='string'?logo:logo.path;img.alt=typeof logo==='object'?local(logo.alt)||'OneMap':'OneMap';logoLink.href=typeof logo==='object'?logo.href||'https://www.onemap.gov.sg/':'https://www.onemap.gov.sg/';}
   lastPhase=phase;showStatus();
  }
  [...topics.querySelectorAll('[data-plm-topic]'),...svg.querySelectorAll('[data-plm-marker]')].forEach(control=>{const i=Number(control.dataset.plmTopic??control.dataset.plmMarker),active=i===index;control.setAttribute('aria-pressed',String(active));control.classList.toggle('is-selected',active);});
  container.querySelector('[data-plm-metric]').textContent=local(item.metric);container.querySelector('[data-plm-caption]').textContent=local(item.caption);
  container.dataset.plmTopic=item.id;container.dataset.plmMode=manual===null?'guided':'manual';
  const signature=`${phase}:${index}`;if(force||changed||signature!==lastExplanation){lastExplanation=signature;onExplain(item,{phase,index});}
 }
 function choose(i){manual=i;render();}
 function click(event){const control=event.target.closest('[data-plm-topic],[data-plm-marker]');if(control&&container.contains(control)){choose(Number(control.dataset.plmTopic??control.dataset.plmMarker));return;}if(event.target.closest('[data-plm-retry]')&&layers[phase])loadImages(layers[phase],phase,true);}
 function key(event){const marker=event.target.closest('[data-plm-marker]');if(!marker||!container.contains(marker))return;let i=Number(marker.dataset.plmMarker),count=(phase?evidence.future:evidence.current).length;if([' ','Enter'].includes(event.key)){event.preventDefault();choose(i);}else if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();i=event.key==='Home'?0:event.key==='End'?count-1:(i+(event.key==='ArrowRight'?1:count-1))%count;svg.querySelector(`[data-plm-marker="${i}"]`).focus();choose(i);}}
 container.addEventListener('click',click);container.addEventListener('keydown',key);
 Promise.all([read('./data/property-land-evidence.json?v=20261108-release1'),read('./assets/ura-space-2025/manifest.json'),read('./data/planning-ura-space.geojson'),read('./data/queensway-buildings.geojson'),read('./assets/queensway-satellite/manifest.json')]).then(([data,plan,zones,buildings,satellite])=>{
  if(!alive)return;evidence=data;const qsc=zones.features.find(feature=>Number(feature.properties.OBJECTID)===Number(data.queenswayZoneId||plan.queenswayZoneId));if(!qsc)throw new Error('Queensway planning boundary missing');
  const references=(data.satellite.relatedPlaces||[]).map(place=>{const [x,y]=landProject(place.coordinates);return `<g class="plm-reference" transform="translate(${x},${y})"><circle r="3"/><text x="8" y="-8">${esc(local(place.label||place.name))}</text></g>`;}).join('');
  svg.innerHTML=`<g class="plm-base" data-plm-layer="0">${imageMarkup(satellite)}</g><g class="plm-base" data-plm-layer="1" style="display:none">${imageMarkup(plan)}</g><g class="plm-building-outline" data-plm-buildings>${buildings.features.map(feature=>`<path d="${path(feature.geometry)}"/>`).join('')}</g><g class="plm-zone-outline" data-plm-zone style="display:none"><path d="${path(qsc.geometry)}"/></g><g data-plm-references>${references}</g><g data-plm-markers></g><g class="plm-scale" transform="translate(28 424)"><path d="M0 -6V0H68V-6"/><text x="0" y="-14">200 m</text></g><text class="plm-north" x="607" y="36" text-anchor="middle">${t('N ↑','北 ↑')}</text>`;
  layers=[...svg.querySelectorAll('[data-plm-layer]')];drawLegend();render(true);layers.forEach((layer,i)=>loadImages(layer,i));
 }).catch(error=>{if(!alive||error.name==='AbortError')return;status.hidden=false;status.textContent=t('Open Sources & notes to view the original maps.','请打开“来源与说明”查看原图。');container.dataset.plmError='true';});
 return {setProgress(next,force=false){const p=clamp(next);if(Math.abs(p-progress)>.00001)manual=null;progress=p;render(force);},destroy(){alive=false;abort.abort();container.removeEventListener('click',click);container.removeEventListener('keydown',key);}};
}
