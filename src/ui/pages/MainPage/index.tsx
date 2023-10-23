import WeekDays from '../../components/MainBlocks/WeekDays';
import MainWeather from '../../components/MainBlocks/MainWeatherBlock';
import { IWeatherForecastDay } from '../../../models/WeatherForecastDay';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ICity } from '../../../models/City';
import { Backdrop, CircularProgress, Typography } from '@mui/material';
import { IAppState } from '../../../models/AppState';
import { initAction } from '../../../models/redux/actions/core';
import { useTranslation } from 'react-i18next';


export default function MainPage() {

  const { t } = useTranslation('mainPage');

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
    dispatch(initAction());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(loading){
    return (
      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={loading}>
        <CircularProgress size={100} color="inherit" />
      </Backdrop>
    )
  }

  return currentCity
    ? <>
      <MainWeather city={currentCity} selectedDay={selectedDay} />
      <WeekDays daysArray={currentCity?.forecast} />
    </>
    : <Typography variant='h3'>
      {t('welcomeHeader')}
    </Typography>
}
