import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/authAtom";
import { fetchUserWithLessons } from "../../api/lessons";
import { Lesson } from "../../types/interface";
import styles from "./MyLessons.module.scss";

const MyLessons = () => {
  const { t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) { setError(t("loginRequired")); return; }
    setLoading(true);
    fetchUserWithLessons(user)
      .then((data) => setLessons(data.lessons || []))
      .catch((err: any) => setError(err.message || t("loadFailed")))
      .finally(() => setLoading(false));
  }, [user, t]);

  const progress = useMemo(() => {
    const buckets = new Map<string, number>();
    lessons.forEach((l) => {
      const d = new Date(l.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, (buckets.get(key) || 0) + 1);
    });
    return Array.from(buckets.entries()).sort(([a], [b]) => (a > b ? 1 : -1)).map(([label, count]) => ({ label, count }));
  }, [lessons]);

  if (loading) return <div className={styles.loading}>{t("loading")}</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("myLessons")}</h2>
      {lessons.length === 0 ? (
        <p className={styles.emptyState}>{t("noLessonsYet")}</p>
      ) : (
        <div className={styles.lessonsCard}>
          <ul className={styles.list}>
            {lessons.map((l) => (
              <li key={l._id} className={styles.listItem}>
                {l.title || l.name} – {new Date(l.date).toLocaleDateString()} {l.startTime || l.time || ""}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.progressCard}>
        <h3 className={styles.progressTitle}>{t("progressOverTime")}</h3>
        {progress.length === 0 ? (
          <p className={styles.emptyState}>{t("noDataYet")}</p>
        ) : (
          <div className={styles.chartContainer}>
            {progress.map((p) => (
              <div key={p.label} className={styles.chartItem}>
                <div className={styles.bar} style={{ height: `${p.count * 16}px` }} />
                <small>{p.label}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLessons;
