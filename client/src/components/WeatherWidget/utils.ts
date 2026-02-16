export const getWeatherApiLang = (currentLanguage: string): string => {
  const langMap: { [key: string]: string } = {
    he: "he",
    en: "en",
    es: "es",
    fr: "fr",
    ar: "ar",
  };
  return langMap[currentLanguage] || "en";
};

export const getWeatherIconUrl = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

export const convertWindSpeedToKmh = (speedInMs: number): number => {
  return Math.round(speedInMs * 3.6);
};
