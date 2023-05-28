import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { methodGet } from '../../api/methods';
import { getCityForecast } from '../../api/paths';
import { ICity, getCityByGeo } from '../../models/ICity';
import { WeatherConvert } from '../../models/IWeatherForecastDay';
import { RootState } from '../store';

const deprecatedKeys = ['savedStoreCities'];

const storageKeys = {
  savedCities: 'cachedCitiesStore',
  useGeoPermission: 'permissionToUseGeo'
};

interface CitiesState {
  fetchState: string;
  currentCity?: ICity | null;
  citiesCache: ICity[];
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
  async (city: ICity, { getState }) => {
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
          const newCity: ICity = {
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
      const geoForecast = WeatherConvert.toWeatherForecastDays(res.results);
      const city = getCityByGeo(
        coords.latitude,
        coords.longitude,
        geoForecast,
        res.count as number
      );
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
      const newPermissionValue = !state.permissionUseGeo
      state.permissionUseGeo = newPermissionValue;
      const newArr = state.citiesCache.filter(
        item => item.name !== 'GeoPosition'
      );
      state.citiesCache = newArr;
      if (state.currentCity?.name === 'GeoPosition') {
        if (state.citiesCache[0]) {
          state.currentCity = state.citiesCache[0];
        } else {
          state.currentCity = null;
        }
      }
      saveToStorage(newPermissionValue, storageKeys.useGeoPermission);
    },
    toggleSavedCity(state, action) {
      const cityToSave: ICity = action.payload;
      const newSavedState = !cityToSave.isSaved;

      const toggledCity: ICity = {
        ...cityToSave,
        isSaved: newSavedState,
      };
      const newArray = state.citiesCache.filter(
        city => city.id !== toggledCity.id
      );
      newArray.push(toggledCity);

      state.citiesCache = newArray;

      state.currentCity = toggledCity;

      saveToStorage(state.citiesCache);
    },
    modifyOrder(state, action) {
      const newCachedCities = state.citiesCache;
      state.citiesCache = [
        ...action.payload,
        ...newCachedCities.filter(item => item.isSaved === false),
      ];
      saveToStorage(state.citiesCache);
    },
    getSavedCities(state) {
      const storage = getFromStorage();
      if (storage) {
        const parsedState = JSON.parse(storage) as ICity[];
        
        const citiesArr = parsedState.map(item => {
          if (item.forecast) {            
            return Date.now() > new Date(item.forecast[1].date).getTime()
            ? { ...item, forecast: undefined, forecastCount: undefined }
            : item;
          } else return item;
        });
        
        state.citiesCache = citiesArr;
        state.currentCity = citiesArr[0];
        
      }
      const geoPermission = getFromStorage(storageKeys.useGeoPermission)
      if (geoPermission) {
        state.permissionUseGeo = JSON.parse(geoPermission) as boolean;
        
      }
      state.fetchState = 'ok';

      deprecatedKeys.forEach(key => localStorage.removeItem(key))
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
          state.citiesCache = state.citiesCache.filter(city => city.id !== data.cachedCity!.id);
        } else {
          state.currentCity!.forecast = data?.forecast;
          state.currentCity!.forecastCount = data?.count;
          state.currentCity!.selectedDay = data?.forecast![0];
        }
        state.citiesCache.push(state.currentCity!);
        saveToStorage(state.citiesCache);
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
        saveToStorage(state.citiesCache);
        // localStorage.setItem(geoForecastKey, JSON.stringify(state));
      })
      .addCase(fetchForecastGeo.rejected, state => {
        state.fetchState = 'ok';
      });
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

function saveToStorage(value:any, key = storageKeys.savedCities) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key = storageKeys.savedCities) {
  return localStorage.getItem(key);
}
