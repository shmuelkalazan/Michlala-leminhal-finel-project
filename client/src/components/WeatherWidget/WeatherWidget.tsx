import { useTranslation } from "react-i18next";
import { useWeather } from "./useWeather";
import { getWeatherIconUrl, convertWindSpeedToKmh } from "./utils";
import styles from "./WeatherWidget.module.scss";

const WeatherWidget = () => {
  const { t } = useTranslation();
  const { weather, loading, error } = useWeather();

  if (loading || error || !weather) {
    return null;
  }

  const weatherIcon = weather.weather[0]?.icon;
  const iconUrl = getWeatherIconUrl(weatherIcon);
  const windSpeedKmh = convertWindSpeedToKmh(weather.wind.speed);

  return (
    <div className={styles.weatherWidget}>
      <div className={styles.weatherCard}>
        <div className={styles.weatherHeader}>
          <h3 className={styles.weatherTitle}>{t("currentWeather")}</h3>
          <span className={styles.location}>{weather.name}</span>
        </div>
        <div className={styles.weatherContent}>
          <div className={styles.temperatureSection}>
            <img src={iconUrl} alt={weather.weather[0]?.description} className={styles.weatherIcon} />
            <div className={styles.temperature}>
              <span className={styles.tempValue}>{Math.round(weather.main.temp)}</span>
              <span className={styles.tempUnit}>°C</span>
            </div>
          </div>
          <div className={styles.weatherDescription}>
            {weather.weather[0]?.description}
          </div>
          <div className={styles.weatherDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t("feelsLike")}:</span>
              <span className={styles.detailValue}>{Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t("humidity")}:</span>
              <span className={styles.detailValue}>{weather.main.humidity}%</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t("windSpeed")}:</span>
              <span className={styles.detailValue}>{windSpeedKmh} {t("kmh")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
