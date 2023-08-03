import { memo } from "react"
import { IWeatherForecastDay } from "../../../models/WeatherForecastDay";
import DayCard from "../Cards/DayCard";
import { useTranslation } from "react-i18next";
import { getDateAndMonth } from "../../../helpers/types.helpers";
import { LanguageType } from "../../../models/locales";



interface WeekDaysTypes {
  daysArray: IWeatherForecastDay[] | undefined
}

const WeekDays = ({ daysArray }:WeekDaysTypes) => {
  const { t, i18n } = useTranslation('dates')
  const shortWeekDays = t('daysShort',{returnObjects:true}) as Array<string>;
  const shortMonths = t('monthsShort',{returnObjects:true}) as Array<string>;

  return (
    <div className='flex justify-between mt-3 overflow-x-scroll'>
      {daysArray !== undefined && daysArray.map(item =>{        
        return (
          <DayCard
            key={item.date.toString()}
            weatherDay={item}
            weekDayText={item.date ? shortWeekDays[new Date(item.date).getDay()] : ''}
            dateText={getDateAndMonth(item.date,shortMonths, i18n.language as LanguageType)}
            />
        )
      }      
      )}
    </div>
  )
}

export default memo(WeekDays);