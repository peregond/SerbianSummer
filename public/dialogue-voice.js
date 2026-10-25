export function dialogueVoice(page) {
 return page.speaker==='narrator'?'thought':page.speaker==='player'?'speech':page.message?'message':'other';
}
export function logVoice(entry) {
 return ['thought','speech','message','other'].includes(entry.voice)?{voice:entry.voice}:{};
}
export function speakerIdentity(page,flags={}){
 const id=page.speaker;
 if(['narrator','player'].includes(id)||id.startsWith('Ты →'))return 'player';
 if(id==='contact')return flags.companion??'milica';
 if(id==='host')return flags.host??'dragan';
 if(id==='districtHost')return flags.districtOwner??'jelena';
 for(const [key,name]of Object.entries({milica:'Милица',nikola:'Никола',dragan:'Драган',jelena:'Йелена',asya:'Ася',luka:'Лука'}))if(id===key||id.startsWith(name))return key;
 return 'other';
}
