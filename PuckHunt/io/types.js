// @flow

export type PuckDataType = {|
  id: number,
  name: string,
  estimoteId: string,
  beaconUuid: string,
  beaconMajorVal: number,
  beaconMinorVal: number,
  lat?: ?number,
  lng?: ?number,
|};

export type LocationCoordsType = {|
  accuracy: number,
  altitude: number,
  altitudeAccuracy: number,
  course: number,
  latitude: number,
  longitude: number,
  speed: number,
|};

export type LocationDataType = {|
  coords: LocationCoordsType,
  timestamp: number,
|};

export type HeadingDataType = {|
  heading: number,
|};

export type MapsRegionType = {|
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
|};

export type BeaconUpdateType = {|
  uuid: string,
  major: number,
  minor: number,
  rssi: number,
  proximity: string,
  accuracy: number,
|};

export type BeaconRegionDataType = {|
  region: {
    identifier: string,
    uuid: string,
  },
  beacons: Array<BeaconUpdateType>,
|};