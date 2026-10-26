import {renderEpisodeContact} from './episode-contact.js?v=1';
import {familySpeaker,familyText} from './family-contact.js?v=1';
import {drawChapterMap} from './chapter-map.js?v=1';
import {mountWorkshopEntry,mountWorkshop} from './workshop.js?v=6';
import {mountMessenger} from './messenger.js?v=2';
import {messengerFrame,messageAt} from './messenger-model.js?v=3';
import {MESSENGER_CONFIG} from './messenger-config.js?v=2';
import {ART_FRAMES,positionArtwork} from './art-framing.js?v=0.15.0';
import {t,html,initialiseLanguage,getLanguage,setLanguage,captureStaticUi,translateHistory} from './i18n.js?v=0.15.0';
import {CHAPTERS,chapterFor,readChapterMarks,rememberChapter,restartChapter,continuationFor} from './chapters.js?v=0.15.0';
import {drawBeatAction} from './beat-action.js?v=0.15.0';
import {drawAccountForm,drawRecoveryCode} from './account-form.js?v=0.15.0';
import { NODES, JOURNAL, START, STORY_VERSION, BACKGROUNDS, CHARACTER_SPRITES, CHOICE_TONES, beatActionAt, presentationFor, pageText, resolveStoryText, interpolate } from './story.js?v=0.15.0-guests1';
import { loadSave, writeSave, readLocal, writeLocal } from './storage.js';
import { setMusic, setVolume, setMusicScene } from './audio.js?v=0.8.0';
import {renderDistrictMap as drawDistrictMap} from './district-map.js?v=0.15.0';
import { CloudProgress } from './cloud.js?v=0.9.0';
import { rememberStep, rewindStep, readRewind } from './rewind.js?v=0.4.1';
import {dialogueVoice,logVoice,speakerIdentity} from './dialogue-voice.js?v=0.15.0';
import {appendChoiceContents} from './choice-ui.js?v=0.15.0';
import {mountBaggageInteraction} from './interaction.js?v=0.15.0';
import {APP_VERSION} from './release.js?v=0.15.0';

const $ = id => document.getElementById(id);
let translationsReady=false;
try{await initialiseLanguage();translationsReady=true;}catch{setLanguage('ru');}
const applyStaticLanguage=captureStaticUi(document);
applyStaticLanguage();
function updateLanguageUi(){document.documentElement.lang=getLanguage();document.querySelector('link[rel=manifest]').href=getLanguage()==='en'?'./manifest.en.webmanifest':'./manifest.webmanifest';document.title=t('Сербское лето — начало истории');for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===getLanguage()));document.querySelectorAll('[data-app-version]').forEach(label=>{label.textContent=APP_VERSION;label.setAttribute('aria-label',t('Версия ')+APP_VERSION);});}
updateLanguageUi();
const catalog = await fetch('./names.json').then(r => { if(!r.ok) throw new Error('Не удалось загрузить имена'); return r.json(); });
const settings = readLocal('settings', { textSize:18, music:false, volume:.55 });
settings.textSize = Math.max(16,Math.min(24,Number(settings.textSize)||18));
settings.music = settings.music === true;
settings.volume = Number.isFinite(settings.volume) ? Math.max(0,Math.min(1,settings.volume)) : .55;
settings.theme=['system','light','dark'].includes(settings.theme)?settings.theme:'system';
const systemTheme=window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme(){const dark=settings.theme==='dark'||(settings.theme==='system'&&systemTheme.matches);document.documentElement.dataset.theme=dark?'dark':'light';document.querySelector('meta[name="theme-color"]').content=document.body.dataset.screen==='home'?'#102b46':document.body.dataset.screen==='interaction'?'#192e3a':document.body.dataset.screen==='messenger'?(dark?MESSENGER_CONFIG.chrome.dark:MESSENGER_CONFIG.chrome.light):dark?'#182a31':'#fff3d8';}
systemTheme.addEventListener('change',()=>{if(settings.theme==='system')applyTheme();});
applyTheme();
setVolume(settings.volume);
document.documentElement.style.setProperty('--text-size', settings.textSize+'px');
let saved = null, state = null, view = 'home', creationStep = 0, expandedNames = false, transitionLock = false;
let draft = readLocal('draft', { gender:null, nameId:null });
const panel=$('panel');
let cloud,authMode='login',recoveryCodeOnce=null;
let toastTimer;
let interactionDispose=null,messengerDispose=null;
let currentArtFrame=null;
const preloadedBackgrounds=new Map();
const preloadedSprites=new Map();
function preloadBackground(id) {
  if(!Object.hasOwn(BACKGROUNDS,id)||preloadedBackgrounds.has(id))return;
  const image=new Image();image.src=`./assets/${id}.webp`;
  preloadedBackgrounds.set(id,image);
}
function preloadSprite(character,emotion='friendly') {
  const sprite=CHARACTER_SPRITES[character]?.[emotion];
  if(!sprite||preloadedSprites.has(sprite.file))return;
  const image=new Image();image.src=`./assets/${sprite.file}.webp`;preloadedSprites.set(sprite.file,image);
}

function named(profile) { return catalog.genders[profile.gender]?.names.find(n=>n.id===profile.nameId); }
function validProfile(profile) { return profile && ['male','female'].includes(profile.gender) && !!named(profile); }
function validateSave(input) {
  if (!input || input.formatVersion!==1 || input.storyVersion!==STORY_VERSION || !validProfile(input.profile)) throw new Error('Этот файл сохранения не подходит к версии пролога.');
  if (input.node!=='end' && !Object.hasOwn(NODES,input.node)) throw new Error('Неизвестная сцена в сохранении.');
  if (!Number.isInteger(input.index) || input.index<0 || (input.node!=='end' && input.index>=NODES[input.node].pages.length)) throw new Error('Не удалось восстановить реплику.');
  if (!Array.isArray(input.log) || input.log.length>1500 || !input.log.every(e=>e && typeof e.speaker==='string' && e.speaker.length<100 && typeof e.text==='string' && e.text.length<4000)) throw new Error('Повреждена история реплик.');
  if (!Array.isArray(input.journal) || input.journal.some(id=>!Object.hasOwn(JOURNAL,id))) throw new Error('Повреждён дневник.');
  if(!input.flags || typeof input.flags!=='object' || Array.isArray(input.flags)) throw new Error('Повреждены данные выборов.');
  return { formatVersion:1, storyVersion:STORY_VERSION, profile:{gender:input.profile.gender,nameId:input.profile.nameId,namesCatalogVersion:catalog.version}, node:input.node,index:input.node==='end'?0:input.index, flags:{...input.flags},journal:[...new Set(input.journal)],log:input.log.map(e=>({speaker:e.speaker,text:e.text,choice:!!e.choice,...logVoice(e)})),updatedAt:Number(input.updatedAt)||Date.now(),completed:input.node==='end',chapterMarks:readChapterMarks(input.chapterMarks,NODES,JOURNAL,input.log.length),rewind:readRewind(input.rewind,NODES,JOURNAL,input.log.length) };
}
try { const candidate=await loadSave(); if(candidate){saved=validateSave(candidate);rememberChapter(saved,NODES,true);} } catch { toast('Сохранение не прочиталось. Можно начать заново или импортировать файл.'); }
if(!['male','female'].includes(draft.gender)) draft={gender:null,nameId:null};
if(draft.nameId && !named(draft)) draft.nameId=null;

function toast(text) {
  clearTimeout(toastTimer); $('toast').textContent=t(text); $('toast').hidden=false;
  toastTimer=setTimeout(()=>$('toast').hidden=true,3800);
}
function refreshMusicControls() {
  if($('music-toggle'))$('music-toggle').checked=settings.music;
}
async function applyMusic(enabled) {
  settings.music=enabled;settings.soundChosen=true;
  const ok=await setMusic(enabled);
  if(!ok){settings.music=false;toast('Коснись кнопки музыки ещё раз, чтобы разрешить звук.');}
  writeLocal('settings',settings);refreshMusicControls();
}
function chooseSound(continueGame) {
  setMusic(false);
  $('panel-title').textContent=t('Добавим музыку?');
  $('panel-content').innerHTML=html('<p class="confirm-copy">Спокойная мелодия для первого дня в Белграде. Включить?</p><div class="confirm-actions"><button id="sound-yes" class="primary">С музыкой</button><button id="sound-no" class="secondary">Без музыки</button></div><p class="sound-hint">Звук и громкость всегда можно изменить в настройках.</p>');
  for(const [id,enabled] of [['sound-yes',true],['sound-no',false]])$(id).addEventListener('click',()=>{applyMusic(enabled);panel.close();continueGame();});
  panel.showModal();
}
function showInstallGuide() {
  if(panel.open)panel.close();
  $('panel-title').textContent=t('Игра на весь экран');
  const standalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  $('panel-content').innerHTML=html(standalone
    ? '<p class="install-copy">Игра уже открыта с домашнего экрана. Панели Safari скрыты — можно погружаться в историю.</p>'
    : '<p class="install-copy">На iPhone игра открывается без адресной панели, когда запускается с домашнего экрана.</p><ol class="install-steps"><li>Открой эту страницу в Safari и нажми «Поделиться».</li><li>Выбери «На экран Домой». Если пункт спрятан, открой «Ещё».</li><li>Оставь включённым «Открывать как веб-приложение», если этот переключатель есть, и нажми «Добавить».</li></ol><p class="install-copy">Затем запусти «Сербское лето» с новой иконки. Чтобы перенести текущий прогресс, скачай сохранение в настройках и загрузи его после запуска.</p>');
  panel.showModal();
}
function showScreenInfo(){
  $('panel-title').textContent=t('Экран устройства');
  const content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();
  const probe=document.createElement('div');probe.style.cssText='position:fixed;visibility:hidden;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)';document.body.append(probe);const safe=getComputedStyle(probe);
  const rows=[['Режим',document.documentElement.dataset.standalone==='true'?'PWA / полный экран':'Вкладка браузера'],['Экран устройства',screen.width+' × '+screen.height],['Окно игры',innerWidth+' × '+innerHeight],['Видимая область',Math.round(visualViewport?.width??innerWidth)+' × '+Math.round(visualViewport?.height??innerHeight)],['Безопасные отступы',safe.paddingTop+' сверху / '+safe.paddingBottom+' снизу']];
  for(const [title,value]of rows){const p=document.createElement('p');p.className='screen-info-row';const label=document.createElement('strong');label.textContent=t(title);const detail=document.createElement('span');detail.textContent=t(value);p.append(label,detail);content.append(p);}probe.remove();
  const note=document.createElement('p');note.className='journal-intro';note.textContent=t('Эти сведения остаются на устройстве. Если нижняя полоса сохраняется, этот экран поможет отличить размер страницы от области, которую предоставляет iOS.');
  const reload=document.createElement('button');reload.className='primary';reload.textContent=t('Обновить приложение');reload.addEventListener('click',()=>location.reload());content.append(note,reload);
}
async function requestImmersiveMode() {
  if(document.fullscreenElement){await document.exitFullscreen();return;}
  if(document.fullscreenEnabled&&document.documentElement.requestFullscreen){
    try{await document.documentElement.requestFullscreen();return;}catch{}
  }
  showInstallGuide();
}
function showScreen(id) {
  if(view==='interaction'&&id!=='interaction'){interactionDispose?.();interactionDispose=null;}
  if(view==='messenger'){messengerDispose?.();messengerDispose=null;}
  view=id;
  $('home-art').hidden=id!=='home';
  document.body.dataset.screen=id;
  document.documentElement.dataset.screen=id;
  applyTheme();
  document.querySelectorAll('.screen').forEach(el=>el.hidden=el.id!==id);
  window.scrollTo(0,0);
}
function home() {
  setMusicScene('prologue');
  $('new-game').disabled=false;
  $('resume').hidden=!saved;
  $('new-game').classList.toggle('secondary-light',!!saved);
  $('new-game').textContent=t(saved?'Новая игра':'Начать игру');
  showScreen('home');fitScene();
}
function save() {
  if(!state) return;
  state.updatedAt=Date.now(); saved=structuredClone(state);
  cloud?.queue(state);
  const at=state.updatedAt;
  writeSave(state).then(ok=>{
    if(state?.updatedAt!==at) return;
    $('save-status').textContent=t(ok?'Сохранено на этом устройстве':'Сохранение недоступно — экспортируй прогресс');
    $('save-status').classList.toggle('save-warning',!ok);
  });
}
function beginCreation() { creationStep=0;expandedNames=false;renderCreation(); }
function renderCreation() {
  showScreen('creation');
  const options=$('creation-options');options.replaceChildren();
  $('step-label').textContent=t(creationStep===0?'ШАГ 01 / 02':'ШАГ 02 / 02');
  $('creation-title').textContent=t(creationStep===0?'Кем ты будешь?':'Как тебя зовут?');
  $('creation-description').textContent=t(creationStep===0?'Начнём с главного героя.':'Выбери имя, с которым начнётся это лето.');
  $('name-preview').hidden=true;
  $('creation-next').textContent=t(creationStep===0?'Дальше →':'Начать историю →');
  $('creation-next').disabled=creationStep===0?!draft.gender:!validProfile(draft);
  if(creationStep===0) {
    options.className='gender-options';
    for(const [gender,description] of [['male','«Ты уже добрался?»'],['female','«Ты уже добралась?»']]) {
      const button=document.createElement('button');button.type='button';button.className='gender-option';button.setAttribute('aria-pressed',String(draft.gender===gender));
      const strong=document.createElement('strong');strong.textContent=t(catalog.genders[gender].label);
      const small=document.createElement('small');small.textContent=t(description);button.append(strong,small);
      button.addEventListener('click',()=>{if(draft.gender!==gender) draft.nameId=null;draft.gender=gender;writeLocal('draft',draft);renderCreation();options.querySelector(`[aria-pressed="true"]`)?.focus();});options.append(button);
    }
  } else {
    options.className='name-options';
    const group=catalog.genders[draft.gender].names;
    for(const name of group.filter(n=>expandedNames||n.featured||n.id===draft.nameId)) {
      const button=document.createElement('button');button.type='button';button.className='name-option';button.textContent=t(name.full.nominative);button.setAttribute('aria-pressed',String(draft.nameId===name.id));
      button.addEventListener('click',()=>{draft.nameId=name.id;writeLocal('draft',draft);renderCreation();options.querySelector('[aria-pressed="true"]')?.focus();});options.append(button);
    }
    if(!expandedNames) { const more=document.createElement('button');more.className='more-names';more.textContent=t('Ещё имена +');more.style.gridColumn='1 / -1';more.addEventListener('click',()=>{expandedNames=true;renderCreation();});options.append(more); }
    if(validProfile(draft)) {
      const name=named(draft);const preview=$('name-preview');preview.hidden=false;preview.textContent=t(getLanguage()==='en'?`‘${t(name.familiar.nominative)}, have you arrived yet?’`:`«${name.familiar.nominative}, ты уже ${draft.gender==='female'?'добралась':'добрался'}?»`);
      const hint=document.createElement('small');hint.textContent=t(getLanguage()==='en'?`${t(name.full.nominative)} for introductions. ${t(name.familiar.nominative)} with friends.`:`${name.full.nominative} — для знакомства. ${name.familiar.nominative} — для своих.`);preview.append(hint);
    }
  }
}
function startGame() {
  if(!validProfile(draft))return;
  state={formatVersion:1,storyVersion:STORY_VERSION,profile:{gender:draft.gender,nameId:draft.nameId,namesCatalogVersion:catalog.version},node:START,index:0,flags:{},journal:[],log:[],rewind:[],completed:false,updatedAt:Date.now()};
  if(settings.music) applyMusic(true);
  enterNode(START);recordPage();save();renderGame();
}
function speakerName(page,locale=getLanguage()) {
  const names={contact:state.flags.companion==='nikola'?'Никола':'Милица',host:state.flags.host==='jelena'?'Йелена':'Драган',districtHost:state.flags.districtOwner==='jelena'?'Йелена':'Драган',bankStaff:state.flags.bankSpark==='teodora'?'Теодора':'Лазар',mupStaff:state.flags.mupSpark==='strahinya'?'Страхиня':'Ивана',contactCounterpart:state.flags.companion==='nikola'?'Милица':'Никола',ownerCounterpart:state.flags.districtOwner==='jelena'?'Драган':'Йелена',narrator:named(state.profile).full.nominative,player:named(state.profile).full.nominative,milica:'Милица',nikola:'Никола'};
  return t(familySpeaker(names[page.speaker]??page.speaker),locale);
}
function currentPage() {return NODES[state.node].pages[state.index];}
function recordPage() {const page=currentPage();state.log.push({speaker:speakerName(page,'ru'),text:interpolate(pageText(page,state.flags,'ru'),state.profile,catalog,'ru'),choice:false,voice:messageAt(state.node,NODES[state.node],state.index,state.flags)?'message':dialogueVoice(page)});}
function enterNode(id) {
  state.node=id;state.index=0;
  if(id==='end') {state.completed=true;return;}
  Object.assign(state.flags,NODES[id].effectOnEnter??{});
  for(const entry of NODES[id].journal??[]) if(!state.journal.includes(entry))state.journal.push(entry);
  rememberChapter(state,NODES);
}
function renderGame({skipMessenger=false}={}) {
  if(state.node==='end')return renderEnding();
  rememberChapter(state,NODES,true);
  const node=NODES[state.node],page=currentPage();
  setMusicScene(node.music??(['airport-cafe','bakery','cafe-table','bakery-display','bakery-corner'].includes(node.bg)?'encounter':'prologue'));
  const frame=!skipMessenger&&messengerFrame({sceneId:state.node,node,index:state.index,flags:state.flags,action:beatActionAt(node,state.index),text:p=>t(interpolate(pageText(p,state.flags),state.profile,catalog)),choiceText:value=>interpolate(resolveStoryText(value,state.flags),state.profile,catalog)});
  if(frame)return renderMessenger(frame);
  showScreen('game');
  const presentation=presentationFor(node,page,state.flags);
  const sceneElement=$('scene');
  sceneElement.style.backgroundImage=`url('./assets/${presentation.bg}.webp')`;
  sceneElement.style.backgroundPosition=presentation.position;
  sceneElement.dataset.background=presentation.bg;
  sceneElement.classList.toggle('is-daydream',presentation.daydream);
  sceneElement.classList.toggle('is-night',node.lighting==='night');
  sceneElement.classList.toggle('is-map',!!node.map);
  sceneElement.classList.toggle('is-insert',presentation.insert);
  sceneElement.classList.toggle('is-seated',presentation.seated);
  sceneElement.classList.toggle('has-composite',presentation.composite);
  currentArtFrame=ART_FRAMES[presentation.bg];
  const cg=$('scene-cg');cg.hidden=!presentation.composite;
  if(presentation.composite)cg.src=`./assets/${presentation.bg}.webp`;
  $('game').classList.toggle('has-map',!!node.map);
  drawDistrictMap($('district-map'),node,choose);
  sceneElement.setAttribute('aria-label',t(presentation.description));
  preloadBackground(presentation.bg);
  // Load just the next frame or the two immediate branches, rather than the whole chapter.
  if(node.pages[state.index+1]) {
    const nextPresentation=presentationFor(node,node.pages[state.index+1],state.flags);
    preloadBackground(nextPresentation.bg);preloadSprite(nextPresentation.character,nextPresentation.emotion);
  }
  else for(const next of node.choices?node.choices.map(choice=>choice.next):[node.next]) {
    if(NODES[next]) {
      const nextPresentation=presentationFor(NODES[next],NODES[next].pages[0],state.flags);
      preloadBackground(nextPresentation.bg);preloadSprite(nextPresentation.character,nextPresentation.emotion);
    }
  }
  renderEpisodeContact($('episode-contact'),presentation.contactPortrait);
  const character=$('milica');const portrait=presentation.character;
  character.hidden=!portrait;
  if(portrait){const sprite=CHARACTER_SPRITES[portrait][presentation.emotion];const nextSrc=new URL(`./assets/${sprite.file}.webp`,location.href).href;const changed=character.src!==nextSrc;character.src=nextSrc;character.alt=t(sprite.alt);preloadSprite(portrait,presentation.emotion);if(changed&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)character.animate([{opacity:.65,translate:'0 3px'},{opacity:1,translate:'0 0'}],{duration:180,easing:'ease-out'});}
  $('location').textContent=t(presentation.location);$('scene-time').textContent=t(presentation.time);
  document.querySelector('.scene-caption>span:last-child').textContent=t(node.day??'ПЕРВЫЙ ДЕНЬ');
  $('speaker').textContent=t(speakerName(page));
  $('game').dataset.voice=dialogueVoice(page);
  $('game').dataset.speaker=speakerIdentity(page,state.flags);
  $('voice-label').textContent=t(presentation.daydream?'Воображение':page.speaker==='narrator'?'Про себя':page.speaker==='player'?'Вслух':'');
  $('voice-label').hidden=!$('voice-label').textContent;
  const text=$('dialogue-text');text.textContent=t(interpolate(pageText(page,state.flags),state.profile,catalog));text.classList.toggle('message',!!page.message);
  const isChoice=state.index===node.pages.length-1&&!!node.choices;
  const action=beatActionAt(node,state.index);
  const inlineAction=!!action&&action.kind!=='tap';
  $('game').classList.toggle('has-beat',inlineAction);
  drawBeatAction($('beat-action'),$('beat-hotspots'),action,{text:value=>interpolate(resolveStoryText(value,state.flags),state.profile,catalog),perform:performBeat,tones:CHOICE_TONES,node,flags:state.flags});
  $('rewind').disabled=!state.rewind?.length;
  $('game').classList.toggle('has-choices',isChoice||inlineAction);
  $('next').hidden=isChoice||inlineAction;$('choices').hidden=!isChoice;$('choices').replaceChildren();
  if(isChoice)for(const choice of node.choices) {
    const button=document.createElement('button');button.type='button';button.className='choice';button.dataset.tone=choice.tone;
    appendChoiceContents(button,choice,{text:value=>interpolate(resolveStoryText(value,state.flags),state.profile,catalog),tones:CHOICE_TONES,node,flags:state.flags});
    button.addEventListener('click',()=>choose(choice));$('choices').append(button);
  }
  $('journal-dot').hidden=state.journal.length===0;
  const chapter=chapterFor(state,NODES);
  $('chapter-progress').textContent=t(chapter.number+' · Главы ↗');
  $('chapter-heading').hidden=state.node!==chapter.start||state.index!==0;
  $('chapter-heading').textContent=t(chapter.number+' · '+chapter.title);
  $('scene-day').textContent=t(node.day??'ПЕРВЫЙ ДЕНЬ');
  fitScene();
}
function renderMessenger(frame) {
  showScreen('messenger');
  let committed=false;
  messengerDispose=mountMessenger($('messenger'),frame,{
    canRewind:!!state.rewind?.length,
    onBack:goBack,
    onMenu:()=>openPanel('game-menu'),
    onSettings:()=>openPanel('settings'),
    onSend:reply=>{
      const ok=reply?(frame.replyKind==='action'?performBeat(reply.option,{render:false}):choose(reply.option,{render:false})):advance({render:false});
      committed=!!ok;return committed;
    },
    onContinue:()=>{
      if(committed)return renderGame();
      if(frame.physicalAction)return renderGame({skipMessenger:true});
      advance();
    }
  });
}
function fitScene() {
  document.documentElement.dataset.standalone=String(window.matchMedia('(display-mode: standalone)').matches||window.matchMedia('(display-mode: fullscreen)').matches||!!navigator.standalone);
  // Very short viewports and enlarged type remain readable through natural page scrolling.
  requestAnimationFrame(()=>{
    if(!$('home').hidden){const home=$('home'),title=document.querySelector('.home-title').getBoundingClientRect(),buttons=document.querySelector('.home-bottom').getBoundingClientRect(),bounds=home.getBoundingClientRect();positionArtwork($('home-art'),home,ART_FRAMES['ensemble-poster-buzz-v3'],{top:title.bottom-bounds.top+10,bottom:bounds.bottom-buttons.top+12,left:8,right:8});}
    const game=$('game');if(game.hidden)return;
    const sceneMinimum=parseFloat(getComputedStyle($('scene')).minHeight)||145;
    const minimum=document.querySelector('.dialogue').offsetHeight+document.querySelector('.game-footer').offsetHeight+sceneMinimum;
    game.style.minHeight=minimum+'px';
    if(!$('scene-cg').hidden)positionArtwork($('scene-cg'),$('scene'),currentArtFrame,{top:parseFloat(getComputedStyle(document.querySelector('.game-header')).paddingTop)+2,bottom:8,left:8,right:8});
  });
}
function advance({render=true}={}) {
  if(!['game','messenger'].includes(view)||panel.open||transitionLock)return false;
  const node=NODES[state.node];
  const action=beatActionAt(node,state.index);
  if(action?.kind==='tap')return action.interaction==='baggage'?openBaggage():performBeat({}, {render});
  if((state.index===node.pages.length-1&&node.choices)||action)return;
  rememberStep(state);
  transitionLock=true;setTimeout(()=>transitionLock=false,120);
  if(state.index<node.pages.length-1)state.index++;
  else enterNode(node.next);
  if(state.node!=='end')recordPage();
  save();if(render)renderGame();return true;
}
function openBaggage(){
  const origin={node:state.node,index:state.index};
  showScreen('interaction');fitScene();
  interactionDispose=mountBaggageInteraction({canvas:$('interaction-canvas'),image:$('interaction-image'),hotspot:$('interaction-hotspot'),onComplete:()=>{
    if(view!=='interaction'||state.node!==origin.node||state.index!==origin.index)return;
    showScreen('game');performBeat();
  }});
  $('interaction-title').focus({preventScroll:true});
}
function applyEffects(effect={}) {
  Object.assign(state.flags,effect);
  if(['romance','friendship'].includes(effect.eveningIntent)&&state.flags.companion)state.flags[state.flags.companion+'Bond']=effect.eveningIntent;
  if(['romance','friendship'].includes(effect.cinemaAirportBond)&&state.flags.companion)state.flags[state.flags.companion+'Bond']=effect.cinemaAirportBond;
  if(effect.hostBond&&state.flags.host)state.flags[state.flags.host+'Bond']=effect.hostBond;
  if(effect.districtBond&&state.flags.districtOwner)state.flags[state.flags.districtOwner+'Bond']=effect.districtBond;
}
function performBeat(option={}, {render=true}={}) {
  if(!['game','messenger'].includes(view)||panel.open||transitionLock)return false;
  const node=NODES[state.node],action=beatActionAt(node,state.index);if(!action)return;
  rememberStep(state);transitionLock=true;setTimeout(()=>transitionLock=false,160);
  const label=option.label??action.label;
  state.log.push({speaker:'Действие',text:interpolate(resolveStoryText(label,state.flags,'ru'),state.profile,catalog,'ru'),choice:true});
  applyEffects(action.effect);applyEffects(option.effect);
  for(const entry of action.journal??[])if(!state.journal.includes(entry))state.journal.push(entry);
  if(option.next??action.next)enterNode(option.next??action.next);
  else if(state.index<node.pages.length-1)state.index++;
  else enterNode(node.next);
  if(state.node!=='end')recordPage();save();if(render)renderGame();
  if(option.feedback??action.feedback)toast(option.feedback??action.feedback);
  return true;
}
function choose(choice, {render=true}={}) {
  if(transitionLock||panel.open||!['game','messenger'].includes(view))return false;
  rememberStep(state);
  transitionLock=true;setTimeout(()=>transitionLock=false,160);
  state.log.push({speaker:'Твой выбор',text:interpolate(resolveStoryText(choice.label,state.flags,'ru'),state.profile,catalog,'ru'),choice:true});
  applyEffects(choice.effect);enterNode(choice.next);recordPage();save();if(render)renderGame();return true;
}
function renderEnding() {
  setMusicScene('prologue');
  showScreen('ending');
  $('ending-rewind').disabled=!state.rewind?.length;
  const continuation=continuationFor(state);
  $('continue-story').hidden=!continuation;
  $('continue-story').textContent=(()=>{const day=CHAPTERS.find(c=>c.start===continuation);return day?.day?t('Продолжить · День '+day.day):t(continuation==='next_steps'?'Продолжить · Счёт на себя':'Продолжить · Своя дверь');})();
  $('ending-title').innerHTML=html(state.flags.chapterOneComplete?'Уже не только<br><em>адрес</em>':'Пока только<br><em>адрес</em>');
  const finalBackground={dorcol:'dorcol-apartment',vracar:'vracar-apartment',newbelgrade:'new-belgrade-apartment'}[state.flags.district]??'first-room';
  $('ending').style.backgroundImage=state.flags.chapterOneComplete?`linear-gradient(#164d5d55,#123d49ed),url('./assets/${finalBackground}.webp')`:'';
  $('ending-memory').textContent=t(state.flags.companion==='nikola'?'«Если захочешь ещё кифлу — теперь знаешь, у кого спросить».':state.flags.topic==='sketch'?'«У первой части истории — счастливый конец».':'«Polako. Не спеши».');
  if(state.flags.chapterOneComplete)$('ending-memory').textContent=t(({dorcol:'Дорћол',vracar:'Врачар',newbelgrade:'Новый Белград'}[state.flags.district]??'Белград')+'. Первый просмотр — уже часть твоей истории.');
  if(state.flags.chapterThreeComplete){$('ending-title').innerHTML=html('Своим<br><em>голосом</em>');$('ending-memory').textContent=t('Завтра — первый визит. Сегодня — ещё один свой вечер.');}
  document.querySelector('.ending-inner .demo-note').innerHTML=html(state.flags.chapterFourComplete?'Продолжение следует.<br>Дальше — документы для проживания и кино во дворе.':'Продолжение следует.<br>Дальше — визит в банк, своё дело и новые встречи.');
  if(state.flags.chapterFourComplete){$('ending-title').innerHTML=html('Больше, чем<br><em>планы</em>');$('ending-memory').textContent=t('Завтра — новые вопросы. В субботу — кино во дворе.');}
  if(state.flags.chapterFiveComplete){$('ending-title').innerHTML=html('Право<br><em>на завтра</em>');$('ending-memory').textContent=t('Следующий шаг понятен. Суббота уже в календаре.');}
  if(state.flags.chapterSixComplete){$('ending-title').innerHTML=html('Свет<br><em>во дворе</em>');$('ending-memory').textContent=t('Здесь есть люди, которые оставят тебе место.');}
  document.querySelector('.ending-inner .eyebrow').textContent=t(state.flags.chapterSevenComplete?'КОНЕЦ ИСТОРИИ':'ПРОДОЛЖЕНИЕ СЛЕДУЕТ');
  if(state.flags.chapterSevenComplete){const f=state.flags.finalChoice;$('ending-title').innerHTML=html(f==='stay'?'Остаюсь<br><em>в Белграде</em>':f==='leave'?'Домой<br><em>с летом</em>':'До осени<br><em>по плану</em>');$('ending-memory').textContent=t(f==='stay'?'У этого города теперь есть твой стул.':f==='leave'?'Лето осталось с тобой, куда бы ты ни летел.':'Дверь приоткрыта. Войти в неё решишь ты.');}
  if(state.flags.chapterFiveComplete)document.querySelector('.ending-inner .demo-note').innerHTML=html(state.flags.chapterSevenComplete?'Конец истории.<br>Спасибо за это лето в Сербии.':state.flags.chapterSixComplete?'Продолжение следует.<br>Дальше — новые решения и встречи.':'Продолжение следует.<br>Дальше — кино во дворе и вечер с близкими.');
  document.querySelector('.ending-inner>p:not(.eyebrow):not(.demo-note)').innerHTML=html(state.flags.chapterSevenComplete?'Это был твой ответ.<br>Любой из них был честным.':state.flags.chapterSixComplete?'У этой жизни уже есть люди.<br>Дальше ты выберешь, куда она приведёт.':state.flags.chapterFiveComplete?'Одни дела завершены.<br>Для остальных выбран следующий шаг.':state.flags.chapterFourComplete?'Первые ответы получены.<br>А у новых знакомств появился свой вечер.':state.flags.chapterThreeComplete?'Вопросы для банка готовы.<br>А у новой встречи уже есть продолжение.':state.flags.chapterOneComplete?'У тебя есть ключ, первый вечер<br>и свой маршрут по Белграду.':'Сегодня у тебя появился адрес.<br>И человек, которому можно написать.');
}
function goBack() {
  if(panel.open||transitionLock||!state||!['game','messenger','ending'].includes(view))return;
  if(!rewindStep(state))return;
  state.chapterMarks=readChapterMarks(state.chapterMarks,NODES,JOURNAL,state.log.length);
  transitionLock=true;setTimeout(()=>transitionLock=false,160);
  save();renderGame();
}
panel.addEventListener('close',()=>{if(!panel.open)panel.classList.remove('chapter-map');});
function openChapters() {
  if(panel.open)panel.close();
  const source=['game','messenger','ending'].includes(view)?state:saved;
  $('panel-title').textContent=t('Главы');
  const content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();
  const current=source?chapterFor(source,NODES):null;
  drawChapterMap(content,{chapters:CHAPTERS,source,current,onSelect:chapter=>confirmChapter(chapter,source)});
  panel.classList.add('chapter-map');panel.showModal();
  requestAnimationFrame(()=>{const active=content.querySelector('[aria-current="step"]');if(active)active.scrollIntoView({block:'center'});else content.scrollTop=0;});
}
function confirmChapter(chapter,source){
  panel.classList.remove('chapter-map');
  $('panel-title').textContent=t('Вернуться к главе?');
  const content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();
  const p=document.createElement('p');p.className='confirm-copy';p.textContent=t(chapter.number+' · '+chapter.title+'. Вернёмся к сохранённой точке главы. Выборы до неё сохранятся. Последующие события и отношения нужно будет пройти заново. Текущую историю можно сначала скачать.');
  const actions=document.createElement('div');actions.className='confirm-actions';
  const start=document.createElement('button');start.className='primary';start.textContent=t('Перейти к главе');start.addEventListener('click',()=>{
    const restored=structuredClone(source);if(!restartChapter(restored,chapter.id,NODES))return;
    state=restored;recordPage();save();panel.close();if(settings.music)applyMusic(true);renderGame();
  });
  const download=document.createElement('button');download.className='secondary';download.textContent=t('Скачать текущую историю');download.addEventListener('click',exportSave);
  const cancel=document.createElement('button');cancel.className='text-button';cancel.textContent=t('Остаться здесь');cancel.addEventListener('click',openChapters);
  actions.append(start,download,cancel);content.append(p,actions);
}
function openPanel(kind) {
  panel.classList.remove('chapter-map');
  if(kind==='account')return openAccount();
  if(kind==='chapters')return openChapters();
  const content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();
  if(kind==='game-menu') {
    $('panel-title').textContent=t('Пауза');
    const actions=document.createElement('div');actions.className='confirm-actions';
    for(const [label,run]of [['Продолжить игру',()=>panel.close()],['Выбрать главу',()=>{panel.close();openChapters();}],['На главный экран',()=>{panel.close();home();}]]){const button=document.createElement('button');button.className='secondary';button.textContent=t(label);button.addEventListener('click',run);actions.append(button);}
    const details=document.createElement('details');details.className='reading-details';const summary=document.createElement('summary');summary.textContent=t('Реплики и заметки');details.append(summary);
    for(const [label,kind]of [['Прочитанные реплики','history'],['Заметки о людях и планах','journal']]){const button=document.createElement('button');button.className='text-button';button.textContent=t(label);button.addEventListener('click',()=>{panel.close();openPanel(kind);});details.append(button);}
    content.append(actions,details);
  } else if(kind==='history') {
    $('panel-title').textContent=t('История реплик');
    if(!state?.log.length){const p=document.createElement('p');p.className='journal-empty';p.textContent=t('Здесь появится история вашего первого дня.');content.append(p);}
    else for(const entry of state.log) {const item=document.createElement('div');item.className='history-entry'+(entry.choice?' choice-entry':'');const label=document.createElement('small');item.dataset.voice=entry.voice??(entry.speaker==='Ты'?'thought':'other');label.textContent=t((entry.speaker==='Ты'?named(state.profile).full.nominative:familySpeaker(entry.speaker))+(item.dataset.voice==='thought'?' · про себя':item.dataset.voice==='speech'?' · вслух':''));const p=document.createElement('p');p.textContent=t(translateHistory(familyText(entry.text),state.profile,catalog));item.append(label,p);content.append(item);}
  } else if(kind==='journal') {
    $('panel-title').textContent=t('Твой дневник');
    const intro=document.createElement('p');intro.className='journal-intro';intro.textContent=t(state?`${named(state.profile).full.nominative} · история в Белграде`:'Люди, планы и небольшие воспоминания.');content.append(intro);
    if(!state?.journal.length){const p=document.createElement('p');p.className='journal-empty';p.textContent=t('Первые записи появятся по ходу истории.');content.append(p);}
    else for(const id of state.journal) {const entry=JOURNAL[id];const article=document.createElement('article');article.className='journal-entry';const tag=document.createElement('p');tag.className='entry-tag';tag.textContent=t(entry.tag);const title=document.createElement('h3');title.textContent=t(entry.title);const body=document.createElement('p');body.textContent=t(entry.text);article.append(tag,title,body);if(entry.link){const a=document.createElement('a');a.href=entry.link;a.target='_blank';a.rel='noopener noreferrer';a.textContent=t(entry.linkText);article.append(a);}content.append(article);}
  } else {
    $('panel-title').textContent=t('Немного удобства');
    content.innerHTML=html(`<label class="setting"><span>Размер текста<small id="font-label">${settings.textSize} px</small></span><input id="font-size" aria-label="Размер текста" type="range" min="16" max="24" step="1" value="${settings.textSize}"></label><div class="setting theme-setting"><span>Тема<small>Как в системе — по настройке телефона</small></span><div class="theme-options" role="group" aria-label="Тема оформления"><button data-theme-preference="system" aria-pressed="${settings.theme==='system'}">В системе</button><button data-theme-preference="light" aria-pressed="${settings.theme==='light'}">Светлая</button><button data-theme-preference="dark" aria-pressed="${settings.theme==='dark'}">Тёмная</button></div></div><label class="setting"><span>Музыка<small>Меняется вместе со сценой</small></span><input id="music-toggle" type="checkbox" ${settings.music?'checked':''}></label><label class="setting"><span>Громкость<small id="volume-label">${Math.round(settings.volume*100)}%</small></span><input id="music-volume" aria-label="Громкость музыки" type="range" min="0" max="100" step="1" value="${Math.round(settings.volume*100)}"></label><div class="settings-actions"><button id="account-settings" class="secondary">Мой прогресс · аккаунт</button><button id="screen-info" class="secondary">Сведения об экране</button><button id="install-guide" class="secondary">На весь экран на iPhone</button><button id="export-save" class="secondary" ${saved?'':'disabled'}>Скачать сохранение</button><label class="import-label">Загрузить сохранение<input id="import-save" type="file" accept="application/json,.json" hidden></label><button class="text-button" id="menu-home">На главный экран</button></div><p class="settings-about">Сербское лето · первое знакомство<br>Прогресс сохраняется на устройстве. После входа можно синхронизировать его с аккаунтом или перенести файлом.<br><br>Персонажи и разговоры вымышлены. В истории уже есть аэропорт, заселение, первый вечер и просмотр квартиры. Играй в своём темпе.</p>`);
    document.querySelectorAll('[data-theme-preference]').forEach(button=>button.addEventListener('click',()=>{settings.theme=button.dataset.themePreference;writeLocal('settings',settings);applyTheme();document.querySelectorAll('[data-theme-preference]').forEach(option=>option.setAttribute('aria-pressed',String(option.dataset.themePreference===settings.theme)));}));
    $('font-size').addEventListener('input',event=>{settings.textSize=Number(event.target.value);$('font-label').textContent=t(settings.textSize+' px');document.documentElement.style.setProperty('--text-size',settings.textSize+'px');writeLocal('settings',settings);fitScene();});
    $('music-toggle').addEventListener('change',event=>applyMusic(event.target.checked));
    $('music-volume').addEventListener('input',event=>{settings.volume=Number(event.target.value)/100;setVolume(settings.volume);$('volume-label').textContent=t(event.target.value+'%');writeLocal('settings',settings);});
    $('account-settings').addEventListener('click',()=>{panel.close();openAccount();});
    $('screen-info').addEventListener('click',showScreenInfo);
    $('install-guide').addEventListener('click',showInstallGuide);
    $('export-save').addEventListener('click',exportSave);$('import-save').addEventListener('change',importSave);
    $('menu-home').addEventListener('click',()=>{panel.close();home();});
    mountWorkshopEntry(content,()=>{
      $('panel-title').textContent=t('Мастерская');
      mountWorkshop(content,{sprites:CHARACTER_SPRITES,backgrounds:BACKGROUNDS,back:()=>{
        content.classList.remove('workshop');panel.close();openPanel('settings');
      }});
    });
  }
  panel.showModal();
  if(kind==='history')requestAnimationFrame(()=>panel.scrollTop=panel.scrollHeight);
}
function saveDescription(progress) {
  if(!progress)return 'Пока нет сохранения';
  const name=named(progress.profile)?.full.nominative??'Персонаж';
  const chapter=NODES[progress.node]?.chapter??(progress.node==='end'?'Пройденный отрезок':'Пролог');
  return getLanguage()==='en'?`${t(name)} · ${t(chapter)} · ${progress.log.length} ${progress.log.length===1?'line':'lines'}`:`${name} · ${chapter} · ${progress.log.length} реплик`;
}
function openAccount() {
  if(panel.open)panel.close();
  $('panel-title').textContent=t('Мой прогресс');
  const content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();
  const description=document.createElement('p');description.className='account-description';description.textContent=t(saveDescription(saved));content.append(description);
  if(saved){
    const milestones=[['Знакомство',saved.log.length>0],['Заселение',saved.journal.includes('chapter_arrived')],['Первый вечер',saved.journal.includes('asya')],['Район',!!saved.flags.district],['Просмотр',saved.journal.includes('viewing_done')]];
    const steps=document.createElement('ol');steps.className='account-milestones';steps.setAttribute('aria-label',t('Этапы истории'));
    for(const [title,done] of milestones){const item=document.createElement('li');item.className=done?'complete':'';item.textContent=t((done?'✓ ':'○ ')+title);steps.append(item);}content.append(steps);
  }
  const status=document.createElement('p');status.className='account-status';status.textContent=t(cloud?.message??'Проверяем аккаунт…');content.append(status);
  if(cloud?.user){
    const name=document.createElement('p');name.className='account-identity';name.textContent=t('Аккаунт: '+cloud.user.displayName);content.append(name);
    if(cloud.conflict){
      const intro=document.createElement('p');intro.className='confirm-copy';intro.textContent=t(cloud.conflict.progress?'На устройстве и в аккаунте разные истории. Какую продолжить?':'Этот прогресс связан с другим аккаунтом. Перенести его в текущий?');content.append(intro);
      for(const [text,action] of [...(cloud.conflict.progress?[[`Из аккаунта: ${saveDescription(cloud.conflict.progress)}`,()=>cloud.useCloud()]]:[]),[`С этого устройства: ${saveDescription(saved)}`,()=>cloud.useLocal()]]){
        const button=document.createElement('button');button.className='secondary account-choice';button.textContent=t(text);button.addEventListener('click',async()=>{await action();openAccount();});content.append(button);
      }
    }else{
      const sync=document.createElement('button');sync.className='primary';sync.textContent=t('Синхронизировать сейчас');sync.disabled=!saved||cloud.busy;sync.addEventListener('click',()=>{cloud.queue(saved);cloud.flush();});content.append(sync);
    }
    if(recoveryCodeOnce)drawRecoveryCode(content,recoveryCodeOnce,()=>{recoveryCodeOnce=null;openAccount();});
    const out=document.createElement('button');out.type='button';out.className='text-button account-link';out.textContent=t('Выйти из аккаунта');out.disabled=cloud.busy;out.addEventListener('click',async()=>{if(cloud.busy)return;clearTimeout(cloud.timer);try{const response=await fetch('/api/account',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'logout'})});if(!response.ok)throw Error();cloud.user=null;cloud.pending=null;cloud.conflict=null;recoveryCodeOnce=null;await cloud.refresh();openAccount();}catch{toast('Не удалось выйти. Проверь связь и попробуй ещё раз.');}});content.append(out);
  }else{
    const intro=document.createElement('p');intro.className='auth-intro';intro.textContent=t('Войди, чтобы продолжить историю с другого устройства. Без входа прогресс остаётся в этом браузере.');content.append(intro);
    drawAccountForm(content,{mode:authMode,legacyAvailable:cloud?.legacyAvailable,onMode:mode=>{authMode=mode;openAccount();},onSuccess:async result=>{recoveryCodeOnce=result.recoveryCode??null;await cloud.refresh();openAccount();}});
  }
  const privacy=document.createElement('p');privacy.className='sound-hint';privacy.textContent=t('В аккаунте сохраняются персонаж, сцена, ответы и дневник. Другие игроки их не видят.');content.append(privacy);
  panel.showModal();
}
function exportSave() {
  if(!saved)return;
  const blob=new Blob([JSON.stringify(saved,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');anchor.href=url;anchor.download='serbian-summer-save.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
async function importSave(event) {
  const file=event.target.files?.[0];if(!file)return;
  try {if(file.size>500000)throw new Error('Файл слишком большой для сохранения пролога.');const parsed=validateSave(JSON.parse(await file.text()));state=parsed;state.updatedAt=Date.now();saved=state;save();panel.close();renderGame();toast('Сохранение загружено.');}
  catch(error){toast(error instanceof SyntaxError?'Это не файл сохранения игры.':error.message);}
  event.target.value='';
}
function confirmNewGame() {
  if(!saved)return chooseSound(beginCreation);
  $('panel-title').textContent=t('Начать новое лето?');
  $('panel-content').innerHTML=html('<p class="confirm-copy">Текущее автосохранение заменится, когда ты выберешь персонажа и начнёшь историю. Перед этим можно скачать его в настройках.</p><div class="confirm-actions"><button id="confirm-new" class="primary">Выбрать персонажа</button><button id="cancel-new" class="secondary">Продолжить текущую историю</button></div>');
  $('confirm-new').addEventListener('click',()=>{panel.close();draft={gender:null,nameId:null};writeLocal('draft',draft);chooseSound(beginCreation);});
  $('cancel-new').addEventListener('click',()=>panel.close());panel.showModal();
}
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{const action=button.dataset.action;if(action==='home')home();else if(action==='fullscreen')requestImmersiveMode();else openPanel(action);}));
window.addEventListener('ss-music-state',refreshMusicControls);
$('new-game').addEventListener('click',confirmNewGame);$('replay').addEventListener('click',confirmNewGame);
$('resume').addEventListener('click',()=>{const resume=()=>{state=structuredClone(saved);if(settings.music)applyMusic(true);renderGame();};if(settings.soundChosen)resume();else chooseSound(resume);});
$('creation-back').addEventListener('click',()=>{if(creationStep===1){creationStep=0;renderCreation();}else home();});
$('creation-next').addEventListener('click',()=>{if(creationStep===0){if(!draft.gender)return;creationStep=1;renderCreation();}else startGame();});
$('chapter-progress').addEventListener('click',openChapters);
$('interaction-back').addEventListener('click',renderGame);
$('next').addEventListener('click',advance);$('dialogue-text').addEventListener('click',advance);
$('continue-story').addEventListener('click',()=>{state.rewind=[];state.completed=false;const next=continuationFor(state);if(!next)return;enterNode(next);recordPage();save();renderGame();});
$('rewind').addEventListener('click',goBack);$('ending-rewind').addEventListener('click',goBack);
$('ending-journal').addEventListener('click',()=>openPanel('journal'));
$('close-panel').addEventListener('click',()=>panel.close());
panel.addEventListener('click',event=>{if(event.target===panel){const rect=panel.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)panel.close();}});
document.addEventListener('keydown',event=>{if((event.code==='Space'||event.code==='Enter')&&view==='game'&&!panel.open&&!/BUTTON|INPUT|A/.test(document.activeElement.tagName)){event.preventDefault();advance();}});
$('scene-cg').addEventListener('load',fitScene);$('home-art').addEventListener('load',fitScene);
document.fonts?.ready.then(fitScene);
window.addEventListener('pageshow',fitScene);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)fitScene();});
window.addEventListener('resize',fitScene);window.visualViewport?.addEventListener('resize',fitScene);
document.addEventListener('fullscreenchange',fitScene);
preloadSprite('milica');preloadSprite('nikola');
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',async()=>{if(button.dataset.language==='en'&&!translationsReady){try{await initialiseLanguage();translationsReady=true;}catch{toast('Не удалось загрузить английский перевод. Попробуй ещё раз.');return;}}setLanguage(button.dataset.language);writeLocal('language',getLanguage());applyStaticLanguage();updateLanguageUi();home();}));
home();
fitScene();
refreshMusicControls();

cloud=new CloudProgress({getLocal:()=>saved,restore:async input=>{saved=validateSave(input);state=structuredClone(saved);await writeSave(saved);if(['game','messenger','ending'].includes(view))renderGame();else home();},changed:()=>{if($('panel-title').textContent===t('Мой прогресс')&&panel.open&&!$('account-auth-form'))requestAnimationFrame(()=>{if(panel.open&&$('panel-title').textContent===t('Мой прогресс'))openAccount();});}});
cloud.refresh().then(()=>{if(new URL(location.href).searchParams.has('account')){history.replaceState(null,'',location.pathname);openAccount();}});
