// @flow
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducer';

export default () => {
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
  const store = createStore(
    reducer,
    undefined,
    composeEnhancers(
      applyMiddleware(thunk),
    ),
  );

  if (module.hot) {
    // $FlowIgnore
    module.hot.accept(() => {
      const nextRootReducer = require('./reducer').default; // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};