// @flow
import React, {Component} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import mapMarkerImage from '../images/map_marker.png';
import {getLatestLocation} from '../io/location';
import MyLocationButton from './MyLocationButton';
import {
  RED,
  TEXT,
} from '../style/colors';

import type {
  MapsRegionType,
  PuckDataType,
} from '../io/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noDataWrapper: {
    flex: 1,
    paddingTop: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  noData: {
    color: TEXT,
  },
  errorText: {
    color: RED,
  },
});

class OverviewScreen extends Component {
  props: {
    puckDataStatus: 'not_loaded' | 'loading' | 'success' | 'error',
    puckData: ?Array<PuckDataType>,
    puckDataLoadingErrorMessage: ?string,
  };
  state: {
    region: MapsRegionType,
  };
  mapView: Object;

  constructor() {
    super();
    const currentLocation = getLatestLocation() || {};
    this.state = {
      region: {
        latitude: currentLocation.latitude || 30.2563945,
        longitude: currentLocation.longitude || -97.7399974,
        latitudeDelta: 0.0008178497012636399,
        longitudeDelta: 0.0006598234176635742,
      },
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.fitToMarkers();
    }, 100);
  }

  onRegionChange = (region: MapsRegionType) => {
    this.setState({region});
  }

  onMoveToCurrentLocation = ({latitude, longitude}) => {
    this.mapView.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0008178497012636399,
      longitudeDelta: 0.0006598234176635742,
    }, 500);
  }

  fitToMarkers() {
    if (this.mapView) {
      this.mapView.fitToElements(false);
    }
  }

  render() {
    const {
      puckData,
      puckDataStatus,
      puckDataLoadingErrorMessage,
    } = this.props;
    const {region} = this.state;

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

    const markers = (puckData || [])
      .filter(({lat, lng}) => lat && lng)
      .map(({lat, lng, name, id}) => (
        <MapView.Marker
          coordinate={{latitude: lat, longitude: lng}}
          title={name}
          image={mapMarkerImage}
          key={id}
        />
      ));

    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            region={region}
            provider={PROVIDER_GOOGLE}
            onRegionChange={this.onRegionChange}
            showsUserLocation={true}
            showsCompass={true}
            pitchEnabled={false}
            showsTraffic={false}
            mapType='hybrid'
            style={styles.mapView}
            ref={v => this.mapView = v}
          >
            {markers}
          </MapView>
          <MyLocationButton onPress={this.onMoveToCurrentLocation}/>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    puckDataStatus: state.puckDataStatus,
    puckData: state.puckData,
    puckDataLoadingErrorMessage: state.puckDataLoadingErrorMessage,
  };
}


export default connect(
  mapStateToProps,
)(OverviewScreen);