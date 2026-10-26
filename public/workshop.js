import { t } from './i18n.js?v=0.15.2';
import { acceptsWorkshopCode, buildArtCatalog, EMOTIONS, CORE_EMOTIONS } from './workshop-model.js?v=7';

const el = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = t(text);
  if (className) node.className = className;
  return node;
};
const statusLabel = { active: 'В игре', archive: 'Прежняя версия', draft: 'Эскиз · не подключено', asset: 'Ресурс' };

export function mountWorkshopEntry(container, open) {
  const form = el('form', '', 'workshop-code');
  const label = el('label', 'Промокод');
  const input = el('input');
  input.id = 'workshop-code'; input.type = 'text'; input.autocomplete = 'off';
  input.autocapitalize = 'none'; input.spellcheck = false;
  label.htmlFor = input.id;
  const button = el('button', 'Открыть', 'secondary'); button.type = 'submit';
  const message = el('p'); message.setAttribute('role', 'status');
  form.append(label, input, button, message);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!acceptsWorkshopCode(input.value)) { message.textContent = t('Промокод не найден'); return; }
    input.value = ''; open();
  });
  container.append(form);
}

export async function mountWorkshop(container, { sprites, backgrounds, back }) {
  container.classList.add('workshop');
  const backButton = el('button', '← К настройкам', 'text-button'); backButton.onclick = back;
  const intro = el('p', 'Персонажи, эмоции и ресурсы игры. Здесь можно смотреть изображения и находить пробелы в наборе.', 'workshop-intro');
  const loading = el('p', 'Загрузка…'); container.replaceChildren(backButton, intro, loading);
  let catalog;
  try {
    const response = await fetch('./art-assets.json', { cache: 'no-store' });
    if (!response.ok) throw Error('Inventory unavailable');
    catalog = buildArtCatalog(await response.json(), sprites, backgrounds);
  } catch {
    loading.textContent = t('Не удалось загрузить библиотеку. Откройте мастерскую ещё раз.'); return;
  }
  if (!loading.isConnected) return;
  loading.remove();
  const tabs = el('div', '', 'workshop-tabs'); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', t('Разделы мастерской'));
  const people=[...catalog.people,...catalog.supporting];
  const controls = el('div', '', 'workshop-controls');
  const search = el('input'); search.type = 'search'; search.placeholder = t('Имя, эмоция или имя файла'); search.setAttribute('aria-label', t('Поиск по библиотеке'));
  const category = el('select'); category.setAttribute('aria-label', t('Тип ресурса'));
  for (const [value, label] of Object.entries({ all: 'Все ресурсы', characters: 'Персонажи', backgrounds: 'Фоны', images: 'Другие изображения', audio: 'Музыка', fonts: 'Шрифты', other: 'Другие файлы' })) {
    const option = el('option', label); option.value = value; category.append(option);
  }
  const archives = el('label', '', 'workshop-archive-toggle');
  const checkbox = el('input'); checkbox.type = 'checkbox'; archives.append(checkbox, document.createTextNode(t('Показать прежние версии')));
  const results = el('div'); results.setAttribute('aria-live', 'polite');
  controls.append(search, category, archives); container.append(tabs, controls, results);
  let view = 'characters';
  const looks = el('select'); looks.setAttribute('aria-label', t('Образ персонажа'));
  for (const value of ['all', ...new Set(catalog.entries.filter(e=>e.character).map(e=>e.look))]) { const option=el('option',value==='all'?'Все образы':value);option.value=value;looks.append(option); }
  controls.insertBefore(looks, archives);
  const matches = entry => {
    if(looks.value!=='all' && entry.look!==looks.value)return false;
    const query = search.value.trim().toLocaleLowerCase();
    return !query || [entry.file, entry.character, people.find(p => p.id === entry.character)?.name, t(people.find(p => p.id === entry.character)?.name ?? ''), t(EMOTIONS[entry.emotion] ?? ''), entry.emotion, t(entry.look)].some(v => v?.toLocaleLowerCase().includes(query));
  };
  function card(entry) {
    const item = el('figure', '', 'workshop-card');
    const url = './assets/' + entry.file;
    if (entry.image) {
      const link = el('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener'; link.setAttribute('aria-label', t('Открыть изображение') + ': ' + entry.file);
      const image = el('img'); image.src = url; image.loading = 'lazy'; image.alt = [t(people.find(p => p.id === entry.character)?.name ?? 'Ресурс'), t(EMOTIONS[entry.emotion] ?? entry.look)].join(' · ');
      image.addEventListener('error', () => { image.hidden = true; item.prepend(el('p', 'Файл недоступен', 'workshop-missing')); }, { once: true });
      link.append(image); item.append(link);
    } else if (entry.category === 'audio') {
      const audio = el('audio'); audio.controls = true; audio.preload = 'none'; audio.src = url; item.append(audio);
    }
    const caption = el('figcaption');
    const person = people.find(p => p.id === entry.character);
    if (person) caption.append(el('strong', person.name));
    caption.append(el('strong', EMOTIONS[entry.emotion] ?? (entry.character ? 'Постановочная сцена' : 'Ресурс')));
    if (person) caption.append(el('span', entry.look));
    caption.append(el('small', statusLabel[entry.status], 'workshop-status ' + entry.status));
    const link = el('a'); link.textContent = entry.file; link.href = url; link.target = '_blank'; link.rel = 'noopener'; caption.append(link); item.append(caption);
    return item;
  }
  function render() {
    results.replaceChildren();
    category.hidden = view !== 'assets'; archives.hidden = view !== 'characters'; search.hidden = view === 'gaps';
    for (const button of tabs.children) button.setAttribute('aria-pressed', String(button.dataset.view === view));
    if (view === 'gaps') {
      results.append(el('p', t('Набор эмоций') + ': ' + Object.values(EMOTIONS).map(label=>t(label)).join(', ') + '. ' + t('Каждый образ проверяется отдельно.'), 'workshop-intro'));
      for (const person of catalog.people) {
        const section = el('section', '', 'workshop-person'); section.append(el('h3', person.name));
        section.append(el('p', person.missing.length ? t('Не хватает:') + ' ' + person.missing.map(m => t(EMOTIONS[m])).join(', ') : 'Базовые эмоции собраны', person.missing.length ? 'workshop-missing' : ''));
        for(const look of person.looks){
          const row=el('div','','workshop-look-coverage');row.append(el('h4',look.name),el('p',t('В игре')+': '+look.activeCount+'/'+CORE_EMOTIONS.length));
          if(look.missing.length)row.append(el('p',t('Не хватает:')+' '+look.missing.map(m=>t(EMOTIONS[m])).join(', '),'workshop-missing'));
          else if(look.missingInGame.length)row.append(el('p',t('Ещё не подключено:')+' '+look.missingInGame.map(m=>t(EMOTIONS[m])).join(', ')));
          section.append(row);
        }
        section.append(el('p',person.underwear?'Бельё: изображение подготовлено':'Бельё: изображения пока нет',person.underwear?'workshop-wardrobe-ready':'workshop-wardrobe-missing'));
        if (person.art.some(a => a.status === 'draft')) section.append(el('p', 'Есть эскиз, ещё не подключённый к сценарию.'));
        results.append(section);
      }
      results.append(el('h3','Эпизодические собеседники'));
      for(const person of catalog.supporting){const row=el('section','','workshop-supporting-status');row.append(el('h4',person.name),el('p',person.missing.length?'Портрет пока не создан':'Портрет подготовлен'));results.append(row);}
    } else if (view === 'characters' || view === 'supporting') {
      for (const person of view==='supporting'?catalog.supporting:catalog.people) {
        const art = person.art.filter(e => (checkbox.checked || e.status !== 'archive') && matches(e));
        if ((search.value.trim() || looks.value!=='all') && !art.length) continue;
        const section = el('section', '', 'workshop-person'+(view==='supporting'?' workshop-supporting-person':'')); section.append(el('h3', person.name));
        if(view==='supporting')section.append(el('p','Эпизодический собеседник','workshop-intro'));
        if (person.missing.length) section.append(el('p', t('Не хватает:') + ' ' + person.missing.map(m => t(EMOTIONS[m])).join(', '), 'workshop-missing'));
        const grid = el('div', '', 'workshop-grid'); art.forEach(e => grid.append(card(e)));
        if (!art.length) grid.append(el('p', 'Изображений пока нет')); section.append(grid); results.append(section);
      }
    } else {
      const grid = el('div', '', 'workshop-grid');
      catalog.entries.filter(e => (category.value === 'all' || e.category === category.value) && matches(e)).forEach(e => grid.append(card(e))); results.append(grid);
      if (!grid.children.length) results.append(el('p', 'Ничего не найдено'));
    }
    if (!results.children.length) results.append(el('p', 'Ничего не найдено'));
  }
  for (const [value, label] of Object.entries({ characters: 'Персонажи', supporting: 'Эпизодические', assets: 'Ассеты', gaps: 'Чего не хватает' })) {
    const button = el('button', label, 'secondary'); button.dataset.view = value; button.onclick = () => { view = value; render(); }; tabs.append(button);
  }
  looks.addEventListener('change', render); search.addEventListener('input', render); category.addEventListener('change', render); checkbox.addEventListener('change', render); render();
}
