import { memo, SyntheticEvent } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getDateAndMonth, getWeekDay } from "../../../helpers/types.helpers";
import { IWeatherForecastDay } from "../../../models/WeatherForecastDay";
import { selectDay } from "../../../redux/citiesState";
import { IAppState } from "../../../models/AppState";
import { Paper } from "@mui/material";

interface DayCardTypes {
  weatherDay: IWeatherForecastDay
}

const DayCard = ({ weatherDay }: DayCardTypes) => {  
  const date = new Date(weatherDay.date);

  const dispatch = useDispatch();

  const handleSelectDay = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(selectDay(weatherDay.date));
  }
  const dayIsSelected = useSelector<IAppState, boolean>(state =>
    state.cities.currentCity?.selectedDay?.date === weatherDay.date);
  

  return (
    <Paper
      onClick={handleSelectDay}
      elevation={3}
      className={`flex flex-col justify-around items-center
      min-w-fit
      w-full h-full mx-1 cursor-pointer border-2 rounded-lg shadow-none hover:drop-shadow-lg
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


    </Paper>
  )
}


export default memo(DayCard)