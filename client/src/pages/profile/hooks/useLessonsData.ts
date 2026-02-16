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

    // Sort past lessons by date (newest first)
    past.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    // Sort future lessons by date (oldest first)
    future.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });

    return { pastLessons: past, futureLessons: future };
  }, [lessons]);

  return { pastLessons, futureLessons };
};
