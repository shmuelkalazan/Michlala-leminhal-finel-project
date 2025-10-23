import styles from "./App.module.scss";
import HeaderPage from './components/headerPage/headerPage';

const App = () => {

  return (
    <div className={styles.app}>
      <HeaderPage />
    </div>
  );
}

export default App;
