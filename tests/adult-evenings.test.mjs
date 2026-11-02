import assert from 'node:assert/strict';
import {NODES} from '../public/story.js';
import {ADULT_CAST,ADULT_PEOPLE,ADULT_DAYS_ROUTE} from '../public/adult-cast.js';

const beats=['kiss_ask','kiss','night_ask','home','door','fade','prep','sex','sex_deep','cum_inside','cum_cloth','cum_chest','afterglow','morning'];

assert.equal(ADULT_PEOPLE.length,15);
assert.deepEqual(ADULT_DAYS_ROUTE,[6,7,8,9,10,11,12,13,14,15]);

// Day 1: Nikola + Milica
for(const person of ['nikola','milica']){
 for(const beat of beats){
  const id=`evening1_${person}_${beat}`;
  assert.ok(NODES[id],id);
 }
 assert.equal(NODES[`evening1_${person}_fade`].adult,true);
 assert.equal(NODES[`evening1_${person}_fade`].skipTo,`evening1_${person}_morning`);
 assert.ok(NODES[`evening1_${person}_fade`].pages.length>=4,'Nikola-style multi-beat fade: '+person);
 assert.ok(NODES[`evening1_${person}_sex`].pages.length>=4,'dense sex beat: '+person);
 assert.ok(NODES[`evening1_${person}_sex_deep`].choices.length>=3,'finish choices after sex_deep');
 assert.match(JSON.stringify(NODES[`evening1_${person}_sex`].pages),/член|толч|вхожу|cock|thrust/i);
}

// Days 6–15 × full cast
for(const day of ADULT_DAYS_ROUTE){
 for(const person of ADULT_PEOPLE){
  assert.ok(NODES[`evening${day}_${person}_fade`],`evening${day}_${person}_fade`);
  assert.ok(NODES[`evening${day}_${person}_night_ask`]);
  assert.ok(NODES[`evening${day}_${person}_kiss_ask`]);
  assert.ok(NODES[`evening${day}_${person}_kiss`]);
  assert.equal(NODES[`evening${day}_${person}_sex`].adult,true);
  assert.equal(NODES[`evening${day}_${person}_sex_deep`].adult,true);
  assert.ok((NODES[`evening${day}_${person}_sex_deep`].choices??[]).length>=3,'finish choices');
 }
}

// Day 4 group
assert.ok(NODES.route4_group_ask);
assert.equal(NODES.route4_group_fade.adult,true);
assert.equal(NODES.route4_group_fade.skipTo,'route4_group_morning');
assert.match(JSON.stringify(NODES.route4_group_ask.pages),/«Нет» здесь всегда хороший ответ/);

// Every adult beat in the new registry skips to a non-adult morning
const eveningAdult=Object.keys(NODES).filter(id=>NODES[id].adult&&(/^(evening\d+_|route4_group_)/.test(id)));
assert.ok(eveningAdult.length>50,'registry ships many adult beats');
for(const id of eveningAdult){
 const skip=NODES[id].skipTo;
 assert.ok(NODES[skip],id+' skipTo');
 assert.ok(!NODES[skip].adult,id+' skips to non-adult');
}

// Cast copy present for each person
for(const id of ADULT_PEOPLE){
 const c=ADULT_CAST[id];
 assert.ok(c.askNight[0]&&c.yesIn[0]&&c.morning[0],id);
 assert.ok(c.gender==='m'||c.gender==='f',id);
}

console.log('Adult evenings: day 1 Nikola/Milica, day 4 group, days 6–15 × 15 people, consent + skipTo mornings.');
