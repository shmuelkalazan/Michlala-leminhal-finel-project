import { useEffect, useState, useMemo } from "react";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import styles from "./headerNavbar.module.scss";
import { authUserAtom } from "../../state/authAtom";

interface HeaderNavbarProps {
  isSidebarOpen?: boolean;
  closeSidebar?: () => void;
}

const HeaderNavbar = ({ isSidebarOpen = false, closeSidebar }: HeaderNavbarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [active, setActive] = useState<string>("home");
  const user = useAtomValue(authUserAtom);

  const navItems = useMemo(() => [
    { id: "home", label: t("home"), path: "/" },
    { id: "about", label: t("about"), path: "/about" },
    { id: "lessons", label: t("lessons"), path: "/lessons" },
    ...(!user ? [{ id: "contact", label: t("login"), path: "/contact" }] : []),
    ...(!user ? [{ id: "signup", label: t("register"), path: "/signup" }] : []),
    ...(user?.role === "user" ? [{ id: "my-lessons", label: t("myLessons"), path: "/my-lessons" }] : []),
    ...(user?.role === "trainer" ? [{ id: "trainer-lessons", label: t("trainer"), path: "/trainer-lessons" }] : []),
    ...(user?.role === "admin" ? [{ id: "admin", label: t("admin"), path: "/admin" }] : []),
  ], [t, user]);

  useEffect(() => {
    const current = navItems.find((item) => item.path === location.pathname);
    if (current) setActive(current.id);
  }, [location.pathname, navItems]);

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to overlay
    if (closeSidebar) {
      closeSidebar();
    }
  };

  const handleNavClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicks inside nav from closing sidebar
  };

  return (
    <nav 
      className={`${styles.nav} ${isSidebarOpen ? styles.sidebarOpen : ""}`}
      onClick={handleNavClick}
    >
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className={`${styles.navItem} ${
            active === item.id ? styles.active : ""
          }`}
          onClick={handleLinkClick}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default HeaderNavbar;
