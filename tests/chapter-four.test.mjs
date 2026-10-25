import assert from 'node:assert/strict';
import {NODES,JOURNAL,START} from '../public/story.js';
import {CHAPTERS,chapterFor,continuationFor,rememberChapter,restartChapter,readChapterMarks} from '../public/chapters.js';
import {normalizeProgress} from '../lib/save-format.js';

const chapter=CHAPTERS.find(c=>c.id==='work');
assert.equal(chapter.start,'third_morning');
assert.equal(NODES.chapter_three_close.pages.length,4,'Existing saved page indices remain valid');
assert.equal(NODES.chapter_three_close.next,chapter.start);
assert.equal(NODES[chapter.start].chapterId,'work');
assert.equal(NODES.chapter_three_close.chapterId,'districts','Chapter boundary must not absorb the previous evening');
assert.equal(NODES.chapter_four_close.chapterId,'work');
assert.equal(NODES.chapter_four_close.next,'d3_start');
assert.equal(NODES.chapter_four_close.effectOnEnter.chapterFourComplete,true);

for(const [gender,nameId]of [['male','dmitry'],['female','anna']])for(const companion of ['milica','nikola'])for(const workRoute of ['business','employment','explore']){
 const old=normalizeProgress({formatVersion:1,storyVersion:1,profile:{gender,nameId},node:'end',index:0,flags:{chapterThreeComplete:true,chapterOneComplete:true,companion,workRoute,host:'jelena',district:'vracar',districtOwner:'dragan',eveningIntent:'friendship'},journal:['bank_appointment'],log:[{speaker:'Ася',text:'По работе договоримся завтра.'}],rewind:[],updatedAt:1});
 assert.equal(old.completed,true);
 assert.equal(chapterFor(old,NODES).id,'districts','An old ending still belongs to its completed chapter');
 assert.equal(restartChapter(old,'work',NODES),false,'A new chapter must not appear as already visited');
 const next=continuationFor(old);
 assert.equal(next,chapter.start,'Old completed demos can continue without restarting');
 Object.assign(old,{node:next,index:0,completed:false});
 Object.assign(old.flags,NODES[next].effectOnEnter??{});
 rememberChapter(old,NODES);
 const saved=normalizeProgress(old);
 assert.equal(saved.chapterMarks.work.node,next);
 assert.equal(saved.chapterMarks.work.flags.workRoute,workRoute);
 assert.equal(saved.chapterMarks.work.flags.eveningIntent,'friendship','Adding a chapter must not infer romance');
 saved.flags.chapterFourComplete=true;
 saved.flags.workRoute='changed-later';
 saved.node='end';saved.completed=true;
 saved.log.push({speaker:'Лука',text:'Позже в главе'});
 saved.rewind=[{node:'chapter_four_close'}];
 assert.equal(continuationFor(saved),'d3_start','A completed work day continues into day 3');
 assert.equal(restartChapter(saved,'work',NODES),true);
 assert.equal(saved.node,next);
 assert.equal(saved.flags.workRoute,workRoute,'Replaying work restores the route selected before the chapter');
 assert.equal(saved.flags.chapterFourComplete,undefined,'Replaying clears later completion');
 assert.equal(saved.flags.companion,companion);
 assert.equal(saved.profile.gender,gender);
 assert.equal(saved.profile.nameId,nameId);
 assert.equal(saved.log.length,1);
 assert.equal(saved.completed,false);
 assert.deepEqual(saved.rewind,[]);
 assert.ok(readChapterMarks(saved.chapterMarks,NODES,JOURNAL,saved.log.length).work);
}
assert.equal(continuationFor({flags:{chapterOneComplete:true}}),'next_steps','Pre-bank demos retain their existing entry');
assert.equal(continuationFor({flags:{}}),'road_start','Old prologue ending retains its existing entry');
assert.equal(NODES[START].chapterId,'prologue');
console.log('Chapter 4: old completed saves, both genders, both contacts, all work routes, chapter boundaries and replay state preserved.');

// Choosing a destination must retain its compact, gender-coded icon even when
// the current scene has no portrait (the rainy café is a group scene).
const {choicePresentation}=await import('../public/choice-ui.js');
assert.equal(choicePresentation(NODES.rain_break.choices[0],{node:NODES.rain_break}).gender,'female');
assert.equal(choicePresentation(NODES.rain_break.choices[1],{node:NODES.rain_break}).gender,'male');
const {pageText,presentationFor,CHARACTER_SPRITES}=await import('../public/story.js');
const morning=NODES.third_morning.pages[2];
assert.match(pageText(morning,{workRoute:'employment'}),/команд/);
assert.match(pageText(morning,{workRoute:'business'}),/бухгалтер/);
assert.match(pageText(morning,{workRoute:'explore'}),/вариант/);
for(const person of ['asya','luka']){
 const seen=new Set();
 for(const node of Object.values(NODES).filter(n=>n.chapterId==='work'))for(const page of node.pages){
  const p=presentationFor(node,page);if(p.character===person)seen.add(p.emotion);
  if(!page.message&&page.speaker===(person==='asya'?'Ася':'Лука'))assert.equal(p.character,person,'In-person dialogue must show the speaker');
 }
 assert.deepEqual([...seen].sort(),Object.keys(CHARACTER_SPRITES[person]).sort(),'Every new character reaction is staged');
 const consent=NODES['rain_'+person+'_close'].choices;
 assert.equal(consent[0].effect[person+'Hand'],true);
 assert.equal(consent[1].effect[person+'Hand'],false,'The slower option remains a real choice');
}
for(const [character,sprites]of Object.entries(CHARACTER_SPRITES))if(character.startsWith('nikola'))for(const sprite of Object.values(sprites))assert.ok(sprite.file.endsWith('-buzz-v3'),'No old face may reappear on a scene change');
