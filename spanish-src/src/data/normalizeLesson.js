// محوّل غير تدميري (Non-Destructive Schema Normalizer)
// يوحّد الفروقات بين بنية الدروس 1–20 وبنية الدروس 21–50 دون حذف أي حقل أصلي

export function normalizeLesson(rawLesson) {
  if (!rawLesson) return rawLesson;

  const gr = rawLesson.grammarRule || {};

  // 1. توحيد قواعد الشرح الإنجليزي (bulletPoints -> rules)
  let normalizedRules = gr.rules;
  if (!Array.isArray(normalizedRules) && Array.isArray(gr.bulletPoints)) {
    normalizedRules = gr.bulletPoints.map((bp, idx) => {
      if (typeof bp === "string") {
        const colonIdx = bp.indexOf(":");
        if (colonIdx !== -1) {
          return {
            rule: bp.slice(0, colonIdx).trim(),
            detail: bp.slice(colonIdx + 1).trim(),
          };
        }
        return { rule: `Rule ${idx + 1}`, detail: bp };
      }
      return bp;
    });
  }

  // 2. توحيد الشرح العربي المبسط (top-level arabicExplanation -> grammarRule.arabicExplanation)
  const normalizedArabicExplanation =
    gr.arabicExplanation || rawLesson.arabicExplanation || null;

  // 3. توحيد أمثلة القاعدة النحوية (spanish/arabic/english <-> es/ar/en)
  const normalizedExamples = (gr.examples || []).map((ex) => ({
    ...ex,
    es: ex.es ?? ex.spanish ?? "",
    ar: ex.ar ?? ex.arabic ?? "",
    en: ex.en ?? ex.english ?? "",
    spanish: ex.spanish ?? ex.es ?? "",
    arabic: ex.arabic ?? ex.ar ?? "",
    english: ex.english ?? ex.en ?? "",
    pronunciation: ex.pronunciation ?? "",
    isExtra: Boolean(ex.isExtra),
  }));

  // 4. توحيد الحوارات اليومية (question/answer <-> questionEs/answerEs)
  const normalizedDialogues = (rawLesson.dailyDialogues || []).map((dlg) => ({
    ...dlg,
    questionEs: dlg.questionEs ?? dlg.question ?? "",
    answerEs: dlg.answerEs ?? dlg.answer ?? "",
    question: dlg.question ?? dlg.questionEs ?? "",
    answer: dlg.answer ?? dlg.answerEs ?? "",
  }));

  // 5. توحيد فقرة البريزينتيشن المترابطة (presentationParagraph <-> presentation)
  const rawPres = rawLesson.presentation || rawLesson.presentationParagraph || null;
  const normalizedPresentation = rawPres
    ? {
        ...rawPres,
        title: rawPres.title || `بريزينتيشن الدرس ${rawLesson.id}`,
        sentences: (rawPres.sentences || []).map((s) => ({
          ...s,
          es: s.es ?? s.spanish ?? "",
          pron: s.pron ?? s.pronunciation ?? "",
          ar: s.ar ?? s.arabic ?? "",
          en: s.en ?? s.english ?? "",
          spanish: s.spanish ?? s.es ?? "",
          pronunciation: s.pronunciation ?? s.pron ?? "",
          arabic: s.arabic ?? s.ar ?? "",
          english: s.english ?? s.en ?? "",
        })),
      }
    : null;

  // 6. توحيد أسئلة اختبر نفسك (promptAr/promptEn <-> prompt)
  const normalizedPrompts = (rawLesson.practicePrompts || []).map((p) => ({
    ...p,
    prompt:
      p.prompt ??
      (p.promptAr && p.promptEn
        ? `${p.promptAr} (${p.promptEn})`
        : p.promptAr || p.promptEn || ""),
    promptAr: p.promptAr ?? p.prompt ?? "",
    promptEn: p.promptEn ?? p.prompt ?? "",
  }));

  return {
    ...rawLesson,
    videoUrl: rawLesson.videoUrl ?? rawLesson.youtubeUrl ?? "",
    youtubeUrl: rawLesson.youtubeUrl ?? rawLesson.videoUrl ?? "",
    grammarRule: {
      ...gr,
      rules: normalizedRules || [],
      arabicExplanation: normalizedArabicExplanation,
      examples: normalizedExamples,
    },
    arabicExplanation: normalizedArabicExplanation,
    dailyDialogues: normalizedDialogues,
    presentation: normalizedPresentation,
    presentationParagraph: normalizedPresentation,
    practicePrompts: normalizedPrompts,
  };
}

export default normalizeLesson;
