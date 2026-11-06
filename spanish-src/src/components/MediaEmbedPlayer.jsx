import React, { useState, useMemo } from "react";
import { Radio, Headphones, PlayCircle, Video } from "lucide-react";

export default function MediaEmbedPlayer({ soundcloudUrl, videoUrl, youtubeId, title, trackNumber, duration }) {
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
              SoundCloud (الرسمي)
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
