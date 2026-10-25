import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,JOURNAL,START,presentationFor} from '../public/story.js';
import {DAYS,STAGES,PRELUDE} from '../public/days.js';
import {CHAPTERS,continuationFor,dayProgress,chapterFor} from '../public/chapters.js';
// Thirty days, in order, each one chapter.
assert.equal(DAYS.length,30);
DAYS.forEach((d,i)=>assert.equal(d.n,i+1));
assert.equal(new Set(DAYS.map(d=>d.id)).size,30);assert.equal(new Set(DAYS.map(d=>d.title)).size,30);assert.equal(new Set(DAYS.map(d=>d.start)).size,30);
assert.deepEqual(CHAPTERS.map(c=>c.id),[...PRELUDE.map(c=>c.id),...DAYS.map(d=>d.id)]);
for(const d of DAYS){assert.ok(NODES[d.start],d.start);assert.equal(NODES[d.start].chapterId,d.id);assert.ok(Object.hasOwn(STAGES,d.stage),d.stage);assert.ok(['written','skeleton'].includes(d.status));assert.ok(d.description.length>10);}
// The stages of the srb.guide structure all appear, in order.
const stageOrder=Object.keys(STAGES);let last=-1;for(const d of DAYS){const at=stageOrder.indexOf(d.stage);assert.ok(at>=last,'Stages never go backwards: day '+d.n);last=at;}
assert.deepEqual(new Set(DAYS.map(d=>d.stage)),new Set(stageOrder));
// Every path moves through the days one at a time and ends on day 30.
const index=id=>CHAPTERS.findIndex(c=>c.id===NODES[id].chapterId);
const seen=new Set();let maxChars=0;const memo=new Map();
function walk(id){
 if(id==='end')return 0;if(memo.has(id))return memo.get(id);
 const node=NODES[id];seen.add(index(id));
 const own=node.pages.reduce((sum,p)=>sum+Math.max(...[p.text,...Object.values(p.workText??{}),...Object.values(p.contactText??{}),...Object.values(p.districtText??{}),...Object.values(p.finalText??{})].filter(Boolean).map(t=>t.length)),0);
 const targets=node.choices?node.choices.map(c=>c.next):[node.next];let best=0;
 for(const next of targets){
  if(next!=='end'){const step=index(next)-index(id);assert.ok(step===0||step===1,`${id} -> ${next} skips or reverses a day`);}
  best=Math.max(best,walk(next));
 }
 memo.set(id,own+best);return own+best;
}
maxChars=walk(START);
assert.equal(seen.size,CHAPTERS.length,'Every day is reachable');
for(const id of ['epilogue_stay','epilogue_leave','epilogue_return'])assert.equal(NODES[id].chapterId,'answer');
// Entering a day records the previous one; progress picks the next unfinished day.
for(const d of DAYS.filter(d=>d.n>=2)){const done=NODES[d.start].effectOnEnter?.dayDone;assert.equal(done,d.n-1,'dayDone on the start of day '+d.n);}
for(let k=1;k<30;k++)assert.equal(continuationFor({flags:{dayDone:k}}),DAYS[k].start);
assert.equal(continuationFor({flags:{dayDone:30}}),null);assert.equal(continuationFor({flags:{}}),'road_start');assert.equal(dayProgress({chapterFiveComplete:true}),16);assert.equal(chapterFor({node:'end',flags:{dayDone:17}},NODES).id,'day-17');
// No new day announces an approval of the application, and every one of them has a journal note and a day label.
for(const d of DAYS.filter(d=>![1,2,12,15,16,21,29,30].includes(d.n))){
 const nodes=Object.entries(NODES).filter(([,node])=>node.chapterId===d.id);
 assert.ok(nodes.length>=5,'Day '+d.n);
 for(const [id,node] of nodes){assert.ok(node.pages.length<=5,id);assert.equal(node.day,'ДЕНЬ '+d.n);assert.ok(!/одобрен|получил[аи]? (вид на жительство|разрешение)/iu.test(JSON.stringify(node.pages)),'No day announces an approval: '+id);}
 assert.ok(JOURNAL['day_'+d.n].text.length>10);
}
// Every day shows two people of different genders on every path (the prologue and day 0 are one prelude, since the prologue
// is where the player meets one of two airport people).
const GENDER={nikola:'m',milica:'f',dragan:'m',jelena:'f',asya:'f',luka:'m','nikola-evening':'m','Никола':'m','Милица':'f','Драган':'m','Йелена':'f','Ася':'f','Лука':'m'};
const group=id=>id==='arrival'?'prologue':id;
for(const companion of ['nikola','milica'])for(const host of ['dragan','jelena'])for(const districtOwner of ['dragan','jelena'])for(const workRoute of ['business','employment','explore']){
 const flags={companion,host,districtOwner,workRoute,district:'dorcol'};
 for(const chapter of CHAPTERS.filter(c=>c.id!=='arrival')){
  const memo=new Map();
  const present=id=>{
   if(memo.has(id))return memo.get(id);
   const node=NODES[id],own=new Set();
   for(const page of node.pages){
    const character=presentationFor(node,page,flags).character;if(character)own.add(GENDER[character]);
    const speaker=page.speaker;const g=speaker==='contact'?GENDER[companion]:speaker==='contactCounterpart'?GENDER[companion==='nikola'?'milica':'nikola']:speaker==='host'?GENDER[host]:speaker==='districtHost'?GENDER[districtOwner]:speaker==='ownerCounterpart'?GENDER[districtOwner==='jelena'?'dragan':'jelena']:GENDER[speaker];
    if(g)own.add(g);
   }
   const next=(node.choices?node.choices.map(c=>c.next):[node.next]).filter(x=>x!=='end'&&group(NODES[x].chapterId)===chapter.id);
   let all=null;for(const x of next){const s=present(x);all=all?new Set([...all].filter(v=>s.has(v))):new Set(s);}
   const result=new Set([...own,...(all??[])]);memo.set(id,result);return result;
  };
  const people=present(chapter.start);
  assert.ok(people.has('f')&&people.has('m'),`${chapter.id} needs a woman and a man on every path (${companion}/${host}/${districtOwner}/${workRoute}): ${[...people].join('')||'none'}`);
 }
}
// Days written for the thirty-day structure (all except the ones assembled from older chapters) have at least five scenes and two decisions on every path.
for(const d of DAYS.filter(d=>d.status==='written'&&![1,2,12,15,16,21,29,30].includes(d.n))){
 const memo=new Map();
 const shape=id=>{
  if(id==='end'||NODES[id].chapterId!==d.id)return {scenes:0,choices:0};
  if(memo.has(id))return memo.get(id);
  const node=NODES[id],targets=node.choices?node.choices.map(c=>c.next):[node.next];
  const parts=targets.map(shape);
  const result={scenes:1+Math.min(...parts.map(p=>p.scenes)),choices:(node.choices?1:0)+Math.min(...parts.map(p=>p.choices))};
  memo.set(id,result);return result;
 };
 const {scenes,choices}=shape(d.start);
 assert.ok(scenes>=5,`Day ${d.n} has only ${scenes} scenes on its shortest path`);
 assert.ok(choices>=2,`Day ${d.n} has only ${choices} decisions on its shortest path`);
}
// Plan document lists every day.
const plan=fs.readFileSync(new URL('../DAYS.md',import.meta.url),'utf8');
for(const d of DAYS)assert.ok(plan.includes(d.title),'DAYS.md misses "'+d.title+'"');
// A save path stays well below the 500 000 character request limit.
assert.ok(maxChars*1.5<500000,'Longest path text is '+maxChars+' characters');
console.log(`Days: 30 ordered chapters, ${maxChars} characters on the longest path, all srb.guide stages covered, plan document in sync.`);
