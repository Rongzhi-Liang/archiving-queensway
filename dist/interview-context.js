import { interviewAudioMarkup, mountInterviewAudio, interviewAudioSourceNotesMarkup } from './interview-audio.js?v=20261108-public-team1';
import { interviewCollections } from './interview-recordings.js?v=20261108-public-team1';

// Mount interview controls separately from the photographic scroll controller.
export function mountOpeningInterviews(root, { lang = 'en', onModal = () => {} } = {}) {
 const original = root?.querySelector('.opening-status');
 if (!original) return { destroy() {} };
 const zh = lang === 'zh', controller = new AbortController(), { signal } = controller;
 const trigger = document.createElement('button');
 trigger.type = 'button'; trigger.className = 'opening-status opening-audio-trigger';
 trigger.textContent = zh ? '听原声 ↗' : 'LISTEN TO THE INTERVIEW ↗';
 trigger.setAttribute('aria-haspopup', 'dialog'); original.replaceWith(trigger);
 const dialog = document.createElement('dialog'); dialog.className = 'interview-dialog';
 dialog.setAttribute('aria-labelledby', 'opening-interview-title'); document.body.append(dialog);
 let player = null, person = '';
 function close() { player?.pause(); if (dialog.open) dialog.close(); }
 function show() {
  const id = root.dataset.story || 'frank', set = interviewCollections[id]; if (!set) return;
  player?.destroy(); person = id;
  dialog.innerHTML = `<header><div><p>${zh ? '实地采访 · Archiving Queensway' : 'FIELD INTERVIEW · Archiving Queensway'}</p><h2 id="opening-interview-title">${set.speaker}</h2></div><button type="button" data-interview-close aria-label="${zh ? '关闭采访' : 'Close interview'}">×</button></header><p class="interview-dialog-place">${set.shop} · ${set.unit}</p>${interviewAudioMarkup(lang, id, `opening-${id}`)}<details class="interview-source-details"><summary>${zh ? '来源与说明' : 'Sources & notes'}</summary><div data-opening-interview-notes></div></details>`;
  player = mountInterviewAudio(dialog, { lang }); updateNotes(); onModal(true); dialog.showModal();
 }
 function updateNotes() {
  const audioRoot = dialog.querySelector('.interview-audio'), notes = dialog.querySelector('[data-opening-interview-notes]');
  if (audioRoot && notes) notes.innerHTML = interviewAudioSourceNotesMarkup(lang, audioRoot.dataset.interviewSet, audioRoot.dataset.interviewTopic);
 }
 trigger.addEventListener('click', show, { signal });
 dialog.addEventListener('interviewclipchange', updateNotes, { signal });
 dialog.addEventListener('click', event => {
  if (event.target.closest('[data-interview-close]')) close();
  else if (event.target === dialog) { const b = dialog.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) close(); }
 }, { signal });
 dialog.addEventListener('close', () => { player?.pause(); onModal(false); trigger.focus({ preventScroll: true }); }, { signal });
 const observer = new MutationObserver(() => { if (person && root.dataset.story !== person) close(); });
 observer.observe(root, { attributes: true, attributeFilter: ['data-story'] });
 window.addEventListener('scroll', () => { if (dialog.open && root.getBoundingClientRect().bottom <= innerHeight * .2) close(); }, { passive: true, signal });
 return { destroy() { controller.abort(); observer.disconnect(); player?.destroy(); dialog.remove(); } };
}
