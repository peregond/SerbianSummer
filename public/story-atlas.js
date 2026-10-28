import {t} from './i18n.js?v=0.16.1';
import {buildStoryAtlas,buildStoryGraph,filterAtlasScenes,formatSceneNote,graphEdgePath} from './story-atlas-model.js?v=2';

const el=(tag,text,className)=>{
  const node=document.createElement(tag);
  if(text!=null&&text!=='')node.textContent=typeof text==='string'?t(text):text;
  if(className)node.className=className;
  return node;
};

async function copyText(value){
  try{
    await navigator.clipboard.writeText(value);
    return true;
  }catch{
    const area=document.createElement('textarea');
    area.value=value;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';
    document.body.append(area);area.select();
    try{return document.execCommand('copy');}finally{area.remove();}
  }
}

export function mountStoryAtlas(container,{nodes,chapters,start,status}){
  const atlas=buildStoryAtlas(nodes,chapters,start);
  const root=el('div','','story-atlas');
  const intro=el('p','Интерактивная схема сюжета: ходи по узлам, смотри реплики и копируй ID сцен для правок.','workshop-intro');
  const summary=el('p','','story-atlas-summary');
  summary.textContent=`${atlas.totals.scenes} ${t('сцен')} · ${atlas.totals.chapters} ${t('глав')} · ${t('старт')} ${atlas.totals.start}`;

  const controls=el('div','','workshop-controls story-atlas-controls');
  const search=el('input');search.type='search';search.placeholder=t('ID сцены, локация или фраза');search.setAttribute('aria-label',t('Поиск по сценам'));
  const chapter=el('select');chapter.setAttribute('aria-label',t('Глава'));
  for(const row of atlas.chapters){
    const option=el('option',`${t(row.number)} · ${t(row.title)} (${row.sceneCount})`);
    option.value=row.id;chapter.append(option);
  }
  if(atlas.orphans.length){
    const option=el('option',t('Вне глав / legacy')+` (${atlas.orphans.length})`);
    option.value='orphans';chapter.append(option);
  }
  const focusOpt=el('option',t('Окрестность сцены'));focusOpt.value='focus';chapter.append(focusOpt);
  const prologue=atlas.chapters.find(row=>row.id==='prologue')||atlas.chapters[0];
  if(prologue)chapter.value=prologue.id;

  const legacy=el('label','','workshop-archive-toggle');
  const legacyBox=el('input');legacyBox.type='checkbox';legacyBox.checked=true;
  legacy.append(legacyBox,document.createTextNode(t('Показать legacyOnly')));
  controls.append(chapter,search,legacy);

  const layout=el('div','','story-atlas-layout story-atlas-layout-schema');
  const schemaWrap=el('div','','story-atlas-schema');
  schemaWrap.setAttribute('tabindex','0');
  schemaWrap.setAttribute('aria-label',t('Схема сцен'));
  const schemaToolbar=el('div','','story-atlas-schema-toolbar');
  const zoomOut=el('button','−','secondary story-atlas-zoom');zoomOut.type='button';zoomOut.setAttribute('aria-label',t('Уменьшить'));
  const zoomIn=el('button','+','secondary story-atlas-zoom');zoomIn.type='button';zoomIn.setAttribute('aria-label',t('Увеличить'));
  const zoomReset=el('button',t('Сброс'),'secondary story-atlas-zoom');zoomReset.type='button';
  const fitBtn=el('button',t('К выбранной'),'secondary story-atlas-zoom');fitBtn.type='button';
  schemaToolbar.append(zoomOut,zoomIn,zoomReset,fitBtn);
  const schemaViewport=el('div','','story-atlas-schema-viewport');
  const schemaCanvas=el('div','','story-atlas-schema-canvas');
  schemaViewport.append(schemaCanvas);
  schemaWrap.append(schemaToolbar,schemaViewport);

  const detail=el('article','','story-atlas-detail');
  detail.append(el('p',t('Выбери узел на схеме — справа появятся ID, реплики и переходы.'),'story-atlas-empty'));
  layout.append(schemaWrap,detail);
  root.append(intro,summary,controls,layout);
  container.append(root);

  let selected=prologue?.start||atlas.totals.start;
  let crawl=[selected];
  let scale=1;
  let panX=0;
  let panY=0;
  let dragging=false;
  let dragOrigin=null;
  let graph=null;

  const setStatus=message=>{if(status)status.textContent=message;};

  function applyTransform(){
    schemaCanvas.style.transform=`translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  function centerOn(id){
    const node=graph?.byId?.[id];
    if(!node)return;
    const rect=schemaViewport.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const cx=node.x+graph.nodeW/2;
    const cy=node.y+graph.nodeH/2;
    panX=rect.width/2-cx*scale;
    panY=rect.height/2-cy*scale;
    applyTransform();
  }

  function fitGraph(){
    if(!graph)return;
    const rect=schemaViewport.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const pad=48;
    const sx=(rect.width-pad)/Math.max(graph.width,1);
    const sy=(rect.height-pad)/Math.max(graph.height,1);
    scale=Math.min(1.15,Math.max(0.35,Math.min(sx,sy)));
    panX=(rect.width-graph.width*scale)/2;
    panY=(rect.height-graph.height*scale)/2;
    applyTransform();
  }

  function goTo(id,{push=true}={}){
    if(!id||id==='end'||!atlas.scenes[id])return;
    selected=id;
    if(push){
      if(crawl[crawl.length-1]!==id)crawl.push(id);
      if(crawl.length>40)crawl=crawl.slice(-40);
    }
    if(chapter.value==='focus')renderAll();
    else{renderGraph();renderDetail(atlas.scenes[id]);}
    requestAnimationFrame(()=>centerOn(id));
  }

  function renderDetail(scene){
    detail.replaceChildren();
    if(!scene){
      detail.append(el('p',t('Выбери узел на схеме — справа появятся ID, реплики и переходы.'),'story-atlas-empty'));
      return;
    }
    const head=el('header','','story-atlas-detail-head');
    const idRow=el('div','','story-atlas-id-row');
    const code=el('code',scene.id,'story-atlas-id');
    const copyId=el('button',t('Скопировать ID'),'secondary');
    copyId.type='button';
    copyId.onclick=async()=>{if(await copyText(scene.id))setStatus(t('ID скопирован: ')+scene.id);};
    const copyNote=el('button',t('Скопировать карточку'),'secondary');
    copyNote.type='button';
    copyNote.onclick=async()=>{if(await copyText(formatSceneNote(scene)))setStatus(t('Карточка сцены скопирована'));};
    idRow.append(code,copyId,copyNote);
    head.append(idRow);
    if(scene.chapter)head.append(el('p',scene.chapter,'story-atlas-meta'));
    const chips=el('div','','story-atlas-chips');
    for(const [label,value] of [['День',scene.day],['Локация',scene.location],['Время',scene.time],['Страниц',String(scene.pageCount)]]){
      if(!value)continue;
      chips.append(el('span',`${t(label)}: ${value}`,'story-atlas-chip'));
    }
    if(scene.legacyOnly)chips.append(el('span',t('legacyOnly'),'story-atlas-chip warn'));
    if(scene.adult)chips.append(el('span',t('18+'),'story-atlas-chip warn'));
    head.append(chips);
    detail.append(head);

    if(crawl.length>1){
      const trail=el('div','','story-atlas-trail');
      const back=el('button',t('← Назад по схеме'),'text-button');
      back.type='button';
      back.onclick=()=>{
        if(crawl.length<2)return;
        crawl.pop();
        goTo(crawl[crawl.length-1],{push:false});
      };
      trail.append(back,el('small',crawl.slice(-4).join(' → ')));
      detail.append(trail);
    }

    const pagesTitle=el('h3',t('Реплики'));
    const pages=el('ol','','story-atlas-pages');
    for(const page of scene.pages){
      const item=el('li');
      item.append(el('small',`[${page.index}] ${page.speaker}${page.message?' · msg':''}`),el('p',page.text));
      pages.append(item);
    }
    detail.append(pagesTitle,pages);

    const ins=atlas.incoming[scene.id]??[];
    if(ins.length){
      detail.append(el('h3',t('Входы')));
      const list=el('ul','','story-atlas-outs');
      for(const edge of ins){
        const item=el('li');
        const button=el('button',`${edge.from} →`,'text-button story-atlas-link');
        button.type='button';
        if(edge.label&&edge.label!=='→')button.append(document.createTextNode(` ${edge.label}`));
        button.onclick=()=>goTo(edge.from);
        item.append(button);list.append(item);
      }
      detail.append(list);
    }

    detail.append(el('h3',t('Переходы')));
    const outs=el('ul','','story-atlas-outs');
    if(!scene.outs.length)outs.append(el('li',t('Конец ветки / без next')));
    for(const out of scene.outs){
      const item=el('li');
      const button=el('button',`${out.label||'→'} → ${out.next??'end'}`,'text-button story-atlas-link');
      button.type='button';
      if(out.tone)button.append(document.createTextNode(` · ${out.tone}`));
      button.onclick=()=>{
        if(!out.next||out.next==='end')return;
        if(atlas.scenes[out.next]?.chapterId&&chapter.value!=='focus'&&chapter.value!=='orphans'&&atlas.scenes[out.next].chapterId!==chapter.value){
          chapter.value=atlas.scenes[out.next].chapterId;
        }
        goTo(out.next);
      };
      item.append(button);outs.append(item);
    }
    detail.append(outs);
  }

  function renderGraph(){
    const chapterId=chapter.value;
    graph=buildStoryGraph(atlas,{
      chapterId:chapterId==='focus'?'all':chapterId,
      focusId:selected,
      hops:1
    });
    if(!legacyBox.checked){
      graph.nodes=graph.nodes.filter(node=>!atlas.scenes[node.id]?.legacyOnly||node.id===selected);
      const keep=new Set(graph.nodes.map(n=>n.id));
      graph.edges=graph.edges.filter(edge=>keep.has(edge.from)&&(edge.end||keep.has(edge.to)));
      graph.byId=Object.fromEntries(graph.nodes.map(n=>[n.id,n]));
    }

    schemaCanvas.replaceChildren();
    schemaCanvas.style.width=`${graph.width}px`;
    schemaCanvas.style.height=`${graph.height}px`;

    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','story-atlas-edges');
    svg.setAttribute('width',String(graph.width));
    svg.setAttribute('height',String(graph.height));
    svg.setAttribute('viewBox',`0 0 ${graph.width} ${graph.height}`);
    const marker=document.createElementNS('http://www.w3.org/2000/svg','defs');
    marker.innerHTML=`<marker id="story-atlas-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor"/></marker>`;
    svg.append(marker);

    for(const edge of graph.edges){
      const from=graph.byId[edge.from];
      if(!from)continue;
      const to=edge.end?null:graph.byId[edge.to];
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',graphEdgePath(from,to||{x:from.x+graph.nodeW+40,y:from.y},graph.nodeW,graph.nodeH));
      path.setAttribute('class',`story-atlas-edge${edge.external?' is-external':''}${edge.end?' is-end':''}${edge.from===selected||edge.to===selected?' is-active':''}`);
      path.setAttribute('marker-end','url(#story-atlas-arrow)');
      svg.append(path);
      if(edge.label&&edge.label!=='→'&&to){
        const label=document.createElementNS('http://www.w3.org/2000/svg','text');
        label.textContent=edge.label.length>28?edge.label.slice(0,27)+'…':edge.label;
        label.setAttribute('x',String((from.x+graph.nodeW+to.x)/2));
        label.setAttribute('y',String((from.y+to.y)/2+graph.nodeH/2-8));
        label.setAttribute('class','story-atlas-edge-label');
        svg.append(label);
      }
    }
    schemaCanvas.append(svg);

    const layer=el('div','','story-atlas-nodes');
    for(const node of graph.nodes){
      if(!legacyBox.checked&&atlas.scenes[node.id]?.legacyOnly&&node.id!==selected)continue;
      const button=el('button','','story-atlas-node');
      button.type='button';
      button.style.left=`${node.x}px`;
      button.style.top=`${node.y}px`;
      button.style.width=`${graph.nodeW}px`;
      button.style.height=`${graph.nodeH}px`;
      button.dataset.id=node.id;
      button.classList.toggle('is-selected',node.id===selected);
      button.classList.toggle('is-external',!!node.external);
      button.classList.toggle('is-root',node.id===graph.root);
      button.append(el('strong',node.label));
      if(node.meta)button.append(el('small',node.meta));
      button.onclick=()=>goTo(node.id);
      layer.append(button);
    }
    schemaCanvas.append(layer);
    applyTransform();
  }

  function renderAll(){
    renderGraph();
    renderDetail(atlas.scenes[selected]||null);
  }

  search.addEventListener('input',()=>{
    const q=search.value.trim();
    if(!q)return;
    const rows=filterAtlasScenes(atlas,{
      chapterId:chapter.value==='focus'?'all':chapter.value,
      query:q,
      includeLegacy:legacyBox.checked
    });
    if(rows[0]){
      if(chapter.value!=='focus'&&rows[0].chapterId)chapter.value=rows[0].chapterId;
      goTo(rows[0].id);
    }
  });
  search.addEventListener('keydown',event=>{
    if(event.key!=='Enter')return;
    const q=search.value.trim();
    if(atlas.scenes[q]){
      if(atlas.scenes[q].chapterId)chapter.value=atlas.scenes[q].chapterId;
      goTo(q);
    }
  });
  chapter.addEventListener('change',()=>{
    if(chapter.value!=='focus'&&chapter.value!=='orphans'){
      const row=atlas.chapters.find(item=>item.id===chapter.value);
      if(row&&!row.sceneIds.includes(selected))selected=row.start;
    }
    crawl=[selected];
    renderAll();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{fitGraph();centerOn(selected);}));
  });
  legacyBox.addEventListener('change',()=>renderAll());

  zoomIn.onclick=()=>{scale=Math.min(2.2,scale+0.12);applyTransform();centerOn(selected);};
  zoomOut.onclick=()=>{scale=Math.max(0.35,scale-0.12);applyTransform();centerOn(selected);};
  zoomReset.onclick=()=>fitGraph();
  fitBtn.onclick=()=>centerOn(selected);

  schemaViewport.addEventListener('pointerdown',event=>{
    if(event.target.closest('.story-atlas-node'))return;
    dragging=true;
    dragOrigin={x:event.clientX-panX,y:event.clientY-panY};
    schemaViewport.classList.add('is-panning');
    schemaViewport.setPointerCapture?.(event.pointerId);
  });
  schemaViewport.addEventListener('pointermove',event=>{
    if(!dragging||!dragOrigin)return;
    panX=event.clientX-dragOrigin.x;
    panY=event.clientY-dragOrigin.y;
    applyTransform();
  });
  const endPan=event=>{
    dragging=false;dragOrigin=null;schemaViewport.classList.remove('is-panning');
    try{schemaViewport.releasePointerCapture?.(event.pointerId);}catch{/* ignore */}
  };
  schemaViewport.addEventListener('pointerup',endPan);
  schemaViewport.addEventListener('pointercancel',endPan);
  schemaViewport.addEventListener('wheel',event=>{
    if(event.ctrlKey||event.metaKey){
      event.preventDefault();
      const delta=event.deltaY>0?-0.08:0.08;
      scale=Math.min(2.2,Math.max(0.45,scale+delta));
      applyTransform();
    }
  },{passive:false});

  renderAll();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    fitGraph();
    centerOn(selected);
  }));
}
