import assert from 'node:assert/strict';
import { courseIntro, lessonsData, rawLessonsData } from '../src/data/index.js';

assert.equal(courseIntro.trackNumber, 1);
assert.equal(lessonsData.length, 50);
assert.equal(rawLessonsData.length, lessonsData.length);

for (const [index, lesson] of lessonsData.entries()) {
  assert.equal(lesson.id, index + 1, `lesson ${index + 1}: ID`);
  assert.equal(lesson.trackNumber, index + 2, `lesson ${index + 1}: track`);
  assert(lesson.title && lesson.subtitle && lesson.duration);
  assert(lesson.soundcloudUrl && lesson.videoUrl && lesson.youtubeId);
  assert(lesson.grammarRule.title && lesson.grammarRule.summary);
  assert(lesson.grammarRule.rules.length > 0);
  assert(lesson.grammarRule.rules.every(rule => rule.rule && rule.detail));
  assert(lesson.grammarRule.arabicExplanation?.steps?.length > 0);
  assert(lesson.grammarRule.examples.length > 0);
  assert(lesson.grammarRule.examples.every(example => example.es && example.ar));
  assert(lesson.vocabulary.length > 0);
  assert(lesson.dailyDialogues.every(dialogue => dialogue.questionEs && dialogue.answerEs));
  assert(lesson.presentation?.sentences?.every(sentence => sentence.es && sentence.ar));
  assert(lesson.practicePrompts.every(prompt => prompt.prompt && prompt.answer));
  assert.equal(rawLessonsData[index].id, lesson.id);
}

console.log('Checked 50 Spanish lessons and the Track 1 introduction.');
