import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ICity, getCityByGeo } from '../../models/City';
import { WeatherConvert } from '../../models/WeatherForecastDay';
import { ICitiesState, IAppState } from '../../models/AppState';
import { getCityForecast } from '../../services/forecastServices';
import { ForecastActionTypes } from '../../models/redux/actions/forecast';
import { getFromStorage, saveToStorage } from '../../helpers/localstorage.helpers';

const deprecatedKeys = ['savedStoreCities'];

export enum StorageKeysCities {
  SavedCities = 'cachedCitiesStore',
  UseGeoPermission = 'permissionToUseGeo'
};

const initialState: ICitiesState = {
  currentCity: undefined,
  citiesCache: [],
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

      saveToStorage(state.citiesCache, StorageKeysCities.SavedCities);
    },
    modifyOrder(state, action) {
      const newCachedCities = state.citiesCache;
      state.citiesCache = [
        ...action.payload,
        ...newCachedCities.filter(item => item.isSaved === false),
      ];
      saveToStorage(state.citiesCache, StorageKeysCities.SavedCities);
    },
    saveCities(state, {payload}:{payload: ICity[]}) {
      if( Boolean(payload) && payload.length>0){
        state.citiesCache = payload!;
        state.currentCity = payload![0];
        if(payload![0].forecast){
          state.currentCity.selectedDay = payload![0].forecast[0];
        }
      }

      // const geoPermission = getFromStorage(StorageKeysCities.UseGeoPermission)
      // if (geoPermission) {
      //   state.permissionUseGeo = JSON.parse(geoPermission) as boolean;
        
      // }
      // state.fetchState = 'ok';

      deprecatedKeys.forEach(key => localStorage.removeItem(key))
    },
    selectDay(state, { payload }) {
      const newSelectedDay = state.currentCity!.forecast!.find(item => item.date === payload)
      state.currentCity!.selectedDay = newSelectedDay;
    },
    
    saveAndChooseNewCity(state, {payload}:{payload: ICity}){
      const newCachedCities:ICity[] = [
        ...state.citiesCache,
        payload
      ];
      // state = {
      //   ...state,
      //   currentCity:{
      //     ...payload,
      //     selectedDay: payload?.forecast![0]
      //   },
      //   citiesCache: newCachedCities
      // };
      state.currentCity = {
        ...payload,
        selectedDay: payload?.forecast![0]
      };
      state.citiesCache = newCachedCities;

      saveToStorage(newCachedCities, StorageKeysCities.SavedCities);
    },
    updateCity(state, {payload}:{payload:ICity}){
      const updatedCityIndex = state.citiesCache.findIndex(item => item.id === payload.id);
      state.citiesCache[updatedCityIndex] = payload;
    },
    selectCurrentCity(state, {payload}:{payload:number}){
      const choosedCity = state.citiesCache.find(item => item.id === payload);
      state.currentCity = choosedCity
    }
  },
});

export const {
  toggleSavedCity,
  saveCities,
  selectDay,
  modifyOrder,
  saveAndChooseNewCity,
  updateCity,
  selectCurrentCity
} = citiesSlice.actions;

export default citiesSlice.reducer;


// const a = (builder:ActionReducerMapBuilder<ICitiesState>) => 
//   builder
//     .addCase(fetchCityForecast.pending, (state, action) => {
//       state.fetchState = 'loading';
//       state.currentCity = action.meta.arg;
//     })
//     .addCase(fetchCityForecast.fulfilled, (state, action) => {
//       state.fetchState = 'ok';
//       const data = action.payload;
//       if (data?.fromCache) {

//         state.currentCity = {
//           ...data.cachedCity!,
//           selectedDay: data.cachedCity!.forecast![0],
//         };
//         state.citiesCache = state.citiesCache.filter(city => city.id !== data.cachedCity!.id);
      
//       } else {

//         state.currentCity!.forecast = data?.forecast;
//         state.currentCity!.forecastCount = data?.count;
//         state.currentCity!.selectedDay = data?.forecast![0];

//       }
//       state.citiesCache.push(state.currentCity!);
//       saveToStorage(state.citiesCache);
//     })
//     .addCase(fetchCityForecast.rejected, state => {
//       state.fetchState = 'error';
//     })




//     .addCase(fetchForecastGeo.pending, state => {
//       state.fetchState = 'loading';
//     })
//     .addCase(fetchForecastGeo.fulfilled, (state, action) => {
//       state.fetchState = 'ok';
//       if (action.payload) {
//         state.citiesCache.push(action.payload);
//         state.currentCity = action.payload;
//       }
//       saveToStorage(state.citiesCache);
//       // localStorage.setItem(geoForecastKey, JSON.stringify(state));
//     })
//     .addCase(fetchForecastGeo.rejected, state => {
//       state.fetchState = 'ok';
//     });
