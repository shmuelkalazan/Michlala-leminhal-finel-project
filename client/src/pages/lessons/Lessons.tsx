import React from "react";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/authAtom";
import { Student } from "../../types/interface";
import { useLessons } from "./useLessons";
import LessonsFilters from "./LessonsFilters";
import LessonCard from "./LessonCard";
import styles from "./lessons.module.scss";

const Lessons: React.FC = () => {
  const { t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const {
    lessons: filteredLessons,
    futureLessons,
    loading,
    error,
    busyId,
    selectedCoach,
    selectedBranch,
    selectedDate,
    uniqueCoaches,
    uniqueBranches,
    setSelectedCoach,
    setSelectedBranch,
    setSelectedDate,
    handleToggle,
    clearFilters,
  } = useLessons(user);

  const isUser = user?.role === "user";

  if (loading) return <div className={styles.lessonsLoading}>{t("loadingLessons")}</div>;

  return (
    <div className={styles.lessonsContainer}>
      {error && <div className={styles.lessonsError}>{error}</div>}

      <LessonsFilters
        selectedCoach={selectedCoach}
        selectedBranch={selectedBranch}
        selectedDate={selectedDate}
        uniqueCoaches={uniqueCoaches}
        uniqueBranches={uniqueBranches}
        onCoachChange={setSelectedCoach}
        onBranchChange={setSelectedBranch}
        onDateChange={setSelectedDate}
        onClearFilters={clearFilters}
      />

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
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              user={user}
              isUser={isUser}
              enrolled={enrolled}
              busy={busyId === lesson._id}
              onToggle={handleToggle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Lessons;
