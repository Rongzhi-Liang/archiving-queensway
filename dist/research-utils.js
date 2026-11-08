export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cache=new Map();
export function readData(file){if(!cache.has(file))cache.set(file,fetch(new URL(`./data/${file}`,import.meta.url)).then(r=>{if(!r.ok)throw new Error(`${file}: ${r.status}`);return r.json();}).catch(e=>{cache.delete(file);throw e;}));return cache.get(file);}
export const pick=(value,lang)=>typeof value==='object'&&value!==null?(value[lang]??value.en??''):value??'';
export function sourceItems(data){return Array.isArray(data)?data:data.sources??[];}
export function sourcesMarkup(ids,sources,lang='en'){
 const zh=lang==='zh';return `<details class="ev-sources"><summary>${zh?'参考来源':'References'} <span>${ids.join(' · ')}</span></summary><ul>${ids.map(id=>{const s=sources.find(x=>(x.id??x.source_id)===id);if(!s)return `<li>${esc(id)}</li>`;const date=s.date??s.publication_date??'';return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><small>${esc(s.publisher)}${date?' · '+esc(date):''}</small></li>`;}).join('')}</ul></details>`;
}
export const colour={mixed:'#d68d52',commercial:'#aa5148',residential:'#d7b565',park:'#777777',road:'#d2d2d2',water:'#494949',other:'#a5a5a5'};
export function landGroup(value){const v=(value??'').toUpperCase();return v==='COMMERCIAL & RESIDENTIAL'?'mixed':v==='COMMERCIAL'?'commercial':v.includes('RESIDENTIAL')?'residential':v==='PARK'||v==='OPEN SPACE'?'park':v==='ROAD'?'road':v==='WATERBODY'?'water':'other';}
export const landNames={'COMMERCIAL & RESIDENTIAL':'商业与住宅','COMMERCIAL':'商业','RESIDENTIAL':'住宅','RESIDENTIAL WITH COMMERCIAL AT 1ST STOREY':'首层商业住宅','BUSINESS 1':'Business 1（B1）','CIVIC & COMMUNITY INSTITUTION':'公民与社区设施','EDUCATIONAL INSTITUTION':'教育设施','HEALTH & MEDICAL CARE':'医疗设施','PLACE OF WORSHIP':'宗教场所','HOTEL':'酒店','PARK':'公园','OPEN SPACE':'开放空间','TRANSPORT FACILITIES':'交通设施','ROAD':'道路','WATERBODY':'水体','UTILITY':'公用设施','RESERVE SITE':'储备用地','MASS RAPID TRANSIT':'地铁设施','BUSINESS PARK':'商业园','BUSINESS PARK - WHITE':'商业园—白色用途','PORT / AIRPORT':'港口／机场','SPECIAL USE':'特殊用途','SPORTS & RECREATION':'体育与休闲','WHITE':'白色用途'};
export function landLabel(value,lang){return lang==='zh'?(landNames[value]??value):String(value??'').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());}
export function listingGroup(row){return row.comparisonGroup??'mall_shop';}
export function filterListings(records,offer,group){return records.filter(r=>r.offer===offer&&(group==='retail'?['mall_shop','food_beverage'].includes(listingGroup(r)):listingGroup(r)===group));}
