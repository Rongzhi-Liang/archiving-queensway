const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));
const ease = value => { const p = clamp(value); return p * p * (3 - 2 * p); };

/** Six readings share the parent chapter's scroll position and navigation. */
export function potentialReadings(lang = 'en') {
 const t = (en, zh) => lang === 'zh' ? zh : en;
 return [
  { title: t('From today’s market.<br><em>To tomorrow’s project.</em>', '从今天的市场，<br><em>看未来的收入。</em>'), body: t('The market records show what existing space sells or rents for. A buyer considering redevelopment looks ahead: what could the completed shops and homes sell for? Their permitted floor area, use and achievable prices together shape the completed project’s value. The first bar represents that starting point.', '前面的市场资料，记录现有空间的售价与租金。考虑重建的买方还会往前看：新建商铺和住宅，完成后能卖多少钱？获准面积、用途组合与可能实现的售价，共同形成整个新项目的完工价值。右边第一根柱，表示这个起点。') },
  { title: t('Deliver the project.<br><em>Deduct the costs.</em>', '把项目建成，<br><em>先扣除开发支出。</em>'), body: t('Demolition, construction, design, approvals, finance and selling all require money. These expenses come out of the completed project’s value. Follow the second bar: it removes the portion needed to deliver the new development, before allowing for a return and buying the existing property.', '拆除、建造、设计、审批、融资与销售，都需要资金。这些费用要从完工价值中扣除。第二根柱表示为建成新项目所需的支出；扣除之后，剩余部分还要容纳开发商的回报，以及收购现有物业的费用。') },
  { title: t('Commit the capital.<br><em>Allow for a return.</em>', '投入资金，<br><em>也要预留回报。</em>'), body: t('The developer commits capital, waits through the project and takes on construction and sales risks. The appraisal therefore allows for a required return. The third bar sets that portion aside; what remains can be attributed to acquiring the site.', '开发商投入资金、等待项目完成，也承担建造和销售的风险。因此，评估时还要为这项投入预留所需回报。第三根柱把这部分分开，余下的价值才归于土地收购。') },
  { title: t('What remains.<br><em>Room for an offer.</em>', '余下的空间，<br><em>才能用于收购。</em>'), body: t('Completed value, less development costs and the required return, leaves the residual land value. The gold bar shows this remaining space. It connects expectations about a new project to today’s acquisition budget, which also needs to cover purchase-related expenses. The eventual sale process establishes what owners receive.', '完工价值扣除开发支出与所需回报，得到土地的剩余价值。金色柱显示的就是这部分空间：它把未来新项目的预期，联系到今天的收购预算。预算中还要考虑收购相关费用，业主最终取得的售款则在出售过程中确定。') },
  { title: t('Income and costs.<br><em>Both shape the offer.</em>', '收入与支出，<br><em>一起改变出价。</em>'), body: t('Keep scrolling: first, higher expected sales value widens the room for an offer when costs and the required return stay the same. Then, higher development costs use up some of that room while sales expectations hold steady. A buyer considers these changes together when judging an acquisition.', '继续向下滚动：先看预期销售价值提高，在开发支出与所需回报相同时，收购空间随之扩大；再看开发支出增加，在销售预期相同时，收购空间又被压缩。买方判断收购时，需要把收入与支出的变化放在一起考虑。') },
  { title: t('Back to Queensway.<br><em>Start with the scheme.</em>', '回到女皇道，<br><em>先落实开发方案。</em>'), body: t('For Queensway, an appraisal begins with what can be built. The planning record identifies Commercial & Residential use and records the plot-ratio field as EVA. A specific permitted scheme establishes the floor area and use mix for assessing value, costs and timing. Continue down to see the existing site and its planning framework.', '回到女皇道，首先要落实能够建什么。规划记录为商业与住宅用途，容积率字段记为 EVA。具体获准方案确定楼面规模与用途组合，评估才能进一步结合市场价值、成本与时间。继续向下，查看现状环境与规划用途。') }
 ];
}
export function potentialReading(lang = 'en', progress = 0, selectedTerm = null) {
 return potentialReadings(lang)[Number.isInteger(selectedTerm) ? Math.max(0, Math.min(3, selectedTerm)) : Math.min(5, Math.floor(clamp(progress) * 6))];
}

/** Drawing coordinates explain relationships, not monetary observations or percentages. */
export function potentialFrame(progress) {
 const position = clamp(progress) * 6, step = Math.min(5, Math.floor(position));
 const local = step === 5 && position === 6 ? 1 : position - step;
 const salesRise = step === 4 ? ease((local - .08) / .32) : step === 5 ? 1 - ease(local / .5) : 0;
 const costRise = step === 4 ? ease((local - .58) / .32) : step === 5 ? 1 - ease(local / .5) : 0;
 const completed = 210 + 38 * salesRise, costs = 116 + 30 * costRise, required = 38;
 const remaining = completed - costs - required;
 return { step, local, completed, costs, required, remaining,
  reveal: [0, 1, 2, 3].map(index => step > index ? 1 : step < index ? 0 : ease(local / .65)),
  change: step === 4 ? local < .55 ? 'sales' : 'costs' : 'none' };
}

export function potentialMarkup(lang = 'en') {
 const t = (en, zh) => lang === 'zh' ? zh : en;
 const labels = [[t('Completed', '完工'), t('value', '价值')], [t('Development', '开发'), t('costs', '支出')], [t('Required', '所需'), t('return', '回报')], [t('Acquisition', '收购'), t('room', '空间')]];
 return `<div class="pv-main">
  <p class="pv-method">${t('From completed value to an offer', '从完工价值，走向收购出价')}</p>
  <figure class="pv-figure">
   <svg class="pv-chart" viewBox="0 0 640 366" role="group" aria-label="${t('How completed value is divided: select a bar to read its explanation', '完工价值如何分配：选择柱形阅读对应讲解')}">
    <desc>${t('A conceptual waterfall diagram: completed value, minus development costs and the required return, leaves room to acquire the site.', '估值关系图：完工价值扣除开发支出与所需回报，余下土地收购空间。')}</desc>
    <path class="pv-baseline" d="M18 278H622" aria-hidden="true"/>
    ${labels.map((lines, i) => `<g class="pv-column pv-column-${i}" data-pv-column="${i}" role="button" tabindex="0" aria-label="${lines.join(lang === 'zh' ? '' : ' ')}" aria-pressed="${i === 0}">
     <rect class="pv-hit" x="${i * 160}" y="8" width="152" height="350" rx="3"/>
     <rect class="pv-bar" data-pv-bar="${i}" x="${31 + i * 160}" y="278" width="88" height="0" rx="2"/>
     <text class="pv-bar-label" x="${75 + i * 160}" y="312" text-anchor="middle">${lines.map((line, j) => `<tspan x="${75 + i * 160}" dy="${j ? '26' : '0'}">${line}</tspan>`).join('')}</text>
    </g>`).join('')}
    ${['−', '−', '='].map((operator, i) => `<text class="pv-operator" x="${155 + i * 160}" y="260" text-anchor="middle" aria-hidden="true">${operator}</text>`).join('')}
   </svg>
   <figcaption><span class="pv-result" data-pv-result></span><span class="pv-chart-note">${t('Valuation relationships · scroll to continue', '估值关系示意 · 向下滚动继续')}</span></figcaption>
  </figure>
 </div>`;
}

export function mountPotential(container, { lang = 'en', onSeek = () => {} } = {}) {
 if (!container) return { setProgress() {}, destroy() {} };
 const t = (en, zh) => lang === 'zh' ? zh : en, reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const columns = [...container.querySelectorAll('[data-pv-column]')], bars = [...container.querySelectorAll('[data-pv-bar]')], result = container.querySelector('[data-pv-result]');
 let progress = 0;
 const captions = [t('Start with what the new project could be worth.', '先看新项目建成后，可能实现的价值。'), t('Set aside the cost of delivering the project.', '先扣除把项目建成所需的支出。'), t('Allow for the return on capital, time and risk.', '再为资金、时间与风险预留回报。'), t('The remainder creates room for an offer.', '余下的价值，形成今天的收购空间。'), '', t('Scheme · market · costs · time', '方案 · 市场 · 成本 · 时间')];
 function draw() {
  const frame = potentialFrame(progress), { step, completed, costs, required, remaining } = frame;
  const levels = [[completed, 0], [completed, completed - costs], [completed - costs, remaining], [remaining, 0]];
  levels.forEach(([high, low], i) => {
   const reveal = reduced.matches ? Number(step >= i) : frame.reveal[i];
   bars[i].setAttribute('y', String(278 - low - (high - low) * reveal));
   bars[i].setAttribute('height', String((high - low) * reveal));
   columns[i].classList.toggle('is-current', step === i);
   columns[i].classList.toggle('is-ahead', step < i);
   columns[i].setAttribute('aria-pressed', String(step === i));
  });
  result.textContent = step === 4 ? frame.change === 'sales' ? t('Higher sales value → more room to acquire.', '销售预期提高 → 收购空间扩大') : t('Higher development costs → less room to acquire.', '开发支出增加 → 收购空间收窄') : captions[step];
  container.dataset.pvStep = String(step);
  container.dataset.pvChange = frame.change;
 }
 const click = event => { const target = event.target.closest('[data-pv-column]'); if (target && container.contains(target)) onSeek(Number(target.dataset.pvColumn)); };
 const key = event => {
  const target = event.target.closest('[data-pv-column]'); if (!target || !container.contains(target)) return;
  let index = Number(target.dataset.pvColumn);
  if (['Enter', ' '].includes(event.key)) { event.preventDefault(); onSeek(index); }
  else if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); index = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (index + (event.key === 'ArrowRight' ? 1 : 3)) % 4; columns[index].focus(); onSeek(index); }
 };
 container.addEventListener('click', click); container.addEventListener('keydown', key); reduced.addEventListener('change', draw); draw();
 return { setProgress(next) { progress = clamp(next); draw(); }, destroy() { container.removeEventListener('click', click); container.removeEventListener('keydown', key); reduced.removeEventListener('change', draw); } };
}
