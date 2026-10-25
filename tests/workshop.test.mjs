import assert from 'node:assert/strict';
import fs from 'node:fs';
import { acceptsWorkshopCode, buildArtCatalog, PEOPLE, EMOTIONS } from '../public/workshop-model.js';
import { CHARACTER_SPRITES, BACKGROUNDS, NODES } from '../public/story.js';

assert.ok(acceptsWorkshopCode('грызуны'));
assert.ok(acceptsWorkshopCode('  ГРЫЗУНЫ  '));
for (const invalid of ['', 'грызун', 'xгрызуны', 'грызуныx', null, 123]) assert.equal(acceptsWorkshopCode(invalid), false);
const files = JSON.parse(fs.readFileSync(new URL('../public/art-assets.json', import.meta.url)));
for (const file of files) assert.ok(fs.existsSync(new URL('../public/assets/' + file, import.meta.url)), file);
const before = JSON.stringify({ CHARACTER_SPRITES, BACKGROUNDS, NODES });
const catalog = buildArtCatalog(files, CHARACTER_SPRITES, BACKGROUNDS);
assert.equal(JSON.stringify({ CHARACTER_SPRITES, BACKGROUNDS, NODES }), before, 'Browsing must never mutate story data');
assert.equal(catalog.people.length, 11);
const entry = file => catalog.entries.find(e => e.file === file);
assert.equal(entry('luka-reference-friendly-v3.webp').status, 'active');
assert.equal(entry('luka-friendly.webp').status, 'archive');
assert.equal(entry('nikola-evening-friendly-buzz-v3.webp').look, 'После смены');
assert.equal(entry('milica-table-laughing.webp').status, 'active');
assert.equal(entry('dragan-kitchen-comfort.webp').emotion, null, 'Scene artwork is not a facial expression');
assert.equal(entry('nikola-icon-32-buzz-v3.png').character, undefined, 'Icons are not portraits');
assert.equal(entry('prologue-theme.m4a').category, 'audio');
for (const id of ['lazar', 'teodora', 'ivana', 'strahinja', 'milos']) {
  const person = catalog.people.find(p => p.id === id);
  assert.ok(person.art.some(e => e.status === 'draft'), id);
  assert.deepEqual(person.missing, ['thoughtful', 'laughing', 'flirty']);
}
const archiveOnly = buildArtCatalog(['luka-friendly.webp'], {}, {}).people.find(p => p.id === 'luka');
assert.ok(archiveOnly.missing.includes('friendly'), 'An archived portrait must not hide missing current artwork');
const translations = JSON.parse(fs.readFileSync(new URL('../public/locales/en.json', import.meta.url)));
for (const label of [...Object.values(PEOPLE), ...Object.values(EMOTIONS), 'Промокод', 'Мастерская', 'Чего не хватает']) assert.ok(translations[label], label);
console.log('Workshop: promo entry, complete inventory, active/draft/archive status, expression gaps, translations and story immutability checked.');
