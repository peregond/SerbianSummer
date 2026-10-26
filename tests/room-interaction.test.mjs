import assert from 'node:assert/strict';
import{ROOM_TASKS,completeRoomTask}from'../public/room-interaction.js';
const orders=[[1,2,4],[1,4,2],[2,1,4],[2,4,1],[4,1,2],[4,2,1]];
for(const order of orders){let mask=0;for(const bit of order){const before=mask;mask=completeRoomTask(mask,bit);assert.equal(completeRoomTask(mask,bit),mask,'Repeated clicks do not undo a completed task');assert.equal(mask&before,before);}assert.equal(mask,7);}
assert.equal(new Set(ROOM_TASKS.map(task=>task.id)).size,3);
for(const task of ROOM_TASKS){const r=task.rect;assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=1&&r.y+r.height<=1);}
console.log('All six room-task orders, repeated clicks and image-relative target bounds checked.');
