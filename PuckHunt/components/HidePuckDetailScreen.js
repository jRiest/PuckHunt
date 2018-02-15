// @flow
import React, {Component} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {connect} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  AlertIOS,
  ActivityIndicator,
} from 'react-native';

import mapMarkerImage from '../images/map_marker.png';
import {fetchPuckData} from '../redux/actions';
import clearPuckLocation from '../io/clearPuckLocation';
import setPuckLocation from '../io/setPuckLocation';
import {getLatestLocation} from '../io/location';
import MyLocationButton from './MyLocationButton';
import {
  BACKGROUND,
  RED,
  BLUE,
  GRAY_BORDER,
} from '../style/colors';

import type {MapsRegionType} from '../io/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  loadingContainer: {
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
  markerWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  markerImage: {
    bottom: 18,
    width: 24,
    height: 33,
  },
  actionBar: {
    backgroundColor: BACKGROUND,
    padding: 10,
    borderTopWidth: 1,
    borderColor: GRAY_BORDER,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: GRAY_BORDER,
  },
  clearLocationButton: {
    marginRight: 10,
  },
  saveLocationButton: {
  },
  clearLocationText: {
    color: RED,
  },
  saveLocationText: {
    color: BLUE,
  },
});

type PropsType = {
  id: number,
  name: string,
  lat?: ?number,
  lng?: ?number,
  navigator: Object,
  fetchPuckData: () => void,
};

class HidePuckDetailScreen extends Component {
  props: PropsType;
  state: {
    region: MapsRegionType,
    loading: boolean,
  };
  mapView: Object;

  constructor(props: PropsType) {
    super();

    const currentLocation = getLatestLocation() || {};
    this.state = {
      region: {
        latitude: props.lat || currentLocation.latitude || 30.2563945,
        longitude: props.lng || currentLocation.longitude || -97.7399974,
        latitudeDelta: 0.0008178497012636399,
        longitudeDelta: 0.0006598234176635742,
      },
      loading: false,
    };
  }

  onRegionChange = (region: MapsRegionType) => {
    this.setState({region});
  }

  onClickSave = () => {
    const {name} = this.props;
    AlertIOS.alert(
      `Confirm new puck location for ${name}`,
      `Are you sure you want to change the location for ${name}? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: this.onSave,
          style: 'default',
        },
      ],
    );
  }

  onClickClear = () => {
    const {name} = this.props;
    AlertIOS.alert(
      `Confirm clear location for ${name}`,
      `Are you sure you want to clear the location for ${name}? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: this.onClear,
          style: 'destructive',
        },
      ],
    );
  }

  onSave = async () => {
    const {id} = this.props;
    const {latitude, longitude} = this.state.region;
    try {
      this.setState({loading: true});
      await setPuckLocation({
        id,
        lat: latitude,
        lng: longitude,
      });
    } catch (e) {
      this.setState({loading: false});
      AlertIOS.alert('Error saving location', e.message);
      return;
    }
    this.setState({loading: false});
    this.props.fetchPuckData();
    this.props.navigator.pop();
  }

  onClear = async () => {
    const {id} = this.props;
    try {
      this.setState({loading: true});
      await clearPuckLocation(id);
    } catch (e) {
      this.setState({loading: false});
      AlertIOS.alert('Error clear location', e.message);
      return;
    }
    this.setState({loading: false});
    this.props.fetchPuckData();
    this.props.navigator.pop();
  }

  onMoveToCurrentLocation = ({latitude, longitude}) => {
    this.mapView.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0008178497012636399,
      longitudeDelta: 0.0006598234176635742,
    }, 500);
  }

  render() {
    const {region, loading} = this.state;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large'/>
        </View>
      );
    }

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
          />
          <View pointerEvents='none' style={styles.markerWrapper}>
            <Image
              pointerEvents='none'
              source={mapMarkerImage}
              style={styles.markerImage}
            />
          </View>
          <MyLocationButton onPress={this.onMoveToCurrentLocation}/>
        </View>
        <View style={styles.actionBar}>
          <TouchableHighlight
            style={[styles.button, styles.clearLocationButton]}
            underlayColor={GRAY_BORDER}
            onPress={this.onClickClear}
          >
            <Text style={styles.clearLocationText}>Clear current location</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, styles.saveLocationButton]}
            underlayColor={GRAY_BORDER}
            onPress={this.onClickSave}
          >
            <Text style={styles.saveLocationText}>Save new location</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPuckData: () => dispatch(fetchPuckData()),
  };
}

export default connect(
  undefined,
  mapDispatchToProps,
)(HidePuckDetailScreen);