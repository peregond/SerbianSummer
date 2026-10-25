import {t,html} from './i18n.js?v=0.13.1';
const PEOPLE = {
  luka: { id:'luka', name:'Лука', gender:'male' },
  milica: { id:'milica', name:'Милица', gender:'female' },
  jelena: { id:'jelena', name:'Йелена', gender:'female' },
  asya: { id:'asya', name:'Ася', gender:'female' },
  nikola: { id:'nikola', name:'Никола', gender:'male' },
  dragan: { id:'dragan', name:'Драган', gender:'male' }
};
const LABELS = {
  explore:'Исследовать', romance:'Флирт', friendship:'Дружба',
  dream:'Воображение', practical:'По делу', personal:'О себе'
};
// SVG paths use currentColor so recipients can share the same compact icon system.
const ICONS = {
  explore: [
    ['path',{d:'M2 15 4.5 5h4L10 11h4l1.5-6h4L22 15M10 15h4M7 5V3m10 2V3'}],
    ['circle',{cx:'6.5',cy:'16',r:'4.5'}], ['circle',{cx:'17.5',cy:'16',r:'4.5'}]
  ],
  romance: [['path',{d:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z'}]],
  friendship: [
    ['circle',{cx:'8',cy:'7',r:'3'}], ['circle',{cx:'18',cy:'8',r:'2.5'}],
    ['path',{d:'M2 21v-3a6 6 0 0 1 12 0v3M16 14a5 5 0 0 1 6 5v2'}]
  ],
  practical: [['path',{d:'M12 5v16M3 3h5a5 5 0 0 1 4 2 5 5 0 0 1 4-2h5v16h-5a5 5 0 0 0-4 2 5 5 0 0 0-4-2H3V3Z'}]],
  dream: [
    ['path',{d:'m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z'}],
    ['path',{d:'M20 2v4m-2-2h4'}]
  ],
  personal: [['path',{d:'M21 11a9 9 0 0 1-9 9 10 10 0 0 1-4-.9L3 21l1.8-5A9 9 0 1 1 21 11Z'}]]
};

function person(value) {
  return PEOPLE[value==='nikola-evening'?'nikola':value]??null;
}

function recipientFor(choice,node,flags) {
  // A destination selected by this answer takes priority over the current scene.
  for(const key of ['companion','host','districtOwner','rainWith','chapterFiveWith','eveningWith']){
    const selected=person(choice.effect?.[key]==='companion'?flags.companion:choice.effect?.[key]==='host'?flags.districtOwner:choice.effect?.[key]);
    if(selected)return selected;
  }
  const character=person(node.character);
  if(character)return character;
  if(node.districtPortrait)return person(flags.districtOwner);
  if(node.hostPortrait)return person(flags.host);
  if(node.companionPortrait)return person(flags.companion);
  if(node.portrait)return person(typeof node.portrait==='string'?node.portrait:'milica');
  return null;
}

export function choicePresentation(choice,{text=value=>value,tones={},node={},flags={}}={}) {
  const tone=Object.hasOwn(ICONS,choice.tone)?choice.tone:'personal';
  const category=tones[choice.tone]?.label??LABELS[tone];
  const label=text(choice.label);
  const recipient=recipientFor(choice,node,flags);
  return {
    tone, category, label, recipient:recipient?.id??null,
    recipientName:recipient?.name??null, gender:recipient?.gender??'neutral',
    accessibleLabel:category+(recipient?' · '+recipient.name:'')+': '+label
  };
}

export function appendChoiceContents(button,choice,options={}) {
  const presentation=choicePresentation(choice,options);
  const doc=button.ownerDocument;
  const icon=doc.createElementNS('http://www.w3.org/2000/svg','svg');
  icon.setAttribute('class','choice-icon');
  for(const [key,value]of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.8','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false'}))icon.setAttribute(key,value);
  for(const [tag,attributes]of ICONS[presentation.tone]){
    const shape=doc.createElementNS('http://www.w3.org/2000/svg',tag);
    for(const [key,value]of Object.entries(attributes))shape.setAttribute(key,value);
    icon.append(shape);
  }
  const label=doc.createElement('span');label.className='choice-label';label.textContent=t(presentation.label);
  button.dataset.tone=presentation.tone;
  button.dataset.recipientGender=presentation.gender;
  button.setAttribute('aria-label',t(presentation.accessibleLabel));
  button.setAttribute('title',t(presentation.accessibleLabel));
  button.replaceChildren(icon,label);
  return presentation;
}
