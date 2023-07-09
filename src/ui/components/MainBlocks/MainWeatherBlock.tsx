import { memo, useEffect } from 'react';
import { getTime, getWeekDay } from '../../../helpers/types.helpers';
import { IWeatherForecastDay } from '../../../models/WeatherForecastDay';
import { ICity } from '../../../models/City';
import { useDispatch } from 'react-redux';
import { toggleSavedCity } from '../../../redux/citiesState';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';

// const arr = WeatherConvert.toWeatherForecastDays(weather)

interface MainWeatherType {
  city: ICity,
  selectedDay?: IWeatherForecastDay
}

const MainWeather = ({ city, selectedDay }: MainWeatherType) => {

  const dispatch = useDispatch();

  const handleSaveCity = (e:any) => {
    e.preventDefault();
    dispatch(toggleSavedCity(city));
  }



  const TempValue = ({ temp, label }: { temp: number, label: string }) => (
    <div className='flex flex-col justify-center items-center'>
      <Typography
        // className='text-lg'
      >{label}</Typography>
      <Typography
        variant='h2' fontWeight={600}
        className='text-temp-deg'
      >{temp}°</Typography>
    </div>
  );

  const AdditValues = ({ iconName = '', valueLabel = '' }) => (
    <div className='flex flex-col items-center'>
      <span className='material-symbols-outlined text-4xl opacity-50'>{iconName}</span>
      <span className='text-xl'>{valueLabel}</span>
    </div>
  );

  return (
    <Paper
      elevation={3}
      className='bg-white p-5 h-2/3 flex flex-row flex-wrap-reverse'>
      {selectedDay && city &&
        <>
          <Grid container direction="column" sx={{width:{md:'67%'}, justifyContent:"space-between" }}>

              <div className='h-1/2 flex justify-around'>
                <TempValue temp={selectedDay.tempMin} label='Min temp.' />
                <TempValue temp={selectedDay.tempMax} label='Max temp.' />
              </div>
              <div className='h-1/2 w-full flex justify-around'>
                <AdditValues iconName='air' valueLabel={`${selectedDay.windSpeed} mps`} />
                <AdditValues iconName='rainy' valueLabel={`${selectedDay.precipProbab} %`} />
                {
                  selectedDay.sunrise && selectedDay.sunset &&
                  <AdditValues iconName='wb_twilight' valueLabel={`${getTime(selectedDay.sunrise)} - ${getTime(selectedDay.sunset)}`} />
                }
                {
                  selectedDay.weatherType &&
                  <img src={`/assets/weather_types/${selectedDay.weatherType}.svg`}
                    alt="weather type"
                    className='h-3/4' />
                }
              </div>
          </Grid>

          <Grid container direction="column" sx={{width:{md:'33%'}, justifyContent:{md: "space-between"} }} >
            <div className='flex items-center'>
              <Typography variant='h3' sx={{ pr: 2 }}>{city.name}</Typography>
            </div>
            {city.name !== 'GeoPosition' &&
              <Typography variant='h5' color='GrayText' children={city.country + ', ' + city.desc1} />
            }
            <Typography variant='h5' color='gray'
              children={
                `${selectedDay?.date?.toString().slice(0, 10).split('-').reverse().join('-')}, ${getWeekDay( new Date(selectedDay?.date).getDay(), 'ru', true)}`}
              />
            <Grid container alignItems={{xs:'center', md: 'start'}} justifyContent={{xs:'space-between', md:'start'}} direction={{xs:'row', md:'column'}} wrap='wrap'>

              {city.name !== 'GeoPosition' && <Button
                variant='contained'
                sx={{":hover": { boxShadow: '2px 2px 5px gray' }, width:'fit-content' }}
                onClick={handleSaveCity}
                children={<Typography variant='button' children={city.isSaved ? 'Remove from saved' : 'Save'} />}
                />}
              <Typography sx={{height: 'min-content', width:'fit-content' }} >Data from <b>{city.forecastCount}</b> sources</Typography>
            </Grid>
          </Grid>
        </>
      }
    </Paper>
  );
};

export default memo(MainWeather);
