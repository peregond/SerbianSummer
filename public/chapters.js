import {PRELUDE,DAYS} from './days.js?v=0.15.4';
// Chapters are the prelude (prologue and arrival evening) followed by thirty days; see days.js and DAYS.md.
export const CHAPTERS=[...PRELUDE,...DAYS.map(d=>({id:d.id,number:'День '+d.n,title:d.title,start:d.start,description:d.description,day:d.n,stage:d.stage}))];
// Older saves record progress only as chapter flags. Each flag maps to the last day it completed.
const LEGACY_DAYS=[['chapterSevenComplete',30],['chapterSixComplete',21],['chapterFiveComplete',16],['chapterFourComplete',2],['chapterThreeComplete',1]];
export function dayProgress(flags={}){return Math.max(Number.isInteger(flags.dayDone)?flags.dayDone:0,...LEGACY_DAYS.filter(([flag])=>flags[flag]).map(([,day])=>day));}
export function assignChapters(nodes){
 const boundaries=new Set(CHAPTERS.map(c=>c.start));
 for(const chapter of CHAPTERS){
  const seen=new Set();const visit=id=>{
   if(id==='end'||seen.has(id)||(boundaries.has(id)&&id!==chapter.start))return;
   seen.add(id);const node=nodes[id];if(!node)throw Error('Unknown chapter scene '+id);
   node.chapterId=chapter.id;node.chapter=chapter.number+' · '+chapter.title;if(chapter.day)node.day='ДЕНЬ '+chapter.day;
   for(const target of node.choices?.map(c=>c.next)??[node.next])visit(target);
  };visit(chapter.start);
 }
}
export function chapterFor(state,nodes){return CHAPTERS.find(c=>c.id===nodes[state?.node]?.chapterId)??(CHAPTERS.findLast(c=>c.day&&c.day<=dayProgress(state?.flags))??(state?.flags?.chapterOneComplete?CHAPTERS[2]:CHAPTERS[0]));}
const validFlags=flags=>flags&&typeof flags==='object'&&!Array.isArray(flags)&&Object.keys(flags).length<=150&&Object.values(flags).every(v=>['boolean','number','string'].includes(typeof v)&&(typeof v!=='string'||v.length<=200));
export function readChapterMarks(input,nodes,journal,logLength){
 const result={};if(!input||typeof input!=='object'||Array.isArray(input))return result;
 for(const c of CHAPTERS){const mark=input[c.id];if(!mark)continue;
  if(!nodes[mark.node]||nodes[mark.node].chapterId!==c.id||!Number.isInteger(mark.index)||mark.index<0||mark.index>=nodes[mark.node].pages.length||!validFlags(mark.flags)||!Array.isArray(mark.journal)||mark.journal.length>300||mark.journal.some(id=>!Object.hasOwn(journal,id))||!Number.isInteger(mark.logLength)||mark.logLength<0||mark.logLength>logLength)continue;
  result[c.id]={node:mark.node,index:mark.index,flags:{...mark.flags},journal:[...new Set(mark.journal)],logLength:mark.logLength};
 }return result;
}
export function rememberChapter(state,nodes,alreadyRecorded=false){
 const id=nodes[state.node]?.chapterId;if(!id)return;
 state.chapterMarks??={};if(state.chapterMarks[id])return;
 state.chapterMarks[id]={node:state.node,index:state.index,flags:{...state.flags},journal:[...state.journal],logLength:Math.max(0,state.log.length-(alreadyRecorded?1:0))};
}
export function restartChapter(state,id,nodes){
 const chapter=CHAPTERS.find(c=>c.id===id);if(!chapter)return false;
 let mark=state.chapterMarks?.[id];
 if(id==='prologue')mark={node:chapter.start,index:0,flags:{...nodes[chapter.start].effectOnEnter,...(state.flags?.rentalCast==='new'?{rentalCast:'new'}:{})},journal:[...(nodes[chapter.start].journal??[])],logLength:0};
 if(!mark)return false;
 const earlier=new Set(CHAPTERS.slice(0,CHAPTERS.indexOf(chapter)).map(c=>c.id));
 state.chapterMarks=Object.fromEntries(Object.entries(state.chapterMarks??{}).filter(([key])=>earlier.has(key)));
 Object.assign(state,{node:mark.node,index:mark.index,flags:{...mark.flags},journal:[...mark.journal],log:state.log.slice(0,mark.logLength),rewind:[],completed:false});
 rememberChapter(state,nodes);return true;
}
export function continuationFor(state){const done=dayProgress(state?.flags);if(done>=30)return null;if(done===0)return state?.flags?.chapterOneComplete?'next_steps':'road_start';return DAYS[done].start;}
