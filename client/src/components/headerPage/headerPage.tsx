import styles from "./headerPage.module.scss";
import SelectLanguage from "../selectLanguage/selectLanguage";
import HeaderNavbar from "../headerNavbar/HeaderNavbar";
import LogoutButton from "../logoutButton/LogoutButton";

const HeaderPage = () => {
  return (
    <header className={styles.headerPageContainer}>
      <div className={styles.leftSection}>
        <SelectLanguage />
      </div>
      <HeaderNavbar />
      <div className={styles.rightSection}>
        <LogoutButton />
      </div>
    </header>
  );
};

export default HeaderPage;

