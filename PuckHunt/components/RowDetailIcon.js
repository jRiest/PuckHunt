// @flow
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {TEXT} from '../style/colors';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 0,
    fontSize: 24,
    color: TEXT,
  },
});

class RowDetailIcon extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>›</Text>
      </View>
    );
  }
}

export default RowDetailIcon;