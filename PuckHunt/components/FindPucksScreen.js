// @flow
import React, {Component} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {connect} from 'react-redux';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import _ from 'lodash';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ActivityIndicator,
} from 'react-native';

import FindPuckRow from './FindPuckRow';
import FindPuckHiddenRow from './FindPuckHiddenRow';
import {togglePuckIsFound} from '../redux/actions';
import {
  subscribeToLocationUpdates,
  subscribeToHeadingUpdates,
  getLatestLocation,
  getLatestHeading,
  subscribeToBeaconUpdates,
  getLatestBeaconData,
} from '../io/location';
import {
  BACKGROUND,
  RED,
  TEXT,
  GRAY_BORDER,
} from '../style/colors';

import type {
  PuckDataType,
  MapsRegionType,
} from '../io/types';

const MAX_DISTANCE_THRESHOLD = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: BACKGROUND,
  },
  noDataWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: 200,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  listView: {
    backgroundColor: '#fff',
  },
  rowSeparator: {
    height: 1,
    backgroundColor: GRAY_BORDER,
  },
  noData: {
    color: TEXT,
  },
  errorText: {
    color: RED,
  },
});

// From http://www.movable-type.co.uk/scripts/latlong.html
const R = 6371e3; // metres
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
function calculateDistance(lat1, lon1, lat2, lon2) {
  const p1 = lat1 * DEG_TO_RAD;
  const p2 = lat2 * DEG_TO_RAD;
  const dp = (lat2 - lat1) * DEG_TO_RAD;
  const dl = (lon2 - lon1) * DEG_TO_RAD;

  const a = (
    (Math.sin(dp / 2) * Math.sin(dp / 2)) +
    (Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2))
  );
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// https://github.com/googlemaps/android-maps-utils/blob/master/library/src/com/google/maps/android/SphericalUtil.java
function calculateHeading(lat1, lon1, lat2, lon2) {
  const fromLat = lat1 * DEG_TO_RAD;
  const fromLng = lon1 * DEG_TO_RAD;
  const toLat = lat2 * DEG_TO_RAD;
  const toLng = lon2 * DEG_TO_RAD;
  const dLng = toLng - fromLng;
  const heading = Math.atan2(
    Math.sin(dLng) * Math.cos(toLat),
    (Math.cos(fromLat) * Math.sin(toLat)) - (Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng)),
  );
  const headingDegrees = (heading * RAD_TO_DEG) % 360;
  return headingDegrees < 0 ? headingDegrees + 360 : headingDegrees;
}

function getDataSource(ds, props) {
  const {puckData, foundPucks} = props;
  const coords = getLatestLocation();
  const heading = getLatestHeading() || 90;

  const items = _.map(puckData || [], (puck, i) => {
    const {
      name,
      id,
      beaconUuid,
      lat: puckLat,
      lng: puckLng,
    } = puck;

    const isFound = foundPucks.indexOf(puck.id) > -1;
    let gpsDistance = null;
    let beaconDistance = null;
    let navigationIconRotation = null;

    if (!isFound && coords && puckLat && puckLng) {
      const {latitude: userLat, longitude: userLng} = coords;
      const distance = calculateDistance(userLat, userLng, puckLat, puckLng);

      if (distance < MAX_DISTANCE_THRESHOLD) {
        gpsDistance = distance;
        if (typeof heading === 'number') {
          const headingToPuck = calculateHeading(userLat, userLng, puckLat, puckLng);
          const headingDiff = headingToPuck - heading;
          navigationIconRotation = headingDiff < 0 ? headingDiff + 360 : headingDiff;
        }
      }
    }

    const status = isFound
      ? 'found'
      : gpsDistance
        ? 'nearby'
        : 'unknown';

    if (!isFound && beaconUuid && gpsDistance) {
      const beaconData = getLatestBeaconData(beaconUuid);
      if (beaconData && beaconData.accuracy >= 0) {
        beaconDistance = beaconData.accuracy;
      }
    }

    return {
      id,
      name,
      status,
      navigationIconRotation,
      beaconDistance,
      gpsDistance,
    };
  });
  return ds.cloneWithRows(items);
}

class FindPucksScreen extends Component {
  props: {
    puckDataStatus: 'not_loaded' | 'loading' | 'success' | 'error',
    puckData: ?Array<PuckDataType>,
    puckDataLoadingErrorMessage: ?string,
    foundPucks: Array<number>,
    togglePuckIsFound: (id: number) => void,
  };
  state: {
    dataSource: Object,
    region: MapsRegionType,
  };
  throttledUpdateLocation: () => void;
  unsubLocation: ?() => void;
  unsubHeading: ?() => void;
  rangingBeacons: Array<string>;
  beaconUnsubs: {
    [key: string]: Array<() => void>,
  };
  willUnmount: ?boolean;

  constructor(props) {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return !_.isEqual(r1, r2);
      },
    });

    this.throttledUpdateLocation = _.throttle(() => {
      const state = {
        dataSource: getDataSource(this.state.dataSource, this.props),
      };
      const currentLocation = getLatestLocation() || {};
      if (currentLocation) {
        if (
          currentLocation.latitude !== this.state.region.latitude ||
          currentLocation.longitudeDelta !== this.state.region.longitude
        ) {
          // $FlowIgnore
          state.region = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta,
          };
        }
      }
      this.setState(state);
    }, 300);

    const currentLocation = getLatestLocation() || {};
    this.state = {
      region: {
        latitude: currentLocation.latitude || 30.2563945,
        longitude: currentLocation.longitude || -97.7399974,
        latitudeDelta: 0.0008178497012636399,
        longitudeDelta: 0.0006598234176635742,
      },
      dataSource: getDataSource(ds, props),
    };

    this.unsubLocation = subscribeToLocationUpdates(this.throttledUpdateLocation);
    this.unsubHeading = subscribeToHeadingUpdates(this.throttledUpdateLocation);
    this.rangingBeacons = [];
    this.beaconUnsubs = Object.create(null);
    this.checkForBeaconUpdates(props);
  }

  componentWillReceiveProps(nextProps) {
    const isSame = (
      nextProps.puckData === this.props.puckData &&
      nextProps.foundPucks === this.props.foundPucks
    );
    if (!isSame) {
      this.checkForBeaconUpdates(nextProps);
      this.setState({
        dataSource: getDataSource(this.state.dataSource, nextProps),
      });
    }
  }

  componentWillUnmount() {
    this.willUnmount = true;
    if (this.unsubLocation) {
      this.unsubLocation();
    }
    if (this.unsubHeading) {
      this.unsubHeading();
    }
    _.forOwn(this.beaconUnsubs, unsub => unsub());
  }

  onRegionChange = (region: MapsRegionType) => {
    if (!_.isEqual(region, this.state.region)) {
      this.setState({region});
    }
  }

  checkForBeaconUpdates(props) {
    if (this.willUnmount) {
      return;
    }

    const {puckData, foundPucks} = props;
    const beaconsToRange = _.chain(puckData || [])
      .reject((puck) => {
        const {id, beaconUuid} = puck;
        return (foundPucks.indexOf(id) > -1 || !beaconUuid);
      })
      .map('beaconUuid')
      .value();

    const beaconsToStartMonitoring = _.difference(beaconsToRange, this.rangingBeacons);
    _.forEach(beaconsToStartMonitoring, (uuid) => {
      this.beaconUnsubs[uuid] = subscribeToBeaconUpdates(uuid, this.throttledUpdateLocation);
      this.rangingBeacons.push(uuid);
    });
    const beaconsToStopMonitoring = _.difference(this.rangingBeacons, beaconsToRange);
    _.forEach(beaconsToStopMonitoring, (uuid) => {
      this.beaconUnsubs[uuid]();
      _.pull(this.rangingBeacons, uuid);
    });
  }

  render() {
    const {
      puckDataStatus,
      puckDataLoadingErrorMessage,
      togglePuckIsFound,
    } = this.props;
    const {dataSource, region} = this.state;

    if (puckDataStatus === 'not_loaded') {
      return (
        <View style={styles.noDataWrapper}>
          <Text style={styles.noData}>Data has not loaded</Text>
        </View>
      );
    } else if (puckDataStatus === 'loading') {
      return (
        <View style={styles.noDataWrapper}>
          <ActivityIndicator size='large'/>
        </View>
      );
    } else if (puckDataStatus === 'error') {
      return (
        <View style={styles.noDataWrapper}>
          <Text style={styles.errorText}>{puckDataLoadingErrorMessage}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            region={region}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            followsUserLocation={true}
            showsCompass={true}
            pitchEnabled={false}
            showsTraffic={false}
            scrollEnabled={false}
            rotateEnabled={false}
            mapType='hybrid'
            onRegionChange={this.onRegionChange}
            style={styles.mapView}
          />
        </View>
        <SwipeListView
          style={styles.listView}
          dataSource={dataSource}
          renderRow={(data, secId, rowId, rowMap) => (
            <SwipeRow
              disableRightSwipe={true}
              rightOpenValue={-100}
            >
              <FindPuckHiddenRow
                {...data}
                onPress={() => {
                  rowMap[`${secId}${rowId}`].closeRow();
                  togglePuckIsFound(data.id);
                }}
              />
              <FindPuckRow {...data}/>
            </SwipeRow>
          )}
          renderSeparator={(sectionID: number, rowID: number) => {
            const rowCount = dataSource.getRowCount();
            if (rowCount <= 0) {
              return null;
            }
            const lastRowId = dataSource.getRowIDForFlatIndex(rowCount - 1);
            if (lastRowId === rowID) {
              return null;
            }
            return (
              <View
                key={`${sectionID}-${rowID}`}
                style={styles.rowSeparator}
              />
            );
          }}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    puckDataStatus: state.puckDataStatus,
    puckData: state.puckData,
    puckDataLoadingErrorMessage: state.puckDataLoadingErrorMessage,
    foundPucks: state.foundPucks,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    togglePuckIsFound: id => dispatch(togglePuckIsFound(id)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FindPucksScreen);