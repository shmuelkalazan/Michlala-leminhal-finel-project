import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/authAtom";
import { fetchLessons, enrollInLesson, cancelLesson } from "../../api/lessons";
import styles from "./lessons.module.scss";
import { Student, Lesson } from "../../types/interface";

const Lessons: React.FC = () => {
  const { t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Fetch lessons on component mount
  useEffect(() => {
    setLoading(true);
    setError(null);
      fetchLessons()
      .then((data) => {
        setLessons(data || []);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || t("somethingWentWrong"));
        setLessons([]);
      })
      .finally(() => setLoading(false));
  }, [t]);

  const isUser = user?.role === "user";
  const handleToggle = async (lessonId?: string, isEnrolled?: boolean) => {
    if (!user?.id || !lessonId) return setError(t("loginRequired"));
    const userId = user.id;
    setBusyId(lessonId);
    try {
      const fn = isEnrolled ? cancelLesson : enrollInLesson;
      await fn(lessonId);
      setLessons((prev) =>
        prev.map((l) =>
          l._id === lessonId
            ? {
                ...l,
                students: isEnrolled
                  ? (l.students || []).filter((s) => s._id !== userId && s.email !== user.email)
                  : [...(l.students || []), { _id: userId, name: user.name, email: user.email }],
              }
            : l
        )
      );
    } catch (err: any) {
      setError(err.message || t("updateFailed"));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className={styles.lessonsLoading}>{t("loadingLessons")}</div>;

  return (
    <div className={styles.lessonsContainer}>
      {error && <div className={styles.lessonsError}>{error}</div>}
      {!loading && lessons.length === 0 && !error && (
        <div className={styles.lessonsError}>{t("noLessonsAvailable") || "No lessons available"}</div>
      )}
      {lessons.map((lesson) => {
        const enrolled = (lesson.students || []).some(
          (s: Student) => s._id === user?.id || s.email === user?.email
        );
        return (
          <div key={lesson._id} className={styles.lessonCard}>
            <div className={styles.lessonHeader}>
              <h2 className={styles.lessonTitle}>{lesson.title || lesson.name}</h2>
              <span className={styles.lessonType}>{lesson.type}</span>
            </div>

            <div className={styles.lessonInfo}>
              <p><strong>{t("coach")}:</strong> {lesson.coachName}</p>
              <p><strong>{t("date")}:</strong> {new Date(lesson.date).toLocaleDateString()}</p>
              <p><strong>{t("time")}:</strong> {lesson.startTime || lesson.time}</p>
              {lesson.branchId && typeof lesson.branchId === 'object' && lesson.branchId.address && (
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
                    <ul>{lesson.students.map((s: Student) => <li key={s._id}>{s.name} - {s.email}</li>)}</ul>
                  ) : (
                    <p className={styles.noStudents}>{t("noStudentsEnrolled")}</p>
                  )
                ) : (
                  <span> {lesson.students?.length || 0}</span>
                )}
              </div>
            )}
            {isUser && (
              <button className={styles.loginBtn} onClick={() => handleToggle(lesson._id, enrolled)} disabled={busyId === lesson._id}>
                {busyId === lesson._id ? t("saving") : enrolled ? t("cancelRegistration") : t("registerBtn")}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Lessons;
