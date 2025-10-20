import { useTranslation } from 'react-i18next';
import SelectLanguage from './components/selectLanguage/selectLanguage';
import styles from "./App.module.scss";

const App = () => {
  const { t } = useTranslation();


  return (
    <div className={styles.app}>
      {t('welcome')}
      {/* <img src="../../i" alt="" />
      <I18n /> */}
      <SelectLanguage />

    </div>
  );
}

export default App;
