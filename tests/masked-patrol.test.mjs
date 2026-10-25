import assert from 'node:assert/strict';
import {NODES,JOURNAL,pageText} from '../public/story.js';
const mask=['d4_station','d4_station_ask','d9_station','d17_station','d20_nephew','d20_nephew_end','d27_milos'];
for(const id of mask)assert.ok(NODES[id],id);
// Each meeting is an optional detour inside its day and returns to it; the reveal is part of day 20.
for(const [start,entry] of [['d4_start','d4_station'],['d9_start','d9_station'],['d17_start','d17_station'],['d27_start','d27_milos']])assert.ok(NODES[start].choices.some(c=>c.next===entry),entry+' is offered from '+start);
assert.equal(NODES.d20_turn.next,'d20_nephew');assert.equal(NODES.d20_nephew_end.next,'d20_end');
assert.equal(NODES.d4_station.chapterId,'day-4');assert.equal(NODES.d20_nephew.chapterId,'day-20');assert.equal(NODES.d27_milos.chapterId,'day-27');
// He is an ordinary patrol officer by the fence of the station, not the document window: nobody here decides the case.
const text=JSON.stringify(mask.map(id=>NODES[id].pages));
assert.match(text,/балаклав/);assert.match(text,/перерыв/);assert.match(text,/бумаги я не решаю/);
assert.ok(!/ускор|без очереди|в обход|одобр|слежк/iu.test(text),'No favours or approvals');
assert.match(JSON.stringify(NODES.d4_station.pages),/белым картоном/);
// Only the mystery's own flags change.
const flags=new Set();
for(const id of mask)for(const choice of NODES[id].choices??[])for(const key of Object.keys(choice.effect??{}))flags.add(key);
for(const key of flags)assert.match(key,/^mask[A-Z]/,key+' must only record the mystery');
assert.ok(flags.has('maskClue1')&&flags.has('maskClue2')&&flags.has('maskClue3'));
// The clues are in the owner's kitchen on day 4 and match what he shows at the fence: cardamom coffee, a tune of four notes, a ring.
const kitchen=JSON.stringify(NODES.d4_turn.pages);
assert.match(kitchen,/кардамоном/);assert.match(kitchen,/четыре ноты|четырёх нот/);assert.match(kitchen,/перстень-печатка/);
assert.match(JSON.stringify(NODES.d4_station_ask.pages),/кардамоном/);assert.match(JSON.stringify(NODES.d9_station.pages),/четырёх нот/);assert.match(JSON.stringify(NODES.d17_station.pages),/перстень-печатка/);
// The reveal changes with what the player noticed and met.
const reveal=(f,i)=>pageText(NODES.d20_nephew.pages[i],f);
assert.notEqual(reveal({maskMet:true},0),reveal({},0));
assert.match(reveal({maskMet:true},1),/Милош/);assert.match(reveal({},1),/Милош/);
assert.match(reveal({maskClue1:true,maskClue2:true,maskClue3:true},2),/всё сходится/);assert.doesNotMatch(reveal({},2),/всё сходится/);
assert.notEqual(pageText(NODES.d20_nephew_end.pages[0],{maskEnd:'spark'}),pageText(NODES.d20_nephew_end.pages[0],{maskEnd:'friend'}));
assert.match(pageText(NODES.d27_milos.pages[0],{maskEnd:'spark'}),/набережная в семь/);
// Closeness is always a choice with alternatives, and the mask thread is a secret only the player may uncover.
assert.deepEqual(NODES.d20_nephew.choices.map(c=>c.tone).sort(),['friendship','personal','romance']);
assert.ok(JOURNAL.masked_patrol);
for(const id of mask)assert.ok(NODES[id].pages.length<=5,id);
console.log('Masked policeman: three meetings by the station, matching clues from the owner’s kitchen, a reveal on day 20 and a date on day 27; nothing about the case changes.');
