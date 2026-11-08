import { interviewCollections } from './interview-recordings.js?v=20261108-public-team1';
const players = new Set();
const text = (value, lang) => value[lang === 'zh' ? 'zh' : 'en'];
const time = seconds => { const n = Math.max(0, Math.floor(Number(seconds) || 0)); return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`; };
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sourceTime = seconds => `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(2).padStart(5, '0').replace(/0+$/, '').replace(/\.$/, '')}`;
const recordingLabel = (collection, clip, lang) => `${collection.speaker} · ${text(clip.label, lang)} · ${lang === 'zh' ? '约 ' + Math.round(clip.duration) + ' 秒' : '~' + Math.round(clip.duration) + ' sec'}`;
export function interviewAudioSourceNotesMarkup(lang, setId, clipId) {
 const collection = interviewCollections[setId]; if (!collection) return '';
 const clip = collection.clips.find(item => item.id === clipId) || collection.clips[0], zh = lang === 'zh';
 return `${clip.context ? `<p>${escape(text(clip.context, lang))}</p>` : ''}<p><strong>${escape(collection.speaker)} · ${escape(text(clip.label, lang))}</strong><br>${zh ? '原始录音位置' : 'Position in the original recording'}: ${sourceTime(clip.originalStart)}–${sourceTime(clip.originalEnd)}</p>`;
}
const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5.7 19 12 9 18.3Z"/></svg>';
const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 5.5h3v13h-3zm6 0h3v13h-3z"/></svg>';
const soundIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z"/><path data-sound-waves d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path data-sound-off d="m17 9 5 6m0-6-5 6"/></svg>';
export function interviewAudioMarkup(lang = 'en', setId = 'dirty-laundry', instanceId = setId) {
 const collection = interviewCollections[setId]; if (!collection) return '';
 const recordings = collection.clips, zh = lang === 'zh', first = recordings[0], audioId = `interview-${instanceId.replace(/[^a-z0-9-]/gi, '-')}`;
 return `<div class="interview-audio" data-interview-set="${setId}" data-interview-instance="${instanceId}" data-interview-topic="${first.id}">
  <nav class="interview-audio-topics" aria-label="${zh ? '选择采访片段' : 'Choose an interview excerpt'}">${recordings.map((recording, index) => `<button type="button" data-interview-topic-button="${recording.id}" aria-pressed="${index === 0}" aria-controls="${audioId}">${text(recording.label, lang)}</button>`).join('')}</nav>
  <audio id="${audioId}" controls preload="metadata" playsinline src="${first.file}" aria-label="${collection.speaker}${zh ? ' 采访：' : ' interview: '}${text(first.label, lang)}"></audio>
  <div class="interview-audio-player" data-interview-player hidden>
   <button type="button" class="interview-audio-play" data-interview-play aria-label="${zh ? '播放采访' : 'Play interview'}">${playIcon}</button>
   <div class="interview-audio-track"><div class="interview-audio-times" aria-hidden="true"><span data-interview-elapsed>0:00</span><span data-interview-duration>—:—</span></div><input class="interview-audio-seek" data-interview-seek type="range" min="0" max="1" step="0.1" value="0" disabled aria-label="${zh ? '采访播放进度' : 'Interview playback position'}"></div>
   <button type="button" class="interview-audio-sound" data-interview-mute aria-label="${zh ? '静音' : 'Mute'}" aria-pressed="false">${soundIcon}</button>
  </div>
  <p class="interview-audio-source" data-interview-source>${recordingLabel(collection, first, lang)}</p>
  <p class="interview-audio-status" data-interview-status role="status" aria-live="polite" hidden></p>
 </div>`;
}
export function mountInterviewAudio(container, { lang = 'en' } = {}) {
 const root = container?.matches('.interview-audio') ? container : container?.querySelector('.interview-audio');
 if (!root) return { pause() {}, setClip() {}, destroy() {} };
 const collection = interviewCollections[root.dataset.interviewSet], recordings = collection.clips;
 const STORAGE_KEY = `qsc-interview-${root.dataset.interviewInstance}`;
 const audio = root.querySelector('audio'), buttons = [...root.querySelectorAll('[data-interview-topic-button]')];
 const source = root.querySelector('[data-interview-source]'), status = root.querySelector('[data-interview-status]');
 const play = root.querySelector('[data-interview-play]'), seek = root.querySelector('[data-interview-seek]'), mute = root.querySelector('[data-interview-mute]');
 const elapsed = root.querySelector('[data-interview-elapsed]'), duration = root.querySelector('[data-interview-duration]'), zh = lang === 'zh';
 let current = recordings[0], disposed = false, request = 0, pending = false;
 try { const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null'); const recording = recordings.find(item => item.id === saved?.topic); if (recording) current = recording; } catch {}
 function save() { if (!disposed) try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ topic: current.id })); } catch {} }
 function clearStatus() { status.hidden = true; status.textContent = ''; }
 function syncTime() {
  const total = audio.duration, ready = Number.isFinite(total) && total > 0, position = ready ? Math.min(total, audio.currentTime || 0) : 0;
  elapsed.textContent = time(position); duration.textContent = ready ? time(Math.ceil(total)) : '—:—';
  seek.disabled = !ready; seek.max = String(ready ? total : 1); seek.value = String(position);
  seek.style.setProperty('--audio-progress', `${ready ? position / total * 100 : 0}%`);
  seek.setAttribute('aria-valuetext', ready ? (zh ? `已播放 ${time(position)}，共 ${time(Math.ceil(total))}` : `${time(position)} of ${time(Math.ceil(total))}`) : (zh ? '正在载入录音' : 'Loading recording'));
 }
 function syncPlayback() {
  const playing = !audio.paused && !audio.ended;
  if (play.dataset.playing !== String(playing)) { play.innerHTML = playing ? pauseIcon : playIcon; play.dataset.playing = String(playing); }
  const name = text(current.label, lang);
  play.setAttribute('aria-label', zh ? `${playing ? '暂停' : '播放'}${name}片段` : `${playing ? 'Pause' : 'Play'} ${name.toLowerCase()} excerpt`);
  root.classList.toggle('is-playing', playing);
 }
 function syncVolume() { const off = audio.muted || audio.volume === 0; mute.setAttribute('aria-pressed', String(off)); mute.setAttribute('aria-label', zh ? off ? '取消静音' : '静音' : off ? 'Unmute' : 'Mute'); }
 function pause() { request++; pending = false; audio.pause(); syncPlayback(); save(); }
 function updateLabels() {
  root.dataset.interviewTopic = current.id;
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.interviewTopicButton === current.id)));
  source.textContent = recordingLabel(collection, current, lang); audio.setAttribute('aria-label', `${collection.speaker}${zh ? ' 采访：' : ' interview: '}${text(current.label, lang)}`); syncPlayback();
 }
 function select(id, { reset = false, notify = false } = {}) { const recording = recordings.find(item => item.id === id); if (!recording) return; if (recording === current) { if (reset) { pause(); audio.currentTime = 0; syncTime(); } return; } pause(); current = recording; updateLabels(); clearStatus(); audio.src = new URL(current.file, import.meta.url).href; audio.load(); syncTime(); save(); if (notify) root.dispatchEvent(new CustomEvent('interviewclipchange', { bubbles: true, detail: { id: current.id } })); }
 async function togglePlayback() {
  if (!audio.paused || pending) { pause(); return; }
  for (const player of players) if (player !== handle) player.pause();
  clearStatus(); const ticket = ++request; pending = true;
  if (audio.ended) audio.currentTime = 0;
  try { await audio.play(); }
  catch (error) { if (!disposed && ticket === request && error.name !== 'AbortError') showError(); }
  finally { if (!disposed && ticket === request) { pending = false; syncPlayback(); } }
 }
 function showError() { status.textContent = zh ? '请重新点击播放，或刷新页面后收听。' : 'Select play again, or refresh the page to listen.'; status.hidden = false; syncPlayback(); }
 const click = event => {
  const button = event.target.closest('button'); if (!button || !root.contains(button)) return;
  if (button.hasAttribute('data-interview-topic-button')) select(button.dataset.interviewTopicButton, { notify: true });
  else if (button === play) togglePlayback();
  else if (button === mute) { if (audio.volume === 0) audio.volume = 1; audio.muted = !audio.muted; }
 };
 const key = event => {
  const button = event.target.closest('[data-interview-topic-button]'); if (!button || !root.contains(button) || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault(); const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (buttons.indexOf(button) + (event.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length;
  buttons[index].focus(); select(buttons[index].dataset.interviewTopicButton, { notify: true });
 };
 const scrub = () => { if (Number.isFinite(audio.duration)) { audio.currentTime = Math.min(audio.duration, Math.max(0, Number(seek.value))); syncTime(); } };
 const metadata = () => { clearStatus(); syncTime(); }, visibility = () => { if (document.hidden) pause(); };
 const subscriptions = [[root,'click',click],[root,'keydown',key],[seek,'input',scrub],[audio,'loadedmetadata',metadata],[audio,'durationchange',syncTime],[audio,'emptied',syncTime],[audio,'timeupdate',syncTime],[audio,'seeked',syncTime],[audio,'play',syncPlayback],[audio,'pause',syncPlayback],[audio,'ended',syncPlayback],[audio,'volumechange',syncVolume],[audio,'error',showError],[document,'visibilitychange',visibility]];
 subscriptions.forEach(([node,event,listener]) => node.addEventListener(event,listener));
 updateLabels(); syncTime(); syncVolume(); root.classList.add('is-enhanced'); audio.controls = false; audio.hidden = true; root.querySelector('[data-interview-player]').hidden = false;
 if (current !== recordings[0]) { audio.src = new URL(current.file, import.meta.url).href; audio.load(); } else if (audio.readyState >= 1) metadata(); save();
 const handle = { pause, setClip: select, destroy() { if (disposed) return; players.delete(handle); pause(); disposed = true; subscriptions.forEach(([node,event,listener])=>node.removeEventListener(event,listener)); audio.removeAttribute('src'); audio.load(); } };
 players.add(handle); return handle;
}
