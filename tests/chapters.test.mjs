import assert from 'node:assert/strict';
import {NODES,JOURNAL,START} from '../public/story.js';
import {CHAPTERS,rememberChapter,restartChapter,readChapterMarks,chapterFor,continuationFor} from '../public/chapters.js';
import {normalizeProgress} from '../lib/save-format.js';
const state={formatVersion:1,storyVersion:1,profile:{gender:'female',nameId:'anna'},node:START,index:0,flags:{},journal:[],log:[],rewind:[],updatedAt:Date.now()};
for(const c of CHAPTERS){assert.equal(NODES[c.start].chapterId,c.id);}
for(const node of Object.values(NODES))assert.ok(CHAPTERS.some(c=>c.id===node.chapterId));
rememberChapter(state,NODES);assert.equal(state.chapterMarks.prologue.logLength,0);assert.equal(restartChapter(state,'districts',NODES),false,'Unvisited chapter locked');
state.flags.companion='nikola';state.log.push({speaker:'Ты',text:'Прилёт'});state.node='road_start';state.flags.roadMood='window';rememberChapter(state,NODES);
state.log.push({speaker:'Никола',text:'Прогулка'});state.node='morning_start';state.flags.host='jelena';rememberChapter(state,NODES);
state.log.push({speaker:'Ася',text:'Просмотр'});state.node='next_steps';state.flags.district='dorcol';state.flags.districtOwner='jelena';rememberChapter(state,NODES);
assert.equal(restartChapter(state,'work',NODES),false,'Future work chapter stays locked before reaching it');
state.log.push({speaker:'Ася',text:'Новый день'});state.node='third_morning';state.flags.chapterThreeComplete=true;rememberChapter(state,NODES);
const stored=normalizeProgress(state);assert.equal(Object.keys(stored.chapterMarks).length,4);assert.equal(chapterFor(stored,NODES).id,'work');
assert.equal(restartChapter(stored,'work',NODES),true);assert.equal(stored.node,'third_morning');assert.equal(stored.flags.chapterThreeComplete,true);assert.equal(stored.flags.companion,'nikola');assert.equal(stored.flags.district,'dorcol');
assert.equal(restartChapter(stored,'arrival',NODES),true);assert.equal(stored.node,'road_start');assert.equal(stored.flags.companion,'nikola');assert.equal(stored.flags.host,undefined);assert.equal(stored.flags.district,undefined);assert.equal(stored.log.length,1);assert.deepEqual(Object.keys(stored.chapterMarks),['prologue','arrival']);assert.equal(stored.rewind.length,0);
assert.equal(restartChapter(stored,'prologue',NODES),true);assert.deepEqual(stored.flags,{});assert.equal(stored.log.length,0);assert.equal(stored.profile.nameId,'anna');assert.deepEqual(stored.journal,NODES[START].journal);
const invalid={districts:{node:'road_start',index:0,flags:{},journal:[],logLength:0}};assert.deepEqual(readChapterMarks(invalid,NODES,JOURNAL,20),{});
invalid.districts.node='next_steps';invalid.districts.flags={nested:{secret:'invalid'}};assert.deepEqual(readChapterMarks(invalid,NODES,JOURNAL,20),{});
invalid.districts.flags={};invalid.districts.logLength=99;assert.deepEqual(readChapterMarks(invalid,NODES,JOURNAL,20),{});
const legacy={...state,chapterMarks:undefined,node:'morning_start',log:[{speaker:'Ты',text:'Текущее утро'}]};rememberChapter(legacy,NODES,true);assert.equal(legacy.chapterMarks.districts.logLength,0);assert.equal(legacy.chapterMarks.districts.node,'morning_start');
assert.equal(continuationFor({flags:{}}),'road_start');assert.equal(continuationFor({flags:{chapterOneComplete:true}}),'next_steps');assert.equal(continuationFor({flags:{chapterThreeComplete:true}}),'third_morning');assert.equal(continuationFor({flags:{chapterThreeComplete:true,chapterFourComplete:true}}),'d3_start');assert.equal(continuationFor({flags:{chapterFiveComplete:true}}),'d17_start');assert.equal(continuationFor({flags:{chapterSixComplete:true}}),'d22_start');assert.equal(continuationFor({flags:{chapterSixComplete:true,chapterSevenComplete:true}}),null);
assert.equal(chapterFor({node:'end',flags:{chapterThreeComplete:true}},NODES).id,'districts');assert.equal(chapterFor({node:'end',flags:{chapterFourComplete:true}},NODES).id,'work');
assert.equal(NODES.chapter_three_close.next,'third_morning');
assert.equal(NODES.chapter_four_close.next,'d3_start');assert.equal(NODES.chapter_five_close.next,'d17_start');assert.equal(NODES.chapter_six_close.next,'d22_start');
assert.equal(chapterFor({node:'end',flags:{chapterFiveComplete:true}},NODES).id,'after-filing');assert.equal(chapterFor({node:'end',flags:{chapterSixComplete:true}},NODES).id,'courtyard');assert.equal(chapterFor({node:'end',flags:{chapterSevenComplete:true}},NODES).id,'answer');
for(const id of ['date_slow','date_friends','date_messages'])assert.equal(NODES[id].next,'ada_tired');
for(const id of ['date_kiss','date_hand']){
 assert.equal(NODES[id].next,null);
 assert.ok(NODES[id].choices.some(c=>c.next==='nikola_park'));
 assert.ok(NODES[id].choices.some(c=>c.next==='ada_tired'));
}
assert.equal(NODES.bank_call.pages.length,3);assert.equal(NODES.bank_call.exitAction.kind,'checklist');
console.log('Главы: разметка всех сцен, открытие, снимки, облачный формат, повтор с корректными выборами, блокировка будущих глав и старые сохранения проверены.');
