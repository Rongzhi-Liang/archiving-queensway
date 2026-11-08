import { interviewAudioMarkup, mountInterviewAudio, interviewAudioSourceNotesMarkup } from './interview-audio.js?v=20261108-public-team1';
const SESSION_KEY = 'qsc-community-index-v3';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const normal = value => String(value ?? '').normalize('NFKC').toLowerCase().trim();
const pick = lang => (en, zh) => lang === 'zh' ? zh : en;
const external = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>`;
const categories = { 'Barber': '理发', 'Contractor': '工程服务', 'F&B': '餐饮', 'Fashion': '服饰', 'Gym': '健身', 'Hobby Store': '兴趣与收藏', "Men's Fashion": '男装', 'Office': '办公室', 'Optometry': '眼镜与视光', 'Others': '其他服务', 'Shirt Services': '衬衫服务', 'Showroom': '产品展示', 'Sports': '体育用品', 'Tailor': '裁缝与改衣', 'Tech': '科技与维修', 'Thrift/Vintage': '二手与中古服饰', 'Wellness': '健康服务', 'For Rent': '招租记录', 'Unused/Store Room': '未使用／储藏室记录' };

function indexRecords(lang) {
  const t = pick(lang);
  return [
    { id: 'toybros', group: 'shop', name: 'Toybros', floor: 2, units: ['02-03'], row: 68, target: 'shop-network',
      status: t('Recorded interview', '录音采访'),
      body: t('Collectibles · #02-03. Locate the business, view its original photograph or return to the interview account.', '兴趣与收藏 · #02-03。查看店铺位置与原照，或回到相关采访叙事。'),
      detail: t('Kelvin describes opening a toy shop with two collector friends (5:06–5:24) and organising a flea market with Stephen in a previous shop space (7:20–7:41). Toybros is at #02-03.', 'Kelvin 讲述与两位收藏者朋友开设玩具店（5:06–5:24），以及和 Stephen 在此前的店铺空间组织跳蚤市场（7:20–7:41）。Toybros 位于 #02-03。') },
    { id: 'miku', group: 'shop', name: 'Miku Market', floor: 2, units: ['02-09'], row: 75,
      status: t('Shop information & photograph', '店铺资料与照片'),
      body: t('Collectibles · #02-09. Compare this location with neighbouring shops, or open the original storefront photograph.', '兴趣与收藏 · #02-09。对照附近商户的位置，或打开原始门面照片。'),
      detail: t('Miku Market is a hobby and collectibles shop at #02-09. The photograph shows its storefront.', 'Miku Market 是一家兴趣与收藏商店，位于 #02-09。照片呈现店铺门面。') },
    { id: 'dirty-laundry', group: 'shop', name: 'Dirty Laundry', floor: 3, units: ['03-46'], row: 247, target: 'shop-work',
      status: t('Recorded interview', '录音采访'),
      body: t('Vintage clothing · #03-46. Meet Karolina and explore her third-floor shop.', '中古服饰 · #03-46。认识 Karolina，走进她位于三楼的店铺。'),
      detail: t('Karolina discusses choosing her opening hours (part 1, 3:03–3:12), wallpaper and DIY decoration (part 2, 3:05–3:24). These daily choices give her room to run the shop in her own way. Dirty Laundry is at #03-46.', 'Karolina 谈到自行选择营业时间（第一段，3:03–3:12），以及墙纸和自己动手布置店铺（第二段，3:05–3:24）。这些日常选择，让她能按自己的方式经营。Dirty Laundry 位于 #03-46。') },
    { id: 'ishak', group: 'shop', name: 'Ishak · Newlink Sports', floor: 2, units: ['02-34', '02-42C'], row: 104, ambiguous: true, target: 'visitor-return',
      status: t('Recorded employee interview', '员工录音采访'),
      body: t('Newlink Sports · #02-34 / #02-42C. Explore the shop or hear Ishak’s experience of working here.', 'Newlink Sports · #02-34 / #02-42C。查看店铺位置，或听 Ishak 讲述在这里工作的经历。'),
      detail: t('Ishak recounts starting work at a Queensway sports shop in 2011, then joining Newlink Sports in 2018 after his previous employer closed (1:10–2:06). Newlink Sports occupies #02-34 and #02-42C; the map highlights #02-34.', 'Ishak 回忆 2011 年开始在女皇道的体育用品店工作；原雇主结业后，他于 2018 年加入 Newlink Sports（1:10–2:06）。Newlink Sports 位于 #02-34 与 #02-42C；地图高亮显示 #02-34。') }
  ];
}

export function explorationMarkup(lang = 'en') {
  const t = pick(lang);
  return `<section id="chapter-explore" class="story-step afterword-section community-explore" data-scene="11" data-afterword-label="${t('Explore the archive', '自由探索')}" aria-labelledby="ce-title">
    <div class="ce-layout">
      <div class="ce-reading">
        <p class="ce-eyebrow">${t('02 / EXPLORE THE ARCHIVE', '02 / 自由探索')}</p>
        <h2 id="ce-title">${t('Explore a place.<br><em>Meet its people.</em>', '找到一处地方，<br><em>看见人与联系。</em>')}</h2>
        <p class="ce-intro">${t('Explore shops, original photographs and source records. Choose a place or a person.', '按地点或人物，查找店铺、原照与资料。')}</p>
        <div class="ce-filters" role="group" aria-label="${t('Choose a collection', '选择资料类型')}">
          ${[['directory', t('Directory', '全部目录')], ['shop', t('Featured shops', '精选店铺')]].map(([id, label]) => `<button type="button" data-ce-filter="${id}" aria-pressed="${id === 'directory'}">${label}</button>`).join('')}
        </div>
        <div class="ce-search"><label class="ce-sr" for="ce-search">${t('Search names, units or trades', '搜索店名、铺号或业态')}</label><input id="ce-search" type="search" placeholder="${t('Name, unit or trade', '店名、铺号或业态')}" autocomplete="off" spellcheck="false" aria-controls="ce-account"><button type="button" data-ce-clear hidden aria-label="${t('Clear search', '清除搜索')}">×</button></div>
        <div class="ce-picker"><label class="ce-sr" for="ce-account">${t('Choose a record', '选择记录')}</label><select id="ce-account" aria-controls="ce-account-copy"><option>${t('Opening the directory…', '正在打开目录……')}</option></select><span aria-hidden="true">⌄</span></div>
        <div id="ce-account-copy" class="ce-account-copy" aria-live="polite" aria-atomic="true"></div>
        <div class="ce-reading-actions"><button type="button" data-ce-story-link hidden></button><button type="button" data-ce-contribute>${t('Add your perspective', '加入你的视角')} <span aria-hidden="true">↗</span></button><button type="button" data-ce-sources aria-haspopup="dialog">${t('Source & context', '来源与背景')} <span aria-hidden="true">＋</span></button></div>
      </div>
      <div class="ce-visual">
        <div class="ce-visual-tools"><div class="ce-floors" role="group" aria-label="${t('Choose a floor', '选择楼层')}">${[1, 2, 3].map(n => `<button type="button" data-ce-floor="${n}" aria-pressed="${n === 2}">${t('Level ' + n, n + ' 楼')}</button>`).join('')}</div><div class="ce-views" role="group" aria-label="${t('Choose a view', '选择视图')}"><button type="button" data-ce-view="map" aria-pressed="true">${t('Plan', '平面')}</button><button type="button" data-ce-view="photo" aria-pressed="false">${t('Photo', '照片')}</button></div></div>
        <div class="ce-map-panel"><div class="ce-map-host" aria-busy="true"><p class="ce-loading">${t('Opening the floor plan…', '正在展开楼层图……')}</p></div><p class="ce-location-note"></p></div>
        <figure class="ce-photo-panel" hidden><button type="button" class="ce-photo-open" aria-label="${t('Enlarge original photograph', '放大原照片')}"><img alt="" decoding="async"></button><figcaption></figcaption></figure>
        <div class="ce-visual-foot"><p>${t('Floor plan · Archiving Queensway', '楼层图 · Archiving Queensway')}</p><button type="button" data-ce-directory>${t('Open the full floor view', '打开完整楼层视图')} <span aria-hidden="true">↗</span></button></div>
      </div>
    </div>
  </section>`;
}

export function mountExploration(root, { lang = 'en', onContribute = () => {}, onFloor = () => {}, onNavigate = () => {} } = {}) {
  const section = root?.matches?.('#chapter-explore') ? root : root?.querySelector?.('#chapter-explore');
  if (!section) { const empty = () => {}; empty.destroy = empty; empty.ready = Promise.resolve(); empty.selectAccount = () => {}; return empty; }
  const t = pick(lang), curated = indexRecords(lang), controller = new AbortController(), { signal } = controller;
  const $ = selector => section.querySelector(selector);
  let state = { mode: 'directory', floor: 2, selected: 'directory:68', query: '', view: 'map' };
  let sourceInterview = null;
  let directory = [], regions = {}, photos = [], dataReady = false, dead = false, loadFailed = false;
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (saved && ['directory', 'shop'].includes(saved.mode) && [1, 2, 3].includes(saved.floor)) {
      state = { ...state, mode: saved.mode, floor: saved.floor, selected: String(saved.selected || ''), query: String(saved.query || '').slice(0, 120), view: saved.view === 'photo' ? 'photo' : 'map' };
    }
  } catch {}
  const save = () => { try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(state)); } catch {} };
  const category = row => lang === 'zh' ? categories[row.category] || row.category : row.category;
  const directoryName = row => /^(for rent|unused\/store room)$/i.test(row.name) ? (lang === 'zh' ? categories[row.name] || row.name : row.name) : row.name;
  const directoryId = row => `directory:${row.row}`;
  const records = () => curated;
  const selected = () => state.selected.startsWith('directory:') ? directory.find(row => directoryId(row) === state.selected) : records().find(record => record.id === state.selected);
  const isDirectory = () => state.selected.startsWith('directory:');
  const matchesQuery = row => {
    const words = normal(state.query).replace(/#/g, '').split(/\s+/).filter(Boolean);
    const haystack = normal([row.name, row.unit, row.category, categories[row.category], row.note].join(' '));
    return words.every(word => haystack.includes(word));
  };
  const collection = () => state.mode === 'directory' ? directory.filter(matchesQuery) : records().filter(record => record.group === state.mode);
  const idFor = record => state.mode === 'directory' ? directoryId(record) : record.id;
  function exactPhoto(row) {
    return photos.find(item => Number(item.row) === Number(row?.row) && Number(item.floor) === Number(row?.floor) && item.unit === row?.unit && normal(item.name) === normal(row?.name))?.photo || null;
  }
  function currentPhoto(record = selected()) {
    if (!record) return null;
    if (record.photo) return { ...record.photo, caption: `${record.name} · ${record.status}` };
    const row = isDirectory() ? record : directory.find(item => Number(item.row) === Number(record.row));
    const photo = exactPhoto(row);
    if (!photo) return null;
    const label = photo.scope === 'unit' ? `${row.name} · #${row.unit} · ${t('Unit photograph', '铺位原照')}` : `${row.name} · ${t('Business photograph', '商家原照')}`;
    return { ...photo, alt: label, caption: label };
  }
  function location(record = selected()) {
    if (!record) return { place: t('Queensway Shopping Centre', '女皇道购物中心'), floor: null, unit: '', storyId: '' };
    if (isDirectory()) return { place: record.name, floor: Number(record.floor), unit: record.unit, storyId: '' };
    return { place: record.ambiguous ? 'Newlink Sports' : record.floor ? record.name : t('Queensway Shopping Centre', '女皇道购物中心'), floor: record.floor, unit: record.units.length === 1 ? record.units[0] : '', storyId: record.id };
  }
  function ensureSelection(preferredFloor) {
    const list = collection();
    if (!list.some(record => idFor(record) === state.selected)) {
      const first = list.find(record => Number(record.floor) === Number(preferredFloor ?? state.floor)) || list[0];
      state.selected = first ? idFor(first) : '';
    }
    const record = selected();
    if (record?.floor) state.floor = Number(record.floor);
  }
  function choose(id, { animate = true, photo = false } = {}) {
    let record;
    if (id.startsWith('directory:')) { record = directory.find(row => directoryId(row) === id); if (record) { state.mode = 'directory'; if (!matchesQuery(record)) state.query = ''; } }
    else { record = records().find(item => item.id === id); if (record) state.mode = record.group; }
    if (!record) return;
    state.selected = id;
    if (record.floor) state.floor = Number(record.floor);
    if (photo || !record.floor && !isDirectory() && currentPhoto(record)) state.view = 'photo';
    if (dataReady && state.view === 'photo' && !currentPhoto(record)) state.view = 'map';
    save(); render(animate);
  }
  function renderPicker() {
    const list = collection();
    $('.ce-search').hidden = state.mode !== 'directory';
    if ($('#ce-search').value !== state.query) $('#ce-search').value = state.query;
    $('[data-ce-clear]').hidden = !state.query;
    section.querySelectorAll('[data-ce-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.ceFilter === state.mode)));
    $('#ce-account').innerHTML = list.length ? list.map(record => {
      const label = state.mode === 'directory' ? `${directoryName(record)} · #${record.unit}` : record.name;
      return `<option value="${esc(idFor(record))}"${idFor(record) === state.selected ? ' selected' : ''}>${esc(label)}</option>`;
    }).join('') : `<option>${state.mode === 'directory' && !dataReady ? t('Opening the directory…', '正在打开目录……') : t('Try another search', '请调整搜索词')}</option>`;
    $('#ce-account').disabled = !list.length;
  }
  function relatedStory(row) {
    return curated.find(record => {
      if (record.group !== 'shop' || !record.units.includes(row.unit) || Number(record.floor) !== Number(row.floor)) return false;
      if (Number(record.row) === Number(row.row)) return true;
      const sourceRow = directory.find(item => Number(item.row) === Number(record.row));
      const businessName = normal(sourceRow?.name || record.name);
      return !!businessName && businessName === normal(row.name);
    });
  }
  function renderCopy() {
    const record = selected(), story = record && (isDirectory() ? relatedStory(record) : record);
    const storyLink = $('[data-ce-story-link]');
    storyLink.hidden = !story?.target;
    storyLink.dataset.ceNavigate = story?.target || '';
    storyLink.innerHTML = `${t('Read the related story', '回到相关叙事')} <span aria-hidden="true">↗</span>`;
    $('[data-ce-sources]').disabled = !record;
    if (!record) {
      $('#ce-account-copy').innerHTML = `<p class="ce-status">${loadFailed ? t('Browse the people index', '浏览人物索引') : t('Browse at your own pace', '按自己的兴趣探索')}</p><p>${loadFailed ? t('The interview index is still available. Choose a shop account above.', '仍可浏览采访索引。请选择上方的商户记录。') : state.query ? t('Try another name, unit or trade. Search works across all three floors.', '试试其他店名、铺号或业态。搜索覆盖全部三个楼层。') : t('Choose a record above, or a unit on the plan.', '从上方选择记录，或点选图中的铺位。')}</p>`;
      return;
    }
    if (isDirectory()) {
      const siblings = directory.filter(row => Number(row.floor) === Number(record.floor) && row.unit === record.unit);
      const vacant = /^(for rent|unused\/store room)$/i.test(record.name);
      const siteLink = /^https?:\/\//i.test(record.url || '') ? `<a class="ce-shop-link" href="${esc(record.url)}" target="_blank" rel="noopener noreferrer">${t('Shop website / social page', '店铺网站／社交主页')} ↗</a>` : '';
      const body = vacant ? t('Explore this unit’s location and recorded use.', '查看铺位位置与使用状态。') : t('Explore the shop’s location and photograph.', '查看店铺位置与照片。');
      $('#ce-account-copy').innerHTML = `<p class="ce-status">${t('Directory record', '目录记录')} · ${esc(category(record) || t('Directory entry', '目录条目'))}</p><p>${body}</p>${siteLink}${siblings.length > 1 ? `<div class="ce-shared-unit"><p>${t('More than one record at this unit:', '这个铺位有多条目录记录：')}</p>${siblings.map(row => `<button type="button" data-ce-row="${row.row}" aria-pressed="${Number(row.row) === Number(record.row)}">${esc(directoryName(row))}</button>`).join('')}</div>` : ''}`;
    } else {
      $('#ce-account-copy').innerHTML = `<p class="ce-status">${esc(record.status)}</p><p>${esc(record.body || '')}</p>`;
    }
  }
  function mapMarkup() {
    const floor = state.floor, record = selected(), floorRows = directory.filter(row => Number(row.floor) === floor), floorRegions = regions[floor] || [];
    const highlighted = record && Number(record.floor) === floor ? isDirectory() ? [record.unit] : record.units : [];
    const focusable = floorRegions.find(region => highlighted.includes(region.id))?.id || floorRegions.find(region => floorRows.some(row => row.unit === region.id))?.id;
    const dots = state.mode === 'shop' ? curated.filter(item => item.group === 'shop' && Number(item.floor) === floor) : [];
    return `<svg class="ce-plan" viewBox="0 0 1024 768" role="group" aria-label="${t('Level ' + floor + ' directory plan. Use arrow keys to move between units.', floor + ' 楼目录平面。可用方向键选择铺位。')}">
      <image class="ce-base-plan" href="assets/floorplans/floor-${floor}.svg" x="0" y="0" width="1024" height="768" aria-hidden="true"/>
      <g>${floorRegions.map(region => {
        const unitRows = floorRows.filter(item => item.unit === region.id); if (!unitRows.length) return '';
        const selectedRow = unitRows.find(item => Number(item.row) === Number(record?.row));
        const label = selectedRow ? directoryName(selectedRow) : unitRows.length > 1
          ? t(`${unitRows.length} directory records`, `${unitRows.length} 条目录记录`)
          : directoryName(unitRows[0]);
        const match = state.mode === 'directory' && state.query && floorRows.some(item => item.unit === region.id && matchesQuery(item));
        return `<path d="${esc(region.d)}" class="ce-unit${highlighted.includes(region.id) ? ' is-selected' : ''}${match ? ' is-match' : ''}" data-ce-unit="${esc(region.id)}" role="button" tabindex="${region.id === focusable ? '0' : '-1'}" aria-label="${esc(label)} · #${esc(region.id)}"><title>${esc(label)} · #${esc(region.id)}</title></path>`;
      }).join('')}</g>
      <g class="ce-story-markers">${dots.flatMap(item => item.units.map(unit => {
        const area = floorRegions.find(region => region.id === unit); if (!area) return '';
        return `<g class="ce-story-marker${item.id === state.selected ? ' is-selected' : ''}" transform="translate(${Number(area.x)},${Number(area.y)})" data-ce-story="${esc(item.id)}" role="button" tabindex="0" aria-label="${esc(item.name)} · #${esc(unit)}"><circle class="ce-marker-halo" r="24"/><circle class="ce-marker-dot" r="9"/></g>`;
      })).join('')}</g>
    </svg>`;
  }
  function renderVisual() {
    const record = selected(), photo = currentPhoto(record);
    if (dataReady && state.view === 'photo' && !photo) state.view = 'map';
    if (Object.keys(regions).length) { $('.ce-map-host').innerHTML = mapMarkup(); $('.ce-map-host').setAttribute('aria-busy', 'false'); }
    if (loadFailed) { $('.ce-map-host').innerHTML = `<p class="ce-loading">${t('Choose an account in the people index, or refresh to load the floor plan.', '可先选择人物索引中的记录，或刷新以载入楼层图。')}</p>`; $('.ce-map-host').setAttribute('aria-busy', 'false'); }
    $('.ce-visual-foot p').textContent = state.view === 'map' ? t('Floor plan · Archiving Queensway', '楼层图 · Archiving Queensway') : t('Original photograph · select to enlarge', '原始照片 · 点击放大');
    section.querySelectorAll('[data-ce-floor]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.ceFloor) === state.floor)));
    section.querySelectorAll('[data-ce-view]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.ceView === state.view)); button.disabled = button.dataset.ceView === 'photo' && !photo; });
    $('.ce-map-panel').hidden = state.view !== 'map'; $('.ce-photo-panel').hidden = state.view !== 'photo';
    $('.ce-photo-open').disabled = !photo;
    if (photo) { $('.ce-photo-open img').src = photo.src; $('.ce-photo-open img').alt = photo.alt; $('.ce-photo-panel figcaption').textContent = photo.caption; }
    const hasRegion = record?.floor && (regions[state.floor] || []).some(region => (isDirectory() ? [record.unit] : record.units).includes(region.id));
    $('.ce-location-note').textContent = !record ? t('Select a unit to open its record.', '点选铺位，打开对应记录。') : !record.floor ? t('Location · Queensway Shopping Centre', '地点 · 女皇道购物中心') : record.ambiguous ? t('Newlink Sports · #02-34', 'Newlink Sports · #02-34') : !hasRegion ? t('Shop location · see unit number', '店铺位置 · 参见铺号') : isDirectory() ? `${directoryName(record)} · #${record.unit}` : `${record.name} · #${record.units.join(' / #')}`;
  }
  function render(animate = false) {
    renderPicker(); renderCopy(); renderVisual();
    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $('#ce-account-copy').animate([{ opacity: .15, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 440, easing: 'cubic-bezier(.2,.7,.2,1)' });
      $('.ce-visual').animate([{ opacity: .65 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' });
    }
  }
  const photoDialog = document.createElement('dialog');
  photoDialog.className = 'ce-photo-dialog'; photoDialog.setAttribute('aria-label', t('Original photograph', '原照片'));
  photoDialog.innerHTML = `<button type="button" data-ce-close aria-label="${t('Close photograph', '关闭照片')}">×</button><figure><img alt=""><figcaption></figcaption></figure>`;
  const sourceDialog = document.createElement('dialog');
  sourceDialog.className = 'ce-source-dialog'; sourceDialog.setAttribute('aria-labelledby', 'ce-source-title');
  sourceDialog.innerHTML = `<button type="button" data-ce-close aria-label="${t('Close source details', '关闭来源详情')}">×</button><div class="ce-source-content"></div>`;
  document.body.append(photoDialog, sourceDialog);
  for (const dialog of [photoDialog, sourceDialog]) {
    dialog.querySelector('[data-ce-close]').addEventListener('click', () => dialog.close(), { signal });
    dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } }, { signal });
  }
  photoDialog.addEventListener('close', () => $('.ce-photo-open')?.focus({ preventScroll: true }), { signal });
  sourceDialog.addEventListener('close', () => { sourceInterview?.pause(); $('[data-ce-sources]')?.focus({ preventScroll: true }); }, { signal });
  function updateInterviewNotes() {
    const audioRoot = sourceDialog.querySelector('.interview-audio'), notes = sourceDialog.querySelector('[data-ce-interview-notes]');
    if (audioRoot && notes) notes.innerHTML = interviewAudioSourceNotesMarkup(lang, audioRoot.dataset.interviewSet, audioRoot.dataset.interviewTopic);
  }
  sourceDialog.addEventListener('interviewclipchange', updateInterviewNotes, { signal });
  function showSources() {
    const record = selected(); if (!record) return;
    sourceInterview?.destroy(); sourceInterview = null;
    const matches = [
      [68, 'Toybros', '02-03', 'toybros'], [77, "Kalibak's Kave", '02-10', 'stephen'],
      [89, 'Blueprint Principles', '02-20', 'pamela-business'], [141, 'Blueprint Principles', '02-40', 'pamela-business'],
      [151, "Frank's Leathersmith", '02-41F', 'frank'], [104, 'Newlink Sports', '02-34', 'ishak-work'],
      [160, 'Newlink Sports', '02-42C', 'ishak-work'], [247, 'Dirty Laundry', '03-46', 'dirty-laundry']
    ];
    const audioSet = isDirectory() ? matches.find(([row,name,unit])=>Number(record.row)===row && record.name===name && record.unit===unit)?.[3] : ({toybros:'toybros','dirty-laundry':'dirty-laundry',ishak:'ishak-work'})[record.id];
    let content;
    if (isDirectory()) content = `<p>${t('Browse the shop names, unit numbers and types of business. Where a unit has more than one shop record, each can be explored separately.', '浏览店名、铺号与经营类型。同一铺位的不同商户记录，可以分别查看。')}</p><p>${t('Floor plans and photograph collection · Archiving Queensway. Search by shop name, unit number or type of business to find a place.', '楼层图与图像档案 · Archiving Queensway。按店名、铺号或经营类型，找到想了解的地方。')}</p>`;
    else content = `<p>${esc(record.detail)}</p>`;
    const photo = currentPhoto(record);
    if (photo?.src) content += external(photo.src, t('View photograph', '查看照片'));
    sourceDialog.querySelector('.ce-source-content').innerHTML = `<p class="ce-dialog-kicker">${t('SOURCE & CONTEXT', '来源与背景')}</p><h2 id="ce-source-title">${esc(isDirectory() ? directoryName(record) : record.name)}</h2>${audioSet ? interviewAudioMarkup(lang,audioSet,'archive-'+audioSet)+'<div data-ce-interview-notes></div>' : ''}${content}`;
    if (audioSet) { sourceInterview = mountInterviewAudio(sourceDialog,{lang}); updateInterviewNotes(); }
    sourceDialog.showModal();
  }
  function chooseUnit(unit) {
    const candidates = directory.filter(row => Number(row.floor) === state.floor && row.unit === unit);
    const row = candidates.find(matchesQuery) || candidates[0]; if (row) choose(directoryId(row));
  }
  section.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null; if (!target) return;
    const filter = target.closest('[data-ce-filter]');
    if (filter) { state.mode = filter.dataset.ceFilter; state.selected = ''; ensureSelection(); state.view = 'map'; save(); render(true); return; }
    const floor = target.closest('[data-ce-floor]');
    if (floor) {
      state.floor = Number(floor.dataset.ceFloor); state.view = 'map';
      if (state.mode === 'directory' || state.mode === 'shop') { const first = collection().find(record => Number(record.floor) === state.floor); state.selected = first ? idFor(first) : ''; }
      save(); render(true); return;
    }
    const view = target.closest('[data-ce-view]'); if (view) { state.view = view.dataset.ceView; save(); renderVisual(); return; }
    const marker = target.closest('[data-ce-story]'); if (marker) { choose(marker.dataset.ceStory); return; }
    const unit = target.closest('[data-ce-unit]'); if (unit) { chooseUnit(unit.dataset.ceUnit); return; }
    const row = target.closest('[data-ce-row]'); if (row) { choose(`directory:${row.dataset.ceRow}`); return; }
    if (target.closest('[data-ce-clear]')) { state.query = ''; ensureSelection(); save(); render(true); $('#ce-search').focus(); return; }
    if (target.closest('[data-ce-contribute]')) { onContribute(location()); return; }
    if (target.closest('[data-ce-directory]')) { onFloor(state.floor); return; }
    const story = target.closest('[data-ce-navigate]'); if (story?.dataset.ceNavigate) { onNavigate(story.dataset.ceNavigate); return; }
    if (target.closest('[data-ce-sources]')) { showSources(); return; }
    if (target.closest('.ce-photo-open')) { const photo = currentPhoto(); if (photo) { photoDialog.querySelector('img').src = photo.src; photoDialog.querySelector('img').alt = photo.alt; photoDialog.querySelector('figcaption').textContent = photo.caption; photoDialog.showModal(); } }
  }, { signal });
  section.addEventListener('input', event => { if (event.target.id === 'ce-search') { state.query = event.target.value.slice(0, 120); ensureSelection(); save(); render(); } }, { signal });
  section.addEventListener('change', event => { if (event.target.id === 'ce-account') choose(event.target.value); }, { signal });
  section.addEventListener('keydown', event => {
    const marker = event.target.closest('[data-ce-story]');
    if (marker && ['Enter', ' '].includes(event.key)) { event.preventDefault(); const id = marker.dataset.ceStory; choose(id); section.querySelector(`[data-ce-story="${CSS.escape(id)}"]`)?.focus({ preventScroll: true }); return; }
    const unit = event.target.closest('[data-ce-unit]');
    if (unit) {
      if (['Enter', ' '].includes(event.key)) { event.preventDefault(); const id = unit.dataset.ceUnit; chooseUnit(id); section.querySelector(`[data-ce-unit="${CSS.escape(id)}"]`)?.focus({ preventScroll: true }); return; }
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
        event.preventDefault(); const nodes = [...section.querySelectorAll('[data-ce-unit]')], index = nodes.indexOf(unit);
        const next = event.key === 'Home' ? nodes[0] : event.key === 'End' ? nodes.at(-1) : nodes[(index + (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) + nodes.length) % nodes.length];
        nodes.forEach(node => node.tabIndex = -1); next.tabIndex = 0; next.focus({ preventScroll: true }); return;
      }
    }
    const group = event.target.closest('.ce-filters,.ce-floors,.ce-views');
    if (!group || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = [...group.querySelectorAll('button:not(:disabled):not([hidden])')], index = buttons.indexOf(event.target); if (index < 0) return;
    event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus(); buttons[next].click();
  }, { signal });
  if (state.mode !== 'directory') ensureSelection();
  render();
  const ready = Promise.all(['floor-regions.json', 'updated-directory.json', 'shop-photos.json?v=20261108-release1'].map(async name => {
    const response = await fetch(new URL('./data/' + name + '?v=20261108-public-team1', import.meta.url), { signal }); if (!response.ok) throw new Error(name); return response.json();
  })).then(([plan, shops, images]) => {
    if (dead) return;
    regions = plan.floors || {}; directory = (shops.rows || []).filter(row => [1, 2, 3].includes(Number(row.floor)) && row.unit && normal(row.name)); photos = images.records || []; dataReady = true;
    ensureSelection(); render(); save();
  }).catch(error => { if (dead || error.name === 'AbortError') return; dataReady = true; loadFailed = true; render(); });
  const destroy = () => { sourceInterview?.destroy(); dead = true; save(); controller.abort(); photoDialog.remove(); sourceDialog.remove(); };
  destroy.destroy = destroy; destroy.ready = ready; destroy.getContext = () => location(); destroy.selectAccount = id => choose(String(id));
  return destroy;
}
