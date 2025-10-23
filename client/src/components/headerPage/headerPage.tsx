import styles from "./headerPage.module.scss";
import SelectLanguage from "../selectLanguage/selectLanguage";
import HeaderNavbar from "../headerNavbar/HeaderNavbar";

const HeaderPage = () => {
  return (
    <header className={styles.headerPageContainer}>
      <SelectLanguage />
      <HeaderNavbar />
    </header>
  );
};

export default HeaderPage;

