import { useTranslation } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { authUserAtom, currentLanguageAtom } from '../../state/authAtom';
import styles from './I18n.module.scss';

const BASE = "http://localhost:3000";

const I18n = () => {
  const { i18n, t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const setUser = useSetAtom(authUserAtom);
  const setCurrentLanguage = useSetAtom(currentLanguageAtom);

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    if (user?.id) {
      try {
        await fetch(`${BASE}/users/${user.id}/language`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: lng }),
        });
        if (user) {
          setUser({ ...user, preferredLanguage: lng });
        }
      } catch (e) {
      }
    }
  };

  return (
    <div>
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className={styles.select}
      >
        <option value="en">{t("languageEnglish")}</option>
        <option value="he">{t("languageHebrew")}</option>
        <option value="fr">{t("languageFrench")}</option>
        <option value="es">{t("languageSpanish")}</option>
        <option value="ar">{t("languageArabic")}</option>
      </select>
    </div>
  );
};

export default I18n;
