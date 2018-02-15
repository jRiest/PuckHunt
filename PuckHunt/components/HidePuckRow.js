// @flow
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import PuckIcon from './PuckIcon';
import RowDetailIcon from './RowDetailIcon';
import {
  TEXT,
  GRAY_BORDER,
} from '../style/colors';

const styles = StyleSheet.create({
  highlight: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
    padding: 10,
    height: 100,
    alignItems: 'center',
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
});

class HidePuckRow extends Component {
  props: {
    name: string,
    lat?: ?number,
    lng?: ?number,
    onPress: () => void,
  };

  render() {
    const {
      name,
      lat,
      lng,
      onPress,
    } = this.props;

    const isPlaced = !!(lat && lng);
    const puckIconType = isPlaced ? 'complete' : 'unknown';
    const statusText = isPlaced ? 'placed' : 'not yet placed';

    return (
      <TouchableHighlight
        style={styles.highlight}
        onPress={onPress}
        key='find'
        underlayColor={GRAY_BORDER}
      >
        <View style={styles.wrapper}>
          <View style={styles.puckIconWrapper}>
            <PuckIcon type={puckIconType}/>
          </View>
          <View style={styles.nameWrapper}>
            <Text style={styles.upperText}>{name}</Text>
            <Text style={styles.lowerText}>Status: {statusText}</Text>
          </View>
          <RowDetailIcon/>
        </View>
      </TouchableHighlight>
    );
  }
}

export default HidePuckRow;