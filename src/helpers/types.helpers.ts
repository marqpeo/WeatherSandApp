export const getWeekDay = (num:number, lang:string) => {
  const ru = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];
  return ru[num];
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