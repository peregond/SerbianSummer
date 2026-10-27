import {RENTAL_NAMES,rentalOwner} from './rental-people.js?v=1';
import {SLOTS,nameOf,nameCase,loveNames,joinNames} from './romance.js?v=0.16.1';
// Russian remains the canonical language of story data and saves.
// Only rendered strings change, so language never changes choices or checkpoints.
let language='ru', dictionary={}, phrases=null;
const historyCache=new Map();
export const getLanguage=()=>language;
export function detectLanguage(saved,languages=[]){
  if(['ru','en'].includes(saved))return saved;
  const preferred=Array.isArray(languages)?languages[0]:languages;
  return /^ru(?:-|$)/i.test(preferred??'')?'ru':'en';
}
export function configureTranslations(values){dictionary=values;phrases=null;historyCache.clear();}
export function setLanguage(value){if(!['ru','en'].includes(value))return false;language=value;return true;}
export function t(value,locale=language){
  if(typeof value!=='string'||locale!=='en')return value;
  if(Object.hasOwn(dictionary,value))return dictionary[value];
  // Composed UI labels: chapter number + title, account status, version, etc.
  if(!/[А-Яа-яЁё]/.test(value))return value;
  if(!phrases){
    const keys=Object.keys(dictionary).filter(k=>/[А-Яа-яЁё]/.test(k)&&k.length>=3).sort((a,b)=>b.length-a.length);
    const escape=s=>[...s].map(c=>'\\^$.*+?()[]{}|'.includes(c)?'\\'+c:c).join('');
    phrases=new RegExp(keys.map(k=>(/^[\p{L}\p{N}]/u.test(k)?'(?<![\\p{L}\\p{N}_])':'')+escape(k)+(/[\p{L}\p{N}]$/u.test(k)?'(?![\\p{L}\\p{N}_])':'')).join('|'),'gu');
  }
  return value.replace(phrases,match=>dictionary[match]);
}
export async function initialiseLanguage(){
  let saved;try{saved=JSON.parse(localStorage.getItem('ss-language'));}catch{}
  const chosen=detectLanguage(saved,navigator.languages?.length?navigator.languages:[navigator.language]);
  const response=await fetch('./locales/en.json?v=0.16.1');
  if(!response.ok)throw Error('Translation unavailable');
  configureTranslations(await response.json());setLanguage(chosen);
  return chosen;
}
export function localizeDom(root=document){
  const doc=root.ownerDocument??root;
  const walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){
    if(['SCRIPT','STYLE','TEXTAREA'].includes(node.parentElement?.tagName))continue;
    const raw=node.nodeValue,trimmed=raw.trim();if(!trimmed)continue;
    node.nodeValue=raw.replace(trimmed,t(trimmed));
  }
  const all=[...(root.nodeType===1?[root]:[]),...root.querySelectorAll('*')];
  for(const element of all)for(const attr of ['aria-label','title','placeholder','alt'])if(element.hasAttribute(attr))element.setAttribute(attr,t(element.getAttribute(attr)));
}
export function html(markup){
  if(language!=='en')return markup;
  const template=document.createElement('template');template.innerHTML=markup;localizeDom(template.content);return template.innerHTML;
}
export function resolvePeople(text,flags={},locale=language){
  const host=flags.host==='jelena'?'Йелена':'Драган';
  const owner=RENTAL_NAMES[rentalOwner(flags)]??(flags.districtOwner==='jelena'?'Йелена':'Драган');
  return t(text,locale).replaceAll('{host.dative}',locale==='en'?t(host,'en'):host==='Йелена'?'Йелене':'Драгану').replaceAll('{host}',t(host,locale)).replaceAll('{districtHost}',t(owner,locale))
    .replace(/\{who\.([a-z]+)(?:\.(acc|ins))?\}/g,(match,slot,grammarCase)=>SLOTS.includes(slot)?(locale==='en'?t(nameOf(slot,flags),'en'):nameCase(slot,flags,grammarCase)):'')
    .replaceAll('{partner}',t(SLOTS.includes(flags.lastPartner)?nameOf(flags.lastPartner,flags):'Ася',locale))
    .replaceAll('{loveList}',joinNames(loveNames(flags).map(name=>t(name,locale)),locale==='en'?'and':'и'));
}
export function interpolateText(text,profile,catalog,locale=language){
  const entry=catalog.genders[profile.gender].names.find(n=>n.id===profile.nameId);
  return text.replace(/\{([^}]+)\}/g,(_,token)=>{
    if(token==='full'||token==='short')return t(entry[token==='full'?'full':'familiar'].nominative,locale);
    if(token==='a')return locale==='en'?'':profile.gender==='female'?'а':'';
    if(token==='similar')return locale==='en'?'like':profile.gender==='female'?'похожей':'похожим';
    const [kind,form]=token.split('.');
    if(['full','short'].includes(kind))return t(entry[kind==='full'?'full':'familiar'][locale==='en'?'nominative':form]??'',locale);
    return '';
  });
}
export function translateHistory(text,profile,catalog){
  if(language!=='en')return text;
  const key=profile.gender+':'+profile.nameId;
  if(!historyCache.has(key)){
    const rendered=new Map();
    for(const [ru,en]of Object.entries(dictionary)){
      // {call} is the address form a speaker picks (full or short name) when the page is shown.
      for(const form of ru.includes('{call}')?['{short}','{full}']:[null])
      for(const host of ['dragan','jelena'])for(const districtOwner of ['dragan','jelena','marko','vuk','stefan','ana']){
        const flags={host,districtOwner};
        const pick=value=>form?value.replaceAll('{call}',form):value;
        rendered.set(interpolateText(resolvePeople(pick(ru),flags,'ru'),profile,catalog,'ru'),interpolateText(resolvePeople(pick(en),flags,'en'),profile,catalog,'en'));
      }
    }
    historyCache.set(key,rendered);
  }
  return historyCache.get(key).get(text)??t(text);
}

export function captureStaticUi(root){
  const texts=[],attributes=[];const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while((n=walker.nextNode()))if(!['SCRIPT','STYLE'].includes(n.parentElement?.tagName))texts.push([n,n.nodeValue]);
  for(const el of root.querySelectorAll('*'))for(const attr of ['aria-label','title','placeholder','alt'])if(el.hasAttribute(attr))attributes.push([el,attr,el.getAttribute(attr)]);
  const metadata=[...root.querySelectorAll('meta[name="description"],meta[name="apple-mobile-web-app-title"]')].map(el=>[el,el.content]);
  return ()=>{for(const [node,value]of texts)if(node.isConnected)node.nodeValue=value;for(const [el,attr,value]of attributes)if(el.isConnected)el.setAttribute(attr,value);localizeDom(root);for(const [el,value]of metadata)el.content=t(value);};
}
