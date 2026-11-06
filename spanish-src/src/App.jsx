import React, { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  Sparkles,
  CheckCircle2,
  RotateCw,
  Search,
  PlayCircle,
  HelpCircle,
  GraduationCap,
  Languages,
  Video,
  Lightbulb,
  Headphones,
  Users,
  Copy,
  Check,
  Radio,
  MessageCircle
} from "lucide-react";
import { courseIntro, presentationHelperVocab, lessonsData } from "./data.js";

// مكون مشغل الصوت والفيديو المدمج (SoundCloud كخيار افتراضي + YouTube كبديل مدمج)
function MediaEmbedPlayer({ soundcloudUrl, videoUrl, youtubeId, title, trackNumber, duration }) {
  const [playerSource, setPlayerSource] = useState("soundcloud");
  const [customUrl, setCustomUrl] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const activeSoundCloudUrl = useMemo(() => {
    if (customUrl.trim() && customUrl.includes("soundcloud.com")) {
      return customUrl.trim().split("?")[0];
    }
    return (soundcloudUrl || "").split("?")[0];
  }, [customUrl, soundcloudUrl]);

  const soundcloudEmbedSrc = useMemo(() => {
    const encoded = encodeURIComponent(activeSoundCloudUrl);
    return `https://w.soundcloud.com/player/?url=${encoded}&color=%23f97316&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false`;
  }, [activeSoundCloudUrl]);

  const extractedYoutubeId = useMemo(() => {
    const target =
      customUrl.trim() && (customUrl.includes("youtube.com") || customUrl.includes("youtu.be"))
        ? customUrl.trim()
        : videoUrl;
    if (!target && youtubeId) return youtubeId;
    try {
      if (target.includes("youtu.be/")) {
        return target.split("youtu.be/")[1].split(/[?&]/)[0];
      }
      if (target.includes("v=")) {
        return target.split("v=")[1].split(/[?&]/)[0];
      }
      if (target.includes("embed/")) {
        return target.split("embed/")[1].split(/[?&]/)[0];
      }
    } catch (e) {
      return youtubeId;
    }
    return youtubeId;
  }, [customUrl, videoUrl, youtubeId]);

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
      <div className="px-4 py-3 bg-slate-800/90 flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Track {trackNumber}
          </span>
          <span className="text-slate-300 text-xs sm:text-sm font-medium truncate max-w-[200px] sm:max-w-md">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-700">
            <button
              onClick={() => setPlayerSource("soundcloud")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                playerSource === "soundcloud"
                  ? "bg-orange-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              SoundCloud
            </button>
            <button
              onClick={() => setPlayerSource("youtube")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                playerSource === "youtube"
                  ? "bg-rose-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              YouTube
            </button>
          </div>

          <span className="text-xs text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700">
            ⏱ {duration}
          </span>

          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-xs flex items-center gap-1 text-indigo-300 hover:text-indigo-200 bg-indigo-950/70 hover:bg-indigo-900/60 px-2.5 py-1 rounded-md border border-indigo-700/50 transition"
          >
            <Video className="w-3.5 h-3.5" />
            {showCustomInput ? "إغلاق الرابط" : "تغيير الرابط"}
          </button>
        </div>
      </div>

      {showCustomInput && (
        <div className="p-3 bg-slate-800/60 border-b border-slate-700/70 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="url"
            dir="ltr"
            value={customUrl}
            onChange={(e) => {
              const val = e.target.value;
              setCustomUrl(val);
              if (val.includes("soundcloud.com")) setPlayerSource("soundcloud");
              if (val.includes("youtube.com") || val.includes("youtu.be")) setPlayerSource("youtube");
            }}
            placeholder="الصق رابط SoundCloud أو YouTube هنا للتشغيل الفوري..."
            className="flex-1 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-orange-500"
          />
          {customUrl && (
            <button
              onClick={() => setCustomUrl("")}
              className="text-xs text-rose-300 hover:text-rose-200 px-3 py-2 rounded-lg bg-rose-950/50 border border-rose-800/50"
            >
              استعادة الرابط الأصلي
            </button>
          )}
        </div>
      )}

      {playerSource === "soundcloud" ? (
        <div className="w-full bg-slate-950 p-3 sm:p-4">
          <iframe
            className="w-full rounded-xl border border-slate-800 shadow-inner"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={soundcloudEmbedSrc}
            title={`SoundCloud - ${title}`}
          />
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
            <span>🎧 نصيحة: أوقف المقطع الصوتي عند كل سؤال وفكّر بالإجابة بهدوء قبل المتابعة.</span>
            <a
              href={activeSoundCloudUrl}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="text-orange-400 hover:text-orange-300 underline truncate max-w-xs"
            >
              فتح على SoundCloud ↗
            </a>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-video bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${extractedYoutubeId}?rel=0&modestbranding=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

// بطاقة المفردات التفاعلية (Flashcard)
function VocabularyCard({ item, isMastered, onToggleMastered, onSpeak, showAllTranslations }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const showDetails = isFlipped || showAllTranslations;

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className={`group relative rounded-2xl p-5 transition-all duration-300 cursor-pointer select-none border flex flex-col justify-between ${
        isMastered
          ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/70 shadow-sm"
          : "bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm hover:shadow-md"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
            {item.category}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSpeak(item.spanish);
              }}
              title="استمع للنطق الإسباني"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/60 dark:hover:text-indigo-300 transition"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMastered(item.spanish);
              }}
              title={isMastered ? "تم حفظ الكلمة" : "علّم الكلمة كمحفوظة"}
              className={`p-1.5 rounded-lg transition ${
                isMastered
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 dark:bg-slate-700/70 text-slate-400 hover:text-emerald-600"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-center my-3">
          <h4
            dir="ltr"
            className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1"
          >
            {item.spanish}
          </h4>
          <p
            dir="ltr"
            className="inline-block text-xs font-mono px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50"
          >
            /{item.pronunciation}/
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        {showDetails ? (
          <div className="space-y-1.5 text-center animate-fadeIn">
            <p className="text-base font-bold text-indigo-700 dark:text-indigo-300">{item.arabic}</p>
            <p dir="ltr" className="text-xs font-medium text-slate-500 dark:text-slate-400">
              EN: {item.english}
            </p>
            {item.example && (
              <p
                dir="ltr"
                className="text-xs italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1.5 rounded-lg mt-2 border border-slate-200/60 dark:border-slate-700/50"
              >
                “{item.example}”
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition">
            <RotateCw className="w-3.5 h-3.5" />
            <span>اضغط لإظهار الترجمة والمثال</span>
          </div>
        )}
      </div>
    </div>
  );
}

// مكون الحوارات اليومية وبناء البريزينتيشن المترابطة (تعريف بالنفس وبالعائلة والمهن)
function DailyDialoguesAndPresentationSection({ lesson, allLessons, helperVocab, onSpeak }) {
  const [activeTab, setActiveTab] = useState("current");
  const [copied, setCopied] = useState(false);

  const [myName, setMyName] = useState("Ahmed");
  const [myCountry, setMyCountry] = useState("Egipto");
  const [myCity, setMyCity] = useState("El Cairo");
  const [myJob, setMyJob] = useState("ingeniero");
  const [dadName, setDadName] = useState("Mahmoud");
  const [dadJob, setDadJob] = useState("médico");
  const [momName, setMomName] = useState("Nadia");
  const [momJob, setMomJob] = useState("profesora");
  const [broName, setBroName] = useState("Omar");
  const [broJob, setBroJob] = useState("programador");
  const [sisName, setSisName] = useState("Sara");
  const [sisJob, setSisJob] = useState("arquitecta");

  const customPresentationSentences = useMemo(() => {
    return [
      {
        es: `¡Buenos días! Hola, me llamo ${myName}. Soy de ${myCountry}, de ${myCity}, y soy ${myJob}.`,
        pron: `BWE-nos DEE-as! O-la, me YA-mo ${myName}. soy de ${myCountry}, de ${myCity}, ee soy ${myJob}`,
        ar: `صباح الخير! مرحباً، أنا اسمي ${myName}. أنا من ${myCountry} (من ${myCity})، وأنا أعمل ${myJob}.`,
        en: `Good morning! Hello, my name is ${myName}. I am from ${myCountry}, from ${myCity}, and I am a(n) ${myJob}.`
      },
      {
        es: `Este es mi papá; se llama ${dadName} y él es ${dadJob}.`,
        pron: `ES-te es mee pa-PA; se YA-ma ${dadName} ee el es ${dadJob}`,
        ar: `هذا بابا (أبي)؛ اسمه ${dadName} وهو يعمل ${dadJob}.`,
        en: `This is my dad; his name is ${dadName} and he is a(n) ${dadJob}.`
      },
      {
        es: `Esta es mi mamá; se llama ${momName} y ella es ${momJob}.`,
        pron: `ES-ta es mee ma-MA; se YA-ma ${momName} ee E-ya es ${momJob}`,
        ar: `وهذه ماما (أمي)؛ اسمها ${momName} وهي تعمل ${momJob}.`,
        en: `This is my mom; her name is ${momName} and she is a(n) ${momJob}.`
      },
      {
        es: `Este es mi hermano ${broName}; él es ${broJob} y trabaja mucho.`,
        pron: `ES-te es mee er-MA-no ${broName}; el es ${broJob} ee tra-BA-kha MOO-cho`,
        ar: `وهذا أخي ${broName}؛ هو يعمل ${broJob} ويعمل كثيراً.`,
        en: `This is my brother ${broName}; he is a(n) ${broJob} and works a lot.`
      },
      {
        es: `Y esta es mi hermana ${sisName}; ella es ${sisJob} y sabe hablar español muy bien.`,
        pron: `ee ES-ta es mee er-MA-na ${sisName}; E-ya es ${sisJob} ee SA-be a-BLAR es-pa-NYOL mwee byen`,
        ar: `وهذه أختي ${sisName}؛ هي تعمل ${sisJob} وتعرف التحدث بالإسبانية جيداً جداً.`,
        en: `And this is my sister ${sisName}; she is a(n) ${sisJob} and knows how to speak Spanish very well.`
      },
      {
        es: `Nosotros vivimos juntos, nos hablamos todos los días y estamos muy felices.`,
        pron: `no-SO-tros bee-BEE-mos KHOON-tos, nos a-BLA-mos TO-dos los DEE-as ee es-TA-mos mwee fe-LEE-ses`,
        ar: `نحن نعيش معاً، ونتحدث مع بعضنا كل يوم ونحن سعداء جداً.`,
        en: `We live together, we talk to each other every day, and we are very happy.`
      }
    ];
  }, [myName, myCountry, myCity, myJob, dadName, dadJob, momName, momJob, broName, broJob, sisName, sisJob]);

  const fullCustomParagraphEs = useMemo(
    () => customPresentationSentences.map((s) => s.es).join(" "),
    [customPresentationSentences]
  );

  const fullLessonParagraphEs = useMemo(
    () => (lesson.presentation?.sentences || []).map((s) => s.es).join(" "),
    [lesson]
  );

  const handleCopy = (text) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  return (
    <section className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-800/60">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-emerald-800/60">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
            <Users className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/70 px-3 py-1 rounded-full border border-emerald-700/60 mb-1.5">
              تدرّب على التحدث — حوارات يومية وجمل مترابطة
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              حوارات الحياة اليومية (سؤال وجواب) وتقديم النفس والعائلة
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              تعلّم عبارات التحية والتعارف اليومية مع الرد عليها، وابنِ عرضاً مترابطاً بعد كل درس.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-950/70 p-1.5 rounded-2xl border border-emerald-800/50 self-start">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "current"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            حوارات وبريزينتيشن الدرس {lesson.id}
          </button>
          <button
            onClick={() => setActiveTab("allDialogues")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeTab === "allDialogues"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            بنك الحوارات اليومية (1–{allLessons.length})
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "builder"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            صمّم بريزينتيشن خاصة بك
          </button>
          <button
            onClick={() => setActiveTab("vocab")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "vocab"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            قاموس العائلة والمهن
          </button>
        </div>
      </div>

      {activeTab === "current" && (
        <div className="mt-5 space-y-6">
          {lesson.dailyDialogues && lesson.dailyDialogues.length > 0 && (
            <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-amber-500/40 shadow-lg">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-amber-300">
                    حوارات وعبارات الحياة اليومية للدرس {lesson.id} (السؤال والرد عليه)
                  </h4>
                  <p className="text-xs text-slate-300">
                    اضغط على أيقونة السماعة للاستماع إلى نطق السؤال والرد بالإسبانية
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {lesson.dailyDialogues.map((dlg, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-amber-300 bg-amber-950/70 px-2.5 py-1 rounded-full border border-amber-700/50">
                        💬 {dlg.situation}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSpeak(`${dlg.questionEs} ... ${dlg.answerEs}`)}
                        className="text-xs inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        استمع للحوار كاملاً
                      </button>
                    </div>

                    <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold text-indigo-300 bg-indigo-900/70 px-2 py-0.5 rounded">
                          السؤال / العبارة
                        </span>
                        <button
                          type="button"
                          onClick={() => onSpeak(dlg.questionEs)}
                          className="p-1 rounded-lg bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/40 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p dir="ltr" className="text-sm sm:text-base font-extrabold text-white mt-1.5">
                        {dlg.questionEs}
                      </p>
                      <p dir="ltr" className="text-xs font-mono text-amber-300/90 mt-0.5">
                        /{dlg.questionPron}/
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-indigo-100 mt-1.5">
                        {dlg.questionAr}
                      </p>
                      <p dir="ltr" className="text-[11px] text-slate-400">
                        EN: {dlg.questionEn}
                      </p>
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold text-emerald-300 bg-emerald-900/70 px-2 py-0.5 rounded">
                          الرد المناسب
                        </span>
                        <button
                          type="button"
                          onClick={() => onSpeak(dlg.answerEs)}
                          className="p-1 rounded-lg bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/40 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p dir="ltr" className="text-sm sm:text-base font-extrabold text-emerald-200 mt-1.5">
                        {dlg.answerEs}
                      </p>
                      <p dir="ltr" className="text-xs font-mono text-amber-300/90 mt-0.5">
                        /{dlg.answerPron}/
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-100 mt-1.5">
                        {dlg.answerAr}
                      </p>
                      <p dir="ltr" className="text-[11px] text-slate-400">
                        EN: {dlg.answerEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lesson.presentation && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-900/40 p-4 rounded-2xl border border-emerald-700/50">
                <div>
                  <h4 className="text-base font-bold text-emerald-200">{lesson.presentation.title}</h4>
                  <p className="text-xs text-emerald-100/80 mt-0.5">
                    فقرة مترابطة توظف قواعد ومفردات هذا الدرس في الحديث عنك وعن عائلتك:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSpeak(fullLessonParagraphEs)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow"
                  >
                    <Volume2 className="w-4 h-4" />
                    استمع للفقرة كاملة
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(fullLessonParagraphEs)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-200 border border-emerald-700/50 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "تم النسخ" : "نسخ النص"}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-emerald-800/50">
                <p className="text-xs font-bold text-emerald-400 mb-2">
                  الفقرة الكاملة المترابطة (اقرأها بصوت عالٍ):
                </p>
                <p dir="ltr" className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  “{fullLessonParagraphEs}”
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lesson.presentation.sentences.map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p dir="ltr" className="text-sm sm:text-base font-bold text-white">
                          {s.es}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSpeak(s.es)}
                        className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition shrink-0"
                        title="استمع للجملة"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p dir="ltr" className="text-xs font-mono text-amber-300/90 pl-8">
                      /{s.pron}/
                    </p>
                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <p className="text-sm font-bold text-emerald-200">{s.ar}</p>
                      <p dir="ltr" className="text-xs text-slate-400">
                        EN: {s.en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "allDialogues" && (
        <div className="mt-5 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-emerald-800/50">
            <h4 className="text-sm sm:text-base font-extrabold text-amber-300 mb-1">
              بنك حوارات الحياة اليومية الشامل (الدروس 1 إلى {allLessons.length})
            </h4>
            <p className="text-xs text-slate-300">
              جميع الأسئلة والردود اليومية مرتبة حسب الدروس لمراجعتها والتدرب عليها في أي وقت:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {allLessons.map((les) =>
              (les.dailyDialogues || []).map((dlg, i) => (
                <div
                  key={`${les.id}-${i}`}
                  className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                      الدرس {les.id}: {dlg.situation}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSpeak(`${dlg.questionEs} ... ${dlg.answerEs}`)}
                      className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <p dir="ltr" className="text-xs sm:text-sm font-bold text-indigo-300">
                      Q: {dlg.questionEs}
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">{dlg.questionAr}</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <p dir="ltr" className="text-xs sm:text-sm font-bold text-emerald-300">
                      A: {dlg.answerEs}
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">{dlg.answerAr}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "builder" && (
        <div className="mt-5 space-y-5">
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-emerald-800/50">
            <h4 className="text-sm sm:text-base font-bold text-emerald-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              عدّل بياناتك وبيانات عائلتك لتوليد بريزينتيشن إسبانية خاصة بك فوراً:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">اسمك (Tu nombre):</label>
                <input
                  dir="ltr"
                  value={myName}
                  onChange={(e) => setMyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">بلدك (Tu país):</label>
                <input
                  dir="ltr"
                  value={myCountry}
                  onChange={(e) => setMyCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">مدينتك (Tu ciudad):</label>
                <input
                  dir="ltr"
                  value={myCity}
                  onChange={(e) => setMyCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">مهنتك (Tu profesión):</label>
                <select
                  dir="ltr"
                  value={myJob}
                  onChange={(e) => setMyJob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="ingeniero">ingeniero (مهندس)</option>
                  <option value="ingeniera">ingeniera (مهندسة)</option>
                  <option value="médico">médico (طبيب)</option>
                  <option value="médica">médica (طبيبة)</option>
                  <option value="programador">programador (مبرمج)</option>
                  <option value="programadora">programadora (مبرمجة)</option>
                  <option value="estudiante">estudiante (طالب/ـة)</option>
                  <option value="profesor">profesor (أستاذ)</option>
                  <option value="profesora">profesora (أستاذة)</option>
                  <option value="arquitecto">arquitecto (معماري)</option>
                  <option value="abogado">abogado (محامٍ)</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">اسم الأب (Papá):</label>
                <input
                  dir="ltr"
                  value={dadName}
                  onChange={(e) => setDadName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">مهنة الأب:</label>
                <input
                  dir="ltr"
                  value={dadJob}
                  onChange={(e) => setDadJob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">اسم الأم (Mamá):</label>
                <input
                  dir="ltr"
                  value={momName}
                  onChange={(e) => setMomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">مهنة الأم:</label>
                <input
                  dir="ltr"
                  value={momJob}
                  onChange={(e) => setMomJob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">اسم الأخ (Hermano):</label>
                <input
                  dir="ltr"
                  value={broName}
                  onChange={(e) => setBroName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">مهنة الأخ:</label>
                <input
                  dir="ltr"
                  value={broJob}
                  onChange={(e) => setBroJob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">اسم الأخت (Hermana):</label>
                <input
                  dir="ltr"
                  value={sisName}
                  onChange={(e) => setSisName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 font-semibold">مهنة الأخت:</label>
                <input
                  dir="ltr"
                  value={sisJob}
                  onChange={(e) => setSisJob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/90 rounded-2xl p-5 border border-emerald-700/60 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-400">
                🎤 البريزينتيشن الكاملة الخاصة بك (جاهزة للنطق أو النسخ):
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSpeak(fullCustomParagraphEs)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
                >
                  <Volume2 className="w-4 h-4" />
                  نطق البريزينتيشن كاملة
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(fullCustomParagraphEs)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-200 border border-emerald-700/50 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "تم النسخ" : "نسخ"}
                </button>
              </div>
            </div>

            <p dir="ltr" className="text-base sm:text-lg font-extrabold text-white leading-relaxed">
              “{fullCustomParagraphEs}”
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
              {customPresentationSentences.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-2"
                >
                  <div className="space-y-1">
                    <p dir="ltr" className="text-xs sm:text-sm font-bold text-emerald-300">
                      {item.es}
                    </p>
                    <p className="text-xs text-slate-200">{item.ar}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(item.es)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "vocab" && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-sm font-bold text-emerald-300 mb-3">
              ١. أسماء الإشارة للتقديم (هذا / هذه)
            </h4>
            <div className="space-y-2.5">
              {helperVocab.demonstratives.map((d, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div>
                    <p dir="ltr" className="text-sm font-bold text-white">
                      {d.es}{" "}
                      <span className="text-xs font-mono text-amber-300">/{d.pron}/</span>
                    </p>
                    <p className="text-xs text-emerald-200 mt-0.5">{d.ar}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(d.es)}
                    className="p-1.5 rounded-lg bg-slate-800 text-emerald-300 hover:bg-emerald-500/20"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-sm font-bold text-emerald-300 mb-3">
              ٢. أفراد العائلة (La Familia)
            </h4>
            <div className="space-y-2.5">
              {helperVocab.family.map((f, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div>
                    <p dir="ltr" className="text-sm font-bold text-white">
                      {f.es}{" "}
                      <span className="text-xs font-mono text-amber-300">/{f.pron}/</span>
                    </p>
                    <p className="text-xs text-emerald-200 mt-0.5">{f.ar}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(f.es)}
                    className="p-1.5 rounded-lg bg-slate-800 text-emerald-300 hover:bg-emerald-500/20"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-sm font-bold text-emerald-300 mb-3">
              ٣. المهن والوظائف (Las Profesiones)
            </h4>
            <div className="space-y-2.5">
              {helperVocab.professions.map((p, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div>
                    <p dir="ltr" className="text-sm font-bold text-white">
                      {p.es}{" "}
                      <span className="text-xs font-mono text-amber-300">/{p.pron}/</span>
                    </p>
                    <p className="text-xs text-emerald-200 mt-0.5">{p.ar}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(p.es)}
                    className="p-1.5 rounded-lg bg-slate-800 text-emerald-300 hover:bg-emerald-500/20"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// المكون الرئيسي للتطبيق
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(() => {
    try {
      const saved = Number(localStorage.getItem("tg_spanish_lesson_v1"));
      return Number.isInteger(saved) && saved >= 1 && saved <= lessonsData.length ? saved - 1 : 0;
    } catch {
      return 0;
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showLessonGrid, setShowLessonGrid] = useState(false);
  const [revealedPrompts, setRevealedPrompts] = useState({});

  const [masteredWords, setMasteredWords] = useState(() => {
    try {
      const saved = localStorage.getItem("lt_spanish_mastered_v5");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("lt_spanish_mastered_v5", JSON.stringify(masteredWords));
    } catch {
      // ignore storage errors
    }
  }, [masteredWords]);

  useEffect(() => {
    try {
      localStorage.setItem("tg_spanish_lesson_v1", String(currentLessonIndex + 1));
    } catch {
      // The lesson remains usable when storage is unavailable.
    }
  }, [currentLessonIndex]);

  const currentLesson = lessonsData[currentLessonIndex];

  const speakSpanish = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const cleaned = text.replace(/\s*\/.*$/, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = "es-ES";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMastered = (word) => {
    setMasteredWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const filteredVocabulary = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return currentLesson.vocabulary;
    return currentLesson.vocabulary.filter(
      (item) =>
        item.spanish.toLowerCase().includes(q) ||
        item.arabic.toLowerCase().includes(q) ||
        item.english.toLowerCase().includes(q) ||
        item.pronunciation.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [currentLesson, searchQuery]);

  const totalVocabCount = useMemo(
    () => lessonsData.reduce((acc, l) => acc + l.vocabulary.length, 0),
    []
  );

  const goPrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prev) => prev - 1);
      setRevealedPrompts({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNext = () => {
    if (currentLessonIndex < lessonsData.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
      setRevealedPrompts({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        dir="rtl"
        className="spanish-course min-h-screen bg-[#faf5eb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300"
      >
        {/* الشريط العلوي */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-[#f5ecd6]/95 dark:bg-slate-900/95 border-b border-[#d8bd85] dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#185f65] flex items-center justify-center text-white">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    اللغة الإسبانية — Language Transfer
                  </h1>
                  <span className="hidden md:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-300 border border-orange-500/30">
                    ٥٠ درسًا للاستماع والتدريب
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  دليل السياحة • تعلّم ببناء الجمل والاستماع والحوار
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href="../spanish-language/" className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-[#185f65] border border-[#d8bd85] hover:bg-[#faf5eb] transition whitespace-nowrap">صفحة المادة</a>
              <button
                onClick={() => setShowIntroModal(!showIntroModal)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">مقدمة المنهج (Track 1)</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>
                  تم إتقان {masteredWords.length} / {totalVocabCount} كلمة
                </span>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                aria-label="تبديل الوضع الليلي"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200/80 dark:border-slate-700"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* نافذة مقدمة الكورس Track 1 */}
        {showIntroModal && (
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <div className="rounded-2xl bg-gradient-to-l from-indigo-950 via-slate-900 to-slate-900 text-white p-5 border border-indigo-800/70 shadow-lg">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    Track 1 • مدخل مهم قبل البدء
                  </span>
                  <h2 className="text-lg font-bold mt-0.5">{courseIntro.title}</h2>
                </div>
                <button
                  onClick={() => setShowIntroModal(false)}
                  className="text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg"
                >
                  إغلاق ✕
                </button>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed mb-2">{courseIntro.summaryAr}</p>
              <p dir="ltr" className="text-xs text-indigo-200 leading-relaxed mb-4">
                {courseIntro.summaryEn}
              </p>
              <MediaEmbedPlayer
                soundcloudUrl={courseIntro.soundcloudUrl}
                videoUrl={courseIntro.videoUrl}
                youtubeId={courseIntro.youtubeId}
                title={courseIntro.title}
                trackNumber={courseIntro.trackNumber}
                duration={courseIntro.duration}
              />
            </div>
          </div>
        )}

        {/* المحتوى الرئيسي */}
        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <div className="rounded-2xl bg-[#185f65] text-white px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#ebd9b4] mb-1">مسارك في الإسبانية</p>
              <p className="font-bold text-base sm:text-lg">اسمع السؤال، أوقف التسجيل، كوّن الإجابة بصوتك، ثم قارنها.</p>
            </div>
            <span className="text-xs font-bold bg-white/15 rounded-full px-3 py-1.5 self-start sm:self-auto whitespace-nowrap">الدرس {currentLessonIndex + 1} من {lessonsData.length}</span>
          </div>
          {/* شريط اختيار الدروس (1 إلى 40) + أزرار التنقل العلوية */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <button type="button" onClick={() => setShowLessonGrid((open) => !open)} aria-expanded={showLessonGrid} className="text-xs font-bold text-[#185f65] dark:text-slate-200 bg-[#d7efef] dark:bg-slate-800 border border-[#b6d9d8] dark:border-slate-700 px-3 py-2 rounded-xl">
                {showLessonGrid ? "إخفاء فهرس الدروس" : `تصفح جميع الدروس (${lessonsData.length})`}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  disabled={currentLessonIndex === 0}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>الحلقة السابقة</span>
                </button>

                <button
                  onClick={goNext}
                  disabled={currentLessonIndex === lessonsData.length - 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 transition shadow-sm"
                >
                  <span>الحلقة التالية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showLessonGrid && <div className="grid grid-cols-3 min-[390px]:grid-cols-4 sm:grid-cols-7 lg:grid-cols-10 gap-1.5">
              {lessonsData.map((lesson, idx) => {
                const isActive = idx === currentLessonIndex;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setCurrentLessonIndex(idx);
                      setRevealedPrompts({});
                    }}
                    className={`px-2 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25"
                        : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>الدرس {lesson.id}</span>
                    <span
                      className={`text-[10px] font-normal ${
                        isActive ? "text-indigo-200" : "text-slate-400"
                      }`}
                    >
                      Track {lesson.trackNumber}
                    </span>
                  </button>
                );
              })}
            </div>}
          </div>

          {/* 1. مشغل SoundCloud / YouTube المدمج وعنوان الحلقة */}
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    الحلقة {currentLesson.id} من {lessonsData.length} (Track {currentLesson.trackNumber})
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h2>
                <p dir="ltr" className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 text-right">
                  {currentLesson.subtitle}
                </p>
              </div>
            </div>

            <MediaEmbedPlayer
              soundcloudUrl={currentLesson.soundcloudUrl}
              videoUrl={currentLesson.videoUrl}
              youtubeId={currentLesson.youtubeId}
              title={currentLesson.title}
              trackNumber={currentLesson.trackNumber}
              duration={currentLesson.duration}
            />
          </section>

          {/* 2. الشرح الأول بعد المشغل باللغة الإنجليزية متبوعاً بالشرح العربي المبسط ثم الأمثلة الموسعة */}
          <section className="space-y-5">
            {/* الصندوق الأول: الشرح باللغة الإنجليزية (English Grammar & Thinking Method Explanation) */}
            <div
              dir="ltr"
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white p-5 sm:p-7 shadow-xl border border-indigo-800/60"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-800/60">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-1">
                      Step 1 • Grammar & Thinking Method Rule (English Explanation)
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {currentLesson.grammarRule.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm sm:text-base text-indigo-100/95 leading-relaxed">
                {currentLesson.grammarRule.summary}
              </p>

              {/* النقاط التفصيلية للقاعدة بالإنجليزية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
                {currentLesson.grammarRule.rules.map((r, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-800/50 hover:border-indigo-500/50 transition"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <h4 className="font-bold text-amber-300 text-sm sm:text-base">{r.rule}</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{r.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* الصندوق الثاني: الشرح العربي المبسط والجميل + جميع الأمثلة */}
            {currentLesson.grammarRule.arabicExplanation && (
              <div
                dir="rtl"
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/90 via-slate-900 to-slate-900 text-white p-5 sm:p-7 shadow-xl border border-amber-700/50"
              >
                <div className="flex items-start gap-3.5 pb-4 border-b border-amber-800/50">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <span className="inline-block text-xs font-bold text-amber-300 bg-amber-500/15 px-3 py-0.5 rounded-full border border-amber-400/30 mb-1">
                      الخطوة ٢ • الشرح العربي المبسط والواضح للقاعدة
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {currentLesson.grammarRule.arabicExplanation.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-amber-100/95 leading-relaxed">
                      {currentLesson.grammarRule.arabicExplanation.summary}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
                  {currentLesson.grammarRule.arabicExplanation.steps.map((stepText, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-amber-800/40 hover:border-amber-500/50 transition flex items-start gap-3"
                    >
                      <span className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                        {stepText}
                      </p>
                    </div>
                  ))}
                </div>

                {/* أمثلة الحلقة + الأمثلة الإضافية */}
                <div className="mt-6 pt-5 border-t border-amber-800/50">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h4 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-amber-300" />
                      <span>
                        أمثلة الدرس وتدريبات إضافية ({currentLesson.grammarRule.examples.length} أمثلة):
                      </span>
                    </h4>
                    <span className="text-xs text-slate-300">
                      اضغط على أي مثال للاستماع لنطقه بالإسبانية
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentLesson.grammarRule.examples.map((ex, i) => (
                      <div
                        key={i}
                        onClick={() => speakSpanish(ex.es)}
                        className="p-3.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              ex.isExtra
                                ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/60"
                                : "bg-indigo-950/80 text-indigo-300 border-indigo-700/60"
                            }`}
                          >
                            {ex.isExtra ? "✨ مثال إضافي" : "🎧 مثال الدرس"}
                          </span>
                          <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                        </div>

                        <div dir="ltr" className="text-left">
                          <p className="text-sm sm:text-base font-bold text-white">{ex.es}</p>
                          <p className="text-xs font-mono text-amber-300/90 mt-0.5">
                            /{ex.pronunciation}/
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 space-y-0.5">
                          <p className="text-xs sm:text-sm text-emerald-300 font-bold">{ex.ar}</p>
                          {ex.en && (
                            <p dir="ltr" className="text-[11px] text-slate-400 text-left">
                              EN: {ex.en}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 3. شبكة بطاقات المفردات (Flashcards Grid) */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>بطاقات المفردات (Flashcards)</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {filteredVocabulary.length} كلمة
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  تضم الكلمات испанي + النطق اللاتيني + المعنى بالعربية والإنجليزية مع النطق الصوتي
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالعربي أو الإسباني أو الإنجليزي..."
                    className="w-full pr-9 pl-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={() => setShowAllTranslations(!showAllTranslations)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    showAllTranslations
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {showAllTranslations ? "إخفاء الترجمات" : "إظهار كل الترجمات"}
                </button>
              </div>
            </div>

            {filteredVocabulary.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500">لا توجد كلمات مطابقة لبحثك في هذا الدرس.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVocabulary.map((item, index) => (
                  <VocabularyCard
                    key={`${currentLesson.id}-${item.spanish}-${index}`}
                    item={item}
                    isMastered={masteredWords.includes(item.spanish)}
                    onToggleMastered={toggleMastered}
                    onSpeak={speakSpanish}
                    showAllTranslations={showAllTranslations}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 4. قسم الحوارات اليومية وبناء الجمل المترابطة (البريزينتيشن) */}
          <DailyDialoguesAndPresentationSection
            lesson={currentLesson}
            allLessons={lessonsData}
            helperVocab={presentationHelperVocab}
            onSpeak={speakSpanish}
          />

          {/* 5. تدريب سريع بطريقة التفكير (Thinking Method Practice) */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                اختبر نفسك بمنهجية التفكير (Thinking Method Exercises)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              فكّر في كيفية تركيب الجملة بالإسبانية أولاً، ثم اضغط لإظهار الإجابة والاستماع إليها:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentLesson.practicePrompts.map((p, idx) => {
                const isRevealed = !!revealedPrompts[idx];
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        سؤال {idx + 1}
                      </span>
                      <p dir="ltr" className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 text-left">
                        {p.prompt}
                      </p>
                      <p dir="ltr" className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-left">
                        💡 Hint: {p.hint}
                      </p>
                    </div>

                    {isRevealed ? (
                      <div
                        onClick={() => speakSpanish(p.answer)}
                        className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between cursor-pointer"
                      >
                        <span
                          dir="ltr"
                          className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300"
                        >
                          {p.answer}
                        </span>
                        <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setRevealedPrompts((prev) => ({ ...prev, [idx]: true }))
                        }
                        className="w-full py-2 rounded-lg text-xs font-bold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 transition"
                      >
                        أظهر الإجابة واستمع للنطق
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 6. أزرار التنقل السفلية (الحلقة السابقة / الحلقة التالية) */}
          <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 pb-8">
            <button
              onClick={goPrev}
              disabled={currentLessonIndex === 0}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-5 h-5" />
              <span>
                الحلقة السابقة
                {currentLessonIndex > 0
                  ? `: الدرس ${lessonsData[currentLessonIndex - 1].id}`
                  : ""}
              </span>
            </button>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              الدرس {currentLesson.id} من {lessonsData.length} • Track {currentLesson.trackNumber}
            </div>

            <button
              onClick={goNext}
              disabled={currentLessonIndex === lessonsData.length - 1}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>
                الحلقة التالية
                {currentLessonIndex < lessonsData.length - 1
                  ? `: الدرس ${lessonsData[currentLessonIndex + 1].id}`
                  : ""}
              </span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
