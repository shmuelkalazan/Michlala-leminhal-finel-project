import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/authAtom";
import { cancelLesson, fetchUserWithLessons } from "../../api/lessons";
import { Lesson } from "../../types/interface";
import { useLessonsData } from "./hooks/useLessonsData";
import LessonsSection from "./components/LessonsSection/LessonsSection";
import ProgressChart from "./components/ProgressChart/ProgressChart";
import styles from "./MyLessons.module.scss";

const MyLessons = () => {
  const { t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const { pastLessons, futureLessons } = useLessonsData(lessons);

  const load = () => {
    if (!user?.id) {
      setError(t("loginRequired"));
      return Promise.resolve();
    }
    setLoading(true);
    setError("");
    return fetchUserWithLessons(user)
      .then((data: any) => setLessons(data.lessons || []))
      .catch((err: any) => setError(err.message || t("loadFailed")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, t]);

  const handleCancel = async (lessonId?: string) => {
    if (!lessonId) return;
    try {
      setCancelingId(lessonId);
      await cancelLesson(lessonId);
      // Optimistic update + refresh to ensure server truth
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      await load();
    } catch (err: any) {
      setError(err?.message || t("updateFailed"));
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) return <div className={styles.loading}>{t("loading")}</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("myLessons")}</h2>
      {lessons.length === 0 ? (
        <p className={styles.emptyState}>{t("noLessonsYet")}</p>
      ) : (
        <>
          <LessonsSection
            title={t("upcomingLessons") || "שיעורים קרובים"}
            lessons={futureLessons}
            isPast={false}
            onCancel={handleCancel}
            cancelingId={cancelingId}
          />
          <LessonsSection
            title={t("pastLessons") || "שיעורים שבוצעו"}
            lessons={pastLessons}
            isPast={true}
          />
        </>
      )}
      <ProgressChart lessons={lessons} />
    </div>
  );
};

export default MyLessons;
