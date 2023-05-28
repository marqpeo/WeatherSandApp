import { memo, SyntheticEvent } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getDateAndMonth, getWeekDay } from "../../../helpers/types.helpers";
import { IWeatherForecastDay } from "../../../models/IWeatherForecastDay";
import { selectDay } from "../../../redux/citiesState";
import { RootState } from "../../../redux/store";

interface DayCardTypes {
  weatherDay: IWeatherForecastDay
}

const DayCard = ({ weatherDay }: DayCardTypes) => {
  const date = new Date(weatherDay.date);

  const dispatch = useDispatch();

  const handleSelectDay = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(selectDay(weatherDay));
  }
  const dayIsSelected = useSelector<RootState, boolean>(state => state.cities.currentCity!.selectedDay!.date === weatherDay.date);

  return (
    <div onClick={handleSelectDay}
      className={`flex flex-col justify-around items-center
      bg-white w-full h-full mx-1 cursor-pointer border-4 rounded-lg shadow-none hover:drop-shadow-lg
      ${dayIsSelected ? 'border-temp-deg' : 'hover:border-temp-deg'} `}
    >
      <span>{getWeekDay(date.getDay(), 'ru')}</span>
      <span>{getDateAndMonth(date)}</span>
      <div className="flex w-10/12">
        {
          weatherDay.weatherType &&
          <img
            src={`/assets/weather_types/${weatherDay.weatherType}.svg`}
            className='w-2/3'
            alt="weather type"
            />
        }
        <div className='flex flex-col items-center w-1/3'>
          <span className='material-symbols-outlined text-4xl opacity-50'>rainy</span>
          <span className='text-md'>{`${weatherDay.precipProbab}%`}</span>
        </div>
      </div>
      <div className="flex justify-evenly w-full">
        <span>{weatherDay.tempMin}°</span>
        <span>{weatherDay.tempMax}°</span>
      </div>


    </div>
  )
}


export default memo(DayCard)