import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/authAtom";
import { createLesson, deleteLesson, fetchLessons, updateLesson } from "../../api/lessons";
import { Lesson } from "../../types/interface";
import styles from "./TrainerLessons.module.scss";

const TrainerLessons = () => {
  const { t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [form, setForm] = useState({ title: "", date: "", startTime: "", type: "" });
  const [editId, setEditId] = useState<string | null>(null); const [error, setError] = useState("");
  const getCoachId = (l: Lesson) => (typeof l.coachId === "string" ? l.coachId : (l as any).coachId?._id);
  const isPast = (l: Lesson) => {
    const d = new Date(l.date as any);
    const t = (l.startTime || l.time || "00:00").split(":"); d.setHours(Number(t[0]) || 0, Number(t[1]) || 0, 0, 0);
    return d.getTime() < Date.now();
  };

  useEffect(() => {
    if (user?.role !== "trainer") return setError(t("trainerAccessRequired"));
    fetchLessons().then((d) => setLessons(d.filter((l) => getCoachId(l) === user.id))).catch((e) => setError(e.message || t("loadFailed")));
  }, [user, t]);

  const handleSave = async () => {
    if (!user?.id || user.role !== "trainer") return setError(t("trainerAccessRequired"));
    if (!form.title || !form.date || !form.startTime) return setError(t("fillRequiredFields"));
    const payload = { ...form, coachId: user.id, coachName: user.name };
    try {
      if (editId) {
        const updated = await updateLesson(editId, payload, user || undefined);
        setLessons((p) => p.map((l) => (l._id === editId ? updated : l)));
      } else {
        const created = await createLesson(payload, user || undefined);
        setLessons((p) => [...p, created]);
      }
      setForm({ title: "", date: "", startTime: "", type: "" }); setEditId(null); setError("");
    } catch (e: any) { setError(e.message || t("saveFailed")); }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return; try { await deleteLesson(id, user || undefined); setLessons((p) => p.filter((l) => l._id !== id)); }
    catch (e: any) { setError(e.message || t("deleteFailed")); }
  };

  if (!user) return <div className={styles.loading}>{t("loginRequired")}</div>;
  const upcoming = lessons.filter((l) => !isPast(l));
  const done = lessons.filter((l) => isPast(l));
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("trainerLessons")}</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formCard}>
        <div className={styles.formContainer}>
          <input placeholder={t("title")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input placeholder={t("startTime")} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
          <input placeholder={t("type")} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <button onClick={handleSave}>{editId ? t("update") : t("create")}</button>
        </div>
      </div>
      <h3 className={styles.sectionTitle}>{t("upcoming")}</h3>
      {upcoming.length === 0 ? (
        <p className={styles.emptyState}>{t("noLessonsYet")}</p>
      ) : (
        <ul className={styles.list}>
          {upcoming.map((l) => (
            <li key={l._id} className={styles.listItem}>
              <strong>{l.title || l.name}</strong>
              <span className={styles.lessonInfo}>
                {new Date(l.date).toLocaleDateString()} {l.startTime || l.time || ""} | {t("students")}: {l.students?.length || 0}
              </span>
              <div className={styles.buttonGroup}>
                <button className={styles.button} onClick={() => { setForm({ title: l.title || l.name || "", date: (l.date as string).slice(0,10), startTime: l.startTime || l.time || "", type: l.type || "" }); setEditId(l._id || null); }}>{t("edit")}</button>
                <button className={styles.button} onClick={() => handleDelete(l._id)}>{t("delete")}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h3 className={styles.sectionTitle}>{t("completed")}</h3>
      {done.length === 0 ? (
        <p className={styles.emptyState}>{t("noLessonsYet")}</p>
      ) : (
        <ul className={styles.list}>
          {done.map((l) => (
            <li key={l._id} className={`${styles.listItem} ${styles.completed}`}>
              <strong>{l.title || l.name}</strong>
              <span className={styles.lessonInfo}>
                {new Date(l.date).toLocaleDateString()} {l.startTime || l.time || ""} | {t("students")}: {l.students?.length || 0}
              </span>
              <div className={styles.buttonGroup}>
                <button className={styles.button} onClick={() => { setForm({ title: l.title || l.name || "", date: (l.date as string).slice(0,10), startTime: l.startTime || l.time || "", type: l.type || "" }); setEditId(l._id || null); }}>{t("edit")}</button>
                <button className={styles.button} onClick={() => handleDelete(l._id)}>{t("delete")}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.chartSection}>
        <h3 className={styles.sectionTitle}>{t("classOccupancy")}</h3>
        {lessons.length === 0 ? (
          <p className={styles.emptyState}>{t("noDataYet")}</p>
        ) : (
          <div className={styles.chartContainer}>
            {lessons.map((l, idx) => (
              <div key={`${l._id}-${idx}`} className={styles.chartItem}>
                <div className={styles.bar} style={{ height: `${(l.students?.length || 0) * 12}px` }} />
                <small className={styles.chartLabel}>{l.title || l.name || t("lessons")}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; export default TrainerLessons;
