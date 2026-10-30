// Volume as taps on a phone: - and + in ten steps instead of a slider (fingers cannot hit a 1% target anyway).
export const LEVELS=10;
const clamp=value=>Math.max(0,Math.min(1,Number(value)));
export const toLevel=value=>Number.isFinite(Number(value))?Math.round(clamp(value)*LEVELS):null;
export const fromLevel=level=>Math.max(0,Math.min(LEVELS,level))/LEVELS;
export const stepLevel=(level,direction)=>Math.max(0,Math.min(LEVELS,level+(direction<0?-1:1)));
// A saved or missing value becomes the nearest step; `fallback` is a 0..1 volume.
export const snapVolume=(value,fallback)=>fromLevel(toLevel(value)??toLevel(fallback)??LEVELS/2);
export function stepperMarkup({id,label,volume}){
 const level=toLevel(volume);
 const bars=Array.from({length:LEVELS},(_,i)=>`<i${i<level?' class="on"':''}></i>`).join('');
 return `<div class="setting stepper-setting"><span>${label}<small id="${id}-level" aria-live="polite">${level} / ${LEVELS}</small></span><div class="stepper" role="group" aria-label="${label}"><button type="button" id="${id}-down" aria-label="Тише"${level<=0?' disabled':''}>−</button><span class="stepper-bars" id="${id}-bars" aria-hidden="true">${bars}</span><button type="button" id="${id}-up" aria-label="Громче"${level>=LEVELS?' disabled':''}>+</button></div></div>`;
}
// Wires the buttons of one stepper; `onChange` gets the new 0..1 volume after every tap.
export function bindStepper(root,{id,volume,onChange}){
 let level=toLevel(volume);
 const down=root.querySelector('#'+id+'-down'),up=root.querySelector('#'+id+'-up'),text=root.querySelector('#'+id+'-level'),bars=root.querySelector('#'+id+'-bars');
 const paint=()=>{
  text.textContent=level+' / '+LEVELS;down.disabled=level<=0;up.disabled=level>=LEVELS;
  [...bars.children].forEach((bar,i)=>bar.classList.toggle('on',i<level));
 };
 const tap=direction=>()=>{const next=stepLevel(level,direction);if(next===level)return;level=next;paint();onChange(fromLevel(level));};
 down.addEventListener('click',tap(-1));up.addEventListener('click',tap(1));
}
