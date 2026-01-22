import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/authAtom";
import { getAuthHeaders } from "../../api/auth";
import styles from "./AdminDashboard.module.scss";

const BASE = "http://localhost:3000";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") return setError(t("adminAccessRequired"));
    fetch(`${BASE}/admin/dashboard`, { headers: getAuthHeaders() })
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message || t("loadFailed")));
  }, [user, t]);

  if (!user) return <div className={styles.loading}>{t("loginRequired")}</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return <div className={styles.loading}>{t("loading")}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("adminDashboard")}</h2>
      <div className={styles.linksContainer}>
        <Link to="/admin/users" className={styles.link}>{t("manageUsers")}</Link>
        <Link to="/admin/branches" className={styles.link}>{t("manageBranches")}</Link>
      </div>
      <div className={styles.statsCard}>
        <p className={styles.statsText}>
          <strong>{t("totalUsers")}:</strong> {data.totals?.totalUsers} | 
          <strong> {t("totalLessons")}:</strong> {data.totals?.totalLessons} | 
          <strong> {t("totalBranches")}:</strong> {data.totals?.totalBranches}
        </p>
      </div>
      <div className={styles.cardsGrid}>
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>{t("branchesOccupancy")}</h3>
          <ul className={styles.list}>
            {(data.branchesOccupancy || []).map((b: any, index: number) => (
              <li key={b._id || index}>
                <strong>{b.name}</strong>
                <div className={styles.branchInfo}>
                  <span>{t("students")}: {b.activeRegistrations}</span>
                  <span>{t("lessons")}: {b.lessonsCount || 0}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>{t("trainersOccupancy")}</h3>
          <ul className={styles.list}>
            {(data.trainersOccupancy || []).map((trainer: any) => (
              <li key={trainer.trainerId}>
                <strong>{trainer.trainerName}</strong>
                <div className={styles.trainerInfo}>
                  <span>{t("students")}: {trainer.studentsCount}</span>
                  <span>{t("lessons")}: {trainer.lessonsCount}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>{t("usersLessonCounts")}</h3>
          <ul className={styles.list}>
            {(data.usersLessons || []).slice(0, 10).map((u: any) => (
              <li key={u._id}>
                <strong>{u.name}</strong>
                <div className={styles.userInfo}>
                  <span>{u.role}</span>
                  <span>{t("lessons")}: {u.lessonsCount}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
