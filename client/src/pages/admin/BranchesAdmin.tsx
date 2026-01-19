import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/authAtom";
import styles from "./BranchesAdmin.module.scss";

const BASE = "http://localhost:3000";

const BranchesAdmin = () => {
  const { t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const [branches, setBranches] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const headers = { "Content-Type": "application/json", "x-role": "admin", "x-user-id": user?.id || "" };

  const load = () =>
    fetch(`${BASE}/branches`, { headers })
      .then((r) => r.json())
      .then(setBranches)
      .catch((e) => setError(e.message || t("loadFailed")));

  useEffect(() => {
    if (user?.role !== "admin") return setError(t("adminAccessRequired"));
    load();
  }, [user, t]);

  const save = async () => {
    try {
      const url = editId ? `${BASE}/branches/${editId}` : `${BASE}/branches`;
      const method = editId ? "PUT" : "POST";
      await fetch(url, { method, headers, body: JSON.stringify(form) }).then((r) => r.json());
      setForm({ name: "", address: "", phone: "" }); setEditId(null); load();
    } catch (e: any) { setError(e.message || t("saveFailed")); }
  };

  const remove = async (id: string) => {
    await fetch(`${BASE}/branches/${id}`, { method: "DELETE", headers }).then((r) => r.json());
    load();
  };

  if (!user) return <div className={styles.loading}>{t("loginRequired")}</div>;
  return (
    <div className={styles.container}>
      <div className={styles.backLink}>
        <Link to="/admin" className={styles.link}>{t("backToDashboard")}</Link>
      </div>
      <h2 className={styles.title}>{t("branches")}</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formCard}>
        <div className={styles.formContainer}>
          <input placeholder={t("name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder={t("address")} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input placeholder={t("phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button onClick={save}>{editId ? t("update") : t("create")}</button>
        </div>
      </div>
      <ul className={styles.list}>
        {branches.map((b) => (
          <li key={b._id} className={styles.listItem}>
            <strong>{b.name}</strong>
            <span className={styles.branchInfo}>{b.address} ({b.phone})</span>
            <div className={styles.buttonGroup}>
              <button className={styles.button} onClick={() => { setForm({ name: b.name, address: b.address, phone: b.phone }); setEditId(b._id); }}>{t("edit")}</button>
              <button className={styles.button} onClick={() => remove(b._id)}>{t("delete")}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BranchesAdmin;
