export const getWeekDay = (num:number, lang:string, fullName?:boolean) => {
  const en = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];
  const enFull = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return fullName ? enFull[num] :en[num];
}

export const getDateAndMonth = (date:Date) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return `${date.getDate()} ${months[date.getMonth()]}`
}

export const getTime = (date:Date) => new Date(date).toTimeString().slice(0, 5);