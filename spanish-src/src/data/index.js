import { normalizeLesson } from "./normalizeLesson.js";
// المجمع الرئيسي لبيانات الدروس (Barrel File)
// عند إضافة درس جديد (مثلاً lesson-51.js)، قم باستيراده هنا وإضافته إلى مصفوفة lessonsData

export { courseIntro } from "./courseIntro.js";
export { presentationHelperVocab } from "./presentationHelperVocab.js";

import { lesson01 } from "./lessons/lesson-01.js";
import { lesson02 } from "./lessons/lesson-02.js";
import { lesson03 } from "./lessons/lesson-03.js";
import { lesson04 } from "./lessons/lesson-04.js";
import { lesson05 } from "./lessons/lesson-05.js";
import { lesson06 } from "./lessons/lesson-06.js";
import { lesson07 } from "./lessons/lesson-07.js";
import { lesson08 } from "./lessons/lesson-08.js";
import { lesson09 } from "./lessons/lesson-09.js";
import { lesson10 } from "./lessons/lesson-10.js";
import { lesson11 } from "./lessons/lesson-11.js";
import { lesson12 } from "./lessons/lesson-12.js";
import { lesson13 } from "./lessons/lesson-13.js";
import { lesson14 } from "./lessons/lesson-14.js";
import { lesson15 } from "./lessons/lesson-15.js";
import { lesson16 } from "./lessons/lesson-16.js";
import { lesson17 } from "./lessons/lesson-17.js";
import { lesson18 } from "./lessons/lesson-18.js";
import { lesson19 } from "./lessons/lesson-19.js";
import { lesson20 } from "./lessons/lesson-20.js";
import { lesson21 } from "./lessons/lesson-21.js";
import { lesson22 } from "./lessons/lesson-22.js";
import { lesson23 } from "./lessons/lesson-23.js";
import { lesson24 } from "./lessons/lesson-24.js";
import { lesson25 } from "./lessons/lesson-25.js";
import { lesson26 } from "./lessons/lesson-26.js";
import { lesson27 } from "./lessons/lesson-27.js";
import { lesson28 } from "./lessons/lesson-28.js";
import { lesson29 } from "./lessons/lesson-29.js";
import { lesson30 } from "./lessons/lesson-30.js";
import { lesson31 } from "./lessons/lesson-31.js";
import { lesson32 } from "./lessons/lesson-32.js";
import { lesson33 } from "./lessons/lesson-33.js";
import { lesson34 } from "./lessons/lesson-34.js";
import { lesson35 } from "./lessons/lesson-35.js";
import { lesson36 } from "./lessons/lesson-36.js";
import { lesson37 } from "./lessons/lesson-37.js";
import { lesson38 } from "./lessons/lesson-38.js";
import { lesson39 } from "./lessons/lesson-39.js";
import { lesson40 } from "./lessons/lesson-40.js";
import { lesson41 } from "./lessons/lesson-41.js";
import { lesson42 } from "./lessons/lesson-42.js";
import { lesson43 } from "./lessons/lesson-43.js";
import { lesson44 } from "./lessons/lesson-44.js";
import { lesson45 } from "./lessons/lesson-45.js";
import { lesson46 } from "./lessons/lesson-46.js";
import { lesson47 } from "./lessons/lesson-47.js";
import { lesson48 } from "./lessons/lesson-48.js";
import { lesson49 } from "./lessons/lesson-49.js";
import { lesson50 } from "./lessons/lesson-50.js";

export const rawLessonsData = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
  lesson11,
  lesson12,
  lesson13,
  lesson14,
  lesson15,
  lesson16,
  lesson17,
  lesson18,
  lesson19,
  lesson20,
  lesson21,
  lesson22,
  lesson23,
  lesson24,
  lesson25,
  lesson26,
  lesson27,
  lesson28,
  lesson29,
  lesson30,
  lesson31,
  lesson32,
  lesson33,
  lesson34,
  lesson35,
  lesson36,
  lesson37,
  lesson38,
  lesson39,
  lesson40,
  lesson41,
  lesson42,
  lesson43,
  lesson44,
  lesson45,
  lesson46,
  lesson47,
  lesson48,
  lesson49,
  lesson50,
];

export const lessonsData = rawLessonsData.map(normalizeLesson);

export { normalizeLesson };
export default lessonsData;
