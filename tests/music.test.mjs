import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES} from '../public/story.js';
import {cueFor,CHAPTER_CUES} from '../public/music-cues.js';
const audioSource=fs.readFileSync(new URL('../public/audio.js',import.meta.url),'utf8');
const files=Object.fromEntries([...audioSource.match(/const files=\{([^}]*)\}/)[1].matchAll(/(\w+):'([^']+)'/g)].map(m=>[m[1],m[2]]));
assert.deepEqual(Object.keys(files),['prologue','encounter','arrival','district','bank','daily','rain']);
for(const [key,file] of Object.entries(files)){
 const size=fs.statSync(new URL('../public/assets/'+file,import.meta.url)).size;
 assert.ok(size>600000&&size<3000000,key+' is a real track ('+size+' bytes)');
}
// Every scene resolves to a cue that exists, and the first five chapters have their own music.
for(const [id,node] of Object.entries(NODES))assert.ok(Object.hasOwn(files,cueFor(node)),id);
assert.equal(cueFor(NODES.quick_arrival),'prologue');assert.equal(cueFor(NODES.road_start),'arrival');assert.equal(cueFor(NODES.morning_start),'district');
assert.equal(cueFor(NODES.third_morning),'bank');assert.equal(cueFor(NODES.d3_start),'daily');assert.equal(cueFor(NODES.rain_break),'rain');
assert.equal(cueFor(NODES.d4_start),'prologue','Later chapters keep the old default until they get music of their own');
assert.equal(cueFor({music:'encounter',chapterId:'districts'}),'encounter','A scene may still choose its own cue');
assert.deepEqual(Object.keys(CHAPTER_CUES),['arrival','districts','work','day-3']);
// The cues are reproducible: the composer script defines each of the new ones.
const script=fs.readFileSync(new URL('../tools/music/compose_balkan.py',import.meta.url),'utf8');
for(const name of ['arrival','district','bank','daily','rain'])assert.match(script,new RegExp("CUES\\['"+name+"'\\]"));
console.log('Music: seven cues, the first five chapters have their own, every scene resolves to an existing track.');
