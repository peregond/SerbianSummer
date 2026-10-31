import assert from 'node:assert/strict';
import fs from 'node:fs';
import {LOOKS,lookFor,defaultLook,avatarMarkup} from '../public/hero-looks.js';
import {matchNames,exactName} from '../public/name-picker.js';
const catalog=JSON.parse(fs.readFileSync(new URL('../public/names.json',import.meta.url)));
// Looks: five per gender, unique ids, valid markup, an image slot for each, and a prompt for every look.
assert.deepEqual(Object.keys(LOOKS),['male','female']);
const ids=[];
for(const [gender,list] of Object.entries(LOOKS)){
 assert.equal(list.length,5,gender);
 for(const look of list){
  ids.push(look.id);assert.equal(lookFor(gender,look.id),look);assert.equal(lookFor(gender==='male'?'female':'male',look.id),null,'A look belongs to one gender');
  const svg=avatarMarkup(gender,look.id);assert.match(svg,/^<svg[^>]*viewBox="0 0 64 64"/);assert.match(svg,new RegExp(look.skin));assert.ok(look.label&&look.image===null);
 }
 assert.equal(defaultLook(gender),list[0].id);
}
assert.equal(new Set(ids).size,10);assert.equal(avatarMarkup('male','nobody'),'');assert.equal(defaultLook('x'),null);
LOOKS.male[0].image='x.webp';assert.match(avatarMarkup('male','m1',{size:40}),/^<img[^>]*src="\.\/assets\/heroes\/x\.webp"[^>]*width="40"/,'A set image replaces the placeholder');LOOKS.male[0].image=null;
const prompts=JSON.parse(fs.readFileSync(new URL('../artwork/hero-looks/PROMPTS.json',import.meta.url)));
assert.deepEqual(prompts.looks.map(l=>l.id).sort(),[...ids].sort());
// Name matching: prefix first, then inside the name; ё/е and case ignored; only catalogue names; nothing for an empty query.
for(const gender of ['male','female']){
 const names=catalog.genders[gender].names;
 assert.deepEqual(matchNames(names,''),[]);assert.deepEqual(matchNames(names,'   '),[]);assert.deepEqual(matchNames(names,'zzzz'),[]);
 assert.ok(matchNames(names,'а',{limit:3}).length<=3);
 for(const name of names){
  const hits=matchNames(names,name.full.nominative.slice(0,2).toUpperCase(),{limit:50});
  assert.ok(hits.some(hit=>hit.id===name.id),name.full.nominative+' is found by its first letters');
  assert.equal(exactName(names,name.full.nominative.toLowerCase())?.id,name.id);
 }
}
const female=catalog.genders.female.names;
assert.equal(exactName(female,'АННА')?.id,'anna');assert.equal(exactName(female,'  мария ')?.full.nominative,'Мария');assert.equal(exactName(female,'Ма'),null,'A prefix is not a pick');
assert.equal(exactName(female,'маша')?.id,female.find(n=>n.familiar.nominative==='Маша').id,'The friendly form picks the same name');
// English mode: translated forms match too.
const label=text=>({'Мария':'Maria','Маша':'Masha'})[text]??text;
assert.equal(matchNames(female,'mar',{label})[0].full.nominative,'Мария');assert.equal(exactName(female,'masha',label)?.full.nominative,'Мария');
console.log('Hero creation: ten placeholder looks with image slots, typed name matching for both genders checked.');
