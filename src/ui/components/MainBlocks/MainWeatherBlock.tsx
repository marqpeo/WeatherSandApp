import { memo } from 'react';
import { getTime } from '../../../helpers/types.helpers';
import { IWeatherForecastDay } from '../../../models/WeatherForecastDay';
import { ICity } from '../../../models/City';
import { useDispatch } from 'react-redux';
import { toggleSavedCity } from '../../../redux/citiesState';
import { Box, Button, Paper, Typography } from '@mui/material';

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
        variant='h2' fontWeight={600}
        className='text-temp-deg'
      >{temp}°</Typography>
      <Typography
        // className='text-lg'
      >{label}</Typography>
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
      className='bg-white p-5 h-3/5 md:h-2/3 flex flex-row flex-wrap-reverse'>
      {selectedDay && city &&
        <>
          <div className='md:w-2/3 flex flex-col justify-between'>

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
          </div>

          <div className='md:w-1/3 flex flex-col md:justify-between'>
            <div className='flex items-center'>
              <Typography variant='h3' sx={{ pr: 2 }}>{city.name}</Typography>
            </div>
            {city.name !== 'GeoPosition' &&
              <Typography variant='h4' color='GrayText' children={city.country + ', ' + city.desc1} />
            }
            <Typography variant='h5' color='gray' sx={{ mt: 2 }}
              children={selectedDay?.date?.toString().slice(0, 10).split('-').reverse().join('-')}
              />
            {city.name !== 'GeoPosition' && <Button
              variant='contained'
              sx={{":hover": { boxShadow: '2px 2px 5px gray' }, width:'fit-content' }}
              onClick={handleSaveCity}
              children={<Typography variant='button' children={city.isSaved ? 'Remove from saved' : 'Save'} />}
            />}
            <Typography sx={{height: 'min-content' }} >Data from <b>{city.forecastCount}</b> sources</Typography>
          </div>
        </>
      }
    </Paper>
  );
};

export default memo(MainWeather);
