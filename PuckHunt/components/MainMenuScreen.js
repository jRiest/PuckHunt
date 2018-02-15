// @flow
/* eslint-disable react/no-multi-comp */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
} from 'react-native';

import RowDetailIcon from './RowDetailIcon';
import * as routes from '../constants/routes';
import {
  BACKGROUND,
  TEXT,
  GRAY_BORDER,
} from '../style/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND,
    flex: 1,
    paddingTop: 64,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: GRAY_BORDER,
    padding: 20,
  },
  menuItemTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 14,
    flex: 1,
    color: TEXT,
  },
  carat: {
    flex: 0,
    fontSize: 24,
    color: TEXT,
  },
});

class MenuItem extends Component {
  props: {
    text: string,
    onPress: () => void,
  };

  render() {
    const {onPress, text} = this.props;

    return (
      <TouchableHighlight
        style={styles.menuItem}
        onPress={onPress}
        key='find'
        underlayColor={GRAY_BORDER}
      >
        <View style={styles.menuItemTextWrapper}>
          <Text style={styles.menuItemText}>{text}</Text>
          <RowDetailIcon/>
        </View>
      </TouchableHighlight>
    );
  }
}

class MainMenuScreen extends Component {
  props: {
    role: ?string,
    navigator: Object,
  };

  onPressFindPucks = () => {
    this.props.navigator.push(routes.FIND_PUCKS_SCREEN);
  };

  onPressHidePucks = () => {
    this.props.navigator.push(routes.HIDE_PUCKS_SCREEN);
  };

  onPressOverview = () => {
    this.props.navigator.push(routes.OVERVIEW_SCREEN);
  };

  render() {
    const {role} = this.props;
    const items = [
      <MenuItem
        onPress={this.onPressFindPucks}
        text='Find the pucks'
        key='find'
      />,
    ];
    if (role === 'admin' || role === 'hider') {
      items.unshift(
        <MenuItem
          onPress={this.onPressHidePucks}
          text='Hide the pucks'
          key='hide'
        />,
      );
    }
    if (role === 'admin') {
      items.unshift(
        <MenuItem
          onPress={this.onPressOverview}
          text='Overview'
          key='overview'
        />,
      );
    }
    return (
      <View style={styles.container}>
        {items}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    role: state.role,
  };
}

export default connect(
  mapStateToProps,
)(MainMenuScreen);