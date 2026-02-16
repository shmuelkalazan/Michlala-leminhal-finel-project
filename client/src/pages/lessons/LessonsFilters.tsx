import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./lessons.module.scss";

interface LessonsFiltersProps {
  selectedCoach: string;
  selectedBranch: string;
  selectedDate: string;
  uniqueCoaches: string[];
  uniqueBranches: string[];
  onCoachChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onClearFilters: () => void;
}

const LessonsFilters: React.FC<LessonsFiltersProps> = ({
  selectedCoach,
  selectedBranch,
  selectedDate,
  uniqueCoaches,
  uniqueBranches,
  onCoachChange,
  onBranchChange,
  onDateChange,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const hasActiveFilters = selectedCoach || selectedBranch || selectedDate;

  return (
    <div className={styles.filtersContainer}>
      <h2 className={styles.filtersTitle}>{t("filterLessons") || "סינון שיעורים"}</h2>
      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label htmlFor="coach-filter" className={styles.filterLabel}>
            {t("coach")}:
          </label>
          <select
            id="coach-filter"
            className={styles.filterSelect}
            value={selectedCoach}
            onChange={(e) => onCoachChange(e.target.value)}
          >
            <option value="">{t("allCoaches") || "כל המאמנים"}</option>
            {uniqueCoaches.map((coach) => (
              <option key={coach} value={coach}>
                {coach}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="branch-filter" className={styles.filterLabel}>
            {t("location") || "מיקום"}:
          </label>
          <select
            id="branch-filter"
            className={styles.filterSelect}
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
          >
            <option value="">{t("allLocations") || "כל המיקומים"}</option>
            {uniqueBranches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="date-filter" className={styles.filterLabel}>
            {t("date")}:
          </label>
          <input
            id="date-filter"
            type="date"
            className={styles.filterInput}
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button className={styles.clearFiltersBtn} onClick={onClearFilters}>
            {t("clearFilters") || "נקה סינונים"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonsFilters;
