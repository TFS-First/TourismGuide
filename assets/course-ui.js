(() => {
  const questionsUrl = new URL('./course-questions.js', document.currentScript.src);
  const addSelfTests = async () => {
    const quiz = document.querySelector('#quiz > details.course-fold > .course-fold-body');
    const match = location.pathname.match(/\/(history|graeco-roman|islamic-history|modern-history)\/(lecture-\d+)\.html$/);
    if (!quiz || !match) return;
    try {
      if (!window.__tourismCourseQuestions) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = questionsUrl.href;
          script.onload = resolve;
          script.onerror = () => reject(new Error('تعذر تحميل بنك الأسئلة'));
          document.head.append(script);
        });
      }
      const bank = window.__tourismCourseQuestions;
      const entry = bank[`${match[1]}/${match[2]}`];
      if (!entry?.trueFalse?.length || !entry?.essay?.length) return;
      const englishExam = match[1] === 'graeco-roman';

      const make = (tag, className, content) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (content) node.textContent = content;
        return node;
      };
      const truthSection = make('section', `course-self-test${englishExam ? ' course-self-test--en' : ''}`);
      truthSection.setAttribute('aria-label', englishExam ? 'True or false questions' : 'أسئلة صح أو خطأ');
      truthSection.append(make('h4', '', englishExam ? 'True or false?' : 'صح أم خطأ؟'));
      truthSection.append(make('p', 'course-question-hint', englishExam ? 'Choose your answer before reading the explanation.' : 'اختر إجابتك قبل قراءة التصحيح.'));
      entry.trueFalse.forEach((item, index) => {
        const card = make('div', 'course-question-card');
        card.append(make('p', 'course-question-text', `${index + 1}. ${englishExam ? item.statementEn : item.statement}`));
        const choices = make('div', 'course-truth-choices');
        const feedback = make('p', 'course-question-feedback');
        feedback.setAttribute('role', 'status');
        for (const [label, value] of englishExam ? [['True', true], ['False', false]] : [['صح', true], ['خطأ', false]]) {
          const button = make('button', '', label);
          button.type = 'button';
          button.addEventListener('click', () => {
            choices.querySelectorAll('button').forEach(choice => {
              choice.setAttribute('aria-pressed', String(choice === button));
            });
            feedback.textContent = englishExam
              ? `${value === item.answer ? 'Correct.' : 'Not quite.'} ${item.explanationEn}`
              : `${value === item.answer ? 'إجابة صحيحة.' : 'إجابة غير صحيحة.'} ${item.explanation}`;
            if (englishExam) {
              const translation = make('div', 'course-question-translation');
              translation.setAttribute('dir', 'rtl');
              translation.append(make('span', 'course-translation-label', 'الترجمة العربية'));
              translation.append(make('p', '', `السؤال: ${item.statement}`));
              translation.append(make('p', '', `التفسير: ${item.explanation}`));
              feedback.append(translation);
            }
            feedback.dataset.correct = String(value === item.answer);
          });
          button.setAttribute('aria-pressed', 'false');
          choices.append(button);
        }
        card.append(choices, feedback);
        truthSection.append(card);
      });

      const essaySection = make('section', `course-self-test course-essay-section${englishExam ? ' course-self-test--en' : ''}`);
      essaySection.setAttribute('aria-label', englishExam ? 'Essay questions' : 'الأسئلة المقالية');
      essaySection.append(make('h4', '', englishExam ? 'Essay questions' : 'الأسئلة المقالية'));
      essaySection.append(make('p', 'course-question-hint', englishExam ? 'Write your answer first, then reveal the model answer and Arabic translation.' : 'كوّن إجابتك أولًا، ثم افتح الإجابة النموذجية للمراجعة.'));
      entry.essay.forEach((item, index) => {
        const card = make('div', 'course-question-card');
        card.append(make('p', 'course-question-text', `${index + 1}. ${englishExam ? item.questionEn : item.question}`));
        const answer = make('details', 'course-answer');
        answer.append(make('summary', '', englishExam ? 'Show model answer + Arabic translation' : 'اعرض الإجابة النموذجية'));
        answer.append(make('p', '', englishExam ? item.answerEn : item.answer));
        if (englishExam) {
          const translation = make('div', 'course-question-translation');
          translation.setAttribute('dir', 'rtl');
          translation.append(make('span', 'course-translation-label', 'الترجمة العربية'));
          translation.append(make('p', '', `السؤال: ${item.question}`));
          translation.append(make('p', '', `الإجابة: ${item.answer}`));
          answer.append(translation);
        }
        card.append(answer);
        essaySection.append(card);
      });
      quiz.append(truthSection, essaySection);
    } catch (error) {
      console.error('تعذر تحميل أسئلة المحاضرة:', error);
      const warning = document.createElement('p');
      warning.className = 'course-question-feedback';
      warning.textContent = 'تعذر تحميل أسئلة صح أو خطأ والمقال. تأكد من وجود مجلد assets كاملًا بجوار ملفات المواد، ثم افتح الصفحة مجددًا.';
      quiz.append(warning);
    }
  };
  const revealHash = () => {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    const ownFold = target.querySelector(':scope > details.course-fold');
    if (ownFold) ownFold.open = true;
    let parent = target.closest('details');
    while (parent) {
      parent.open = true;
      parent = parent.parentElement?.closest('details');
    }
  };
  window.addEventListener('hashchange', revealHash);
  window.addEventListener('DOMContentLoaded', () => {
    addSelfTests();
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, small, span').forEach(element => {
      if (element.children.length) return;
      const value = element.textContent.trim();
      if (/[A-Za-z]{2}/.test(value) && !/[\u0600-\u06ff]/.test(value)) {
        element.dir = 'ltr'; element.classList.add('english-copy');
      }
    });
    const sections = [...document.querySelectorAll('section[id], main[id]')].filter(section => !section.closest('details'));
    const axes = sections.map(section => {
      const heading = section.querySelector('h2, h3');
      const label = section.id === 'quiz' ? 'التدريبات والأسئلة' : heading?.textContent.trim().replace(/\s+/g, ' ').slice(0, 52);
      return label ? { id: section.id, label } : null;
    }).filter(Boolean).slice(0, 14);
    const mobileLinks = document.querySelector('.course-mobile-nav-links');
    if (mobileLinks && axes.length) {
      if (!mobileLinks.querySelector('.course-axis-title')) {
        const title = document.createElement('span'); title.className = 'course-axis-title'; title.textContent = 'محاور الدرس'; mobileLinks.append(title);
      }
      for (const axis of axes) {
        if (mobileLinks.querySelector(`a[href="#${CSS.escape(axis.id)}"]`)) continue;
        const link = document.createElement('a'); link.href = `#${axis.id}`; link.textContent = axis.label; mobileLinks.append(link);
      }
    }
    const headerRow = document.querySelector('.course-header > div:first-child');
    if (headerRow && axes.length) {
      const menu = document.createElement('details'); menu.className = 'course-axes-menu';
      const summary = document.createElement('summary'); summary.textContent = 'محاور الدرس ▾'; menu.append(summary);
      const nav = document.createElement('nav'); nav.setAttribute('aria-label', 'محاور الدرس');
      for (const axis of axes) { const link = document.createElement('a'); link.href = `#${axis.id}`; link.textContent = axis.label; nav.append(link); }
      menu.append(nav); headerRow.insertBefore(menu, headerRow.lastElementChild);
    }
    revealHash();
    document.querySelectorAll('.course-mobile-nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => { link.closest('details').open = false; });
    });
  });
})();
