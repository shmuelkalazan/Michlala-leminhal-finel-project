import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WeatherData } from "./types";
import { getWeatherApiLang } from "./utils";

export const useWeather = () => {
  const { t, i18n } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    
    if (!apiKey) {
      setError(t("weatherApiKeyNotSet"));
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError(t("browserNotSupportLocation"));
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const apiLang = getWeatherApiLang(i18n.language);
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${apiLang}&appid=${apiKey}`;
          const response = await fetch(url);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 401) {
              if (errorData.message?.includes("Invalid API key") || errorData.message?.includes("Invalid API")) {
                setError(t("weatherApiKeyInvalid") + ". " + t("weatherApiKeyCheckHint"));
              } else {
                setError(t("weatherApiKeyInvalid"));
              }
            } else if (response.status === 429) {
              setError(t("weatherApiRateLimit"));
            } else {
              setError(`${t("weatherLoadError")} (${response.status}: ${errorData.message || response.statusText})`);
            }
            setLoading(false);
            return;
          }

          const data: WeatherData = await response.json();
          setWeather(data);
          setError(null);
        } catch (err: any) {
          if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
            setError(t("weatherNetworkError"));
          } else {
            setError(`${t("weatherLoadError")}: ${err.message || err}`);
          }
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(t("locationAccessDenied"));
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (weather) {
      setLoading(true);
      fetchWeatherData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, t]);

  return { weather, loading, error };
};
