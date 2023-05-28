import WeekDays from '../components/MainBlocks/WeekDays';
import MainWeather from '../components/MainBlocks/MainWeatherBlock';
import { IWeatherForecastDay } from '../../models/IWeatherForecastDay';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect } from 'react';
import { ICity } from '../../models/ICity';
import { fetchCityForecast, getSavedCities } from '../../redux/citiesState';
import { Typography } from '@mui/material';


export default function MainPage() {
  const dispatch = useDispatch<any>();

  const currentCity = useSelector<RootState, ICity|undefined|null>(state => state.cities.currentCity);

  const loading = useSelector<RootState, string>(state => state.cities.fetchState);

  const selectedDay = useSelector<RootState, IWeatherForecastDay | undefined>(state => {
    const city = state.cities.currentCity;
    if (city) {
      return city.selectedDay ? city.selectedDay
        : city.forecast ? city.forecast[0] : undefined;
    } else return undefined;
  });

  useEffect(() => {
    dispatch(getSavedCities());
  }, [dispatch])

  useEffect(() => {
    if( currentCity && !currentCity?.forecast ){
      dispatch(
        fetchCityForecast(currentCity)
      )
    }
  },[currentCity, dispatch])

  if (loading === 'loading') {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <span className='loader'></span>
      </div>
    )
  }

  return currentCity ?
    (<>
      <MainWeather city={currentCity} selectedDay={selectedDay} className='w-3/4 h-3/5' />
      <WeekDays daysArray={currentCity?.forecast} className='w-3/4 h-1/4' />
    </>)
    :
    (
      <div className=' '>
        <Typography variant='h3'>
          👈 Try to search the city to find out its weather!
        </Typography>
        {/* <h1 className='text-3xl lg:hidden'>
          Sorry, the site is currently unavailable for mobile devices. <br />
          But it will be soon, come back!
        </h1> */}
      </div>
    )
}
