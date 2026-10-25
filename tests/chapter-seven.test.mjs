import assert from 'node:assert/strict';
import {NODES,JOURNAL,pageText} from '../public/story.js';
import {CHAPTERS,continuationFor,chapterFor,rememberChapter,restartChapter} from '../public/chapters.js';
import {normalizeProgress} from '../lib/save-format.js';
const decision=CHAPTERS.find(c=>c.id==='decision');
assert.equal(decision.start,'decision_morning');
assert.equal(NODES.chapter_six_close.next,decision.start);
const reach=new Set(),endings=new Map();
(function walk(id,flags={}){
 if(id==='end')return;
 const node=NODES[id];assert.ok(node,'Missing '+id);
 assert.equal(node.chapterId,id==='chapter_six_close'?'courtyard':node.chapterId);
 reach.add(id);
 if(node.effectOnEnter?.chapterSevenComplete)endings.set(id,flags.finalChoice);
 for(const next of node.choices?node.choices.map(c=>[c.next,{...flags,...c.effect}]):[[node.next,{...flags,...node.effectOnEnter}]])walk(next[0],next[1]);
})(decision.start);
assert.deepEqual([...endings.values()].sort(),['leave','return','stay'],'Stay, leave and return are all reachable endings');
assert.deepEqual(Object.keys(NODES).filter(id=>NODES[id].chapterId==='decision').filter(id=>!reach.has(id)),[],'No unreachable chapter 7 scene');
// The decision belongs to the player: the three final options are all offered together.
assert.equal(NODES.decision_night.choices.length,3);
assert.deepEqual(NODES.decision_night.choices.map(c=>c.effect.finalChoice).sort(),['leave','return','stay']);
// Every romantic closeness option has an equally available friendship alternative.
for(const id of ['final_airport','final_asya','final_luka']){const tones=NODES[id].choices.map(c=>c.tone);assert.ok(tones.includes('romance')&&tones.includes('friendship'),id);}
// At most five lines before an action or choice.
for(const id of Object.keys(NODES).filter(id=>NODES[id].chapterId==='decision'))assert.ok(NODES[id].pages.length<=5,id);
// Each person the player can spend the last evening with colours the epilogues.
for(const id of ['epilogue_stay','epilogue_leave','epilogue_return']){
 const page=NODES[id].pages.find(p=>p.finalText);
 const variants=['nikola','milica','asya','luka','friends','alone'].map(k=>pageText(page,{finalWith:k==='nikola'||k==='milica'?'airport':k,companion:k==='nikola'?'nikola':'milica'}));
 assert.equal(new Set(variants).size,6,id+' has six distinct variants');
 assert.equal(pageText(page,{}),page.text,'An unset final companion falls back to the group version');
}
// No ending claims that a residence permit was granted.
for(const id of Object.keys(NODES).filter(id=>NODES[id].chapterId==='decision'))for(const p of NODES[id].pages)assert.ok(!/одобрен[оаы]? (заявлени|разрешени|ВНЖ)|разрешение получено/iu.test(JSON.stringify(p)),id);
for(const j of ['final_stay','final_leave','final_return','last_week','last_evening'])assert.ok(JOURNAL[j]);
// Saves: an old chapter-six ending continues, and a finished chapter 7 save validates.
const base={formatVersion:1,storyVersion:1,profile:{gender:'female',nameId:'anna'},node:'end',index:0,flags:{chapterSixComplete:true},journal:[],log:[]};
assert.equal(continuationFor(base),'decision_morning');
const done=normalizeProgress({...base,flags:{...base.flags,chapterSevenComplete:true,finalChoice:'stay'},log:Array.from({length:700},()=>({speaker:'Ты',text:'x'}))});
assert.equal(continuationFor(done),null);assert.equal(chapterFor(done,NODES).id,'decision');
assert.throws(()=>normalizeProgress({...base,log:Array.from({length:801},()=>({speaker:'Ты',text:'x'}))}));
// Chapter 7 can be replayed from its entrance, discarding the final decision but keeping chapter 6 history.
const play={...normalizeProgress({...base,node:'decision_morning',flags:{chapterSixComplete:true},log:[{speaker:'Ты',text:'x'}]})};
play.chapterMarks={};rememberChapter(play,NODES);
Object.assign(play.flags,{finalWith:'luka',finalBond:'friendship',finalChoice:'leave',chapterSevenComplete:true});play.node='end';play.log.push({speaker:'Ты',text:'y'});
assert.equal(restartChapter(play,'decision',NODES),true);
assert.equal(play.node,'decision_morning');assert.equal(play.flags.finalChoice,undefined);assert.equal(play.flags.chapterSevenComplete,undefined);assert.equal(play.flags.chapterSixComplete,true);
console.log('Chapter 7: three player-owned endings, voluntary closeness, honest document wording, six epilogue variants and save limits checked.');
