import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/authAtom";
import { getAuthHeaders } from "../../api/auth";
import { API_URL } from "../../api/config";
import styles from "./BranchesAdmin.module.scss";

const BranchesAdmin = () => {
  const { t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const [branches, setBranches] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", address: "", phone: "", location: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () =>
    fetch(`${API_URL}/branches`, { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then(setBranches)
      .catch((e) => setError(e.message || t("loadFailed")));

  useEffect(() => {
    if (user?.role !== "admin") return setError(t("adminAccessRequired"));
    load();
  }, [user, t]);

  const save = async () => {
    try {
      // Parse location from "lat,lon" format to latitude and longitude
      let latitude: number | undefined;
      let longitude: number | undefined;
      
      if (form.location && form.location.trim()) {
        const parts = form.location.split(',').map(s => s.trim());
        if (parts.length === 2) {
          const lat = parseFloat(parts[0]);
          const lon = parseFloat(parts[1]);
          if (!isNaN(lat) && !isNaN(lon)) {
            latitude = lat;
            longitude = lon;
          }
        }
      }
      
      const payload = {
        name: form.name,
        address: form.address,
        phone: form.phone,
        ...(latitude !== undefined && longitude !== undefined ? { latitude, longitude } : {}),
      };
      
      const url = editId ? `${API_URL}/branches/${editId}` : `${API_URL}/branches`;
      const method = editId ? "PUT" : "POST";
      await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) }).then((r) => r.json());
      setForm({ name: "", address: "", phone: "", location: "" });
      setEditId(null);
      load();
    } catch (e: any) {
      setError(e.message || t("saveFailed"));
    }
  };

  const remove = async (id: string) => {
    await fetch(`${API_URL}/branches/${id}`, { method: "DELETE", headers: getAuthHeaders() }).then((r) => r.json());
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
          <input
            placeholder={t("location") ? `${t("location")} (31.7683,35.2137)` : "מיקום (קו רוחב, קו אורך) - לדוגמה: 31.7683,35.2137"}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <button onClick={save}>{editId ? t("update") : t("create")}</button>
        </div>
      </div>
      <ul className={styles.list}>
        {branches.map((b) => (
          <li key={b._id} className={styles.listItem}>
            <strong>{b.name}</strong>
            <span className={styles.branchInfo}>{b.address} ({b.phone})</span>
            <div className={styles.buttonGroup}>
              <button className={styles.button} onClick={() => { 
                const location = b.latitude !== undefined && b.longitude !== undefined 
                  ? `${b.latitude},${b.longitude}` 
                  : "";
                setForm({ 
                  name: b.name, 
                  address: b.address, 
                  phone: b.phone,
                  location: location
                }); 
                setEditId(b._id); 
              }}>{t("edit")}</button>
              <button className={styles.button} onClick={() => remove(b._id)}>{t("delete")}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BranchesAdmin;
