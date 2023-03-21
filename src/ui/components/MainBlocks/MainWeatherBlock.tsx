import { memo } from 'react';
import { getTime } from '../../../helpers/types.helpers';
import { WeatherForecastDay } from '../../../models/WeatherForecastDay';
import { City } from '../../../models/City';
import { useDispatch } from 'react-redux';
import { toggleSavedCity } from '../../../redux/citiesState';

// const arr = WeatherConvert.toWeatherForecastDays(weather)

interface MainWeatherType {
  className: string,
  city: City,
  selectedDay?: WeatherForecastDay
}

const MainWeather = ({ className = '', city, selectedDay }: MainWeatherType) => {

  const dispatch = useDispatch();

  const handleSaveCity = (e:any) => {
    e.preventDefault();
    dispatch(toggleSavedCity(city));
  }



  const TempValue = ({ temp, label }: { temp: number, label: string }) => (
    <div className='flex flex-col items-center'>
      <span className='text-8xl font-bold text-temp-deg'>{temp}°</span>
      <span className='text-lg'>{label}</span>
    </div>
  );

  const AdditValues = ({ iconName = '', valueLabel = '' }) => (
    <div className='flex flex-col items-center'>
      <span className='material-symbols-outlined text-4xl opacity-50'>{iconName}</span>
      <span className='text-xl'>{valueLabel}</span>
    </div>
  );

  return (
    <div className={`bg-white p-5 rounded-lg ${className}`}>
      {selectedDay && city &&
        <div id='info_main' className='h-full'>
          {/* City info */}
          <div className='flex justify-between h-1/3'>
            <div className='flex flex-col'>
              <div className='flex items-baseline'>
                <h1 className='pr-2 text-3xl'>{city.name}</h1>
                {city.name !== 'GeoPosition' && <button
                  className='ml-3 text-2xl bg-blue-300 rounded-md px-2 h-min
                  shadow-none hover:shadow-lg hover:shadow-gray-300 '
                  onClick={handleSaveCity}
                  >{city.isSaved ? 'Remove from saved' : 'Save'}</button>}
              </div>
              {
                city.name !== 'GeoPosition' && 
              <span className='text-xl text-gray-500'>{city.country + ', ' + city.desc1}</span>
              }
              <span className='text-2xl text-gray-600 mt-2'>{selectedDay.date.toString().slice(0, 10).split('-').reverse().join('-')}</span>
            </div>
            <div className='bg-blue-300 rounded-md p-2 h-min'>Data from <b>{city.forecastCount}</b> sources</div>
          </div>

          {/* Main info */}
          <div className='h-2/3 flex justify-between'>
            <div className='w-2/3 h-full'>
              <div className='h-2/3 flex justify-around'>
                <TempValue temp={selectedDay.tempMin} label='Min temp.' />
                <TempValue temp={selectedDay.tempMax} label='Max temp.' />
              </div>
              <div className='h-1/3 w-full flex justify-around'>
                <AdditValues iconName='air' valueLabel={`${selectedDay.windSpeed} mps`} />
                <AdditValues iconName='rainy' valueLabel={`${selectedDay.precipProbab} %`} />
                {
                  selectedDay.sunrise && selectedDay.sunset &&
                  <AdditValues iconName='wb_twilight' valueLabel={`${getTime(selectedDay.sunrise)} - ${getTime(selectedDay.sunset)}`} />
                }

              </div>
            </div>
            <div className='w-1/3 h-full text-center'>
              {/* <img className='h-5/6 w-full' src="./assets/img/chancesleet.svg" alt="" /> */}
              {
                selectedDay.weatherType &&
                <img src={`/assets/weather_types/${selectedDay.weatherType}.svg`} alt="weather type" className='w-full' />
              }
              {/* <span>{selectedDay.weatherType}</span> */}
            </div>
          </div>

        </div>
        // <div id="info_days" className="h-2/3"></div> 
      }
    </div>
  );
};

export default memo(MainWeather);
