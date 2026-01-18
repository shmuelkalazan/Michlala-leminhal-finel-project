import React, { useEffect, useState } from "react";
import styles from "./lessons.module.scss";
import {Student, Lesson } from "../../types/interface";

const Lessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:3000/lessons";

  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch lessons");
        const data = await res.json();
        setLessons(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, []);

  if (loading) return <div className={styles.lessonsLoading}>Loading lessons...</div>;
  if (error) return <div className={styles.lessonsError}>{error}</div>;

  return (
    <div className={styles.lessonsContainer}>
      {lessons.map((lesson) => (
        <div key={lesson._id} className={styles.lessonCard}>
          <div className={styles.lessonHeader}>
            <h2 className={styles.lessonTitle}>{lesson.name}</h2>
            <span className={styles.lessonType}>{lesson.type}</span>
          </div>

          <div className={styles.lessonInfo}>
            <p>
              <strong>Coach:</strong> {lesson.coachName}
            </p>
            <p>
              <strong>Date:</strong> {new Date(lesson.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {lesson.time}
            </p>
          </div>

          <div className={styles.lessonStudents}>
            <strong>Students:</strong>
            {lesson.students && lesson.students.length > 0 ? (
              <ul>
                {lesson.students.map((s:Student) => (
                  <li key={s._id}>
                    {s.name} – {s.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noStudents}>No students enrolled</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Lessons;
