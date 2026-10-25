// The story is organised as thirty days: from the search for a home to the application for temporary residence
// and the player's own decision to stay or leave. Each day is one chapter.
// Structure follows https://www.srb.guide/ (stages 2-7); real administrative details are checked against
// official sources before being written into a day, and outcomes in the game are fictional.
export const DAYS_TRANSLATIONS={};
export const T=(ru,en)=>(DAYS_TRANSLATIONS[ru]=en,ru);
export const STAGES={
 arrival:T('Первые дни','First days'),
 clock:T('Счёт времени','Counting the time'),
 basis:T('Выбор основания','Choosing a basis'),
 prepare:T('Подготовка основания','Preparing the basis'),
 filing:T('Подготовка к подаче','Getting ready to file'),
 submit:T('Подача','Filing'),
 waiting:T('Жизнь в ожидании','Life while waiting'),
 decision:T('Решение','The decision')
};
export const PRELUDE=[
 {id:'prologue',number:'Пролог',title:'Жара на посадке',start:'quick_arrival',description:'Аэропорт, кофе и первое знакомство.'},
 {id:'arrival',number:'День 0',title:'Своя дверь',start:'road_start',description:'Ключи, новый двор и первый вечер.'}
];
// status 'written' = full story already exists (it may be shared with an older chapter); 'skeleton' = playable short day to be expanded.
export const DAYS=[
 {n:1,id:'districts',title:'Район для жизни',start:'morning_start',stage:'arrival',status:'written',description:'Карта Белграда, квартира, первый план по счёту и работе и вечер после.'},
 {n:2,id:'work',title:'Счёт и своё дело',start:'third_morning',stage:'arrival',status:'written',description:'Визит в банк, знакомство с Асей и Лукой, рабочее направление.'},
 {n:3,id:'day-3',title:'Связь, транспорт, деньги',start:'d3_start',stage:'arrival',status:'written',description:'Местная связь, проездная карта и обмен денег.'},
 {n:4,id:'day-4',title:'Регистрация места пребывания',start:'d4_start',stage:'arrival',status:'written',description:'Подтверждение регистрации и заявление хозяина о жилье.'},
 {n:5,id:'day-5',title:'Сколько у меня дней',start:'d5_start',stage:'clock',status:'written',description:'Срок пребывания без заявления и тридцатый день как дедлайн.'},
 {n:6,id:'day-6',title:'Выбор основания',start:'d6_start',stage:'basis',status:'written',description:'На каком основании просить временное проживание.'},
 {n:7,id:'day-7',title:'Форма дела или работодатель',start:'d7_start',stage:'prepare',status:'written',description:'Форма предпринимательства, письмо работодателю или сравнение маршрутов.'},
 {n:8,id:'day-8',title:'Бухгалтер и налоги',start:'d8_start',stage:'prepare',status:'written',description:'Разговор с Лукой о налогах и о том, когда нужен бухгалтер.'},
 {n:9,id:'day-9',title:'Адрес для заявления',start:'d9_start',stage:'prepare',status:'written',description:'Домашний адрес или коворкинг как подтверждаемый адрес.'},
 {n:10,id:'day-10',title:'Документы из дома',start:'d10_start',stage:'prepare',status:'written',description:'Справки, апостиль и переводы, которые нужно заказать заранее.'},
 {n:11,id:'day-11',title:'Подготовка основания',start:'d11_start',stage:'prepare',status:'written',description:'Сбор данных под выбранное основание.'},
 {n:12,id:'residence',title:'Папка документов',start:'fourth_morning',stage:'filing',status:'written',description:'Жилье, адрес и заявка в банк.'},
 {n:13,id:'day-13',title:'Медицинская страховка',start:'d13_start',stage:'filing',status:'written',description:'Выбор полиса и сохранение договора.'},
 {n:14,id:'day-14',title:'Госуслуги онлайн',start:'d14_start',stage:'filing',status:'written',description:'Регистрация на портале электронных услуг.'},
 {n:15,id:'filing',title:'Ответ банка и подача',start:'bank_approved',stage:'submit',status:'written',description:'Ответ банка, итог рабочего маршрута и заявление.'},
 {n:16,id:'after-filing',title:'Вечер после подачи',start:'document_evening',stage:'submit',status:'written',description:'Вечер с близкими людьми после подачи документов.'},
 {n:17,id:'day-17',title:'Квитанция и ожидание',start:'d17_start',stage:'waiting',status:'skeleton',description:'Сохранённые подтверждения и честное ожидание ответа.'},
 {n:18,id:'day-18',title:'Первый рабочий шаг',start:'d18_start',stage:'waiting',status:'skeleton',description:'Первые клиенты, первый рабочий день или две встречи.'},
 {n:19,id:'day-19',title:'День без дел',start:'d19_start',stage:'waiting',status:'skeleton',description:'Прогулка с человеком из аэропорта без планов.'},
 {n:20,id:'day-20',title:'Разговор о договоре',start:'d20_start',stage:'waiting',status:'skeleton',description:'Сколько ещё оставаться в квартире и какие условия менять.'},
 {n:21,id:'courtyard',title:'Свет во дворе',start:'courtyard_invite',stage:'waiting',status:'written',description:'Дворовой кинопоказ, близкие люди и планы на будущее.'},
 {n:22,id:'day-22',title:'Утро после кино',start:'d22_start',stage:'waiting',status:'skeleton',description:'Сообщения от Аси и Луки и первая повторяющаяся запись в календаре.'},
 {n:23,id:'day-23',title:'Письмо из дома',start:'d23_start',stage:'waiting',status:'skeleton',description:'Честный ответ домой о том, что получилось и что нет.'},
 {n:24,id:'day-24',title:'Бюджет месяца',start:'d24_start',stage:'waiting',status:'skeleton',description:'Расходы, доходы и запас на быстрый отъезд.'},
 {n:25,id:'day-25',title:'Обычный день',start:'d25_start',stage:'waiting',status:'skeleton',description:'День без дел и бумаг: булочная, рынок и язык.'},
 {n:26,id:'day-26',title:'Если ответа не будет',start:'d26_start',stage:'decision',status:'skeleton',description:'Два плана на случай, если ответ придёт или не придёт вовремя.'},
 {n:27,id:'day-27',title:'Билет',start:'d27_start',stage:'decision',status:'skeleton',description:'Условия обратного билета и последняя дата, когда его можно менять.'},
 {n:28,id:'day-28',title:'Люди, которые рядом',start:'d28_start',stage:'decision',status:'skeleton',description:'Встреча во дворе без разговора о выборе.'},
 {n:29,id:'decision',title:'Что я хочу сохранить',start:'decision_morning',stage:'decision',status:'written',description:'Три бумаги на столе и вопрос, что для меня важнее всего.'},
 {n:30,id:'answer',title:'Ответ на лето',start:'decision_plan',stage:'decision',status:'written',description:'Последний вечер и ваше решение: остаться, уехать или вернуться по плану.'}
];
const EN={
 1:['A District for Living','Belgrade’s map, a flat, a first plan for the account and work, and an evening afterwards.'],
 2:['An Account and My Own Work','A visit to the bank, meeting Asya and Luka, a working direction.'],
 3:['Phone, Transport, Money','Local mobile service, a transport card and changing money.'],
 4:['Registering My Address','Confirmation of registration and the owner’s statement about the housing.'],
 5:['How Many Days I Have','The stay allowed without an application, and day thirty as a deadline.'],
 6:['Choosing a Basis','On what basis to ask for temporary residence.'],
 7:['A Business Form or an Employer','A business form, a letter to an employer or a comparison of routes.'],
 8:['The Accountant and Taxes','A talk with Luka about taxes and when an accountant is needed.'],
 9:['An Address for the Application','A home address or a coworking space as an address that can be confirmed.'],
 10:['Documents from Home','Certificates, apostilles and translations to order in advance.'],
 11:['Preparing the Basis','Gathering details for the chosen basis.'],
 12:['The Document Folder','Housing, address and a request to the bank.'],
 13:['Health Insurance','Choosing a policy and saving the contract.'],
 14:['Government Services Online','Registering on the e-government portal.'],
 15:['The Bank’s Answer and Filing','The bank’s answer, the result of the work route and the application.'],
 16:['The Evening After Filing','An evening with people close to me after filing.'],
 17:['The Receipt and the Wait','Saved confirmations and an honest wait for an answer.'],
 18:['A First Working Step','First clients, a first working day or two meetings.'],
 19:['A Day Off','A walk with the person from the airport, with no plans.'],
 20:['A Talk About the Lease','How much longer to stay in the flat and which terms to change.'],
 21:['Light in the Courtyard','A courtyard screening, people close to me and plans for the future.'],
 22:['The Morning After the Film','Messages from Asya and Luka and a first recurring calendar entry.'],
 23:['A Letter from Home','An honest reply home about what worked and what did not.'],
 24:['The Month’s Budget','Spending, income and a reserve for a quick departure.'],
 25:['An Ordinary Day','A day without errands or papers: the bakery, the market and the language.'],
 26:['If No Answer Comes','Two plans: the answer arrives in time, or it does not.'],
 27:['The Ticket','The conditions of the return ticket and the last date it can be changed.'],
 28:['The People Nearby','A meeting in the courtyard without talking about the choice.'],
 29:['What I Want to Keep','Three papers on the table and the question of what matters most.'],
 30:['An Answer for the Summer','A last evening and your decision: stay, leave or return by a plan.']
};
for(const d of DAYS){const [title,description]=EN[d.n];T(d.title,title);T(d.description,description);T('День '+d.n,'Day '+d.n);T('День '+d.n+' · '+d.title,'Day '+d.n+' · '+title);T('ДЕНЬ '+d.n,'DAY '+d.n);T('Продолжить · День '+d.n,'Continue · Day '+d.n);T('БЕЛГРАД · '+d.title.toUpperCase(),'BELGRADE · '+title.toUpperCase());T('ДЕНЬ '+d.n+' · '+STAGES[d.stage].toUpperCase(),'DAY '+d.n+' · '+DAYS_TRANSLATIONS[STAGES[d.stage]].toUpperCase());}
T('День 0','Day 0');T('День 0 · Своя дверь','Day 0 · My Own Door');
export const dayFor=n=>DAYS.find(d=>d.n===n);

// Playable skeleton days. Each is a short morning-task-evening story to be expanded into 5-8 scenes later.
// Every day has two speaking people of different genders: Asya and Luka, the airport person and their counterpart
// (Nikola/Milica), or the flat's owner and their counterpart (Dragan/Jelena). The counterparts are always the other gender.
// Variants reuse workText (route), contactText (keyed by the airport person) and districtText (keyed by the owner).
export function castHelpers(n){
 const A=(ru,en,emotion='friendly')=>({speaker:'Ася',character:'asya',emotion,text:T(ru,en)});
 const L=(ru,en,emotion='friendly')=>({speaker:'Лука',character:'luka',emotion,text:T(ru,en)});
 // Airport person (variants keyed by the companion) and the other airport person: always the other gender.
 const contact=(nikola,milica,extra={})=>({speaker:'contact',cameo:true,emotion:'friendly',text:T(...milica),contactText:{nikola:T(...nikola),milica:T(...milica)},...extra});
 const counter=(whenNikola,whenMilica,extra={})=>({speaker:'contactCounterpart',cameo:true,emotion:'friendly',text:T(...whenMilica),contactText:{nikola:T(...whenNikola),milica:T(...whenMilica)},...extra});
 // Owner of the flat (variants keyed by the owner) and the other host: always the other gender.
 const owner=(dragan,jelena,extra={})=>({speaker:'districtHost',cameo:true,emotion:'friendly',text:T(...dragan),districtText:{dragan:T(...dragan),jelena:T(...jelena)},...extra});
 const neighbour=(whenDragan,whenJelena,extra={})=>({speaker:'ownerCounterpart',cameo:true,emotion:'friendly',text:T(...whenDragan),districtText:{dragan:T(...whenDragan),jelena:T(...whenJelena)},...extra});
 const route=(business,employment,explore)=>({speaker:'narrator',text:business,workText:{business,employment,explore}});
 const note=(ru,en)=>n(T(ru,en));
 return {A,L,contact,counter,owner,neighbour,route,note};
}
export function extendDays({NODES:N,JOURNAL:J,n,scene}){
 const out=label=>({kind:'tap',label,object:label});
 const {A,L,contact,counter,owner,neighbour,route,note}=castHelpers(n);
 const AM=(ru,en)=>({...A(ru,en),message:true}),LM=(ru,en)=>({...L(ru,en),message:true});
 // The last two pages open the evening scene; the rest belong to the morning scene.
 const day=(d,bg,time,pages,extra={})=>{
  const meta=dayFor(d),start='d'+d+'_start',close='d'+d+'_end',place='БЕЛГРАД · '+meta.title.toUpperCase();
  const last=pages[pages.length-1];
  N[start]=scene(pages.slice(0,-2),close,{bg,time,location:place,day:'ДЕНЬ '+d,exitAction:out('Продолжить день'),effectOnEnter:{dayDone:d-1},...extra});
  N[close]=scene(pages.slice(-2),dayFor(d+1).start,{bg,time:'21:00',location:place,day:'ДЕНЬ '+d,lighting:'night',exitAction:out('Продолжить · День '+(d+1)),journal:['day_'+d],...extra});
  J['day_'+d]={title:meta.title,tag:'ДЕНЬ '+d+' · '+STAGES[meta.stage].toUpperCase(),text:last.text};
 };
 day(17,'dorcol-apartment','09:30',[
  note('После подачи наступает странная пауза: заявление принято, но ответа ещё нет.','After filing there is a strange pause: the application has been accepted, but there is no answer yet.'),
  note('Я сохраняю квитанцию об оплате пошлины и подтверждение подачи, отмечаю дату и записываю, как проверять статус. Ожидание — не обещание результата.','I save the receipt for the fee and the confirmation of filing, note the date and write down how to check the status. Waiting is not a promise of a result.'),
  owner(['Если на адрес придёт письмо, я сразу сфотографирую его и пришлю.','If a letter arrives at the address, I will photograph it at once and send it to you.'],['Если на адрес придёт письмо, я сразу сфотографирую его и пришлю.','If a letter arrives at the address, I will photograph it at once and send it to you.']),
  neighbour(['Не переживай: ожидание — не повод останавливать жизнь. Заходи на ужин.','Do not worry: waiting is no reason to stop living. Come over for dinner.'],['Не переживай: ожидание — не повод останавливать жизнь. Заходи на ужин.','Do not worry: waiting is no reason to stop living. Come over for dinner.']),
  note('Я не отменяю жизнь на время ожидания: слишком много города ещё не посмотрено.','I do not cancel my life while waiting: too much of the city is still unseen.')],{districtBg:true});
 day(18,'workshop-office','10:00',[
  note('Заявление подано, а работа не ждёт.','The application is filed, and work does not wait.'),
  route(T('Я публикую первое предложение для клиентов и назначаю созвон. Пока дело не приносит денег, но оно уже существует.','I publish my first offer to clients and book a call. The business earns nothing yet, but it exists.'),T('Я прихожу на первый рабочий день: знакомлюсь с командой и записываю, что нужно знать о должности.','I arrive for my first working day: I meet the team and note what I need to know about the role.'),T('Я встречаюсь с двумя людьми из моей сферы и записываю, что действительно открывает двери.','I meet two people from my field and write down what really opens doors.')),
  A('Первый клиент всегда спрашивает больше, чем нужно. Это нормально.','The first client always asks for more than they need. That is normal.','laughing'),
  L('Запиши условия до начала работы. Потом спорить не придётся.','Write the terms down before work begins. You will not have to argue later.','thoughtful'),
  note('К вечеру усталость хорошая, как после первого настоящего дня.','By evening the tiredness is good, like after a first real day.')]);
 day(19,'riverside-evening','12:00',[
  contact(['Выходной. Если у тебя есть время, давай дойдём до реки?','A day off. If you have time, shall we walk to the river?'],['У меня выходной и блокнот. Если у тебя есть время, давай просто посидим у воды?','I have a day off and a notebook. If you have time, shall we just sit by the water?'],{message:true}),
  note('Мы идём без плана, и впервые город рассказывает не маршрутом, а чужими историями.','We walk with no plan, and for the first time the city speaks not through a route but through other people’s stories.'),
  counter(['Слышала, вы были у реки. Завидую: я весь день сижу с блокнотом.','I heard you were by the river. I envy you: I am stuck with my notebook all day.'],['Слышал, вы были у реки. Завидую: я весь день у печи.','I heard you were by the river. I envy you: I am by the oven all day.'],{message:true}),
  note('Я возвращаюсь с лёгким чувством, что здесь есть человек, с которым не нужно ничего решать.','I come back with a light feeling that there is someone here with whom nothing has to be decided.')],{companionPortrait:true});
 day(20,'dorcol-apartment','09:30',[
  owner(['Договор подходит к концу месяца. Давай поговорим заранее: мне важно знать твои планы.','The lease is nearing the end of the month. Let us talk in advance: I would like to know your plans.'],['Договор подходит к концу месяца. Давай поговорим заранее: мне важно знать твои планы.','The lease is nearing the end of the month. Let us talk in advance: I would like to know your plans.']),
  note('Мы пьём кофе на кухне и считаем: сколько мне ещё остаться, что менять в условиях и какой срок уведомления нужен.','We drink coffee in the kitchen and count: how much longer I might stay, what to change in the terms and what notice period is needed.'),
  neighbour(['Я заходила за солью и невольно услышала. Лучше обсудить срок уведомления сегодня, чем потом.','I came in for salt and overheard. It is better to discuss the notice period today than later.'],['Я заходил за солью и невольно услышал. Лучше обсудить срок уведомления сегодня, чем потом.','I came in for salt and overheard. It is better to discuss the notice period today than later.']),
  note('Решения нет, но разговор уже снял половину тревоги.','There is no decision, but the conversation has already lifted half of the worry.')],{districtBg:true,districtPortrait:true});
 day(22,'belgrade-morning-cafe','09:30',[
  AM('Двор выглядит так, будто там ничего не было. Фото прикладываю как доказательство.','The courtyard looks as if nothing happened there. I attach a photo as proof.'),
  note('Мы договариваемся о следующем показе. Я замечаю, что в календаре уже есть повторяющаяся запись «двор».','We agree on the next screening. I notice that my calendar already has a recurring entry called “courtyard”.'),
  LM('Спасибо за помощь с экраном. В следующий раз берём больше стульев.','Thank you for helping with the screen. Next time we take more chairs.'),
  note('Это мелочь, но с неё начинается ощущение, что у меня есть собственное расписание.','It is a small thing, but it is where the feeling of having my own schedule begins.')]);
 day(23,'room-window','19:00',[
  note('Дом присылает подробное письмо: обычные новости и осторожный вопрос о планах.','Home sends a long letter: ordinary news and a careful question about my plans.'),
  note('Я пишу ответ честно: что здесь получилось, чего не хватает и что ещё не решено. Не спешу отправлять — сначала перечитываю.','I write an honest reply: what has worked here, what is missing and what is still undecided. I do not rush to send it; first I reread it.'),
  contact(['Письмо домой лучше отправлять вечером, когда уже не хочется править каждое слово.','Send a letter home in the evening, when you no longer want to edit every word.'],['Письмо домой лучше отправлять вечером, когда уже не хочется править каждое слово.','Send a letter home in the evening, when you no longer want to edit every word.'],{message:true}),
  counter(['Добавь одну фразу о том, что тебе здесь нравится. Так тебя услышат лучше.','Add one sentence about what you like here. They will hear you better that way.'],['Добавь одну фразу о том, что тебе здесь нравится. Так тебя услышат лучше.','Add one sentence about what you like here. They will hear you better that way.'],{message:true}),
  note('Некоторые вопросы нельзя закрыть быстро. Но их можно перестать бояться.','Some questions cannot be closed quickly. But they can stop being frightening.')]);
 day(24,'document-desk','10:00',[
  note('Месяц почти закончился. Пора посмотреть на цифры без драмы.','The month is nearly over. Time to look at the numbers without drama.'),
  note('Я сравниваю расходы с доходами: аренда, связь, питание, страховка, налоги и неожиданные траты. Оставляю отдельную строку на случай быстрого отъезда.','I compare spending with income: rent, phone, food, insurance, taxes and unexpected costs. I leave a separate line in case I have to leave quickly.'),
  L('Резерв на быстрый отъезд — не пессимизм, а спокойствие.','A reserve for a quick departure is not pessimism; it is calm.','thoughtful'),
  A('У меня такой уже второй год. Ни разу не пригодился, и я счастлива.','I have had one for two years now. It has never been needed, and I am happy about that.','laughing'),
  note('Цифры не ругаются. Они просто показывают, что реально, а что пока желание.','The numbers do not scold. They just show what is real and what is still a wish.')]);
 day(25,'belgrade-morning-cafe','10:00',[
  note('Сегодня ничего не нужно сдавать. Это тоже день.','Nothing has to be handed in today. That is also a day.'),
  note('Я хожу в булочную, где меня узнают, заглядываю на рынок и выбираю маршрут без карты. Сербские слова, которые я учил{a}, начинают складываться во фразы.','I go to the bakery where they recognise me, look into the market and choose a route without a map. The Serbian words I have been learning begin to form sentences.'),
  contact(['Если хочешь выучить слова, заходи в булочную в одно и то же время. Продавцы быстро запоминают.','If you want to learn the words, go to the bakery at the same time each day. The sellers remember quickly.'],['Если хочешь выучить слова, заходи в булочную в одно и то же время. Продавцы быстро запоминают.','If you want to learn the words, go to the bakery at the same time each day. The sellers remember quickly.']),
  counter(['На рынке начинай с приветствия по-сербски. Разговор сразу получается теплее.','At the market, begin with a greeting in Serbian. The conversation gets warmer at once.'],['На рынке начинай с приветствия по-сербски. Разговор сразу получается теплее.','At the market, begin with a greeting in Serbian. The conversation gets warmer at once.']),
  note('Если это рутина, то она мне нравится.','If this is routine, I like it.')]);
 day(26,'dorcol-apartment','09:30',[
  note('До тридцатого дня остаётся мало времени, а ответа по заявлению нет.','There is little time left before day thirty, and there is no answer to my application.'),
  note('Я составляю два плана. Первый: ответ приходит вовремя. Второй: ответа нет, и я заранее знаю, где проверить статус и как оформить отъезд, чтобы не нарушить правила. Я не принимаю решение за ответ, но готовлюсь к обоим.','I draw up two plans. The first: the answer arrives in time. The second: it does not, and I already know where to check the status and how to leave without breaking the rules. I am not letting the answer decide for me, but I prepare for both.'),
  owner(['Если придётся уехать раньше срока, скажи заранее. Мы договоримся о залоге.','If you have to leave before the term ends, tell me in advance. We will agree about the deposit.'],['Если придётся уехать раньше срока, скажи заранее. Мы договоримся о залоге.','If you have to leave before the term ends, tell me in advance. We will agree about the deposit.']),
  neighbour(['А если ответ придёт хороший, отметим вместе. Это тоже план.','And if the answer is good, we will celebrate together. That is a plan too.'],['А если ответ придёт хороший, отметим вместе. Это тоже план.','And if the answer is good, we will celebrate together. That is a plan too.']),
  note('С двумя планами тишина в почте перестаёт быть угрозой.','With two plans, silence in my inbox stops being a threat.')],{districtBg:true});
 day(27,'room-window','18:00',[
  note('Обратный билет можно изменить, но условия зависят от тарифа.','The return ticket can be changed, but the conditions depend on the fare.'),
  note('Я проверяю правила обмена и возврата, сравниваю даты и записываю последний день, когда билет можно изменить без больших потерь.','I check the rules for changes and refunds, compare dates and write down the last day on which the ticket can be changed without a large loss.'),
  L('Я проверил: у многих тарифов дату можно сменить за небольшую плату. Это не повод торопиться.','I checked: many fares allow a change of date for a small fee. That is no reason to hurry.','thoughtful'),
  A('Билет — это страховка, а не приговор.','A ticket is insurance, not a sentence.','laughing'),
  note('Билет — просто бумага с датой, а дата — просто число. Выбор по-прежнему мой.','A ticket is just a paper with a date, and a date is just a number. The choice is still mine.')]);
 day(28,'courtyard-after-film','19:00',[
  note('Накануне решающих дней я встречаюсь с теми, кто стал мне близок, и не прощаюсь ни с кем.','On the eve of the deciding days I meet those who have become close, and I say goodbye to no one.'),
  note('Мы пьём чай во дворе, обсуждаем ерунду и не говорим о выборе. Но каждый по-своему показывает, что мне здесь рады.','We drink tea in the courtyard, talk nonsense and do not speak about the choice. But each shows in their own way that I am welcome here.'),
  A('Мы не будем говорить о выборе. Мы будем есть печенье.','We are not going to talk about the choice. We are going to eat biscuits.','laughing'),
  L('Но если захочешь поговорить, стулья уже стоят.','But if you want to talk, the chairs are already out.','friendly'),
  note('Я возвращаюсь с ощущением, что решение не будет одиноким, каким бы оно ни оказалось.','I walk back feeling that the decision will not be a lonely one, whatever it turns out to be.')]);
}

// Written days that already existed get small additions so that two people of different genders appear on every path.
// Pages are only added after the existing ones (or inside the unreleased ending), so saved page indices stay valid.
export function extendCast({NODES:N}){
 const A=(ru,en,message=true)=>({speaker:'Ася',character:'asya',emotion:'friendly',text:T(ru,en),message});
 const L=(ru,en,message=true)=>({speaker:'Лука',character:'luka',emotion:'friendly',text:T(ru,en),message});
 const owner=(dragan,jelena)=>({speaker:'districtHost',cameo:true,emotion:'friendly',text:T(...dragan),districtText:{dragan:T(...dragan),jelena:T(...jelena)}});
 const neighbour=(whenDragan,whenJelena)=>({speaker:'ownerCounterpart',cameo:true,emotion:'friendly',text:T(...whenDragan),districtText:{dragan:T(...whenDragan),jelena:T(...whenJelena)}});
 // Day 1: the owner of the flat and the other host look in while the afternoon plans take shape.
 N.afternoon_invite.pages.push(
  owner(['Ужин сегодня в восемь, если захочешь — присоединяйся.','Dinner is at eight tonight; join us if you like.'],['Ужин сегодня в восемь, если захочешь — присоединяйся.','Dinner is at eight tonight; join us if you like.']),
  neighbour(['Я принесу хлеб из пекарни на углу.','I will bring bread from the bakery on the corner.'],['Я принесу хлеб из пекарни на углу.','I will bring bread from the bakery on the corner.']));
 // Day 12: two friends who have been through the same bank and the same tax questions.
 N.bank_send.pages.push(
  A('Если банк попросит больше бумаг, не пугайся: у меня просили три раза.','If the bank asks for more papers, do not panic: mine asked three times.'),
  L('Когда будет ответ, пришли мне выписку. Сверим условия.','When the answer comes, send me the statement. We will check the terms.'));
 // Day 16 already has Asya; Luka writes in the evening.
 N.chapter_five_close.pages.push(L('Подача — это один шаг, а не вся дорога. Хорошо, что ты не стал{a} ждать до последнего дня.','Filing is one step, not the whole road. It is good that you did not wait for the last day.'));
 // Day 29: both friends write while the choice is being weighed.
 for(const id of ['decision_weigh_work','decision_weigh_people','decision_weigh_home'])N[id].pages.push(
  A('Что бы ты ни выбрал{a}, у двора будет стул для тебя.','Whatever you choose, the courtyard will have a chair for you.'),
  L('Если захочешь пересчитать цифры, я рядом.','If you want to go over the numbers again, I am here.'));
 // Day 30: the endings end with messages from both friends before the closing line.
 const messages=[A('Это не обещание, а стул: он стоит во дворе, пока ты решаешь.','This is not a promise but a chair: it stands in the courtyard while you decide.'),L('Расстояние оказывается меньше, чем кажется. Но это уже не вопрос.','The distance turns out to be shorter than it seems. But that is not a question any more.')];
 for(const id of ['epilogue_stay','epilogue_leave','epilogue_return']){const pages=N[id].pages;pages.splice(pages.length-1,0,...messages);}
}
