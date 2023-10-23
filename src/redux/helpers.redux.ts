import { Action } from '@reduxjs/toolkit';
import { Observable, catchError, concat, of } from 'rxjs';
import { closeDrawer, hideLoader, showErrorMessage, showLoader } from './core';

export const callWithLoader$ = <T extends Action>(
  action$: Observable<T>,
  loaderTitle?: string
) =>
  concat(
    of(showLoader(loaderTitle)),
    of(closeDrawer()),
    action$.pipe(
      catchError(err =>
        of(showErrorMessage(err))
      )
    ),
    of(hideLoader())
  );
