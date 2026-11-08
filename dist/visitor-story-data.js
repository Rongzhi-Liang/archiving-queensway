// Customer activity from published reporting and the team's attributed interview.
export const visitorSources = {
 reporting:'https://www.channelnewsasia.com/cna-insider/big-read/strata-titled-malls-shopping-retail-business-survival-dying-out-5875511'
};
const text=(lang,en,zh)=>lang==='zh'?zh:en;
const link=(url,label)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;

function sourceNotes(lang,kind){
 const t=(en,zh)=>text(lang,en,zh);
 const photographs={
  activities:t('Queensway Tutu Kueh. Photo: Archiving Queensway.','Queensway Tutu Kueh。摄影：Archiving Queensway。'),
  discovery:t('Honsie Ponsie. Photo: Archiving Queensway.','Honsie Ponsie。摄影：Archiving Queensway。'),
  ishak:t('Newlink Sports. Photo: Archiving Queensway.','Newlink Sports。摄影：Archiving Queensway。')
 };
 const photograph=`<p>${photographs[kind]}</p>`;
 if(kind==='activities'||kind==='discovery')return `<p>${t('Reporting: Tang Jia Wen, CNA, 23 January 2026.','报道：Tang Jia Wen，CNA，2026 年 1 月 23 日。')} ${link(visitorSources.reporting,t('Read the report','阅读原报道'))}</p>`+photograph;
 return `<p>${t('Paraphrased from the recorded interview with Ishak at Newlink Sports: 04:00–05:28, covering prices, regular customers, contact details and product reservations. Ishak describes his experience as an employee.','转述自 Newlink Sports 员工 Ishak 的录音采访，04:00–05:28，内容包括价格、熟客、交换联系方式与预留商品。Ishak 从员工角度分享自己的经历。')}</p>`+photograph;
}

export function visitorLabels(lang='en'){
 const t=(en,zh)=>text(lang,en,zh);
 return {
  'visitor-route':t('Reasons to visit','为何而来'),
  'visitor-discovery':t('Finding something else','顺路的发现'),
  'visitor-return':t('A familiar connection','熟悉的联系')
 };
}

export function visitorReadings(lang='en'){
 const t=(en,zh)=>text(lang,en,zh);
 return {
  'visitor-route':[
   {key:'activities',title:t('Something to find.<br><em>A reason to come.</em>','寻找所需，<br><em>也寻找喜欢。</em>'),
    body:t('CNA’s January 2026 visit found parents shopping for sports equipment with their children, teenagers browsing secondhand clothes and a queue for tutu kueh. Different purposes bring different generations into the same mall.',
     'CNA 在 2026 年 1 月的报道中记录下这些场景：家长带孩子选购运动装备，穿校服的青少年逛旧衣店，嘟嘟糕摊位前有人排队。各自想找的东西，把不同年龄的顾客带到同一座商场。'),notes:sourceNotes(lang,'activities')}
  ],
  'visitor-discovery':[
   {key:'discovery',title:t('Come for one thing.<br><em>Discover another.</em>','为一件事而来，<br><em>又多逛了一家。</em>'),
    body:t('Honsie Ponsie owner Hon Liang Lung told CNA that food and overlapping interests bring shoppers across different businesses. Some discover his shop while visiting for something else. One stop can lead to another.',
     'Honsie Ponsie 店主 Hon Liang Lung 向 CNA 提到，食物与相互重叠的兴趣，让顾客在不同店铺之间流动。有些人原本为了别的事来到商场，途中发现了他的旧衣店。一站，也能带出下一站。'),notes:sourceNotes(lang,'discovery')}
  ],
  'visitor-return':[
   {key:'contact',person:'ishak',title:t('Before the journey,<br><em>someone to ask.</em>','出发之前，<br><em>先问熟悉的人。</em>'),
    body:t('At Newlink Sports, exchanging numbers extends the shop beyond the counter. Employee Ishak explains that regulars can message about a particular model or size. Staff set items aside, then customers come in to try them and make a purchase. The contact begins before the journey: a customer can find out what is available and arrange to see it.',
     '在 Newlink Sports，交换号码让店里的交流延续到店外。员工 Ishak 说，熟客会发消息询问某个型号或尺码；店员把商品留好，顾客再来试用、购买。联系从出发之前便已开始：先问清楚想找的东西，再安排到店看看。'),notes:sourceNotes(lang,'ishak')},
   {key:'service',person:'ishak',title:t('A purchase today.<br><em>A familiar face next time.</em>','今天买到所需，<br><em>下次找到熟人。</em>'),
    body:t('Ishak describes customers travelling from Tampines and Pasir Ris, drawn by the chance to discuss prices and find good deals. He speaks of regulars becoming acquaintances and friends. The next visit builds on an earlier conversation: customers know what they can ask for and whom to contact. A practical shopping need becomes a continuing relationship.',
     'Ishak 谈到，有顾客从淡滨尼、白沙前来，看重这里商量价格、寻找优惠的机会。他也说，熟客渐渐成为相识的人和朋友。下一次到访，接续着上一次的交流：顾客知道可以提出什么需要，也知道该联系谁。一次次具体的购物需要，逐渐连成持续的关系。'),notes:sourceNotes(lang,'ishak')}
  ]
 };
}

export function visitorPhotos(lang='en'){
 const t=(en,zh)=>text(lang,en,zh);
 return {
  activities:{src:'assets/shop-photos/abd816bf1ac20848b246.webp',alt:t('Queensway Tutu Kueh counter with people beside it and clothing shops nearby.','Queensway Tutu Kueh 摊位前有人停留，周围是服装店铺。'),caption:t('A pause between shops.','逛店之间，停下来吃一口。'),credit:t('Queensway Tutu Kueh · Photo: Archiving Queensway','Queensway Tutu Kueh · 摄影：Archiving Queensway')},
  discovery:{src:'assets/shop-photos/65566f35d2b37490ae59.webp',alt:t('Clothing rails and records on the wall inside Honsie Ponsie.','Honsie Ponsie 店内的衣架和墙上的唱片。'),caption:t('Another shop to explore.','再走进一家店。'),credit:t('Honsie Ponsie · Photo: Archiving Queensway','Honsie Ponsie · 摄影：Archiving Queensway')},
  ishak:{src:'assets/shop-photos/e612ad00fb27cfe225c3.webp',alt:t('Sporting goods and the interior at Newlink Sports.','Newlink Sports 店内的体育用品与经营环境。'),caption:t('Newlink Sports','Newlink Sports'),credit:t('Photo: Archiving Queensway','摄影：Archiving Queensway')}
 };
}
