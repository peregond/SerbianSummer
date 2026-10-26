import { t } from './i18n.js?v=0.15.0';
import { MESSENGER_CONFIG } from './messenger-config.js?v=1';

const icons = {
  back: ['m14 4-8 8 8 8'],
  down: ['M12 3v17', 'm5 13 7 7 7-7'],
  chevron: ['m7 9 5 5 5-5'],
  phone: ['M7 3 3 5c-1 7 9 17 16 16l2-4-5-3-2 2-6-6 2-2-3-5Z'],
  video: ['M3 6h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3V6Z', 'm16 10 5-3v10l-5-3'],
  plus: ['M12 5v14M5 12h14', 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z'],
  smile: ['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z', 'M8 9h.01M16 9h.01M7 14q5 6 10 0'],
  photo: ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z', 'm3 16 6-6 6 6 4-3 2 2', 'M17 7h.01'],
  microphone: ['M9 5a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0V5Z', 'M6 11v2a6 6 0 0 0 12 0v-2M12 19v3M9 22h6'],
  send: ['m3 3 19 9-19 9 4-9-4-9Z', 'M7 12h15'],
  ticks: ['m2 12 4 4L17 5', 'm10 14 2 2L23 5'],
  heart: ['M12 21 3 12C-3 4 7-2 12 5c5-7 15-1 9 7L12 21Z'],
  edit: ['m4 16 11-11 4 4L8 20H4v-4Z', 'm14 6 4 4']
};

// Reusable DOM template. Story progression and persistence belong to the callbacks.
export function mountMessenger(root, frame, { onSend, onContinue, onBack, onMenu, onSettings, canRewind, theme = MESSENGER_CONFIG }) {
  const doc = root.ownerDocument;
  const el = (tag, text, className) => {
    const node = doc.createElement(tag); if (text) node.textContent = t(text); if (className) node.className = className; return node;
  };
  const icon = name => {
    const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5'); svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round'); svg.setAttribute('aria-hidden', 'true');
    for (const d of icons[name]) { const path = doc.createElementNS(svg.namespaceURI, 'path'); path.setAttribute('d', d); svg.append(path); }
    return svg;
  };
  const events = new AbortController();
  const listen = (node, event, callback) => node.addEventListener(event, callback, { signal: events.signal });
  const button = (label, callback, className) => {
    const node = el('button', '', className); node.type = 'button'; node.setAttribute('aria-label', t(label)); node.title = t(label);
    listen(node, 'click', callback); return node;
  };
  root.replaceChildren(); root.style.setProperty('--chat-accent', theme.accent);
  const header = el('header', '', 'chat-header');
  const back = button('← Назад', onBack, 'chat-back'); back.disabled = !canRewind; back.append(icon('back'));
  const identity = el('div', '', 'chat-identity');
  const avatar = el('span', '', 'chat-avatar'); avatar.setAttribute('aria-hidden', 'true');
  const avatarFile = theme.avatars?.[frame.contact];
  if (avatarFile) {
    const image = el('img'); image.alt = ''; image.src = './assets/' + avatarFile;
    listen(image, 'error', () => { image.hidden = true; avatar.textContent = t(frame.contact)[0]; }); avatar.append(image);
  } else avatar.textContent = t(frame.contact)[0];
  const person = el('div', '', 'chat-person');
  const nameLine = el('div', '', 'chat-name-line'); const title = el('h2', frame.contact); title.id = 'messenger-title'; title.tabIndex = -1;
  const menu = el('div', '', 'chat-contact-menu'); menu.hidden = true;
  const menuToggle = button('Меню переписки', () => { menu.hidden = !menu.hidden; menuToggle.setAttribute('aria-expanded', String(!menu.hidden)); }, 'chat-contact-toggle'); menuToggle.append(icon('chevron')); menuToggle.setAttribute('aria-expanded', 'false');
  for (const [label, run] of [['Меню', onMenu], ['Настройки', onSettings]]) {
    const item = button(label, () => { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); run(); }, 'chat-menu-item'); item.textContent = t(label); menu.append(item);
  }
  nameLine.append(title, menuToggle); person.append(nameLine, el('p', theme.title, 'chat-channel')); identity.append(avatar, person);
  const calls = el('span', '', 'chat-call-pill'); calls.setAttribute('aria-hidden', 'true'); calls.append(icon('phone'), icon('video'));
  header.append(back, identity, calls, menu);
  const feed = el('div', '', 'chat-feed'); feed.setAttribute('role', 'log'); feed.setAttribute('aria-label', t('Переписка')); feed.setAttribute('aria-live', 'polite');
  const bubble = message => {
    const row = el('div', '', 'chat-row ' + message.direction);
    const article = el('article', '', 'chat-bubble ' + message.direction);
    article.setAttribute('aria-label', t(message.direction === 'outgoing' ? 'Исходящее сообщение' : 'Входящее сообщение'));
    if (message.quote) {
      const quote = el('blockquote', '', 'chat-quote'); quote.append(el('strong', message.quote.author ?? frame.contact), el('p', message.quote.text)); article.append(quote);
    }
    article.append(el('p', message.text));
    const meta = el('span', '', 'chat-meta');
    if (message.time || frame.time) meta.append(el('time', message.time || frame.time));
    if (message.direction === 'outgoing') { const ticks = el('span', '', 'chat-ticks'); ticks.setAttribute('aria-label', t('Отправлено')); ticks.append(icon('ticks')); meta.append(ticks); }
    article.append(meta);
    const reaction = button('Нравится сообщение', () => { const liked = reaction.getAttribute('aria-pressed') !== 'true'; reaction.setAttribute('aria-pressed', String(liked)); }, 'chat-reaction'); reaction.setAttribute('aria-pressed', 'false'); reaction.append(icon('heart'));
    row.append(article, reaction); feed.append(row);
  };
  frame.messages.forEach(bubble);
  if (frame.context) feed.append(el('p', frame.context, 'chat-context'));
  const footer = el('footer', '', 'chat-footer');
  const replies = el('div', '', 'chat-replies'); replies.hidden = true; replies.setAttribute('role', 'group'); replies.setAttribute('aria-label', t('Выбери ответ'));
  const suggested = button('Варианты ответов', () => { replies.hidden = !replies.hidden; suggested.setAttribute('aria-expanded', String(!replies.hidden)); }, 'chat-suggested');
  suggested.setAttribute('aria-expanded', 'false'); suggested.hidden = !frame.replies.length;
  suggested.append(el('span', '✦', 'chat-suggested-star'), el('span', 'Варианты ответов'), icon('edit'));
  const form = el('form', '', 'chat-compose');
  const attach = el('span', '', 'chat-attach'); attach.setAttribute('aria-hidden', 'true'); attach.append(icon('plus'));
  const field = el('div', '', 'chat-compose-field');
  const label = el('label', 'Черновик сообщения', 'chat-sr-only'); label.htmlFor = 'chat-draft';
  const draft = el('textarea'); draft.id = 'chat-draft'; draft.readOnly = true; draft.rows = 1; draft.value = frame.draft ?? ''; draft.placeholder = t('Сообщение...');
  const extras = el('span', '', 'chat-compose-icons'); extras.setAttribute('aria-hidden', 'true'); extras.append(icon('smile'), icon('photo'));
  const send = el('button', '', 'chat-send'); send.type = 'submit'; send.setAttribute('aria-label', t('Отправить')); send.title = t('Отправить');
  const next = button(frame.physicalAction ? 'К действию' : frame.continueLabel, onContinue, 'chat-continue'); next.append(icon('down'));
  const notice = el('p', '', 'chat-notice chat-sr-only'); notice.setAttribute('role', 'status');
  let selected = null, sent = false;
  const replyButtons = [];
  const resizeDraft = () => { draft.style.height = 'auto'; draft.style.height = Math.min(draft.scrollHeight, root.clientHeight * .18) + 'px'; };
  const sendIcon = () => { send.replaceChildren(icon(send.disabled ? 'microphone' : 'send')); send.classList.toggle('is-microphone', send.disabled); };
  for (const reply of frame.replies) {
    const node = button(reply.text, () => {
      if (sent) return;
      selected = reply; draft.value = reply.text; send.disabled = false; sendIcon(); resizeDraft();
      replyButtons.forEach(b => b.setAttribute('aria-pressed', String(b === node)));
      replies.hidden = true; suggested.setAttribute('aria-expanded', 'false');
    }, 'chat-reply'); node.textContent = t(reply.text); node.setAttribute('aria-pressed', 'false');
    if (reply.tone) node.append(el('small', { romance: 'Флирт', friendship: 'Дружба', practical: 'По делу', personal: 'Личное', explore: 'Осмотреться', dream: 'Воображение' }[reply.tone] ?? reply.tone));
    replies.append(node); replyButtons.push(node);
  }
  const composing = frame.draft !== null || frame.replies.length > 0;
  send.disabled = frame.replies.length > 0 || frame.draft === null; sendIcon(); next.hidden = composing;
  field.append(label, draft, extras); form.append(attach, field, send); footer.append(replies, suggested, form, notice); root.append(header, feed, footer, next);
  listen(form, 'submit', event => {
    event.preventDefault(); if (sent || send.disabled) return;
    send.disabled = true;
    if (!onSend(selected)) { send.disabled = false; return; }
    sent = true; back.disabled = false;
    bubble({ direction: 'outgoing', text: draft.value, time: frame.time, quote: frame.draftQuote });
    draft.value = ''; draft.placeholder = t('Сообщение...'); sendIcon(); resizeDraft(); replies.hidden = true; suggested.hidden = true; next.hidden = false;
    next.setAttribute('aria-label', t('Продолжить историю')); next.title = t('Продолжить историю'); notice.textContent = t('Сообщение отправлено');
    feed.scrollTop = feed.scrollHeight; next.focus({ preventScroll: true });
  });
  listen(root, 'click', event => { if (!menu.contains(event.target) && !menuToggle.contains(event.target)) { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); } });
  listen(root, 'keydown', event => { if (event.key === 'Escape') { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); } });
  const measure = () => { root.style.setProperty('--chat-header-height', header.offsetHeight + 'px'); root.style.setProperty('--chat-footer-height', footer.offsetHeight + 'px'); };
  const observer = new ResizeObserver(measure); observer.observe(header); observer.observe(footer);
  const focus = requestAnimationFrame(() => { resizeDraft(); measure(); title.focus({ preventScroll: true }); feed.scrollTop = feed.scrollHeight; });
  return () => { events.abort(); observer.disconnect(); cancelAnimationFrame(focus); };
}
