// @flow
import getPuckData from '../io/getPuckData';

import type {PuckDataType} from '../io/types';

export const SUBMIT_PASSWORD = 'SUBMIT_PASSWORD';
export type SubmitPasswordType = {|
  type: 'SUBMIT_PASSWORD',
  password: string,
|};
export function submitPassword(password: string): SubmitPasswordType {
  return {
    type: SUBMIT_PASSWORD,
    password,
  };
}

export const FETCHING_PUCK_DATA = 'FETCHING_PUCK_DATA';
export type FetchingPuckDataType = {|
  type: 'FETCHING_PUCK_DATA',
|};
export function fetchingPuckData(): FetchingPuckDataType {
  return {
    type: FETCHING_PUCK_DATA,
  };
}

export const FETCHING_PUCK_DATA_SUCCESS = 'FETCHING_PUCK_DATA_SUCCESS';
export type FetchingPuckDataSuccessType = {|
  type: 'FETCHING_PUCK_DATA_SUCCESS',
  data: Array<PuckDataType>,
|};
export function fetchingPuckDataSuccess(data: Array<PuckDataType>): FetchingPuckDataSuccessType {
  return {
    type: FETCHING_PUCK_DATA_SUCCESS,
    data,
  };
}

export const FETCHING_PUCK_DATA_ERROR = 'FETCHING_PUCK_DATA_ERROR';
export type FetchingPuckDataErrorType = {|
  type: 'FETCHING_PUCK_DATA_ERROR',
  error: Error,
|};
export function fetchingPuckDataError(e: Error): FetchingPuckDataErrorType {
  return {
    type: FETCHING_PUCK_DATA_ERROR,
    error: e,
  };
}

export function fetchPuckData() {
  return (dispatch: (action: Object) => void) => {
    dispatch(fetchingPuckData());
    getPuckData()
      .then((data) => {
        dispatch(fetchingPuckDataSuccess(data));
      })
      .catch((e) => {
        dispatch(fetchingPuckDataError(e));
      });
  };
}

export const TOGGLE_PUCK_IS_FOUND = 'TOGGLE_PUCK_IS_FOUND';
export type TogglePuckIsFoundType = {|
  type: 'TOGGLE_PUCK_IS_FOUND',
  id: number,
|};
export function togglePuckIsFound(id: number): TogglePuckIsFoundType {
  return {
    type: TOGGLE_PUCK_IS_FOUND,
    id,
  };
}