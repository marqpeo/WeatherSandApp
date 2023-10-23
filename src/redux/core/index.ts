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
  language: 'en'
};

export enum StorageKeysCore {
  Core = 'core'
};

const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    onShowLoader(state, {payload}){
      state.loaderTitle = payload
      state.loading = true;
    },
    onHideLoader(state){
      state.loading = false;
    },
    onToggleDrawer(state){
      state.drawerIsOpen = !state.drawerIsOpen;
      saveToStorage(state, StorageKeysCore.Core)
    },
    onCloseDrawer(state){
      state.drawerIsOpen = false;
      saveToStorage(state, StorageKeysCore.Core)
    },
    onToggleSavedList(state){
      state.savedListIsOpen = !state.savedListIsOpen;
      saveToStorage(state, StorageKeysCore.Core)
    },
    onShowErrorMessage(state, {payload}){
      state.errorMessage = payload;
    },
    onCloseMessage(state){
      state.errorMessage = undefined;
    },
    onSetCurrentLanguage(state,{payload}:{payload: LanguageType}){
      state.language = payload
      saveToStorage(state, StorageKeysCore.Core);
    }
  }
});

export const {
  onHideLoader,
  onShowLoader,
  onToggleDrawer,
  onCloseDrawer,
  onToggleSavedList,
  onShowErrorMessage,
  onCloseMessage,
  onSetCurrentLanguage,
} = coreSlice.actions;

export default coreSlice.reducer;
