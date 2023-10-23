import i18n from "../locales";
import { LanguageType } from "../models/locales";

export const getWeekDay = (
  num:number, fullWeekDaysArr:string[], shortWeekDaysArr:string[], fullName?:boolean
) => {
  return fullName ? fullWeekDaysArr[num] : shortWeekDaysArr[num];
}

export const getDateAndMonth = (date:string, monthsArr:string[], lang: LanguageType) =>
  lang === "ru"
    ? `${new Date(date).getDate()} ${monthsArr[new Date(date).getMonth()]}`
    : `${monthsArr[new Date(date).getMonth()]}, ${new Date(date).getDate()}`

export const getTime = (date:string) => new Date(date).toTimeString().slice(0, 5);