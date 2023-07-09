import { Action } from "@reduxjs/toolkit";

export interface IAction<T extends string> extends Action {
  type: T
};

export interface IPayloadAction<T extends string, P> extends IAction<T> {
  payload: P
}