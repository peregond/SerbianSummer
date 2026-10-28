// Read-only story atlas for the workshop: scene IDs, chapters and exits for editorial notes.
const preview=(value,limit=96)=>{
  const text=typeof value==='string'?value:value?.ru??value?.text??'';
  const flat=String(text).replace(/\s+/g,' ').trim();
  if(!flat)return '';
  return flat.length>limit?flat.slice(0,limit-1)+'…':flat;
};

function outsOf(node){
  if(Array.isArray(node.choices)&&node.choices.length){
    return node.choices.map(choice=>({
      kind:'choice',
      label:preview(choice.label,72),
      next:choice.next??null,
      tone:choice.tone??null
    }));
  }
  if(node.next)return[{kind:'next',label:'→',next:node.next,tone:null}];
  return[];
}

function pagesOf(node){
  return(node.pages??[]).map((page,index)=>({
    index,
    speaker:page.speaker??'narrator',
    text:preview(page.text,120),
    message:!!page.message
  }));
}

function walkChapter(nodes,start,boundaries){
  const seen=new Set();
  const order=[];
  const visit=id=>{
    if(!id||id==='end'||seen.has(id)||(boundaries.has(id)&&id!==start))return;
    if(!nodes[id])return;
    seen.add(id);order.push(id);
    for(const out of outsOf(nodes[id]))visit(out.next);
  };
  visit(start);
  return order;
}

export function buildStoryAtlas(nodes,chapters,start='quick_arrival'){
  const boundaries=new Set(chapters.map(chapter=>chapter.start));
  const scenes={};
  for(const [id,node] of Object.entries(nodes)){
    scenes[id]={
      id,
      chapterId:node.chapterId??null,
      chapter:node.chapter??null,
      day:node.day??null,
      location:node.location??null,
      time:node.time??null,
      pageCount:(node.pages??[]).length,
      pages:pagesOf(node),
      outs:outsOf(node),
      legacyOnly:!!node.legacyOnly,
      adult:!!node.adult,
      music:node.music??null
    };
  }
  const chapterRows=chapters.map(chapter=>{
    const sceneIds=walkChapter(nodes,chapter.start,boundaries);
    return{
      id:chapter.id,
      number:chapter.number,
      title:chapter.title,
      start:chapter.start,
      day:chapter.day??null,
      description:chapter.description??'',
      sceneIds,
      sceneCount:sceneIds.length
    };
  });
  const assigned=new Set(chapterRows.flatMap(row=>row.sceneIds));
  const orphans=Object.keys(scenes).filter(id=>!assigned.has(id)).sort();
  const totals={scenes:Object.keys(scenes).length,chapters:chapterRows.length,orphans:orphans.length,start};
  return{chapters:chapterRows,scenes,orphans,totals};
}

export function formatSceneNote(scene){
  if(!scene)return'';
  const lines=[
    `ID: ${scene.id}`,
    scene.chapter?`Глава: ${scene.chapter}`:null,
    scene.day?`День: ${scene.day}`:null,
    scene.location?`Локация: ${scene.location}`:null,
    scene.time?`Время: ${scene.time}`:null,
    `Страниц: ${scene.pageCount}`
  ].filter(Boolean);
  if(scene.pages.length){
    lines.push('Реплики:');
    for(const page of scene.pages)lines.push(`  [${page.index}] ${page.speaker}: ${page.text}`);
  }
  if(scene.outs.length){
    lines.push('Переходы:');
    for(const out of scene.outs){
      const tone=out.tone?` · ${out.tone}`:'';
      lines.push(`  ${out.label||'→'} → ${out.next??'end'}${tone}`);
    }
  }
  return lines.join('\n');
}

export function filterAtlasScenes(atlas,{chapterId='all',query='',includeLegacy=true,includeOrphans=true}={}){
  const q=query.trim().toLocaleLowerCase('ru');
  const inChapter=id=>{
    if(chapterId==='all')return true;
    if(chapterId==='orphans')return atlas.orphans.includes(id);
    return atlas.scenes[id]?.chapterId===chapterId;
  };
  return Object.values(atlas.scenes).filter(scene=>{
    if(!inChapter(scene.id))return false;
    if(!includeLegacy&&scene.legacyOnly)return false;
    if(!includeOrphans&&atlas.orphans.includes(scene.id)&&chapterId!=='orphans')return false;
    if(!q)return true;
    const hay=[scene.id,scene.chapter,scene.day,scene.location,scene.time,...scene.pages.map(p=>p.text),...scene.outs.map(o=>`${o.label} ${o.next}`)].filter(Boolean).join('\n').toLocaleLowerCase('ru');
    return hay.includes(q);
  }).sort((a,b)=>a.id.localeCompare(b.id,'en'));
}
