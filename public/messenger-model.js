import {familySpeaker} from './family-contact.js?v=1';
import { CHAT_SCENES, MESSENGER_CONFIG, INLINE_CHAT_REPLIES } from './messenger-config.js?v=0.15.2';

const names = { milica: 'Милица', nikola: 'Никола', dragan: 'Драган', jelena: 'Йелена', asya: 'Ася', luka: 'Лука', lazar: 'Лазар', teodora: 'Теодора', ivana: 'Ивана', strahinja: 'Страхиня' };
export function contactName(value, flags = {}) {
  const dynamic = {
    contact: flags.companion ?? 'milica', contactCounterpart: flags.companion === 'nikola' ? 'milica' : 'nikola',
    host: flags.host ?? 'dragan', districtHost: flags.districtOwner ?? 'jelena',
    ownerCounterpart: flags.districtOwner === 'jelena' ? 'dragan' : 'jelena',
    bankStaff: flags.bankSpark === 'teodora' ? 'teodora' : 'lazar',
    mupStaff: flags.mupSpark === 'strahinya' ? 'strahinja' : 'ivana'
  };
  const key = dynamic[value] ?? value;
  return names[key] ?? familySpeaker(String(key).replace(/^Ты\s*→\s*/u, '').split(' · ')[0]);
}
export function messageAt(sceneId, node, index, flags = {}) {
  const page = node.pages[index];
  if (!page) return null;
  const scene = CHAT_SCENES[sceneId] ?? {};
  const config = { ...scene.pages?.[index], ...page.chat };
  if (page.chat === false || (!page.message && !page.chat && !scene.pages?.[index])) return null;
  const direction = config.direction ?? (page.speaker === 'player' || /^Ты\s*→/u.test(page.speaker) ? 'outgoing' : 'incoming');
  const previous = node.pages.slice(0, index).findLast(p => p.message && p.speaker !== 'player' && !/^Ты\s*→/u.test(p.speaker));
  const person = config.contact ?? scene.contact ?? node.chat?.contact ?? (direction === 'incoming' ? page.speaker : /^Ты\s*→/u.test(page.speaker) ? page.speaker : previous?.speaker ?? 'Близкий человек');
  return { direction, contact: contactName(person, flags), quotedBody: !!config.quotedBody, time: config.time ?? page.time ?? node.time ?? '', quote: config.quote, attachment: config.attachment };
}
export function stripMessageQuotes(value) {
  const text = value.trim();
  for (const [open, close] of [['«', '»'], ['‘', '’'], ['“', '”'], ['"', '"']]) {
    if (text.startsWith(open)) {
      const end = text.lastIndexOf(close);
      if (end > 0 && /^[.\s]*$/u.test(text.slice(end + 1))) return text.slice(1, end);
    }
  }
  return text;
}
function messageBody(page, meta, text) {
  const full = text(page);
  if (meta.quotedBody) {
    const pairs = { '«': '»', '‘': '’', '“': '”', '"': '"' };
    const start = full.trim(); const end = start.lastIndexOf(pairs[start[0]]);
    if (end > 0) return { text: start.slice(1, end), context: start.slice(end + 1).replace(/^[.\s]+/u, '') };
  }
  return { text: stripMessageQuotes(full), context: '' };
}
export function messengerFrame({ sceneId, node, index, flags = {}, journal = [], action, text, choiceText }) {
  let current = messageAt(sceneId, node, index, flags);
  // A phone reply may follow a narrated thought on the same legacy page.
  if (!current && action?.kind === 'reply') {
    for (let i = index - 1; i >= 0 && !current; i--) current = messageAt(sceneId, node, i, flags);
  }
  if (!current) return null;
  const actual = messageAt(sceneId, node, index, flags);
  const messages = [];
  for (let i = 0; i <= index; i++) {
    const meta = messageAt(sceneId, node, i, flags);
    if (!meta || meta.contact !== current.contact || (i === index && meta.direction === 'outgoing')) continue;
    messages.push({ direction: meta.direction, time: meta.time, quote: meta.quote, attachment: meta.attachment, ...messageBody(node.pages[i], meta, text) });
  }
  const meetingChoice = sceneId==='courtyard_arrival'&&index===2;
  const choices = meetingChoice ? node.choices : action?.kind === 'reply' ? action.options : (!action || action.kind === 'tap') && index === node.pages.length - 1 ? node.choices : null;
  const inline = !choices?.length && actual?.direction === 'incoming' ? INLINE_CHAT_REPLIES[sceneId]?.[index] : null;
  const draft = actual?.direction === 'outgoing' ? messageBody(node.pages[index], actual, text) : null;
  return {
    contact: current.contact,
    hideAvatar: current.contact==='Драган'&&!journal.includes('dragan'),
    time: actual?.time ?? node.time ?? '',
    draftQuote: actual?.quote,
    draftAttachment: actual?.attachment,
    messages: messages.slice(-MESSENGER_CONFIG.historyLimit),
    draft: draft?.text ?? null,
    context: draft?.context || (!actual ? text(node.pages[index]) : ''),
    replies: (inline?[inline]:choices)?.map(option => ({ option, text: stripMessageQuotes(choiceText(meetingChoice?(option.next==='meet_dragan'?'Подожду вас во дворе. До встречи!':'Тогда попрошу Йелену встретить меня сейчас. Спасибо!'):option.chatText ?? option.label)), tone: option.tone })) ?? [],
    replyKind: inline ? 'inline' : action?.kind === 'reply' ? 'action' : 'choice',
    physicalAction: !!action && action.kind !== 'tap' && action.kind !== 'reply',
    continueLabel: choiceText(action?.label ?? 'К истории')
  };
}
