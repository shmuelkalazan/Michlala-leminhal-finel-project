import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchLessons, enrollInLesson, cancelLesson } from "../../api/lessons";
import { Lesson } from "../../types/interface";
import { AuthUser } from "../../state/authAtom";

export const useLessons = (user: AuthUser | null) => {
  const { t } = useTranslation();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

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

  const futureLessons = useMemo(() => {
    const now = new Date();
    return lessons.filter((lesson) => {
      if (!lesson.date) return true;

      const lessonDate = new Date(lesson.date);
      if (lesson.startTime) {
        const [hours, minutes] = lesson.startTime.split(":").map(Number);
        lessonDate.setHours(hours || 0, minutes || 0, 0, 0);
      } else if (lesson.time) {
        const [hours, minutes] = lesson.time.split(":").map(Number);
        lessonDate.setHours(hours || 0, minutes || 0, 0, 0);
      }

      return lessonDate >= now;
    });
  }, [lessons]);

  const { uniqueCoaches, uniqueBranches } = useMemo(() => {
    const coaches = new Set<string>();
    const branches = new Set<string>();

    futureLessons.forEach((lesson) => {
      if (lesson.coachName) coaches.add(lesson.coachName);
      if (lesson.branchId && typeof lesson.branchId === "object" && lesson.branchId.name) {
        branches.add(lesson.branchId.name);
      }
    });

    return {
      uniqueCoaches: Array.from(coaches).sort(),
      uniqueBranches: Array.from(branches).sort(),
    };
  }, [futureLessons]);

  const filteredLessons = useMemo(() => {
    const filtered = futureLessons.filter((lesson) => {
      if (selectedCoach && lesson.coachName !== selectedCoach) return false;

      if (selectedBranch) {
        const branchName =
          lesson.branchId && typeof lesson.branchId === "object" ? lesson.branchId.name : "";
        if (branchName !== selectedBranch) return false;
      }

      if (selectedDate) {
        const lessonDate = new Date(lesson.date);
        const filterDate = new Date(selectedDate);
        const lessonDateStr = lessonDate.toISOString().split("T")[0];
        const filterDateStr = filterDate.toISOString().split("T")[0];
        if (lessonDateStr !== filterDateStr) return false;
      }

      return true;
    });

    const getTimestamp = (l: Lesson) => {
      const d = new Date(l.date);
      const timeStr = l.startTime || l.time || "00:00";
      const [h, m] = timeStr.split(":").map(Number);
      d.setHours(h || 0, m || 0, 0, 0);
      return d.getTime();
    };

    return [...filtered].sort((a, b) => getTimestamp(a) - getTimestamp(b));
  }, [futureLessons, selectedCoach, selectedBranch, selectedDate]);

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
      const msg = err.message || "";
      setError(msg.includes("capacity") || msg.includes("full") ? t("lessonFull") : (msg || t("updateFailed")));
    } finally {
      setBusyId(null);
    }
  };

  const clearFilters = () => {
    setSelectedCoach("");
    setSelectedBranch("");
    setSelectedDate("");
  };

  return {
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
  };
};
