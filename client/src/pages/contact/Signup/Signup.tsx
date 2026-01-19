import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { signup } from "../../../api/auth";
import { authUserAtom, currentLanguageAtom } from "../../../state/authAtom";
import styles from "../Login/login.module.scss";
const Signup = () => {
  const { t, i18n } = useTranslation();
  const setUser = useSetAtom(authUserAtom);
  const setCurrentLanguage = useSetAtom(currentLanguageAtom);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await signup(form);
      setUser(user);
      if (user.preferredLanguage) {
        i18n.changeLanguage(user.preferredLanguage);
        setCurrentLanguage(user.preferredLanguage);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("signupFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1>{t("signUp")}</h1>
        <p className={styles.subtitle}>{t("createAccount")}</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input type="text" placeholder={t("name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className={styles.inputGroup}>
            <input type="email" placeholder={t("emailAddress")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className={styles.inputGroup}>
            <input type="password" placeholder={t("password")} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <p className={`${styles.subtitle} ${styles.error}`}>{error}</p>}
          <button className={styles.loginBtn} type="submit" disabled={loading}>
            {loading ? t("loading") : t("createAccountBtn")}
          </button>
        </form>
        <p className={styles.register}>
          {t("alreadyHaveAccount")} <Link to="/contact">{t("login")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
