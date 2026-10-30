// Saves made before this branch must still load, and the story they were in must still lead to the end.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeProgress} from '../lib/save-format.js';
import {NODES,JOURNAL,STORY_VERSION} from '../public/story.js';
import {rentalRedirect} from '../public/rental-story.js';
import {restartChapter,rememberChapter,CHAPTERS} from '../public/chapters.js';
import {rememberStep,rewindStep} from '../public/rewind.js';
import {applyFlatEffect,setViewMask} from '../public/flat-data.js';

const before=JSON.parse(fs.readFileSync(new URL('./fixtures/main-page-counts.json',import.meta.url)));
// No scene was removed and none became shorter: every saved (scene, line) position stays valid.
for(const [id,count]of Object.entries(before)){
  assert.ok(Object.hasOwn(NODES,id),'scene kept: '+id);
  assert.ok(NODES[id].pages.length>=count,`${id}: ${NODES[id].pages.length} lines now, ${count} before`);
}
// Every scene a save can sit in still leads to the end of the story.
const targets=node=>node.choices?node.choices.map(c=>c.next):[node.next];
const leadsToEnd=new Set(['end']);
for(let changed=true;changed;){changed=false;for(const [id,node]of Object.entries(NODES)){if(!leadsToEnd.has(id)&&targets(node).some(next=>leadsToEnd.has(next))){leadsToEnd.add(id);changed=true;}}}
for(const id of Object.keys(before))assert.ok(leadsToEnd.has(id),id+' still leads to the ending');
// The explicit positions named in the task: a save inside the old district viewing, at the old bank question and in the old kitchen.
const save=(node,index,flags={})=>({formatVersion:1,storyVersion:STORY_VERSION,profile:{gender:'female',nameId:'anna'},node,index,flags,journal:[],log:[],rewind:[],chapterMarks:{},completed:false});
for(const [node,index,flags]of [
  ['rental_hub_ana',0,{rentalCast:'new',district:'dorcol',districtOwner:'ana',rentalBond_ana:'romance'}],
  ['rental_first_vuk',3,{rentalCast:'new',districtOwner:'vuk'}],['morning_ready',4,{rentalCast:'new'}],['next_steps',2,{rentalCast:'new'}],
  ['housing_other',1,{rentalCast:'new',districtOwner:'marko'}],['bank_call',1,{}],['bank_asya',2,{}],['bank_visit',0,{}],
  ['host_evening',5,{host:'dragan'}],['host_coffee_lend',1,{host:'dragan',hostBorrowedTop:true}],['district_map',1,{}],['district_dorcol',4,{districtOwner:'jelena'}]
]){
  const state=normalizeProgress(save(node,index,flags));
  assert.equal(state.node,node);assert.equal(state.index,index);
}
// Where an older save continues: it lands in the new decision, then the new lease, never back into the one-step flow.
assert.equal(rentalRedirect('morning_ready','next_steps',{rentalCast:'new',districtOwner:'ana'}),'flat_decision');
// Saves from the original story version are untouched by every redirect.
for(const [from,target]of [['viewing_life','district_map'],['morning_ready','next_steps'],['third_morning','bank_visit'],['housing_other','bank_plan']])assert.equal(rentalRedirect(from,target,{}),target,from);
// A save that already had a bank choice or hostTop keeps them as ordinary flags.
const modern=normalizeProgress(save('bank_plan',0,{rentalCast:'new',bankChoice:'alta',bankRead:3,hostTop:'white',hostMeal:'ajvar',flatQuest:63,flatDiscount:150,flatWarmth:2,rentalMoved:true}));
assert.equal(modern.flags.bankChoice,'alta');
assert.ok(Object.keys(modern.flags).length<=250);
// Going back: the two-step rewind restores flags changed by the viewing quest and by an effect-only step.
{
  const state=normalizeProgress(save('flat_enter_ana',4,{rentalCast:'new',district:'dorcol',districtOwner:'ana'}));
  state.log=[{speaker:'a',text:'b'}];rememberStep(state);
  applyFlatEffect(state.flags,{flatEnter:'ana'});setViewMask(state.flags,0b101);state.flags.flatDiscount=50;
  assert.equal(rewindStep(state),true);
  assert.equal(state.flags.flatQuest,undefined);assert.equal(state.flags.flatDiscount,undefined);assert.equal(state.node,'flat_enter_ana');
}
// Restarting day 1 keeps the earlier choices and clears the flat that was chosen later.
{
  const state=normalizeProgress(save('flat_enter_ana',0,{rentalCast:'new',host:'dragan'}));
  rememberChapter(state,NODES);
  Object.assign(state.flags,{district:'dorcol',districtOwner:'ana',flatQuest:1,flatDiscount:50,rentalMoved:true});state.node='bank_plan';state.index=0;
  assert.equal(restartChapter(state,'districts',NODES),true);
  assert.equal(state.flags.rentalMoved,undefined);assert.equal(state.flags.flatQuest,undefined);assert.equal(state.flags.host,'dragan');
  assert.equal(state.node,'flat_enter_ana','the chapter mark is the first scene visited in the chapter');
}
void JOURNAL;void CHAPTERS;
console.log('Save continuity: no scene removed or shortened, every older position still reaches the end, redirects leave the original story alone, rewind and chapter restart checked.');
