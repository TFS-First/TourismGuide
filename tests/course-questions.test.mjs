import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext, runInNewContext, Script } from 'node:vm';
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

test('Greek history renders English questions with Arabic only after reveal', async () => {
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
    head: { append(script) { runInContext(generated, context); script.onload(); } }
  };
  context = createContext({
    window: { addEventListener(name, callback) { listeners[name] = callback; } },
    document, location: { pathname: '/example/TourismGuide/graeco-roman/lecture-01.html', hash: '' },
    URL, CSS: { escape: value => value }, console
  });
  runInContext(ui, context);
  listeners.DOMContentLoaded();
  await new Promise(resolve => setImmediate(resolve));
  const [truth, essays] = quiz.children;
  assert.match(truth.className, /course-self-test--en/);
  assert.match(truth.children[2].children[0].textContent, /^1\. The Hellenistic Age/);
  const firstEssay = essays.children[2];
  assert.match(firstEssay.children[0].textContent, /^1\. Rank the four major eras/);
  assert.equal(firstEssay.children[1].tag, 'details');
  assert.equal(firstEssay.children[1].open, undefined);
  assert.match(firstEssay.children[1].children[1].textContent, /Dark Age/);
  assert.match(firstEssay.children[1].children[2].children[1].textContent, /رتب الحقب/);
  const firstFact = truth.children[2];
  firstFact.children[1].children[0].events.click();
  assert.match(firstFact.children[2].textContent, /^Correct\./);
  assert.match(firstFact.children[2].children[0].children[1].textContent, /العصر الهيلينستي/);
});

test('all Greek multiple-choice exams show English text and delayed Arabic translation', () => {
  const css = readFileSync(new URL('assets/course-ui.css', root), 'utf8');
  assert.match(css, /\[id\^="feedback-q"\]:not\(\.hidden\) \+ \.course-mcq-translation/);
  for (let number = 1; number <= 11; number++) {
    const page = `graeco-roman/lecture-${String(number).padStart(2, '0')}.html`;
    const html = readFileSync(new URL(page, root), 'utf8');
    const form = html.match(/<form\b[^>]*id="quizForm"[^>]*>([\s\S]*?)<\/form>/)?.[1];
    assert.ok(form, `${page}: quiz form`);
    assert.match(html, /<form id="quizForm"[^>]*dir="ltr"/);
    const translations = [...form.matchAll(/<details class="course-mcq-translation"[^>]*>([\s\S]*?)<\/details>/g)];
    assert.equal(translations.length, 10, `${page}: ten translations`);
    assert.ok(translations.every(([, text]) => /السؤال:/.test(text) && /الإجابة:/.test(text)));
    const englishForm = form.replace(/<details class="course-mcq-translation"[^>]*>[\s\S]*?<\/details>/g, '');
    const prompts = [...englishForm.matchAll(/<(?:p|h3)\b[^>]*dir="ltr"[^>]*>([\s\S]*?)<\/(?:p|h3)>/g)];
    assert.equal(prompts.length, 10, `${page}: ten English prompts`);
    assert.ok(prompts.every(([, text]) => !/[\u0600-\u06ff]/.test(text)));
    const options = [...englishForm.matchAll(/<label\b[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/label>/g)];
    assert.ok(options.length >= 30, `${page}: English answer choices`);
    assert.ok(options.every(([, text]) => !/[\u0600-\u06ff]/.test(text)));
    assert.doesNotMatch(englishForm, /\([A-D]\) \([A-D]\)/);
    assert.equal((html.match(/expEn: '/g) || []).length, 10, `${page}: ten English explanations`);
    const quizScript = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
      .map(match => match[1]).find(script => script.includes('const correctAnswers'));
    assert.ok(quizScript, `${page}: scoring script`);
    assert.doesNotThrow(() => new Script(quizScript), `${page}: valid quiz JavaScript`);
  }
});
