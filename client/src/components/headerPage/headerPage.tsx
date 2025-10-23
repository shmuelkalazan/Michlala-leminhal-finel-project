import { useTranslation } from 'react-i18next';
import styles from "./headerPage.module.scss";
import SelectLanguage from '../selectLanguage/selectLanguage';

const headerPage = () => {
  const { t } = useTranslation();


  return (
    <div className={styles.headerPageContainer}>
      <SelectLanguage />
      {t('welcome')}
    </div>
  );
}

export default headerPage;
