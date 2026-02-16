import { useTranslation } from "react-i18next";
import { Lesson } from "../../../../types/interface";
import LessonItem from "../LessonItem/LessonItem";
import styles from "./LessonsSection.module.scss";

interface LessonsSectionProps {
  title: string;
  lessons: Lesson[];
  isPast: boolean;
  onCancel?: (lessonId?: string) => void;
  cancelingId?: string | null;
}

const LessonsSection = ({ 
  title, 
  lessons, 
  isPast, 
  onCancel, 
  cancelingId 
}: LessonsSectionProps) => {
  if (lessons.length === 0) {
    return null;
  }

  return (
    <div className={styles.lessonsCard}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <ul className={styles.list}>
        {lessons.map((lesson) => (
          <LessonItem
            key={lesson._id}
            lesson={lesson}
            isPast={isPast}
            onCancel={onCancel}
            isCanceling={cancelingId === lesson._id}
          />
        ))}
      </ul>
    </div>
  );
};

export default LessonsSection;
