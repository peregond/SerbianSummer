import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,pageText} from '../public/story.js';
import {CHAPTERS} from '../public/chapters.js';
import {choiceVisible} from '../public/romance.js';
import {rentalRedirect} from '../public/rental-story.js';
import {configureTranslations} from '../public/i18n.js?v=0.15.3';

const dictionary=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url)));
configureTranslations(dictionary);
const ids=['ana','stefan','marko','vuk'];
const choices=NODES.district_map.choices;
const current=choices.filter(choice=>choiceVisible(choice,{rentalCast:'new'}));
// Three districts are on the map; Dorćol has a second flat that the decision scene offers.
assert.deepEqual(current.map(choice=>choice.effect.district),['dorcol','vracar','newbelgrade']);
const secondDorcol=NODES.flat_decision.choices.find(choice=>choice.next==='flat_enter_stefan');
assert.ok(secondDorcol,'Stefan is reachable from the first Dorćol flat');
assert.deepEqual(new Set([...current.map(choice=>choice.effect.districtOwner),secondDorcol.effect.districtOwner]),new Set(ids),'all four distinct landlords must be reachable');
for(const id of ids){
 const first=NODES['rental_first_'+id],hub=NODES['rental_hub_'+id];
 assert.ok(first&&hub,id);assert.equal(first.next,'rental_hub_'+id);
 assert.ok(NODES['flat_enter_'+id]&&NODES['flat_after_'+id],id+': viewing scenes');
 assert.equal(NODES['flat_after_'+id].next,'rental_hub_'+id);
 assert.deepEqual(new Set(hub.choices.map(choice=>choice.tone)),new Set(['practical','friendship','romance']));
 for(const mode of ['terms','friends','flirt']){
  const choice=hub.choices.find(c=>c.next==='rental_'+mode+'_'+id);assert.ok(choice,id+'/'+mode);
  assert.equal(choice.effect.rentalBond,mode==='terms'?'practical':mode==='friends'?'friendship':'romance','the viewing bond is generic until the lease is signed');
  assert.equal(NODES[choice.next].next,mode==='flirt'?'flat_coffee':'flat_decision');
 }
}
for(const day of [4,7,8,10,11,19,22,25,27,28,29,30]){
 const chapter=CHAPTERS.find(c=>c.day===day);assert.ok(chapter);
 for(const owner of ids){
  const id=rentalRedirect('previous',chapter.start,{rentalCast:'new',districtOwner:owner});
  assert.equal(id,'rental_day_'+day);assert.equal(NODES[id].chapterId,chapter.id);
  const reached=new Set();
  function reachesChapter(nodeId,seen=new Set()){
   if(nodeId===chapter.start){reached.add(nodeId);return;}
   assert.ok(!seen.has(nodeId),id+': unexpected loop');
   const node=NODES[nodeId];assert.ok(node,id+': missing '+nodeId);
   const nextSeen=new Set(seen).add(nodeId);
   for(const target of node.choices?.map(c=>c.next)??[node.next])reachesChapter(target,nextSeen);
  }
  reachesChapter(id);assert.ok(reached.has(chapter.start),id+': all branches return to their chapter');
 }
 assert.equal(rentalRedirect('previous',chapter.start,{}),chapter.start,'unselected cast skips new scenes');
}
const lease=NODES.rental_day_8.choices;
assert.equal(lease.filter(c=>choiceVisible(c,{rentalContract:'yes'})).length,1,'confirmed lease opens moving in');
assert.equal(lease.filter(c=>choiceVisible(c,{rentalContract:'wait'})).length,1,'unconfirmed lease keeps the temporary home');
assert.notEqual(lease.find(c=>choiceVisible(c,{rentalContract:'yes'})).effect.rentalMoved,lease.find(c=>choiceVisible(c,{rentalContract:'wait'})).effect.rentalMoved);
for(const owner of ids){
 const without=NODES.rental_day_25.choices.filter(c=>choiceVisible(c,{districtOwner:owner}));
 assert.ok(without.every(c=>!c.next.startsWith('rental_kiss_')),'a kiss requires an earlier date');
 const withDate=NODES.rental_day_25.choices.filter(c=>choiceVisible(c,{districtOwner:owner,['rentalStep_'+owner]:'date'}));
 assert.deepEqual(withDate.filter(c=>c.next.startsWith('rental_kiss_')).map(c=>c.next),['rental_kiss_'+owner]);
 assert.ok(NODES['rental_kiss_'+owner].pages.some(page=>/Можно тебя поцеловать/.test(page.text)),'consent is spoken');
}
for(const [id,node]of Object.entries(NODES).filter(([id])=>id.startsWith('rental_'))){
 for(const page of node.pages){
  assert.ok(Object.hasOwn(dictionary,page.text),id+': missing exact English page translation');
  assert.ok(!page.text.includes('{r}'),id+': unsupported gender placeholder');
 }
 for(const choice of node.choices??[])assert.ok(Object.hasOwn(dictionary,choice.label),id+': missing exact English choice translation');
}
for(const ending of ['epilogue_stay','epilogue_leave','epilogue_return']){
 assert.ok(NODES[ending],ending);
 const responses=new Set();
 for(const owner of ids){
  const flags={rentalCast:'new',districtOwner:owner,rentalMoved:true};
  const id=rentalRedirect('some_scene',ending,flags);assert.equal(id,'rental_'+ending);
  const node=NODES[id];assert.ok(node);assert.equal(node.next,ending);
  assert.notEqual(pageText(node.pages[0],flags,'ru'),pageText(node.pages[0],{...flags,rentalMoved:false},'ru'),'housing outcome follows the lease decision');
  responses.add(pageText(node.pages[1],flags,'ru'));
  const friendly=pageText(node.pages[2],flags,'ru');
  const date=pageText(node.pages[2],{...flags,['rentalStep_'+owner]:'date'},'ru');
  const kiss=pageText(node.pages[2],{...flags,['rentalStep_'+owner]:'kiss'},'ru');
  assert.notEqual(date,friendly,owner+': date has a separate ending');
  assert.notEqual(kiss,date,owner+': kiss has a separate ending');
  for(const locale of ['ru','en'])for(const page of node.pages)assert.ok(pageText(page,flags,locale),id+': '+locale);
 }
 assert.equal(responses.size,ids.length,ending+': every owner has their own response');
}
console.log('Rental story: four reachable characters, voluntary relationship choices, chapter episodes, exact English translations and three player endings.');
