import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { methodGet } from '../../api/methods';
import { getCityForecast } from '../../api/paths';
import { City } from '../../models/City';
import { WeatherConvert } from '../../models/WeatherForecastDay';
import { RootState } from '../store';

const savedCitiesKey = 'savedCities';

interface InitState {
  fetchState: string;
  currentCity?: City;
  citiesCache: City[];
}

const initialState: InitState = {
  fetchState: 'ok',
  currentCity: undefined,
  citiesCache: [],
};

export const fetchCityForecast = createAsyncThunk(
  'forecast/fetchCityWeather',
  async (city: City, { getState }) => {
    const { cities } = getState() as RootState;
    const cachedCity = cities.citiesCache.find(item => item.id === city.id);
    if (cachedCity) {
      if (cachedCity?.forecast) {
        return {
          fromCache: true,
          cachedCity,
        };
      } else {
        const res = await methodGet(getCityForecast(cachedCity.latitude, cachedCity.longitude));
        if (res.status === 'ok') {
          const newCity: City = {
            ...cachedCity,
            forecast: WeatherConvert.toWeatherForecastDays(res.results),
            forecastCount: res.count as number,
          };
          return {
            fromCache: true,
            cachedCity: newCity,
          };
        }
      }
    }

    const res = await methodGet(getCityForecast(city.latitude, city.longitude));

    if (res.status === 'ok') {
      return {
        fromCache: false,
        forecast: WeatherConvert.toWeatherForecastDays(res.results),
        count: res.count as number,
      };
    }
  }
);

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    toggleSavedCity(state, action) {
      const cityToSave: City = action.payload;
      const newSavedState = !cityToSave.isSaved;

      const cityExpirationTime = 24 * 60 * 60 * 1000;

      const toggledCity: City = {
        ...cityToSave,
        isSaved: newSavedState,
        expirationTime:
          newSavedState === true ? Date.now() + cityExpirationTime : undefined,
      };
      //
      const newArray = state.citiesCache.filter(
        city => city.id !== toggledCity.id
      );
      newArray.push(toggledCity);

      state.citiesCache = newArray;

      state.currentCity = toggledCity;

      localStorage.setItem(
        savedCitiesKey,
        JSON.stringify(newArray.filter(item => item.isSaved))
      );
    },
    getSavedCities(state) {
      const storage = localStorage.getItem(savedCitiesKey);
      if (storage) {
        const parsedArr = (JSON.parse(storage) as City[]).map(item =>
          Date.now() > new Date(item.forecast![1].date).getTime()
            ? { ...item, forecast: undefined, forecastCount: undefined }
            : item
        );

        state.citiesCache = parsedArr;
      }
    },
    selectDay(state, {payload}){
      state.currentCity!.selectedDay = payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCityForecast.pending, (state, action) => {
        state.fetchState = 'loading';
        state.currentCity = action.meta.arg;
      })
      .addCase(fetchCityForecast.fulfilled, (state, action) => {
        state.fetchState = 'ok';
        const data = action.payload;
        if (data?.fromCache) {
          state.currentCity = {
            ...data.cachedCity!,
            selectedDay : data.cachedCity!.forecast![0]
          }
        } else {
          state.currentCity!.forecast = data?.forecast;
          state.currentCity!.forecastCount = data?.count;
          state.currentCity!.selectedDay = data?.forecast![0]
          state.citiesCache.push(state.currentCity!)
        }
      })
      .addCase(fetchCityForecast.rejected, state => {
        state.fetchState = 'error';
      });
  },
});

export const { toggleSavedCity, getSavedCities, selectDay } = citiesSlice.actions;

export default citiesSlice.reducer;
