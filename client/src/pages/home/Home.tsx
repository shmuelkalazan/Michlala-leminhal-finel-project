import React from "react";
import styles from "./home.module.scss";

const Home: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <h1>Welcome to Our Gym</h1>

        <p className={styles.intro}>
          Join our modern fitness center and start your journey to a healthier,
          stronger, and happier you. We support every level — from beginners to
          advanced athletes.
        </p>

        <div className={styles.heroCard}>
          <h2>Ready to start?</h2>
          <p>
            Sign up today and get your first week free. Experience our premium
            equipment, professional trainers, and supportive community.
          </p>
          <button className={styles.ctaBtn}>Join Now</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
