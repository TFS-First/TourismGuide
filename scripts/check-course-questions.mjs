import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'assets/course-questions.json'), 'utf8'));
const generated = fs.readFileSync(path.join(root, 'assets/course-questions.js'), 'utf8');
if (generated !== `window.__tourismCourseQuestions = ${JSON.stringify(bank)};\n`) {
  console.error('Stale generated question script. Run npm run build.');
  process.exitCode = 1;
}
const courses = ['history', 'graeco-roman', 'islamic-history', 'modern-history'];
const lectures = courses.flatMap(course => fs.readdirSync(path.join(root, course))
  .filter(name => /^lecture-\d+\.html$/.test(name))
  .map(name => `${course}/${name.slice(0, -5)}`));
const errors = [];
for (const key of lectures) {
  const entry = bank[key];
  if (!entry) { errors.push(`Missing question bank: ${key}`); continue; }
  if (!entry.source?.trim()) errors.push(`Missing source: ${key}`);
  for (const [kind, required] of [['trueFalse', ['statement', 'explanation']], ['essay', ['question', 'answer']]]) {
    const count = kind === 'trueFalse' ? 6 : 4;
    if (!Array.isArray(entry[kind]) || entry[kind].length !== count) { errors.push(`Need exactly ${count} ${kind} questions: ${key}`); continue; }
    entry[kind].forEach((item, index) => {
      for (const field of required) {
        if (typeof item[field] !== 'string' || !item[field].trim()) errors.push(`Missing ${kind}[${index}].${field}: ${key}`);
        else if (/المحاضرة|الدرس|الشرائح/.test(item[field])) errors.push(`Content should explain facts, not refer to lecture: ${key} ${kind}[${index}].${field}`);
      }
      if (kind === 'trueFalse' && typeof item.answer !== 'boolean') errors.push(`Invalid trueFalse[${index}].answer: ${key}`);
    });
  }
}
for (const key of Object.keys(bank)) if (!lectures.includes(key)) errors.push(`Question bank without lecture: ${key}`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Checked self-test questions for ${lectures.length} history lectures.`);
