// @flow
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PuckIcon from './PuckIcon';
import {TEXT} from '../style/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    height: 100,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingRight: 20,
  },
  puckIconWrapper: {
    marginRight: 12,
    flex: 0,
  },
  nameWrapper: {
    flex: 1,
    marginRight: 30,
  },
  upperText: {
    color: TEXT,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  lowerText: {
    color: TEXT,
    fontWeight: '100',
  },
  details: {
    flex: 0,
    flexDirection: 'row',
  },
  gpsDistance: {
    marginRight: 30,
    width: 60,
    alignItems: 'center',
  },
  beaconDistance: {
    width: 60,
    alignItems: 'center',
  },
});

function getDistanceText(distance) {
  let distanceText;
  if (typeof distance === 'number') {
    distanceText = (distance).toFixed(1);
    while (distanceText.length < 4) {
      distanceText = `0${distanceText}`;
    }
    distanceText = `${distanceText}m`;
  } else {
    distanceText = '-';
  }
  return distanceText;
}

class FindPuckRow extends Component {
  props: {
    name: string,
    status: 'unknown' | 'nearby' | 'found',
    navigationIconRotation: ?number,
    beaconDistance: ?number,
    gpsDistance: ?number,
  };

  render() {
    const {
      name,
      status,
      navigationIconRotation,
      beaconDistance,
      gpsDistance,
    } = this.props;

    let puckIconType;
    if (status === 'unknown') {
      puckIconType = 'unknown';
    } else if (status === 'nearby') {
      puckIconType = 'navigation';
    } else if (status === 'found') {
      puckIconType = 'complete';
    }

    let details;
    if (status === 'nearby') {
      details = (
        <View style={styles.details}>
          <View style={styles.gpsDistance}>
            <Text style={styles.upperText}>{getDistanceText(gpsDistance)}</Text>
            <Text style={styles.lowerText}>GPS</Text>
          </View>
          <View style={styles.beaconDistance}>
            <Text style={styles.upperText}>{getDistanceText(beaconDistance)}</Text>
            <Text style={styles.lowerText}>Beacon</Text>
          </View>
        </View>
      );
    } else {
      details = <View style={styles.details}/>;
    }

    return (
      <View style={styles.container}>
        <View style={styles.puckIconWrapper}>
          <PuckIcon type={puckIconType} navigationIconRotation={navigationIconRotation}/>
        </View>
        <View style={styles.nameWrapper}>
          <Text style={styles.upperText}>{name}</Text>
          <Text style={styles.lowerText}>Status: {status}</Text>
        </View>
        {details}
      </View>
    );
  }
}

export default FindPuckRow;