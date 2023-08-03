import { LanguageResource } from "../../models/locales";


export const ruResource: LanguageResource = {
  common:{
    saveCity: 'Сохранить',
    deleteCity: 'Удалить из сохраненного',
    maxTemp: 'Макс. темп',
    minTemp: 'Мин. темп',
    mps: 'м/с',
    kph: 'км/ч',
    resourceNum: 'Количество источников данных'
  },
  sidebar:{
    changeLang : 'Сменить язык',
    en: 'English',
    es: 'Español',
    ru: 'Русский',
    savedCities: 'Сохраненные города',
    noSavedCities: 'Список пуст',
    citySearchPlaceholder: 'Поиск города',
    onlyEnglish: 'Временно поиск городов доступен только на английском языке'
  },
  dates:{
    daysShort:['Вск','Пон','Вт','Ср','Чт','Пт','Суб'],
    daysFull:['Воскресенье', 'Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
    monthsFull: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
    monthsShort: ['Янв', 'Фев', 'Март', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  }
}
