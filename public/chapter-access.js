// Preview access is a device preference, separate from story saves and workshop access.
import {readLocal,writeLocal} from './storage.js?v=0.16.0';
export const PUBLIC_LAST_DAY=5;
export const acceptsChapterCode=value=>typeof value==='string'&&value.normalize('NFKC').trim().toLocaleLowerCase('ru')==='вучич';
export const hasPreviewAccess=()=>readLocal('preview-chapters',false)===true;
export function unlockPreview(code){if(!acceptsChapterCode(code))return false;writeLocal('preview-chapters',true);return true;}
export const chapterAvailable=(chapter,preview=false)=>!chapter?.day||chapter.day<=PUBLIC_LAST_DAY||preview;
