// @flow
import {
  SUBMIT_PASSWORD,
  FETCHING_PUCK_DATA,
  FETCHING_PUCK_DATA_SUCCESS,
  FETCHING_PUCK_DATA_ERROR,
  TOGGLE_PUCK_IS_FOUND,
} from './actions';

/* eslint-disable no-duplicate-imports */
import type {
  SubmitPasswordType,
  FetchingPuckDataType,
  FetchingPuckDataSuccessType,
  FetchingPuckDataErrorType,
  TogglePuckIsFoundType,
} from './actions';
import type {PuckDataType} from '../io/types';
/* eslint-enable no-duplicate-imports */

type StateType = {|
  role: ?string,
  invalidPassword: boolean,
  puckDataStatus: 'not_loaded' | 'loading' | 'success' | 'error',
  puckData: ?Array<PuckDataType>,
  puckDataLoadingErrorMessage: ?string,
  foundPucks: Array<number>,
|};

type ActionType = (
  SubmitPasswordType |
  FetchingPuckDataType |
  FetchingPuckDataSuccessType |
  FetchingPuckDataErrorType |
  TogglePuckIsFoundType
);

const initialState: StateType = {
  role: null,
  invalidPassword: false,
  puckDataStatus: 'not_loaded',
  puckData: null,
  puckDataLoadingErrorMessage: null,
  foundPucks: [],
};

export default (state: StateType = initialState, action: ActionType) => {
  switch (action.type) {
    case SUBMIT_PASSWORD: {
      const {password} = action;
      if (password === 'findpucks') {
        return {
          ...state,
          role: 'finder',
          invalidPassword: false,
        };
      } else if (password === 'admin') {
        return {
          ...state,
          role: 'admin',
          invalidPassword: false,
        };
      } else {
        return {
          ...state,
          role: null,
          invalidPassword: true,
        };
      }
    }
    case FETCHING_PUCK_DATA: {
      return {
        ...state,
        puckDataStatus: 'loading',
        puckData: null,
        puckDataLoadingErrorMessage: null,
      };
    }
    case FETCHING_PUCK_DATA_SUCCESS: {
      const {data} = action;
      return {
        ...state,
        puckDataStatus: 'success',
        puckData: data,
        puckDataLoadingErrorMessage: null,
      };
    }
    case FETCHING_PUCK_DATA_ERROR: {
      const {error} = action;
      return {
        ...state,
        puckDataStatus: 'error',
        puckData: null,
        puckDataLoadingErrorMessage: `Error loading puck data: ${error.message}`,
      };
    }
    case TOGGLE_PUCK_IS_FOUND: {
      const {id} = action;
      const foundPucks = state.foundPucks.slice(0);
      const currentIndex = foundPucks.indexOf(id);
      if (currentIndex > -1) {
        foundPucks.splice(currentIndex, 1);
      } else {
        foundPucks.push(id);
      }
      return {
        ...state,
        foundPucks,
      };
    }
    default:
      return state;
  }
};