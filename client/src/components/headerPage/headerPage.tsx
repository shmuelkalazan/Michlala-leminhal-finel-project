import { useState } from "react";
import styles from "./headerPage.module.scss";
import SelectLanguage from "../selectLanguage/selectLanguage";
import HeaderNavbar from "../headerNavbar/HeaderNavbar";
import LogoutButton from "../logoutButton/LogoutButton";

const HeaderPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
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
          <SelectLanguage />
        </div>
        <HeaderNavbar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        <div className={styles.rightSection}>
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

