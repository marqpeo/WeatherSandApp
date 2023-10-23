export type LanguageType = 'en'|'es';

export type LanguageResource = {
  common:{
    deleteCity: string,
    kph: string,
    maxTemp: string,
    minTemp: string,
    mps: string,
    resourceNum: string,
    saveCity: string,
  },
  sidebar:{
    changeLang : string,
    citySearchPlaceholder: string,
    en: string,
    es: string,
    noSavedCities: string,
    onlyEnglish: string
    ru: string,
    savedCities: string,
  },
  mainPage:{
    welcomeHeader:string;
  }
  dates:{
    daysFull: string[],
    daysShort: string[],
    monthsFull: string[]
    monthsShort: string[],
  }
}