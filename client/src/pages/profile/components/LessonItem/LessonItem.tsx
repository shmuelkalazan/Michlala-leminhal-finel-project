import { useTranslation } from "react-i18next";
import { Lesson } from "../../../../types/interface";
import styles from "./LessonItem.module.scss";

interface LessonItemProps {
  lesson: Lesson;
  isPast: boolean;
  onCancel?: (lessonId?: string) => void;
  isCanceling?: boolean;
}

const LessonItem = ({ lesson, isPast, onCancel, isCanceling }: LessonItemProps) => {
  const { t } = useTranslation();

  return (
    <li className={`${styles.listItem} ${isPast ? styles.pastLesson : ''}`}>
      <div className={styles.lessonHeader}>
        <div className={styles.lessonTitle}>{lesson.title || lesson.name}</div>
        {!isPast && onCancel && (
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => onCancel(lesson._id)}
            disabled={isCanceling}
          >
            {isCanceling ? t("saving") : t("cancelRegistration")}
          </button>
        )}
        {isPast && (
          <span className={styles.pastLabel}>{t("completed") || "בוצע"}</span>
        )}
      </div>

      <div className={styles.lessonMeta}>
        <div>
          <strong>{t("coach")}:</strong>{" "}
          {typeof lesson.coachId === "object" && lesson.coachId?.name
            ? lesson.coachId.name
            : lesson.coachName || "-"}
        </div>
        <div>
          <strong>{t("date")}:</strong>{" "}
          {lesson.date ? new Date(lesson.date).toLocaleDateString() : "-"}
        </div>
        <div>
          <strong>{t("time")}:</strong> {lesson.startTime || lesson.time || "-"}
        </div>

        {lesson.branchId && typeof lesson.branchId === "object" && (
          <>
            <div>
              <strong>{t("branches")}:</strong> {lesson.branchId.name || "-"}
            </div>
            <div>
              <strong>{t("address")}:</strong> {lesson.branchId.address || "-"}
            </div>
          </>
        )}
      </div>
    </li>
  );
};

export default LessonItem;
