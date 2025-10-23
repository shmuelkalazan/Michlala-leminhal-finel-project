import { useTranslation } from "react-i18next";
import styles from './home.module.scss'
const Home = () => {
      const { t } = useTranslation();
    return (
    <>
      <h1 className={styles.welcomeText}>{t("welcome")}</h1>

    </>
)};
export default Home;
