import { memo } from "react"
import { IWeatherForecastDay } from "../../../models/WeatherForecastDay";
import DayCard from "../Cards/DayCard";


interface WeekDaysTypes {
  daysArray: IWeatherForecastDay[] | undefined
}

const WeekDays = ({ daysArray }:WeekDaysTypes) => {
  return (
    <div className='flex justify-between mt-3 overflow-x-scroll'>
      {daysArray !== undefined && daysArray.map(item => (
        <DayCard key={item.date.toString()} weatherDay={item} />
      ))}
    </div>
  )
}

export default memo(WeekDays);