import WeekDays from '../components/MainBlocks/WeekDays';
import MainWeather from '../components/MainBlocks/MainWeatherBlock';
import { WeatherForecastDay } from '../../models/WeatherForecastDay';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect } from 'react';
import { City } from '../../models/City';
import { getSavedCities } from '../../redux/citiesState';


export default function MainPage() {
  const dispatch = useDispatch();

  const currentCity = useSelector<RootState, City|undefined|null>(state => state.cities.currentCity);

  const loading = useSelector<RootState, string>(state => state.cities.fetchState);

  const selectedDay = useSelector<RootState, WeatherForecastDay | undefined>(state => {
    // const cityGeo = state.geoForecast.geoCity;
    // if (state.geoForecast.permissionUseGeo && cityGeo !== undefined) {
    //   return cityGeo.forecast![0]
    // }
    const city = state.cities.currentCity;
    if (city) {
      return city.selectedDay ? city.selectedDay
        : city.forecast ? city.forecast[0] : undefined;
    } else return undefined;
  });

  useEffect(() => {
    dispatch(getSavedCities());
  }, [dispatch])

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
        <h1 className='hidden lg:block text-3xl'>
          👈 Try to search the city to find out its weather!
        </h1>
        <h1 className='text-3xl lg:hidden'>
          Sorry, the site is currently unavailable for mobile devices. <br />
          But it will be soon, come back!
        </h1>
      </div>
    )
}
