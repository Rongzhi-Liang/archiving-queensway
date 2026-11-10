/** Participation connects directly to the project's published questionnaires. */
const FORM_LINKS = {
  business: 'https://queenswayshoppingcentreproject.ushahidi.io/posts/create/2',
  visitor: 'https://queenswayshoppingcentreproject.ushahidi.io/posts/create/3'
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const text = lang => (en, zh) => lang === 'zh' ? zh : en;

export function dialogueMarkup(lang = 'en') {
  const t = text(lang);
  const prompts = [
    [t('An experience', '一段经历'), t('What brought you here—and what brought you back?', '是什么让你来到这里，又是什么让你回来？'), t('Think of a visit, a purchase, a repair or an encounter that stayed with you.', '可以从一次到访、购买、维修，或难忘的相遇说起。')],
    [t('A working life', '一份工作'), t('What does it take to keep a shop going?', '让一家店继续经营，需要什么？'), t('Describe the work, relationships and everyday decisions behind the shopfront.', '说说门面背后的劳动、人际关系与日常经营选择。')],
    [t('A future', '一种未来'), t('What should remain part of Queensway?', '女皇道的哪些部分，值得继续留下？'), t('Share what matters to you, and the changes you would like to see.', '分享你在意的事，以及你希望看到的改变。')]
  ];
  return `<section id="chapter-future" class="story-step afterword-section community-dialogue" data-scene="12" data-afterword-label="${t('Future & participation', '未来与参与')}" aria-labelledby="community-dialogue-title">
    <div class="cd-layout">
      <div class="cd-reading">
        <p class="cd-kicker">${t('FUTURE & PARTICIPATION', '未来与参与')}</p>
        <h2 id="community-dialogue-title">${t('The next story<br><em>could be yours.</em>', '下一段故事，<br><em>可以由你来说。</em>')}</h2>
        <p class="cd-introduction">${t('A place is understood through the people who own, work in and use it. Add your experience to the project’s research.', '理解一个地方，需要倾听拥有、经营和使用它的人。你可以向项目分享自己的经历。')}</p>
        <div class="cd-topics" role="group" aria-label="${t('Choose a starting question', '选择一个切入问题')}">${prompts.map(([label], i) => `<button type="button" data-dialogue-topic="${i}" aria-pressed="${i === 0}" aria-controls="cd-question">${label}</button>`).join('')}</div>
        <div id="cd-question" class="cd-question" aria-live="polite" aria-atomic="true">${prompts.map(([, question, hint], i) => `<div data-dialogue-question="${i}"${i ? ' hidden' : ''}><h3>${question}</h3><p class="cd-body">${hint}</p></div>`).join('')}</div>
      </div>
      <div class="cd-contribution cd-participation">
        <p class="cd-kicker">${t('PROJECT QUESTIONNAIRES · USHAHIDI', '项目问卷 · USHAHIDI')}</p>
        <h3>${t('Share your<br><em>connection.</em>', '分享你与这里<br><em>的联系。</em>')}</h3>
        <p class="cd-body">${t('Choose the questionnaire that fits your experience. It opens on the project’s Ushahidi site.', '按你的经历选择问卷，在项目的 Ushahidi 页面填写并提交。')}</p>
        <p class="cd-selected-place" data-dialogue-context hidden></p>
        <div class="cd-survey-links">
          <a href="${FORM_LINKS.business}" target="_blank" rel="noopener noreferrer" data-dialogue-survey="business"><span><strong>${t('I run or work in a shop', '我在这里经营或工作')}</strong><small>${t('Shop owners, tenants and employees', '店主、租户与员工')}</small></span><span aria-hidden="true">↗</span></a>
          <a href="${FORM_LINKS.visitor}" target="_blank" rel="noopener noreferrer" data-dialogue-survey="visitor"><span><strong>${t('I visit or use the mall', '我来这里逛或使用服务')}</strong><small>${t('Customers, visitors and neighbours', '顾客、访客与街区邻居')}</small></span><span aria-hidden="true">↗</span></a>
        </div>
        <div class="cd-corrections"><p class="cd-note">${t('A shop detail, photograph or account needs correcting?', '发现店铺资料、照片或叙述需要更正？')}</p><button type="button" class="cd-text-link" data-dialogue-stewardship>${t('Suggest a correction', '提供更正信息')} <span aria-hidden="true">＋</span></button></div>
      </div>
    </div>
  </section>`;
}

export function mountDialogue(container, { lang = 'en', onStewardship = () => {} } = {}) {
  const root = container?.matches?.('.community-dialogue') ? container : container?.querySelector?.('.community-dialogue');
  if (!root) return { destroy() {}, openForm() {} };
  const t = text(lang), controller = new AbortController(), { signal } = controller;
  let context = null;
  const selectTopic = index => {
    root.querySelectorAll('[data-dialogue-topic]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.dialogueTopic) === index)));
    root.querySelectorAll('[data-dialogue-question]').forEach(panel => { panel.getAnimations().forEach(animation => animation.cancel()); panel.hidden = Number(panel.dataset.dialogueQuestion) !== index; if (!panel.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) panel.animate([{ opacity: .65, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350, easing: 'ease-out' }); });
  };
  root.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const topic = target.closest('[data-dialogue-topic]');
    if (topic) selectTopic(Number(topic.dataset.dialogueTopic));
    if (target.closest('[data-dialogue-stewardship]')) onStewardship();
  }, { signal });
  root.addEventListener('keydown', event => {
    const current = event.target.closest('[data-dialogue-topic]');
    if (!current || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = [...root.querySelectorAll('[data-dialogue-topic]')], index = buttons.indexOf(current);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    event.preventDefault(); selectTopic(next); buttons[next].focus();
  }, { signal });
  // The participation route focuses the questionnaire links.
  function openForm(place) {
    context = place && typeof place === 'object' ? place : null;
    const label = root.querySelector('[data-dialogue-context]');
    const name = typeof context?.place === 'string' ? context.place.slice(0, 160) : '';
    const unit = typeof context?.unit === 'string' ? context.unit.slice(0, 40).replace(/^#/, '') : '';
    label.hidden = !name && !unit;
    label.innerHTML = `${t('Your selected place', '你选择的地点')} · ${esc(name)}${unit ? ` · #${esc(unit)}` : ''}`;
    root.querySelector('[data-dialogue-survey]')?.focus({ preventScroll: true });
  }
  return { destroy() { controller.abort(); }, openForm };
}
