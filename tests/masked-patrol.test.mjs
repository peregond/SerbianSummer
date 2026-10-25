import assert from 'node:assert/strict';
import {NODES,JOURNAL,pageText} from '../public/story.js';
const mask=['d18_mask','d22_mask','d25_mask','d27_mask','d27_mask_ask','d28_mask','d28_mask_reveal','d28_mask_end'];
for(const id of mask)assert.ok(NODES[id],id);
// Each meeting is an optional detour inside its day and returns to it.
for(const [start,entry] of [['d18_mid','d18_mask'],['d22_mid','d22_mask'],['d25_mid','d25_mask'],['d27_mid','d27_mask'],['d28_start','d28_mask']])assert.ok(NODES[start].choices.some(c=>c.next===entry),entry+' is offered from '+start);
const day=id=>NODES[id].chapterId;
assert.equal(day('d18_mask'),'day-18');assert.equal(day('d28_mask_end'),'day-28');
// Four meetings and a reveal; the clues are optional and only change what is remembered.
const flags=new Set();
for(const id of mask)for(const choice of NODES[id].choices??[])for(const key of Object.keys(choice.effect??{}))flags.add(key);
for(const key of flags)assert.match(key,/^mask[A-Z]/,key+' must only record the mystery');
assert.ok(flags.has('maskClue1')&&flags.has('maskClue2')&&flags.has('maskClue3'));
// The mask never speaks about the case except to say that others decide it, and nothing in the thread promises favours.
const text=JSON.stringify(mask.map(id=>NODES[id].pages));
assert.ok(!/ускор|без очереди|в обход|одобр|слежк/iu.test(text.replace('это не угроза и не слежка','')));
assert.match(text,/Решения по делам принимают другие/);
for(const id of ['d18_mask','d22_mask','d25_mask','d27_mask'])assert.ok(NODES[id].pages.some(p=>p.speaker==='Человек в балаклаве'),id);
// The clues really match the officer at the document window: lively eyes, lemon, three knocks and a pause.
assert.match(JSON.stringify(NODES.d18_mask.choices),/живые глаза/);assert.match(JSON.stringify(NODES.d22_mask.pages),/лимоном/);assert.match(JSON.stringify(NODES.d25_mask.pages),/три коротких удара/);
assert.match(JSON.stringify(NODES.d20_ivana.pages),/три коротких удара/);assert.match(JSON.stringify(NODES.d20_strahinya.pages),/три коротких удара/);assert.match(JSON.stringify(NODES.d20_mup_coffee.pages),/лимоном/);
assert.match(JSON.stringify(NODES.d20_ivana.pages),/глаза живые/);
// Under the mask is whoever the player met at the window (Ivana if nobody).
const reveal=(f,i=0)=>pageText(NODES.d28_mask_reveal.pages[i],f);
assert.match(reveal({mupSpark:'strahinya'}),/Страхиня/);assert.match(reveal({mupSpark:'ivana'}),/Ивана/);assert.match(reveal({}),/Ивана/);
assert.match(reveal({mupSpark:'ivana',maskGuess:'ivana'},2),/угадали/);assert.match(reveal({mupSpark:'ivana',maskGuess:'lazar'},2),/не угадали/);assert.match(reveal({mupSpark:'strahinya',maskGuess:'skip'},2),/не стали гадать/);
assert.ok(JOURNAL.masked_patrol);
for(const id of mask)assert.ok(NODES[id].pages.length<=5,id);
console.log('Masked patrol: four optional meetings, matching clues, a reveal and an optional guess; nothing about the case changes.');
