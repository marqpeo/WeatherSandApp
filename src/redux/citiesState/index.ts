import { createSlice } from '@reduxjs/toolkit';
import { ICity } from '../../models/City';
import { ICitiesState } from '../../models/AppState';
import { saveToStorage } from '../../helpers/localstorage.helpers';

const deprecatedKeys = ['savedStoreCities'];

export enum StorageKeysCities {
  SavedCities = 'cachedCitiesStore',
  UseGeoPermission = 'permissionToUseGeo'
};

const initialState: ICitiesState = {
  currentCity: undefined,
  citiesCache: []
};

// export const fetchForecastGeo = createAsyncThunk(
//   ForecastActionTypes.FetchForecastGeo,
//   async (coords: GeolocationCoordinates, { rejectWithValue, getState }) => {
//     const permissionUseGeo = getState() as IAppState;
//     if (!permissionUseGeo.cities.permissionUseGeo) {
//       return rejectWithValue(false);
//     }
//     const res = await getCityForecast(coords.latitude, coords.longitude);
//     if (res.status === 'ok') {
//       const geoForecast = WeatherConvert.toWeatherForecastDays(res.results);
//       const city = getCityByGeo(
//         coords.latitude,
//         coords.longitude,
//         geoForecast,
//         res.count as number
//       );
//       return city;
//     }
//   }
// );

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    // toggleGeoPermission(
    //   state,
    //   action: { payload: boolean | undefined; type: string }
    // ) {
    //   const newPermissionValue = !state.permissionUseGeo
    //   state.permissionUseGeo = newPermissionValue;
    //   const newArr = state.citiesCache.filter(
    //     item => item.name !== 'GeoPosition'
    //   );
    //   state.citiesCache = newArr;
    //   if (state.currentCity?.name === 'GeoPosition') {
    //     if (state.citiesCache[0]) {
    //       state.currentCity = state.citiesCache[0];
    //     } else {
    //       state.currentCity = null;
    //     }
    //   }
    //   saveToStorage(newPermissionValue, StorageKeysCities.UseGeoPermission);
    // },
    onToggleSavedCity(state, action) {
      const cityToSave: ICity = action.payload;
      const newSavedState = !cityToSave.isSaved;

      const toggledCity: ICity = {
        ...cityToSave,
        isSaved: newSavedState,
      };
      const newArray = state.citiesCache.filter(
        city => city.id !== toggledCity.id
      );
      const isLastSaved = newArray.some(city => city.isSaved);
      if(toggledCity.isSaved || !isLastSaved) newArray.unshift(toggledCity);
        else newArray.push(toggledCity);

      state.citiesCache = newArray;
      saveToStorage(state.citiesCache, StorageKeysCities.SavedCities);
    },
    onModifyOrder(state, action) {
      const newCachedCities = state.citiesCache;
      state.citiesCache = [
        ...action.payload,
        ...newCachedCities.filter(item => item.isSaved === false),
      ];
      saveToStorage(state.citiesCache, StorageKeysCities.SavedCities);
    },
    onSaveCities(state, {payload}:{payload: ICity[]}) {
      if(payload.length>0){
        state.citiesCache = payload;
      }
      deprecatedKeys.forEach(key => localStorage.removeItem(key))
    },
    onAddCities(state, {payload}:{payload: ICity | ICity[]}){
      const newElements = Array.isArray(payload) ? payload : [payload];
      state.citiesCache = [
        ...state.citiesCache,
        ...newElements
      ]
    },
    onSelectDay(state, { payload }) {
      const newSelectedDay = state.currentCity!.forecast!.find(item => item.date.toString() === payload)
      state.currentCity!.selectedDay = newSelectedDay;
    },
    onUpdateCity(state, {payload}:{payload:ICity}){
      const updatedCityIndex = state.citiesCache.findIndex(item => item.id === payload.id);
      if(updatedCityIndex>=0){
        state.citiesCache[updatedCityIndex] = payload;
        saveToStorage(state.citiesCache, StorageKeysCities.SavedCities);
      }
    },
    onSetCurrentCity(state, {payload}:{payload:ICity}){
      state.currentCity = payload;
    }
  },
});

export const {
  onToggleSavedCity,
  onSaveCities,
  onAddCities,
  onSelectDay,
  onModifyOrder,
  onUpdateCity,
  onSetCurrentCity,
} = citiesSlice.actions;

export default citiesSlice.reducer;
