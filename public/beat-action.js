import {t} from './i18n.js?v=0.16.1';
import {appendChoiceContents} from './choice-ui.js?v=0.16.1';
export function drawBeatAction(container,hotspots,action,{text,perform,tones,node,flags}){
  container.replaceChildren();hotspots.replaceChildren();container.hidden=!action||action.kind==='tap';hotspots.hidden=true;
  if(!action||action.kind==='tap')return;
  if(action.kind==='reply'){
    for(const option of action.options){const button=document.createElement('button');button.type='button';button.className='choice';appendChoiceContents(button,option,{text,tones,node,flags});button.addEventListener('click',()=>perform(option));container.append(button);}return;
  }
  if(action.kind==='checklist'){
    const caption=document.createElement('p');caption.className='beat-caption';caption.textContent=t(text(action.label));container.append(caption);
    const list=document.createElement('div');list.className='beat-checklist';const checked=new Set();
    const done=document.createElement('button');done.type='button';done.className='primary beat-complete';done.textContent=t('Готово');done.disabled=true;
    for(const item of action.items){const button=document.createElement('button');button.type='button';button.setAttribute('aria-pressed','false');button.textContent=t('○ '+item);button.addEventListener('click',()=>{if(checked.has(item))checked.delete(item);else checked.add(item);button.setAttribute('aria-pressed',String(checked.has(item)));button.textContent=t((checked.has(item)?'✓ ':'○ ')+item);done.disabled=checked.size!==action.items.length;});list.append(button);}
    done.addEventListener('click',()=>{if(checked.size===action.items.length)perform();});container.append(list,done);return;
  }
}
