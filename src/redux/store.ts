import { AnyAction, configureStore, applyMiddleware } from '@reduxjs/toolkit';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import cities from './citiesState';
import core from './core';
import { IAppState } from '../models/AppState';
import citiesEpics from './citiesState/epics';

const epicMiddleware = createEpicMiddleware<AnyAction,AnyAction, IAppState>();

export const store = configureStore({
  reducer: {
    cities,
    core
  },
  // middleware: getDefaultMiddleware => [
  //   ...getDefaultMiddleware({thunk: false}),
    
  // ],
  enhancers:[applyMiddleware(epicMiddleware)],
  devTools: process.env.NODE_ENV !== 'production',
});

const rootEpic = combineEpics(
  citiesEpics
);

epicMiddleware.run(rootEpic)

export type AppDispatch = typeof store.dispatch;
