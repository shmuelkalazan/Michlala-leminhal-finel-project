import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import styles from "./headerNavbar.module.scss";

const HeaderNavbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [active, setActive] = useState<string>("home");

  const navItems = [
    { id: "home", label: t("home"), path: "/" },
    { id: "about", label: t("about"), path: "/about" },
    { id: "lessons", label: t("lessons"), path: "/lessons" },
    { id: "contact", label: t("login"), path: "/contact" },
    { id: "signup", label: t("register"), path: "/signup" },
  ];

  useEffect(() => {
    const current = navItems.find((item) => item.path === location.pathname);
    if (current) setActive(current.id);
  }, [location.pathname]);

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className={`${styles.navItem} ${
            active === item.id ? styles.active : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default HeaderNavbar;
