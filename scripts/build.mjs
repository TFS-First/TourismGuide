import fs from 'node:fs';
import path from 'node:path';
import { buildArtifacts, loadLessons, root } from './project.mjs';
for(const [file,content] of Object.entries(buildArtifacts())){fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),content);}
fs.writeFileSync(path.join(root,'index.html'),fs.readFileSync(path.join(root,'portal.html')));
console.log(`Built ${loadLessons().length} lessons. Static output: ancient-egyptian-language/index.html, assets/app.js, assets/app.css.`);
