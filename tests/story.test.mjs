import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,JOURNAL,START,BACKGROUNDS,CHARACTER_SPRITES,CHOICE_TONES,presentationFor,pageText,resolveStoryText,interpolate} from '../public/story.js';
const catalog=JSON.parse(fs.readFileSync(new URL('../public/names.json',import.meta.url),'utf8'));
const visited=new Set(),usedBackgrounds=new Set(),usedEmotions=new Set(),memo=new Map();
const contexts=[];
for(const companion of ['milica','nikola'])for(const host of ['dragan','jelena'])for(const district of ['dorcol','vracar','newbelgrade'])contexts.push({companion,host,district,districtOwner:district==='vracar'?'dragan':'jelena'});
function walk(id,ancestors=[]) {
  if(id==='end')return {paths:1,min:0,max:0};
  assert.ok(Object.hasOwn(NODES,id),`Missing node ${id}`);assert.ok(!ancestors.includes(id),`Cycle ${id}`);
  if(memo.has(id))return memo.get(id);
  visited.add(id);const node=NODES[id];assert.ok(node.pages.length);
  for(const page of node.pages)for(const flags of contexts){
    const p=presentationFor(node,page,flags);assert.ok(Object.hasOwn(BACKGROUNDS,p.bg));assert.ok(fs.existsSync(new URL('../public/assets/'+p.bg+'.webp',import.meta.url)),p.bg);usedBackgrounds.add(p.bg);
    if(p.character){const sprite=CHARACTER_SPRITES[p.character]?.[p.emotion];assert.ok(sprite,p.character+'/'+p.emotion);assert.ok(fs.existsSync(new URL('../public/assets/'+sprite.file+'.webp',import.meta.url)),sprite.file);if(p.character==='nikola')usedEmotions.add(p.emotion);}
    if(p.emotion.startsWith('dream-'))assert.ok(p.daydream);
    for(const gender of ['male','female'])for(const name of catalog.genders[gender].names){
      for(const mode of [flags,{...flags,nikolaBond:'friendship',milicaBond:'friendship'}]){const rendered=interpolate(pageText(page,mode),{gender,nameId:name.id},catalog);assert.ok(rendered.trim());assert.ok(!/[{}]/.test(rendered));assert.ok(!/лсяа|лся а|готова а/.test(rendered),rendered);}
    }
  }
  for(const journal of node.journal??[])assert.ok(Object.hasOwn(JOURNAL,journal));
  for(const choice of node.choices??[]){assert.ok(Object.hasOwn(CHOICE_TONES,choice.tone),choice.label);assert.ok(!/[{}]/.test(interpolate(resolveStoryText(choice.label,contexts[0]),{gender:'female',nameId:'anna'},catalog)));}
  const next=node.choices?node.choices.map(c=>c.next):[node.next];
  const descendants=next.map(target=>walk(target,[...ancestors,id]));
  const words=node.pages.reduce((sum,p)=>sum+p.text.split(/\s+/u).length,0);
  const stats={paths:descendants.reduce((sum,x)=>sum+x.paths,0),min:words+Math.min(...descendants.map(x=>x.min)),max:words+Math.max(...descendants.map(x=>x.max))};memo.set(id,stats);return stats;
}
const stats=walk(START);
// Older entrances remain loadable, but a new playthrough never goes backwards to them.
for(const [id,node]of Object.entries(NODES))if(node.legacyOnly)walk(id);
assert.equal(visited.size,Object.keys(NODES).length,'Unreachable scene');assert.equal(usedBackgrounds.size,Object.keys(BACKGROUNDS).length,'Unstaged background');assert.equal(usedEmotions.size,Object.keys(CHARACTER_SPRITES.nikola).length);
assert.equal(presentationFor(NODES.nikola_daydream,NODES.nikola_daydream.pages[4]).daydream,false);
assert.equal(NODES.district_map.choices.length,3);
assert.notEqual(NODES.district_map.choices[0].effect.districtOwner,NODES.district_map.choices[1].effect.districtOwner);
assert.equal(presentationFor(NODES.district_host_talk,NODES.district_host_talk.pages[0],{district:'vracar',districtOwner:'dragan'}).character,'dragan');
assert.equal(presentationFor(NODES.district_host_talk,NODES.district_host_talk.pages[0],{district:'dorcol',districtOwner:'jelena'}).bg,'dorcol-apartment');
assert.match(interpolate('приехал{a}',{gender:'female',nameId:'anna'},catalog),/приехала/);
assert.equal(interpolate('{full} / {full.dative} / {short.instrumental}',{gender:'male',nameId:'dmitry'},catalog),'Дмитрий / Дмитрию / Димой');
console.log(`${visited.size} сцен; ${usedBackgrounds.size} фонов; ${stats.min}–${stats.max} слов на пути. Граф, районы, персонажи, все имена и категории проверены.`);
