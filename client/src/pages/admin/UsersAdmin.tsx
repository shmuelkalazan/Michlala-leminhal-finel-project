import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/authAtom";
import { getAuthHeaders } from "../../api/auth";
import styles from "./UsersAdmin.module.scss";

const BASE = "http://localhost:3000";

const UsersAdmin = () => {
  const { t } = useTranslation();
  const admin = useAtomValue(authUserAtom);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () =>
    fetch(`${BASE}/users`, { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then(setUsers)
      .catch((e) => setError(e.message || t("loadFailed")));

  useEffect(() => {
    if (admin?.role !== "admin") return setError(t("adminAccessRequired"));
    load();
  }, [admin, t]);

  const save = async () => {
    try {
      if (editId) {
        const payload: any = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;
        await fetch(`${BASE}/users/${editId}`, { method: "PUT", headers: getAuthHeaders(), body: JSON.stringify(payload) }).then((r) => r.json());
      } else {
        await fetch(`${BASE}/users`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(form) }).then((r) => r.json());
      }
      setForm({ name: "", email: "", password: "" }); setEditId(null); load();
    } catch (e: any) { setError(e.message || t("saveFailed")); }
  };

  const remove = async (id: string) => {
    if (!confirm(t("deleteUser"))) return;
    await fetch(`${BASE}/users/${id}`, { method: "DELETE", headers: getAuthHeaders() }).then((r) => r.json());
    load();
  };

  const changeRole = async (id: string, role: string) => {
    await fetch(`${BASE}/users/${id}/role`, { method: "PUT", headers: getAuthHeaders(), body: JSON.stringify({ role }) }).then((r) => r.json());
    load();
  };

  if (!admin) return <div className={styles.loading}>{t("loginRequired")}</div>;
  return (
    <div className={styles.container}>
      <div className={styles.backLink}>
        <Link to="/admin" className={styles.link}>{t("backToDashboard")}</Link>
      </div>
      <h2 className={styles.title}>{t("users")}</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formCard}>
        <div className={styles.formContainer}>
          <input placeholder={t("name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder={t("emailAddress")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder={t("password")} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button onClick={save}>{editId ? t("update") : t("create")}</button>
          {editId && <button onClick={() => { setForm({ name: "", email: "", password: "" }); setEditId(null); }}>{t("cancel")}</button>}
        </div>
      </div>
      <ul className={styles.list}>
        {users.map((u) => (
          <li key={u._id} className={styles.listItem}>
            <strong>{u.name}</strong>
            <span className={styles.userInfo}>{u.email} ({u.role})</span>
            <div className={styles.buttonGroup}>
              <button className={styles.button} onClick={() => { setForm({ name: u.name, email: u.email, password: "" }); setEditId(u._id); }}>{t("edit")}</button>
              <button className={styles.button} onClick={() => remove(u._id)}>{t("delete")}</button>
              <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)} className={styles.select}>
                <option value="user">{t("userRole")}</option>
                <option value="trainer">{t("trainerRole")}</option>
                <option value="admin">{t("adminRole")}</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersAdmin;
