import { memo } from "react"
import { IWeatherForecastDay } from "../../../models/IWeatherForecastDay";
import DayCard from "../Cards/DayCard";


interface WeekDaysTypes {
  daysArray: IWeatherForecastDay[] | undefined,
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