import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { methodGet } from '../../api/methods';
import { getCityForecast } from '../../api/paths';
import { City } from '../../models/City';
import { WeatherConvert } from '../../models/WeatherForecastDay';
import { RootState } from '../store';

const savedStoreKey = 'savedStoreCities';

interface CitiesState {
  fetchState: string;
  currentCity?: City | null;
  citiesCache: City[];
  permissionUseGeo: boolean;
}

const initialState: CitiesState = {
  fetchState: 'loading',
  currentCity: undefined,
  citiesCache: [],
  permissionUseGeo: false,
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
        const res = await methodGet(
          getCityForecast(cachedCity.latitude, cachedCity.longitude)
        );
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

export const fetchForecastGeo = createAsyncThunk(
  'forecast/fetchForecastGeo',
  async (coords: GeolocationCoordinates, { rejectWithValue, getState }) => {
    const permissionUseGeo = getState() as RootState;
    if (!permissionUseGeo.cities.permissionUseGeo) {
      return rejectWithValue(false);
    }
    const res = await methodGet(
      getCityForecast(coords.latitude, coords.longitude)
    );

    if (res.status === 'ok') {
      const forecast = WeatherConvert.toWeatherForecastDays(res.results);
      const city: City = {
        id: 0,
        name: 'GeoPosition',
        country: '',
        latitude: coords.latitude,
        longitude: coords.longitude,
        elevation: 0,
        countryCode: '',
        timezone: '',
        desc1: '',
        desc2: '',
        desc3: '',
        isSaved: true,
        forecast,
        forecastCount: res.count as number,
        selectedDay: forecast[0],
      };
      return city;
    }
  }
);

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    toggleGeoPermission(
      state,
      action: { payload: boolean | undefined; type: string }
    ) {
      // if (action.payload !== undefined) {
        // state.permissionUseGeo = action.payload;
      // } else {
        state.permissionUseGeo = !state.permissionUseGeo;
        const newArr = state.citiesCache.filter(
          item => item.name !== 'GeoPosition'
        );
        state.citiesCache = newArr;
        if (state.currentCity?.name === 'GeoPosition') {
          if (state.citiesCache[0]) {
            state.currentCity = state.citiesCache[0]
          }else{
            state.currentCity = null

          }
        }
      // }
      saveToStorage(state)
    },
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

      saveToStorage(state);
    },
    modifyOrder(state, action) {
      const newCachedCities = state.citiesCache;
      state.citiesCache = [
        ...action.payload,
        ...newCachedCities.filter(item => item.isSaved === false),
      ];
      saveToStorage(state);
    },
    getSavedCities(state) {
      const storage = getFromStorage();
      if (storage) {
        const parsedState = JSON.parse(storage) as CitiesState;
        
        const citiesArr = parsedState.citiesCache.map(item =>
          Date.now() > new Date(item.forecast![1].date).getTime()
          ? { ...item, forecast: undefined, forecastCount: undefined }
          : item
          );
          state.citiesCache = citiesArr;
          state.currentCity = parsedState.currentCity;
          // state.currentCity.selectedDay = citiesArr[0].forecast[0] ;

          state.permissionUseGeo = parsedState.permissionUseGeo;
      }
      state.fetchState = 'ok';
    },
    selectDay(state, { payload }) {
      state.currentCity!.selectedDay = payload;
    },
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
            selectedDay: data.cachedCity!.forecast![0],
          };
        } else {
          state.currentCity!.forecast = data?.forecast;
          state.currentCity!.forecastCount = data?.count;
          state.currentCity!.selectedDay = data?.forecast![0];
          state.citiesCache.push(state.currentCity!);
        }
        saveToStorage(state);
      })
      .addCase(fetchCityForecast.rejected, state => {
        state.fetchState = 'error';
      })
      .addCase(fetchForecastGeo.pending, state => {
        state.fetchState = 'loading';
      })
      .addCase(fetchForecastGeo.fulfilled, (state, action) => {
        state.fetchState = 'ok';
        if (action.payload) {
          state.citiesCache.push(action.payload);
          state.currentCity = action.payload;
        }
        saveToStorage(state);
        // localStorage.setItem(geoForecastKey, JSON.stringify(state));
      })
      .addCase(fetchForecastGeo.rejected, (state) => {
        state.fetchState = 'ok'
      })
  },
});

export const {
  toggleSavedCity,
  getSavedCities,
  selectDay,
  modifyOrder,
  toggleGeoPermission,
} = citiesSlice.actions;

export default citiesSlice.reducer;

function saveToStorage(state: CitiesState) {
  localStorage.setItem(savedStoreKey, JSON.stringify(state));
}

function getFromStorage() {
  return localStorage.getItem(savedStoreKey);
}
