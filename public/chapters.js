export const CHAPTERS=[
 {id:'prologue',number:'Пролог',title:'Жара на посадке',start:'quick_arrival',description:'Аэропорт, кофе и первое знакомство.'},
 {id:'arrival',number:'Глава 1',title:'Своя дверь',start:'road_start',description:'Ключи, новый двор и первый вечер.'},
 {id:'districts',number:'Глава 2',title:'Район для жизни',start:'morning_start',description:'Карта Белграда, просмотр и люди по соседству.'},
 {id:'bank',number:'Глава 3',title:'Счёт на себя',start:'next_steps',description:'Решение о квартире, банк и встреча без чемодана.'},
 {id:'work',number:'Глава 4',title:'Своё дело',start:'third_morning',description:'Визит в банк, новые знакомства и первый рабочий план.'},
 {id:'residence',number:'Глава 5',title:'Право на завтра',start:'fourth_morning',description:'Документы, ответ из банка и решение о следующем шаге.'},
 {id:'courtyard',number:'Глава 6',title:'Свет во дворе',start:'courtyard_invite',description:'Дворовой кинопоказ, близкие люди и планы на будущее.'}
];
export function assignChapters(nodes){
 const boundaries=new Set(CHAPTERS.map(c=>c.start));
 for(const chapter of CHAPTERS){
  const seen=new Set();const visit=id=>{
   if(id==='end'||seen.has(id)||(boundaries.has(id)&&id!==chapter.start))return;
   seen.add(id);const node=nodes[id];if(!node)throw Error('Unknown chapter scene '+id);
   node.chapterId=chapter.id;node.chapter=chapter.number+' · '+chapter.title;
   for(const target of node.choices?.map(c=>c.next)??[node.next])visit(target);
  };visit(chapter.start);
 }
}
export function chapterFor(state,nodes){return CHAPTERS.find(c=>c.id===nodes[state?.node]?.chapterId)??(state?.flags?.chapterSixComplete?CHAPTERS[6]:state?.flags?.chapterFiveComplete?CHAPTERS[5]:state?.flags?.chapterFourComplete?CHAPTERS[4]:state?.flags?.chapterThreeComplete?CHAPTERS[3]:state?.flags?.chapterOneComplete?CHAPTERS[2]:CHAPTERS[0]);}
const validFlags=flags=>flags&&typeof flags==='object'&&!Array.isArray(flags)&&Object.keys(flags).length<=100&&Object.values(flags).every(v=>['boolean','number','string'].includes(typeof v)&&(typeof v!=='string'||v.length<=200));
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
 if(id==='prologue')mark={node:chapter.start,index:0,flags:{...nodes[chapter.start].effectOnEnter},journal:[...(nodes[chapter.start].journal??[])],logLength:0};
 if(!mark)return false;
 const earlier=new Set(CHAPTERS.slice(0,CHAPTERS.indexOf(chapter)).map(c=>c.id));
 state.chapterMarks=Object.fromEntries(Object.entries(state.chapterMarks??{}).filter(([key])=>earlier.has(key)));
 Object.assign(state,{node:mark.node,index:mark.index,flags:{...mark.flags},journal:[...mark.journal],log:state.log.slice(0,mark.logLength),rewind:[],completed:false});
 rememberChapter(state,nodes);return true;
}
export function continuationFor(state){return state?.flags?.chapterSixComplete?null:state?.flags?.chapterFiveComplete?'courtyard_invite':state?.flags?.chapterFourComplete?'fourth_morning':state?.flags?.chapterThreeComplete?'third_morning':state?.flags?.chapterOneComplete?'next_steps':'road_start';}
