import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'assets/course-questions.json'), 'utf8'));
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
    if (!Array.isArray(entry[kind]) || entry[kind].length < 2) { errors.push(`Need at least two ${kind} questions: ${key}`); continue; }
    entry[kind].forEach((item, index) => {
      for (const field of required) if (typeof item[field] !== 'string' || !item[field].trim()) errors.push(`Missing ${kind}[${index}].${field}: ${key}`);
      if (kind === 'trueFalse' && typeof item.answer !== 'boolean') errors.push(`Invalid trueFalse[${index}].answer: ${key}`);
    });
  }
}
for (const key of Object.keys(bank)) if (!lectures.includes(key)) errors.push(`Question bank without lecture: ${key}`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Checked self-test questions for ${lectures.length} history lectures.`);
