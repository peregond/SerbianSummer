import {t} from './i18n.js?v=0.15.4';
import {T} from './flat-data.js?v=1';
export const ROOM_TASKS=[
 {id:'key',label:'Проверить ключ',short:'Ключ',done:'Ключ подходит',bit:1,rect:{x:.14,y:.44,width:.14,height:.065}},
 {id:'phone',label:'Поставить телефон на зарядку',short:'Телефон на зарядку',done:'Телефон заряжается',bit:2,rect:{x:.68,y:.40,width:.23,height:.09}},
 {id:'case',label:'Разобрать чемодан',done:'Чемодан разобран',bit:4,rect:{x:.40,y:.61,width:.49,height:.18}}
];
export const BEDTIME_TASKS=[{id:'phone',label:'Поставить телефон на зарядку',done:'Телефон заряжается',bit:1,rect:{x:.12,y:.42,width:.08,height:.06}},{id:'water',label:'Поставить воду рядом',done:'Вода рядом',bit:2,rect:{x:.17,y:.39,width:.06,height:.05}},{id:'alarm',label:'Поставить будильник',done:'Будильник поставлен',bit:4,rect:{x:.23,y:.39,width:.06,height:.05}}];
export function completeRoomTask(mask,bit){return(mask|bit)&7;}
// Each task is one big button in a bottom sheet over the full-screen room: no tiny hotspots, no second button in the dialogue.
const RESULTS={
 key:T('Ключ идёт в замок мягко и до конца. Теперь дверь точно моя.','The key turns smoothly all the way. The door is mine now.'),
 phone:T('Телефон заряжается. На экране появляется значок молнии.','The phone is charging. A little lightning bolt appears on the screen.'),
 case:T('Рубашки на плечики, мелочи в ящик. Чемодан стоит пустой и больше не просит внимания.','Shirts on hangers, small things in the drawer. The suitcase stands empty and no longer asks for attention.'),
 water:T('Стакан воды стоит у кровати, чтобы не вставать ночью.','A glass of water stands by the bed so I do not have to get up in the night.'),
 alarm:T('Будильник поставлен на утро. Я проверяю время дважды.','The alarm is set for the morning. I check the time twice.')
};
const HEADLINES={arrival:T('Устроиться в комнате','Settle into the room'),bedtime:T('Приготовиться ко сну','Get ready for bed')};
export function mountRoomInteraction(root,{mask=0,onChange,onComplete,onBack,onSettings,canRewind,mode='arrival'}){
 const tasks=mode==='bedtime'?BEDTIME_TASKS:ROOM_TASKS;
 const doc=root.ownerDocument;let done=mask===7?0:mask,finished=false;
 const events=new AbortController();const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
 const el=(tag,cls,text)=>{const n=doc.createElement(tag);n.className=cls;if(text)n.textContent=t(text);return n;};
 root.replaceChildren();const image=el('img','room-art');image.alt=t(mode==='bedtime'?'Приготовиться ко сну':'Комната: ключ на столе, телефон у розетки и открытый чемодан');
 const header=el('header','room-tools');const back=el('button','','← Назад');back.disabled=!canRewind;listen(back,'click',onBack);const settings=el('button','','Настройки');listen(settings,'click',onSettings);header.append(back,settings);
 const heading=el('h2','room-title',HEADLINES[mode]);heading.id='room-interaction-title';
 const status=el('p','room-progress');status.setAttribute('aria-live','polite');
 const sheet=el('div','room-sheet');sheet.setAttribute('role','group');sheet.setAttribute('aria-label',t(HEADLINES[mode]));
 const result=el('p','room-result');result.setAttribute('role','status');sheet.append(result);
 const buttons=tasks.map(task=>{const button=el('button','room-object');button.type='button';button.dataset.task=task.id;sheet.append(button);listen(button,'click',()=>{if(finished||(done&task.bit))return;done=completeRoomTask(done,task.bit);paint(RESULTS[task.id]);if(done===7){finished=true;setTimeout(onComplete,900);}else onChange(done);});return button;});
 const paint=message=>{tasks.forEach((task,i)=>{const checked=!!(done&task.bit);buttons[i].textContent=(checked?'✓ ':'')+t(checked?task.done:task.short??task.label);buttons[i].setAttribute('aria-pressed',String(checked));});result.textContent=message?t(message):'';status.textContent=`${tasks.filter(task=>done&task.bit).length} / 3 · ${t('В любом порядке')}`;};
 root.prepend(image,header,heading,status);root.append(sheet);
 image.src=mode==='bedtime'?'./assets/bedtime-interaction-v1.webp':'./assets/room-settling-v1.webp';paint();
 return()=>{events.abort();};
}
