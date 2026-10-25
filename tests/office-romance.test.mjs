import assert from 'node:assert/strict';
import {NODES,pageText} from '../public/story.js';
const thread=['d17_bank','d17_lazar','d17_teodora','d17_bank_talk','d17_bank_joke','d24_bank','d24_bank_coffee','d24_bank_chat','d20_mup','d20_ivana','d20_strahinya','d20_mup_talk','d20_mup_reply','d26_mup','d26_mup_end'];
for(const id of thread)assert.ok(NODES[id],id);
// The threads are reachable from their days and return to them.
for(const [day,entry,rejoin] of [[17,'d17_bank','d17_mid'],[24,'d24_bank','d24_mid'],[20,'d20_mup','d20_mid'],[26,'d26_mup','d26_mid']]){
 assert.ok(NODES['d'+day+'_start'].choices.some(c=>c.next===entry),'Day '+day+' offers the thread');
 const seen=new Set(),stack=[entry];while(stack.length){const id=stack.pop();if(seen.has(id)||id===rejoin)continue;seen.add(id);for(const next of NODES[id].choices?NODES[id].choices.map(c=>c.next):[NODES[id].next])stack.push(next);}
 assert.ok([...seen].every(id=>NODES[id].chapterId===NODES['d'+day+'_start'].chapterId),'The thread stays inside day '+day);
}
// Closeness is always a choice with a friendly or professional alternative beside it.
for(const id of thread.filter(id=>NODES[id].choices)){
 const tones=NODES[id].choices.map(c=>c.tone);
 if(tones.includes('romance'))assert.ok(tones.includes('practical')||tones.includes('friendship')||tones.includes('personal'),id+' needs a non-romantic option');
}
// Nothing in the threads changes the application, the bank account or the permit; they only record how the player felt.
const allowed=/^(bankSpark|bankBond|bankDate|mupSpark|mupBond|mupFuture)$/;
for(const id of thread){
 for(const choice of NODES[id].choices??[])for(const key of Object.keys(choice.effect??{}))assert.match(key,allowed,id+' changes '+key);
 for(const key of Object.keys(NODES[id].effectOnEnter??{}))assert.match(key,allowed,id+' changes '+key);
}
// Staff of the police administration say that personal conversation waits for a closed case and that they decide nothing.
const text=id=>JSON.stringify(NODES[id].pages);
assert.match(text('d20_ivana'),/дела не решаю/);assert.match(text('d20_strahinya'),/дела не решаю/);assert.match(text('d20_mup_reply'),/пока дело открыто/);assert.match(text('d26_mup'),/когда дело закроется/);
for(const id of thread)assert.ok(!/ускор|без очереди|в обход|одобр/iu.test(text(id)),'No favours or approvals: '+id);
// Wording follows who the player met and how they felt.
const line=(id,index,flags)=>pageText(NODES[id].pages[index],flags);
const romantic={bankBond:'romance',bankSpark:'lazar'},friendly={bankBond:'friendship',bankSpark:'teodora'};
assert.notEqual(line('d24_bank',1,romantic),line('d24_bank',1,friendly));
assert.notEqual(line('d24_bank',1,romantic),line('d24_bank',1,{}));
assert.match(line('d24_bank_coffee',0,{bankBond:'none'}),/Спасибо, но я предпочитаю/);
assert.match(line('d24_bank_coffee',1,{bankBond:'none'}),/Отказ вежливый/);
assert.match(line('d26_mup',1,{mupBond:'spark',mupSpark:'ivana'}),/не как сотрудник/);assert.doesNotMatch(line('d26_mup',1,{mupBond:'none'}),/не как сотрудник/);
console.log('Office threads: bank and police administration, voluntary closeness, no favours, no effect on the application.');
