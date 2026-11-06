# البرومبت الشامل لتوجيه Codex / AI Agent (مع هيكلية فصل كل درس في ملف مستقل)

تم بالفعل تقسيم المشروع بالكامل بحيث يكون **كل درس من الدروس الـ 50 في ملف مستقل خاص به** داخل المجلد `src/data/lessons/lesson-01.js` حتى `src/data/lessons/lesson-50.js`، مع ملف تجميعي رئيسي `src/data/index.js`.

انسخ البرومبت التالي بالكامل وقدّمه إلى **Codex** (أو Cursor / Claude Code / أي مساعد برمجي ذكي) عندما تطلب منه إضافة دروس جديدة (مثل الدروس من 51 إلى 89 = Tracks 52 إلى 90) أو تعديل الواجهة، ليلتزم تماماً بنفس التصميم والتنسيق والهيكلية دون كسر أي شيء في الموقع.

## النص الجاهز للنسخ المباشر إلى Codex (Copy & Paste Prompt)

> **System / Developer Prompt for Codex:**
>
> You are working on an interactive Arabic/English/Spanish language-learning web application built with **React 18, TailwindCSS, and Lucide React** for the course **Language Transfer - Complete Spanish (The Thinking Method)**.
>
> ### 1. Project Architecture & One-Lesson-Per-File Rule (STRICT)
> We use a modular **one-lesson-per-file** architecture instead of a monolithic data file. You MUST strictly preserve this directory structure:
>
> - `src/data/courseIntro.js` — Exports `courseIntro` (Track 1 metadata).
> - `src/data/presentationHelperVocab.js` — Exports `presentationHelperVocab` (`demonstratives`, `family`, `professions`).
> - `src/data/lessons/lesson-01.js` through `src/data/lessons/lesson-89.js` — Each lesson MUST live in its own standalone file named `lesson-XX.js` (zero-padded to 2 digits, e.g., `lesson-51.js`) and export both a named constant `export const lesson51 = { ... };` and `export default lesson51;`.
> - `src/data/index.js` — Barrel file that imports `courseIntro`, `presentationHelperVocab`, and all `lessonXX` modules in numerical order, and exports `lessonsData = [lesson01, lesson02, ...]`.
> - `src/data.js` — Re-exports `{ courseIntro, presentationHelperVocab, lessonsData } from "./data/index"` for backward compatibility.
> - `src/components/MediaEmbedPlayer.jsx` — Dual SoundCloud (default) + YouTube (`youtube-nocookie.com`) embedded player with custom URL input.
> - `src/components/VocabularyCard.jsx` — Interactive flashcard with flip state, Web Speech API (`es-ES`) pronunciation button, and `localStorage` mastery toggle.
> - `src/App.jsx` — Main responsive (`dir="rtl"` root with `dir="ltr"` for English/Spanish blocks) application supporting Dark Mode (`dark` class on root wrapper).
>
> **Important Rule:** NEVER merge all lessons back into a single file, and NEVER delete or truncate existing lesson files (`lesson-01.js` to `lesson-50.js`). When asked to add new lessons (e.g., Lessons 51 to 60, which correspond to Tracks 52 to 61 because Track 1 is the Intro and Track 2 is Lesson 1), create `src/data/lessons/lesson-51.js` through `src/data/lessons/lesson-60.js` and register them in `src/data/index.js`.
>
> ### 2. Track-to-Lesson Mapping Rule
> - **Track 1** = `courseIntro` (Course Introduction to The Thinking Method).
> - **Lesson `N`** = **Track `N + 1`** (e.g., Lesson 1 = Track 2, Lesson 50 = Track 51, Lesson 51 = Track 52, ..., Lesson 89 = Track 90 [Final Track]).
> - Official SoundCloud URL pattern:
>   `https://soundcloud.com/languagetransfer/complete-spanish-track-${trackNumber}-language-transfer-the-thinking-method`
> - Official YouTube URL pattern:
>   `https://www.youtube.com/watch?v=${youtubeId}` (use the exact official Language Transfer YouTube video ID and `MM:SS` duration for each track).
>
> ### 3. Strict Data Schema for Every Lesson File (`src/data/lessons/lesson-XX.js`)
> Every lesson object MUST include ALL of the following properties with zero missing fields:
>
> ```javascript
> // الدرس 51 (Track 52): [عنوان الدرس بالعربية]
> export const lesson51 = {
>   id: 51,
>   trackNumber: 52,
>   title: "الدرس 51 (Track 52): [عنوان عربي واضح يجمع أهم قواعد الحلقة]",
>   subtitle: "[Concise English Subtitle Summarizing the Track's Grammar]",
>   duration: "14:31",
>   youtubeId: "VrhaaDyTRZo",
>   videoUrl: "https://www.youtube.com/watch?v=VrhaaDyTRZo",
>   soundcloudUrl: "https://soundcloud.com/languagetransfer/complete-spanish-track-52-language-transfer-the-thinking-method",
>   grammarRule: {
>     title: "[English Title of the Grammar & Thinking Method Rule]",
>     summary: "[Detailed 3-to-5 sentence English explanation of the mental model taught in the track, including etymology/hooks and EVERY key rule]",
>     rules: [
>       {
>         rule: "[Rule 1 Headline in English]",
>         detail: "[Clear English explanation with Spanish examples from the track]"
>       },
>       // Include 4 structured rules per lesson
>     ],
>     arabicExplanation: {
>       title: "الشرح المبسط بالعربي — [عنوان جذاب وواضح للقاعدة]",
>       summary: "[ملخص عربي مبسط وواضح يشرح فكرة الدرس بروح منهجية التفكير]",
>       steps: [
>         "١. [الخطوة الأولى بالتفصيل مع الأمثلة الإسبانية ومعناها بالعربية]",
>         "٢. [الخطوة الثانية بالتفصيل]",
>         "٣. [الخطوة الثالثة بالتفصيل]",
>         "٤. [الخطوة الرابعة بالتفصيل]"
>       ]
>     },
>     examples: [
>       // MUST include 8 examples per lesson:
>       // - 6 to 7 examples covering ALL sentences practiced in the episode transcript (isExtra: false)
>       // - 1 to 2 extra enrichment examples (isExtra: true)
>       {
>         es: "[Spanish sentence]",
>         ar: "[Accurate Arabic translation + brief grammatical note if helpful]",
>         en: "[Accurate English translation]",
>         pronunciation: "[Latin phonetic guide with stressed syllables in ALL CAPS, e.g., me goos-ta-REE-a BER-te]",
>         isExtra: false
>       }
>     ]
>   },
>   vocabulary: [
>     // 7 to 10 vocabulary items per lesson covering all words/forms introduced in the track
>     {
>       spanish: "[Spanish word or phrase]",
>       pronunciation: "[Latin phonetic guide, e.g., a-BLA-ba]",
>       arabic: "[Arabic meaning]",
>       english: "[English meaning]",
>       category: "[Arabic category tag, e.g., فعل (-ar) / ماضٍ مستمر / حرف جر]",
>       example: "[Short Spanish example sentence]"
>     }
>   ],
>   dailyDialogues: [
>     // 2 realistic daily-life Question & Answer dialogues applying the lesson's grammar
>     {
>       situation: "[عنوان الموقف الحياتي بالعربية]",
>       questionEs: "[Spanish Question]",
>       questionPron: "[Phonetic pronunciation]",
>       questionAr: "[Arabic translation]",
>       questionEn: "[English translation]",
>       answerEs: "[Spanish Answer]",
>       answerPron: "[Phonetic pronunciation]",
>       answerAr: "[Arabic translation]",
>       answerEn: "[English translation]"
>     }
>   ],
>   presentation: {
>     title: "بريزينتيشن الدرس 51: [عنوان الفقرة المترابطة عن النفس والعائلة]",
>     sentences: [
>       // 4 connected sentences introducing oneself, one's dad (Este es mi papá...), one's mom (Esta es mi mamá...), and siblings/family using the current lesson's grammar
>       {
>         es: "[Spanish sentence]",
>         pron: "[Phonetic pronunciation]",
>         ar: "[Arabic translation]",
>         en: "[English translation]"
>       }
>     ]
>   },
>   practicePrompts: [
>     // 3 interactive self-test prompts in the style of Mihalis's Thinking Method questions
>     {
>       prompt: "[Question asking how to build/translate a sentence or contrast two forms]",
>       answer: "[Complete Spanish answer + brief explanation]",
>       hint: "[Thinking Method building-block hint]"
>     }
>   ]
> };
>
> export default lesson51;
> ```
>
> ### 4. UI / UX & Design System Rules (DO NOT ALTER VISUAL IDENTITY)
> Maintain 100% visual consistency with our existing design system:
> 1. **Layout Order (Top to Bottom)**:
>    - Sticky Header (`backdrop-blur-md bg-white/85 dark:bg-slate-900/85`) with Course Title, Track 1 Intro Modal button, Mastered Words counter (`lt_spanish_mastered_v5` in `localStorage` wrapped in `try/catch`), and Dark/Light Mode toggle.
>    - Lesson Selector Grid + Top Previous/Next Episode navigation buttons.
>    - **Section 1 — Embedded Media Player (`MediaEmbedPlayer`)**: Defaults to the official SoundCloud widget (`color=%23f97316`), with a toggle button for YouTube (`youtube-nocookie.com/embed/...`) and custom URL input.
>    - **Section 2 — Dual Grammar Explanation**:
>      - **Box 1 (English Explanation, `dir="ltr"`)**: Indigo/Slate dark gradient (`from-indigo-950 via-slate-900 to-slate-900 border-indigo-800/60`), badge `"Step 1 • Grammar & Thinking Method Rule (English Explanation)"`, summary, and numbered 2-column rule cards.
>      - **Box 2 (Simplified Arabic Explanation + Examples, `dir="rtl"`)**: Warm Amber/Slate dark gradient (`from-amber-950/90 via-slate-900 to-slate-900 border-amber-700/50`), badge `"الخطوة ٢ • الشرح العربي المبسط والواضح للقاعدة"`, numbered Arabic steps (`١، ٢، ٣، ٤`), followed by the 2-column clickable Examples grid with `"🎧 من الحلقة"` (`isExtra: false`) vs. `"✨ مثال إضافي"` (`isExtra: true`) badges and Web Speech API (`es-ES`) audio playback on click.
>    - **Section 3 — Vocabulary Flashcards Grid (`VocabularyCard`)**: Responsive 1/2/3-column grid with search input, Show/Hide All Translations toggle, category pill, Spanish title, amber monospace `/pronunciation/` badge, flip-on-click Arabic/English/Example reveal, audio button, and green mastered checkmark.
>    - **Section 4 — Daily Dialogues & Connected Family Presentation (`DailyDialoguesAndPresentationSection`)**: Emerald/Teal dark gradient (`from-emerald-950 via-teal-950 to-slate-900 border-emerald-800/60`) with 4 tabs:
>      1. `current`: Current lesson's Q&A `dailyDialogues` + connected 4-sentence family `presentation` (with full-paragraph audio & copy button).
>      2. `allDialogues`: Cumulative bank of all daily dialogues across all lessons (`1–N`).
>      3. `builder`: Interactive custom presentation builder (Name, Country, City, Job, Dad's Name/Job, Mom's Name/Job, Brother's Name/Job, Sister's Name/Job).
>      4. `vocab`: Helper dictionary for Demonstratives (`Este / Esta / Esto`), Family (`La Familia`), and Professions (`Las Profesiones`).
>    - **Section 5 — Thinking Method Self-Test (`practicePrompts`)**: 3 cards with click-to-reveal answer and Spanish TTS playback.
>    - **Section 6 — Bottom Previous/Next Lesson Navigation Buttons**.
> 2. **Bidirectional Text Discipline (`dir="rtl"` vs. `dir="ltr"`)**:
>    - Keep the page root `dir="rtl"` for Arabic UI navigation.
>    - Always set `dir="ltr"` on the English Grammar box, Spanish sentences, phonetic pronunciations (`/pronunciation/`), and English translations (`EN: ...`) so punctuation and Latin script never flip.

## جدول هيكلية الملفات الجديدة في المشروع المقسّم (`language_transfer_spanish_project.zip`)

| المسار داخل المشروع | الوظيفة والوصف |
| :--- | :--- |
| `src/data/lessons/lesson-01.js` ... `lesson-50.js` | **50 ملفاً مستقلاً**، كل ملف يحتوي على بيانات درس واحد فقط (`lesson01` إلى `lesson50`) لتسهيل التعديل والإضافة دون تضخم الملفات. |
| `src/data/courseIntro.js` | بيانات مقدمة الكورس (Track 1: منهجية التفكير) وروابط SoundCloud وYouTube الخاصة بها. |
| `src/data/presentationHelperVocab.js` | القاموس المساعد لبناء البريزينتيشن (أسماء الإشارة، العائلة، المهن). |
| `src/data/index.js` | الملف التجميعي (Barrel File) الذي يستورد الدروس الخمسين بالترتيب ويصدّر `lessonsData` و`courseIntro` و`presentationHelperVocab`. |
| `src/data.js` | ملف توافقية يعيد تصدير البيانات من `./data/index` لضمان عمل أي استيراد قديم بدون أخطاء. |
| `src/components/MediaEmbedPlayer.jsx` | مكون مشغل SoundCloud وYouTube المدمج في ملف مستقل. |
| `src/components/VocabularyCard.jsx` | مكون بطاقة المفردات التفاعلية (Flashcard) في ملف مستقل. |
| `src/App.jsx` | الواجهة الرئيسية للتطبيق وتستورد البيانات من `./data` والمكونات من `./components/`. |
| `CODEX_MASTER_PROMPT.md` | نسخة محفوظة داخل المشروع من هذا البرومبت الشامل ليقرأها Codex تلقائياً عند فتح المجلد. |
