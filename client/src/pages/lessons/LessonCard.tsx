import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./lessons.module.scss";
import { Lesson, Student } from "../../types/interface";

interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface LessonCardProps {
  lesson: Lesson;
  user: AuthUser | null;
  isUser: boolean;
  enrolled: boolean;
  busy: boolean;
  onToggle: (lessonId: string | undefined, isEnrolled: boolean) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  user,
  isUser,
  enrolled,
  busy,
  onToggle,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.lessonCard}>
      <div className={styles.lessonHeader}>
        <h2 className={styles.lessonTitle}>{lesson.title || lesson.name}</h2>
        {lesson.type && <span className={styles.lessonType}>{lesson.type}</span>}
      </div>

      <div className={styles.lessonInfo}>
        <p><strong>{t("coach")}:</strong> {lesson.coachName}</p>
        <p><strong>{t("date")}:</strong> {new Date(lesson.date).toLocaleDateString()}</p>
        <p><strong>{t("time")}:</strong> {lesson.startTime || lesson.time}</p>
        {lesson.branchId && typeof lesson.branchId === "object" && lesson.branchId.address && (
          <>
            <p><strong>{t("location") || "Location"}:</strong> {lesson.branchId.address}</p>
            {lesson.branchId.phone && (
              <p><strong>{t("phone") || "Phone"}:</strong> {lesson.branchId.phone}</p>
            )}
          </>
        )}
      </div>

      {user && (
        <div className={styles.lessonStudents}>
          <strong>{t("students")}:</strong>
          {(user.role === "trainer" || user.role === "admin") ? (
            lesson.students && lesson.students.length > 0 ? (
              <ul>
                {lesson.students.map((s: Student) => (
                  <li key={s._id}>{s.name} - {s.email}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.noStudents}>{t("noStudentsEnrolled")}</p>
            )
          ) : (
            <span> {lesson.students?.length || 0}</span>
          )}
        </div>
      )}

      {isUser && (
        <button
          className={styles.loginBtn}
          onClick={() => onToggle(lesson._id, enrolled)}
          disabled={busy}
        >
          {busy ? t("saving") : enrolled ? t("cancelRegistration") : t("registerBtn")}
        </button>
      )}
    </div>
  );
};

export default LessonCard;
