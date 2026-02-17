import { useMemo } from "react";
import { Lesson } from "../../../types/interface";

interface UseLessonsDataReturn {
  pastLessons: Lesson[];
  futureLessons: Lesson[];
}

export const useLessonsData = (lessons: Lesson[]): UseLessonsDataReturn => {
  const { pastLessons, futureLessons } = useMemo(() => {
    const now = new Date();
    const past: Lesson[] = [];
    const future: Lesson[] = [];

    lessons.forEach((lesson) => {
      if (!lesson.date) {
        future.push(lesson);
        return;
      }

      const lessonDate = new Date(lesson.date);
      // Parse time if available
      if (lesson.startTime) {
        const [hours, minutes] = lesson.startTime.split(':').map(Number);
        lessonDate.setHours(hours || 0, minutes || 0, 0, 0);
      }

      if (lessonDate < now) {
        past.push(lesson);
      } else {
        future.push(lesson);
      }
    });

    const getTimestamp = (l: Lesson) => {
      const d = l.date ? new Date(l.date) : new Date(0);
      const timeStr = l.startTime || l.time || "00:00";
      const [h, m] = timeStr.split(":").map(Number);
      d.setHours(h || 0, m || 0, 0, 0);
      return d.getTime();
    };

    // Sort past lessons by date+time (newest first)
    past.sort((a, b) => getTimestamp(b) - getTimestamp(a));

    // Sort future lessons by date+time (earliest first)
    future.sort((a, b) => getTimestamp(a) - getTimestamp(b));

    return { pastLessons: past, futureLessons: future };
  }, [lessons]);

  return { pastLessons, futureLessons };
};
