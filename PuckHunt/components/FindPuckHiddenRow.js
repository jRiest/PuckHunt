// @flow
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import {LIGHT_RED, GREEN} from '../style/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  whiteFill: {
    flex: 0,
    backgroundColor: '#fff',
    width: 30,
  },
  colorFill: {
    flex: 1,
    alignItems: 'flex-end',
  },
  textWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

class FindPuckHiddenRow extends Component {
  props: {
    status: 'unknown' | 'nearby' | 'found',
    onPress: () => void,
  };

  render() {
    const {status, onPress} = this.props;
    const isFound = status === 'found';
    const text = isFound ? 'Mark as\nNot Found' : 'Mark as Found';
    const backgroundColor = isFound ? LIGHT_RED : GREEN;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
      >
        <View style={styles.whiteFill}/>
        <View style={[styles.colorFill, {backgroundColor}]}>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default FindPuckHiddenRow;