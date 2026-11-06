import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext, runInNewContext } from 'node:vm';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);

test('history question bank loads as a classic script for local HTML files', () => {
  const source = JSON.parse(readFileSync(new URL('assets/course-questions.json', root), 'utf8'));
  const generated = readFileSync(new URL('assets/course-questions.js', root), 'utf8');
  const context = { window: {} };
  runInNewContext(generated, context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.__tourismCourseQuestions)), source);

  const ui = readFileSync(new URL('assets/course-ui.js', root), 'utf8');
  assert.match(ui, /new URL\('\.\/course-questions\.js', document\.currentScript\.src\)/);
  assert.match(ui, /document\.head\.append\(script\)/);
  assert.doesNotMatch(ui, /fetch\(/);
  assert.equal(
    new URL('./course-questions.js', 'file:///example/TourismGuide/assets/course-ui.js').href,
    'file:///example/TourismGuide/assets/course-questions.js'
  );
});

test('local lecture renders six fact checks and four closed essay answers', async () => {
  const generated = readFileSync(new URL('assets/course-questions.js', root), 'utf8');
  const ui = readFileSync(new URL('assets/course-ui.js', root), 'utf8');
  const listeners = {};
  const element = tag => ({
    tag, children: [], events: {}, attributes: {}, dataset: {}, textContent: '',
    append(...items) { this.children.push(...items); },
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, callback) { this.events[name] = callback; },
    querySelectorAll(selector) { return selector === 'button' ? this.children.filter(child => child.tag === 'button') : []; }
  });
  const quiz = element('div');
  let context;
  const document = {
    currentScript: { src: 'file:///example/TourismGuide/assets/course-ui.js' },
    createElement: element,
    querySelector(selector) { return selector === '#quiz > details.course-fold > .course-fold-body' ? quiz : null; },
    querySelectorAll() { return []; },
    head: {
      append(script) {
        assert.equal(script.src, 'file:///example/TourismGuide/assets/course-questions.js');
        runInContext(generated, context);
        script.onload();
      }
    }
  };
  context = createContext({
    window: { addEventListener(name, callback) { listeners[name] = callback; } },
    document,
    location: { pathname: '/example/TourismGuide/history/lecture-01.html', hash: '' },
    URL,
    CSS: { escape: value => value },
    console
  });
  runInContext(ui, context);
  listeners.DOMContentLoaded();
  await new Promise(resolve => setImmediate(resolve));

  assert.equal(quiz.children.length, 2);
  const [truth, essays] = quiz.children;
  assert.equal(truth.children.filter(child => child.className === 'course-question-card').length, 6);
  assert.equal(essays.children.filter(child => child.className === 'course-question-card').length, 4);
  const firstAnswer = essays.children[2].children[1];
  assert.equal(firstAnswer.tag, 'details');
  assert.equal(firstAnswer.open, undefined);
  const firstFact = truth.children[2];
  firstFact.children[1].children[0].events.click();
  assert.match(firstFact.children[2].textContent, /تراجع الأمطار/);
  assert.doesNotMatch(firstFact.children[2].textContent, /المحاضرة/);
});
