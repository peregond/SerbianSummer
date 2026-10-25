// The story is organised as thirty days: from the search for a home to the application for temporary residence
// and the player's own decision to stay or leave. Each day is one chapter.
// Structure follows https://www.srb.guide/ (stages 2-7); real administrative details are checked against
// official sources before being written into a day, and outcomes in the game are fictional.
export const DAYS_TRANSLATIONS={};
const T=(ru,en)=>(DAYS_TRANSLATIONS[ru]=en,ru);
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
 {n:3,id:'day-3',title:'Связь, транспорт, деньги',start:'d3_start',stage:'arrival',status:'skeleton',description:'Местная связь, проездная карта и обмен денег.'},
 {n:4,id:'day-4',title:'Регистрация места пребывания',start:'d4_start',stage:'arrival',status:'skeleton',description:'Подтверждение регистрации и заявление хозяина о жилье.'},
 {n:5,id:'day-5',title:'Сколько у меня дней',start:'d5_start',stage:'clock',status:'skeleton',description:'Срок пребывания без заявления и тридцатый день как дедлайн.'},
 {n:6,id:'day-6',title:'Выбор основания',start:'d6_start',stage:'basis',status:'skeleton',description:'На каком основании просить временное проживание.'},
 {n:7,id:'day-7',title:'Форма дела или работодатель',start:'d7_start',stage:'prepare',status:'skeleton',description:'Форма предпринимательства, письмо работодателю или сравнение маршрутов.'},
 {n:8,id:'day-8',title:'Бухгалтер и налоги',start:'d8_start',stage:'prepare',status:'skeleton',description:'Разговор с Лукой о налогах и о том, когда нужен бухгалтер.'},
 {n:9,id:'day-9',title:'Адрес для заявления',start:'d9_start',stage:'prepare',status:'skeleton',description:'Домашний адрес или коворкинг как подтверждаемый адрес.'},
 {n:10,id:'day-10',title:'Документы из дома',start:'d10_start',stage:'prepare',status:'skeleton',description:'Справки, апостиль и переводы, которые нужно заказать заранее.'},
 {n:11,id:'day-11',title:'Подготовка основания',start:'d11_start',stage:'prepare',status:'skeleton',description:'Сбор данных под выбранное основание.'},
 {n:12,id:'residence',title:'Папка документов',start:'fourth_morning',stage:'filing',status:'written',description:'Жилье, адрес и заявка в банк.'},
 {n:13,id:'day-13',title:'Медицинская страховка',start:'d13_start',stage:'filing',status:'skeleton',description:'Выбор полиса и сохранение договора.'},
 {n:14,id:'day-14',title:'Госуслуги онлайн',start:'d14_start',stage:'filing',status:'skeleton',description:'Регистрация на портале электронных услуг.'},
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

// Playable skeleton days. Each is a short morning-task-evening scene to be expanded into 5-8 scenes later.
// The page kinds below reuse existing text variants: workText (route), contactText (airport person), districtText (owner).
export function extendDays({NODES:N,JOURNAL:J,n,msg,scene}){
 const out=label=>({kind:'tap',label,object:label});
 const owner=(dragan,jelena)=>({speaker:'districtHost',text:dragan,districtText:{dragan,jelena}});
 const contact=(nikola,milica)=>({speaker:'contact',text:milica,contactText:{nikola,milica},emotion:'friendly'});
 const route=(business,employment,explore)=>({speaker:'narrator',text:business,workText:{business,employment,explore}});
 const luka=text=>({speaker:'Лука',character:'luka',emotion:'thoughtful',text});
 const day=(d,bg,time,pages,extra={})=>{
  const meta=dayFor(d),start='d'+d+'_start',close='d'+d+'_end',place='БЕЛГРАД · '+meta.title.toUpperCase();
  const [morning,task,last]=pages;
  N[start]=scene([morning,task],close,{bg,time,location:place,day:'ДЕНЬ '+d,exitAction:out('Продолжить день'),effectOnEnter:{dayDone:d-1},...extra});
  N[close]=scene([last],dayFor(d+1).start,{bg,time:'21:00',location:place,day:'ДЕНЬ '+d,lighting:'night',exitAction:out('Продолжить · День '+(d+1)),journal:['day_'+d],...extra});
  delete N[close].effectOnEnter;
  J['day_'+d]={title:meta.title,tag:'ДЕНЬ '+d+' · '+STAGES[meta.stage].toUpperCase(),text:last.text};
 };
 const note=(ru,en)=>n(T(ru,en));
 day(3,'belgrade-morning-cafe','09:00',[
  note('Город перестаёт быть картой: сегодня мне нужны местная связь, проездная карта и немного динаров.','The city stops being a map: today I need local mobile service, a transport card and a little cash.'),
  note('Я сравниваю тарифы без спешки, пополняю карту проезда и меняю часть денег в обменнике. Курс проверяю до обмена, а чек оставляю.','I compare plans without rushing, top up a transport card and change some money at an exchange office. I check the rate before changing and keep the receipt.'),
  note('К вечеру телефон работает, карта пополнена, а дорога до дома занимает на пять минут меньше.','By evening the phone works, the card is topped up, and the way home takes five minutes less.')]);
 day(4,'document-desk','09:00',[
  note('Утром я перечитываю заметки: место пребывания нужно зарегистрировать в первые сутки после въезда, и проверить это лучше сразу.','In the morning I reread my notes: a place of stay has to be registered within the first day after entry, and it is better to check at once.'),
  note('Я спрашиваю у {host.dative}, оформлена ли регистрация и где лежит подтверждение. Заодно прошу письменное заявление хозяина о жилье: оно пригодится для заявления на проживание. Форму и сроки я проверяю по официальным источникам.','I ask {host} whether the registration is done and where the confirmation is kept. I also ask for the host’s written statement about the housing, which I will need for the residence application. I check the form and deadlines against official sources.'),
  note('Копия подтверждения лежит в папке. Скучная бумага оказывается самой спокойной частью дня.','A copy of the confirmation is in the folder. The dull paper turns out to be the calmest part of the day.')]);
 day(5,'document-desk','09:00',[
  note('Сегодня я считаю то, что раньше только чувствовал{a}: сколько дней я могу находиться в стране без заявления.','Today I count what I used to only feel: how many days I may stay in the country without an application.'),
  note('Срок зависит от гражданства, поэтому я проверяю его в официальном калькуляторе, а не по чужим рассказам. В этой истории мой срок заканчивается на тридцатый день. О поездке через границу, которая обновляет срок, я слышал{a}, но не хочу строить на ней план.','The period depends on citizenship, so I check it in the official calculator rather than in other people’s stories. In this story my period ends on day thirty. I have heard of a border trip that renews the period, but I do not want to build a plan on it.'),
  note('Тридцатый день отмечен в календаре. Это не приговор, а дедлайн, и его можно спланировать.','Day thirty is marked in the calendar. It is not a sentence, but a deadline, and a deadline can be planned for.')]);
 day(6,'workshop-office','10:00',[
  note('Главный вопрос недели: на каком основании я прошу временное проживание. От ответа зависит весь список документов.','The main question of the week: on what basis do I ask for temporary residence? The whole list of documents depends on the answer.'),
  route(T('Мой путь — своё дело. Я записываю, что понадобится для регистрации предпринимателя и как подтвердить, что дело действует.','My route is my own business. I write down what registration needs and how to show that the business really operates.'),T('Мой путь — работа по договору. Мне понадобятся работодатель и подтверждение образования, а значит, и время на признание диплома.','My route is a work contract. I will need an employer and proof of my education, which means time to have the diploma recognised.'),T('Я ещё сравниваю маршруты: работа, своё дело, недвижимость, семья, учёба. Не все мне подходят, и это нормально: я ищу то, что могу честно подтвердить.','I am still comparing routes: employment, my own business, property, family, study. Not all of them suit me, and that is fine: I am looking for what I can honestly prove.')),
  note('Основание — не мечта, а рабочая рамка. С ней список дел наконец перестаёт быть тревожным.','A basis is not a dream but a working frame. With it, the to-do list at last stops being anxious.')]);
 day(7,'document-desk','09:30',[
  note('Сегодня я перехожу от «что я хочу» к «как это оформить».','Today I move from “what I want” to “how it gets arranged”.'),
  route(T('Я сравниваю формы для малого дела: паушальный режим, режим с книгой учёта и общество с ограниченной ответственностью. Выбираю по своим доходам, а не по чужому совету.','I compare forms for a small business: the flat-rate regime, the bookkeeping regime and a limited company. I choose by my own income, not by someone else’s advice.'),T('Я пишу работодателю: кто я, какие документы мне нужны от компании и сколько займёт оформление. Прошу прислать проект договора и подтверждение условий заранее.','I write to the employer: who I am, which documents I need from the company and how long the paperwork takes. I ask for a draft contract and confirmation of the terms in advance.'),T('Я составляю таблицу для трёх маршрутов: что нужно, сколько стоит, сколько времени займёт. Пустые клетки превращаются в вопросы.','I build a table for three routes: what is needed, what it costs, how long it takes. Empty cells turn into questions.')),
  note('К вечеру в блокноте один ясный следующий шаг, а не три размытых.','By evening my notebook holds one clear next step instead of three blurred ones.')]);
 day(8,'workshop-office','11:00',[
  note('С Лукой мы встречаемся в его кабинете. Он не торопит и сразу говорит, что бухгалтер нужен не всем.','I meet Luka in his office. He does not hurry me, and he says at once that not everyone needs an accountant.'),
  luka(T('При паушальном режиме налог считают проще, и бухгалтер нужен не всегда. Но договариваться о правилах лучше до первого дохода, а не после.','Under the flat-rate regime the tax is simpler to calculate, and an accountant is not always needed. But it is better to agree on the rules before the first income, not after.')),
  note('Я записываю три вопроса к официальным источникам. Простота налога — не повод не читать правила.','I write down three questions for the official sources. A simple tax is no reason not to read the rules.')],{character:'luka'});
 day(9,'document-desk','09:30',[
  note('Для дела и для заявления нужен адрес, который можно подтвердить.','For the business and for the application I need an address that can be confirmed.'),
  note('Я проверяю, можно ли использовать адрес нашей квартиры: что говорит договор и согласен ли хозяин. Если нет, смотрю коворкинг, где можно оформить юридический адрес.','I check whether the address of our flat can be used: what the lease says and whether the owner agrees. If not, I look at a coworking space that offers a legal address.'),
  note('У меня два варианта и один вопрос хозяину. Остальное подождёт до завтра.','I have two options and one question for the owner. The rest can wait until tomorrow.')],{districtBg:true});
 day(10,'document-desk','10:00',[
  note('Часть бумаг можно получить только дома: справки, нотариальные документы, апостиль.','Some papers can only be obtained at home: certificates, notarised documents, an apostille.'),
  note('Я составляю список: какие документы нужны, какие требуют апостиля и какие должен переводить судебный переводчик. Заказываю то, что можно запросить удалённо, и записываю сроки.','I make a list: which documents are needed, which need an apostille and which must be translated by a court translator. I order what can be requested remotely and note the lead times.'),
  note('Бюрократия неожиданно приятна, когда она — таблица со столбцом «срок».','Bureaucracy is oddly pleasant when it is a table with a “deadline” column.')]);
 day(11,'document-desk','09:30',[
  note('Подготовка — самый невидимый и самый нужный день.','Preparation is the most invisible and most necessary day.'),
  route(T('Я собираю данные для регистрации предпринимателя: адрес, вид деятельности, паспорт, подтверждения. Сама регистрация — отдельный день, сегодня только подготовка.','I gather the details for registering as an entrepreneur: address, line of business, passport, supporting papers. The registration itself is a separate day; today is only preparation.'),T('Я прошу у работодателя проект договора и проверяю, чего не хватает: диплом требует признания, документы — перевода.','I ask the employer for a draft contract and check what is missing: the diploma needs recognition, the papers need translation.'),T('Я выбираю основание для второго шага и записываю условия. Это не отказ от других путей, а способ сравнить цены, сроки и риски.','I pick a basis for the second step and write down its conditions. It is not giving up the other routes but a way to compare costs, timing and risks.')),
  note('Папка стала толще. Мне спокойнее, когда она растёт по плану.','The folder has grown thicker. I feel calmer when it grows according to plan.')]);
 day(13,'registry-lobby','10:00',[
  note('Для заявления мне пригодится подтверждение, что на лечение хватит средств или что у меня есть полис. Я выбираю полис, потому что хочу спокойствия.','For the application I will need proof that I can pay for treatment or that I hold a policy. I choose a policy because I want peace of mind.'),
  note('Я сравниваю частные полисы: покрытие, срок, цена, язык поддержки. Выбираю тот, чьи условия могу объяснить своими словами, и сохраняю договор.','I compare private policies: coverage, term, price, support language. I choose the one whose terms I can explain in my own words and save the contract.'),
  note('Полис оплачен. Теперь, если станет плохо, у меня есть номер, по которому звонят.','The policy is paid. Now, if I feel ill, I have a number to call.')]);
 day(14,'document-desk','09:30',[
  note('Многое можно подать онлайн, но сначала нужен вход в государственный портал.','A lot can be filed online, but first I need to get into the government portal.'),
  note('Я регистрируюсь на портале электронных услуг, настраиваю доступ и проверяю, что данные совпадают с паспортом. Пароли храню не в заметке с названием «пароли».','I register on the e-government portal, set up access and check that my details match my passport. I keep passwords somewhere other than a note called “passwords”.'),
  note('Вход работает. Страница выглядит скучно, но это ворота к заявлению.','Sign-in works. The page looks dull, but it is the gateway to the application.')]);
 day(17,'document-desk','09:30',[
  note('После подачи наступает странная пауза: заявление принято, но ответа ещё нет.','After filing there is a strange pause: the application has been accepted, but there is no answer yet.'),
  note('Я сохраняю квитанцию об оплате пошлины и подтверждение подачи, отмечаю дату и записываю, как проверять статус. Ожидание — не обещание результата.','I save the receipt for the fee and the confirmation of filing, note the date and write down how to check the status. Waiting is not a promise of a result.'),
  note('Я не отменяю жизнь на время ожидания: слишком много города ещё не посмотрено.','I do not cancel my life while waiting: too much of the city is still unseen.')]);
 day(18,'workshop-office','10:00',[
  note('Заявление подано, а работа не ждёт.','The application is filed, and work does not wait.'),
  route(T('Я публикую первое предложение для клиентов и назначаю созвон. Пока дело не приносит денег, но оно уже существует.','I publish my first offer to clients and book a call. The business earns nothing yet, but it exists.'),T('Я прихожу на первый рабочий день: знакомлюсь с командой и записываю, что нужно знать о должности.','I arrive for my first working day: I meet the team and note what I need to know about the role.'),T('Я встречаюсь с двумя людьми из моей сферы и записываю, что действительно открывает двери.','I meet two people from my field and write down what really opens doors.')),
  note('К вечеру усталость хорошая, как после первого настоящего дня.','By evening the tiredness is good, like after a first real day.')]);
 day(19,'riverside-evening','12:00',[
  contact(T('Выходной. Если у тебя есть время, давай дойдём до реки?','A day off. If you have time, shall we walk to the river?'),T('У меня выходной и блокнот. Если у тебя есть время, давай просто посидим у воды?','I have a day off and a notebook. If you have time, shall we just sit by the water?')),
  note('Мы идём без плана, и впервые город рассказывает не маршрутом, а чужими историями.','We walk with no plan, and for the first time the city speaks not through a route but through other people’s stories.'),
  note('Я возвращаюсь с лёгким чувством, что здесь есть человек, с которым не нужно ничего решать.','I come back with a light feeling that there is someone here with whom nothing has to be decided.')],{companionPortrait:true});
 day(20,'dorcol-apartment','09:30',[
  owner(T('Договор подходит к концу месяца. Драган предлагает поговорить заранее.','The lease is nearing the end of the month. Dragan suggests talking in advance.'),T('Договор подходит к концу месяца. Йелена предлагает поговорить заранее.','The lease is nearing the end of the month. Jelena suggests talking in advance.')),
  note('Мы пьём кофе на кухне и считаем: сколько мне ещё остаться, что менять в условиях и какой срок уведомления нужен.','We drink coffee in the kitchen and count: how much longer I might stay, what to change in the terms and what notice period is needed.'),
  note('Решения нет, но разговор уже снял половину тревоги.','There is no decision, but the conversation has already lifted half of the worry.')],{districtBg:true,districtPortrait:true});
 day(22,'belgrade-morning-cafe','09:30',[
  msg(T('Ася','Asya'),T('«Двор выглядит так, будто там ничего не было. Фото прикладываю как доказательство».','‘The courtyard looks as if nothing happened there. I attach a photo as proof.’')),
  note('Мы договариваемся о следующем показе. Я замечаю, что в календаре уже есть повторяющаяся запись «двор».','We agree on the next screening. I notice that my calendar already has a recurring entry called “courtyard”.'),
  note('Это мелочь, но с неё начинается ощущение, что у меня есть собственное расписание.','It is a small thing, but it is where the feeling of having my own schedule begins.')]);
 day(23,'room-window','19:00',[
  note('Дом присылает подробное письмо: обычные новости и осторожный вопрос о планах.','Home sends a long letter: ordinary news and a careful question about my plans.'),
  note('Я пишу ответ честно: что здесь получилось, чего не хватает и что ещё не решено. Не спешу отправлять — сначала перечитываю.','I write an honest reply: what has worked here, what is missing and what is still undecided. I do not rush to send it; first I reread it.'),
  note('Некоторые вопросы нельзя закрыть быстро. Но их можно перестать бояться.','Some questions cannot be closed quickly. But they can stop being frightening.')]);
 day(24,'document-desk','10:00',[
  note('Месяц почти закончился. Пора посмотреть на цифры без драмы.','The month is nearly over. Time to look at the numbers without drama.'),
  note('Я сравниваю расходы с доходами: аренда, связь, питание, страховка, налоги и неожиданные траты. Оставляю отдельную строку на случай быстрого отъезда.','I compare spending with income: rent, phone, food, insurance, taxes and unexpected costs. I leave a separate line in case I have to leave quickly.'),
  note('Цифры не ругаются. Они просто показывают, что реально, а что пока желание.','The numbers do not scold. They just show what is real and what is still a wish.')]);
 day(25,'belgrade-morning-cafe','10:00',[
  note('Сегодня ничего не нужно сдавать. Это тоже день.','Nothing has to be handed in today. That is also a day.'),
  note('Я хожу в булочную, где меня узнают, заглядываю на рынок и выбираю маршрут без карты. Сербские слова, которые я учил{a}, начинают складываться во фразы.','I go to the bakery where they recognise me, look into the market and choose a route without a map. The Serbian words I have been learning begin to form sentences.'),
  note('Если это рутина, то она мне нравится.','If this is routine, I like it.')]);
 day(26,'document-desk','09:30',[
  note('До тридцатого дня остаётся мало времени, а ответа по заявлению нет.','There is little time left before day thirty, and there is no answer to my application.'),
  note('Я составляю два плана. Первый: ответ приходит вовремя. Второй: ответа нет, и я заранее знаю, где проверить статус и как оформить отъезд, чтобы не нарушить правила. Я не принимаю решение за ответ, но готовлюсь к обоим.','I draw up two plans. The first: the answer arrives in time. The second: it does not, and I already know where to check the status and how to leave without breaking the rules. I am not letting the answer decide for me, but I prepare for both.'),
  note('С двумя планами тишина в почте перестаёт быть угрозой.','With two plans, silence in my inbox stops being a threat.')]);
 day(27,'room-window','18:00',[
  note('Обратный билет можно изменить, но условия зависят от тарифа.','The return ticket can be changed, but the conditions depend on the fare.'),
  note('Я проверяю правила обмена и возврата, сравниваю даты и записываю последний день, когда билет можно изменить без больших потерь.','I check the rules for changes and refunds, compare dates and write down the last day on which the ticket can be changed without a large loss.'),
  note('Билет — просто бумага с датой, а дата — просто число. Выбор по-прежнему мой.','A ticket is just a paper with a date, and a date is just a number. The choice is still mine.')]);
 day(28,'courtyard-after-film','19:00',[
  note('Накануне решающих дней я встречаюсь с теми, кто стал мне близок, и не прощаюсь ни с кем.','On the eve of the deciding days I meet those who have become close, and I say goodbye to no one.'),
  note('Мы пьём чай во дворе, обсуждаем ерунду и не говорим о выборе. Но каждый по-своему показывает, что мне здесь рады.','We drink tea in the courtyard, talk nonsense and do not speak about the choice. But each shows in their own way that I am welcome here.'),
  note('Я возвращаюсь с ощущением, что решение не будет одиноким, каким бы оно ни оказалось.','I walk back feeling that the decision will not be a lonely one, whatever it turns out to be.')]);
}
