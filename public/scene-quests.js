// Full-screen illustrated interactions: the district map and the three-station flat viewing.
// Story progress stays with the caller; these templates only draw, report taps and clean up after themselves.
import {getLanguage,t} from './i18n.js?v=0.15.4';
import {imageHotspotRect} from './interaction.js?v=0.15.4';
import {FLATS,QUEST_STATIONS,hasSeen,DISTRICT_LABEL,T} from './flat-data.js?v=1';

const pick=pair=>getLanguage()==='en'?pair[1]:pair[0];
// Interface strings are registered once at load so tools/merge-translations.mjs can collect them.
const UI=[
  T('Художественная панорама Белграда с рекой, крепостью и храмом Святого Саввы','Painted panorama of Belgrade with the river, the fortress and the Church of Saint Sava'),
  T('Выбери район','Choose a district'),
  T('Нажми на район. Выбор не окончательный: смотреть можно любые варианты.','Tap a district. The choice is not final: you can look at any option.'),
  T('уже смотрели','already seen'),
  T('Осмотр квартиры','Viewing the flat'),
  T('Участки осмотра','Parts of the viewing'),
  T('Закончить осмотр','Finish the viewing'),
  T('Осталось','Left'),
  T('Всё проверено','Everything checked')
];
const MAP_SIZE={width:941,height:1672};
// Where each district sits on the painted panorama (fractions of the picture).
export const MAP_PINS={dorcol:{x:.7,y:.36},vracar:{x:.8,y:.64},newbelgrade:{x:.22,y:.125}};
const make=(doc,tag,className,text)=>{const node=doc.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
function toolbar(doc,{title,canRewind,onBack,onSettings,listen}){
  const header=make(doc,'header','quest-tools');
  const back=make(doc,'button','quest-tool',t('← Назад'));back.type='button';back.disabled=!canRewind;listen(back,'click',onBack);
  const heading=make(doc,'h2','quest-title',title);
  const settings=make(doc,'button','quest-tool',t('Настройки'));settings.type='button';listen(settings,'click',onSettings);
  header.append(back,heading,settings);return {header,heading};
}

export function mountDistrictMap(root,{choices,flags,onChoose,onBack,onSettings,canRewind}){
  const doc=root.ownerDocument;
  const events=new AbortController();const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
  root.replaceChildren();
  const art=make(doc,'img','quest-art map-art');art.alt=t(UI[0]);art.src='./assets/belgrade-chapter-map.webp';
  const {header,heading}=toolbar(doc,{title:t(UI[1]),canRewind,onBack,onSettings,listen});heading.id='scene-quest-title';
  const hint=make(doc,'p','map-hint',t(UI[2]));
  const pins=new Map();
  for(const choice of choices){
    const district=choice.effect?.district;if(!MAP_PINS[district]||pins.has(district))continue;
    const owner=choice.effect.districtOwner;
    const seen=!!(choice.revisit&&hasSeen(flags,owner));
    const button=make(doc,'button','map-pin');button.type='button';button.dataset.district=district;button.dataset.seen=String(seen);
    const name=make(doc,'strong','map-pin-name',pick(DISTRICT_LABEL[district]??[district,district]));
    const ownerLine=OWNER_LINE[owner];
    const meta=make(doc,'small','map-pin-meta',ownerLine?(seen?'✓ ':'')+pick(ownerLine):'');
    button.append(name,meta);
    button.setAttribute('aria-label',pick(DISTRICT_LABEL[district]??[district,district])+(ownerLine?' · '+pick(ownerLine):'')+(seen?' · '+t(UI[3]):''));
    listen(button,'click',()=>onChoose(seen?{...choice,next:choice.revisit}:choice));
    pins.set(district,button);
  }
  const place=()=>{
    const width=root.clientWidth,height=root.clientHeight;
    for(const [district,button]of pins){
      const spot=MAP_PINS[district];const box=imageHotspotRect(width,height,MAP_SIZE.width,MAP_SIZE.height,{x:spot.x,y:spot.y,width:0,height:0});
      const half=button.offsetWidth/2||70;
      button.style.left=Math.max(half+10,Math.min(width-half-10,box.left))+'px';
      button.style.top=Math.max(110,Math.min(height-90,box.top))+'px';
    }
  };
  root.append(art,header,hint,...pins.values());
  const observer=new ResizeObserver(place);observer.observe(root);listen(art,'load',place);requestAnimationFrame(place);
  return ()=>{events.abort();observer.disconnect();};
}
// The people behind the first flat of each district; the original story (Jelena and Dragan) shows its own hosts.
const OWNER_LINE={ana:['Ана · Стефан','Ana · Stefan'],marko:['Марко','Marko'],vuk:['Вук','Vuk'],jelena:['Йелена','Jelena'],dragan:['Драган','Dragan']};

// Hand-drawn vector fallbacks. A painted illustration can replace each one later through STATION_ART.
export const STATION_ART={};
const art={
 water:`<svg viewBox="0 0 320 270" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true"><rect width="320" height="270" fill="#cfe3e6"/><g transform="translate(0,25)"><g stroke="#b6d0d4" stroke-width="2">${Array.from({length:9},(_,i)=>`<path d="M${i*40} 0V220"/>`).join('')}${Array.from({length:6},(_,i)=>`<path d="M0 ${i*40}H320"/>`).join('')}</g><rect x="20" y="150" width="170" height="70" rx="14" fill="#fbfbf7"/><path d="M60 150h90v14a45 22 0 0 1-90 0Z" fill="#e3ecee"/><g class="faucet"><path d="M105 150v-28q0-22 22-22h26v14h-24q-8 0-8 8v20Z" fill="#aab6bb"/><rect x="146" y="106" width="18" height="12" rx="3" fill="#8da0a8"/></g><g class="drops"><circle cx="155" cy="124" r="4" fill="#4ea9d8"/><circle cx="155" cy="142" r="4" fill="#4ea9d8"/><circle cx="155" cy="160" r="3" fill="#4ea9d8"/></g><g class="shower"><path d="M250 20v72" stroke="#aab6bb" stroke-width="7"/><ellipse cx="250" cy="100" rx="28" ry="9" fill="#8da0a8"/><g class="spray" stroke="#4ea9d8" stroke-width="3" stroke-linecap="round"><path d="M232 114v28M244 116v34M256 116v34M268 114v28"/></g></g></g></svg>`,
 windows:`<svg viewBox="0 0 320 270" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true"><rect width="320" height="270" fill="#f1e4cf"/><g transform="translate(0,25)"><rect x="70" y="14" width="180" height="192" rx="8" fill="#fff6e6"/><defs><linearGradient id="skyq" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f6a26a"/><stop offset=".6" stop-color="#f7d7a0"/><stop offset="1" stop-color="#9fc5d6"/></linearGradient></defs><rect x="82" y="26" width="156" height="168" fill="url(#skyq)"/><path d="M82 168l16-26 14 16 18-34 16 30 20-26 18 22 18-30 16 28v44H82Z" fill="#5d6f7c" opacity=".8"/><g class="sash"><rect x="82" y="26" width="76" height="168" fill="#ffffff22" stroke="#fff6e6" stroke-width="8"/><circle cx="148" cy="112" r="5" fill="#b9a27c"/></g><rect x="158" y="26" width="80" height="168" fill="none" stroke="#fff6e6" stroke-width="8"/><g class="seal" stroke="#e08a3c" stroke-width="4" fill="none" stroke-linecap="round"><path d="M82 26h156M82 194h156M82 26v168M238 26v168"/></g><path d="M20 10q40 40 30 120t10 90H8V10Z" fill="#e7a49c"/><path d="M300 10q-40 40-30 120t-10 90h52V10Z" fill="#e7a49c"/></g></svg>`,
 internet:`<svg viewBox="0 0 320 270" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true"><rect width="320" height="270" fill="#e9dcc4"/><g transform="translate(0,25)"><rect x="0" y="156" width="320" height="64" fill="#b98c62"/><rect x="30" y="150" width="260" height="12" rx="3" fill="#8d6845"/><g class="box"><rect x="86" y="102" width="148" height="48" rx="10" fill="#33414b"/><g class="leds"><circle cx="112" cy="126" r="5" fill="#6ee08f"/><circle cx="132" cy="126" r="5" fill="#6ee08f"/><circle cx="152" cy="126" r="5" fill="#f2c94c"/><circle cx="172" cy="126" r="5" fill="#6ee08f"/></g><path d="M104 102 96 50M216 102l8-52" stroke="#33414b" stroke-width="7" stroke-linecap="round"/></g><g class="waves" fill="none" stroke="#2f8f83" stroke-width="5" stroke-linecap="round"><path d="M138 34q22-18 44 0"/><path d="M122 18q38-30 76 0"/><path d="M154 46q6-5 12 0"/></g><g class="bars" fill="#2f8f83"><rect x="246" y="118" width="12" height="16"/><rect x="264" y="104" width="12" height="30"/><rect x="282" y="88" width="12" height="46"/></g></g></svg>`
};

export function mountViewingQuest(root,{owner,mask=0,canRewind,onBack,onSettings,onChange,onComplete}){
  const doc=root.ownerDocument,flat=FLATS[owner];
  const events=new AbortController();const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
  let done=mask&63,finished=false,active=0;
  root.replaceChildren();
  const bg=make(doc,'div','quest-art viewing-bg');bg.style.backgroundImage=`url('./assets/${flat.bg}.webp')`;
  const {header,heading}=toolbar(doc,{title:t(UI[4]),canRewind,onBack,onSettings,listen});heading.id='scene-quest-title';
  const tabs=make(doc,'div','viewing-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',t(UI[5]));
  const card=make(doc,'section','viewing-card');
  const stage=make(doc,'div','viewing-stage');
  const finding=make(doc,'p','viewing-finding');finding.setAttribute('role','status');finding.setAttribute('aria-live','polite');
  const actions=make(doc,'div','viewing-actions');
  const footer=make(doc,'footer','viewing-footer');
  const progress=make(doc,'p','viewing-progress');
  const finish=make(doc,'button','primary viewing-finish',t(UI[6]));finish.type='button';
  footer.append(progress,finish);card.append(stage,finding,actions);
  root.append(bg,header,tabs,card,footer);
  const bit=(station,target)=>1<<(station*2+target);
  const stationDone=station=>(done&bit(station,0))&&(done&bit(station,1));
  const tabButtons=QUEST_STATIONS.map((station,index)=>{
    const button=make(doc,'button','viewing-tab');button.type='button';button.setAttribute('role','tab');
    listen(button,'click',()=>{active=index;paint();});tabs.append(button);return button;
  });
  const targetButtons=[0,1].map(()=>{const button=make(doc,'button','viewing-target');button.type='button';actions.append(button);return button;});
  const paint=(message='')=>{
    const station=QUEST_STATIONS[active];
    tabButtons.forEach((button,index)=>{
      const complete=!!stationDone(index);
      button.textContent=(complete?'✓ ':'')+pick(QUEST_STATIONS[index].title);
      button.setAttribute('aria-selected',String(index===active));button.dataset.done=String(complete);
    });
    stage.innerHTML=art[station.id];stage.dataset.station=station.id;
    stage.classList.toggle('first-done',!!(done&bit(active,0)));stage.classList.toggle('second-done',!!(done&bit(active,1)));
    station.targets.forEach(([,label],target)=>{
      const button=targetButtons[target],checked=!!(done&bit(active,target));
      button.textContent=(checked?'✓ ':'')+pick(label);button.dataset.done=String(checked);button.setAttribute('aria-pressed',String(checked));
    });
    finding.textContent=message||pick(station.hint);
    const count=[0,1,2].filter(stationDone).length;
    const left=QUEST_STATIONS.filter((_,index)=>!stationDone(index)).map(each=>pick(each.title));
    progress.textContent=left.length?`${count} / 3 · ${t(UI[7])}: ${left.join(', ')}`:`3 / 3 · ${t(UI[8])}`;
    finish.disabled=left.length>0;
  };
  targetButtons.forEach((button,target)=>listen(button,'click',()=>{
    if(finished)return;
    const station=QUEST_STATIONS[active],id=station.targets[target][0];
    const was=done;done|=bit(active,target);
    paint(pick(flat.findings[id]));
    if(done!==was)onChange(done);
    if(stationDone(active)&&done!==was){const next=QUEST_STATIONS.findIndex((_,index)=>!stationDone(index));if(next>=0)tabButtons[next].dataset.next='true';}
  }));
  listen(finish,'click',()=>{if(finished||done!==63)return;finished=true;onComplete();});
  paint();
  return()=>{events.abort();};
}
