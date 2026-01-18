import React from "react";
import styles from "./about.module.scss";

const About: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        <h1>About Our Gym</h1>

        <p className={styles.intro}>
          We are a modern fitness center dedicated to helping people achieve
          their health and fitness goals in a supportive and professional
          environment.
        </p>

        <div className={styles.sections}>
          <div className={styles.card}>
            <h2>Our Mission</h2>
            <p>
              Our mission is to provide a safe, motivating, and accessible
              training space for everyone — from beginners to advanced athletes.
            </p>
          </div>

          <div className={styles.card}>
            <h2>Professional Training</h2>
            <p>
              We offer a wide range of training programs designed to improve
              strength, endurance, flexibility, and overall wellness.
            </p>
          </div>

          <div className={styles.card}>
            <h2>Modern Equipment</h2>
            <p>
              Our gym is equipped with state-of-the-art machines and training
              tools to ensure effective and enjoyable workouts.
            </p>
          </div>

          <div className={styles.card}>
            <h2>Clean & Safe Environment</h2>
            <p>
              Cleanliness and safety are our top priorities, ensuring a
              comfortable experience for all members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
