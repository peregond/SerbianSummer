// Romance in three stages for everyone the player may grow close to, over three evenings each (days 22, 25 and 28):
// a date (holding hands), a first kiss and a night together. Every step is a choice with a friendly or quiet alternative,
// asks for consent aloud, and can be refused without any penalty. The night is only a short, non-explicit passage and can be
// switched off in the settings (adult scenes): then the story simply moves on to the morning. Several people can be romanced;
// with at least two who have reached the kiss the player may bring them together for one evening, again only by shared consent.
// Nothing here changes the application, the bank account or the lease.
import {T} from './days.js?v=0.15.0';
const SLOT_IDENTITIES={airport:['nikola','milica'],asya:['asya'],luka:['luka'],owner:['dragan','jelena'],bank:['lazar','teodora'],mup:['ivana','strahinya'],milos:['milos']};
const SLOT_BG={airport:'riverside-evening',asya:'courtyard-after-film',luka:'belgrade-morning-cafe',owner:'dorcol-apartment',bank:'belgrade-morning-cafe',mup:'belgrade-morning-cafe',milos:'riverside-evening'};
// For each person: d = date, k = kiss, n = night. [Russian, English]; x1 is the narration, x2 what the person says.
const DETAILS={
 nikola:{
  d1:['Мы встречаемся у реки после смены Николы: от него пахнет тёплым хлебом, а в руках бумажный пакет с кифлами.','We meet by the river after Nikola’s shift: he smells of warm bread and carries a paper bag of kiflas.'],
  d2:['Первую кифлу я всегда отдаю тому, с кем хочу посидеть подольше. Сегодня это ты.','I always give the first kifla to the person I want to sit with longest. Today that is you.'],
  k1:['Мы идём вдоль воды, и когда ветер срывает с меня шарф, Никола ловит его раньше, чем я успеваю заметить.','We walk along the water, and when the wind pulls my scarf away Nikola catches it before I notice.'],
  k2:['Я бы хотел тебя поцеловать, но только если тебе этого действительно хочется. Скажи «нет», и мы просто пойдём дальше.','I would like to kiss you, but only if you truly want it too. Say “no” and we will simply walk on.'],
  n1:['У Николы дома тихо: на подоконнике остывает тесто, в комнате пахнет мукой и корицей.','It is quiet at Nikola’s place: dough cools on the windowsill and the room smells of flour and cinnamon.'],
  n2:['Ты можешь остаться, а можешь пойти домой, и между нами ничего не изменится. Скажи только, чего хочешь ты.','You can stay or you can go home, and nothing between us will change. Only tell me what you want.']},
 milica:{
  d1:['Милица ждёт меня на набережной с блокнотом и двумя стаканами чая. На странице набросок: мы вдвоём на этой скамейке.','Milica waits for me on the embankment with a notebook and two cups of tea. On the page is a sketch of the two of us on this very bench.'],
  d2:['Я нарисовала нас раньше, чем мы встретились, и теперь мне неловко. Но рисунок хороший, правда?','I drew us before we had met, and now I feel awkward. But the drawing is good, isn’t it?'],
  k1:['Мы стоим под навесом, пока дождь стучит по жести. Милица прячет блокнот и смотрит прямо.','We stand under an awning while rain taps on the tin. Milica puts her notebook away and looks straight at me.'],
  k2:['Мне хочется тебя поцеловать. Если тебе тоже, просто не отстраняйся. А если нет, я улыбнусь и нарисую что-нибудь другое.','I want to kiss you. If you do too, just do not pull away. And if not, I will smile and draw something else.'],
  n1:['В комнате Милицы пахнет акварелью и мокрым зонтом. На стене сушатся рисунки, и все они о городе, в котором я теперь живу.','Milica’s room smells of watercolour and a wet umbrella. Drawings dry on the wall, all of them about the city where I now live.'],
  n2:['Можно остаться. Можно уйти. Я не обижусь, а утром всё равно буду рисовать тебя по памяти.','You can stay. You can go. I will not be hurt, and in the morning I will draw you from memory anyway.']},
 asya:{
  d1:['Ася зовёт меня на крышу двора, где хранит гирлянды: оттуда видно полгорода и ни одной очереди.','Asya takes me up to the courtyard roof where she keeps the garlands: half the city is visible from there and not a single queue.'],
  d2:['Я не из тех, кто говорит красиво. Но когда ты рядом, я перестаю шутить, а это уже признание.','I am not someone who speaks beautifully. But when you are near, I stop joking, and that is already a confession.'],
  k1:['Внизу гаснут окна, а мы всё сидим на крыше. Ася замолкает и смотрит так, будто ей нужно что-то решить.','Windows go dark below while we keep sitting on the roof. Asya falls silent and looks as if she has something to decide.'],
  k2:['Я хочу тебя поцеловать. Давай договоримся: если станет слишком быстро, ты говоришь «стоп», и я не обижаюсь.','I want to kiss you. Let us agree: if it gets too fast, you say “stop”, and I will not be hurt.'],
  n1:['У Аси в квартире тесно от книг и проводов, а на кухне мигает забытая гирлянда.','Asya’s flat is crowded with books and cables, and a forgotten garland blinks in the kitchen.'],
  n2:['Останься, если хочешь. Мне важно, чтобы ты хотел{a} этого сам{a}. Утром я не буду спрашивать, что это значит, пока ты не скажешь.','Stay if you want to. It matters to me that you want it yourself. In the morning I will not ask what it means until you say.']},
 luka:{
  d1:['Лука заранее забронировал столик и принёс распечатанное меню с двумя пометками: «острое» и «не острое». Это почти флирт.','Luka booked a table in advance and brought a printed menu with two marks: “spicy” and “not spicy”. It is almost flirting.'],
  d2:['Я посчитал, что вечер с тобой — лучший проект этого месяца. Без таблицы, но с запасом на всякий случай.','I worked out that an evening with you is the best project of this month. Without a spreadsheet, but with a margin just in case.'],
  k1:['Мы идём пешком: Лука заметил, что мне не хочется в такси. Он идёт чуть медленнее, чем обычно.','We walk: Luka noticed I did not want a taxi. He walks a little slower than usual.'],
  k2:['Я бы хотел тебя поцеловать. Я не умею угадывать, поэтому спрашиваю прямо: можно?','I would like to kiss you. I am no good at guessing, so I ask directly: may I?'],
  n1:['Лука открывает дверь квартиры, где идеальный порядок, кроме одной кружки на столе. Он краснеет: «Это для тебя, я приготовил».','Luka opens the door of a flat in perfect order apart from one mug on the table. He blushes: “That is for you, I prepared it.”'],
  n2:['Если хочешь остаться, я буду рад. Если нет, провожу до двери и не стану считать это провалом.','If you want to stay, I will be glad. If not, I will walk you to the door and will not count it as a failure.']},
 dragan:{
  d1:['Драган зовёт меня на кухню, где вместо документов на столе вино, сыр и две рюмки. Он смущается: «Не по правилам, но по-соседски».','Dragan invites me to the kitchen where there are no documents on the table but wine, cheese and two glasses. He is embarrassed: “Not by the rules, but neighbourly.”'],
  d2:['Я всю неделю думаю, как сказать, что ты мне нравишься, не звуча как хозяин, который пользуется положением. Поэтому прямо: если неудобно, мы просто ужинаем.','All week I have been thinking how to say that I like you without sounding like a landlord who uses his position. So, plainly: if it is awkward, we simply have supper.'],
  k1:['На кухне тихо. Драган задерживает руку на спинке моего стула и сразу убирает её, будто спрашивая разрешения.','The kitchen is quiet. Dragan rests a hand on the back of my chair and at once takes it away, as if asking permission.'],
  k2:['Можно я тебя поцелую? Договор и квартира остаются отдельно: ты вправе сказать «нет» и ничего не потерять.','May I kiss you? The lease and the flat stay separate: you may say “no” and lose nothing.'],
  n1:['Свет на кухне гаснет, в коридоре тихо. Драган кивает в сторону моей комнаты, но не заходит.','The kitchen light goes out and the corridor is quiet. Dragan nods towards my room but does not come in.'],
  n2:['Я могу подняться к тебе, а могу остаться внизу. Решай ты. На договор это не влияет, и я это подтвержу, если нужно.','I can come up to you, or I can stay downstairs. You decide. It does not affect the lease, and I will confirm that if needed.']},
 jelena:{
  d1:['Йелена накрывает стол во дворе, ставит свечи в банках и две тарелки: «Не по правилам, но по-соседски».','Jelena lays a table in the courtyard, with candles in jars and two plates: “Not by the rules, but neighbourly.”'],
  d2:['Я долго думала, как сказать, что ты мне нравишься, и не стать хозяйкой, которая пользуется положением. Поэтому прямо: если неудобно, мы просто ужинаем.','I thought for a long time how to say that I like you without becoming a landlady who uses her position. So, plainly: if it is awkward, we simply have supper.'],
  k1:['Во дворе пахнет липой. Йелена убирает прядь за ухо и смотрит так, будто спрашивает разрешения.','The courtyard smells of linden. Jelena tucks a strand behind her ear and looks as if asking permission.'],
  k2:['Можно я тебя поцелую? Договор и квартира остаются отдельно: ты вправе сказать «нет» и ничего не потерять.','May I kiss you? The lease and the flat stay separate: you may say “no” and lose nothing.'],
  n1:['Свечи догорают, в доме тихо. Йелена кивает в сторону моей комнаты, но остаётся на пороге.','The candles burn low and the house is quiet. Jelena nods towards my room but stays on the threshold.'],
  n2:['Я могу подняться к тебе, а могу уйти к себе. Решай ты. На договор это не влияет, и я это подтвержу, если нужно.','I can come up to you, or I can go to my own room. You decide. It does not affect the lease, and I will confirm that if needed.']},
 lazar:{
  d1:['Лазар ждёт меня у кафе в обычной рубашке, без бейджа. Без стойки между нами он кажется выше и добрее.','Lazar waits for me outside a café in an ordinary shirt, with no badge. With no counter between us he seems taller and kinder.'],
  d2:['Я нервничаю сильнее, чем перед проверкой. В банке я умею говорить о процентах, а здесь не знаю, о чём.','I am more nervous than before an inspection. At the bank I know how to talk about interest, but here I do not know what to talk about.'],
  k1:['После кофе мы идём к мосту. Лазар рассказывает о своём городе, а я ловлю себя на том, что слушаю голос, а не слова.','After the coffee we walk to the bridge. Lazar tells me about his city, and I catch myself listening to the voice, not the words.'],
  k2:['Я хочу тебя поцеловать. Скажи прямо, если нет: я привык, что на любой вопрос можно ответить «нет», и переживу.','I want to kiss you. Say so plainly if not: I am used to the fact that any question can be answered “no”, and I will cope.'],
  n1:['В квартире Лазара на полках книги по истории и ни одной по финансам. «Работа остаётся на работе», — говорит он.','On the shelves of Lazar’s flat are history books and not one on finance. “Work stays at work,” he says.'],
  n2:['Если останешься, я буду рад. Если уйдёшь, тоже: мне важнее, чтобы тебе было спокойно.','If you stay, I will be glad. If you go, too: it matters more to me that you feel at ease.']},
 teodora:{
  d1:['Теодора ждёт меня у кафе в светлом платье, без бейджа и без папки. Без стола между нами она кажется мягче.','Teodora waits for me outside a café in a light dress, with no badge and no folder. With no desk between us she seems softer.'],
  d2:['Я нервничаю, а это не про меня: на работе я говорю уверенно. Здесь у меня нет скрипта.','I am nervous, which is not like me: at work I speak with confidence. Here I have no script.'],
  k1:['Мы идём к мосту. Теодора рассказывает про первые годы в банке, а я смотрю, как у неё меняется лицо, когда она смеётся.','We walk to the bridge. Teodora tells me about her first years at the bank, and I watch her face change when she laughs.'],
  k2:['Я хочу тебя поцеловать. Если нет, скажи просто «нет», я не обижусь.','I want to kiss you. If not, just say “no”; I will not be offended.'],
  n1:['У Теодоры светло и пахнет кофе. На стене фотографии гор: «Это моё запасное расписание», — улыбается она.','Teodora’s place is bright and smells of coffee. On the wall are photographs of mountains: “That is my backup timetable,” she smiles.'],
  n2:['Если останешься, я буду рада. Если уйдёшь, тоже: мне важнее, чтобы тебе было спокойно.','If you stay, I will be glad. If you go, too: it matters more to me that you feel at ease.']},
 ivana:{
  d1:['Ивана приходит без формы, в вязаном свитере. Без нагрудной таблички она кажется другой: проще, моложе, с веснушками на носу.','Ivana comes without her uniform, in a knitted jumper. Without the name plate she seems different: simpler, younger, with freckles on her nose.'],
  d2:['На работе я говорю по инструкции. Здесь у меня её нет, и мне немного страшно. Но приятно.','At work I speak by the instructions. Here I have none, and I am a little afraid. But it is pleasant.'],
  k1:['Мы стоим у светофора, и Ивана вдруг говорит: «Три коротких, пауза, один». Это она про стук карандаша: смеётся и краснеет.','We stand at a traffic light, and Ivana suddenly says: “Three short, a pause, one.” She means the tapping of her pencil: she laughs and blushes.'],
  k2:['Мне нравится быть рядом с тобой. Можно я тебя поцелую? Решения по делу от этого не изменятся, а с тобой я хочу быть честной.','I like being near you. May I kiss you? The decisions on the case will not change because of it, and with you I want to be honest.'],
  n1:['У Иваны на столе карандаши во всех стаканах, а на диване плед в клетку. Мы пьём чай, и она впервые не смотрит на часы.','On Ivana’s table are pencils in every glass, and on the sofa a checked blanket. We drink tea, and for the first time she does not look at the clock.'],
  n2:['Если хочешь остаться, оставайся. Если нет, мы допьём чай, и я провожу тебя до трамвая.','If you want to stay, stay. If not, we will finish the tea and I will walk you to the tram.']},
 strahinya:{
  d1:['Страхиня приходит без формы, в тёмной рубашке с закатанными рукавами. Без таблички он выглядит спокойнее и немного смелее.','Strahinja comes without his uniform, in a dark shirt with rolled-up sleeves. Without the name plate he looks calmer and a little bolder.'],
  d2:['На работе я говорю по инструкции. Здесь у меня её нет, и мне немного страшно. Но приятно.','At work I speak by the instructions. Here I have none, and I am a little afraid. But it is pleasant.'],
  k1:['Мы стоим у светофора, и Страхиня стучит пальцем по перилам: три коротких, пауза, один. Поймав мой взгляд, он смущённо останавливается.','We stand at a traffic light, and Strahinja taps a finger on the railing: three short, a pause, one. Catching my eye, he stops, embarrassed.'],
  k2:['Мне нравится быть рядом с тобой. Можно я тебя поцелую? Решения по делу от этого не изменятся, а с тобой я хочу быть честным.','I like being near you. May I kiss you? The decisions on the case will not change because of it, and with you I want to be honest.'],
  n1:['У Страхини на столе карандаши во всех стаканах, а на диване плед в клетку. Мы пьём чай, и он впервые не смотрит на часы.','On Strahinja’s table are pencils in every glass, and on the sofa a checked blanket. We drink tea, and for the first time he does not look at the clock.'],
  n2:['Если хочешь остаться, оставайся. Если нет, мы допьём чай, и я провожу тебя до трамвая.','If you want to stay, stay. If not, we will finish the tea and I will walk you to the tram.']},
 milos:{
  d1:['Милош приходит без формы, но с кардамоном в кармане. Без балаклавы его лицо кажется ещё более открытым.','Miloš comes without his uniform but with cardamom in his pocket. Without the balaclava his face seems even more open.'],
  d2:['Мне нравится, что ты разгадал{a} меня не по лицу, а по мелочам. Это, наверное, главное.','I like that you worked me out not by my face but by the small things. That is probably what matters most.'],
  k1:['Мы идём по набережной, и Милош напевает четыре ноты, а потом спохватывается и смеётся: «Привычка».','We walk along the embankment, and Miloš hums four notes, then catches himself and laughs: “A habit.”'],
  k2:['Я бы поцеловал тебя. Если тебе хочется, просто остановись и посмотри на меня. Если нет, я буду просто идти рядом.','I would kiss you. If you want that, just stop and look at me. If not, I will simply walk beside you.'],
  n1:['Милош заваривает кофе с кардамоном на крошечной кухне. Форма висит на стуле, и в комнате странно спокойно.','Miloš makes cardamom coffee in a tiny kitchen. The uniform hangs on a chair, and the room is strangely calm.'],
  n2:['Если остаёшься, я рад. Если нет, я тоже рад: утром всё равно будет кофе, и ты сможешь прийти.','If you stay, I am glad. If not, I am glad too: there will be coffee in the morning anyway, and you can come.']}
};
export function extendRomance({NODES:N,JOURNAL:J,n,scene}){
 const out=label=>({kind:'tap',label,object:label});
 const note=(ru,en)=>n(T(ru,en));
 const choice=(label,tone,next,effect={},when)=>({label:T(...label),tone,next,effect,...(when?{when}:{})});
 const place=(ru,en,time,bg)=>({bg,location:T(ru,en),time,exitAction:out('Продолжить')});
 // One line of a person: its wording depends on who the slot resolves to (Nikola or Milica, Dragan or Jelena, ...).
 const detail=(slot,key,speaker)=>{
  const ids=SLOT_IDENTITIES[slot],text=Object.fromEntries(ids.map(id=>[id,T(...DETAILS[id][key])]));
  return {speaker,...(speaker==='lovePartner'?{cameo:true,emotion:'friendly'}:{}),text:text[ids[0]],...(ids.length>1?{byPartner:{...text,default:text[ids[0]]}}:{})};
 };
 Object.assign(J,{
  love_date:{title:T('Вечер вдвоём','An evening for two'),tag:T('ОТНОШЕНИЯ · СВИДАНИЕ','RELATIONSHIPS · A DATE'),text:T('Мы взялись за руки, потому что оба так решили. Это не обещание, а выбор, который можно сделать заново или не делать.','We held hands because we both decided to. It is not a promise but a choice that can be made again or not at all.')},
  love_kiss:{title:T('Первый поцелуй','A first kiss'),tag:T('ОТНОШЕНИЯ · ПОЦЕЛУЙ','RELATIONSHIPS · A KISS'),text:T('Мы спросили друг друга вслух, и ответ был «да». Если бы он был «нет», вечер остался бы таким же хорошим.','We asked each other aloud, and the answer was “yes”. Had it been “no”, the evening would have been just as good.')},
  love_night:{title:T('Ночь по согласию','A night by consent'),tag:T('ОТНОШЕНИЯ · БЛИЗОСТЬ','RELATIONSHIPS · INTIMACY'),text:T('Мы оба сказали «да» и могли сказать «нет» в любую минуту. Остальное остаётся между нами.','We both said “yes” and could have said “no” at any moment. The rest stays between us.')},
  love_group:{title:T('Больше, чем двое','More than two'),tag:T('ОТНОШЕНИЯ · ОТКРЫТОСТЬ','RELATIONSHIPS · OPENNESS'),text:T('Я сказал{a} вслух, что дорожу несколькими людьми, и каждый мог ответить «нет». Мы договорились говорить честно, не прятаться и не обещать лишнего.','I said aloud that I care for several people, and each could have answered “no”. We agreed to speak honestly, not to hide and not to promise too much.')}
 });
 const stages=[
  {no:1,required:null,end:'d22_end',turn:'d22_turn',time:'19:30',bg:null,where:['ВЕЧЕР · СВИДАНИЕ','EVENING · A DATE'],hub:[['В ближайшие вечера у меня есть время. С кем мне хочется побыть наедине?','In the coming evenings I have some time. Whom do I want to be alone with?'],['У меня остаётся ещё один свободный вечер. Кого позвать?','I have one more free evening. Whom shall I ask?'],['Последний свободный вечер на этой неделе. Кого мне хочется увидеть?','The last free evening this week. Whom do I want to see?']],label:['Позвать {who.%s.acc} на свидание','Ask {who.%s} on a date'],key:['d1','d2'],step:'date'},
  {no:2,required:'date',end:'d25_end',turn:'d25_turn',time:'21:30',bg:'belgrade-night-walk',where:['ВЕЧЕР · ПРОГУЛКА','EVENING · A WALK'],hub:[['Я вспоминаю, с кем мне было хорошо за руку. Кого позвать погулять допоздна?','I remember who felt good to hold hands with. Whom shall I ask for a late walk?'],['Есть ещё один тёплый вечер. Кому написать?','There is one more warm evening. Whom shall I write to?'],['Последний тихий вечер перед тем, как начнутся решающие дни. Кого мне хочется видеть рядом?','The last quiet evening before the deciding days. Whom do I want beside me?']],label:['Погулять допоздна с {who.%s.ins}','Take a late walk with {who.%s}'],key:['k1','k2'],step:'kiss'},
  {no:3,required:'kiss',end:'d28_end',turn:'d28_turn',time:'22:30',bg:'room-window',where:['НОЧЬ · ДВОЕ','NIGHT · TOGETHER'],hub:[['Вечер почти закончился. Мне хочется не прощаться, но только если все согласны. Кого позвать?','The evening is nearly over. I would rather not say goodbye, but only if everyone agrees. Whom shall I ask?'],['Ещё одна ночь, и никто не обязан ничего решать. Кого позвать?','Another night, and nobody is obliged to decide anything. Whom shall I ask?'],['Последняя ночь перед решающими днями. С кем мне хочется её провести?','The last night before the deciding days. With whom do I want to spend it?']],label:['Позвать {who.%s.acc} к себе','Ask {who.%s} to come home with me'],key:['n1','n2'],step:'lover'}
 ];
 const slots=Object.keys(SLOT_IDENTITIES);
 for(const stage of stages){
  const id=(k,part)=>`love${stage.no}_${k}_${part}`,after=k=>k<3?id(k+1,'hub'):stage.end;
  N[stage.turn].next=id(1,'hub');
  for(let k=1;k<=3;k++){
   const bgOf=slot=>stage.bg??SLOT_BG[slot];
   const options=slots.map(slot=>choice([stage.label[0].replaceAll('%s',slot),stage.label[1].replaceAll('%s',slot)],'romance',id(k,slot),{lastPartner:slot},{partner:slot,stage:stage.required}));
   if(stage.no===3)options.push(choice(['Собрать всех, кто мне близок, на один вечер','Bring together everyone who is close to me for one evening'],'romance','love3_group',{},{minPartners:{stage:'kiss',count:2}}));
   options.push(choice(['Пока ни с кем','With no one for now'],'personal',stage.end,{}));
   N[id(k,'hub')]=scene([note(...stage.hub[k-1])],null,{...place(...stage.where,stage.time,'room-window'),choices:options});
   // Generic outcomes shared by every partner of this evening.
   const yes=stage.no===3?id(k,'fade'):id(k,'yes'),keep=id(k,'no');
   for(const slot of slots){
    const [first,second]=stage.key;
    N[id(k,slot)]=scene([
     detail(slot,first,'narrator'),
     detail(slot,second,'lovePartner'),
     note(...(stage.no===1?['Мы стоим близко. Я спрашиваю: «Можно взять тебя за руку?» {partner} улыбается: «Да. А если станет слишком, скажи, и мы замедлимся».','We stand close. I ask: “May I hold your hand?” {partner} smiles: “Yes. And if it gets to be too much, say so and we will slow down.”']:stage.no===2?['{partner} ждёт ответа и не торопит. Я знаю, что могу сказать «да», «пока нет» или просто улыбнуться и пойти дальше: любой ответ здесь будет принят.','{partner} waits for an answer and does not hurry me. I know I can say “yes”, “not yet” or simply smile and walk on: any answer will be accepted here.']:['Я понимаю, чего хочу, и говорю это вслух. Мы оба знаем: можно передумать в любую секунду, даже у самой двери.','I know what I want, and I say it aloud. We both know that one can change one’s mind at any second, even at the very door.']))
    ],null,{...place(...stage.where,stage.time,bgOf(slot)),choices:stage.no===1?[
     choice(['Взять за руку и остаться ближе','Take their hand and stay closer'],'romance',yes,{loveStep:'date'}),
     choice(['Остаться как друзья','Stay friends'],'friendship',keep)]:stage.no===2?[
     choice(['Поцеловать','Kiss'],'romance',yes,{loveStep:'kiss'}),
     choice(['Пока подождать','Wait for now'],'personal',keep)]:[
     choice(['Остаться на ночь','Stay the night'],'romance',yes,{makeLover:true}),
     choice(['Поблагодарить и проститься на этот вечер','Thank them and say goodnight for this evening'],'personal',keep)]});
   }
   if(stage.no===1){
    N[id(k,'yes')]=scene([note('{partner} сжимает мою ладонь, и мы идём так, пока не заканчивается набережная. Никто никуда не торопится.','{partner} squeezes my hand, and we walk like that until the embankment ends. Nobody is in a hurry.'),note('Это не обещание, а выбор, который можно сделать заново завтра или не делать.','It is not a promise but a choice that can be made again tomorrow, or not at all.')],after(k),{...place(...stage.where,stage.time,'belgrade-night-walk'),journal:['love_date']});
    N[keep]=scene([note('{partner} кивает: «Хорошо. Мне тоже нравится быть рядом просто так».','{partner} nods: “All right. I like being near you just like this too.”'),note('Вечер остаётся тёплым и лёгким, и никому не неловко.','The evening stays warm and light, and nobody feels awkward.')],after(k),{...place(...stage.where,stage.time,'belgrade-night-walk')});
   } else if(stage.no===2){
    N[id(k,'yes')]=scene([note('Поцелуй получается неловким и настоящим. Мы оба смеёмся, и от этого он становится лучше.','The kiss comes out awkward and real. We both laugh, and that makes it better.'),note('{partner} отстраняется, смотрит на меня и спрашивает: «Всё хорошо?» Я киваю. Мы идём дальше, держась за руки.','{partner} pulls back, looks at me and asks: “Is it all right?” I nod. We walk on, holding hands.')],after(k),{...place(...stage.where,stage.time,'belgrade-night-walk'),journal:['love_kiss']});
    N[keep]=scene([note('{partner} кивает без тени обиды: «Спасибо, что сказал{a} вслух. Мы никуда не спешим».','{partner} nods without a shade of hurt: “Thank you for saying it aloud. We are in no hurry.”'),note('Мы идём дальше, и вечер остаётся таким же хорошим.','We walk on, and the evening stays just as good.')],after(k),{...place(...stage.where,stage.time,'belgrade-night-walk')});
   } else {
    N[id(k,'fade')]=scene([note('Дверь закрывается тихо. Мы идём медленно, спрашивая и слушая: можно? хорошо? ещё?','The door closes softly. We go slowly, asking and listening: may I? is that good? more?'),note('Остальное остаётся между нами: нежность, смех в темноте и ясное «да», которое можно сказать ещё раз или взять назад.','The rest stays between us: tenderness, laughter in the dark and a clear “yes” that can be said again or taken back.')],id(k,'morning'),{...place('НОЧЬ · ДВОЕ','NIGHT · TOGETHER','23:30','room-window'),adult:true,skipTo:id(k,'morning'),journal:['love_night']});
    N[id(k,'morning')]=scene([note('Утром пахнет кофе, и {partner} улыбается так, как улыбаются люди, которым хорошо без слов.','In the morning there is the smell of coffee, and {partner} smiles the way people smile when they feel well without words.'),note('Мы не называем это никак. Просто завтракаем и договариваемся о следующей встрече, если захотим оба.','We do not give it a name. We simply have breakfast and agree on the next meeting, if we both want it.')],after(k),{...place('УТРО · ПОСЛЕ','MORNING · AFTER','08:30','room-window'),journal:stage.no===3?['love_night']:[]});
    N[keep]=scene([note('{partner} кивает: «Спасибо, что сказал{a} прямо. Это тоже хороший вечер».','{partner} nods: “Thank you for saying it straight. This is a good evening too.”'),note('Мы прощаемся тепло, без обид и без неловкости. Дверь ещё долго остаётся приоткрытой.','We say goodbye warmly, without hurt or awkwardness. The door stays ajar for a long time.')],after(k),{...place(...stage.where,stage.time,'room-window')});
   }
  }
 }
 // Day 28 only: an evening for everyone who is close, by shared consent. Anyone may say no; then it is simply tea.
 N.love3_group=scene([
  note('Сегодня у меня в гостях {loveList}. Мы сидим за одним столом, и я впервые говорю вслух то, что давно чувствую: мне дорог каждый из вас.','Tonight {loveList} are my guests. We sit at one table, and for the first time I say aloud what I have long felt: each of you is dear to me.'),
  note('Никто не отшатывается. Кто-то улыбается, кто-то молчит, кто-то спрашивает: «Ты уверен{a}?» Это справедливый вопрос.','Nobody recoils. Someone smiles, someone is silent, someone asks: “Are you sure?” It is a fair question.'),
  note('Мы говорим по очереди: что нравится, чего хочется, чего нет. Я прошу об одном: если кому-то неловко, скажите сейчас, и мы просто выпьем чаю. «Нет» здесь всегда хороший ответ.','We speak in turn: what we like, what we want, what we do not. I ask for one thing: if anyone feels uncomfortable, say so now and we will simply drink tea. “No” is always a good answer here.')
 ],null,{...place('ВЕЧЕР · ВСЕ ВМЕСТЕ','EVENING · ALL TOGETHER','22:00','room-window'),journal:['love_group'],choices:[
  choice(['Остаться вместе, раз все согласны','Stay together, since everyone agrees'],'romance','love3_group_fade',{groupBond:true}),
  choice(['Выпить чаю и просто поговорить','Drink tea and simply talk'],'friendship','love3_group_tea')]});
 N.love3_group_fade=scene([
  note('Мы смеёмся над тем, как неловко рассаживаемся. Потом смех стихает, и каждый ещё раз спрашивает глазами: можно?','We laugh at how awkwardly we find places. Then the laughter fades, and each asks again with their eyes: may I?'),
  note('Остальное остаётся между нами всеми: нежность, осторожность, тихое «да» и «не сейчас», сказанные вслух. Никто никого не торопит.','The rest stays between all of us: tenderness, care, a quiet “yes” and “not now”, said aloud. Nobody hurries anybody.')
 ],'love3_group_morning',{...place('НОЧЬ · ВСЕ ВМЕСТЕ','NIGHT · ALL TOGETHER','23:30','room-window'),adult:true,skipTo:'love3_group_morning',journal:['love_group']});
 N.love3_group_morning=scene([
  note('Утром на кухне шумно: все пытаются поместиться, спорят, кто варит кофе, и никто не уходит.','In the morning the kitchen is noisy: everyone tries to fit in, argues about who makes the coffee, and nobody leaves.'),
  note('Мы не придумываем новых слов. Мы договариваемся: говорить честно, не прятаться и не обещать лишнего.','We invent no new words. We agree: to speak honestly, not to hide and not to promise too much.')
 ],'d28_end',{...place('УТРО · ВСЕ ВМЕСТЕ','MORNING · ALL TOGETHER','08:30','room-window'),journal:['love_group']});
 N.love3_group_tea=scene([
  note('Мы пьём чай и говорим не о ночи, а о том, как мне быть с каждым честно. Это тоже близость.','We drink tea and talk not about the night but about how to be honest with each of you. That is closeness too.'),
  note('Кто-то признаётся, что ревнует, и это нормально. Мы договариваемся, что о таком можно говорить вслух.','Someone admits to jealousy, and that is fine. We agree that such things can be said aloud.')
 ],'d28_end',{...place('ВЕЧЕР · ЧАЙ','EVENING · TEA','22:00','room-window'),journal:['love_group']});

 // Consequences: the days of decision and the three endings depend on who is close.
 const byCount=(stay,one,two,many)=>{
  const text={default:T(...stay),'1':T(...one),'2':T(...two)};
  for(const count of ['3','4','5','6','7'])text[count]=T(...many);
  return {speaker:'narrator',byFlag:{flag:'loverCount',text},text:text.default};
 };
 for(const id of ['decision_weigh_work','decision_weigh_people','decision_weigh_home'])N[id].pages.push(byCount(
  ['Я думаю о тех, кто рядом: о друзьях и случайных встречах. Любое решение должно быть моим.','I think of those who are near: friends and chance meetings. Any decision has to be mine.'],
  ['Рядом {loveList}. Близость с этим человеком стала частью моего ответа, но не его причиной.','{loveList} is beside me. Closeness with this person has become part of my answer but not its cause.'],
  ['Рядом {loveList}. Близость с двумя людьми оказалась и труднее, и честнее, чем я ожидал{a}.','{loveList} are beside me. Closeness with two people has turned out both harder and more honest than I expected.'],
  ['Рядом {loveList}. Нас много, и я учусь говорить с каждым честно.','{loveList} are beside me. There are many of us, and I am learning to speak honestly with each.']));
 const ending=(from,id,next,variants)=>{N[id]=scene([byCount(...variants)],next,{bg:N[from].bg,location:N[from].location,time:'10:00',exitAction:out('Продолжить'),lighting:N[from].lighting});N[from].next=id;};
 ending('stay_two','stay_lovers','epilogue_stay',[
  ['Моё решение остаться не зависит ни от кого из людей рядом. Оно моё, и я рад{a}, что оно именно такое.','My decision to stay depends on none of the people near me. It is mine, and I am glad it is exactly that.'],
  ['Рядом остаётся {loveList}. Мы не торопимся давать этому имя: просто завтракаем, спорим о кофе и миримся.','{loveList} stays near me. We are in no hurry to give it a name: we simply have breakfast, argue about coffee and make up.'],
  ['Рядом остаются {loveList}. Они знают друг о друге и обо мне, и мы договорились говорить прямо, не прятаться и не обещать лишнего. Это не всегда просто, но честно.','{loveList} stay near me. They know about one another and about me, and we agreed to speak plainly, not to hide and not to promise too much. It is not always easy, but it is honest.'],
  ['Рядом остаются {loveList}. Нас много, и мы учимся этому вместе: расписанию, ревности, шуткам о ней и тихим вечерам вдвоём.','{loveList} stay near me. There are many of us, and we are learning this together: schedules, jealousy, jokes about it and quiet evenings for two.']]);
 ending('leave_two','leave_lovers','epilogue_leave',[
  ['Я уезжаю, и это тоже мой выбор. Мне никто не должен ни слова, и я никому.','I am leaving, and that is my choice too. Nobody owes me a word, and I owe nobody.'],
  ['{loveList} провожает меня. Мы не даём обещаний: говорим только то, что правда. Если захотим, будем писать.','{loveList} sees me off. We make no promises: we say only what is true. If we want, we will write.'],
  ['{loveList} провожают меня. Мы не называем это концом: просто признаём, что близость не обязана помещаться в один город.','{loveList} see me off. We do not call it an ending: we simply admit that closeness does not have to fit into one city.'],
  ['Меня провожает {loveList}. Прощание получается шумным, неловким и тёплым, и на перроне много смеха.','{loveList} see me off. The goodbye is noisy, awkward and warm, and there is a lot of laughter on the platform.']]);
 ending('return_two','return_lovers','epilogue_return',[
  ['Возвращаться по плану — значит возвращаться ради себя. Люди рядом будут радостью, но не причиной.','To return by a plan means returning for myself. The people near me will be a joy, but not the reason.'],
  ['{loveList} ждёт меня осенью. Никто не требует клятв: мы договариваемся о письмах и о дате звонка.','{loveList} waits for me in autumn. Nobody demands vows: we agree on letters and a date for a call.'],
  ['{loveList} ждут меня осенью. Мы честно договариваемся, что мы друг для друга, пока я далеко, и кому что нужно.','{loveList} wait for me in autumn. We agree honestly what we are to one another while I am away, and who needs what.'],
  ['{loveList} ждут меня осенью. Мы заводим общий чат, в котором больше мемов, чем обещаний.','{loveList} wait for me in autumn. We start a group chat with more memes than promises.']]);
}
