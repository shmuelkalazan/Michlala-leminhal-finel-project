import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSetAtom } from "jotai";
import { signup } from "../../../api/auth";
import { authUserAtom } from "../../../state/authAtom";
import styles from "../Login/login.module.scss";
const Signup = () => {
  const setUser = useSetAtom(authUserAtom);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await signup(form);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1>Sign up</h1>
        <p className={styles.subtitle}>Create your account</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className={styles.inputGroup}>
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <p className={styles.subtitle} style={{ color: "#f56565" }}>{error}</p>}
          <button className={styles.loginBtn} type="submit" disabled={loading}>
            {loading ? "Loading..." : "Create account"}
          </button>
        </form>
        <p className={styles.register}>
          Already have an account? <Link to="/contact">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
