// @flow
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {AppRegistry} from 'react-native';

import configureStore from './redux/configureStore';
import AppNavigator from './components/AppNavigator';
import {
  requestAuthorization,
  startMonitoringLocation,
  startMonitoringHeading,
} from './io/location';

const store = configureStore();

export default class PuckHunt extends Component {
  componentDidMount() {
    setTimeout(() => {
      requestAuthorization();
      startMonitoringLocation();
      startMonitoringHeading();
    }, 500);
  }

  render() {
    return (
      <Provider store={store}>
        <AppNavigator style={{flex: 1}}/>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('PuckHunt', () => PuckHunt);
