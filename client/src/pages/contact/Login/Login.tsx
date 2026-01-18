import React from "react";
import styles from "./login.module.scss";

const Login: React.FC = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1>Login</h1>
        <p className={styles.subtitle}>
          Welcome back! Please login to your account
        </p>

        <form>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Email address" />
          </div>

          <div className={styles.inputGroup}>
            <input type="password" placeholder="Password" />
          </div>

          <button className={styles.loginBtn} type="submit">
            Login
          </button>
        </form>

        <p className={styles.register}>
          Don’t have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
