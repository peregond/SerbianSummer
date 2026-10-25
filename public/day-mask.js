// A secret thread: a patrol officer in uniform and a balaclava who turns up four times (days 18, 22, 25, 27) and shows who
// they are on day 28. Under the mask is the officer from the document window (Ivana or Strahinja, whoever the player met,
// Ivana if nobody). The mask is part of the uniform, nothing about the person is threatening, and the player can notice the clues,
// guess aloud or leave the mystery alone. The officer never touches the case or the player's life beyond a friendly word.
import {T} from './days.js?v=0.15.0';
export function extendMaskedPatrol({NODES:N,JOURNAL:J,n,scene}){
 const out=label=>({kind:'tap',label,object:label});
 const note=(ru,en)=>n(T(ru,en));
 const masked=T('Человек в балаклаве','The masked officer');
 const say=(ru,en)=>({speaker:masked,text:T(ru,en),emotion:'friendly'});
 const by=(speaker,flag,variants)=>{
  const text=Object.fromEntries(Object.entries(variants).map(([key,[ru,en]])=>[key,T(ru,en)]));
  return {speaker,byFlag:{flag,text},text:text.default};
 };
 const choice=(label,tone,next,effect)=>({label:T(...label),tone,next,effect});
 const place=(ru,en,time,bg)=>({bg,location:T(ru,en),time,exitAction:out('Продолжить')});
 const add=(startId,option)=>N[startId].choices.push(option);
 J.masked_patrol={title:T('Человек в балаклаве','The masked officer'),tag:T('ЗАГАДКА · ПАТРУЛЬ','MYSTERY · PATROL'),text:T('Иногда по городу ходит патруль в форме и балаклаве. Лица не видно, но я замечаю мелочи: глаза, запах чая, ритм карандаша. Это не угроза и не слежка, а загадка, которую можно разгадать или оставить.','Sometimes a patrol in uniform and a balaclava walks through the city. The face is hidden, but I notice small things: the eyes, the smell of tea, the rhythm of a pencil. It is neither a threat nor surveillance but a riddle that can be solved or left alone.')};

 // Day 18: the squares in the evening. The folder falls and the patrol gathers the pages.
 add('d18_mid',choice(['Вернуться домой через сквер','Go home through the park'],'explore','d18_mask',{}));
 N.d18_mask=scene([
  note('Домой я возвращаюсь через сквер. Вечерний свет мягкий, но в аллее непривычно тихо.','I go home through the park. The evening light is soft, but the avenue is unusually quiet.'),
  note('Навстречу идёт патруль: человек в тёмной форме и чёрной балаклаве, из-под которой видны только глаза. Папка выскальзывает у меня из сумки, и листы разлетаются по плитке.','A patrol comes towards me: a person in dark uniform and a black balaclava with only the eyes showing. My folder slips from my bag and the sheets scatter over the paving.'),
  note('Человек в балаклаве молча собирает листы и аккуратно подаёт мне.','The person in the balaclava gathers the sheets without a word and hands them back to me neatly.'),
  say('Документы на месте. Ничего не потерялось.','The documents are all here. Nothing is lost.')
 ],null,{...place('СКВЕР · ВЕЧЕР','PARK · EVENING','20:30','belgrade-night-walk'),journal:['masked_patrol'],choices:[
  choice(['Запомнить живые глаза над тканью','Remember the lively eyes above the cloth'],'explore','d18_turn',{maskMet:true,maskClue1:true}),
  choice(['Поблагодарить и пойти дальше','Thank them and walk on'],'practical','d18_turn',{maskMet:true})]});

 // Day 22: by the arch, the morning after the film.
 add('d22_mid',choice(['Выйти к арке и проверить, не осталось ли там вещей','Go out to the arch and see whether anything was left behind'],'explore','d22_mask',{}));
 N.d22_mask=scene([
  note('У арки, где вчера стоял экран, на камне сидит человек в форме и балаклаве и пьёт чай из термоса.','By the arch, where the screen stood yesterday, a person in uniform and a balaclava sits on a stone drinking tea from a flask.'),
  say('Доброе утро. Шума вчера было мало, а огней много. Хорошее сочетание.','Good morning. There was little noise yesterday and many lights. A good combination.'),
  note('Человек отвинчивает крышку термоса, и по двору плывёт запах чая с лимоном.','The person unscrews the flask lid, and the smell of tea with lemon drifts across the courtyard.')
 ],null,{...place('ДВОР · УТРО','COURTYARD · MORNING','10:00','courtyard-after-film'),journal:['masked_patrol'],choices:[
  choice(['Запомнить запах лимона','Remember the smell of lemon'],'explore','d22_turn',{maskMet:true,maskClue2:true}),
  choice(['Улыбнуться и пойти дальше','Smile and walk on'],'practical','d22_turn',{maskMet:true})]});

 // Day 25: the market, a lost child who is found at once.
 add('d25_mid',choice(['Пройтись до ряда с мёдом','Walk to the honey row'],'explore','d25_mask',{}));
 N.d25_mask=scene([
  note('На рынке сутолока. У прилавка с мёдом человек в форме и балаклаве записывает что-то в блокнот: только что потерялся ребёнок, но его уже нашли.','The market is crowded. At the honey stall a person in uniform and a balaclava writes something in a notebook: a child has just been lost, but has already been found.'),
  note('Задумавшись, человек постукивает карандашом по блокноту: три коротких удара, пауза и ещё один. Ритм кажется смутно знакомым.','Thinking, the person taps a pencil on the notebook: three short knocks, a pause and one more. The rhythm seems vaguely familiar.'),
  say('Всё в порядке, ребёнок у мамы. Можете идти дальше.','All is well, the child is with their mother. You may go on.')
 ],null,{...place('РЫНОК · ПРИЛАВОК С МЁДОМ','MARKET · THE HONEY STALL','12:30','belgrade-morning-cafe'),journal:['masked_patrol'],choices:[
  choice(['Запомнить ритм карандаша','Remember the rhythm of the pencil'],'explore','d25_turn',{maskMet:true,maskClue3:true}),
  choice(['Купить мёд и идти дальше','Buy honey and walk on'],'practical','d25_turn',{maskMet:true})]});

 // Day 27: the embankment. The patrol says where the next evening will be.
 add('d27_mid',choice(['Выйти подышать к реке','Go out to the river for some air'],'personal','d27_mask',{}));
 N.d27_mask=scene([
  note('У воды тихо. Вдоль набережной идёт патруль: человек в балаклаве замедляет шаг, будто узнал меня, и ровно кивает.','It is quiet by the water. A patrol walks along the embankment: the person in the balaclava slows down as if recognising me and gives an even nod.'),
  say('Если нужна помощь с дорогой или документами, подскажу, куда обратиться. Решения по делам принимают другие.','If you need help with the road or with documents, I will tell you where to go. Others decide the cases.'),
  note('Больше слов нет. На патруле личное остаётся за маской, и я не знаю, спросить ли про имя.','No more words. On patrol the personal stays behind the mask, and I do not know whether to ask for a name.')
 ],null,{...place('НАБЕРЕЖНАЯ · ВЕЧЕР','EMBANKMENT · EVENING','19:30','riverside-evening'),journal:['masked_patrol'],choices:[
  choice(['Спросить, кто это','Ask who it is'],'explore','d27_mask_ask',{maskMet:true,maskAsked:true}),
  choice(['Просто кивнуть в ответ','Simply nod back'],'practical','d27_turn',{maskMet:true})]});
 N.d27_mask_ask=scene([
  say('Патруль. На дежурстве больше ничего не скажу. Но завтра вечером я буду у арки во дворе, если вам интересно.','Patrol. I will say nothing more while on duty. But tomorrow evening I will be by the arch in the courtyard, if you are interested.'),
  note('Голос мужской или женский — не разобрать. Но приглашение звучит спокойно и просто, как приглашение на чай.','Whether the voice is a man’s or a woman’s I cannot tell. But the invitation sounds calm and simple, like an invitation to tea.')
 ],'d27_turn',place('НАБЕРЕЖНАЯ · ВЕЧЕР','EMBANKMENT · EVENING','19:40','riverside-evening'));

 // Day 28: the reveal by the arch. Guessing is optional; the identity is the officer from the document window.
 add('d28_start',choice(['Подойти к человеку у арки','Go up to the person by the arch'],'explore','d28_mask',{}));
 N.d28_mask=scene([
  note('У арки, где гирлянды светят слабее всего, стоит человек в форме и балаклаве. Он не на посту: рядом ни рации, ни напарника.','By the arch, where the garlands shine weakest, stands a person in uniform and a balaclava. Not on duty: there is no radio and no partner nearby.'),
  say('Вы пришли. Хорошо. Сегодня мне разрешили снять маску на час.','You came. Good. Today I have been allowed to take off the mask for an hour.'),
  note('Двор шумит позади, но здесь тихо. Это тот момент, когда можно сказать имя вслух или не говорить.','The courtyard hums behind us, but it is quiet here. This is the moment when one may say a name aloud, or not.')
 ],null,{...place('ДВОР · У АРКИ','COURTYARD · BY THE ARCH','20:00','courtyard-after-film'),journal:['masked_patrol'],choices:[
  choice(['«Это Ивана»','“It is Ivana”'],'personal','d28_mask_reveal',{maskGuess:'ivana'}),
  choice(['«Это Страхиня»','“It is Strahinja”'],'personal','d28_mask_reveal',{maskGuess:'strahinya'}),
  choice(['«Это Лазар из банка»','“It is Lazar from the bank”'],'personal','d28_mask_reveal',{maskGuess:'lazar'}),
  choice(['Не гадать, а просто подождать','Not guess and simply wait'],'practical','d28_mask_reveal',{maskGuess:'skip'})]});
 const guess=['maskGuess','mupSpark'];
 N.d28_mask_reveal=scene([
  by('narrator','mupSpark',{strahinya:['Человек снимает балаклаву. Это Страхиня — тот самый, что принимает документы у окна. Волосы коротко острижены, на щеке след от ткани, глаза те же: живые, с тёплой искрой.','The person takes off the balaclava. It is Strahinja, the very one who receives documents at the window. His hair is cropped short, there is a mark from the cloth on his cheek, and the eyes are the same: lively, with a warm spark.'],default:['Человек снимает балаклаву. Это Ивана — та самая, что принимает документы у окна. Волосы собраны, на щеке след от ткани, глаза те же: живые, с тёплой искрой.','The person takes off the balaclava. It is Ivana, the very one who receives documents at the window. Her hair is pulled back, there is a mark from the cloth on her cheek, and the eyes are the same: lively, with a warm spark.']}),
  by('mupStaff','mupSpark',{strahinya:['В управлении я принимаю бумаги, на патруле охраняю порядок. Это две работы, и я не хотел смешивать их с вами. Сегодня смену отдали другим, и я могу быть просто собой.','At the administration I receive papers, on patrol I keep order. These are two jobs, and I did not want to mix them up with you. Today the shift went to others, and I can simply be myself.'],default:['В управлении я принимаю бумаги, на патруле охраняю порядок. Это две работы, и я не хотела смешивать их с вами. Сегодня смену отдали другим, и я могу быть просто собой.','At the administration I receive papers, on patrol I keep order. These are two jobs, and I did not want to mix them up with you. Today the shift went to others, and I can simply be myself.']}),
  by('narrator',guess,{'ivana:ivana':['Вы угадали, и в улыбке мелькает удовольствие: «Глаза выдали?»','You guessed, and a flash of pleasure crosses the smile: “Did the eyes give me away?”'],'strahinya:strahinya':['Вы угадали, и в улыбке мелькает удовольствие: «Глаза выдали?»','You guessed, and a flash of pleasure crosses the smile: “Did the eyes give me away?”'],'skip:ivana':['Вы не стали гадать. Кивок в ответ: «Так тоже можно».','You did not guess. A nod in reply: “That is allowed too.”'],'skip:strahinya':['Вы не стали гадать. Кивок в ответ: «Так тоже можно».','You did not guess. A nod in reply: “That is allowed too.”'],default:['Вы не угадали. Усмешка: «Это даже лучше. Загадка осталась честной».','You did not guess right. A smile: “That is even better. The riddle stayed honest.”']})
 ],null,{...place('ДВОР · У АРКИ','COURTYARD · BY THE ARCH','20:10','courtyard-after-film'),choices:[
  choice(['Предложить прогуляться после дежурства','Suggest a walk after the duty'],'romance','d28_mask_end',{maskEnd:'walk'}),
  choice(['Поблагодарить за помощь и пожать руку','Thank them for their help and shake hands'],'friendship','d28_mask_end',{maskEnd:'friend'}),
  choice(['Оставить тайну между нами','Keep the secret between us'],'personal','d28_mask_end',{maskEnd:'secret'})]});
 N.d28_mask_end=scene([
  by('mupStaff','maskEnd',{walk:['С удовольствием. Только без бумаг и без формы. Решения по вашему делу принимают другие, и от нашей прогулки они не изменятся.','With pleasure. Only no papers and no uniform. Others decide your case, and our walk will not change it.'],friend:['Пожалуйста. Приятно знать, что это было нужно. Заходите к окну, если будут вопросы.','You are welcome. It is nice to know it was needed. Come to the window if you have questions.'],default:['Договорились: маска остаётся нашей тайной. А улыбка у окна приёма — просто улыбка.','Agreed: the mask stays our secret. And a smile at the reception window is just a smile.']}),
  note('Мы возвращаемся к огням двора. Никто не заметил, как человек в форме исчез из тени арки и снова стал одним из гостей.','We go back to the lights of the courtyard. Nobody noticed how the person in uniform vanished from the arch’s shadow and became one of the guests again.')
 ],'d28_mid',place('ДВОР · У АРКИ','COURTYARD · BY THE ARCH','20:20','courtyard-after-film'));
}
