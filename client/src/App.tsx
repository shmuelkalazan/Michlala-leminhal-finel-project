import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import styles from "./App.module.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderPage from "./components/headerPage/headerPage";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Lessons from "./pages/lessons/Lessons";
import Signup from "./pages/contact/Signup/Signup";
import MyLessons from "./pages/profile/MyLessons";
import TrainerLessons from "./pages/trainer/TrainerLessons";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BranchesAdmin from "./pages/admin/BranchesAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import { authUserAtom, currentLanguageAtom } from "./state/authAtom";
import { getCurrentUser, getAuthToken } from "./api/auth";

const App = () => {
  const user = useAtomValue(authUserAtom);
  const setUser = useSetAtom(authUserAtom);
  const setCurrentLanguage = useSetAtom(currentLanguageAtom);
  const { i18n } = useTranslation();

  // טעינת משתמש אם יש token
  useEffect(() => {
    const token = getAuthToken();
    if (token && !user) {
      getCurrentUser()
        .then((userData) => {
          if (userData && userData.id) {
            setUser(userData);
            if (userData.preferredLanguage) {
              i18n.changeLanguage(userData.preferredLanguage);
              setCurrentLanguage(userData.preferredLanguage);
            }
          } else {
            // אם הנתונים לא תקינים, מוחקים את ה-token
            localStorage.removeItem('authToken');
          }
        })
        .catch((error) => {
          console.error("Error loading user:", error);
          // אם token לא תקין, מוחקים אותו
          localStorage.removeItem('authToken');
        });
    }
  }, [user, setUser, i18n, setCurrentLanguage]);

  useEffect(() => {
    if (user?.preferredLanguage) {
      i18n.changeLanguage(user.preferredLanguage);
      setCurrentLanguage(user.preferredLanguage);
    }
  }, [user, i18n, setCurrentLanguage]);

  return (
    <div className={styles.app}>
      <BrowserRouter>
        <HeaderPage />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/my-lessons" element={<MyLessons />} />
            <Route path="/trainer-lessons" element={<TrainerLessons />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/branches" element={<BranchesAdmin />} />
            <Route path="/admin/users" element={<UsersAdmin />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
};

export default App;
