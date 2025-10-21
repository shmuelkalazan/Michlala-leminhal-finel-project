// import { useTranslation } from 'react-i18next';
import I18n from '../I18n/I18n';
import { useState } from 'react';
import styles from "./selectLanguage.module.scss";


const selectLanguage = () => {
    // const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className={styles.languageSelector}>
            <img
                height={20}
                width={20}
                src="/img/languageIcon.jpg"
                alt="Language icon"
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && <I18n />}
        </div>
    );
}

export default selectLanguage;
