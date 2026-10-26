// Romance state shared by the story, the player and the tests. Pure functions only.
// A partner slot is a person the player may grow close to: the airport person, Asya, Luka, the flat's owner, the bank person,
// the person at the document window and Miloš. Slots whose person depends on earlier choices resolve to an identity.
// Closeness is always the player's choice: the stage of a slot (date, kiss, lover) only ever rises through a choice that says so.
export const SLOTS=['airport','asya','luka','owner','bank','mup','milos'];
const STAGE_RANK={date:1,kiss:2,lover:3};
const IDENTITY={
 airport:f=>f.companion==='nikola'?'nikola':'milica',
 asya:()=>'asya',
 luka:()=>'luka',
 owner:f=>(f.districtBond==='romance'?f.districtOwner:f.hostBond==='romance'?f.host:f.districtOwner)==='jelena'?'jelena':'dragan',
 bank:f=>f.bankSpark==='teodora'?'teodora':'lazar',
 mup:f=>f.mupSpark==='strahinya'?'strahinya':'ivana',
 milos:()=>'milos'
};
export const NAMES={nikola:'Никола',milica:'Милица',asya:'Ася',luka:'Лука',dragan:'Драган',jelena:'Йелена',lazar:'Лазар',teodora:'Теодора',ivana:'Ивана',strahinya:'Страхиня',milos:'Милош'};
export const CASES={
 acc:{nikola:'Николу',milica:'Милицу',asya:'Асю',luka:'Луку',dragan:'Драгана',jelena:'Йелену',lazar:'Лазара',teodora:'Теодору',ivana:'Ивану',strahinya:'Страхиню',milos:'Милоша'},
 ins:{nikola:'Николой',milica:'Милицей',asya:'Асей',luka:'Лукой',dragan:'Драганом',jelena:'Йеленой',lazar:'Лазарем',teodora:'Теодорой',ivana:'Иваной',strahinya:'Страхиней',milos:'Милошем'}
};
export const nameCase=(slot,flags,grammarCase)=>CASES[grammarCase]?.[identityOf(slot,flags)]??nameOf(slot,flags);
export const SPRITES={nikola:'nikola-evening',milica:'milica',asya:'asya',luka:'luka',dragan:'dragan',jelena:'jelena'};
// Who is romantically open to the player, from what was chosen earlier in the story.
const AVAILABLE={
 airport:f=>f[(f.companion==='nikola'?'nikola':'milica')+'Bond']==='romance',
 asya:f=>f.asyaBond==='romance',
 luka:f=>f.lukaBond==='romance',
 owner:f=>f.hostBond==='romance'||f.districtBond==='romance',
 bank:f=>f.bankBond==='romance'&&f.bankDate==='asked',
 mup:f=>f.mupBond==='spark'&&f.mupDate==='asked',
 milos:f=>f.maskEnd==='spark'
};
export const identityOf=(slot,flags={})=>IDENTITY[slot]?.(flags);
export const nameOf=(slot,flags={})=>NAMES[identityOf(slot,flags)]??'';
export const isAvailable=(slot,flags={})=>!!AVAILABLE[slot]?.(flags);
export const stageOf=(slot,flags={})=>flags['love_'+slot]??null;
export const partnersAt=(flags={},stage)=>SLOTS.filter(slot=>(STAGE_RANK[stageOf(slot,flags)]??0)>=STAGE_RANK[stage]);
export const loversOf=(flags={})=>(flags.lovers??'').split(',').filter(slot=>SLOTS.includes(slot));
export const loveNames=(flags={})=>loversOf(flags).map(slot=>nameOf(slot,flags));
export function joinNames(names,and){return names.length<2?names.join(''):names.slice(0,-1).join(', ')+' '+and+' '+names.at(-1);}
// A choice may carry a condition: {partner,stage} (stage null = nothing has happened yet) or {minPartners:{stage,count}}.
export function choiceVisible(choice,flags={}){
 const when=choice.when;if(!when)return true;
 if(when.partner){
  if(!isAvailable(when.partner,flags))return false;
  const stage=stageOf(when.partner,flags);
  return when.stage===null?!stage:stage===when.stage;
 }
 if(when.minPartners)return partnersAt(flags,when.minPartners.stage).length>=when.minPartners.count;
 return true;
}
function addLover(flags,slot){
 const list=loversOf(flags);if(!list.includes(slot))list.push(slot);
 flags.lovers=list.join(',');flags.loverCount=list.length;
}
// Special effects of the romance scenes. They change stages and the lover list, and are never stored as flags themselves.
export function applyRomanceEffect(flags,effect={}){
 const slot=flags.lastPartner;
 if(effect.loveStep&&SLOTS.includes(slot)&&(STAGE_RANK[effect.loveStep]??0)>(STAGE_RANK[stageOf(slot,flags)]??0))flags['love_'+slot]=effect.loveStep;
 if(effect.makeLover&&SLOTS.includes(slot)){flags['love_'+slot]='lover';addLover(flags,slot);}
 if(effect.groupBond)for(const each of partnersAt(flags,'kiss')){flags['love_'+each]='lover';addLover(flags,each);}
 for(const key of ['loveStep','makeLover','groupBond'])delete flags[key];
 return flags;
}
