// The historical Queensway attempt, explained without implying a current vote.
import { esc } from './narrative-system.js?v=20261108-public-team1';

const source={
 rules:'https://www.stratatb.gov.sg/general-proceedings/application/applicant/matters-under-ltsa/',
 procedure:'https://www.stratatb.gov.sg/general-proceedings/hearing/ltsa/',
 attempt:'https://www.channelnewsasia.com/singapore/queensway-shopping-centre-en-bloc-attempt-faces-challenge-shop-owners-5710161',
 outcome:'https://www.channelnewsasia.com/singapore/queensway-shopping-centres-en-bloc-bid-falls-through-some-shop-owners-rejoice-5694191'
};
const link=(url,label)=>`<p><a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a></p>`;

export function choiceReadings(lang='en'){
 const t=(en,zh)=>lang==='zh'?zh:en;
 return [
  {
   title:t('Two measures.<br><em>One shared threshold.</em>','两项比例，<br><em>共同达到门槛。</em>'),
   body:t('For the 2019 attempt, consenting owners had to hold at least 80% of the total share value and 80% of the total strata area. Share value gives each unit a weight; strata area measures its registered space. Calculate the two proportions separately, then check that the same consenting owners meet both thresholds.','2019 年的整售尝试要求同意业主持有至少 80% 的总份额值，以及至少 80% 的总分层面积。份额值赋予每个单位相应权重；分层面积衡量登记空间。两项比例分别计算，再检验同一批同意业主是否同时达到门槛。'),
   notes:`<h3>${t('Two calculations','两项计算')}</h3><p>${t('Divide consenting units’ share values by all units’ share values. Separately, divide their registered strata area by the total strata area. An owner with several units contributes the combined shares and areas of those units.','将同意单位的份额值之和除以全部单位的总份额值；另将这些单位的分层面积之和除以总分层面积。持有多个单位的业主，按其单位的份额值与面积合计计算。')}</p><p>${t('Both measures use the same set of consenting units.','两项计算采用同一批同意单位。')}</p>${link(source.rules,t('STB · consent requirements','分层地契局 · 同意要求'))}${link(source.attempt,t('CNA / TODAY · 1 May 2019','CNA／TODAY · 2019 年 5 月 1 日'))}`
  },
  {
   title:t('From consent.<br><em>To a completed sale.</em>','从取得同意，<br><em>到完成出售。</em>'),
   body:t('A majority-consent sale moves through three stages: secure the required agreement, find a buyer, then obtain a sale order. Owners can raise objections during the application process. The review considers the sale price, the distribution of proceeds and the relationship between buyers and owners. Together, these steps turn a shared intention into a binding transaction.','多数同意的整售经过三个阶段：征得所需同意、找到买家，再取得整售令。业主可在申请过程中提出异议；审查会考虑成交价、售款分配方式及买方与业主的关系。这些步骤将共同意向转化为对全体业主有约束力的交易。'),
   notes:`<h3>${t('The process','程序与审查')}</h3><p>${t('The sale committee collects signatures to the collective sale agreement, markets the property by public tender and agrees a sale with a buyer. The majority owners then apply for a sale order. STB mediates objections; cases with continuing objections can proceed to the High Court after a Stop Order.','整售委员会征集集体出售协议签名，通过公开招标寻找买家，并订立买卖协议。多数业主随后申请整售令。STB 调解异议；仍有异议的案件可在终止令发出后转向高等法院。')}</p>${link(source.procedure,t('STB · sale-order process','分层地契局 · 整售令程序'))}<h3>${t('Queensway’s 2019 attempt','女皇道的 2019 年尝试')}</h3><p>${t('The attempt ended during the consent stage. CNA / TODAY reported on 26 November 2019 that tenants had been informed in October. The marketing agent described opposition representing more than 20% of share value.','尝试止于征集同意阶段。CNA／TODAY 于 2019 年 11 月 26 日报道，租户已在 10 月获知结果；营销代理表示，反对者持有超过 20% 的份额值。')}</p>${link(source.outcome,t('CNA / TODAY · 26 November 2019','CNA／TODAY · 2019 年 11 月 26 日'))}`
  },
  {
   title:t('One decision.<br><em>Different futures.</em>','同一个决定，<br><em>不同的未来。</em>'),
   body:t('A sale can release capital or support retirement. Resident owners weigh the cost of a replacement home; owners running shops weigh their premises and customer relationships. Tenants plan around their leases and the possibility of moving. Ownership gives the formal consent right, while everyday use connects a wider group to the outcome.','出售可以释放资产或支持退休安排。自住业主需要衡量替代住家的成本，自营店主需要考虑经营地点与熟客关系，租户则围绕租约与搬迁可能安排经营。产权赋予正式同意权，日常使用则让更多人与结果紧密相连。'),
   notes:`<h3>${t('Overlapping roles','交叠的角色')}</h3><p>${t('The May and November 2019 reports record people’s retirement plans, property valuations, replacement housing and customer relationships. A person can be an owner, resident and shop operator at the same time. These overlapping roles help explain the different futures people consider.','2019 年 5 月及 11 月的报道记录了受访者的退休安排、物业估价、替代住家与顾客关系。同一个人可以同时是业主、住户和经营者；这些交叠的角色，帮助我们理解人们考虑的多种未来。')}</p><p>${t('Owners exercise the property-consent right. Tenants’ relocation and compensation arrangements follow their agreements and applicable law. Employees and visitors also have a stake in the continuity of work, services and everyday routines.','业主行使基于产权的同意权；租户的搬迁及补偿安排依据相关协议与适用法律。员工与访客同样关心工作、服务及日常往来的延续。')}</p>${link(source.attempt,t('CNA / TODAY · owners’ considerations','CNA／TODAY · 业主的考虑'))}${link(source.outcome,t('CNA / TODAY · shopkeepers’ responses','CNA／TODAY · 商户的回应'))}`
  }
 ];
}

export function choicePanels(lang='en'){
 const t=(en,zh)=>lang==='zh'?zh:en;
 return `<div class="pc-panel" data-pn-choice="0">
  <p class="pc-eyebrow">${t('2019 COLLECTIVE-SALE CONSENT THRESHOLD','2019 年集体出售同意门槛')}</p>
  <div class="pc-dual">
   <div><span class="pc-measure">${t('By share value','按份额值')}</span><strong class="pc-percent"><small>≥</small>80<span>%</span></strong><p>${t('Consenting units’ assigned shares<br>÷ all units’ assigned shares','同意单位的份额值之和<br>÷ 全部单位的总份额值')}</p></div>
   <span class="pc-and">${t('AND','且')}</span>
   <div><span class="pc-measure">${t('By strata area','按分层面积')}</span><strong class="pc-percent"><small>≥</small>80<span>%</span></strong><p>${t('Consenting units’ registered area<br>÷ all units’ registered area','同意单位的分层面积之和<br>÷ 全部单位的总分层面积')}</p></div>
  </div>
  <p class="pc-takeaway">${t('Both tests. The same consenting owners.','同一批同意业主，两项都须达标。')}</p>
 </div>
 <div class="pc-panel" data-pn-choice="1" hidden inert>
  <p class="pc-eyebrow">${t('THE GENERAL PROCESS · THREE KEY STAGES','一般程序 · 三个关键阶段')}</p>
  <ol class="pc-process">
   <li><span>01</span><div><strong>${t('Secure consent','征集同意')}</strong><p>${t('Both ownership tests must be met.','份额值与分层面积均须达到门槛。')}</p></div></li>
   <li><span>02</span><div><strong>${t('Find a buyer','找到买家')}</strong><p>${t('Market the property; agree the sale.','公开招标、选定买家、订立买卖协议。')}</p></div></li>
   <li><span>03</span><div><strong>${t('Obtain a sale order','取得整售令')}</strong><p>${t('Majority-consent route: application and review.','多数同意路径：申请、审查及处理异议。')}</p></div></li>
  </ol>
  <p class="pc-outcome"><b>${t('Queensway, 2019: stopped at 01.','女皇道 2019：止于第 01 步。')}</b><span>${t('The attempt ended during consent collection.','此次尝试在征集同意阶段结束。')}</span></p>
 </div>
 <div class="pc-panel" data-pn-choice="2" hidden inert>
  <p class="pc-eyebrow">${t('WHO DECIDES · WHO IS AFFECTED','谁能决定 · 谁受影响')}</p>
  <div class="pc-people">
   <div><strong>${t('Owners','业主')}</strong><p>${t('Weigh sale proceeds against what comes next.','参与产权同意，权衡售款与之后的生活。')}</p></div>
   <div><strong>${t('Tenants','租户')}</strong><p>${t('Plan future premises around their lease arrangements.','依据租约安排，考虑未来的经营地点。')}</p></div>
   <div><strong>${t('The wider community','更广的社区')}</strong><p>${t('Jobs, familiar services and routines may change.','工作、熟悉的服务与日常往来也可能改变。')}</p></div>
  </div>
  <p class="pc-takeaway">${t('Ownership decides. Everyday connections carry the effects.','产权形成决定，日常联系传递影响。')}</p>
 </div>`;
}
