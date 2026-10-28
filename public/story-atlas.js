import {t} from './i18n.js?v=0.16.1';
import {buildStoryAtlas,filterAtlasScenes,formatSceneNote} from './story-atlas-model.js?v=1';

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
  const intro=el('p','Внутренняя карта сюжета: ID сцен, главы и переходы. Удобно копировать ID, когда присылаешь правки.','workshop-intro');
  const summary=el('p','','story-atlas-summary');
  summary.textContent=`${atlas.totals.scenes} ${t('сцен')} · ${atlas.totals.chapters} ${t('глав')} · ${t('старт')} ${atlas.totals.start}`;
  const controls=el('div','','workshop-controls story-atlas-controls');
  const search=el('input');search.type='search';search.placeholder=t('ID сцены, локация или фраза');search.setAttribute('aria-label',t('Поиск по сценам'));
  const chapter=el('select');chapter.setAttribute('aria-label',t('Глава'));
  const all=el('option',t('Все главы'));all.value='all';chapter.append(all);
  for(const row of atlas.chapters){
    const option=el('option',`${t(row.number)} · ${t(row.title)} (${row.sceneCount})`);
    option.value=row.id;chapter.append(option);
  }
  if(atlas.orphans.length){
    const option=el('option',t('Вне глав / legacy')+` (${atlas.orphans.length})`);
    option.value='orphans';chapter.append(option);
  }
  const legacy=el('label','','workshop-archive-toggle');
  const legacyBox=el('input');legacyBox.type='checkbox';legacyBox.checked=true;
  legacy.append(legacyBox,document.createTextNode(t('Показать legacyOnly')));
  controls.append(search,chapter,legacy);

  const layout=el('div','','story-atlas-layout');
  const list=el('div','','story-atlas-list');list.setAttribute('role','list');
  const detail=el('article','','story-atlas-detail');
  const empty=el('p',t('Выбери сцену слева — справа появятся ID, реплики и переходы.'),'story-atlas-empty');
  detail.append(empty);
  layout.append(list,detail);
  root.append(intro,summary,controls,layout);
  container.append(root);

  let selected=null;
  const setStatus=message=>{if(status)status.textContent=message;};

  function renderDetail(scene){
    detail.replaceChildren();
    if(!scene){detail.append(el('p',t('Выбери сцену слева — справа появятся ID, реплики и переходы.'),'story-atlas-empty'));return;}
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
      const chip=el('span',`${t(label)}: ${value}`,'story-atlas-chip');
      chips.append(chip);
    }
    if(scene.legacyOnly)chips.append(el('span',t('legacyOnly'),'story-atlas-chip warn'));
    if(scene.adult)chips.append(el('span',t('18+'),'story-atlas-chip warn'));
    head.append(chips);
    detail.append(head);

    const pagesTitle=el('h3',t('Реплики'));
    const pages=el('ol','','story-atlas-pages');
    for(const page of scene.pages){
      const item=el('li');
      item.append(el('small',`[${page.index}] ${page.speaker}${page.message?' · msg':''}`),el('p',page.text));
      pages.append(item);
    }
    detail.append(pagesTitle,pages);

    const outsTitle=el('h3',t('Переходы'));
    const outs=el('ul','','story-atlas-outs');
    if(!scene.outs.length)outs.append(el('li',t('Конец ветки / без next')));
    for(const out of scene.outs){
      const item=el('li');
      const button=el('button',`${out.label||'→'} → ${out.next??'end'}`,'text-button story-atlas-link');
      button.type='button';
      if(out.tone)button.append(document.createTextNode(` · ${out.tone}`));
      button.onclick=()=>{
        if(!out.next||out.next==='end'||!atlas.scenes[out.next])return;
        selected=out.next;renderList();renderDetail(atlas.scenes[out.next]);
      };
      item.append(button);outs.append(item);
    }
    detail.append(outsTitle,outs);
  }

  function renderList(){
    const rows=filterAtlasScenes(atlas,{
      chapterId:chapter.value,
      query:search.value,
      includeLegacy:legacyBox.checked,
      includeOrphans:true
    });
    list.replaceChildren();
    const count=el('p',t('Найдено')+`: ${rows.length}`,'story-atlas-count');
    list.append(count);
    if(!rows.length){list.append(el('p',t('Ничего не найдено'),'workshop-intro'));return;}
    for(const scene of rows){
      const button=el('button','','story-atlas-item');
      button.type='button';button.setAttribute('role','listitem');
      button.setAttribute('aria-pressed',String(scene.id===selected));
      button.append(el('strong',scene.id),el('span',scene.chapter||t('Вне глав'),'story-atlas-item-meta'));
      if(scene.location)button.append(el('small',scene.location));
      button.onclick=()=>{selected=scene.id;renderList();renderDetail(scene);};
      list.append(button);
    }
  }

  search.addEventListener('input',()=>{renderList();});
  chapter.addEventListener('change',()=>{selected=null;renderList();renderDetail(null);});
  legacyBox.addEventListener('change',()=>{renderList();});
  renderList();
}
