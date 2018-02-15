// @flow
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  GREEN,
  BLUE,
  DARK_GRAY,
} from '../style/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  puck: {
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unknownPuck: {
    backgroundColor: DARK_GRAY,
  },
  unknownIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '300',
  },
  completePuck: {
    backgroundColor: GREEN,
  },
  completeIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
  },
  navigationPuck: {
    backgroundColor: BLUE,
  },
  navigationIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
  },

});

class PuckIcon extends Component {
  props: {
    type: 'unknown' | 'complete' | 'navigation',
    navigationIconRotation?: ?number,
  };

  render() {
    const {type, navigationIconRotation} = this.props;

    let innerContent = null;

    if (type === 'unknown') {
      innerContent = <Text style={styles.unknownIcon}>?</Text>;
    } else if (type === 'complete') {
      innerContent = <Text style={styles.completeIcon}>✓</Text>;
    } else if (type === 'navigation') {
      let rotation = (navigationIconRotation || 0) - 90;
      if (rotation <= -360 || rotation >= 360) {
        rotation %= 360;
      }
      if (rotation < 0) {
        rotation += 360;
      }
      const transform = [
        {rotate: `${rotation}deg`},
      ];
      innerContent = <Text style={[styles.navigationIcon, {transform}]}>→</Text>;
    }

    return (
      <View style={styles.container}>
        <View style={[styles.puck, styles[`${type}Puck`]]}>
          {innerContent}
        </View>
      </View>
    );
  }
}

export default PuckIcon;