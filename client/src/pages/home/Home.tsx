import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./home.module.scss";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <h1>{t("welcomeToGym")}</h1>

        <p className={styles.intro}>
          {t("joinIntro")}
        </p>

        <div className={styles.heroCard}>
          <h2>{t("readyToStart")}</h2>
          <p>
            {t("signupToday")}
          </p>
          <button className={styles.ctaBtn} onClick={() => navigate("/signup")}>{t("joinNow")}</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
