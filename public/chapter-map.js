import {t} from './i18n.js?v=0.15.0';
// Presentation only: unlocks and restart points continue to come from saved chapter marks.
export function drawChapterMap(root,{chapters,source,current,onSelect}){
 const doc=root.ownerDocument;
 const el=(tag,text,cls)=>{const item=doc.createElement(tag);if(text)item.textContent=t(text);if(cls)item.className=cls;return item;};
 root.replaceChildren();
 const hero=el('div','','chapter-map-hero');hero.append(el('p','СЕРБСКОЕ ЛЕТО','eyebrow'),el('h3','Твоё лето в Белграде'),el('p',source?'Каждый день — новая история':'Тридцать дней, которые всё изменят'));
 const intro=el('p',source?'Возвращайся к открытым главам. При переигрывании дальнейшие выборы будут сделаны заново.':'Главы открываются по мере прохождения. Сначала выбери своего персонажа.','chapter-map-hint');hero.append(intro);root.append(hero);
 const route=el('ol','','chapter-route');route.setAttribute('aria-label',t('Маршрут истории'));
 const xs=[33,50,67,50];const step=176;
 const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',`0 0 100 ${chapters.length*step}`);svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('chapter-route-line');
 let d=`M${xs[0]} 40`;for(let i=1;i<chapters.length;i++){const y=(i-1)*step+40;d+=` C${xs[(i-1)%4]} ${y+step*.55} ${xs[i%4]} ${y+step*.45} ${xs[i%4]} ${y+step}`;}
 const path=doc.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',d);path.setAttribute('vector-effect','non-scaling-stroke');svg.append(path);route.append(svg);
 chapters.forEach((chapter,index)=>{
  const unlocked=!!source&&(chapter.id==='prologue'||!!source.chapterMarks?.[chapter.id]);const isCurrent=chapter.id===current?.id;
  const missing=source&&index<chapters.indexOf(current)&&!unlocked;
  const state=isCurrent?'Сейчас':unlocked?'Доступна':missing?'Нет старой точки':'Пока закрыта';
  const row=el('li','','chapter-stop');row.style.setProperty('--stop-x',xs[index%4]+'%');
  const button=el('button','','chapter-level');button.type='button';button.disabled=!unlocked;button.dataset.current=String(isCurrent);button.dataset.chapter=chapter.id;
  if(isCurrent)button.setAttribute('aria-current','step');
  const badge=el('span',chapter.day?String(chapter.day):chapter.id==='prologue'?'✈':'⌂','chapter-level-number');badge.setAttribute('aria-hidden','true');
  const label=el('span','','chapter-level-label');label.append(el('small',chapter.number+' · '+state),el('strong',chapter.title));
  button.title=t(missing?'В старом сохранении нет точки этой главы. Текущую историю можно продолжить.':chapter.description);
  button.setAttribute('aria-label',t(chapter.number)+' · '+t(chapter.title)+' · '+t(state));
  button.append(badge,label);button.addEventListener('click',()=>onSelect(chapter));row.append(button);route.append(row);
 });
 root.append(route,el('p','Твой город. Твои люди. Твой выбор.','chapter-map-finish'));
}
