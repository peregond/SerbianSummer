import assert from 'node:assert/strict';
import {NODES,JOURNAL,presentationFor,pageText} from '../public/story.js';
import {ART_FRAMES} from '../public/art-framing.js';
assert.equal(NODES.host_flirt.pages.length,5,'Old saves keep all five entry page indices');
assert.equal(NODES.district_romance.pages.length,4,'Later viewing save indices stay valid');
assert.equal(NODES.keys_room.choices[0].next,'host_flirt');
assert.match(NODES.keys_room.choices[0].label,/здесь, на кухне/);
assert.equal(NODES.host_flirt.next,'host_coffee_pour');
assert.equal(NODES.host_friend.next,'room_alone');
assert.equal(NODES.host_practical.next,'room_alone');
assert.equal(NODES.host_coffee_borrowed.next,'room_alone');
assert.equal(NODES.host_coffee_stay.next,'room_alone');
assert.equal(NODES.host_coffee_comfort.choices.length,2,'The player can leave or release the hand');
for(const host of ['dragan','jelena'])for(const node of Object.values(NODES))for(const page of node.pages){
 const p=presentationFor(node,page,{host,districtOwner:host});
 if(p.composite){assert.ok(ART_FRAMES[p.bg],p.bg+' needs protected head bounds');assert.equal(p.character,null,'Composite frames must not have a second standing portrait');}
}
assert.match(pageText(NODES.host_coffee_comfort.pages[1],{host:'jelena'}),/не обожглась/);
assert.match(pageText(NODES.host_coffee_change.pages[2],{host:'dragan'}),/татуировка/);
assert.match(pageText(NODES.host_coffee_lend.pages[0],{host:'dragan'}),/Under Armour/);
assert.match(pageText(NODES.host_coffee_borrowed.pages[0],{host:'jelena'}),/СПБГУ 2008/);
assert.ok(JOURNAL.host_coffee&&JOURNAL.borrowed_top);
console.log('Optional kitchen route: both hosts, hand reassurance, clothing choice, old save indices and protected image bounds checked.');
