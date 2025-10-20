import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: 'en' | 'fr' | 'he' | 'es' |'ar') => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{t('welcome')}</h1>
      <p>{t('about')}</p>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('he')}>עברית</button>
        <button onClick={() => changeLanguage('fr')}>Français</button>
        <button onClick={() => changeLanguage('es')}>Español</button>
        <button onClick={() => changeLanguage('ar')}>العربية</button>
      </div>
    </div>
  );
}

export default App;
