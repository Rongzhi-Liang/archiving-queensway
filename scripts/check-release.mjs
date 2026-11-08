#!/usr/bin/env node
/** Offline checks for the public static site, independent of private research files. */
import assert from 'node:assert/strict';
import {readFile, readdir, stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import path from 'node:path';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=path.join(project,'dist');
const issues=[], files=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);assert(!entry.isSymbolicLink(),`Symbolic link in public site: ${path.relative(root,file)}`);if(entry.isDirectory())await walk(file);else files.push(file);}}
await walk(root);
const fileSet=new Set(files.map(f=>path.relative(root,f).split(path.sep).join('/')));
let bytes=0,js=0,json=0,links=0;
const textExtensions=new Set(['.js','.mjs','.json','.geojson','.html','.css','.svg','.txt']);
const privatePatterns=[/https?:\/\/(?:drive\.google\.com|docs\.google\.com|miro\.com)\//i,/\/Users\/|\/var\/folders\/|file:\/\//i,/gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/];
const reference=(raw,file,relativeToFile=false)=>{
 if(!raw||/[${}\n]/.test(raw)||/^(?:https?:|data:|blob:|mailto:|tel:|#)/i.test(raw))return;
 if(raw.startsWith('/')){issues.push(`${file}: root-relative asset path fails project Pages URLs`);return;}
 const clean=decodeURIComponent(raw.split(/[?#]/)[0]);if(!clean||clean.startsWith('#'))return;
 const resolved=path.posix.normalize(path.posix.join(relativeToFile?path.posix.dirname(file):'',clean));
 if(['.','./'].includes(resolved)||fileSet.has(resolved+'/index.html')){links++;return;}
 if(!fileSet.has(resolved))issues.push(`${file}: missing local reference ${clean}`);else links++;
};
const jsonFiles=new Map();
for(const absolute of files){
 const file=path.relative(root,absolute).split(path.sep).join('/'), size=(await stat(absolute)).size;bytes+=size;
 if(/(?:^|\/)(?:\.env(?:\..*)?|\.DS_Store|.*\.(?:pem|key|p12|pfx))$/i.test(file))issues.push(`${file}: local metadata or credential file in public directory`);
 if(size>=100*1024*1024)issues.push(`${file}: exceeds regular GitHub file limit`);
 if(!textExtensions.has(path.extname(file)))continue;
 const text=await readFile(absolute,'utf8');
 for(const [i,pattern] of privatePatterns.entries())if(!(i===1&&file.startsWith('vendor/'))&&pattern.test(text))issues.push(`${file}: private path, private-source link or credential pattern`);
 if(/\.(?:js|mjs)$/.test(file)){
  js++;const check=spawnSync(process.execPath,['--check',absolute],{encoding:'utf8'});if(check.status!==0)issues.push(`${file}: JavaScript syntax error`);
  for(const m of text.matchAll(/(?:\bfrom\s*|\bimport\s*)['"]([^'"]+)['"]/g))if(m[1].startsWith('.'))reference(m[1],file,true);
  if(!file.startsWith('vendor/'))for(const m of text.matchAll(/['"]((?:\.\/)?(?:assets|data|vendor)\/[^'"\s`<>]+)['"]/g)){if(/\.[a-z0-9]{2,8}(?:[?#].*)?$/i.test(m[1]))reference(m[1],file);}
 }
 if(/\.(?:json|geojson)$/.test(file)){
  json++;let value;try{value=JSON.parse(text);jsonFiles.set(file,value);}catch{issues.push(`${file}: invalid JSON`);continue;}
  const inspect=value=>{if(Array.isArray(value))value.forEach(inspect);else if(value&&typeof value==='object')Object.values(value).forEach(inspect);else if(typeof value==='string'&&/^(?:\.\/)?(?:assets|data|vendor)\//.test(value))reference(value,file);};inspect(value);
 }
 if(file.endsWith('.html'))for(const m of text.matchAll(/(?:src|href)\s*=\s*['"]([^'"]+)['"]/g))reference(m[1],file,true);
 if(file.endsWith('.css'))for(const m of text.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g))reference(m[1],file,true);
}
if(bytes>1024**3)issues.push('Static site exceeds the 1 GiB Pages size limit');
const dir=jsonFiles.get('data/updated-directory.json'), photos=jsonFiles.get('data/shop-photos.json');
assert(dir?.rows?.length&&photos?.records?.length,'Missing directory or photograph records');
const byRow=new Map(dir.rows.map(row=>[row.row,row]));
const normal=v=>String(v||'').normalize('NFKC').replace(/[’‘ʼ]/g,"'").replace(/\s+/g,' ').trim().toLowerCase();
for(const record of photos.records){const row=byRow.get(record.row);if(!row||row.floor!==record.floor||row.unit!==record.unit||normal(row.name)!==normal(record.name))issues.push(`shop-photos row ${record.row}: directory identity mismatch`);}
const {interviewCollections}=await import(pathToFileURL(path.join(root,'interview-recordings.js')).href);
const clipIds=new Set();let clips=0;
for(const [id,collection]of Object.entries(interviewCollections))for(const clip of collection.clips){
 clips++;const key=id+'/'+clip.id;if(clipIds.has(key))issues.push('Duplicate interview clip '+key);clipIds.add(key);
 reference(clip.file,'interview-recordings.js');
 if(!clip.label?.en||!clip.label?.zh)issues.push('Missing bilingual clip label '+key);
 if(!(clip.duration>0)||Math.abs(clip.duration-(clip.originalEnd-clip.originalStart))>.05)issues.push('Interview time arithmetic '+key);
}
const {siteFooterMarkup}=await import(pathToFileURL(path.join(root,'site-navigation.js')).href);
for(const language of ['en','zh']){const markup=siteFooterMarkup(language);if(/undefined|\[object Object\]/.test(markup))issues.push('Footer template '+language);}
if(issues.length){for(const issue of [...new Set(issues)])console.error('FAIL: '+issue);process.exitCode=1;}else{
 console.log(`PASS: ${files.length} public files, ${(bytes/1024/1024).toFixed(2)} MiB; ${js} JavaScript modules; ${json} JSON/GeoJSON files; ${links} local references`);
 console.log(`PASS: ${dir.rows.length} directory rows, ${photos.records.length} photograph identities, ${clips} bilingual interview clips`);
 console.log('PASS: relative project-site paths and no scanned private-source links or credential patterns');
 console.log('Scope: static/offline validation. Browser interactions and publication are verified separately.');
}
