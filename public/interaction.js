// Image-relative hit areas stay aligned when artwork fills and crops to the screen.
export function imageHotspotRect(width,height,imageWidth,imageHeight,hotspot){
 const scale=Math.max(width/imageWidth,height/imageHeight);
 const drawnWidth=imageWidth*scale,drawnHeight=imageHeight*scale;
 return {left:(width-drawnWidth)/2+drawnWidth*hotspot.x,top:(height-drawnHeight)/2+drawnHeight*hotspot.y,width:drawnWidth*hotspot.width,height:drawnHeight*hotspot.height};
}
export function mountBaggageInteraction({canvas,image,hotspot,onComplete}){
 const place=()=>{
  if(!image.naturalWidth)return;
  const box=imageHotspotRect(canvas.clientWidth,canvas.clientHeight,image.naturalWidth,image.naturalHeight,{x:.24,y:.53,width:.39,height:.1});
  Object.assign(hotspot.style,Object.fromEntries(Object.entries(box).map(([key,value])=>[key,value+'px'])));
 };
 image.onload=place;
 const observer=new ResizeObserver(place);observer.observe(canvas);
 let completed=false;
 const click=()=>{if(completed)return;completed=true;onComplete();};
 hotspot.addEventListener('click',click);image.src='./assets/baggage-interaction.webp';place();
 return ()=>{observer.disconnect();hotspot.removeEventListener('click',click);image.onload=null;};
}
