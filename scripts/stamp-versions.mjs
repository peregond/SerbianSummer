// Cache-busting helper. Modules are imported as './name.js?v=...'; a stale query string keeps an old copy in the iPhone/PWA cache.
// Usage: node scripts/stamp-versions.mjs [base-ref]   (default origin/main)
// Every public/*.js module that differs from base-ref gets its import specifiers rewritten, in all importers, to the
// current APP_VERSION from public/release.js. Use --check to only report modules that would change (exit 1 if any).
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2),check=args.includes('--check'),base=args.find(a=>!a.startsWith('--'))||'origin/main';
const version=/APP_VERSION='([^']+)'/.exec(fs.readFileSync(path.join(root,'public/release.js'),'utf8'))[1];
const changed=new Set(execFileSync('git',['diff','--name-only',base,'--','public'],{cwd:root,encoding:'utf8'}).split('\n')
 .filter(f=>/^public\/[^/]+\.js$/.test(f)).map(f=>path.basename(f)));
const pattern=/(from\s*|import\s*\(\s*)(['"])(\.\/([\w.-]+\.js))\?v=([^'"]+)\2/g;
let rewritten=0;const stale=new Set();
for(const file of fs.readdirSync(path.join(root,'public')).filter(f=>f.endsWith('.js'))){
 const full=path.join(root,'public',file),source=fs.readFileSync(full,'utf8');
 const next=source.replace(pattern,(match,lead,quote,spec,name,old)=>{
  if(!changed.has(name)||old===version)return match;
  stale.add(name);rewritten++;return `${lead}${quote}${spec}?v=${version}${quote}`;
 });
 if(next!==source&&!check)fs.writeFileSync(full,next);
}
if(check){console.log(rewritten?`Stale import versions for: ${[...stale].join(', ')}`:`Import versions are current for ${changed.size} changed module(s).`);process.exit(rewritten?1:0);}
console.log(`Stamped ${rewritten} import(s) of ${stale.size} changed module(s) with ${version}.`);
