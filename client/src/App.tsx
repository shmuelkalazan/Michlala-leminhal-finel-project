import styles from "./App.module.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderPage from "./components/headerPage/HeaderPage";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Services from "./pages/servisces/Services";
import Contact from "./pages/contact/Contact";
const App = () => {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <HeaderPage />
        <main style={{ textAlign: "center", marginTop: "2rem", color: "#fff" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
};

export default App;
