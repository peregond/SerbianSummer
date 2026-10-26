import assert from 'node:assert/strict';
import {NODES,presentationFor} from '../public/story.js';
const scene=(id,i,flags={})=>presentationFor(NODES[id],NODES[id].pages[i],flags);
for(const id of ['nikola_daydream','nikola_dream_cream','nikola_dream_coffee']) {
  for(const page of NODES[id].pages) {
    const frame=presentationFor(NODES[id],page,{});
    if(frame.daydream) {assert.equal(frame.bg,'nikola-daydream-pastries-v1');assert.equal(frame.character,'nikola');}
    else assert.notEqual(frame.bg,'nikola-daydream-pastries-v1');
  }
}
for(const i of [0,1]) {const frame=scene('nikola_questions',i);assert.equal(frame.bg,'nikola-elder-bread-handover-v1');assert.equal(frame.character,null);assert.equal(frame.composite,true);}
assert.notEqual(scene('nikola_questions',2).bg,'nikola-elder-bread-handover-v1');
for(const i of [0,1,2,3,4])assert.equal(scene('nikola_last',i).bg,'nikola-bakery-lookback-v1');
assert.notEqual(scene('nikola_last',5).bg,'nikola-bakery-lookback-v1','The actual exit keeps its outdoor background');
console.log('Fantasy, handover and look-back framing follow legacy page identities, returning to reality at the original point.');

assert.equal(scene('road_start',1).bg,'taxi-navigation-v1');assert.equal(scene('road_start',1).contactPortrait,null);assert.notEqual(scene('road_start',2).bg,'taxi-navigation-v1');
