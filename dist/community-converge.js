const pick = lang => (en, zh) => lang === 'zh' ? zh : en;
const questions = lang => {
 const t=pick(lang);
 return [
  {tab:t('Decide','谁来决定'),word:t('Ownership','产权'),other:t('Consequences','影响'),title:t('The right to decide.<br>The lives affected.','有权作决定，<br>也有人承受改变。'),body:t('Owners take part in the collective-sale decision. Tenants, employees and visitors may also experience its consequences. A public conversation needs room for both decision-makers and the people affected.','业主参与集体出售的产权决定；租户、员工与访客也可能承受改变。一场关于未来的公共讨论，需要同时听见作决定的人与受影响的人。')},
  {tab:t('Continue','什么延续'),word:t('A property','物业'),other:t('A working place','日常经营'),title:t('A building can change hands.<br>What helps a place continue?','物业可以转手，<br>日常怎样延续？'),body:t('The accounts bring space, operating conditions, customer ties and familiar services into the same discussion. A future proposal can ask what changes for each of them, as well as what a sale might realise.','这些材料把空间、经营条件、顾客联系和熟悉的服务放在一起。讨论未来方案时，除了出售能带来什么，也可以逐一追问：这些日常条件将怎样改变？')},
  {tab:t('Contribute','加入更多声音'),word:t('Selected accounts','已有记录'),other:t('More perspectives','更多视角'),title:t('More experiences.<br>One growing archive.','更多经历，<br>汇入同一份档案。'),body:t('This archive connects interviews, field photographs and published accounts of everyday visits. Owners, residents, workers and visitors can add further perspectives, each accompanied by its source and material type.','这份档案连起采访、实地照片与关于日常到访的公开报道。业主、住户、员工和访客可以带来更多视角，每条记录都保留来源与资料身份。')}
 ];
};
export function convergeMarkup(lang='en'){
 const t=pick(lang),items=questions(lang);
 return `<section id="chapter-converge" class="story-step afterword-section community-converge" data-scene="11" data-afterword-label="${t('Common ground','共同结论')}" aria-labelledby="converge-title">
  <div class="cv-reading">
   <p class="cv-kicker">${t('01 / COMMON GROUND','01 / 共同结论')}</p>
   <h2 id="converge-title">${t('A shared future.<br><em>More than one voice.</em>','同一处地方，<br><em>未来需要多种声音。</em>')}</h2>
   <p class="cv-lead">${t('Property, livelihood and memory meet in the same place. Reading them together changes the question: what should a conversation about Queensway’s future take into account?','产权、生计与记忆在同一处地方相遇。把它们放在一起，问题也变得更完整：讨论女皇道的未来时，我们需要考虑什么？')}</p>
   <p class="cv-insight">${t('Value takes more than one form.<br>A decision reaches beyond its decision-makers.','价值有多种形式。<br>决定的影响，也超出作决定的人。')}</p>
   <div class="cv-actions"><button type="button" data-go="chapter-explore">${t('Explore the records','走进共同档案')} <span aria-hidden="true">↓</span></button><button type="button" data-action="methods">${t('How we reached this reading','这一理解从何而来')} <span aria-hidden="true">＋</span></button></div>
  </div>
  <div class="cv-comparison">
   <div class="cv-tabs" role="tablist" aria-label="${t('Questions for a shared future','关于共同未来的问题')}">${items.map((x,i)=>`<button type="button" role="tab" id="cv-tab-${i}" aria-controls="cv-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-cv-question="${i}">${x.tab}</button>`).join('')}</div>
   ${items.map((x,i)=>`<div class="cv-panel" id="cv-panel-${i}" role="tabpanel" aria-labelledby="cv-tab-${i}"${i?' hidden':''}><div class="cv-pair" aria-hidden="true"><span>${x.word}</span><i>↔</i><span>${x.other}</span></div><h3>${x.title}</h3><p>${x.body}</p></div>`).join('')}
  </div>
 </section>`;
}
export function mountConverge(root=document){
 const section=root.querySelector('#chapter-converge');if(!section)return ()=>{};
 const controller=new AbortController(),buttons=[...section.querySelectorAll('[data-cv-question]')];
 function choose(i){
  buttons.forEach((b,n)=>{b.setAttribute('aria-selected',String(n===i));b.tabIndex=n===i?0:-1;});
  section.querySelectorAll('.cv-panel').forEach((p,n)=>{p.hidden=n!==i;if(n===i&&!matchMedia('(prefers-reduced-motion: reduce)').matches)p.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});});
 }
 section.addEventListener('click',event=>{const b=event.target.closest('[data-cv-question]');if(b)choose(Number(b.dataset.cvQuestion));},{signal:controller.signal});
 section.addEventListener('keydown',event=>{const i=buttons.indexOf(event.target);if(i<0||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const n=event.key==='Home'?0:event.key==='End'?2:(i+(event.key==='ArrowRight'?1:2))%3;choose(n);buttons[n].focus();},{signal:controller.signal});
 return ()=>controller.abort();
}
