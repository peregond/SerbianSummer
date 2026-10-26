import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {NODES,BACKGROUNDS,CHARACTER_SPRITES,presentationFor,STORY_VERSION} from '../public/story.js';
import {REGULAR_MOODS,LIVING_BACKGROUND_SCENES,STORY_BACKGROUNDS} from '../public/living-art.js';
import {PEOPLE,buildArtCatalog} from '../public/workshop-model.js';
// Baseline 90fe350: all 445 scene IDs, page order/text, effects, actions and transitions.
// Only background selection and per-character reaction metadata may differ.
const canonical=JSON.parse(JSON.stringify(NODES),(key,value)=>['bg','districtBg','reactions'].includes(key)?undefined:value);
assert.equal(createHash('sha256').update(JSON.stringify(canonical)).digest('hex'),'87085f9faacdbe60e9ad7f4201389dcaee8e082de34fee97fe82f13e181459c7');
assert.equal(STORY_VERSION,1);
const files=JSON.parse(fs.readFileSync(new URL('../public/art-assets.json',import.meta.url)));
const catalog=buildArtCatalog(files,CHARACTER_SPRITES,BACKGROUNDS);
for(const id of Object.keys(PEOPLE)){
 const art=REGULAR_MOODS.map(mood=>CHARACTER_SPRITES[id]?.[mood]?.file);
 assert.equal(new Set(art).size,7,id+' needs a distinct illustration per regular emotion');
 for(const file of art)assert.ok(files.includes(file+'.webp'),id+'/'+file);
 assert.deepEqual(catalog.people.find(p=>p.id===id).missing,[],id);
}
for(const[bg,ids]of Object.entries(LIVING_BACKGROUND_SCENES)){
 assert.ok(files.includes(bg+'.webp'));
 for(const id of ids)for(const district of ['dorcol','vracar','newbelgrade'])assert.equal(presentationFor(NODES[id],NODES[id].pages[0],{district}).bg,bg);
}
for(const bg of Object.keys(STORY_BACKGROUNDS))assert.equal(catalog.entries.find(e=>e.file===bg+'.webp').category,'backgrounds');
const frame=(id,index,flags)=>presentationFor(NODES[id],NODES[id].pages[index],flags);
assert.equal(frame('d17_lazar',1,{bankSpark:'lazar'}).character,'lazar');
assert.equal(frame('d17_teodora',1,{bankSpark:'teodora'}).character,'teodora');
assert.equal(frame('d20_ivana',1,{mupSpark:'ivana'}).character,'ivana');
assert.equal(frame('d20_strahinya',1,{mupSpark:'strahinya'}).character,'strahinja');
const masked=NODES.d4_station.pages.findIndex(p=>p.speaker==='Человек в балаклаве');
assert.ok(masked>=0);assert.equal(frame('d4_station',masked,{}).character,'milos-masked');
assert.equal(frame('d4_station',masked,{maskedRevealed:true}).character,'milos-masked','Replaying a masked scene must not reveal his face');
assert.equal(frame('d20_nephew_end',0,{}).character,'milos-uniform','The kitchen text explicitly describes a uniform');
assert.equal(frame('d27_milos',0,{}).character,'milos','The riverside text explicitly describes casual clothing');
console.log('Living art: seven distinct regular moods for eleven heroes, staged backgrounds, dynamic office portraits, masked/uniform/casual continuity and unchanged story/save semantics checked.');
