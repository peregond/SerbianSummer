// Which music cue plays in a scene. A scene's own cue wins; otherwise the chapter decides (the first five chapters have their
// own relaxed cues with a Balkan flavour, see tools/music/compose_balkan.py); the older rule for cafés stays the fallback.
export const CHAPTER_CUES={arrival:'arrival',districts:'district',work:'bank','day-3':'daily'};
const CAFES=['airport-cafe','bakery','cafe-table','bakery-display','bakery-corner'];
export function cueFor(node){
 if(node.music)return node.music;
 if(node.bg==='belgrade-rain-cafe')return 'rain';
 if(CHAPTER_CUES[node.chapterId])return CHAPTER_CUES[node.chapterId];
 return CAFES.includes(node.bg)?'encounter':'prologue';
}
