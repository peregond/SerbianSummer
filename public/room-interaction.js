import {t} from './i18n.js?v=0.15.3';
import {imageHotspotRect} from './interaction.js?v=0.15.3';
export const ROOM_TASKS=[
 {id:'key',label:'Проверить ключ',short:'Ключ',done:'Ключ подходит',bit:1,rect:{x:.14,y:.44,width:.14,height:.065}},
 {id:'phone',label:'Поставить телефон на зарядку',short:'Телефон на зарядку',done:'Телефон заряжается',bit:2,rect:{x:.68,y:.40,width:.23,height:.09}},
 {id:'case',label:'Разобрать чемодан',done:'Чемодан разобран',bit:4,rect:{x:.40,y:.61,width:.49,height:.18}}
];
export function completeRoomTask(mask,bit){return(mask|bit)&7;}
export function mountRoomInteraction(root,{mask=0,onChange,onComplete,onBack,onSettings,canRewind}){
 const doc=root.ownerDocument;let done=mask===7?0:mask,finished=false;
 const events=new AbortController();const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
 const el=(tag,cls,text)=>{const n=doc.createElement(tag);n.className=cls;if(text)n.textContent=t(text);return n;};
 root.replaceChildren();const image=el('img','room-art');image.alt=t('Комната: ключ на столе, телефон у розетки и открытый чемодан');
 const header=el('header','room-tools');const back=el('button','','← Назад');back.disabled=!canRewind;listen(back,'click',onBack);const settings=el('button','','Настройки');listen(settings,'click',onSettings);header.append(back,settings);
 const heading=el('h2','room-title','Устроиться в комнате');heading.id='room-interaction-title';
 const status=el('p','room-progress');status.setAttribute('aria-live','polite');
 const buttons=ROOM_TASKS.map(task=>{const button=el('button','room-object');button.type='button';button.setAttribute('aria-label',t(task.label));button.dataset.task=task.id;root.append(button);listen(button,'click',()=>{if(finished||(done&task.bit))return;done=completeRoomTask(done,task.bit);paint();if(done===7){finished=true;onComplete();}else onChange(done);});return button;});
 const paint=()=>{ROOM_TASKS.forEach((task,i)=>{const checked=!!(done&task.bit);buttons[i].textContent=(checked?'✓ ':'')+t(checked?task.done:task.short??task.label);buttons[i].setAttribute('aria-pressed',String(checked));});status.textContent=`${ROOM_TASKS.filter(task=>done&task.bit).length} / 3 · ${t('В любом порядке')}`;};
 const place=()=>{if(!image.naturalWidth)return;ROOM_TASKS.forEach((task,i)=>{const box=imageHotspotRect(root.clientWidth,root.clientHeight,image.naturalWidth,image.naturalHeight,task.rect);Object.assign(buttons[i].style,Object.fromEntries(Object.entries(box).map(([key,value])=>[key,value+'px'])));});};
 listen(image,'load',place);root.prepend(image,header,heading,status);const observer=new ResizeObserver(place);observer.observe(root);image.src='./assets/room-settling-v1.webp';paint();place();
 return()=>{events.abort();observer.disconnect();};
}
