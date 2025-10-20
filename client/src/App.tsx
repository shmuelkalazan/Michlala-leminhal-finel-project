import { useTranslation } from 'react-i18next';
import I18n from './common/I18n';

function App() {
  const { t } = useTranslation();


  return (
    <div>
      {t('welcome')}
      {/* <I18n /> */}


    </div>
  );
}

export default App;
