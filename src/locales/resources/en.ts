import { LanguageResource } from "../../models/locales";


export const enResource: LanguageResource = {
  common:{
    saveCity: 'Save',
    deleteCity: 'Remove from saved',
    maxTemp: 'Max temp.',
    minTemp: 'Min temp.',
    mps: 'mps',
    kph: 'kph',
    resourceNum: 'Number of data sources'
  },
  sidebar:{
    changeLang : 'Change language',
    en: 'English',
    es: 'Español',
    ru: 'Русский',
    savedCities: 'Saved cities',
    noSavedCities: 'You don\'t have any saved city yet',
    citySearchPlaceholder: 'Search for a new city',
    onlyEnglish: ''
  },
  mainPage:{
    welcomeHeader: 'Try to search any city to find out the weather!'
  },
  dates:{
    daysShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    daysFull:['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  }
}
