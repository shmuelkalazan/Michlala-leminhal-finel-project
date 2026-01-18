import styles from "./App.module.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderPage from "./components/headerPage/headerPage";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Lessons from "./pages/lessons/Lessons";
const App = () => {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <HeaderPage />
        <main style={{ textAlign: "center", marginTop: "2rem", color: "#fff" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
};

export default App;
