import I18n from '../I18n/I18n';
import { useState } from 'react';
import styles from "./selectLanguage.module.scss";
import ClickAwayListener from '../ClickAwayListener/ClickAwayListener';


const selectLanguage = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.languageSelector}>
            <img
                className={styles.languageIcon}
                height={20}
                width={20}
                src="img\languageIcon-removebg-preview.png"
                alt="Language icon"
                onClick={() => setIsOpen(!isOpen)}
            />
            <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <div></div>
                {isOpen && <I18n />}
            </ClickAwayListener>
        </div>
    );
}

export default selectLanguage;
