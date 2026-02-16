import { useState } from "react";
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import styles from "./headerPage.module.scss";
import SelectLanguage from "../selectLanguage/selectLanguage";
import HeaderNavbar from "../headerNavbar/HeaderNavbar";
import LogoutButton from "../logoutButton/LogoutButton";
import { authUserAtom } from "../../state/authAtom";

const HeaderPage = () => {
  const { t } = useTranslation();
  const user = useAtomValue(authUserAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "admin":
        return t("adminRole");
      case "trainer":
        return t("trainerRole");
      case "user":
        return t("userRole");
      default:
        return "";
    }
  };

  return (
    <>
      <header className={styles.headerPageContainer}>
        <div className={styles.leftSection}>
          <button 
            className={styles.hamburgerButton}
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <Link to="/" className={styles.logoLink}>
            <img 
              src="/img/image-logo-fighters.png" 
              alt="Fighters Logo" 
              className={styles.logo}
            />
          </Link>
          <SelectLanguage />
        </div>
        <HeaderNavbar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        <div className={styles.rightSection}>
          {user && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{getRoleLabel(user.role)}</span>
            </div>
          )}
          <LogoutButton />
        </div>
      </header>
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}
    </>
  );
};

export default HeaderPage;

