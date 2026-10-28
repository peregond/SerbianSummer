import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,START} from '../public/story.js';
import {CHAPTERS} from '../public/chapters.js';
import {buildStoryAtlas,filterAtlasScenes,formatSceneNote} from '../public/story-atlas-model.js';

const before=JSON.stringify({NODES,CHAPTERS,START});
const atlas=buildStoryAtlas(NODES,CHAPTERS,START);
assert.equal(JSON.stringify({NODES,CHAPTERS,START}),before,'Atlas build must not mutate story data');

assert.equal(atlas.totals.start,START);
assert.ok(atlas.totals.scenes>=600,`expected many scenes, got ${atlas.totals.scenes}`);
assert.equal(atlas.totals.chapters,CHAPTERS.length);
assert.ok(atlas.scenes[START],'start scene is indexed');
assert.equal(atlas.scenes[START].id,START);
assert.ok(atlas.scenes[START].pageCount>=1);
assert.ok(atlas.scenes[START].outs.length>=1);

const prologue=atlas.chapters.find(chapter=>chapter.id==='prologue'||chapter.start===START)||atlas.chapters[0];
assert.ok(prologue,'first chapter exists');
assert.ok(prologue.sceneIds.includes(prologue.start));
assert.equal(prologue.sceneCount,prologue.sceneIds.length);

for(const id of prologue.sceneIds){
  assert.ok(atlas.scenes[id],id);
  assert.equal(atlas.scenes[id].chapterId,prologue.id);
}

const note=formatSceneNote(atlas.scenes[START]);
assert.match(note,/^ID: /);
assert.match(note,new RegExp(START));
assert.match(note,/Страниц:/);
assert.match(note,/Переходы:/);

const all=filterAtlasScenes(atlas,{chapterId:'all',query:''});
assert.equal(all.length,atlas.totals.scenes);

const byChapter=filterAtlasScenes(atlas,{chapterId:prologue.id});
assert.ok(byChapter.length>=1);
assert.ok(byChapter.every(scene=>scene.chapterId===prologue.id));

const byId=filterAtlasScenes(atlas,{query:START});
assert.ok(byId.some(scene=>scene.id===START));

const noLegacy=filterAtlasScenes(atlas,{includeLegacy:false});
assert.ok(noLegacy.every(scene=>!scene.legacyOnly));
assert.ok(noLegacy.length<=atlas.totals.scenes);

const orphans=filterAtlasScenes(atlas,{chapterId:'orphans'});
assert.equal(orphans.length,atlas.orphans.length);
assert.deepEqual(orphans.map(scene=>scene.id).sort(),[...atlas.orphans].sort());

const translations=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url)));
for(const label of [
  'Сюжет',
  'Внутренняя карта сюжета: ID сцен, главы и переходы. Удобно копировать ID, когда присылаешь правки.',
  'сцен','глав','старт',
  'ID сцены, локация или фраза','Поиск по сценам','Все главы','Вне глав / legacy',
  'Показать legacyOnly','Скопировать ID','Скопировать карточку','Карточка сцены скопирована',
  'Найдено','Вне глав','Карта сюжета недоступна в этой сборке.',
  'Персонажи, эмоции, ресурсы и внутренняя карта сюжета. Здесь можно смотреть изображения, пробелы в наборе и ID сцен.'
])assert.ok(translations[label],label);

console.log(`Story atlas: ${atlas.totals.scenes} scenes, ${atlas.totals.chapters} chapters, ${atlas.orphans.length} orphans; filters and EN keys checked.`);
