import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,START} from '../public/story.js';
import {CHAPTERS} from '../public/chapters.js';
import {buildStoryAtlas,buildStoryGraph,filterAtlasScenes,formatSceneNote,graphEdgePath} from '../public/story-atlas-model.js';

const before=JSON.stringify({NODES,CHAPTERS,START});
const atlas=buildStoryAtlas(NODES,CHAPTERS,START);
assert.equal(JSON.stringify({NODES,CHAPTERS,START}),before,'Atlas build must not mutate story data');

assert.equal(atlas.totals.start,START);
assert.ok(atlas.totals.scenes>=600,`expected many scenes, got ${atlas.totals.scenes}`);
assert.equal(atlas.totals.chapters,CHAPTERS.length);
assert.ok(atlas.scenes[START],'start scene is indexed');
assert.ok(Array.isArray(atlas.incoming[START])||atlas.incoming[START]===undefined);

const prologue=atlas.chapters.find(chapter=>chapter.id==='prologue')||atlas.chapters[0];
assert.ok(prologue.sceneIds.includes(prologue.start));

const graph=buildStoryGraph(atlas,{chapterId:prologue.id});
assert.ok(graph.nodes.length>=1);
assert.ok(graph.byId[prologue.start],'chapter start is placed');
assert.ok(graph.edges.length>=1,'chapter has exits');
assert.ok(graph.width>graph.nodeW);
assert.ok(graph.height>graph.nodeH);
for(const edge of graph.edges){
  assert.ok(graph.byId[edge.from],edge.from);
  if(!edge.end&&edge.to)assert.ok(graph.byId[edge.to]||edge.external,edge.to);
}
const from=graph.byId[prologue.start];
const path=graphEdgePath(from,graph.nodes.find(n=>n.id!==from.id)||null,graph.nodeW,graph.nodeH);
assert.match(path,/^M/);

const focus=buildStoryGraph(atlas,{chapterId:'all',focusId:START,hops:1});
assert.ok(focus.byId[START]);
assert.ok(focus.nodes.length>=2,'neighbourhood includes exits');

const note=formatSceneNote(atlas.scenes[START]);
assert.match(note,/^ID: /);
assert.match(note,new RegExp(START));
assert.match(note,/Переходы:/);

const byChapter=filterAtlasScenes(atlas,{chapterId:prologue.id});
assert.ok(byChapter.every(scene=>scene.chapterId===prologue.id));

const translations=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url)));
for(const label of [
  'Сюжет',
  'Интерактивная схема сюжета: ходи по узлам, смотри реплики и копируй ID сцен для правок.',
  'Окрестность сцены','Схема сцен','К выбранной','← Назад по схеме','Входы',
  'Скопировать ID','Скопировать карточку',
  'Персонажи, эмоции, ресурсы и внутренняя карта сюжета. Здесь можно смотреть изображения, пробелы в наборе и ID сцен.'
])assert.ok(translations[label],label);

console.log(`Story atlas schema: ${atlas.totals.scenes} scenes; prologue graph ${graph.nodes.length} nodes / ${graph.edges.length} edges.`);
