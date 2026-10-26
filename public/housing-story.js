// Flat hunting, negotiation, moving in. Only the new story version (rentalCast "new") walks this path:
// older saves keep the original district scenes, which stay in the graph with their IDs and page positions.
// Rents, the deposit and discounts are conditions of this fictional story, not a rule of the Serbian rental market.
import {CHAPTERS} from './chapters.js?v=0.15.3';
import {FLATS,OWNERS,DISCOUNTS,DISTRICT_FIRST,QUEST_FLAG,SEEN_BIT,T,HOUSING_EN} from './flat-data.js?v=1';
export {HOUSING_EN};
const rentOf=(owner,discount=0)=>FLATS[owner].rent-discount;
const fill=([ru,en],rent)=>[ru.replaceAll('{rent}',rent),en.replaceAll('{rent}',rent)];
const N=(ru,en,extra={})=>({speaker:'narrator',text:T(ru,en),...extra});
const P=(ru,en,extra={})=>({speaker:'player',text:T(ru,en),...extra});
const H=(ru,en,extra={})=>({speaker:'districtHost',text:T(ru,en),...extra});
const A=(ru,en,extra={})=>({speaker:'Ася',character:'asya',emotion:'friendly',text:T(ru,en),...extra});
const AM=(ru,en,extra={})=>A(ru,en,{message:true,...extra});
const byOwner=(speaker,fn,extra={})=>{
  const text=Object.fromEntries(OWNERS.map(owner=>[owner,T(...fn(owner))]));
  return {speaker,text:text.ana,byFlag:{flag:'districtOwner',text:{...text,default:text.ana}},...extra};
};
// Text that depends on the host and on the discount that has been agreed (rent is spelled out per variant).
const priced=(speaker,fn,extra={})=>{
  const text={};
  for(const owner of OWNERS)for(const discount of DISCOUNTS)text[owner+':'+discount]=T(...fn(owner,rentOf(owner,discount),discount));
  for(const owner of OWNERS)text[owner+':']=text[owner+':0'];
  return {speaker,text:text['ana:0'],byFlag:{flag:['districtOwner','flatDiscount'],text:{...text,default:text['ana:0']}},...extra};
};
const tap=(label,en,extra={})=>({kind:'tap',label:T(label,en),object:T(label,en),...extra});
const choice=(label,en,next,tone,effect,when)=>({label:T(label,en),next,tone,...(effect?{effect}:{}),...(when?{when}:{})});
const owned=owner=>({flag:'districtOwner',equals:owner});
const place=(owner)=>FLATS[owner].district;

export function extendHousing({NODES,JOURNAL,BACKGROUNDS}){
  const day=CHAPTERS.find(c=>c.day===1);
  const base={bg:'first-room',location:T('БЕЛГРАД · ПОИСК КВАРТИРЫ','BELGRADE · FLAT HUNT'),time:'11:00',day:'ДЕНЬ 1',chapterId:day.id,chapter:day.number+' · '+day.title,districtBg:true,districtPortrait:true};
  const finish=(id,pages,next,extra={})=>{
    const node={...base,pages,next,...extra};
    node.actions={...(node.actions??{})};
    pages.forEach((page,index)=>{if(page.action&&!node.actions[index])node.actions[index]=page.action;});
    if(!node.choices){
      const index=pages.length-1;
      if(!node.actions[index])node.actions[index]=structuredClone(node.exitAction??tap('Продолжить','Continue'));
    }
    for(const [index,action]of Object.entries(node.actions))pages[Number(index)].action=action;
    NODES[id]=node;return node;
  };
  Object.assign(JOURNAL,{
    flat_districts:{title:T('Три района','Three districts'),tag:T('ДЕНЬ 1 · КВАРТИРА','DAY 1 · THE FLAT'),text:T('Ася выбрала три района: Дорћол, Врачар и Новый Белград. Выбирать можно по настроению и без спешки: просмотр ничего не обещает.','Asya picked three districts: Dorćol, Vračar and New Belgrade. I can choose by mood and without rushing: a viewing promises nothing.')},
    flat_check:{title:T('Что видно только вживую','What only shows in person'),tag:T('ДЕНЬ 1 · КВАРТИРА','DAY 1 · THE FLAT'),text:T('Вода, окна и интернет проверены своими руками. Фотографии этого не показывали.','I checked the water, the windows and the internet with my own hands. The photographs did not show it.')},
    flat_deal:{title:T('Квартира выбрана','A flat chosen'),tag:T('ДЕНЬ 1 · ДОГОВОР','DAY 1 · THE LEASE'),text:T('Договор прочитан, скидка обсуждена открыто, подпись и перевод залога сделаны по моему решению. Это условия этой вымышленной истории: в жизни залог, скидки и сроки у каждого хозяина свои, и их нужно проверять в договоре.','I read the lease, talked about the discount openly, and signed and paid the deposit on my own decision. These are the conditions of this fictional story: in real life the deposit, discounts and terms differ between landlords and must be checked in the lease.')},
    flat_home:{title:T('Новый адрес','A new address'),tag:T('ДЕНЬ 1 · ПЕРЕЕЗД','DAY 1 · MOVING'),text:T('Переехал{a} в свою квартиру. Ключ, роутер и чемодан на своих местах. Банк — завтра, сначала дом.','I moved into my own flat. The key, the router and the suitcase are in their places. The bank is tomorrow; home comes first.')}
  });

  // 1. Asya presents three districts, then the full-screen map opens.
  finish('flat_intro',[
    AM('Нашла три района, где сейчас есть что смотреть. Сегодня съездим в любой, а решать будешь ты.','I found three districts with flats to see right now. We can visit any of them today, and you decide.'),
    AM('Дорћол — старый центр у крепости: невысокие дома, дворы, галереи и кофейни. Здесь сдают Ана и Стефан; они же помогают с бумагами другим хозяевам.','Dorćol is the old centre by the fortress: low houses, courtyards, galleries and coffee shops. Ana and Stefan rent here, and they also help other landlords with paperwork.'),
    AM('Врачар — зелёный район рядом с храмом Святого Саввы: балконы, парки, много кафе. Квартиру показывает Марко.','Vračar is a green district near the Church of Saint Sava: balconies, parks, plenty of cafés. Marko shows the flat.'),
    AM('Новый Белград — за рекой: просторные дома, широкие улицы, тише, но дальше от центра. Там живёт Вук.','New Belgrade lies across the river: roomy buildings, wide streets, quieter but farther from the centre. Vuk lives there.'),
    AM('Открой карту и нажми на район. Это ещё не окончательный выбор: смотреть можно сколько угодно вариантов.','Open the map and tap a district. This is not a final choice: you can see as many options as you like.',{action:tap('Открыть карту Белграда','Open the map of Belgrade')})
  ],'district_map',{districtBg:false,districtPortrait:false,bg:'room-window',location:T('БЕЛГРАД · ВРЕМЕННАЯ КОМНАТА','BELGRADE · TEMPORARY ROOM'),time:'09:40',journal:['flat_districts'],legacyOnly:true,exitAction:tap('Открыть карту Белграда','Open the map of Belgrade')});

  // 2. The map: three districts, one tap each. A seen flat leads straight back to its decision.
  const map=NODES.district_map;
  for(const old of map.choices)if(old.when?.equals==='new')old.when={flag:'rentalCast',equals:'retired'};
  for(const district of Object.keys(DISTRICT_FIRST)){
    const owner=DISTRICT_FIRST[district];
    map.choices.push({...choice(`${FLATS[owner].name[0]} · ${district==='dorcol'?'Дорћол':district==='vracar'?'Врачар':'Новый Белград'}`,`${FLATS[owner].name[1]} · ${district==='dorcol'?'Dorćol':district==='vracar'?'Vračar':'New Belgrade'}`,'flat_enter_'+owner,'explore',{district,districtOwner:owner},{flag:'rentalCast',equals:'new'}),revisit:'flat_decision'});
  }

  // 3. Viewing: arrival, the price spoken aloud, the three-station check.
  for(const owner of OWNERS){
    const flat=FLATS[owner];
    finish('flat_enter_'+owner,[
      N(...flat.arrival),
      H(...flat.voice,{character:owner,emotion:'friendly'}),
      N(...flat.detail),
      H(...fill(flat.price,flat.rent),{character:owner,emotion:'thoughtful'}),
      A('Давай проверим то, что на фотографиях не видно: воду, окна и интернет. Порядок не важен.','Let us check what the photographs do not show: the water, the windows and the internet. The order does not matter.',{action:tap('Начать осмотр','Start the viewing',{quest:'viewing'})})
    ],'flat_after_'+owner,{
      bg:flat.bg,districtBg:false,time:'11:32',
      effectOnEnter:{district:flat.district,districtOwner:owner,flatEnter:owner,flatWarmth:0,flatDiscount:0}
    });
    finish('flat_after_'+owner,[
      A(...flat.summary),
      N('{districtHost} отходит к окну и даёт мне время подумать. Можно спросить об условиях, познакомиться поближе или просто молча походить по комнатам.','{districtHost} steps to the window and gives me time to think. I can ask about the terms, get to know them better, or simply walk through the rooms in silence.')
    ],'rental_hub_'+owner,{bg:flat.bg,districtBg:false,time:'11:40',journal:['flat_check'],exitAction:tap('Подойти к хозяину','Walk over to the host')});
    // The earlier conversation scenes lead to the decision now, and carry their own place and time.
    const hub=NODES['rental_hub_'+owner];
    hub.location=T('БЕЛГРАД · ПРОСМОТР','BELGRADE · VIEWING');hub.districtBg=false;
    // While viewing, the bond is a generic flag; it becomes the landlord's own once the lease is signed.
    for(const [index,mode]of ['practical','friendship','romance'].entries())hub.choices[index].effect={rentalBond:mode};
    for(const mode of ['terms','friends'])NODES[`rental_${mode}_${owner}`].next='flat_decision';
    NODES['rental_flirt_'+owner].next='flat_coffee';
    for(const mode of ['terms','friends','flirt']){const node=NODES[`rental_${mode}_${owner}`];node.location=T('БЕЛГРАД · ПРОСМОТР','BELGRADE · VIEWING');}
  }

  // 3b. Coffee after the viewing: closeness is optional and always asked for aloud.
  finish('flat_coffee',[
    N('Ася выходит позвонить, и мы остаёмся вдвоём за маленьким столом с двумя чашками кофе.','Asya steps out to make a call, and the two of us sit at a small table with two cups of coffee.'),
    H('Расскажи, что тебя сюда привело. Не по документам, а по-настоящему.','Tell me what brought you here. Not for the paperwork, but for real.'),
    P('Хотелось начать заново, и чтобы рядом было тепло. Но торопиться я не хочу.','I wanted to start again, with some warmth around me. But I do not want to rush.')
  ],null,{time:'12:05',music:'encounter',choices:[
    choice('Спросить: «Можно взять тебя за руку? Если нет — так и скажи»','Ask: “May I take your hand? If not, just say so”','flat_coffee_warm','romance',{flatWarmth:2}),
    choice('Спокойно допить кофе и остаться на дружеской ноте','Quietly finish the coffee and keep things friendly','flat_coffee_calm','friendship',{flatWarmth:1})
  ]});
  finish('flat_coffee_warm',[
    H('Можно. И спасибо, что спросил{a} вслух.','Yes, you may. And thank you for asking aloud.'),
    N('Рука тёплая, пальцы чуть дрожат. Это ничего не обещает: мы просто посидели так минуту и отпустили.','The hand is warm and the fingers tremble a little. It promises nothing: we sat like that for a minute and let go.')
  ],'flat_decision',{time:'12:10',music:'encounter',exitAction:tap('Вернуться к разговору о квартире','Return to talking about the flat')});
  finish('flat_coffee_calm',[
    H('Мне тоже спокойно. И спешить не будем.','I feel calm too. And we will not rush.'),
    N('Кофе остывает, разговор не торопится. Рядом оказывается человек, с которым легко молчать.','The coffee cools and the conversation takes its time. Beside me is someone it is easy to be quiet with.')
  ],'flat_decision',{time:'12:10',exitAction:tap('Вернуться к разговору о квартире','Return to talking about the flat')});

  // 4. Decision: take this one, see other districts, or the second Dorćol flat.
  const here=owner=>({all:[owned(owner)]});
  finish('flat_decision',[
    byOwner('narrator',owner=>fill([`Цена: {rent} евро в месяц. Решить можно сейчас, а можно после других районов. Никто не торопит.`,`The price is {rent} euros a month. I can decide now or after other districts. Nobody is pushing.`],rentOf(owner))),
    A('Ничего не нужно решать из вежливости. Мне важно, чтобы ты выбрал{a} то, где захочется проснуться завтра.','Nothing has to be decided out of politeness. What matters is that you pick the place where you want to wake up tomorrow.')
  ],null,{time:'12:20',choices:[
    choice('Эта квартира подходит — перейдём к цене и условиям','This flat suits me; let us move on to the price and terms','flat_terms','practical'),
    choice('Посмотреть другие районы на карте','See other districts on the map','district_map','explore'),
    choice('Посмотреть второй вариант в Дорћоле — квартиру Стефана','See the second Dorćol option, Stefan’s flat','flat_enter_stefan','explore',{district:'dorcol',districtOwner:'stefan'},{all:[owned('ana'),{flag:QUEST_FLAG,notBit:SEEN_BIT.stefan}]}),
    choice('Вернуться к квартире Стефана','Go back to Stefan’s flat','flat_decision','explore',{district:'dorcol',districtOwner:'stefan'},{all:[owned('ana'),{flag:QUEST_FLAG,bit:SEEN_BIT.stefan}]}),
    choice('Вернуться к квартире Аны','Go back to Ana’s flat','flat_decision','explore',{district:'dorcol',districtOwner:'ana'},here('stefan'))
  ]});

  // 5. Terms and negotiation.
  finish('flat_terms',[
    priced('districtHost',(owner,rent)=>fill(['Условия такие: {rent} евро в месяц, коммунальные по счётчикам, залог — один месячный платёж. Он возвращается при выезде, если по описи нет претензий.','The terms are {rent} euros a month, utilities by meter, and a deposit of one month’s payment. It is returned when you leave if the inventory shows no complaints.'],rent)),
    A('Напомню: это условия именно этой истории. В жизни залог, скидки и сроки у каждого хозяина свои. Всегда смотри договор.','A reminder: these are the conditions of this story only. In real life the deposit, discounts and terms differ between landlords. Always read the lease.'),
    N('Можно принять цену, вежливо попросить скидку или вернуться к другим вариантам. Спешить некуда.','I can accept the price, politely ask for a discount, or go back to other options. There is no hurry.')
  ],null,{time:'12:30',choices:[
    choice('Принять цену как есть','Accept the price as it is','flat_price_full','practical',{flatDiscount:0}),
    choice('Вежливо попросить скидку','Politely ask for a discount','flat_price_basic','practical',{flatDiscount:50}),
    choice('Спросить о большей скидке: мы ведь уже успели познакомиться','Ask about a bigger discount, since we have already got to know each other','flat_price_warm100','romance',{flatDiscount:100},{flag:'flatWarmth',equals:1}),
    choice('Спросить о большей скидке: мне здесь хорошо, и с квартирой, и с тобой','Ask about a bigger discount; I feel good here, with the flat and with you','flat_price_warm150','romance',{flatDiscount:150},{flag:'flatWarmth',equals:2}),
    choice('Пока подумать и вернуться на карту','Think it over and go back to the map','district_map','personal')
  ]});
  finish('flat_price_full',[
    H('Хорошо. Тогда как в объявлении, без сюрпризов.','All right. Then as in the listing, no surprises.'),
    priced('narrator',(owner,rent)=>fill(['Цена остаётся {rent} евро в месяц. Я не стал{a} торговаться, и это тоже нормальное решение.','The price stays at {rent} euros a month. I did not haggle, and that is a perfectly fine decision too.'],rent))
  ],'flat_contract',{time:'12:35',effectOnEnter:{flatDiscount:0},exitAction:tap('Получить проект договора','Receive the draft lease')});
  finish('flat_price_basic',[
    H('Пятьдесят евро скинуть могу. Спокойный деловой разговор мне нравится.','I can take fifty euros off. A calm, businesslike conversation suits me.'),
    priced('narrator',(owner,rent,discount)=>fill(['Теперь аренда — {rent} евро в месяц. Скидка в пятьдесят евро — обычная вежливая просьба, без обещаний с моей стороны.','Now the rent is {rent} euros a month. The fifty-euro discount is an ordinary polite request, with no promises from me.'],rent))
  ],'flat_contract',{time:'12:35',effectOnEnter:{flatDiscount:50},exitAction:tap('Получить проект договора','Receive the draft lease')});
  for(const amount of [100,150]){
    const word=amount===100?['сто','a hundred']:['сто пятьдесят','a hundred and fifty'];
    finish('flat_price_warm'+amount,[
      H(`Мне приятно, что мы нашли общий язык. Скину ${word[0]} евро просто как хозяин, которому с тобой спокойно.`,`I am glad we found a common language. I will take ${word[1]} euros off simply as a host who feels at ease with you.`),
      P('Спасибо. Только пусть цена ни к чему меня не обязывает.','Thank you. But let the price not oblige me to anything.'),
      H('Не обязывает. Договор — отдельно, симпатия — отдельно. Если станет неловко, скажи.','It does not. The lease is one thing and fondness is another. If it ever feels awkward, say so.'),
      priced('narrator',(owner,rent)=>fill(['Теперь аренда — {rent} евро в месяц.','Now the rent is {rent} euros a month.'],rent))
    ],'flat_contract',{time:'12:40',effectOnEnter:{flatDiscount:amount},exitAction:tap('Получить проект договора','Receive the draft lease')});
  }

  // 6. Lease: read it first; nothing is signed or paid on its own.
  const signChoices=[
    choice('Договор понятен — подписать его','The lease is clear; sign it','flat_signed','practical'),
    choice('Задать вопросы по договору','Ask questions about the lease','flat_questions','explore'),
    choice('Не подписывать сейчас и вернуться к карте','Do not sign now and go back to the map','district_map','personal')
  ];
  finish('flat_contract',[
    N('Проект договора приходит файлом в чат. Я читаю пункт за пунктом и ставлю карандашные пометки на полях.','The draft lease arrives as a file in the chat. I read it point by point and make pencil notes in the margin.'),
    priced('districtHost',(owner,rent)=>fill(['Вот проект: {rent} евро в месяц, залог — один месячный платёж, срок — шесть месяцев с продлением, коммунальные по счётчикам. Подпишем, когда будешь готов{a}.','Here is the draft: {rent} euros a month, a deposit of one month’s payment, a six-month term with renewal, utilities by meter. We will sign when you are ready.'],rent),{message:true}),
    AM('Сверь опись мебели и регистрацию проживания. Деньги переводи только после подписи и только сам{a}.','Check the furniture inventory and the residence registration. Transfer money only after signing, and only yourself.')
  ],null,{time:'12:50',choices:signChoices});
  finish('flat_questions',[
    P('Кто помогает с регистрацией проживания? И что будет, если я решу съехать раньше?','Who helps with the residence registration? And what happens if I decide to move out earlier?'),
    H('Данные для регистрации я передам и подпишу, что нужно. Выехать раньше можно: предупреди за месяц, и разойдёмся без претензий.','I will pass on the data and sign what is needed for the registration. You can leave earlier: give a month’s notice and we part without complaints.'),
    A('Хорошие ответы. Главное, чтобы всё это было написано в договоре, а не только сказано.','Good answers. What matters is that all of it is written in the lease, not only said aloud.')
  ],null,{time:'12:55',choices:signChoices.filter(c=>c.next!=='flat_questions')});
  finish('flat_signed',[
    N('Ручка тяжёлая, как будто знает, что подпись останется надолго. Я подписываю оба экземпляра и отдаю один хозяину.','The pen is heavy, as if it knows the signature will stay for a while. I sign both copies and hand one to the host.'),
    priced('districtHost',(owner,rent)=>fill(['Спасибо. Теперь залог: {rent} евро по реквизитам из договора. Переведи сам{a}, когда будешь готов{a}. Я пока подготовлю опись.','Thank you. Now the deposit: {rent} euros using the details in the lease. Transfer it yourself when you are ready. I will prepare the inventory meanwhile.'],rent)),
    N('Деньги уйдут только после моего нажатия. Я проверяю сумму дважды.','The money leaves only after I tap. I check the amount twice.',{action:tap('Перевести залог самостоятельно','Transfer the deposit myself')})
  ],'flat_move_day',{time:'13:10',journal:['flat_deal'],effectOnEnter:{flatPick:true}});

  // 7. Moving: say goodbye to the temporary room, arrive, settle in.
  finish('flat_move_day',[
    N('Собираюсь минут за двадцать: вещи, которые я недавно разложил{a}, снова ложатся в чемодан. Ключ от временной комнаты кладу на стол.','I pack in about twenty minutes: the things I unpacked not long ago go back into the suitcase. I leave the key to the temporary room on the table.'),
    {speaker:'host',message:true,text:T('«Слышал, что ты нашёл{a} свою квартиру. Поздравляю! Ключ оставь на столе. Заходи, если захочется кофе».','“I heard you found your own flat. Congratulations! Leave the key on the table. Drop by if you fancy a coffee.”'),
      hostText:{dragan:T('«Слышал, что ты нашёл{a} свою квартиру. Поздравляю! Ключ оставь на столе. Заходи, если захочется кофе».','“I heard you found your own flat. Congratulations! Leave the key on the table. Drop by if you fancy a coffee.”'),jelena:T('«Слышала, что ты нашёл{a} свою квартиру. Поздравляю! Ключ оставь на столе. Заходи, если захочется кофе».','“I heard you found your own flat. Congratulations! Leave the key on the table. Drop by if you fancy a coffee.”')}},
    N('Я оставляю на столе чистое бельё и записку с благодарностью.','I leave clean linen on the table and a note of thanks.',{byFlag:{flag:'hostBorrowedTop',text:{true:T('Футболка, которую я одолжил{a}, пока не вернулась. Хороший повод увидеться снова, если захотим оба.','The T-shirt I lent has not come back yet. A good reason to meet again, if we both want to.'),default:T('Я оставляю на столе чистое бельё и записку с благодарностью.','I leave clean linen on the table and a note of thanks.')}}}),
    N('Такси везёт меня через район, который ещё вчера был только названием на карте.','The taxi carries me across a district that was only a name on a map yesterday.',{action:tap('Поехать в новую квартиру','Ride to the new flat')})
  ],'flat_arrive',{bg:'room-window',districtBg:false,districtPortrait:false,location:T('БЕЛГРАД · ПЕРЕЕЗД','BELGRADE · MOVING DAY'),time:'14:30',exitAction:tap('Поехать в новую квартиру','Ride to the new flat')});
  const counterpartLines={
    ana:['Заглянул проверить замок. Он у нас с характером, но я с ним договорился.','I dropped by to check the lock. It has a temper, but we have come to an understanding.'],
    stefan:['Я принесла хлеб и пару фотографий двора для стены. Не понравятся, вернёшь.','I brought bread and a couple of courtyard photographs for the wall. If you do not like them, give them back.'],
    marko:['Я помогала Марко с описью, как и со всеми домами здесь. Если что-то непонятно в договоре, пиши мне.','I helped Marko with the inventory, as I do with every house here. If something in the lease is unclear, write to me.'],
    vuk:['Я помогла Вуку составить опись, как со всеми домами здесь. Если что-то непонятно в договоре, пиши.','I helped Vuk draw up the inventory, as with every house here. If something in the lease is unclear, write to me.']
  };
  finish('flat_arrive',[
    N('Дверь новой квартиры открывается моим ключом. Он тяжелее ключа от временной комнаты.','The door of the new flat opens with my own key. It is heavier than the key to the temporary room.',{portrait:false}),
    H('Вот опись. Пройдём по комнатам: мебель, счётчики, ключи. Если что-то записано неверно, скажи, и исправим.','Here is the inventory. Let us walk through the rooms: furniture, meters, keys. If something is written wrongly, say so and we will correct it.'),
    {speaker:'ownerCounterpart',cameo:true,emotion:'friendly',text:T(...counterpartLines.ana),districtText:Object.fromEntries(Object.entries(counterpartLines).map(([owner,pair])=>[owner,T(...pair)]))},
    AM('Поздравляю с новым адресом! Банк подождёт до вечера, сначала дом.','Congratulations on the new address! The bank can wait until the evening; home comes first.'),
    N('{districtHost} уходит, оставив мне ключи. Квартира впервые полностью моя.','{districtHost} leaves me the keys. The flat is entirely mine for the first time.')
  ],'flat_settle',{time:'15:20',exitAction:tap('Осмотреться в своей квартире','Look around my own flat')});
  finish('flat_settle',[
    N('Чемодан раскрывается на кровати. Рубашки на плечики, документы в верхний ящик, зарядка к розетке у стола.','The suitcase opens on the bed. Shirts onto hangers, documents into the top drawer, the charger to the socket by the desk.'),
    N('Роутер мигает зелёным. Я ввожу пароль, и телефон сообщает, что сеть теперь моя.','The router blinks green. I type the password and the phone says the network is mine now.'),
    N('Над дверью появляется крючок для ключей. Сегодня у моих вещей впервые есть постоянные места.','A hook for keys goes up by the door. Today my things have permanent places for the first time.',{action:{kind:'checklist',label:T('Обустроиться в новой квартире','Settle into the new flat'),items:[T('Разобрать чемодан','Unpack the suitcase'),T('Подключить роутер','Connect the router'),T('Повесить ключ у двери','Hang the key by the door')],effect:{rentalContract:'yes',rentalMoved:true},feedback:T('Теперь это мой дом.','This is my home now.')}})
  ],'bank_plan',{time:'16:00',journal:['flat_home'],bg:'room-window',districtPortrait:false});
}

// Redirects for the new story version: the viewing path replaces the older one-step viewing,
// and the lease beats of days 4, 7 and 8 are skipped once the flat is already rented.
export function housingRedirect(from,target,flags={}){
  if(flags.rentalCast!=='new'||!from||from.startsWith('flat_'))return target;
  if(target==='district_map'&&['viewing_money','viewing_documents','viewing_life'].includes(from))return 'flat_intro';
  if(target==='next_steps'&&from==='morning_ready')return 'flat_decision';
  return target;
}
export const SKIPPED_BEAT_DAYS=[4,7,8];
