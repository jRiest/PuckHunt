// @flow
import _ from 'lodash';
import {
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';

import type {
  LocationCoordsType,
  LocationDataType,
  HeadingDataType,
  BeaconUpdateType,
  BeaconRegionDataType,
} from './types';

const {PHLocationManager} = NativeModules;

const locationCallbacks = [];
const headingCallbacks = [];
const beaconCallbacks = [];
let latestCoords;
let latestHeading;

export const requestAuthorization = _.once(() => {
  PHLocationManager.requestWhenInUseAuthorization();
});

export const startMonitoringLocation = _.once(() => {
  requestAuthorization();
  PHLocationManager.startUpdatingLocation();
  DeviceEventEmitter.addListener('locationUpdated', (data: LocationDataType) => {
    const {coords, timestamp} = data;
    // If the data is cached from more than 15s ago, ignore it as per
    // https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/LocationAwarenessPG/CoreLocation/CoreLocation.html
    if (timestamp < Date.now() - (15 * 1000)) {
      return;
    }

    latestCoords = coords;
    _.forEach(locationCallbacks, ({cb}) => {
      cb(coords);
    });
  });
});

// Returns unsubscribe function
export function subscribeToLocationUpdates(cb: (data: LocationCoordsType) => void): () => void {
  startMonitoringLocation();

  const cbObj = {cb};
  locationCallbacks.push(cbObj);

  return _.once(() => {
    _.pull(locationCallbacks, cbObj);
  });
}

export function getLatestLocation(): ?LocationCoordsType {
  return latestCoords;
}

export const startMonitoringHeading = _.once(() => {
  requestAuthorization();
  PHLocationManager.startUpdatingHeading();
  DeviceEventEmitter.addListener('headingUpdated', (data: HeadingDataType) => {
    const {heading} = data;
    latestHeading = heading;
    _.forEach(headingCallbacks, ({cb}) => {
      cb(heading);
    });
  });
});

// Returns unsubscribe function
export function subscribeToHeadingUpdates(cb: (data: number) => void): () => void {
  startMonitoringHeading();

  const cbObj = {cb};
  headingCallbacks.push(cbObj);

  return _.once(() => {
    _.pull(headingCallbacks, cbObj);
  });
}

export function getLatestHeading(): ?number {
  return latestHeading;
}

const beaconRangeCounter = Object.create(null);
const latestBeaconData = Object.create(null);

DeviceEventEmitter.addListener('beaconsDidRange', (data: BeaconRegionDataType) => {
  const {beacons} = data;
  _.forEach(beacons, (beacon) => {
    const {uuid} = beacon;
    latestBeaconData[uuid] = beacon;
    _.chain(beaconCallbacks)
      .filter({uuid})
      .forEach(({cb}) => {
        cb(beacon);
      })
      .commit();
  });
});

export function subscribeToBeaconUpdates(uuid: string, cb: (data: BeaconUpdateType) => void) {
  beaconRangeCounter[uuid] = (beaconRangeCounter[uuid] || 0) + 1;
  if (beaconRangeCounter[uuid] === 1) {
    requestAuthorization();
    // console.log(`startRanging ${uuid}`);
    PHLocationManager.startRangingBeaconsInRegion({
      identifier: uuid,
      uuid,
    });
  }

  const cbObj = {cb, uuid};
  headingCallbacks.push(cbObj);

  return _.once(() => {
    _.pull(headingCallbacks, cbObj);
    beaconRangeCounter[uuid] -= 1;
    if (beaconRangeCounter[uuid] === 0) {
      // console.log(`stopRanging ${uuid}`);
      PHLocationManager.stopRangingBeaconsInRegion({
        identifier: uuid,
        uuid,
      });
    }
  });
}

export function getLatestBeaconData(uuid: string): ?BeaconUpdateType {
  return latestBeaconData[uuid];
}