import {baggageLayout,BAGGAGE_TARGET} from './baggage-model.js?v=1';

// Retained for other artwork-relative hit areas and their existing callers.
export function imageHotspotRect(width,height,imageWidth,imageHeight,hotspot){
 const scale=Math.max(width/imageWidth,height/imageHeight);
 const drawnWidth=imageWidth*scale,drawnHeight=imageHeight*scale;
 return {left:(width-drawnWidth)/2+drawnWidth*hotspot.x,top:(height-drawnHeight)/2+drawnHeight*hotspot.y,width:drawnWidth*hotspot.width,height:drawnHeight*hotspot.height};
}
export function mountBaggageInteraction({canvas,image,board,slot,status,onComplete,text=value=>value,random=Math.random}){
 const doc=canvas.ownerDocument,win=doc.defaultView;
 let phase='searching',disposed=false,flying=null;
 const animations=new Set(),timers=new Set(),listeners=[];
 const later=(fn,ms)=>{const id=win.setTimeout(()=>{timers.delete(id);if(!disposed)fn();},ms);timers.add(id);};
 const animate=(element,frames,options)=>{
  if(!element.animate)return null;
  const animation=element.animate(frames,options);animations.add(animation);return animation;
 };
 const reduced=()=>win.matchMedia('(prefers-reduced-motion: reduce)').matches;
 slot.dataset.found='false';slot.querySelector('[data-baggage-count]').textContent='0/1';
 status.textContent=text('Найди синий чемодан с жёлтой лентой.');
 board.replaceChildren();
 const placeBags=()=>{
  const {width,height}=canvas.getBoundingClientRect();
  if(!width||!height)return;
  const scale=Math.max(width/1024,height/1536),drawnHeight=1536*scale,top=(height-drawnHeight)/2;
  board.querySelectorAll('.baggage-item').forEach((bag,index)=>{
   const positions=[.50,.515,.49,.58,.59,.57];
   bag.style.top=(top+drawnHeight*positions[index])+'px';
   bag.style.height=(drawnHeight*.13)+'px';
  });
 };
 const finish=()=>{
  if(disposed||phase!=='collecting')return;
  flying?.remove();flying=null;phase='found';slot.dataset.found='true';
  slot.querySelector('[data-baggage-count]').textContent='1/1';status.textContent=text('Твой чемодан! Багаж собран.');
  if(!reduced())animate(slot,[{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:280});
  later(()=>{if(phase==='found'){phase='complete';onComplete();}},450);
 };
 for(const item of baggageLayout(random)){
  const button=doc.createElement('button');button.type='button';button.className='baggage-item';
  button.setAttribute('aria-label',text(item.label));button.dataset.baggage=item.id;
  const art=doc.createElement('img');art.alt='';art.draggable=false;art.src='./assets/baggage/'+item.id+'.webp';
  button.append(art);board.append(button);
  const click=()=>{
   if(disposed||phase!=='searching')return;
   if(item.id!==BAGGAGE_TARGET){
    // Clear first so repeated wrong attempts are announced as well.
    status.textContent='';later(()=>{if(phase==='searching')status.textContent=text('Чужой чемодан. Ищу синий, с жёлтой лентой.');},30);
    if(!reduced())animate(button,[{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:240});
    return;
   }
   phase='collecting';board.querySelectorAll('button').forEach(each=>{each.disabled=true;});
   status.textContent=text('Это мой. Забираю!');
   const start=art.getBoundingClientRect(),end=slot.getBoundingClientRect();
   flying=art.cloneNode();flying.className='baggage-flying';
   Object.assign(flying.style,{left:start.left+'px',top:start.top+'px',width:start.width+'px',height:start.height+'px'});
   doc.body.append(flying);button.style.visibility='hidden';
   const dx=end.left+end.width/2-start.left-start.width/2,dy=end.top+end.height/2-start.top-start.height/2;
   const duration=reduced()?0:1050;
   if(duration)animate(flying,[
    {transform:'translate(0,0) scale(1)',opacity:1,offset:0},
    {transform:'translate(0,4px) scale(.92)',opacity:1,offset:.12},
    {transform:`translate(${dx*.1}px,-45px) scale(1.32) rotate(-5deg)`,opacity:1,offset:.36},
    {transform:`translate(${dx*.45}px,${Math.min(-80,dy*.3)}px) scale(.92) rotate(5deg)`,opacity:1,offset:.62},
    {transform:`translate(${dx}px,${dy}px) scale(.12) rotate(0deg)`,opacity:0,offset:1}
   ],{duration,easing:'cubic-bezier(.25,.65,.35,1)',fill:'forwards'});
   later(finish,duration);
  };
  button.addEventListener('click',click);listeners.push([button,click]);
 }
 image.src='./assets/baggage/search-carousel-v2.webp';
 placeBags();win.addEventListener('resize',placeBags);
 const observer=win.ResizeObserver?new win.ResizeObserver(placeBags):null;observer?.observe(canvas);
 return ()=>{
  disposed=true;phase='disposed';timers.forEach(id=>win.clearTimeout(id));animations.forEach(animation=>animation.cancel());
  win.removeEventListener('resize',placeBags);observer?.disconnect();
  listeners.forEach(([button,click])=>button.removeEventListener('click',click));flying?.remove();board.replaceChildren();
 };
}
