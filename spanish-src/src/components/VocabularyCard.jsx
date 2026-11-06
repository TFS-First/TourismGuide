import React, { useState } from "react";
import { Volume2, CheckCircle2, RotateCw } from "lucide-react";

export default function VocabularyCard({ item, isMastered, onToggleMastered, onSpeak, showAllTranslations }) {
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
