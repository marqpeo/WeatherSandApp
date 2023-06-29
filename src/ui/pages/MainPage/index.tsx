import WeekDays from '../../components/MainBlocks/WeekDays';
import MainWeather from '../../components/MainBlocks/MainWeatherBlock';
import { IWeatherForecastDay } from '../../../models/WeatherForecastDay';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ICity } from '../../../models/City';
import { Backdrop, CircularProgress, Typography } from '@mui/material';
import { IAppState } from '../../../models/AppState';
import { getSavedCities } from '../../../models/redux/actions/cities';


export default function MainPage() {
  const dispatch = useDispatch<any>();

  const currentCity = useSelector<IAppState, ICity|undefined|null>(state => state.cities.currentCity);

  const loading = useSelector<IAppState, boolean>(({core}) => core.loading);

  const selectedDay = useSelector<IAppState, IWeatherForecastDay | undefined>(state => {
    const city = state.cities.currentCity;
    if (city) {
      return city.selectedDay ? city.selectedDay
        : city.forecast ? city.forecast[0] : undefined;
    } else return undefined;
  });

  useEffect(() => {
    dispatch(getSavedCities());
  }, [dispatch])

  // useEffect(() => {
  //   if( currentCity && !currentCity?.forecast ){
  //     dispatch(
  //       fetchCityForecast(currentCity)
  //     )
  //   }
  // },[currentCity, dispatch])

  return currentCity ?
    (<>
      <Backdrop
        sx={{ color: '#fff', zIndex:9999}}
        open={loading}
      >
        <CircularProgress size={100} color="inherit"  />
      </Backdrop>
      <MainWeather city={currentCity} selectedDay={selectedDay} />
      <WeekDays daysArray={currentCity?.forecast}  />
      {/* className='w-3/4 h-1/4' */}
    </>)
    :
    (
      <div className=' '>
        <Typography variant='h3'>
          👈 Try to search the city to find out its weather!
        </Typography>
      </div>
    )
}
