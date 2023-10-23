import { LanguageResource } from "../../models/locales";


export const esResource: LanguageResource = {
  common:{
    saveCity: 'Guardar',
    deleteCity: 'Eliminar de guardados',
    maxTemp: 'Temp. max.',
    minTemp: 'Temp. min',
    mps: 'mps',
    kph: 'kph',
    resourceNum: 'Сantidad de fuentes de datos'
  },
  sidebar:{
    changeLang : 'Cambiar idioma',
    en: 'English',
    es: 'Español',
    ru: 'Русский',
    savedCities: 'Ciudades guardadas',
    noSavedCities: 'No hay ciudades guardadas',
    citySearchPlaceholder: 'Búsqueda de ciudades',
    onlyEnglish: 'Temporalmente, la búsqueda de ciudades solo está disponible en inglés'
  },
  mainPage:{
    welcomeHeader: 'Busca una ciudad para encontrar su tiempo!'
  },
  dates:{
    daysShort:['Dom','Lun','Mar','Mie','Jue','Vie','Sáb'],
    daysFull:['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
    monthsShort:['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    monthsFull:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  }
}
