import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { authUserAtom } from "../../state/authAtom";
import styles from "./logoutButton.module.scss";

const LogoutButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAtomValue(authUserAtom);
  const setUser = useSetAtom(authUserAtom);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
      {t("logout")}
    </button>
  );
};

export default LogoutButton;
