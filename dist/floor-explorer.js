const points={
1:{'01-01':[778.5,79],'01-02':[810.7,113.3],'01-03':[841,143.5],'01-04':[895.3,262.5],'01-05':[894.3,304.8],'01-06':[895.3,344],'01-07':[895.3,381.4],'01-08':[897.3,421.8],'01-09':[879.1,467.1],'01-10':[850.8,501.3],'01-11':[819.6,525.5],'01-12':[786.3,559.7],'01-14':[671.3,635.2],'01-15':[628,636.2],'01-16':[588.7,636.1],'01-17':[555.4,636.1],'01-18':[510,637.1],'01-19':[463.7,612.8],'01-20':[431.4,578.5],'01-21':[396.2,536.2],'01-22':[363,304.3],'01-27':[676.6,128.2],'01-28':[709.9,98],'01-29':[748.2,157.5],'01-30':[782.5,186.8],'01-31':[756.2,213],'01-32':[723,178.7],'01-33':[806.6,268.5],'01-34':[807.6,312.8],'01-35':[808.6,347.1],'01-36':[808.6,391.4],'01-37':[759.1,455.9],'01-38':[724.8,488.1],'01-39':[661.3,531.4],'01-42':[542.3,533.3],'01-43':[483.9,491.9],'01-44':[448.6,457.6],'01-45':[483,362.9],'01-46':[481,310.5],'01-47':[573.8,207.8],'01-49':[758.2,300.7],'01-50':[713.9,298.6],'01-51':[715.9,331.9],'01-52':[717.8,365.1],'01-53':[759.2,366.2],'01-54':[632.1,462.8],'01-55':[574.6,461.8],'01-58':[696.7,241.2],'01-59':[698.7,419.6],'01-60':[511.2,425.4],'01-23':[485.7,176.4],'01-24':[517.7,146.3],'01-25':[560.7,135.9],'01-48A':[637.4,193.2],'01-48':[631.3,223.9],'01-57':[511.5,242.2],'01-41':[586.9,533],'01-40':[621.3,533],'01-56':[121.2,544.2]},
2:{'02-01':[822,82.9],'02-02':[860.3,122],'02-03':[894.2,156.7],'02-04':[958.7,294.4],'02-05':[960.5,345.3],'02-06':[960.1,393],'02-07':[960.7,432],'02-08':[961.4,480.7],'02-09':[935.4,543.5],'02-10':[900.3,577],'02-11':[873.9,609.4],'02-12':[836.7,644],'02-13':[689.1,717.4],'02-14':[643.9,717.3],'02-15':[597.6,717.2],'02-16':[563.1,717.2],'02-17':[512.5,716],'02-18':[456.2,695.3],'02-19':[414.7,655.1],'02-20':[371,616],'02-21':[289.1,463.1],'02-22':[288.6,429.6],'02-23':[288.1,392.7],'02-24':[287.5,351.6],'02-25':[287,313.7],'02-26':[286.3,270.3],'02-27':[327.7,229.3],'02-28':[376,219.6],'02-29':[439.7,229.5],'02-30':[480.3,205.7],'02-31':[508.9,174.4],'02-32':[566.7,151.7],'02-33':[615.2,151.8],'02-34':[702.3,144.4],'02-35':[742.7,105.5],'02-36':[790.8,154.3],'02-46':[128.7,612.3],'02-47':[514.6,270.8],'02-36C':[757.2,197.6],'02-36A':[839,197.7],'02-36B':[796.4,235.5],'02-41E':[350.2,283.6],'02-41F':[397.6,281.5],'02-41D':[351.7,315.1],'02-41G':[391.6,317.2],'02-41C':[350.8,354.3],'02-41H':[396.7,354.4],'02-41B':[349.4,389.7],'02-41J':[392.6,390.9],'02-41A':[349.9,423.3],'02-41K':[394.1,425.5],'02-41':[351.4,458],'02-41L':[392.3,458],'02-39F':[401,543.6],'02-37M':[839,286.5],'02-37':[883.2,284.4],'02-37L':[837.3,321.2],'02-37A':[883.6,322.3],'02-37K':[837.8,354.7],'02-37B':[884.1,354.8],'02-37J':[838.2,389.4],'02-37C':[883.5,390.5],'02-37H':[838.6,422.9],'02-37D':[881.8,428.4],'02-37G':[835.9,456.4],'02-37E':[882.3,465.2],'02-37F':[869.8,496.6],'02-43':[773.8,318.9],'02-43F':[733.1,337.3],'02-43A':[773.2,354.6],'02-43E':[734.7,374],'02-43B':[772.5,388.2],'02-45C':[467,324.9],'02-45D':[503.8,336.9],'02-45B':[465.3,358.5],'02-45E':[506.4,373.7],'02-45A':[462.5,391],'02-45F':[502.7,412.7],'02-45':[464.1,426.7],'02-40B':[445.8,512.2],'02-40C':[481.8,550.2],'02-40':[452.1,584.8],'02-40A':[491.5,628.2],'02-38C':[789.2,512.7],'02-38B':[751,551.6],'02-38':[824.1,546.3],'02-38A':[785.9,585.3],'02-42':[564.8,211.1],'02-42A':[600.2,211.1],'02-42B':[634.3,211.2],'02-42C':[668.4,211.2],'02-42F':[581.2,249.3],'02-42E':[617.8,249.4],'02-42D':[654.5,250.5],'02-44E':[621,495],'02-44F':[658.4,495.1],'02-44C':[558.6,538.5],'02-44A':[628.8,538.6],'02-44':[663.6,538.7],'02-39G':[527.9,603.8],'02-39H':[562.1,603.9],'02-39J':[594.9,603.9],'02-39K':[627.7,604],'02-39L':[660.5,604],'02-39M':[699.8,604.1],'02-39E':[523.2,643.5],'02-39D':[559.3,643.5],'02-39C':[594.1,643.6],'02-39B':[626.9,643.6],'02-39A':[661,643.6],'02-39':[700.4,643.7],'02-43D':[732.7,412.0],'02-43C':[773.6,425.9]},
3:{'03-02':[967,337.9],'03-03':[965,416.2],'03-04':[964.3,484.3],'03-05':[478.3,715.9],'03-06':[406.7,637.4],'03-07':[649.7,717.4],'03-08':[570.6,716.1],'03-09':[880.7,590.8],'03-10':[817.4,654.2],'03-11':[348.3,352.3],'03-13':[781.7,204.6],'03-14':[830.8,231.9],'03-15':[864.3,288.8],'03-16':[863.7,343.3],'03-19':[855.6,479.5],'03-20':[723.2,623.4],'03-24':[631,622],'03-25':[590.3,621.9],'03-28':[455,535.3],'03-29':[477.4,404.8],'03-30':[478,344.6],'03-31':[529.9,621.8],'03-36':[750.4,249.9],'03-37':[788,328.3],'03-38':[787.1,410.1],'03-40':[705.6,530.2],'03-41':[640.6,544.8],'03-44':[502.6,503.6],'03-45':[713.2,340.6],'03-46':[713.8,382.7],'03-47':[705.7,423.5],'03-48':[672.3,463.2],'03-49':[629.3,472.1],'03-50':[581,470.9],'03-51':[152,619.7],'03-01':[829.2,83.2],'03-32':[481.9,583.1],'03-43':[537.4,543.5],'03-42':[589,543.6],'03-23':[672.7,622.1],'03-39':[754.5,480.4],'03-21':[804.5,525.9],'03-22':[761.2,567.8],'03-04A':[941.7,538.8],'03-12':[706,135.2],'03-35':[698.1,179.5],'03-33':[590.4,229.1],'03-34':[656.7,229.2],'03-27':[545.2,262.2],'03-26':[518.7,296]}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const directoryCategoriesZh={"Barber":"理发","Contractor":"工程服务","F&B":"餐饮","Fashion":"服饰","Gym":"健身","Hobby Store":"兴趣与收藏","Men's Fashion":"男装","Office":"办公室","Optometry":"眼镜与视光","Others":"其他服务","Shirt Services":"衬衫服务","Showroom":"产品展示","Sports":"体育用品","Tailor":"裁缝与改衣","Tech":"科技与维修","Thrift/Vintage":"二手与中古服饰","Wellness":"健康服务","For Rent":"招租记录","Unused/Store Room":"未使用／储藏室记录"};
const directoryNotesZh={"2nd hand laptops":"二手笔记本电脑","Acai":"巴西莓食品","Accessories":"配饰","Anchor Tenant":"主力商户","Australian Goods, Social Enterprise":"澳大利亚商品 · 社会企业","Backpacks, outdoor gear":"背包与户外装备","Basketball":"篮球用品","Bike":"自行车","Bikes":"自行车","Branded Vintage Clothes":"品牌古着服装","Branded Vintage, Social Enterprise":"品牌古着 · 社会企业","Bubble Tea":"珍珠奶茶","Business Management":"企业管理","Cards":"卡牌","Church":"教会","Claw Machine, Gacha":"夹娃娃机与扭蛋","Clothes, Perfumes":"服装与香水","Comics":"漫画","Comics, Figures":"漫画与模型","Comics, Figures, Consignment":"漫画、模型与寄售","Consignment Store":"寄售店","Construction Contractor":"建筑承包","Cosmetics, Amenities, Since 1975":"化妆品与日用品 · 始于 1975 年","Curated Thrift":"精选二手服饰","Curtains, since 1975":"窗帘 · 始于 1975 年","Discount Honsie Branch":"Honsie 折扣分店","Door Gifts":"礼赠品","Door Locks":"门锁","Embroidery and Printing":"刺绣与印刷","Engineers":"工程服务","Engraving Services":"雕刻服务","F1 & Motorsports":"F1 与赛车用品","Figurines":"模型","Figurines, Pop Culture":"模型与流行文化商品","Fish Shop":"水族店","Floorball":"地板球用品","Football":"足球用品","Football, Anchor Tenant":"足球用品 · 主力商户","Golf Company Office":"高尔夫公司办公室","Gym Equipment":"健身器材","Gym, Anchor Tenant":"健身房 · 主力商户","Handmade Leather Workshop, since 2012":"手工皮革工作室 · 始于 2012 年","Hat Retailer":"帽饰零售","Honsie store room":"Honsie 储藏室","Interior Design":"室内设计","Janggut Laksa":"Janggut 叻沙","Japanese Deli Cafe":"日式熟食咖啡馆","Jeweller":"珠宝首饰","Jewellery":"珠宝首饰","Katong Laksa":"加东叻沙","Lamps":"灯具","Large Retailer":"大型零售商","Lash Salon":"美睫店","Law Office":"律师事务所","Leather Goods":"皮革制品","Maid Employment Agency":"家政人员雇佣中介","Managed by INBOX":"由 INBOX 管理","Managed by Inbox, Everlast Retailer":"由 INBOX 管理 · Everlast 零售","Mattress":"床垫","Muay Thai Gym":"泰拳训练馆","Multi-branded Fashion":"多品牌服饰","Outdoor Gear":"户外装备","Outdoor gear":"户外装备","Phone Tech":"手机技术服务","Planting Gifts":"植物礼品","Plus size apparell":"大码服饰","Pottery Painting Studio":"陶艺彩绘工作室","Premium Thrift, Social Enterprise":"精选二手服饰 · 社会企业","Printed Graphic Tees":"图案印花 T 恤","Printing and Embroidery":"印刷与刺绣","Printing, Name cards, Seals":"印刷、名片与印章","Printing, since 1977":"印刷 · 始于 1977 年","Project Space, Gallery":"项目空间与画廊","Queensway":"女皇道","RC Vehicles":"遥控模型车","Racquet Sports":"球拍运动用品","Racquet Sports, since 2003":"球拍运动用品 · 始于 2003 年","Recruitment, HR":"招聘与人力资源","Renovations, ID":"装修与室内设计","Running gear":"跑步装备","Shirt Printing, since 2011":"服装印花 · 始于 2011 年","Shirts":"衬衫","Shoes":"鞋类","Sportswear":"运动服饰","Steel Doors":"钢门","TCM Clinic":"中医诊所","Tattoo Shop":"纹身店","Tennis":"网球用品","Tennis, in Queensway for 20 years":"网球用品 · 在女皇道经营 20 年","Teva & FitFlop Retailer":"Teva 与 FitFlop 零售","Thornton Storage":"Thornton 储藏空间","Thrift Store, Asian Brands, Photobooth":"二手服饰、亚洲品牌与照相亭","Thrift Store, Social Enterprise":"二手服饰 · 社会企业","Trinkets":"小饰品","Trophies, Plaques, Medals":"奖杯、奖牌与纪念牌","Ultra Supplies Tshirt Storage":"Ultra Supplies 的 T 恤储藏空间","Used to be Carlton Trading":"原为 Carlton Trading","Used to be a thrift store":"原为二手服饰店","Vintage Memorabilla":"复古纪念品","Vintage Toys Collection":"复古玩具收藏","Watch Repair":"手表维修","Watches":"手表","Youth ran business, Vietnamese brands":"青年经营 · 越南品牌","phone repair shop w/ Claw Machine, Eight Retailer":"手机维修、夹娃娃机与 Eight 零售","Multi-brand Clothing Shop, since 1958":"多品牌服装店 · 始于 1958 年","Since 1965, branded clothes":"品牌服装 · 始于 1965 年","Shoes, Since 1981":"鞋类 · 始于 1981 年","Shoes, Since 1984":"鞋类 · 始于 1984 年","Shoes, Since 1987":"鞋类 · 始于 1987 年","Since 1974":"始于 1974 年","Since 1983":"始于 1983 年","Since 1984":"始于 1984 年","Since 1985":"始于 1985 年","Since 1987":"始于 1987 年","Since 1992":"始于 1992 年","Since 1993":"始于 1993 年","Since 1995":"始于 1995 年"};
// Translate the directory display while retaining its original source records.
function directoryNote(value,lang){
 const raw=String(value??'').trim();
 if(['Bowling Office?','owned by mahabub????','New'].includes(raw))return '';
 const note=raw.replace(' (OG shop?)','').replace(' (in Queensway since the start?)','');
 return lang==='zh'?(directoryNotesZh[note]??note):note;
}
export function mountFloorExplorer(root,{lang='en'}={}){
 const zh=lang==='zh',t=(a,b)=>zh?b:a,listeners=new AbortController(),{signal}=listeners; let rows=[],dead=false,frame=0,current=0,target=0;
 root.innerHTML='<div class="floor-stage"><div class="floor-heading">'+t('THREE FLOORS · MANY STORIES','三层空间 · 无数故事')+'</div><div class="floor-perspective"><div class="floor-stack">'+[3,2,1].map(n=>'<div class="floor-layer floor-layer-'+n+'" data-floor="'+n+'"><img src="assets/floorplans/floor-'+n+'.svg" alt=""></div>').join('')+'</div></div><div class="floor-singles">'+[3,2,1].map(n=>'<div class="floor-single" inert data-single="'+n+'"><div class="floor-single-label">0'+n+' / '+t(['','FIRST','SECOND','THIRD'][n]+' FLOOR',['','一层','二层','三层'][n])+'</div><div class="floor-single-map"></div><div class="floor-single-caption">'+t('Hover over or select a coloured area','悬停或点选填色区域')+'</div></div>').join('')+'</div><div class="floor-tooltip" hidden role="status"></div></div>';
  const tooltip=root.querySelector('.floor-tooltip');
 document.body.append(tooltip);
 let regionData={},activeFloor=0,photoIndex=new Map(),tipEl=null,hideTimer=0,pinned=false,dismissedEl=null;
 let tipPoint={x:0,y:0};
 const shopName=s=>String(s??'').normalize('NFKC').trim().toLowerCase();
 const isShop=r=>!!shopName(r.name)&&! /^(for rent|unused\/store room)$/i.test(String(r.name).trim())&&! /^(for rent|unused\/store room)$/i.test(String(r.category??'').trim());
 const shopRecords=(n,id)=>rows.filter(r=>Number(r.floor)===n&&r.unit===id&&isShop(r));
 const hasShop=(n,id)=>!!id&&shopRecords(n,id).length>0;
 function photoFor(r){
  const p=photoIndex.get(Number(r.row));
  return p&&Number(p.floor)===Number(r.floor)&&p.unit===r.unit&&shopName(p.name)===shopName(r.name)?p.photo:null;
 }
 function hideTip(){clearTimeout(hideTimer);tooltip.hidden=true;tipEl?.setAttribute('aria-expanded','false');tipEl=null;pinned=false;}
 function delayHide(){clearTimeout(hideTimer);if(!pinned)hideTimer=setTimeout(hideTip,180);}
 function renderRegions(){
  root.querySelectorAll('.floor-single').forEach(panel=>{
   const n=Number(panel.dataset.single),regions=regionData[n]||[];
   panel.querySelector('.floor-single-map').innerHTML='<svg viewBox="0 0 1024 768" role="group" aria-label="'+t('Floor plan with highlighted shop locations','楼层平面与店铺位置')+'"><image href="assets/floorplans/floor-'+n+'.svg" width="1024" height="768"></image>'+regions.map((r,i)=>{
    const available=hasShop(n,r.id);
    return '<path class="unit-region '+(available?'has-info':'empty')+'" d="'+esc(r.d)+'" style="--order:'+((i%30)/32).toFixed(3)+'" data-floor="'+n+'" data-unit="'+esc(r.id||'')+'" '+(available?'tabindex="0" role="button" aria-expanded="false" aria-label="'+esc(r.id)+'"':'aria-hidden="true"')+'></path>';
   }).join('')+'</svg>';
  });
 }
 function positionTip(x,y){
  tipPoint={x,y};
  const r=tooltip.getBoundingClientRect(),pad=16;
  let left=x+18;
  if(left+r.width>innerWidth-pad)left=x-r.width-18;
  tooltip.style.left=Math.max(pad,Math.min(innerWidth-r.width-pad,left))+'px';
  tooltip.style.top=Math.max(pad,Math.min(innerHeight-r.height-pad,y-24))+'px';
 }
 function showTip(el,x,y){
  if(el===dismissedEl)return;
  clearTimeout(hideTimer);
  const id=el.dataset.unit,n=Number(el.dataset.floor),rs=shopRecords(n,id);
  if(!rs.length){hideTip();return;}
  if(tipEl!==el)tipEl?.setAttribute('aria-expanded','false');
  tipEl=el;el.setAttribute('aria-expanded','true');
  tooltip.innerHTML='<strong>'+esc(id)+'</strong>'+(rs.length>1?'<span class="tip-conflict">'+t('Multiple records','多条记录')+'</span>':'')+rs.map((r,i)=>{
   const photo=photoFor(r),note=directoryNote(r.note,lang),category=zh?(directoryCategoriesZh[r.category]??r.category):r.category;
   const photoLabel=photo?.scope==='unit'?r.name+' · #'+r.unit+' · '+t('Unit photograph','铺位原照'):r.name+' · '+t('Business photograph','商家原照');
   const picture=photo?.src?'<figure class="tip-photo"><img src="'+esc(photo.src)+'" alt="'+esc(photoLabel)+'" decoding="async"'+(photo.width&&photo.height?' width="'+Number(photo.width)+'" height="'+Number(photo.height)+'"':'')+'></figure>':'';
   return '<div class="tip-record">'+(rs.length>1?'<small>'+t('Record','记录')+' '+(i+1)+'</small>':'')+picture+'<dl><dt>'+t('Shop name','店名')+'</dt><dd>'+esc(r.name)+'</dd><dt>'+t('Category','类别')+'</dt><dd>'+esc(category??'')+'</dd>'+(photo?'<dt>'+t('Photo','照片')+'</dt><dd>'+t(photo.scope==='unit'?'Unit photograph':'Business photograph',photo.scope==='unit'?'铺位原照':'商家原照')+'</dd>':'')+(note?'<dt>'+t('Notes','备注')+'</dt><dd>'+esc(note)+'</dd>':'')+'</dl></div>';
  }).join('');
  tooltip.hidden=false;tooltip.scrollTop=0;positionTip(x,y);
  tooltip.querySelectorAll('img').forEach(img=>{
   img.addEventListener('load',()=>{if(!tooltip.hidden)positionTip(tipPoint.x,tipPoint.y)},{once:true});
   img.addEventListener('error',()=>{img.closest('figure')?.remove();if(!tooltip.hidden)positionTip(tipPoint.x,tipPoint.y)},{once:true});
  });
 }
 // Mouse hover previews; a click or keyboard selection keeps the record open.
 function pinTip(el,event){
  dismissedEl=null;pinned=true;const box=el.getBoundingClientRect();
  showTip(el,event.detail?event.clientX:box.right,event.detail?event.clientY:box.top);
 }
 root.addEventListener('pointerover',e=>{if(pinned||e.pointerType==='touch')return;const el=e.target.closest('.unit-region.has-info');if(el&&el!==tipEl)showTip(el,e.clientX,e.clientY)},{signal});
 root.addEventListener('pointermove',e=>{if(!pinned&&e.pointerType!=='touch'&&e.target.closest('.unit-region.has-info')&&!tooltip.hidden){clearTimeout(hideTimer);positionTip(e.clientX,e.clientY)}},{signal});
 root.addEventListener('pointerout',e=>{const el=e.target.closest('.unit-region.has-info');if(el&&el===dismissedEl&&!el.contains(e.relatedTarget))dismissedEl=null;if(e.pointerType!=='touch'&&el&&!tooltip.contains(e.relatedTarget))delayHide()},{signal});
 root.addEventListener('click',e=>{const el=e.target.closest('.unit-region.has-info');if(el)pinTip(el,e);},{signal});
 tooltip.addEventListener('pointerenter',()=>clearTimeout(hideTimer),{signal});
 tooltip.addEventListener('pointerleave',delayHide,{signal});
 tooltip.addEventListener('wheel',e=>e.stopPropagation(),{passive:true,signal});
 root.addEventListener('focusin',e=>{const el=e.target.closest('.unit-region.has-info');if(el){if(pinned&&el!==tipEl)pinned=false;const r=el.getBoundingClientRect();showTip(el,r.right,r.top)}},{signal});
 root.addEventListener('focusout',e=>{const el=e.target.closest('.unit-region.has-info');if(el===dismissedEl)dismissedEl=null;if(el&&!tooltip.contains(e.relatedTarget))delayHide()},{signal});
 root.addEventListener('keydown',e=>{const el=e.target.closest('.unit-region.has-info');if(el&&['Enter',' '].includes(e.key)){e.preventDefault();pinTip(el,e);}},{signal});
 document.addEventListener('pointerdown',e=>{if(!tooltip.contains(e.target)&&!e.target.closest?.('.unit-region.has-info'))hideTip();},{signal});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(tipEl)dismissedEl=tipEl;hideTip();}},{capture:true,signal});
 function resizeTip(){if(!tooltip.hidden)positionTip(tipPoint.x,tipPoint.y);}
 window.addEventListener('resize',resizeTip,{signal});
 fetch('data/floor-regions.json?v=20261027-2').then(r=>r.json()).then(d=>{if(!dead){regionData=d.floors;renderRegions()}}).catch(()=>{});
 fetch('data/updated-directory.json?v=20261108-public-team1').then(r=>r.json()).then(data=>{if(!dead){rows=data.rows;renderRegions()}}).catch(()=>{});
 fetch('data/shop-photos.json?v=20261108-release1').then(r=>{if(!r.ok)throw new Error('Photos unavailable');return r.json()}).then(data=>{
  if(!dead){photoIndex=new Map(data.records.map(r=>[Number(r.row),r]));if(tipEl&&!tooltip.hidden)showTip(tipEl,tipPoint.x,tipPoint.y);}
 }).catch(()=>{});
 const clamp01=x=>Math.max(0,Math.min(1,x));
 const smooth=x=>{x=clamp01(x);return x*x*x*(x*(x*6-15)+10)};
 let lastTime=0;
 function paint(){
  const p=current,opening=smooth(p/.14),layout=smooth((p-.12)/.10);
  const elevator=smooth((p-.30)/.19)+smooth((p-.66)/.19);
  const mobile=innerWidth<=700,sideWidth=innerWidth*(mobile?.34:.18);
  const finalGap=Math.max(mobile?110:150,(sideWidth*.62+20)/Math.sin(52*Math.PI/180));
  const pitch=52*opening,gap=12+(finalGap-12)*opening,turn=-10*opening;
  const lift=Math.sin(pitch*Math.PI/180)*gap*(1-elevator)*layout;
  root.style.setProperty('--floor-pitch',pitch.toFixed(3)+'deg');
  root.style.setProperty('--floor-turn',turn.toFixed(3)+'deg');
  root.style.setProperty('--floor-gap',gap.toFixed(2)+'px');
  root.style.setProperty('--floor-lift',lift.toFixed(2)+'px');
  root.style.setProperty('--stack-left',(43-5*layout).toFixed(2)+'%');
  root.style.setProperty('--stack-right',(5+39*layout).toFixed(2)+'%');
  root.style.setProperty('--plan-opacity',layout.toFixed(3));
  root.classList.toggle('is-expanded',layout>.01);
  const candidate=3-Math.round(elevator);
  const next=layout>.95&&Math.abs((3-candidate)-elevator)<.03?candidate:0;
  if(next!==activeFloor){activeFloor=next;dismissedEl=null;hideTip();}
  root.querySelectorAll('.floor-single').forEach(el=>{
   const n=Number(el.dataset.single),index=3-n,distance=index-elevator;
   el.style.transform='translate3d(0,'+(distance*100).toFixed(3)+'%,0)';
   el.style.setProperty('--reveal',String(Math.min(layout,clamp01(1-Math.abs(distance)*1.4))));
   const selected=n===next;el.classList.toggle('is-current',selected);el.inert=!selected;
  });
  root.querySelectorAll('.floor-layer').forEach(el=>{
   const n=Number(el.dataset.floor),distance=Math.abs((3-n)-elevator);
   el.style.setProperty('--layer-light',String(.28+layout*.25+Math.max(0,1-distance)*layout*.4));
   el.classList.toggle('is-current',n===next);
  });
 }
 function tick(now){if(!lastTime)lastTime=now;const dt=Math.min(64,now-lastTime);lastTime=now;current+=(target-current)*(1-Math.exp(-dt/145));paint();if(Math.abs(target-current)>.0004){frame=requestAnimationFrame(tick)}else{current=target;paint();frame=0;lastTime=0;}}
 function setBridge(p){
  if(frame){cancelAnimationFrame(frame);frame=0;lastTime=0;}current=target=1;
  const merge=smooth(p/.58),mobile=innerWidth<=700,sideWidth=innerWidth*(mobile?.34:.18);
  const finalGap=Math.max(mobile?110:150,(sideWidth*.62+20)/Math.sin(52*Math.PI/180));
  root.style.setProperty('--floor-pitch','52deg');root.style.setProperty('--floor-turn','-10deg');
  root.style.setProperty('--floor-gap',(finalGap+(12-finalGap)*merge).toFixed(2)+'px');
  root.style.setProperty('--floor-lift',(-Math.sin(52*Math.PI/180)*finalGap*(1-merge)).toFixed(2)+'px');
  root.style.setProperty('--stack-left',(38+13*merge).toFixed(2)+'%');root.style.setProperty('--stack-right',(44-36*merge).toFixed(2)+'%');
  root.style.setProperty('--bridge-top',(17-5*merge).toFixed(2)+'%');root.style.setProperty('--bridge-bottom',(15+31*merge).toFixed(2)+'%');
  root.style.setProperty('--bridge-plan',(1-smooth(p/.22)).toFixed(3));
  root.style.setProperty('--bridge-stack-opacity',(1-smooth((p-.22)/.35)).toFixed(3));
  root.querySelectorAll('.floor-layer').forEach(el=>{const main=Number(el.dataset.floor)===1,start=main?.93:.53,end=main?.72:.05;el.style.setProperty('--layer-light',String(start+(end-start)*merge));});
  hideTip();
 }
 return {setBridge,setProgress(p,immediate=false){target=clamp01(p);if(immediate||matchMedia('(prefers-reduced-motion: reduce)').matches){current=target;paint()}else if(!frame){lastTime=0;frame=requestAnimationFrame(tick)}},destroy(){dead=true;listeners.abort();tooltip.remove();clearTimeout(hideTimer);window.removeEventListener('resize',resizeTip);if(frame)cancelAnimationFrame(frame);root.innerHTML=''}};
}
