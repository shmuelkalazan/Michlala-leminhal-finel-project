import { useState, useEffect } from "react";
import styles from "./TimeSelector.module.scss";

interface TimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

const TimeSelector = ({ value, onChange, placeholder = "HH:MM" }: TimeSelectorProps) => {
  const [useCustom, setUseCustom] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, "0");
    return `${hour}:00`;
  });

  const isRoundHour = value && hours.includes(value);

  useEffect(() => {
    if (value && !isRoundHour) {
      setUseCustom(true);
    }
  }, [value, isRoundHour]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "custom") {
      setUseCustom(true);
    } else {
      setUseCustom(false);
      onChange(e.target.value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputFocus = () => {
    setUseCustom(true);
  };

  if (useCustom || (value && !isRoundHour)) {
    return (
      <div className={styles.timeSelector}>
        <input
          type="time"
          className={styles.input}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className={styles.timeSelector}>
      <select
        className={styles.select}
        value={value || ""}
        onChange={handleSelectChange}
      >
        <option value="">{placeholder}</option>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
        <option value="custom">--- {placeholder} ---</option>
      </select>
    </div>
  );
};

export default TimeSelector;
