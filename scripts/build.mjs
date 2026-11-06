import fs from 'node:fs';
import path from 'node:path';
import { buildArtifacts, loadLessons, root } from './project.mjs';
for(const [file,content] of Object.entries(buildArtifacts())){fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),content);}
fs.writeFileSync(path.join(root,'index.html'),fs.readFileSync(path.join(root,'portal.html')));
const questionBank=JSON.parse(fs.readFileSync(path.join(root,'assets/course-questions.json'),'utf8'));
fs.writeFileSync(path.join(root,'assets/course-questions.js'),`window.__tourismCourseQuestions = ${JSON.stringify(questionBank)};\n`);
console.log(`Built ${loadLessons().length} lessons. Static output: ancient-egyptian-language/index.html, assets/app.js, assets/app.css, assets/course-questions.js.`);
