import * as ML from './vendor/maplibre-gl.mjs';
import {readData} from './research-utils.js?v=20261020-revision3';
ML.setWorkerUrl(new URL('./vendor/maplibre-gl-worker.mjs',import.meta.url).href);
const Q=[103.8033972877883,1.287595189398704];
// Verified independent OpenMapTiles features: mall and full-height tower.
// Spatial containment also matches aggregated multi-building features during
// tile changes, so select only these two single-building IDs (map-sources.json).
const QSC_VOLUME_IDS=[419139302,5910301482];
const QSC_OVERLAPPING_AGGREGATE=1724817610;
const poses={
 city:{center:Q,zoom:12.6,pitch:36,bearing:-25},
 corner:{center:Q,zoom:16.2,pitch:57,bearing:-32},
 site:{center:Q,zoom:18.15,pitch:62,bearing:28},
 developer:{center:Q,zoom:17.45,pitch:66,bearing:-32},
 people:{center:Q,zoom:18.1,pitch:0,bearing:0},
 visitor:{center:[103.8039,1.28695],zoom:16.85,pitch:37,bearing:20},
 shared:{center:Q,zoom:17.4,pitch:48,bearing:-12},
 wishes:{center:Q,zoom:15.65,pitch:55,bearing:5}
};

// Use neutral basemap colors so the narrative overlays remain distinct.
function neutralizeBasemap(map){
 for(const layer of map.getStyle().layers){
  const id=layer.id,paint=layer.paint||{};
  const set=(property,value)=>map.setPaintProperty(id,property,value);
  if(layer.type==='background')set('background-color','#101010');
  if(layer.type==='fill'){
   set('fill-color',/water/.test(id)?'#1c1c1c':/wood|park/.test(id)?'#202020':/building/.test(id)?'#151515':'#141414');
   if('fill-outline-color' in paint)set('fill-outline-color','#373737');
   if('fill-pattern' in paint)set('fill-pattern',null);
  }
  if(layer.type==='line'){
   set('line-color',/dashline|inner/.test(id)?'#111111':/casing/.test(id)?'#363636':'#303030');
   if('line-pattern' in paint)set('line-pattern',null);
  }
  if(layer.type==='symbol'){
   set('text-color','#7b7b7b');set('text-halo-color','#101010');
   set('icon-color','#7b7b7b');set('icon-halo-color','#101010');
   // Non-SDF sprite icons cannot be recolored, so retain text labels without them.
   if(layer.layout?.['icon-image'])set('icon-opacity',0);
  }
  if(layer.type==='fill-extrusion')set('fill-extrusion-color','#707070');
  if(layer.type==='circle'){set('circle-color','#7b7b7b');set('circle-stroke-color','#101010');}
  if(layer.type==='raster')set('raster-saturation',-1);
 }
 map.setLight({anchor:'viewport',color:'#ffffff',intensity:.42,position:[1.15,210,35]});
}

/** Update the geographic view from the active narrative chapter. */
export function createGeoStage(container,{compact=false,lang='en',onReady=()=>{}}={}){
 let current='city',alive=true,ready=false,map,marker;
 const status=document.createElement('div');status.className='geo-loading';status.textContent=lang==='zh'?'正在展开地图…':'Unfolding the map…';container.append(status);
 const canvas=document.createElement('div');canvas.className='geo-canvas';container.prepend(canvas);
 const fallback=document.createElement('div');fallback.className='geo-fallback';container.prepend(fallback);
 const planningCaption=document.createElement('div');planningCaption.className='geo-planning-caption';
 Object.assign(planningCaption.style,{position:'absolute',right:'16px',top:compact?'12px':'100px',maxWidth:compact?'220px':'320px',padding:'6px 9px',background:'#191919da',color:'#e8c5a3',fontSize:compact?'8px':'10px',lineHeight:'1.5',zIndex:'3',pointerEvents:'none',display:'none'});
 container.append(planningCaption);
 function labelPlanning(){planningCaption.textContent=lang==='zh'?'MP2025 规划分区':'MP2025 planning zone';planningCaption.title=lang==='zh'?'商业与住宅 · 容积率：—':'Commercial & Residential · GPR: —';}
 labelPlanning();
 fetch('./data/nearby-osm-buildings.geojson').then(r=>r.json()).then(data=>{
  if(!alive)return;const project=c=>[(c[0]-103.8034)*180000+500,400-(c[1]-1.2876)*180000];
  const polygons=data.features.filter(f=>f.geometry.type==='Polygon').map(f=>`<polygon points="${f.geometry.coordinates[0].map(c=>project(c).join(',')).join(' ')}"/>`).join('');
  fallback.innerHTML=`<svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" aria-label="OpenStreetMap building footprint diagram"><g fill="#303030" stroke="#777777" stroke-width=".8">${polygons}</g><circle cx="500" cy="400" r="35" fill="none" stroke="#efbb6b" stroke-width="2"/><circle cx="500" cy="400" r="5" fill="#efbb6b"/></svg>`;
 }).catch(()=>{});
 const footprint=fetch('./data/queensway-buildings.geojson').then(r=>r.json());
 const adjacentVolumes=readData('queensway-adjacent-volumes.geojson');
 const planning=readData('planning-queensway.geojson').catch(e=>{console.warn('Planning overlay unavailable:',e.message);return null;});
 try{
  map=new ML.Map({container:canvas,style:'https://tiles.openfreemap.org/styles/dark',...poses.city,attributionControl:false,interactive:!compact,canvasContextAttributes:{antialias:true},fadeDuration:350});
  map.scrollZoom.disable();map.dragPan.disable();map.dragRotate.disable();map.touchZoomRotate.disable();map.doubleClickZoom.disable();map.keyboard.disable();
  map.addControl(new ML.AttributionControl({compact:true,customAttribution:'<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener">Locations: SLA OneMap</a> · <a href="https://www.onemap.gov.sg/legal/opendatalicence.html" target="_blank" rel="noopener">Open Data Licence</a> · <a href="https://data.gov.sg/datasets/d_a8c3546b26712e35021f3a681d0353ae/view" target="_blank" rel="noopener">Planning: URA MP2025</a>'}),'bottom-right');
  // Install the story layers once the style is ready, without waiting for every
  // initial city-view tile and label to finish downloading before flying closer.
  map.once('style.load',async()=>{
   if(!alive)return;
   try{
    neutralizeBasemap(map);
    const [data,adjacent]=await Promise.all([footprint,adjacentVolumes]);if(!alive)return;
    map.addSource('qsc-footprints',{type:'geojson',data});
    map.addSource('qsc-adjacent-volumes',{type:'geojson',data:adjacent,tolerance:0});
    map.addLayer({id:'qsc-glow',source:'qsc-footprints',type:'line',minzoom:14,paint:{'line-color':'#efbb6b','line-width':18,'line-opacity':.12,'line-blur':12}});
    map.addLayer({id:'qsc-fill',source:'qsc-footprints',type:'fill',minzoom:14,paint:{'fill-color':'#eebc73','fill-opacity':['interpolate',['linear'],['zoom'],14,.28,16,.06]}});
    map.addLayer({id:'qsc-outline',source:'qsc-footprints',type:'line',minzoom:14,paint:{'line-color':'#efc47e','line-width':1.2,'line-opacity':['interpolate',['linear'],['zoom'],14,1,16,.45]}});
    const zoning=await planning;if(!alive)return;
    if(zoning){
     map.addSource('qsc-planning-zone',{type:'geojson',data:zoning});
     map.addLayer({id:'qsc-planning-fill',source:'qsc-planning-zone',type:'fill',minzoom:14,layout:{visibility:'none'},paint:{'fill-color':'#c8936b','fill-opacity':.38}});
     map.addLayer({id:'qsc-planning-outline',source:'qsc-planning-zone',type:'line',minzoom:14,layout:{visibility:'none'},paint:{'line-color':'#f1c494','line-width':3,'line-opacity':1}});
    }
    // Draw the volume after ground overlays: streets and flat footprints must
    // stay at ground level instead of painting across the facades and roofs.
    const volumePaint={'fill-extrusion-height':['coalesce',['get','render_height'],0],'fill-extrusion-base':['coalesce',['get','render_min_height'],0]};
    map.addLayer({id:'qsc-city-buildings',type:'fill-extrusion',source:'openmaptiles','source-layer':'building',minzoom:15,filter:['all',['!=',['get','hide_3d'],true],['!',['in',['id'],['literal',[...QSC_VOLUME_IDS,QSC_OVERLAPPING_AGGREGATE]]]]],paint:{...volumePaint,'fill-extrusion-color':'#707070','fill-extrusion-opacity':.88}});
    // The provider's 12-part aggregate includes a coincident lower tower.
    // Restore its 11 other polygons verbatim and omit only the duplicate tower.
    map.addLayer({id:'qsc-adjacent-buildings',type:'fill-extrusion',source:'qsc-adjacent-volumes',minzoom:15,paint:{...volumePaint,'fill-extrusion-color':'#707070','fill-extrusion-opacity':.88}});
    map.addLayer({id:'qsc-highlight-buildings',type:'fill-extrusion',source:'openmaptiles','source-layer':'building',minzoom:15,filter:['all',['!=',['get','hide_3d'],true],['in',['id'],['literal',QSC_VOLUME_IDS]]],paint:{...volumePaint,'fill-extrusion-color':'#efbd74','fill-extrusion-opacity':.98}});
    const mark=document.createElement('div');mark.className='geo-place-marker';mark.innerHTML='<span class="geo-beacon"></span><span class="geo-place-label">QUEENSWAY<span>SHOPPING CENTRE</span></span>';marker=new ML.Marker({element:mark,anchor:'center'}).setLngLat(Q).addTo(map);
    ready=true;status.remove();container.classList.add('geo-ready');setView(current,true);onReady(true);
   }catch(e){status.textContent=lang==='zh'?'建筑轮廓视图':'Building footprint view';console.warn('Map layer unavailable:',e.message);onReady(false);}
  });
  map.on('error',e=>{if(!ready&&e.error?.message?.includes('WebGL')){status.textContent=lang==='zh'?'建筑轮廓视图':'Building footprint view';onReady(false);}});
 }catch{status.textContent=lang==='zh'?'建筑轮廓视图':'Building footprint view';onReady(false);}
 function setView(name,instant=false){current=poses[name]?name:'shared';if(!ready||!alive)return;
  const pose={...poses[current]};const narrow=container.clientWidth<700;
  let padding=compact?{left:10,right:10,top:10,bottom:10}:narrow?{left:0,right:0,top:0,bottom:innerHeight*.27}:{left:container.clientWidth*.34,right:0,top:0,bottom:0};
  if(compact)pose.zoom-=.25;
  map[instant||matchMedia('(prefers-reduced-motion: reduce)').matches?'jumpTo':'flyTo']({...pose,padding,duration:1900,essential:false});
  const showPlanning=current==='developer'&&!!map.getLayer('qsc-planning-fill');
  for(const id of ['qsc-planning-fill','qsc-planning-outline'])if(map.getLayer(id))map.setLayoutProperty(id,'visibility',showPlanning?'visible':'none');
  for(const id of ['qsc-glow','qsc-fill','qsc-outline'])if(map.getLayer(id))map.setLayoutProperty(id,'visibility',showPlanning?'none':'visible');
  planningCaption.style.display=showPlanning?'block':'none';
  marker.getElement().classList.toggle('geo-place-small',compact||pose.zoom>17.8);marker.getElement().classList.toggle('geo-place-muted',current==='wishes');
 }
 const resize=new ResizeObserver(()=>{map?.resize();if(ready)setView(current,true);});resize.observe(container);
 return {setView,setFree(enable){if(!map||compact)return;for(const k of ['dragPan','dragRotate','touchZoomRotate','keyboard'])map[k][enable?'enable':'disable']();enable?map.scrollZoom.enable():map.scrollZoom.disable();},setLanguage(value){lang=value;labelPlanning();},destroy(){alive=false;resize.disconnect();map?.remove();container.replaceChildren();},get ready(){return ready;}};
}
