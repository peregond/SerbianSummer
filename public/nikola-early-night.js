// Early optional night with Nikola after the chapter-3 riverside date (kiss or hand).
// Male player tops Nikola. Gated by companion=nikola, profile gender male, and adult settings for the explicit beat.
// Friendly refusal at any step returns to chapter_three_close without penalty.
// Scene IDs use the nikola_park_* prefix so they never collide with prologue nikola_invite / nikola_phone / …
import {T} from './days.js?v=0.16.1';

const PARK_BG='belgrade-park-evening-v1';
const HOME_BG='nikola-apartment-night-v1';
const SCENE={
 shy:'nikola-park-shy-wanting-v1',
 laugh:'nikola-park-nervous-laugh-v1',
 seductive:'nikola-bedroom-seductive-v1',
 door:'nikola-door-kiss-v1',
 briefs:'nikola-briefs-bed-smile-v1',
 touch:'nikola-briefs-touch-v2',
 moan:'nikola-bed-moan-v1',
 jock:'nikola-ready-back-v1',
 fuck:'nikola-jock-fuck-v1',
 climax:'nikola-climax-face-v1',
 cumInside:'nikola-cum-inside-v1',
 cumJock:'nikola-cum-jock-v1',
 cumChest:'nikola-cum-chest-v1',
 afterglow:'nikola-afterglow-smile-v1'
};

export const NIKOLA_EARLY_NIGHT_BACKGROUNDS={
 [PARK_BG]:{label:T('БЕЛГРАД · ПАРК','BELGRADE · PARK'),description:T('Вечерний парк: аллея, фонари, скамейки','Evening park: avenue, lamps, benches'),position:'50% 45%'},
 [HOME_BG]:{label:T('КВАРТИРА НИКОЛЫ · НОЧЬ','NIKOLA’S FLAT · NIGHT'),description:T('Небольшая спальня: лампа, простыни, подоконник с корицей','A small bedroom: lamp, sheets, cinnamon on the windowsill'),position:'50% 40%'},
 [SCENE.shy]:{label:T('НИКОЛА · ХОЧЕТ','NIKOLA · WANTING'),description:T('Никола в белых трусах, смущённый возбуждённый взгляд','Nikola in white briefs, shy wanting look'),position:'50% 35%'},
 [SCENE.laugh]:{label:T('НИКОЛА · СМЕХ','NIKOLA · LAUGH'),description:T('Никола в белых трусах, нервный смех','Nikola in white briefs, a nervous laugh'),position:'50% 35%'},
 [SCENE.seductive]:{label:T('НИКОЛА · ВЗГЛЯД','NIKOLA · LOOK'),description:T('Никола в белых трусах, соблазнительная улыбка','Nikola in white briefs, a seductive smile'),position:'50% 35%'},
 [SCENE.door]:{label:T('НИКОЛА · У ДВЕРИ','NIKOLA · AT THE DOOR'),description:T('Никола в белых трусах у двери','Nikola in white briefs at the door'),position:'50% 40%'},
 [SCENE.briefs]:{label:T('НИКОЛА · БЕЛЫЕ BRIEF','NIKOLA · WHITE BRIEFS'),description:T('Никола на кровати в белых трусах, смотрит на меня и улыбается','Nikola on the bed in white briefs, looking at me with a smile'),position:'50% 35%'},
 [SCENE.touch]:{label:T('НИКОЛА · КАСАНИЕ','NIKOLA · TOUCH'),description:T('Никола на кровати в белых трусах, глаза закрыты, прикусил губу','Nikola on the bed in white briefs, eyes closed, biting his lip'),position:'50% 40%'},
 [SCENE.moan]:{label:T('НИКОЛА · СТОН','NIKOLA · MOAN'),description:T('Никола в белых трусах на кровати, стонет','Nikola in white briefs on the bed, moaning'),position:'50% 40%'},
 [SCENE.jock]:{label:T('НИКОЛА · НА КОЛЕНЯХ','NIKOLA · KNEELING'),description:T('Никола на коленях на кровати, оглядывается через плечо','Nikola kneeling on the bed, looking back over his shoulder'),position:'50% 40%'},
 [SCENE.fuck]:{label:T('НИКОЛА · СЕКС','NIKOLA · SEX'),description:T('Заглушка: секс с цензурными плашками под inpaint','Placeholder: sex with censor bars for inpaint'),position:'50% 40%'},
 [SCENE.climax]:{label:T('НИКОЛА · ОРГАЗМ','NIKOLA · CLIMAX'),description:T('Крупный план лица Николы в оргазме','Close-up of Nikola’s face at climax'),position:'50% 30%'},
 [SCENE.cumInside]:{label:T('НИКОЛА · ФИНИШ ВНУТРЬ','NIKOLA · FINISH INSIDE'),description:T('Заглушка финиша внутрь; чёрные плашки под inpaint','Placeholder for finishing inside; black bars for inpaint'),position:'50% 40%'},
 [SCENE.cumJock]:{label:T('НИКОЛА · ФИНИШ НА ДЖОКИ','NIKOLA · FINISH ON JOCK'),description:T('Заглушка финиша на джоки; чёрные плашки под inpaint','Placeholder for finishing on the jock; black bars for inpaint'),position:'50% 40%'},
 [SCENE.cumChest]:{label:T('НИКОЛА · ФИНИШ НА ГРУДЬ','NIKOLA · FINISH ON CHEST'),description:T('Заглушка финиша на грудь; чёрные плашки под inpaint','Placeholder for finishing on the chest; black bars for inpaint'),position:'50% 40%'},
 [SCENE.afterglow]:{label:T('НИКОЛА · ПОСЛЕ','NIKOLA · AFTER'),description:T('Никола в белых трусах после, мягкая улыбка','Nikola in white briefs after, a soft smile'),position:'50% 40%'}
};

export function extendNikolaEarlyNight({NODES:N,JOURNAL:J,BACKGROUNDS,n,y,scene}){
 Object.assign(BACKGROUNDS,NIKOLA_EARLY_NIGHT_BACKGROUNDS);
 const note=(ru,en)=>n(T(ru,en));
 const me=(ru,en)=>({speaker:'player',text:T(ru,en)});
 const nik=(ru,en,emotion='flirty')=>({speaker:'nikola',text:T(ru,en),emotion,character:'nikola-evening'});
 const out=label=>({kind:'tap',label,object:label});
 const place=(ru,en,time,bg,extra={})=>({bg,location:T(ru,en),time,portrait:false,exitAction:out(T('Продолжить','Continue')),...extra});
 const maleNikola={all:[{flag:'companion',equals:'nikola'},{gender:'male'}]};

 Object.assign(J,{
  nikola_early_night:{
   title:T('Парк и дверь Николы','The park and Nikola’s door'),
   tag:T('ОТНОШЕНИЯ · РАННЯЯ НОЧЬ','RELATIONSHIPS · EARLY NIGHT'),
   text:T('После свидания у реки мы зашли в парк, а потом — к Николе. Всё было по взаимному «да».','After the riverside date we walked through the park and then to Nikola’s. Everything was by mutual “yes”.')
  }
 });

 // Entry: after kiss or holding hands, a male player who chose Nikola may continue into the park.
 for(const id of ['date_kiss','date_hand']){
  const node=N[id];
  const home=node.next;
  node.next=null;
  delete node.exitAction;
  node.choices=[
   {label:T('Предложить ещё пройтись через парк','Suggest walking on through the park'),tone:'romance',next:'nikola_park',effect:{nikolaPark:'asked'},when:maleNikola},
   {label:T('Попрощаться и пойти домой','Say goodbye and go home'),tone:'personal',next:home}
  ];
 }

 // 1. Park
 N.nikola_park=scene([
  note('Мы сворачиваем с набережной в парк. Фонари тёплые, гравий тихо хрустит под ногами, где-то лает собака.','We turn off the embankment into the park. The lamps are warm, gravel crunches softly underfoot, a dog barks somewhere.'),
  {...nik('Здесь пахнет лучше, чем у стойки. И никто не просит кифлу.','It smells better here than at the counter. And nobody is asking for a kifla.','laughing'),bg:SCENE.laugh,portrait:false},
  note('Его льняная рубашка чуть расстёгнута. Когда он идёт рядом, я чувствую жар его плеча — и то, как у меня уже стоит просто от его голоса.','His linen shirt is slightly unbuttoned. When he walks beside me I feel the heat of his shoulder — and how hard I already am just from his voice.'),
  me('Если скажешь «стоп», мы просто дойдём до выхода. Но мне хочется тебя ближе.','If you say “stop”, we will just walk to the exit. But I want you closer.'),
  {...nik('Не говори «стоп». Мне тоже хочется. Пальцы дрожат, будто я снова мешу тесто в четыре утра.','Do not say “stop”. I want it too. My fingers are shaking as if I were kneading dough at four in the morning again.','shy'),bg:SCENE.shy,portrait:false}
 ],'nikola_park_invite',{...place('БЕЛГРАД · ПАРК','BELGRADE · PARK','20:05',PARK_BG),character:'nikola-evening',emotion:'flirty',portrait:true,music:'encounter'});

 // 2. Invitation
 N.nikola_park_invite=scene([
  note('У выхода из парка Никола останавливается. Ключи в кармане звякают — он сжимает их сильнее, чем нужно.','At the park exit Nikola stops. Keys jingle in his pocket — he grips them harder than he needs to.'),
  {...nik('Моя квартира в двух остановках. Можем просто посидеть. Или… если хочешь остаться на ночь — я хочу. Скажи прямо.','My flat is two stops away. We can just sit. Or… if you want to stay the night — I want that. Say it straight.','flirty'),bg:SCENE.seductive,portrait:false},
  note('Он смотрит мне в глаза, и в белых трусах у него уже явно натянуто. Он не прячет это — только сглатывает.','He looks me in the eye, and his white briefs are already clearly tight. He does not hide it — he only swallows.')
 ],null,{...place('БЕЛГРАД · ПАРК · ВЫХОД','BELGRADE · PARK · EXIT','20:20',SCENE.shy),choices:[
  {label:T('«Да. Хочу трахнуть тебя у тебя дома»','“Yes. I want to fuck you at your place”'),tone:'romance',next:'nikola_park_home',effect:{nikolaPark:'yes'}},
  {label:T('«Не сегодня. Проводи меня до трамвая»','“Not tonight. Walk me to the tram”'),tone:'friendship',next:'nikola_park_decline',effect:{nikolaPark:'later'}}
 ]});

 N.nikola_park_decline=scene([
  nik('Хорошо. Спасибо, что сказал честно. Завтра всё равно испеку тебе кифлу.','All right. Thank you for saying it honestly. Tomorrow I will still bake you a kifla.','friendly'),
  note('Он провожает меня до остановки. Поцелуй на прощание короткий и тёплый — без обиды.','He walks me to the stop. The goodbye kiss is short and warm — without hurt.')
 ],'chapter_three_close',{...place('БЕЛГРАД · ОСТАНОВКА','BELGRADE · TRAM STOP','20:35',PARK_BG),character:'nikola-evening',emotion:'friendly',portrait:true});

 // 3. Home + consent (split for mobile pacing: ≤5 lines between actions)
 N.nikola_park_home=scene([
  note('В подъезде пахнет старым деревом. В квартире Николы тихо: на подоконнике остывает миска с тестом, в воздухе корица и тёплая мука.','The stairwell smells of old wood. Nikola’s flat is quiet: a bowl of dough cools on the windowsill, cinnamon and warm flour in the air.'),
  nik('Можно выключить свет? Или оставить лампу. Как тебе удобнее.','May I switch the light off? Or leave the lamp. Whichever you prefer.','shy'),
  me('Лампу оставь. Хочу видеть, как ты стонешь.','Leave the lamp. I want to see you moan.'),
  note('Он кивает и оставляет лампу. В коридоре становится только янтарный свет.','He nods and leaves the lamp on. Only amber light remains in the hall.')
 ],'nikola_park_door',{...place('КВАРТИРА НИКОЛЫ · КОРИДОР','NIKOLA’S FLAT · HALL','21:10',HOME_BG),character:'nikola-evening',emotion:'shy',portrait:true,journal:['nikola_early_night']});

 N.nikola_park_door=scene([
  note('Я прижимаю его к двери. Он выше меня на голову, но податливый: раскрывает рот под поцелуем, трётся стояком о бедро через белые трусы, тяжело дышит мне в шею.','I pin him to the door. He is a head taller than me, but pliant: he opens his mouth under the kiss, rubs his hard-on against my thigh through white briefs, breathes hard into my neck.'),
  nik('Бля… да. Хочу, чтобы ты меня трахнул. Только скажи, если что не так — я сразу остановлюсь. И ты тоже.','Fuck… yes. I want you to fuck me. Just say if anything is wrong — I will stop at once. And so will you.','flirty'),
  me('Договорились. В спальню.','Agreed. Bedroom.')
 ],'nikola_park_closer',{...place('КВАРТИРА НИКОЛЫ · ДВЕРЬ','NIKOLA’S FLAT · DOOR','21:15',SCENE.door)});

 // 4. Briefs — adult; skipped to morning when 18+ is off
 N.nikola_park_closer=scene([
  note('Он скидывает рубашку. Остаётся в белых хлопковых Calvin Klein — узкая резинка, логотип на поясе. Ткань спереди уже тёмная от смазки: толстый член натягивает брифы так, что виден рельеф головки и ствола.','He drops the shirt. He is left in white cotton Calvin Klein briefs — narrow waistband, logo on the band. The fabric in front is already dark with precum: his thick cock stretches the briefs so the outline of the head and shaft shows.'),
  {...nik('Смотри, что ты со мной сделал ещё в парке.','Look what you did to me back in the park.','shy'),bg:SCENE.seductive},
  {...note('Я провожу ладонью по натянутому холму. Он дёргается под пальцами, стонет сквозь зубы. Я сжимаю сильнее — чувствую жар, пульс, как яйца поджаты в белом хлопке.','I run my palm over the stretched bulge. It twitches under my fingers; he moans through his teeth. I squeeze harder — heat, pulse, his balls drawn tight in the white cotton.'),bg:SCENE.touch},
  me('На колени. Сними их зубами — нет, стой. Сначала джоки. Хочу тебя в белых джоках, когда буду входить.','On your knees. Take them off with your teeth — no, wait. Jockstrap first. I want you in a white jock when I push in.'),
  nik('Они в ящике… секунду.','They are in the drawer… one second.','flirty')
 ],'nikola_park_prep',{...place('КВАРТИРА НИКОЛЫ · КРОВАТЬ','NIKOLA’S FLAT · BED','21:25',SCENE.briefs),adult:true,skipTo:'nikola_park_morning'});

 // 5a. Prep — jock + fingers
 N.nikola_park_prep=scene([
  {...note('Он натягивает белые джоки Calvin Klein: узкий пояс, мешочек держит тяжёлые яйца и стоящий член, ягодицы полностью открыты — круглые, плотные, с лёгким загаром. Между щёк уже блестит, когда он встаёт на четвереньки на простыне.','He pulls on white Calvin Klein jockstraps: a narrow waistband, the pouch holding heavy balls and his hard cock, his ass fully bare — round, firm, lightly tanned. Between the cheeks it already gleams as he gets on all fours on the sheet.'),bg:SCENE.jock},
  nik('Пальцы сначала? У меня есть смазка. Не хочу, чтобы было больно — хочу, чтобы ты ебал глубоко.','Fingers first? I have lube. I do not want it to hurt — I want you to fuck me deep.','flirty'),
  note('Я обливаю пальцы, кружу по сжатому кольцу, вхожу одним — жарко, узко. Никола роняет голову в подушку, подаётся назад. Второй палец. Он матерится по-сербски и по-русски сразу: «Jebi… да, ещё».','I pour lube on my fingers, circle his tight ring, push one in — hot, narrow. Nikola drops his head into the pillow and pushes back. Second finger. He swears in Serbian and Russian at once: “Jebi… yes, more.”'),
  me('Сейчас войду. Скажи «да».','I am going in now. Say “yes”.'),
  nik('Да. Трахай меня. Хочу чувствовать твой член до упора.','Yes. Fuck me. I want to feel your cock all the way.','flirty')
 ],'nikola_park_sex',{...place('КВАРТИРА НИКОЛЫ · ПОДГОТОВКА','NIKOLA’S FLAT · PREP','21:40',SCENE.jock),adult:true,skipTo:'nikola_park_morning'});

 // 5b. Sex + climax choice
 N.nikola_park_sex=scene([
  {...note('Головка упирается, проходит — он орёт в подушку, потом рвано смеётся. Я держу его за бёдра и медленно вхожу целиком: джоки натянуты на яйцах, спина выгибается, мышцы на пояснице ходят. Когда я начинаю двигаться жёстче, мошонка шлёпает о его, смазка хлюпает, кровать стучит о стену.','The head presses, slips in — he cries into the pillow, then laughs roughly. I hold his hips and slowly bury myself to the hilt: the jockstrap tight on his balls, his back arching, the muscles along his spine working. When I start thrusting harder, my sack slaps his, lube squelches, the bed knocks the wall.'),bg:SCENE.moan},
  {...nik('Блядь… не останавливайся. Я весь твой. Можешь кончить куда хочешь — только предупреди.','Fuck… do not stop. I am all yours. You can cum wherever you want — just warn me.','flirty'),bg:SCENE.climax},
  note('Я ускоряюсь. Он подаётся навстречу каждому толчку, джоки мокрые спереди от его собственной смазки, голос срывается на стон.','I speed up. He meets every thrust, the jock wet in front from his own precum, his voice breaking into a moan.')
 ],null,{...place('КВАРТИРА НИКОЛЫ · НОЧЬ','NIKOLA’S FLAT · NIGHT','22:10',SCENE.fuck),adult:true,skipTo:'nikola_park_morning',choices:[
  {label:T('Кончить в него глубоко','Cum deep inside him'),tone:'romance',next:'nikola_park_cum_inside',effect:{nikolaFinish:'inside'}},
  {label:T('Вытащить и кончить на белые джоки','Pull out and cum on the white jock'),tone:'romance',next:'nikola_park_cum_jock',effect:{nikolaFinish:'jock'}},
  {label:T('Перевернуть и кончить ему на грудь','Flip him and cum on his chest'),tone:'romance',next:'nikola_park_cum_chest',effect:{nikolaFinish:'chest'}}
 ]});

 N.nikola_park_cum_inside=scene([
  note('Я вколачиваюсь до упора и кончаю в него — густыми толчками, удерживая бёдра. Никола сжимается вокруг члена так сильно, что я вижу звёзды; его собственный стояк дёргается в белом мешочке джоков, и он кончает следом, заливая ткань изнутри тёплым.','I slam in to the hilt and cum inside him — thick pulses, gripping his hips. Nikola clamps around my cock so hard I see stars; his own erection jerks in the white jock pouch and he cums right after, flooding the fabric from inside with heat.'),
  nik('Чувствую… бля, как ты наполняешь. Не выходи сразу.','I feel it… fuck, you filling me. Do not pull out yet.','shy'),
  note('Когда я медленно выхожу, сперма тянется нитью из его раскрытой дырки и капает на простыню между разведённых колен. Джоки мокрые спереди. Он дрожит и смеётся в голос.','When I slowly pull out, cum stretches in a string from his open hole and drips onto the sheet between his spread knees. The jock is soaked in front. He trembles and laughs out loud.')
 ],'nikola_park_afterglow',{...place('КВАРТИРА НИКОЛЫ · ФИНИШ','NIKOLA’S FLAT · FINISH','22:25',SCENE.cumInside),adult:true,skipTo:'nikola_park_morning',journal:['nikola_early_night']});

 N.nikola_park_cum_jock=scene([
  note('Я вытаскиваю мокрый член в последний момент и дрочу над ним. Никола на четвереньках подставляет зад и оглядывается — и я крою белые джоки густыми струями: на пояс, на натянутый мешочек, на голую поясницу, пока сперма не стекает по яйцам на простыню.','I pull my wet cock out at the last second and stroke over him. Nikola on all fours offers his ass and looks back — and I paint the white jock with thick ropes: on the waistband, on the stretched pouch, on his bare lower back, until cum runs down his balls onto the sheet.'),
  nik('Грязно… и пиздец как горячо. Оставь так. Хочу заснуть в этих джоках.','Filthy… and fucking hot. Leave it. I want to fall asleep in this jock.','laughing'),
  note('Он проводит пальцем по белой ткани, собирает каплю и облизывает, глядя на меня. Член у него всё ещё стоит, измазанный моим финишем.','He runs a finger over the white fabric, gathers a drop and licks it while looking at me. His cock is still hard, smeared with my finish.')
 ],'nikola_park_afterglow',{...place('КВАРТИРА НИКОЛЫ · ФИНИШ','NIKOLA’S FLAT · FINISH','22:25',SCENE.cumJock),adult:true,skipTo:'nikola_park_morning',journal:['nikola_early_night']});

 N.nikola_park_cum_chest=scene([
  note('Я вытаскиваю, переворачиваю его на спину. Джоки сбиты набок, член шлёпает о живот. Я сажусь ему на бёдра и кончаю на широкую грудь — белые полосы по загару, на соски, на шею, одна капля на нижнюю губу.','I pull out and flip him onto his back. The jock is shoved aside, his cock slaps his stomach. I straddle his thighs and cum on his broad chest — white stripes across the tan, on his nipples, on his throat, one drop on his lower lip.'),
  nik('Вкус как после смены — солёный. Иди сюда.','Tastes like after a shift — salty. Come here.','flirty'),
  note('Он тянет меня в поцелуй, размазывая сперму между нами. Под джоками его член всё ещё твёрдый; я сжимаю мешочек ладонью, и он кончает себе на живот, добавляя к моим следам.','He pulls me into a kiss, smearing cum between us. Under the jock his cock is still hard; I squeeze the pouch in my palm and he cums onto his own stomach, adding to my marks.')
 ],'nikola_park_afterglow',{...place('КВАРТИРА НИКОЛЫ · ФИНИШ','NIKOLA’S FLAT · FINISH','22:25',SCENE.cumChest),adult:true,skipTo:'nikola_park_morning',journal:['nikola_early_night']});

 N.nikola_park_afterglow=scene([
  note('Мы лежим под одним одеялом. Лампа всё ещё горит. Никола кладёт тяжёлую руку мне на грудь и тихонько смеётся в волосы.','We lie under one blanket. The lamp is still on. Nikola puts a heavy arm across my chest and laughs softly into my hair.'),
  nik('Если завтра утром будет неловко — скажи. А сейчас мне пиздец как хорошо.','If it feels awkward tomorrow morning — say so. Right now I feel fucking good.','friendly'),
  note('Я засыпаю под запах корицы, секса и его кожи.','I fall asleep under the smell of cinnamon, sex and his skin.')
 ],'nikola_park_morning',{...place('КВАРТИРА НИКОЛЫ · ПОСЛЕ','NIKOLA’S FLAT · AFTER','23:40',SCENE.afterglow),adult:true,skipTo:'nikola_park_morning'});

 // 6. Morning → back to chapter close
 N.nikola_park_morning=scene([
  note('Утром его уже нет в кровати — смена в пекарне. На столе кифла в бумаге и записка корявым почерком: «Горячее. Приходи, когда захочешь. — Н.»','In the morning he is already gone from the bed — bakery shift. On the table a kifla in paper and a note in uneven handwriting: “Something hot. Come whenever you like. — N.”'),
  note('Джоки сушатся на спинке стула. Я улыбаюсь и закрываю дверь его квартиры так же тихо, как мы вчера её открывали.','The jockstrap is drying on the chair back. I smile and close his flat door as quietly as we opened it yesterday.')
 ],'chapter_three_close',{...place('КВАРТИРА НИКОЛЫ · УТРО','NIKOLA’S FLAT · MORNING','07:40',HOME_BG),journal:['nikola_early_night']});
}
