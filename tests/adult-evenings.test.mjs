import assert from 'node:assert/strict';
import {test} from 'node:test';
import {NODES} from '../public/story.js';
import {choiceVisible} from '../public/romance.js';
import {ADULT_PEOPLE,ADULT_DAYS_ROUTE} from '../public/adult-cast.js?v=0.17.2';

test('compatible nights require a deliberate choice and return to the current day',()=>{
 for(const day of [1,...ADULT_DAYS_ROUTE])for(const person of (day===1?['nikola','milica']:ADULT_PEOPLE)){
  const ask=NODES[`evening${day}_${person}_night_ask`];
  const full=ask.choices.find(c=>c.next===`adult_evening${day}_${person}_home`);
  if(person==='milos'){assert.equal(full,undefined);continue;}
  assert.ok(full);assert.equal(choiceVisible(full,{}, {gender:'male'}),true);
  assert.equal(choiceVisible(full,{}, {gender:'female'}),false);
  for(const beat of ['home','door','fade','prep','sex','sex_deep','cum_inside','cum_cloth','cum_chest','afterglow']){
   const node=NODES[`adult_evening${day}_${person}_${beat}`];
   assert.ok(node.activeRoute);assert.equal(node.routeDay,day);assert.equal(node.adult,true);
   assert.equal(node.skipTo,`route${day}_close`);
  }
  assert.equal(NODES[`adult_evening${day}_${person}_morning`].next,`route${day}_close`);
 }
});
