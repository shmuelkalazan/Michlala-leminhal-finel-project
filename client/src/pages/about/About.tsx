import React from "react";
import { useTranslation } from "react-i18next";
import Map from "../../components/Map/Map";
import { wrapEnglishText } from "../../utils/textDirection";
import styles from "./about.module.scss";

const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        <h1>{wrapEnglishText(t("aboutOurGym"))}</h1>

        <p className={styles.intro}>
          {wrapEnglishText(t("aboutIntro"))}
        </p>

        <div className={styles.sections}>
          <div className={styles.card}>
            <h2>{t("ourMission")}</h2>
            <p>
              {t("missionText")}
            </p>
          </div>

          <div className={styles.card}>
            <h2>{t("professionalTraining")}</h2>
            <p>
              {t("trainingText")}
            </p>
          </div>

          <div className={styles.card}>
            <h2>{t("modernEquipment")}</h2>
            <p>
              {wrapEnglishText(t("equipmentText"))}
            </p>
          </div>

          <div className={styles.card}>
            <h2>{t("cleanSafe")}</h2>
            <p>
              {t("cleanSafeText")}
            </p>
          </div>
        </div>

        <div className={styles.mapSection}>
          <Map />
        </div>
      </div>
    </div>
  );
};

export default About;
