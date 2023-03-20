import { memo } from "react"
import { WeatherForecastDay } from "../../../models/WeatherForecastDay";
import DayCard from "../Cards/DayCard";


interface WeekDaysTypes {
  daysArray: WeatherForecastDay[] | undefined,
  className: string
}

const WeekDays = ({ daysArray, className }:WeekDaysTypes) => {
  return (
    <div className={`flex justify-between mt-3 ${className}`}>
      {daysArray && daysArray.map(item => (
        <DayCard key={item.date.toString()} weatherDay={item} />
      ))}
    </div>
  )
}

export default memo(WeekDays);