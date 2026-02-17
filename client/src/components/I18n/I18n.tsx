import { useTranslation } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { authUserAtom, currentLanguageAtom } from '../../state/authAtom';
import { getAuthHeaders } from '../../api/auth';
import { API_URL } from '../../api/config';
import styles from './I18n.module.scss';

interface I18nProps {
  onSelect?: () => void;
}

const I18n = ({ onSelect }: I18nProps) => {
  const { i18n, t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const setUser = useSetAtom(authUserAtom);
  const setCurrentLanguage = useSetAtom(currentLanguageAtom);

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    if (user?.id) {
      try {
        await fetch(`${API_URL}/users/${user.id}/language`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ language: lng }),
        });
        if (user) {
          setUser({ ...user, preferredLanguage: lng });
        }
      } catch (e) {
      }
    }
    onSelect?.();
  };

  const languages = [
    { value: "en", labelKey: "languageEnglish" },
    { value: "he", labelKey: "languageHebrew" },
    { value: "fr", labelKey: "languageFrench" },
    { value: "es", labelKey: "languageSpanish" },
    { value: "ar", labelKey: "languageArabic" },
  ] as const;

  return (
    <div className={styles.dropdown}>
      {languages.map(({ value, labelKey }) => (
        <button
          key={value}
          type="button"
          className={`${styles.option} ${i18n.language === value ? styles.optionActive : ""}`}
          onClick={() => changeLanguage(value)}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
};

export default I18n;
