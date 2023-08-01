export type LanguageType = 'en'|'ru'|'es'|'dev'

export interface ILanguageResource {
  common:{
    'changeLang' : string,
    'en': string,
    'es': string,
    'ru': string,
    'savedCities': string
  }
}