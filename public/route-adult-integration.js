import {extendAdultEvenings} from './adult-evenings.js?v=0.17.3';
import {ADULT_PEOPLE,ADULT_DAYS_ROUTE} from './adult-cast.js?v=0.17.3';
import {DAYS,T} from './days.js?v=0.17.2';

// The older registry uses the same IDs as the new route and returns to the
// thirty-day story. Build it separately, then copy only compatible nights.
export function integrateAdultEvenings({NODES,JOURNAL,BACKGROUNDS,n,scene}) {
 const staged={};
 extendAdultEvenings({NODES:staged,JOURNAL,BACKGROUNDS,n,scene});
 const beats=['home','door','fade','prep','sex','sex_deep','cum_inside','cum_cloth','cum_chest','afterglow','morning'];
 for(const day of [1,...ADULT_DAYS_ROUTE]) for(const person of (day===1?['nikola','milica']:ADULT_PEOPLE)) {
  // This version of the scene has an unmasked portrait and identifies him by
  // name, contrary to the masked character's boundary in the active story.
  if(person==='milos')continue;
  const old=`evening${day}_${person}`, prefix=`adult_${old}`, end=`route${day}_close`;
  const ask=NODES[`${old}_night_ask`];
  if(!ask)continue;
  const accepted=ask.choices.find(c=>c.next===`${old}_fade`);
  if(!accepted)continue;
  for(const beat of beats){
   const node=staged[`${old}_${beat}`];
   if(!node)throw new Error(`Missing adult scene: ${old}_${beat}`);
   const map=target=>target?.startsWith(old+'_')?prefix+target.slice(old.length):end;
   node.next=beat==='morning'?end:node.next?map(node.next):node.next;
   if(node.choices)node.choices=node.choices.map(c=>({...c,next:map(c.next)}));
   node.adult=beat!=='morning';
   if(node.adult)node.skipTo=end;else delete node.skipTo;
   node.activeRoute=true;node.routeDay=day;node.chapterId=DAYS[day-1].id;
   NODES[`${prefix}_${beat}`]=node;
  }
  ask.choices.splice(1,0,{...accepted,label:T('Остаться вместе · подробная сцена','Stay together · detailed scene'),next:`${prefix}_home`,when:{gender:'male'}});
 }
}
