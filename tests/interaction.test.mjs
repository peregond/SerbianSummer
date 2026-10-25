import assert from 'node:assert/strict';
import {imageHotspotRect} from '../public/interaction.js';
import {speakerIdentity} from '../public/dialogue-voice.js';
import {NODES,presentationFor} from '../public/story.js';
const target={x:.24,y:.53,width:.39,height:.1};
for(const[width,height]of [[390,398],[390,592],[320,316]]){
 const rect=imageHotspotRect(width,height,941,1672,target);
 assert.ok(rect.width>=44&&rect.height>=44);
 assert.ok(rect.left>=0&&rect.left+rect.width<=width);
 assert.ok(rect.top>=0&&rect.top+rect.height<=height);
}
assert.equal(speakerIdentity({speaker:'narrator'}),'player');
assert.equal(speakerIdentity({speaker:'player'}),'player');
assert.equal(speakerIdentity({speaker:'milica'}),'milica');
assert.equal(speakerIdentity({speaker:'contact'},{companion:'nikola'}),'nikola');
assert.equal(speakerIdentity({speaker:'host'},{host:'jelena'}),'jelena');
assert.equal(NODES.quick_arrival.actions[2].interaction,'baggage');
for(const id of ['quick_coffee','city','pause']){
 const p=presentationFor(NODES[id],NODES[id].pages[0]);assert.equal(p.character,null);assert.equal(p.seated,true);assert.match(p.bg,/^milica-table-/);
}
for(let i=2;i<=7;i++){
 const p=presentationFor(NODES.sketch,NODES.sketch.pages[i]);assert.equal(p.bg,'milica-sketch-bouquet');assert.equal(p.character,null);assert.equal(p.insert,true);
}
assert.equal(NODES.sketch.actions[2].label,'Рассмотреть рисунок');
console.log('Interactive baggage hit area remains over the suitcase; speaker identity, seated Milica and sketch inserts checked.');
