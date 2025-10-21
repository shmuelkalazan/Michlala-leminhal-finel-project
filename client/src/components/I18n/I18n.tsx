import { useTranslation } from 'react-i18next';

const I18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{t('welcome')}</h1>
      <p>{t('about')}</p>

      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{ padding: '5px', fontSize: '16px' }}
      >
        <option value="en">English</option>
        <option value="he">עברית</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
};

export default I18n;
