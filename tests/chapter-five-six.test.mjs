import assert from 'node:assert/strict';
import {NODES,JOURNAL,START} from '../public/story.js';
import {CHAPTERS,chapterFor,continuationFor,rememberChapter,restartChapter,readChapterMarks} from '../public/chapters.js';
import {normalizeProgress} from '../lib/save-format.js';
import {forwardTargets} from './graph-helpers.mjs';

const residence=CHAPTERS.find(c=>c.id==='residence'),courtyard=CHAPTERS.find(c=>c.id==='courtyard');
assert.equal(residence.start,'fourth_morning');
assert.equal(courtyard.start,'courtyard_invite');
assert.equal(NODES.chapter_four_close.pages.length,4,'Previously saved page indices remain valid');
assert.equal(NODES.chapter_four_close.next,'d3_start','Day 3 now sits between the work day and the document folder');
assert.equal(NODES.chapter_four_close.chapterId,'work');
assert.equal(NODES.chapter_five_close.next,'d17_start');
assert.equal(NODES.chapter_five_close.chapterId,'after-filing');
assert.equal(NODES.chapter_six_close.next,'d22_start');
assert.equal(NODES.chapter_six_close.chapterId,'courtyard');
assert.equal(NODES.chapter_five_close.effectOnEnter.chapterFiveComplete,true);
assert.equal(NODES.chapter_six_close.effectOnEnter.chapterSixComplete,true);

for(const [gender,nameId]of [['male','dmitry'],['female','anna']])for(const companion of ['nikola','milica'])for(const workRoute of ['business','employment','explore']){
 const old=normalizeProgress({formatVersion:1,storyVersion:1,profile:{gender,nameId},node:'end',index:0,flags:{chapterOneComplete:true,chapterThreeComplete:true,chapterFourComplete:true,companion,workRoute,host:'jelena',district:'dorcol',districtOwner:'jelena',asyaBond:'friendship',lukaBond:'practical'},journal:['bank_appointment'],log:[{speaker:'Ася',text:'В субботу кино.'}],rewind:[],updatedAt:1});
 assert.equal(chapterFor(old,NODES).id,'work');
 assert.equal(continuationFor(old),'d3_start');
 assert.equal(restartChapter(old,'residence',NODES),false,'An unseen new chapter is not unlocked by installation');
 Object.assign(old,{node:residence.start,index:0,completed:false});
 Object.assign(old.flags,NODES[old.node].effectOnEnter??{});
 rememberChapter(old,NODES);
 const fifth=normalizeProgress(old);
 assert.equal(fifth.chapterMarks.residence.flags.workRoute,workRoute);
 assert.equal(fifth.chapterMarks.residence.flags.asyaBond,'friendship','Continuation cannot infer a romance');
 assert.equal(fifth.profile.nameId,nameId);
 assert.equal(fifth.flags.companion,companion);
 assert.equal(restartChapter(fifth,'courtyard',NODES),false,'The later chapter remains locked');
 Object.assign(fifth.flags,{chapterFiveComplete:true,bankAccountOpen:true,residenceApplication:workRoute==='explore'?'review':'submitted'});
 fifth.node='end';fifth.completed=true;
 assert.equal(chapterFor(fifth,NODES).id,'after-filing');
 assert.equal(continuationFor(fifth),'d17_start');
 Object.assign(fifth,{node:courtyard.start,index:0,completed:false});
 Object.assign(fifth.flags,NODES[fifth.node].effectOnEnter??{});
 rememberChapter(fifth,NODES);
 const sixth=normalizeProgress(fifth);
 assert.equal(sixth.chapterMarks.courtyard.flags.residenceApplication,workRoute==='explore'?'review':'submitted');
 sixth.flags.cinemaPlan='undecided';sixth.flags.chapterSixComplete=true;sixth.node='end';sixth.completed=true;
 sixth.log.push({speaker:'Лука',text:'После фильма'});
 assert.equal(continuationFor(sixth),'d22_start','An old chapter 6 ending continues into day 22');
 assert.equal(chapterFor(sixth,NODES).id,'courtyard');
 assert.equal(restartChapter(sixth,'courtyard',NODES),true);
 assert.equal(sixth.node,courtyard.start);
 assert.equal(sixth.flags.cinemaPlan,undefined,'Replaying restores the chapter entrance, before later decisions');
 assert.equal(sixth.flags.chapterSixComplete,undefined);
 assert.equal(sixth.flags.chapterFiveComplete,true);
 assert.equal(sixth.flags.residenceApplication,workRoute==='explore'?'review':'submitted');
 assert.equal(sixth.log.length,1);
 assert.deepEqual(sixth.rewind,[]);
 assert.ok(readChapterMarks(sixth.chapterMarks,NODES,JOURNAL,sixth.log.length).courtyard);
 assert.equal(restartChapter(sixth,'residence',NODES),true);
 assert.equal(sixth.flags.chapterFiveComplete,undefined);
 assert.equal(sixth.flags.bankAccountOpen,undefined);
 assert.equal(sixth.flags.residenceApplication,undefined);
 assert.equal(sixth.flags.workRoute,workRoute);
 assert.equal(sixth.chapterMarks.courtyard,undefined,'A replay discards later checkpoints');
}

// Both acceptance and the slower answer must remain available for each person.
for(const id of ['cinema_airport_close','cinema_asya_close','cinema_luka_close']){
 const choices=NODES[id].choices;
 assert.ok(choices.some(c=>c.effect?.cinemaHand===true),id+' has an affirmative hand choice');
 assert.ok(choices.some(c=>c.effect?.cinemaHand===false),id+' preserves the slower choice');
}
assert.deepEqual(NODES.cinema_tomorrow.choices.map(c=>c.effect.cinemaPlan).sort(),['season','undecided','week']);
assert.equal(NODES.chapter_six_close.effectOnEnter.residenceApplication,undefined,'A social evening never grants a residence permit');

const {choicePresentation}=await import('../public/choice-ui.js');
for(const nodeId of ['document_evening','cinema_seat'])for(const companion of ['milica','nikola'])for(const districtOwner of ['dragan','jelena']){
 const node=NODES[nodeId],flags={companion,districtOwner};
 for(const choice of node.choices){const id=choice.effect?.chapterFiveWith??choice.effect?.eveningWith;
  const expected=id==='companion'?companion:id==='host'?districtOwner:['asya','luka'].includes(id)?id:null;
  const presented=choicePresentation(choice,{node,flags});
  assert.equal(presented.recipient,expected,'The destination must control its icon, not the previous portrait');
  assert.equal(presented.gender,expected?['milica','asya','jelena'].includes(expected)?'female':'male':'neutral');
 }
}

// Filing has a real prerequisite in the story graph, rather than a universal button.
const incomingSubmit=Object.entries(NODES).filter(([,node])=>(node.choices??[]).some(c=>c.next==='residence_submit')||node.next==='residence_submit').map(([id])=>id).sort();
assert.deepEqual(incomingSubmit,['business_registered','employment_contract']);
assert.equal(NODES.business_registered.effectOnEnter.businessFiled,true);
assert.equal(NODES.employment_contract.effectOnEnter.employmentTermsReady,true);
for(const id of ['c5_business_pause','explore_plan'])assert.equal(NODES[id].next,'residence_review');
assert.equal(NODES.residence_submit.effectOnEnter.residenceApplication,'submitted');
assert.equal(NODES.residence_review.effectOnEnter.residenceApplication,'review');

// Bound the whole acyclic story's persistence size. Once a flag cannot appear
// again, only its count matters. Keeping the still-live keys avoids enumerating
// exponentially many unrelated early choices while retaining an upper bound.
const keyIndex=new Map();
const maskFor=effect=>{
 const keys=new Set(Object.keys(effect??{}));
 // The player resolves these generic effects to the selected person's bond.
 // Include both possible recipients to keep this structural audit conservative.
 if(['romance','friendship'].includes(effect?.eveningIntent)||['romance','friendship'].includes(effect?.cinemaAirportBond)){keys.add('nikolaBond');keys.add('milicaBond');}
 // Signing a lease turns the viewing's generic bond into exactly one landlord's rentalBond_* flag.
 if(effect?.flatPick)keys.add('rentalBond_pick');
 if(effect?.hostBond||effect?.districtBond){keys.add('draganBond');keys.add('jelenaBond');}
 let mask=0n;for(const key of keys){if(!keyIndex.has(key))keyIndex.set(key,keyIndex.size);mask|=1n<<BigInt(keyIndex.get(key));}return mask;
};
const bitCount=mask=>mask.toString(2).replaceAll('0','').length;
const localMasks=new Map(),choiceMasks=new Map();
for(const[id,node]of Object.entries(NODES)){
 let mask=maskFor(node.effectOnEnter);
 for(const action of Object.values(node.actions??{})){mask|=maskFor(action.effect);for(const option of action.options??[])mask|=maskFor(option.effect);}
 localMasks.set(id,mask);choiceMasks.set(id,(node.choices??[]).map(c=>maskFor(c.effect)));
}
// The flat-hunting map is a deliberate loop (see another district, come back), so reachability is a fixed point
// rather than a recursion.
const futureMemo=new Map();
for(const id of Object.keys(NODES))futureMemo.set(id,localMasks.get(id));
futureMemo.set('end',0n);
for(let changed=true;changed;){changed=false;
 for(const[id,node]of Object.entries(NODES)){
  let mask=futureMemo.get(id);
  if(node.choices)node.choices.forEach((c,i)=>{mask|=choiceMasks.get(id)[i]|futureMemo.get(c.next);});else mask|=futureMemo.get(node.next);
  if(mask!==futureMemo.get(id)){futureMemo.set(id,mask);changed=true;}
 }
}
const futureMask=id=>futureMemo.get(id);
const starts=[START,...Object.entries(NODES).filter(([,n])=>n.legacyOnly).map(([id])=>id)];
starts.forEach(futureMask);
const inputs=new Map(),queue=[];let maxFlags=0;
function offer(id,seen,finished){
 if(id==='end'){maxFlags=Math.max(maxFlags,finished+bitCount(seen));return;}
 const live=seen&futureMemo.get(id),score=finished+bitCount(seen&~futureMemo.get(id));
 const states=inputs.get(id)??new Map(),key=live.toString();
 if((states.get(key)??-1)>=score)return;states.set(key,score);inputs.set(id,states);queue.push([id,live,score]);
}
starts.forEach(id=>offer(id,0n,0));
for(let cursor=0;cursor<queue.length;cursor++){const[id,before,finished]=queue[cursor],node=NODES[id],mask=before|localMasks.get(id);
 maxFlags=Math.max(maxFlags,finished+bitCount(mask));
 if(node.choices)node.choices.forEach((c,i)=>offer(c.next,mask|choiceMasks.get(id)[i],finished));else offer(node.next,mask,finished);
}
const logMemo=new Map();
function maxLogs(id){if(id==='end')return 0;if(logMemo.has(id))return logMemo.get(id);
 const node=NODES[id],next=forwardTargets(id);
 const logs=node.pages.length+Object.keys(node.actions??{}).length+(node.choices?1:0)+Math.max(...next.map(maxLogs));
 logMemo.set(id,logs);return logs;
}
// Looking at every flat once more and returning to the map is allowed; the loop is bounded by the number of flats.
const FLAT_LOOP_ALLOWANCE=100;
// The visual room interaction stores one extra mask; inline chat acknowledgements add at most four records.
maxFlags+=1;
const logBound=Math.max(...starts.map(maxLogs))+4+FLAT_LOOP_ALLOWANCE;
assert.ok(maxFlags<=150,`A complete story save could reach ${maxFlags} flags, over the format limit`);
assert.ok(logBound<=1500,`A complete story save could reach ${logBound} log records, over the format limit`);
console.log(`Chapters 5/6: old-save migration, replay isolation, consent and open plans checked; conservative persistence bounds ${maxFlags} flags / ${logBound} log records.`);

assert.equal(NODES.business_pause.next,'work_summary','The earlier chapter 4 pause must retain its original target');
