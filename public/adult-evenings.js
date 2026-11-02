// Optional 18+ evening nights for the 15-day intimacy registry.
// Modelled on public/nikola-early-night.js: consent aloud, adult:true beats skip to morning when 18+ is off.
// IDs: evening{day}_{person}_{kiss_ask|kiss|night_ask|home|door|fade|prep|sex|cum_*|afterglow|morning}
// Day 4 group: route4_group_{ask|fade|morning}. Male player POV (same gate as the Nikola park night).
import {T,DAYS} from './days.js?v=0.16.1';
import {ADULT_CAST,ADULT_PEOPLE,ADULT_DAYS_ROUTE,ADULT_GROUP_ID,artKey} from './adult-cast.js?v=0.16.9';
const DAY_META=Object.fromEntries(DAYS.map(d=>[d.n,d]));

const maleGate={gender:'male'};
// Romance IDs use strahinya; portrait sprites are registered as strahinja.
const SPRITE_ID={strahinya:'strahinja'};

function heShe(c,m,f){return c.gender==='m'?m:f;}
function himHer(c){return c.gender==='m'?['него','him']:['неё','her'];}
function hisHer(c){return c.gender==='m'?['его','his']:['её','her'];}
function spriteOf(person){return SPRITE_ID[person]??person;}

function buildBg(BACKGROUNDS,person,beat,labelRu,labelEn,descRu,descEn){
 const key=artKey(person,beat);
 if(!BACKGROUNDS[key]){
  BACKGROUNDS[key]={
   label:T(labelRu,labelEn),
   description:T(descRu,descEn),
   position:'50% 40%',
   file:key,
   optional:true
  };
 }
 return key;
}

// Nikola already has a full CG set from the riverside night — reuse those files.
const NIKOLA_ART={
 home:'nikola-apartment-night-v1',
 seductive:'nikola-bedroom-seductive-v1',
 door:'nikola-door-kiss-v1',
 briefs:'nikola-briefs-bed-smile-v1',
 touch:'nikola-briefs-touch-v2',
 ready:'nikola-ready-back-v1',
 sex:'nikola-sex-moan-v1',
 climax:'nikola-climax-face-v1',
 cumInside:'nikola-after-bliss-v1',
 cumCloth:'nikola-after-laugh-v1',
 cumChest:'nikola-after-tender-v1',
 afterglow:'nikola-afterglow-smile-v1'
};

function sceneArt(BACKGROUNDS,c){
 if(c.id==='nikola')return {...NIKOLA_ART};
 const name=c.name[0];
 const home=c.homeBg;
 const seductive=buildBg(BACKGROUNDS,c.id,'seductive',`${name} · ВЗГЛЯД`,`${c.name[1]} · LOOK`,`${name} в белье, соблазнительный взгляд`,`${c.name[1]} in lingerie/underwear, a seductive look`);
 const door=buildBg(BACKGROUNDS,c.id,'door',`${name} · У ДВЕРИ`,`${c.name[1]} · AT THE DOOR`,`${name} у двери`,`${c.name[1]} at the door`);
 const briefs=buildBg(BACKGROUNDS,c.id,'briefs',`${name} · БЕЛЬЁ`,`${c.name[1]} · UNDERWEAR`,`${name} на кровати в белье`,`${c.name[1]} on the bed in underwear`);
 const touch=buildBg(BACKGROUNDS,c.id,'touch',`${name} · КАСАНИЕ`,`${c.name[1]} · TOUCH`,`${name}, касание`,`${c.name[1]}, a touch`);
 const ready=buildBg(BACKGROUNDS,c.id,'ready',`${name} · ГОТОВ`,`${c.name[1]} · READY`,`${name} готов{a} к близости`,`${c.name[1]} ready for intimacy`);
 const sex=buildBg(BACKGROUNDS,c.id,'sex',`${name} · СЕКС`,`${c.name[1]} · SEX`,`${name} во время секса`,`${c.name[1]} during sex`);
 const climax=buildBg(BACKGROUNDS,c.id,'climax',`${name} · ОРГАЗМ`,`${c.name[1]} · CLIMAX`,`Крупный план лица`,`Close-up of the face`);
 const cumInside=buildBg(BACKGROUNDS,c.id,'cum-inside',`${name} · ВНУТРЬ`,`${c.name[1]} · INSIDE`,`После финиша внутрь`,`After finishing inside`);
 const cumCloth=buildBg(BACKGROUNDS,c.id,'cum-cloth',`${name} · НА БЕЛЬЁ`,`${c.name[1]} · ON CLOTH`,`Финиш на бельё`,`Finish on underwear`);
 const cumChest=buildBg(BACKGROUNDS,c.id,'cum-chest',`${name} · НА ГРУДЬ`,`${c.name[1]} · ON CHEST`,`Финиш на грудь`,`Finish on the chest`);
 const afterglow=buildBg(BACKGROUNDS,c.id,'afterglow',`${name} · ПОСЛЕ`,`${c.name[1]} · AFTER`,`После, мягкая улыбка`,`After, a soft smile`);
 return {home,seductive,door,briefs,touch,ready,sex,climax,cumInside,cumCloth,cumChest,afterglow};
}

function registerPersonNight(N,J,BACKGROUNDS,helpers,person,day,morningNext){
 const {note,me,say,cg,place,out,scene}=helpers;
 const c=ADULT_CAST[person];
 const art=sceneArt(BACKGROUNDS,c);
 const pref=`evening${day}_${person}`;
 const [himRu,himEn]=himHer(c);
 const [hisRu,hisEn]=hisHer(c);
 const journalKey=`adult_night_${person}`;
 if(!J[journalKey]){
  J[journalKey]={
   title:T(`Ночь с ${c.name[0]}`,`A night with ${c.name[1]}`),
   tag:T('ОТНОШЕНИЯ · БЛИЗОСТЬ','RELATIONSHIPS · INTIMACY'),
   text:T(`Мы оба сказали «да». Остальное остаётся между мной и ${c.name[0].replace(/а$/,'ой').replace(/я$/,'ей')}.`,`We both said “yes”. The rest stays between me and ${c.name[1]}.`)
  };
 }

 // Kiss ask / kiss
 N[`${pref}_kiss_ask`]=scene([
  note(`Мы стоим близко. ${c.name[0]} смотрит прямо и не торопит.` ,`We stand close. ${c.name[1]} looks straight and does not hurry.`),
  say(c.id,...c.askKiss,'flirty'),
  note(`Я знаю, что могу сказать «да», «пока нет» или просто улыбнуться: любой ответ здесь будет принят.`,`I know I can say “yes”, “not yet” or simply smile: any answer will be accepted here.`)
 ],null,{...place(...c.place,'21:00',c.homeBg),character:spriteOf(person),emotion:'flirty',portrait:true,choices:[
  {label:T('Поцеловать','Kiss'),tone:'romance',next:`${pref}_kiss`,effect:{loveStep:'kiss'},when:maleGate},
  {label:T('Пока подождать','Wait for now'),tone:'personal',next:morningNext}
 ]});

 N[`${pref}_kiss`]=scene([
  note(...c.kissOk),
  note(`${c.name[0]} отстраняется и спрашивает: «Всё хорошо?» Я киваю.`,` ${c.name[1]} pulls back and asks: “Is it all right?” I nod.`.trim()),
  me('Да. Ещё можно.','Yes. More is welcome.')
 ],morningNext,{...place(...c.place,'21:10',c.homeBg),character:spriteOf(person),emotion:'flirty',portrait:true,journal:['love_kiss']});

 // Night ask
 N[`${pref}_night_ask`]=scene([
  note(`В воздухе пахнет ${c.smell[0]}. ${c.name[0]} — ${c.body[0]}.`,`The air smells of ${c.smell[1]}. ${c.name[1]} is ${c.body[1]}.`),
  say(c.id,...c.askNight,'flirty'),
  note(`${heShe(c,'Он','Она')} ждёт. Без шутки — только вопрос.`,` ${heShe(c,'He','She')} waits. No joke — only the question.`.trim())
 ],null,{...place(...c.place,'21:20',c.homeBg),character:spriteOf(person),emotion:'flirty',portrait:true,choices:[
  {label:T(c.gender==='m'?'«Да. Хочу трахнуть тебя у тебя дома»':'«Да. Хочу остаться с тобой на ночь»',c.gender==='m'?'“Yes. I want to fuck you at your place”':'“Yes. I want to stay the night with you”'),tone:'romance',next:`${pref}_home`,effect:{[`adultNight_${person}`]:'yes'},when:maleGate},
  {label:T('«Не сегодня. Давай просто попрощаемся тепло»','“Not tonight. Let us just say a warm goodbye”'),tone:'friendship',next:morningNext,effect:{[`adultNight_${person}`]:'later'}}
 ]});

 N[`${pref}_home`]=scene([
  note(`В квартире тихо: пахнет ${c.smell[0]}.`,`The flat is quiet: it smells of ${c.smell[1]}.`),
  say(c.id,'Можно оставить лампу? Хочу видеть тебя.','May I leave the lamp on? I want to see you.','shy'),
  me('Оставь. Хочу видеть, как ты стонешь.','Leave it. I want to see you moan.'),
  note(`${heShe(c,'Он кивает','Она кивает')}. Остаётся только янтарный свет.`,` ${heShe(c,'He nods','She nods')}. Only amber light remains.`.trim())
 ],`${pref}_door`,{...place(...[`КОРИДОР · ${c.place[0]}`,`HALL · ${c.place[1]}`],'21:35',art.home),character:spriteOf(person),emotion:'shy',portrait:true,journal:[journalKey]});

 N[`${pref}_door`]=scene([
  cg(note(c.gender==='m'
   ?`Я прижимаю ${himRu} к двери. ${heShe(c,'Он','Она')} податлив${c.gender==='m'?'ый':'ая'}: раскрывает рот под поцелуем, трётся о бедро через бельё, тяжело дышит мне в шею.`
   :`Я прижимаю ${himRu} к двери. Она податливая: раскрывает рот под поцелуем, прижимается бёдрами, тяжело дышит мне в шею.`,
   c.gender==='m'
   ?`I pin ${himEn} to the door. ${heShe(c,'He','She')} is pliant: opens ${hisEn} mouth under the kiss, rubs against my thigh through underwear, breathes hard into my neck.`
   :`I pin ${himEn} to the door. She is pliant: opens her mouth under the kiss, presses her hips to me, breathes hard into my neck.`)),
  cg(say(c.id,...c.doorLine,'flirty')),
  cg(me('Договорились. В спальню.','Agreed. Bedroom.'))
 ],`${pref}_fade`,{...place(...[`ДВЕРЬ · ${c.place[0]}`,`DOOR · ${c.place[1]}`],'21:40',art.door)});

 // fade = first adult beat (briefs/lingerie), like nikola_park_closer
 if(c.gender==='m'){
  N[`${pref}_fade`]=scene([
   cg(note(`Он скидывает рубашку. Остаётся в ${c.cloth[0]}. Ткань спереди уже тёмная от смазки: толстый член натягивает бельё так, что виден рельеф.` ,`He drops the shirt. He is left in ${c.cloth[1]}. The fabric in front is already dark with precum: his thick cock stretches the cloth so the outline shows.`)),
   cg({...say(c.id,...c.touchLine,'shy'),bg:art.seductive}),
   cg({...note(`Я провожу ладонью по натянутому холму. Он дёргается под пальцами, стонет сквозь зубы. Жар, пульс, яйца поджаты в ткани.` ,`I run my palm over the stretched bulge. It twitches under my fingers; he moans through his teeth. Heat, pulse, his balls drawn tight in the fabric.`),bg:art.touch}),
   cg(me(`На колени. Сначала ${c.ready[0].replace(/^в /,'')}. Хочу тебя в ${c.ready[0]}, когда буду входить.` ,`On your knees. ${c.ready[1]} first. I want you in ${c.ready[1]} when I push in.`)),
   cg(say(c.id,'Секунду… они здесь.','One second… they are here.','flirty'))
  ],`${pref}_prep`,{...place(...[`КРОВАТЬ · ${c.place[0]}`,`BED · ${c.place[1]}`],'21:50',art.briefs),adult:true,skipTo:`${pref}_morning`});

  N[`${pref}_prep`]=scene([
   cg({...note(`Он натягивает ${c.ready[0]}: мешочек держит тяжёлые яйца и стояк, ягодицы открыты. Между щёк уже блестит, когда он встаёт на четвереньки.` ,`He pulls on ${c.ready[1]}: the pouch holds heavy balls and his hard cock, his ass bare. Between the cheeks it already gleams as he gets on all fours.`),bg:art.ready}),
   cg(say(c.id,...c.prepAsk,'flirty')),
   cg(note(`Я обливаю пальцы, кружу по сжатому кольцу, вхожу одним — жарко, узко. ${c.name[0]} роняет голову в подушку, подаётся назад. Второй палец.` ,`I pour lube on my fingers, circle his tight ring, push one in — hot, narrow. ${c.name[1]} drops his head into the pillow and pushes back. Second finger.`)),
   cg(me('Сейчас войду. Скажи «да».','I am going in now. Say “yes”.')),
   cg(say(c.id,...c.yesIn,'flirty'))
  ],`${pref}_sex`,{...place(...[`ПОДГОТОВКА · ${c.place[0]}`,`PREP · ${c.place[1]}`],'22:05',art.ready),adult:true,skipTo:`${pref}_morning`});

  N[`${pref}_sex`]=scene([
   cg({...note(`Головка упирается, проходит — он стонет в подушку, потом рвано смеётся. Я держу его за бёдра и вхожу целиком. Когда двигаюсь жёстче, смазка хлюпает, кровать стучит о стену.` ,`The head presses, slips in — he moans into the pillow, then laughs roughly. I hold his hips and bury myself to the hilt. When I thrust harder, lube squelches, the bed knocks the wall.`),bg:art.sex}),
   cg({...say(c.id,...c.during,'flirty'),bg:art.climax}),
   cg(note(`Я ускоряюсь. Он подаётся навстречу. ${c.warn[0]}`,`I speed up. He meets every thrust. ${c.warn[1]}`))
  ],null,{...place(...[`НОЧЬ · ${c.place[0]}`,`NIGHT · ${c.place[1]}`],'22:20',art.sex),adult:true,skipTo:`${pref}_morning`,choices:[
   {label:T('Кончить в него глубоко','Cum deep inside him'),tone:'romance',next:`${pref}_cum_inside`,effect:{[c.finishFlag]:'inside'}},
   {label:T('Вытащить и кончить на бельё','Pull out and cum on the underwear'),tone:'romance',next:`${pref}_cum_cloth`,effect:{[c.finishFlag]:'cloth'}},
   {label:T('Перевернуть и кончить на грудь','Flip him and cum on his chest'),tone:'romance',next:`${pref}_cum_chest`,effect:{[c.finishFlag]:'chest'}}
  ]});

  N[`${pref}_cum_inside`]=scene([
   cg(note(`Я вколачиваюсь до упора и кончаю в него — густыми толчками. Он сжимается вокруг члена; его собственный стояк дёргается в мешочке, и он кончает следом.` ,`I slam in to the hilt and cum inside him — thick pulses. He clamps around my cock; his own erection jerks in the pouch and he cums right after.`)),
   cg(say(c.id,...c.cumIn,'shy')),
   cg(note(`Когда я медленно выхожу, сперма тянется нитью и капает на простыню. Он дрожит и смеётся.` ,`When I slowly pull out, cum stretches in a string and drips onto the sheet. He trembles and laughs.`))
  ],`${pref}_afterglow`,{...place(...[`ФИНИШ · ${c.place[0]}`,`FINISH · ${c.place[1]}`],'22:35',art.cumInside),adult:true,skipTo:`${pref}_morning`,journal:[journalKey]});

  N[`${pref}_cum_cloth`]=scene([
   cg(note(`Я вытаскиваю в последний момент и дрочу над ним. Он подставляет зад — и я крою ${c.ready[0]} густыми струями.` ,`I pull out at the last second and stroke over him. He offers his ass — and I paint ${c.ready[1]} with thick ropes.`)),
   cg(say(c.id,...c.cumCloth,'laughing')),
   cg(note(`Он проводит пальцем по ткани, собирает каплю и облизывает, глядя на меня.` ,`He runs a finger over the fabric, gathers a drop and licks it while looking at me.`))
  ],`${pref}_afterglow`,{...place(...[`ФИНИШ · ${c.place[0]}`,`FINISH · ${c.place[1]}`],'22:35',art.cumCloth),adult:true,skipTo:`${pref}_morning`,journal:[journalKey]});

  N[`${pref}_cum_chest`]=scene([
   cg(note(`Я вытаскиваю, переворачиваю его на спину и кончаю на широкую грудь — белые полосы, на соски, на шею.` ,`I pull out, flip him onto his back and cum on his broad chest — white stripes, on his nipples, on his throat.`)),
   cg(say(c.id,...c.cumChest,'flirty')),
   cg(note(`Он тянет меня в поцелуй. Я сжимаю мешочек ладонью — и он кончает себе на живот.` ,`He pulls me into a kiss. I squeeze the pouch in my palm — and he cums onto his own stomach.`))
  ],`${pref}_afterglow`,{...place(...[`ФИНИШ · ${c.place[0]}`,`FINISH · ${c.place[1]}`],'22:35',art.cumChest),adult:true,skipTo:`${pref}_morning`,journal:[journalKey]});
 }else{
  N[`${pref}_fade`]=scene([
   cg(note(`Она скидывает одежду. Остаётся в ${c.cloth[0]}. Соски просвечивают сквозь ткань; между ног уже влажно.` ,`She drops her clothes. She is left in ${c.cloth[1]}. Her nipples show through the fabric; she is already wet between her legs.`)),
   cg({...say(c.id,...c.touchLine,'shy'),bg:art.seductive}),
   cg({...note(`Я провожу ладонью по груди, ниже — по кружеву. Она всхлипывает и разводит колени.` ,`I run my palm over her chest, then lower over the lace. She gasps and parts her knees.`),bg:art.touch}),
   cg(me('Ложись. Хочу видеть тебя, когда буду входить.','Lie back. I want to see you when I push in.')),
   cg(say(c.id,'Иди ко мне.','Come to me.','flirty'))
  ],`${pref}_prep`,{...place(...[`КРОВАТЬ · ${c.place[0]}`,`BED · ${c.place[1]}`],'21:50',art.briefs),adult:true,skipTo:`${pref}_morning`});

  N[`${pref}_prep`]=scene([
   cg({...note(`Она в ${c.ready[0]}. Я обливаю пальцы смазкой, кружу по клитору, вхожу одним — жарко, узко. Она роняет голову в подушку.` ,`She is in ${c.ready[1]}. I pour lube on my fingers, circle her clit, push one in — hot, narrow. She drops her head into the pillow.`),bg:art.ready}),
   cg(say(c.id,...c.prepAsk,'flirty')),
   cg(note(`Второй палец. Она подаётся навстречу и шепчет «да».` ,`Second finger. She pushes back and whispers “yes”.`)),
   cg(me('Сейчас войду. Скажи «да».','I am going in now. Say “yes”.')),
   cg(say(c.id,...c.yesIn,'flirty'))
  ],`${pref}_sex`,{...place(...[`ПОДГОТОВКА · ${c.place[0]}`,`PREP · ${c.place[1]}`],'22:05',art.ready),adult:true,skipTo:`${pref}_morning`});

  N[`${pref}_sex`]=scene([
   cg({...note(`Головка упирается, проходит — она стонет и цепляется за простыню. Я вхожу медленно до конца. Когда двигаюсь жёстче, кровать стучит о стену.` ,`The head presses, slips in — she moans and grips the sheet. I push in slowly to the hilt. When I thrust harder, the bed knocks the wall.`),bg:art.sex}),
   cg({...say(c.id,...c.during,'flirty'),bg:art.climax}),
   cg(note(`Я ускоряюсь. Она встречает каждый толчок. ${c.warn[0]}` ,`I speed up. She meets every thrust. ${c.warn[1]}`))
  ],null,{...place(...[`НОЧЬ · ${c.place[0]}`,`NIGHT · ${c.place[1]}`],'22:20',art.sex),adult:true,skipTo:`${pref}_morning`,choices:[
   {label:T('Кончить в неё глубоко','Cum deep inside her'),tone:'romance',next:`${pref}_cum_inside`,effect:{[c.finishFlag]:'inside'}},
   {label:T('Вытащить и кончить на бельё','Pull out and cum on the lingerie'),tone:'romance',next:`${pref}_cum_cloth`,effect:{[c.finishFlag]:'cloth'}},
   {label:T('Кончить ей на грудь','Cum on her chest'),tone:'romance',next:`${pref}_cum_chest`,effect:{[c.finishFlag]:'chest'}}
  ]});

  N[`${pref}_cum_inside`]=scene([
   cg(note(`Я вколачиваюсь до упора и кончаю в неё — густыми толчками. Она сжимается вокруг члена и кончает следом, дрожа.` ,`I slam in to the hilt and cum inside her — thick pulses. She clamps around my cock and cums right after, shaking.`)),
   cg(say(c.id,...c.cumIn,'shy')),
   cg(note(`Когда я медленно выхожу, сперма тянется нитью на простыню между разведённых колен.` ,`When I slowly pull out, cum stretches in a string onto the sheet between her spread knees.`))
  ],`${pref}_afterglow`,{...place(...[`ФИНИШ · ${c.place[0]}`,`FINISH · ${c.place[1]}`],'22:35',art.cumInside),adult:true,skipTo:`${pref}_morning`,journal:[journalKey]});

  N[`${pref}_cum_cloth`]=scene([
   cg(note(`Я вытаскиваю в последний момент и кончаю на ${c.ready[0]} — густые струи на кружево и живот.` ,`I pull out at the last second and cum on ${c.ready[1]} — thick ropes on the lace and her stomach.`)),
   cg(say(c.id,...c.cumCloth,'laughing')),
   cg(note(`Она проводит пальцем по ткани и смотрит на меня.` ,`She runs a finger over the fabric and looks at me.`))
  ],`${pref}_afterglow`,{...place(...[`ФИНИШ · ${c.place[0]}`,`FINISH · ${c.place[1]}`],'22:35',art.cumCloth),adult:true,skipTo:`${pref}_morning`,journal:[journalKey]});

  N[`${pref}_cum_chest`]=scene([
   cg(note(`Я кончаю ей на грудь — белые полосы на коже, на соски, капля на ключице.` ,`I cum on her chest — white stripes on her skin, on her nipples, a drop on her collarbone.`)),
   cg(say(c.id,...c.cumChest,'flirty')),
   cg(note(`Она тянет меня в поцелуй, размазывая тепло между нами.` ,`She pulls me into a kiss, smearing the heat between us.`))
  ],`${pref}_afterglow`,{...place(...[`ФИНИШ · ${c.place[0]}`,`FINISH · ${c.place[1]}`],'22:35',art.cumChest),adult:true,skipTo:`${pref}_morning`,journal:[journalKey]});
 }

 N[`${pref}_afterglow`]=scene([
  cg(note(`Мы лежим под одним одеялом. Лампа всё ещё горит.` ,`We lie under one blanket. The lamp is still on.`)),
  cg(say(c.id,...c.after,'friendly')),
  cg(note(`Я засыпаю под запах ${c.smell[0]}, секса и ${hisRu} кожи.` ,`I fall asleep under the smell of ${c.smell[1]}, sex and ${hisEn} skin.`))
 ],`${pref}_morning`,{...place(...[`ПОСЛЕ · ${c.place[0]}`,`AFTER · ${c.place[1]}`],'23:40',art.afterglow),adult:true,skipTo:`${pref}_morning`});

 N[`${pref}_morning`]=scene([
  note(...c.morning),
  note(`Я улыбаюсь и закрываю дверь так же тихо, как мы вчера её открывали.` ,`I smile and close the door as quietly as we opened it yesterday.`)
 ],morningNext,{...place(...[`УТРО · ${c.place[0]}`,`MORNING · ${c.place[1]}`],'07:40',art.home),day:T(`ДЕНЬ ${day}`,`DAY ${day}`),journal:[journalKey]});
}

function registerGroup(N,J,helpers,morningNext){
 const {note,me,cg,place,scene}=helpers;
 const pref=ADULT_GROUP_ID;
 J.adult_night_group={
  title:T('Ночь втроём','A night for three'),
  tag:T('ОТНОШЕНИЯ · ОТКРЫТОСТЬ','RELATIONSHIPS · OPENNESS'),
  text:T('Мы спросили друг друга вслух. Каждый мог сказать «нет».','We asked each other aloud. Anyone could have said “no”.')
 };
 N[`${pref}_ask`]=scene([
  note('Нас трое. Мы сидим близко, и я говорю вслух: мне дороги оба, и я хочу ночи только если все согласны.','There are three of us. We sit close, and I say aloud: both are dear to me, and I want the night only if everyone agrees.'),
  note('Никто не отшатывается. Кто-то улыбается, кто-то спрашивает: «Ты уверен{a}?»','Nobody recoils. Someone smiles, someone asks: “Are you sure?”'),
  note('«Нет» здесь всегда хороший ответ. Если кому-то неловко — скажите сейчас, и мы просто выпьем чаю.','“No” is always a good answer here. If anyone feels awkward — say so now and we will simply drink tea.')
 ],null,{...place('ВЕЧЕР · ВТРОЁМ','EVENING · THREE','22:00','room-window'),choices:[
  {label:T('Остаться вместе, раз все согласны','Stay together, since everyone agrees'),tone:'romance',next:`${pref}_fade`,effect:{groupBond:true},when:maleGate},
  {label:T('Выпить чаю и просто поговорить','Drink tea and simply talk'),tone:'friendship',next:morningNext}
 ]});

 N[`${pref}_fade`]=scene([
  cg(note('Мы смеёмся, как неловко рассаживаемся на кровати. Потом смех стихает, и каждый спрашивает глазами: можно?','We laugh at how awkwardly we find places on the bed. Then the laughter fades, and each asks with their eyes: may I?')),
  cg(note('Руки, рты, бёдра — медленно, с паузами. Кто-то шепчет «ещё», кто-то «подожди», и оба ответа принимаются. Я целую одного, пока другой гладит меня; потом меняемся, пока ткань не сползает, пока стоны не перекрывают уличный шум.','Hands, mouths, hips — slowly, with pauses. Someone whispers “more”, someone “wait”, and both answers are accepted. I kiss one while the other strokes me; then we switch, until cloth slips, until moans cover the street noise.')),
  cg(note('Я вхожу в одного, держа другого за руку; потом наоборот. Финиш — общий: кто-то кончает мне на живот, кто-то сжимается вокруг члена, и мы падаем в кучу горячих тел под одним одеялом.','I push into one while holding the other’s hand; then the other way round. The finish is shared: someone cums on my stomach, someone clamps around my cock, and we fall into a heap of hot bodies under one blanket.')),
  cg(me('Всё хорошо?','Is everyone all right?')),
  cg(note('Оба кивают. Кто-то смеётся хрипло: «Да. Ещё можно — потом».','Both nod. Someone laughs roughly: “Yes. More is welcome — later.”'))
 ],`${pref}_morning`,{...place('НОЧЬ · ВТРОЁМ','NIGHT · THREE','23:20','room-window'),adult:true,skipTo:`${pref}_morning`,journal:['adult_night_group']});

 N[`${pref}_morning`]=scene([
  note('Утром на кухне шумно: все пытаются поместиться у чайника, спорят, кто варит кофе, и никто не уходит.','In the morning the kitchen is noisy: everyone tries to fit by the kettle, argues about who makes the coffee, and nobody leaves.'),
  note('Мы не придумываем новых слов. Мы договариваемся говорить честно, не прятаться и не обещать лишнего.','We invent no new words. We agree to speak honestly, not to hide and not to promise too much.')
 ],morningNext,{...place('УТРО · ВТРОЁМ','MORNING · THREE','08:30','room-window'),day:T('ДЕНЬ 4','DAY 4'),journal:['adult_night_group']});
}

export function extendAdultEvenings({NODES:N,JOURNAL:J,BACKGROUNDS,n,scene}){
 const note=(ru,en)=>n(T(ru,en));
 const me=(ru,en)=>({speaker:'player',text:T(ru,en)});
 const say=(id,ru,en,emotion='flirty')=>({speaker:id,text:T(ru,en),emotion});
 const cg=(page)=>({...page,portrait:false});
 const out=()=>({kind:'tap',label:T('Продолжить','Continue'),object:T('Продолжить','Continue')});
 const place=(ru,en,time,bg)=>({bg,location:T(ru,en),time,portrait:false,exitAction:out()});
 const helpers={note,me,say,cg,place,out,scene};

 const morningNextFor=day=>({1:'night_messages',12:'bank_send',15:'document_evening'}[day]??`d${day}_end`);
 // Day 1: Nikola and Milica
 for(const person of ['nikola','milica']){
  registerPersonNight(N,J,BACKGROUNDS,helpers,person,1,morningNextFor(1));
 }
 // Days 6–15: full cast registry
 for(const day of ADULT_DAYS_ROUTE){
  for(const person of ADULT_PEOPLE){
   registerPersonNight(N,J,BACKGROUNDS,helpers,person,day,morningNextFor(day));
  }
 }
 // Day 4 group
 registerGroup(N,J,helpers,morningNextFor(4));

 // Registered after applyMobilePacing / assignChapters walk: attach exit actions and chapter marks by day.
 for(const [id,node] of Object.entries(N)){
  const m=/^evening(\d+)_/.exec(id)||(id.startsWith('route4_group_')?['','4']:null);
  if(!m)continue;
  const day=Number(m[1]);
  const meta=DAY_META[day];
  if(meta){
   node.chapterId=meta.id;
   node.chapter=`День ${meta.n} · ${meta.title}`;
   node.day=`ДЕНЬ ${meta.n}`;
  }
  if(!node.choices){
   const last=node.pages.length-1;
   const action=node.exitAction??out();
   node.actions={...(node.actions??{}),[last]:action};
   node.pages[last].action=action;
  }
 }
}
