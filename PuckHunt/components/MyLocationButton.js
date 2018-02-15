// @flow
import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  TouchableHighlight,
} from 'react-native';

import myLocationImage from '../images/my_location.png';
import {GRAY_BORDER} from '../style/colors';
import {getLatestLocation} from '../io/location';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myLocationImage: {
  },

});

class MyLocationButton extends Component {
  props: {
    onPress: (data: {latitude: number, longitude: number}) => void,
  };

  onPress = () => {
    const coords = getLatestLocation();
    if (coords) {
      const {latitude, longitude} = coords;
      this.props.onPress({latitude, longitude});
    }
  }

  render() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor={GRAY_BORDER}
        activeOpacity={0.7}
        onPress={this.onPress}
      >
        <Image source={myLocationImage}/>
      </TouchableHighlight>
    );
  }
}

export default MyLocationButton;