import { createSlice } from '@reduxjs/toolkit';
import { ICoreState } from '../../models/AppState';
import { saveToStorage } from '../../helpers/localstorage.helpers';
import { LanguageType } from '../../models/locales';


const initialState:ICoreState = {
  loading: true,
  drawerIsOpen: false,
  loaderTitle: undefined,
  savedListIsOpen: true,
  errorMessage: undefined,
  language: 'dev'
};

export enum StorageKeysCore {
  Core = 'core'
};

const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    showLoader(state, {payload}){
      state.loaderTitle = payload
      state.loading = true;
    },
    hideLoader(state){
      state.loading = false;
    },
    toggleDrawer(state){
      state.drawerIsOpen = !state.drawerIsOpen;
      saveToStorage(state, StorageKeysCore.Core)
    },
    closeDrawer(state){
      state.drawerIsOpen = false;
      saveToStorage(state, StorageKeysCore.Core)
    },
    toggleSavedList(state){
      state.savedListIsOpen = !state.savedListIsOpen;
      saveToStorage(state, StorageKeysCore.Core)
    },
    showErrorMessage(state, {payload}){
      state.errorMessage = payload;
    },
    closeMessage(state){
      state.errorMessage = undefined;
    },
    setCurrentLanguage(state,{payload}:{payload: LanguageType}){
      state.language = payload;
      saveToStorage(state, StorageKeysCore.Core);
    }
  },
  // extraReducers: builder => {},
});

export const {
  hideLoader,
  showLoader,
  toggleDrawer,
  closeDrawer,
  toggleSavedList,
  showErrorMessage,
  closeMessage,
  setCurrentLanguage,
} = coreSlice.actions;

export default coreSlice.reducer;
