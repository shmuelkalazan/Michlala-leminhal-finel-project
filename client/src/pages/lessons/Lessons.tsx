import React, { useEffect, useMemo, useState } from "react";
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
  
  // Filter states
  const [selectedCoach, setSelectedCoach] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

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

  // Filter out past lessons - only show future lessons
  const futureLessons = useMemo(() => {
    const now = new Date();
    return lessons.filter((lesson) => {
      if (!lesson.date) {
        return true; // Include lessons without date
      }

      const lessonDate = new Date(lesson.date);
      // Parse time if available
      if (lesson.startTime) {
        const [hours, minutes] = lesson.startTime.split(':').map(Number);
        lessonDate.setHours(hours || 0, minutes || 0, 0, 0);
      } else if (lesson.time) {
        const [hours, minutes] = lesson.time.split(':').map(Number);
        lessonDate.setHours(hours || 0, minutes || 0, 0, 0);
      }

      return lessonDate >= now;
    });
  }, [lessons]);

  // Extract unique coaches and branches from future lessons only
  const { uniqueCoaches, uniqueBranches } = useMemo(() => {
    const coaches = new Set<string>();
    const branches = new Set<string>();
    
    futureLessons.forEach((lesson) => {
      if (lesson.coachName) {
        coaches.add(lesson.coachName);
      }
      if (lesson.branchId && typeof lesson.branchId === "object" && lesson.branchId.name) {
        branches.add(lesson.branchId.name);
      }
    });
    
    return {
      uniqueCoaches: Array.from(coaches).sort(),
      uniqueBranches: Array.from(branches).sort(),
    };
  }, [futureLessons]);

  // Filter future lessons based on selected filters
  const filteredLessons = useMemo(() => {
    return futureLessons.filter((lesson) => {
      // Filter by coach
      if (selectedCoach && lesson.coachName !== selectedCoach) {
        return false;
      }
      
      // Filter by branch
      if (selectedBranch) {
        const branchName = lesson.branchId && typeof lesson.branchId === "object" 
          ? lesson.branchId.name 
          : "";
        if (branchName !== selectedBranch) {
          return false;
        }
      }
      
      // Filter by date
      if (selectedDate) {
        const lessonDate = new Date(lesson.date);
        const filterDate = new Date(selectedDate);
        const lessonDateStr = lessonDate.toISOString().split('T')[0];
        const filterDateStr = filterDate.toISOString().split('T')[0];
        if (lessonDateStr !== filterDateStr) {
          return false;
        }
      }
      
      return true;
    });
  }, [futureLessons, selectedCoach, selectedBranch, selectedDate]);

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
      
      {/* Filters Section */}
      <div className={styles.filtersContainer}>
        <h2 className={styles.filtersTitle}>{t("filterLessons") || "סינון שיעורים"}</h2>
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label htmlFor="coach-filter" className={styles.filterLabel}>
              {t("coach")}:
            </label>
            <select
              id="coach-filter"
              className={styles.filterSelect}
              value={selectedCoach}
              onChange={(e) => setSelectedCoach(e.target.value)}
            >
              <option value="">{t("allCoaches") || "כל המאמנים"}</option>
              {uniqueCoaches.map((coach) => (
                <option key={coach} value={coach}>
                  {coach}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="branch-filter" className={styles.filterLabel}>
              {t("location") || "מיקום"}:
            </label>
            <select
              id="branch-filter"
              className={styles.filterSelect}
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">{t("allLocations") || "כל המיקומים"}</option>
              {uniqueBranches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="date-filter" className={styles.filterLabel}>
              {t("date")}:
            </label>
            <input
              id="date-filter"
              type="date"
              className={styles.filterInput}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {(selectedCoach || selectedBranch || selectedDate) && (
            <button
              className={styles.clearFiltersBtn}
              onClick={() => {
                setSelectedCoach("");
                setSelectedBranch("");
                setSelectedDate("");
              }}
            >
              {t("clearFilters") || "נקה סינונים"}
            </button>
          )}
        </div>
      </div>

      {!loading && filteredLessons.length === 0 && !error && (
        <div className={styles.lessonsError}>
          {futureLessons.length === 0 
            ? t("noUpcomingLessons") || "אין שיעורים קרובים"
            : t("noFilteredLessons") || "אין שיעורים התואמים לסינון"}
        </div>
      )}
      <div className={styles.lessonsGrid}>
        {filteredLessons.map((lesson) => {
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
    </div>
  );
};

export default Lessons;
