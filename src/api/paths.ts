export const getCityByName = (name: string) => `api/geocoding?name=${name}`;

export const getCityForecast = (latitude: number, longitude: number) =>
  `api/get-weather-daily?lat=${latitude}&lon=${longitude}`;
