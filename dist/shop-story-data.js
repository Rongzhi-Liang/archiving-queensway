// Curated interview accounts with scene-level sources.
export const shopSources = {
 strata:'https://www1.bca.gov.sg/home-and-building-owners/condo-strata/mcst-strata-management/strata-management-guides/'
};
const pair=(en,zh)=>({en,zh});
export const shopPlaces = [
 {id:'toys',name:'Toybros',floor:2,unit:'02-03',image:'a806b45e2f0d9ea9b646.webp',original:'DSC06619.JPG',
  trade:pair('Toys & collectibles','玩具与收藏'),detail:pair('A specialist shop shaped by collectors.','由收藏者经营的兴趣专门店。'),alt:pair('Toybros, with a person behind shelves of toys and comics.','Toybros 店内，人物身边陈列着玩具与漫画。')},
 {id:'sports',name:'Newlink Sports',floor:2,unit:'02-34',image:'e9fb0cb5d334870d7d7e.webp',original:'DSC06585.JPG',
  trade:pair('Sports goods','体育用品'),detail:pair('Newlink Sports premises listed in the shop directory.','商户目录中的 Newlink Sports 店面。'),alt:pair('Newlink Sports storefront and sporting equipment.','Newlink Sports 门面与体育用品。')},
 {id:'frank',name:'Frank’s Leathersmith',floor:2,unit:'02-41F',image:'0b43b3acd68cf3081fcf.webp',original:'S_Frank.JPG',
  trade:pair('Leatherwork','皮革手艺'),detail:pair('Tools, materials and a working bench occupy a small unit.','工具、材料与工作台，构成一间手艺店。'),alt:pair('Frank at his leatherworking bench with tools and materials.','Frank 在皮革工作台前，身旁放着工具与材料。')},
 {id:'blueprint',name:'Blueprint Principles',floor:2,unit:'02-40',image:'fffcb3812744f6840d10.webp',original:'DSC06592.JPG',
  trade:pair('Vintage clothing · social enterprise','古着服饰 · 社会企业'),detail:pair('The directory also lists a unit at 02-20.','目录另列 02-20 铺位。'),alt:pair('Blueprint Principles’s shop interior, counter and social-enterprise sign.','Blueprint Principles 店内的柜台、服饰与社会企业说明牌。')},
 {id:'comics',name:'Kalibak’s Kave',floor:2,unit:'02-10',image:'c68821287526e43b483a.webp',original:'DSC06540.JPG',
  trade:pair('Comics & collectibles','漫画与收藏'),detail:pair('A comics specialist on the same floor as Toybros.','与 Toybros 同处二楼的漫画专门店。'),alt:pair('Kalibak’s Kave, with a person and shelves of comics.','Kalibak’s Kave 店内的人物与漫画货架。')},
 {id:'dirty',name:'Dirty Laundry',floor:3,unit:'03-46',image:'c56808bebafedee79066.webp',original:'DSC06498.JPG',
  trade:pair('Vintage clothing','古着服饰'),detail:pair('A personally arranged interior on Level 3.','三楼的一间古着店，以个人想法布置室内。'),alt:pair('Dirty Laundry’s operator among clothing rails, patterned walls and accessories.','Dirty Laundry 店内的经营者、衣架、花纹墙纸与饰品。')}
];
export const shopChapters = [
 {id:'shop-work',label:pair('Room to run a shop','经营的空间'),
  title:pair('A small shop.<br><em>Room to make it yours.</em>','一间小店，<br><em>自己的经营方式。</em>'),
  body:pair('In this strata mall, units are separately owned; a shopkeeper may own or rent the premises. In her recorded interview, Dirty Laundry’s Karolina values choosing the interior and her opening hours. These everyday choices help her try out a business on her own terms.',
   '在这座分层产权商场里，铺位分别持有；经营者可以自有铺位，也可以租店做生意。在录音采访中，Dirty Laundry 的 Karolina 谈到自己看重布置店面和安排营业时间的自主空间。这些日常选择，让她有空间按自己的方式尝试经营。'),
  note:pair('Karolina’s recorded interviews describe her opening hours, wallpaper and DIY shop decoration. The first recording discusses opening times; the second discusses decoration. BCA’s guide explains the distinct responsibilities of owners, operators and the management corporation.',
   'Karolina 的录音采访谈到营业时间、墙纸和自己动手布置店面。第一段录音涉及开门时间，第二段涉及店内装饰。BCA 指南说明业主、经营者和管理机构各自的职责。')},
 {id:'shop-mix',label:pair('Different ways to trade','商户的差异'),
  title:pair('The same floor.<br><em>Different livelihoods.</em>','同一层楼，<br><em>不同的谋生方式。</em>'),
  body:pair('Toybros deals in collectibles; Newlink Sports in sports goods; Frank works with leather; Blueprint Principles sells vintage clothing. The directory places these different trades on the same floor. Each trade brings its own skills, stock and ways of serving people. Select a marked shop to connect its trade, photograph and place.',
   'Toybros 经营收藏品，Newlink Sports 销售体育用品，Frank 做皮革手艺，Blueprint Principles 售卖古着。目录把这些不同的行业放在同一层楼上。每种行业都有自己的技能、商品与服务方式。点选图中店铺，把行业、原照与位置对应起来。'),
  note:pair('Shop locations follow the shop directory, consulted on 8 November 2026. The floor plans identify the featured units. The map uses Frank’s directory unit 02-41F, Blueprint Principles’s 02-40, Toybros’ 02-03 and Newlink Sports’ 02-34. Blueprint Principles also has a directory entry at 02-20 and Newlink at 02-42C. Photographs show each featured business.',
   '店铺位置依据商户目录（查阅日期：2026 年 11 月 8 日），并在楼层图上标出。地图采用目录中的 Frank 02-41F、Blueprint Principles 02-40、Toybros 02-03 与 Newlink Sports 02-34；目录另列 Blueprint Principles 02-20 及 Newlink 02-42C。照片呈现各家店铺的实际空间。')},
 {id:'shop-network',label:pair('Working relationships','经营中的关系'),
  title:pair('Shared interests.<br><em>A business together.</em>','因共同爱好，<br><em>合伙开一家店。</em>'),
  body:pair('Kelvin and two collector friends opened Toybros together. He also describes working with Stephen from Kalibak’s Kave to organise a flea market in a previous shop space. Shared interests become partnerships, while relationships with neighbouring businesses create places to trade and meet.',
   'Kelvin 与两位收藏爱好者朋友合伙开了 Toybros。他还谈到，与 Kalibak’s Kave 的 Stephen 利用原有店面组织跳蚤市场。共同爱好发展成经营伙伴，与周边商户的联系，又为交易与相聚创造了空间。'),
  note:pair('Kelvin’s recorded interview describes three collector friends opening a physical toy shop, and working with Stephen to organise a flea market in a previous shop space. His account of customers talking and meeting is paraphrased. The diagram follows collector partners, a shared shop and collaboration with a neighbouring business.',
   'Kelvin 的录音采访提到三位收藏者朋友开设实体玩具店，以及与 Stephen 利用原有店面组织跳蚤市场。关于顾客聊天与相聚的内容采用转述；图示连起收藏者合伙、共同开店与邻店合作。')},
 {id:'shop-stay',label:pair('Making a move work','搬迁后的经营'),
  title:pair('Move the stock.<br><em>Reconnect the business.</em>','搬得走商品，<br><em>怎样接续生意？</em>'),
  body:pair('Blueprint Principles’s account adds a layer to the relocation story: Pamela describes clothing donated by friends, social-enterprise work and conversations in the shop. A new unit has to support those activities too. Moving stock is only one task; finding workable costs, setting up a shop and reconnecting its everyday relationships are the questions these accounts leave us.',
   'Blueprint Principles 的采访，为前面的搬迁故事补上一层：Pamela 提到朋友捐赠衣物、社会企业的经营，以及店内日常的交谈。新的铺位也要能承接这些活动。搬运商品只是其中一步；成本能否承担、店面如何重新布置、经营联系怎样接续，才是这些经历留下的实际问题。'),
  note:pair('Pamela’s recorded interview describes the move from Peace Centre, donations from friends, Blueprint Principles’s social-enterprise purpose and conversations with customers. The photograph shows Blueprint Principles at #02-40, as listed in the shop directory. The three questions translate these activities into practical considerations for continuing a business after a move.',
   'Pamela 的录音采访记录了从 Peace Centre 搬迁及社会企业的经营目的，内容包括朋友捐赠衣物、Blueprint Principles 的社会企业目标，以及与顾客的交谈。照片呈现商户目录中位于 #02-40 的 Blueprint Principles。三个问题将这些日常活动，转化为搬迁后接续经营的实际考量。')}
];
export const ishakReading = {
 title:pair('A shop closes.<br><em>The work continues.</em>','一家店结束，<br><em>工作仍要继续。</em>'),
 body:pair('Ishak began working in a Queensway sports shop in 2011. When that business closed because of business difficulties, he found work in the same mall and joined Newlink Sports in 2018. His perspective is that of an employee. His account shows continuity through a change of employer: a business can end while a person’s experience and working life remain connected to the place.',
  'Ishak 于 2011 年开始在女皇道的一家体育用品店工作。那家店因经营困难关闭后，他在同一商场找到新工作，于 2018 年转到 Newlink Sports。他从员工的角度，经历了这次工作转换。他的经历让我们看到另一种延续：一家店结束了，人的经验与工作仍可能留在这个地方。'),
 note:pair('Ishak’s employment sequence follows his recorded interview: he started working at Queensway in 2011 and joined his current workplace in 2018. The photograph shows Newlink Sports at #02-34, as listed in the shop directory. This section follows his working life; his account of customer relationships continues in Visitors & Customers.',
   'Ishak 的就业顺序依据录音采访：2011 年开始在女皇道工作，2018 年转到现在的工作单位。照片呈现商户目录中位于 #02-34 的 Newlink Sports。本节展开他的工作经历；与顾客的联系继续在“顾客与访客”中呈现。')
};
