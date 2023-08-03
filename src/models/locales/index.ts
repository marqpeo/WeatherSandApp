export type LanguageType = 'en'|'ru'|'es'|'dev'

export type LanguageResource = {
  common:{
    saveCity: string,
    deleteCity: string,
    resourceNum: string,
    minTemp: string,
    maxTemp: string,
    mps: string,
    kph: string,
  },
  sidebar:{
    citySearchPlaceholder: string,
    changeLang : string,
    en: string,
    es: string,
    ru: string,
    savedCities: string,
    noSavedCities: string,
    onlyEnglish: string
  },
  dates:{
    daysShort: string[],
    daysFull: string[],
    monthsShort: string[],
    monthsFull: string[]
  }
}