import { Action } from '@reduxjs/toolkit';
import { EMPTY, Observable, catchError, concat, of } from 'rxjs';
import { onCloseDrawer, onHideLoader, onShowErrorMessage, onShowLoader } from './core';
import { IAppState } from '../models/AppState';

export const callWithLoader$ = <T extends Action>(
  action$: Observable<T>,
  loaderTitle?: string|null,
  state?: IAppState,
) =>
  concat(
    of(onShowLoader(loaderTitle)),
    state?.core?.drawerIsOpen ? of(onCloseDrawer()) : EMPTY,
    action$.pipe(
      catchError(err =>
        of(onShowErrorMessage(err))
      )
    ),
    of(onHideLoader())
  );
