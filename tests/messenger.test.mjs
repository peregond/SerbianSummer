import {familySpeaker,familyText} from '../public/family-contact.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { NODES, beatActionAt, pageText } from '../public/story.js';
import { messengerFrame, messageAt, stripMessageQuotes, visibleMessagePage } from '../public/messenger-model.js';
import { configureTranslations, setLanguage, t } from '../public/i18n.js?v=0.16.1';

const before = JSON.stringify(NODES);
assert.equal(visibleMessagePage('nikola_phone',0),1,'Skip the redundant narration even when restoring an old save');
assert.equal(visibleMessagePage('nikola_phone',1),1);
assert.equal(visibleMessagePage('phone',0),0);
const frame = (id, index, flags = {}) => messengerFrame({ sceneId: id, node: NODES[id], index, flags, action: beatActionAt(NODES[id], index), text: p => pageText(p, flags), choiceText: s => t(s) });
let count = 0;
for (const [id, node] of Object.entries(NODES)) for (const [index, page] of node.pages.entries()) {
  if (!page.message) continue;
  count++;
  for (const companion of ['milica', 'nikola']) for (const host of ['dragan', 'jelena']) {
    const result = frame(id, index, { companion, host });
    assert.ok(result, id + '/' + index);
    assert.ok(result.contact);
    assert.ok(result.draft !== null || result.messages.length);
  }
}
assert.equal(count, 87, 'All existing marked messages are covered');
const outgoing = frame('prepare_host', 0);
assert.equal(outgoing.contact, 'Драган'); assert.equal(outgoing.messages.length, 0);
assert.match(outgoing.draft, /Я уже в аэропорту/);
const received = frame('prepare_host', 1);
assert.deepEqual(received.messages.map(m => m.direction), ['outgoing', 'incoming']);
assert.ok(!JSON.stringify(outgoing).includes('Второй подъезд'), 'No future reply leaks into the draft');
assert.equal(frame('phone', 1).contact, 'Драган');
assert.equal(frame('phone', 3).contact, 'Мама');
assert.equal(frame('phone', 3).messages.length, 1, 'Different contacts never share a thread');
assert.equal(frame('evening_contact_plan', 2, { companion: 'nikola' }).contact, 'Никола');
assert.equal(frame('host_evening_invite', 0, { host: 'jelena' }).contact, 'Йелена');
assert.equal(frame('evening_contact_plan', 1).messages.length, 1);
assert.ok(frame('evening_contact_plan', 1).draft);
const reply = frame('last_message', NODES.last_message.pages.length - 1);
assert.equal(reply.replyKind, 'action'); assert.equal(reply.replies.length, 2);
assert.equal(frame('district_dorcol', 4).physicalAction, true, 'Apartment inspection remains a separate real-world action');
assert.equal(frame('river_close', 3), null, 'Spoken choices are not phone messages');
assert.equal(frame('airport_apron', 0), null);
assert.equal(stripMessageQuotes('«Текст». '), 'Текст');
assert.equal(stripMessageQuotes('‘I’ve arrived.’'), 'I’ve arrived.');
assert.equal(stripMessageQuotes('<script>hello</script>'), '<script>hello</script>', 'Rendering must use textContent');
const custom = { pages: [{ speaker: 'player', text: 'Custom reply', chat: { direction: 'outgoing', contact: 'luka' } }] };
assert.equal(messageAt('custom', custom, 0).contact, 'Лука');
const dictionary = JSON.parse(fs.readFileSync(new URL('../public/locales/en.json', import.meta.url)));
configureTranslations(dictionary); setLanguage('en');
assert.match(frame('prepare_host', 0).draft, /airport/);
const rested = frame('room_rest', 2);
assert.ok(rested.draft && rested.context, 'The narrated suffix remains separate from the outgoing bubble');
setLanguage('ru');
assert.equal(JSON.stringify(NODES), before, 'Messenger presentation never modifies story pages or choices');
console.log('All 77 messages, dynamic contacts, outgoing drafts, authored replies, no spoilers, physical actions, RU/EN and immutable scene data checked.');

// Existing logs keep their original bytes; only displayed identity is normalised.
for(const label of ['Близкий человек','Дом','mom','Мама'])assert.equal(familySpeaker(label),'Мама');
assert.equal(familySpeaker('Домой'),'Домой');assert.equal(familySpeaker('Милица'),'Милица');
for(const [id,index] of [['messages',0],['phone',3],['friend',2],['decision_home',0]]){
 assert.equal(NODES[id].pages[index].speaker,'Мама');assert.equal(frame(id,index).contact,'Мама');
}
assert.match(NODES.host.pages[2].text,/^Маме отвечаю/);
assert.match(NODES.d23_start.pages[0].text,/^Мама присылает/);
assert.equal(familyText('Близкому человеку отвечаю: «Пока в аэропорту. Пью кофе. Всё нормально».'),NODES.host.pages[2].text);
assert.equal(familyText('Дом присылает подробное письмо: обычные новости, смешная история про соседа и осторожный вопрос о планах.'),NODES.d23_start.pages[0].text);
assert.equal(familyText('Дом — это люди'),'Дом — это люди');

// Direct questions at the airport must offer a written answer immediately.
for(const [id,index]of [['nikola_phone',1],['phone',1],['phone',3],['messages',0]]){
 const question=frame(id,index);assert.equal(question.replyKind,'inline');assert.equal(question.replies.length,1);assert.ok(question.replies[0].option.label);assert.ok(!question.replies[0].option.next,'Inline answers keep the original continuation');
}
assert.match(frame('nikola_phone',1).replies[0].text,/скоро выезжаю/);
setLanguage('en');assert.match(frame('nikola_phone',1).replies[0].text,/leave soon/);setLanguage('ru');

assert.equal(frame('nikola_phone',1).hideAvatar,true);
const met=messengerFrame({sceneId:'nikola_phone',node:NODES.nikola_phone,index:1,journal:['dragan'],text:p=>pageText(p,{}),choiceText:s=>s});assert.equal(met.hideAvatar,false);
assert.ok(frame('road_contact',0,{companion:'nikola'}).draftAttachment);assert.match(frame('road_contact',0,{companion:'nikola'}).draft,/Кажется/);assert.equal(frame('road_contact',0,{companion:'nikola'}).contact,'Никола');
