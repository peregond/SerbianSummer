// Optional first-evening romance. Existing scene IDs and page counts stay valid.
export const HOST_COFFEE_TRANSLATIONS={};
const T=(ru,en)=>(HOST_COFFEE_TRANSLATIONS[ru]=en,ru);
export function extendHostCoffee({NODES:N,JOURNAL:J,BACKGROUNDS:B}){
 const n=text=>({speaker:'narrator',text}),y=text=>({speaker:'player',text}),h=text=>({speaker:'host',text});
 const both=(speaker,dragan,jelena)=>({speaker,text:dragan,hostText:{dragan,jelena}});
 const action=label=>({kind:'tap',label,object:label});
 const scene=(pages,next,stage,extra={})=>({pages,next,bg:'first-room',location:T('КВАРТИРА · КОФЕ НА КУХНЕ','FLAT · COFFEE IN THE KITCHEN'),time:'18:50',music:'encounter',hostPortrait:true,kitchenStage:stage,exitAction:action(T('Продолжить разговор на кухне','Continue the kitchen conversation')),...extra});
 // The lent top is a choice of the player: a grey or a white close-fitting Under Armour T-shirt (a hoodie for Jelena).
 const hostTop=pairs=>{const text={};for(const host of ['dragan','jelena']){for(const top of ['grey','white'])text[host+':'+top]=T(...pairs[host][top]);text[host+':']=text[host+':grey'];}return {flag:['host','hostTop'],text:{...text,default:text['dragan:grey']}};};
 const thanks=['Спасибо. Тогда у меня появится официальный повод зайти ещё раз — вернуть после стирки.','Thank you. Then I will have an official excuse to come by again: returning it after a wash.'];
 const topReply=()=>({...h(T(...thanks)),
  byFlag:hostTop({
   dragan:{grey:['Серую давай. Спасибо. Тогда у меня появится официальный повод зайти ещё раз — вернуть после стирки.','The grey one, then. Thank you. That gives me an official excuse to come by again: returning it after a wash.'],white:['Белую? Рядом с кофе это смелый выбор. Спасибо, буду осторожнее. И у меня появится повод зайти ещё раз — вернуть после стирки.','The white one? Brave, next to coffee. Thank you, I will be careful. And it gives me a reason to come by again: returning it after a wash.']},
   jelena:{grey:['Серую, пожалуйста. Спасибо. Тогда у меня появится официальный повод зайти ещё раз — вернуть после стирки.','The grey one, please. Thank you. That gives me an official excuse to come by again: returning it after a wash.'],white:['Белую, пожалуй. Только подальше от кофе, обещаю. Спасибо: у меня появится повод зайти ещё раз — вернуть после стирки.','The white one, I think. Away from the coffee, I promise. Thank you; it gives me a reason to come by again: returning it after a wash.']}
  })});
 const topBorrowed=()=>({speaker:'narrator',text:T('Серая футболка Under Armour сидит на Драгане плотнее, чем я ожидал{a}. Он поправляет рукав и с улыбкой возвращается к столу.','The grey Under Armour T-shirt fits Dragan more closely than I expected. He adjusts a sleeve and returns to the table with a smile.'),
  byFlag:hostTop({
   dragan:{grey:['Серая футболка Under Armour сидит на Драгане плотнее, чем я ожидал{a}. Он поправляет рукав и с улыбкой возвращается к столу.','The grey Under Armour T-shirt fits Dragan more closely than I expected. He adjusts a sleeve and returns to the table with a smile.'],white:['Белая футболка Under Armour облегает Драгана плотнее, чем я ожидал{a}. Он поправляет рукав и с улыбкой возвращается к столу.','The white Under Armour T-shirt hugs Dragan more closely than I expected. He adjusts a sleeve and returns to the table with a smile.']},
   jelena:{grey:['Йелена прячет пальцы в длинных рукавах серой толстовки. Надпись «СПБГУ 2008» выглядит на ней неожиданно уютно. Она улыбается, заметив, что я смотрю.','Jelena tucks her fingers into the long sleeves of the grey hoodie. The “СПБГУ 2008” print looks unexpectedly cosy on her. She smiles when she catches me looking.'],white:['Йелена прячет пальцы в длинных рукавах белой толстовки. Надпись «СПБГУ 2008» выглядит на ней неожиданно уютно. Она улыбается, заметив, что я смотрю.','Jelena tucks her fingers into the long sleeves of the white hoodie. The “СПБГУ 2008” print looks unexpectedly cosy on her. She smiles when she catches me looking.']}
  })});
 const stageLabels={
  coffee:[T('Кофе на кухне','Coffee in the kitchen'),T('За кухонным столом с двумя чашками кофе','At a kitchen table with two cups of coffee')],
  spill:[T('Неловкая чашка','An awkward cup'),T('Большое пятно кофе на одежде и удивлённое выражение лица','A large coffee stain on the clothes and a surprised expression')],
  comfort:[T('Всё в порядке','Everything is all right'),T('Рука мягко накрывает ладонь гостя, успокаивающий взгляд','A hand gently covers the guest’s hand, with a reassuring gaze')],
  dry:[T('Пока сохнет рубашка','While the shirt dries'),T('Спокойный разговор на кухне, мокрая рубашка на спинке стула','A quiet kitchen conversation, with a wet shirt over a chair')],
  borrowed:[T('Сухая одежда','Dry clothes'),T('За кухонным столом в одолженной сухой одежде','At the kitchen table in borrowed dry clothes')]
 };
 for(const person of ['dragan','jelena'])for(const [stage,[label,description]]of Object.entries(stageLabels))B[`${person}-kitchen-${stage}`]={label,description,position:'50% 34%'};
 J.host_spark={...J.host_spark,title:stageLabels.coffee[0],text:T('Получилось предложить кофе прямо в квартире. Разговор постепенно перестал быть только про ключи и жильё.','I managed to suggest coffee right in the flat. The conversation gradually became about more than keys and housing.')};
 J.host_coffee={title:stageLabels.spill[0],tag:T('ЛЮДИ · ДОВЕРИЕ','PEOPLE · TRUST'),text:T('На кухне пролился уже остывший кофе. Вместо упрёков — спокойный голос и ладонь, которая помогла перестать волноваться.','Some lukewarm coffee spilled in the kitchen. Instead of reproaches, a calm voice and a hand helped me stop worrying.')};
 J.borrowed_top={title:stageLabels.borrowed[0],tag:T('МАЛЕНЬКИЙ ПОВОД УВИДЕТЬСЯ','A LITTLE REASON TO MEET AGAIN'),text:T('У меня нашлась сухая вещь на замену мокрой одежде. Теперь есть ещё один повод увидеться — вернуть её и спокойно допить кофе.','I had something dry to replace the wet clothes. Now there is another reason to meet: returning it and finishing our coffee in peace.')};
 N.keys_room.choices[0].label=T('«Может, выпьем кофе здесь, на кухне? Я угощаю»','‘Shall we have coffee here in the kitchen? My treat’');
 N.host_flirt.pages=[
  n(T('Я киваю в сторону кухни. После всех разговоров о ключах хочется задержаться ещё ненадолго.','I nod toward the kitchen. After all the talk about keys, I want to stay together a little longer.')),
  both('host',T('С удовольствием. Только договоримся: сейчас я гость, а не человек, который показывает выключатели.','I would love to. On one condition: I am a guest now, rather than the person pointing out the light switches.'),T('Давай. Мне нравится идея не искать кафе, а просто остаться здесь на десять минут.','Yes. I like the idea of staying right here for ten minutes instead of looking for a café.')),
  y(T('Тогда я варю кофе, а ты показываешь, где чашки. Дальше справлюсь.','I will make the coffee, and you show me the cups. I can manage from there.')),
  {...n(T('На кухне пахнет деревом и вечерним воздухом. У окна стоит маленький стол — как раз на две чашки.','The kitchen smells of wood and evening air. A little table by the window has room for exactly two cups.')),kitchenStage:'coffee'},
  {...h(T('Чашки в верхнем шкафу. А вот у этой половицы свой характер — потом покажу.','The cups are in the top cupboard. That floorboard has a personality of its own; I will show you later.')),kitchenStage:'coffee'}
 ];
 N.host_flirt.music='encounter';N.host_flirt.next='host_coffee_pour';N.host_flirt.exitAction=action(T('Приготовить кофе','Make coffee'));
 N.host_coffee_pour=scene([
  n(T('Кофе готов. Пока мы выбираем чашки и спорим о сахаре, он успевает немного остыть.','The coffee is ready. While we choose cups and argue about sugar, it has time to cool a little.')),
  both('host',T('Я вообще собирался уйти через минуту. Но у тебя тут, кажется, хорошая компания.','I was going to leave in a minute. But you seem to have good company here.'),T('Я вообще-то пришла только отдать ключи. Но тут неожиданно хороший повод остаться.','I only came to hand over the keys. But suddenly there is a good reason to stay.')),
  n(T('Я беру обе чашки и разворачиваюсь к столу. Под ногой тихо скрипит доска.','I pick up both cups and turn toward the table. A board creaks softly under my foot.'))
 ],'host_coffee_spill','coffee',{exitAction:action(T('Отнести чашки к столу','Carry the cups to the table'))});
 N.host_coffee_spill=scene([
  n(T('Носок цепляется за край половицы. Я удерживаюсь на ногах, а вот кофе — нет. Чашка наклоняется, и большая часть выплёскивается вперёд.','My toe catches the edge of the floorboard. I stay on my feet; the coffee does not. The cup tilts, spilling most of its contents forward.')),
  both('narrator',T('Драган отступает на полшага. По зелёной рубашке расползается большое тёмное пятно, капли попадают на открытую грудь у воротника и стекают к поясу. На секунду он совершенно ошарашен.','Dragan takes half a step back. A large dark stain spreads across his green shirt; drops land on his exposed chest at the collar and run toward his belt. For a second, he looks completely taken aback.'),T('Йелена отступает на полшага и удивлённо поднимает брови. Кофе попадает на рубашку и плотный топ под ней: большое пятно идёт от груди к талии, несколько капель — сбоку у пояса.','Jelena takes half a step back, eyebrows lifting in surprise. Coffee hits her overshirt and the opaque top beneath: a broad stain runs from chest to waist, with a few drops at the side of her belt.')),
  y(T('Ой! Прости. Тебе не горячо? Я сейчас всё вытру.','Oh! I am sorry. Is it hot? I will clean it up.'))
 ],'host_coffee_comfort','spill',{journal:['host_coffee'],effectOnEnter:{hostCoffeeSpilled:true},exitAction:action(T('Поставить чашки и взять полотенце','Put down the cups and get a towel'))});
 N.host_coffee_comfort=scene([
  n(T('Я уже представляю, как неловко закончится это знакомство. Вместо упрёка слышу спокойный голос.','I am already imagining this encounter ending in embarrassment. Instead of a reproach, I hear a calm voice.')),
  h(T('Эй, всё в порядке. Кофе уже чуть тёплый. Я не обжёгся, и с рубашкой ничего страшного не случится.','Hey, it is all right. The coffee is only lukewarm. I am not burned, and the shirt will be fine.')),
  both('narrator',T('Драган мягко берёт меня за руку. Большой палец на секунду касается моей ладони. Он не удерживает меня — просто даёт понять, что сердиться не собирается.','Dragan gently takes my hand. His thumb brushes my palm for a moment. He is not holding me in place, just letting me know he is not angry.'),T('Йелена мягко берёт меня за руку и чуть сжимает ладонь. От её спокойного взгляда наконец получается перестать торопливо извиняться.','Jelena gently takes my hand and gives it a little squeeze. Her calm gaze finally helps me stop apologising in a rush.'))
 ],null,'comfort',{choices:[
  {label:T('Не убирать ладонь и улыбнуться в ответ','Leave my hand there and smile back'),tone:'romance',next:'host_coffee_change',effect:{hostCoffeeTouch:'held'}},
  {label:T('Поблагодарить и потянуться за полотенцем','Say thank you and reach for the towel'),tone:'practical',next:'host_coffee_change',effect:{hostCoffeeTouch:'released'}}
 ]});
 N.host_coffee_comfort.pages[1].hostText={dragan:N.host_coffee_comfort.pages[1].text,jelena:T('Эй, всё в порядке. Кофе уже чуть тёплый. Я не обожглась. Давай сначала выдохнем, а потом спасём одежду.','Hey, it is all right. The coffee is only lukewarm. I am not burned. Let us breathe first, then rescue the clothes.')};
 N.host_coffee_change=scene([
  {...n(T('Я отворачиваюсь к окну и подаю сухое полотенце. За спиной шуршит мокрая ткань.','I turn toward the window and pass over a dry towel. Wet fabric rustles behind me.')),kitchenStage:'spill'},
  {...both('host',T('Сейчас сниму мокрую рубашку. Потом можно будет спокойно допить то, что осталось в чашках.','I will take off the wet shirt. Then we can finish whatever is left in the cups in peace.'),T('У меня тут есть запасной топ. Переоденусь, а рубашку пока повесим на стул.','I have a spare top here. I will change, and we can hang the shirt on a chair for now.')),kitchenStage:'spill'},
  both('narrator',T('Когда я оборачиваюсь, Драган уже сидит без рубашки, с полотенцем на плече. На груди густые тёмные волосы и небольшая чёрная татуировка слева. Он ловит мой взгляд и слегка улыбается.','When I turn back, Dragan is sitting without his shirt, a towel over his shoulder. He has dense dark chest hair and a small black tattoo on the left. He catches my eye and gives a little smile.'),T('Когда Йелена возвращается на кухню, на ней уже сухой плотный топ. Мокрая рубашка висит на спинке стула. Она убирает косу за плечо и смотрит на меня с лёгкой улыбкой.','When Jelena returns to the kitchen, she is wearing a dry opaque top. The wet overshirt hangs over a chair. She moves her braid over her shoulder and looks at me with a small smile.')),
  y(T('Надо было просто сказать, что хочется посидеть с тобой подольше. Без этого представления.','I should have just said I wanted more time with you. Without the whole performance.'))
 ],'host_coffee_wait','dry',{exitAction:action(T('Сесть рядом и перевести дух','Sit nearby and catch my breath'))});
 N.host_coffee_wait=scene([
  h(T('А я бы согласился и без представления. Но половица решила помочь.','I would have agreed without the performance. But the floorboard decided to help.')),
  n(T('Рубашка сохнет на стуле. Мы сидим за столом чуть ближе, чем раньше. Теперь пауза между нами уже не пугает.','The shirt dries on a chair. We sit a little closer at the table. The silence between us no longer frightens me.')),
  n(T('В шкафу лежат чистые вещи. Можно предложить что-нибудь сухое — или просто остаться рядом, пока одежда сохнет.','There are clean things in the wardrobe. I could offer something dry, or simply stay together while the clothes dry.'))
 ],null,'dry',{choices:[
  {label:T('«У меня есть сухая одежда. Давай найду тебе что-нибудь»','‘I have some dry clothes. Let me find you something’'),tone:'friendship',next:'host_coffee_lend'},
  {label:T('«Посидим ещё немного. Мне хорошо с тобой»','‘Let us sit a little longer. I like being with you’'),tone:'romance',next:'host_coffee_stay'}
 ]});
 N.host_coffee_wait.pages[0].hostText={dragan:N.host_coffee_wait.pages[0].text,jelena:T('А я бы согласилась и без представления. Но у половицы явно были свои планы.','I would have agreed without the performance. But the floorboard clearly had its own plans.')};
 N.host_coffee_lend=scene([
  both('player',T('У меня есть чистая облегающая футболка Under Armour. Серая или белая — какую принести?','I have a clean, close-fitting Under Armour T-shirt. Grey or white: which one shall I bring?'),T('У меня есть мягкая толстовка с надписью «СПБГУ 2008». Серая или белая — какую принести?','I have a soft hoodie that says “СПБГУ 2008”. Grey or white: which one shall I bring?')),
  topReply(),
  n(T('Я достаю вещь из шкафа и ненадолго оставляю кухню, чтобы можно было спокойно переодеться.','I take it from the wardrobe and leave the kitchen for a moment so they can change comfortably.'))
 ],'host_coffee_borrowed','dry',{exitAction:action(T('Вернуться на кухню с новой чашкой кофе','Return to the kitchen with fresh coffee'))});
 N.host_coffee_borrowed=scene([
  topBorrowed(),
  h(T('Вторую чашку понесём вместе? На всякий случай.','Shall we carry the second cup together? Just in case.')),
  y(T('Вместе. Но за руку можно взять меня и без помощи половицы.','Together. But you can take my hand without the floorboard’s help too.')),
  n(T('Мы допиваем кофе без происшествий. У этого неловкого знакомства появился очень хороший повод продолжиться.','We finish our coffee without another mishap. This awkward encounter has found a very good reason to continue.'))
 ],'room_alone','borrowed',{journal:['borrowed_top'],effectOnEnter:{hostBorrowedTop:true},exitAction:action(T('Проводить до двери и договориться увидеться','Walk to the door and arrange to meet again'))});
 N.host_coffee_stay=scene([
  h(T('Тогда просто посидим. Мне тоже хорошо с тобой.','Then let us just sit. I like being with you too.')),
  n(T('Мы допиваем кофе и говорим о самом простом: утреннем свете, дворе и том, как давно здесь скрипит пол. В какой-то момент я совсем забываю про пятно.','We finish our coffee and talk about simple things: morning light, the courtyard and how long that floor has been creaking. At some point, I forget the stain entirely.')),
  n(T('Когда приходит время прощаться, неловкость уже сменилась тёплым чувством. Встретиться снова хочется без всяких случайностей.','When it is time to say goodbye, the awkwardness has turned into warmth. I want to meet again without relying on any accidents.'))
 ],'room_alone','dry',{exitAction:action(T('Попрощаться и остаться отдыхать','Say goodbye and stay in to rest'))});
 // On later viewings, coffee is also offered inside the flat, but we do not
 // replay the same accident or conjure a suitcase at a viewing across town.
 N.district_host_talk.choices[0].label=T('«Может, выпьем кофе здесь? Хочется познакомиться без спешки»','‘Shall we have coffee here? I would like to get to know you without rushing’');
 N.district_romance.music='encounter';N.district_romance.pages=[
  {speaker:'districtHost',text:T('Давай. Условия мы записали, можно сделать паузу. Чашки на кухне.','Yes. We have written down the terms; we can take a break. The cups are in the kitchen.')},
  {...n(T('Мы садимся за маленький кухонный стол. Ася выходит позвонить, оставляя нам несколько спокойных минут.','We sit at a small kitchen table. Asya steps out to make a call, leaving us a few quiet minutes.')),kitchenStage:'coffee'},
  {...y(T('С квартирой я хочу разобраться без спешки. А сейчас мне интересно узнать тебя.','I want to take my time deciding about the flat. Right now, I am interested in getting to know you.')),kitchenStage:'coffee'},
  {speaker:'districtHost',text:T('Мне приятно это слышать. Начнём с кофе, а остальное никуда не убежит.','I am glad to hear that. Let us start with coffee; the rest is not going anywhere.'),kitchenStage:'coffee'}
 ];
 N.district_romance.exitAction=action(T('Допить кофе и закончить просмотр','Finish the coffee and the viewing'));
}
