import assert from 'node:assert/strict';
import fs from 'node:fs';
import { NODES, CHARACTER_SPRITES, presentationFor } from '../public/story.js';
for (const id of ['ana','marko','stefan','vuk']) {
  for (const [mode, expected] of Object.entries({terms:'thoughtful', friends:'laughing', flirt:'flirty'})) {
    const node = NODES[`rental_${mode}_${id}`];
    const picture = presentationFor(node, node.pages[0], {districtOwner:id, rentalCast:'new'});
    assert.equal(picture.character,id);
    assert.equal(picture.emotion,expected);
    assert.ok(fs.existsSync(new URL(`../public/assets/${CHARACTER_SPRITES[id][expected].file}.webp`, import.meta.url)));
  }
}
console.log('Rental portraits reflect the chosen conversation without changing story state.');
