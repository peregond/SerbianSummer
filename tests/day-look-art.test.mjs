import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,CHARACTER_SPRITES,presentationFor} from '../public/story.js';
import {STATION_ART} from '../public/scene-quests.js';

test('day outfits follow the scene day and never replace a uniform or a daydream',()=>{
 const flags={companion:'nikola'};
 const p=presentationFor(NODES.d3_start,NODES.d3_start.pages[2],flags);
 assert.equal(p.character,'nikola-evening');assert.equal(p.emotion,'day3-friendly');
 const a=presentationFor(NODES.asya_meeting,NODES.asya_meeting.pages[0],flags);
 assert.equal(a.character,'asya');assert.equal(a.emotion,'day2-friendly');
 for(const [person,looks] of Object.entries(CHARACTER_SPRITES))for(const [key,art] of Object.entries(looks))if(/^day[234]-/.test(key))assert.ok(fs.existsSync(new URL(`../public/assets/${art.file}.webp`,import.meta.url)),`${person} ${key}`);
 assert.ok(!presentationFor(NODES.quick_nikola,NODES.quick_nikola.pages[0],flags).emotion.startsWith('day'));
});

test('apartment inspection uses owner-specific art only where it fits',()=>{
 for(const key of ['ana:water','ana:windows','stefan:water','marko:water','marko:windows','vuk:water','vuk:windows']){
  assert.ok(!STATION_ART[key].includes('-common-'),key);
  assert.ok(fs.existsSync(new URL(`../public/assets/${STATION_ART[key]}.webp`,import.meta.url)),key);
 }
 for(const key of ['ana:internet','stefan:internet','stefan:windows','marko:internet','vuk:internet'])assert.match(STATION_ART[key],/-common-/);
});
