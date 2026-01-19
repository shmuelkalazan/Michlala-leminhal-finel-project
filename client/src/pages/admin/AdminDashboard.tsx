import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/authAtom";
import styles from "./AdminDashboard.module.scss";

const BASE = "http://localhost:3000";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") return setError(t("adminAccessRequired"));
    fetch(`${BASE}/admin/dashboard`, { headers: { "x-role": "admin", "x-user-id": user.id || "" } })
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
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>{t("branchesOccupancy")}</h3>
        <ul className={styles.list}>
          {(data.branchesOccupancy || []).map((b: any) => (
            <li key={b._id}>{b.name}: {b.activeRegistrations}</li>
          ))}
        </ul>
      </div>
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>{t("trainersOccupancy")}</h3>
        <ul className={styles.list}>
          {(data.trainersOccupancy || []).map((trainer: any) => (
            <li key={trainer.trainerId}>{trainer.trainerName}: {t("students")} {trainer.studentsCount} / {t("lessons")} {trainer.lessonsCount}</li>
          ))}
        </ul>
      </div>
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>{t("usersLessonCounts")}</h3>
        <ul className={styles.list}>
          {(data.usersLessons || []).slice(0, 10).map((u: any) => (
            <li key={u._id}>{u.name} ({u.role}): {u.lessonsCount}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
