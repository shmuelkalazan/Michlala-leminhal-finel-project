import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Lesson } from "../../../../types/interface";
import styles from "./ProgressChart.module.scss";

interface ProgressChartProps {
  lessons: Lesson[];
}

const ProgressChart = ({ lessons }: ProgressChartProps) => {
  const { t } = useTranslation();

  const progress = useMemo(() => {
    const buckets = new Map<string, number>();
    lessons.forEach((l) => {
      if (!l.date) return;
      const d = new Date(l.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, (buckets.get(key) || 0) + 1);
    });
    return Array.from(buckets.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([label, count]) => ({ label, count }));
  }, [lessons]);

  return (
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
  );
};

export default ProgressChart;
