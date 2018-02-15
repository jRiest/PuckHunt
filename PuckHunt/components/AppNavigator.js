// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Navigator,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';

import * as routes from '../constants/routes';
import LoginScreen from './LoginScreen';
import MainMenuScreen from './MainMenuScreen';
import FindPucksScreen from './FindPucksScreen';
import HidePucksScreen from './HidePucksScreen';
import HidePuckDetailScreen from './HidePuckDetailScreen';
import OverviewScreen from './OverviewScreen';
import {fetchPuckData} from '../redux/actions';
import {TEAL} from '../style/colors';

const routeMap = {
  [routes.LOGIN_SCREEN]: {
    Component: LoginScreen,
    title: 'Puck Hunt',
  },
  [routes.MAIN_MENU_SCREEN]: {
    Component: MainMenuScreen,
    title: 'Puck Hunt',
  },
  [routes.FIND_PUCKS_SCREEN]: {
    Component: FindPucksScreen,
    title: 'Puck Hunt',
  },
  [routes.HIDE_PUCKS_SCREEN]: {
    Component: HidePucksScreen,
    title: 'Hide the pucks',
  },
  [routes.HIDE_PUCK_DETAIL_SCREEN]: {
    Component: HidePuckDetailScreen,
  },
  [routes.OVERVIEW_SCREEN]: {
    Component: OverviewScreen,
    title: 'Overview',
  },
};

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: TEAL,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 10,
  },
  backWrapper: {
    flexDirection: 'row',
    height: 44,
    paddingBottom: 6,
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 42,
    fontWeight: '300',
    color: '#fff',
    paddingLeft: 6,
    top: -2.5,
    paddingRight: 4,
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    paddingRight: 15,
  },
});

class AppNavigator extends Component {
  props: {
    role: ?string,
    puckDataStatus: 'not_loaded' | 'loading' | 'success' | 'error',
    fetchPuckData: () => void,
  };
  navigator: Object;

  componentWillMount() {
    if (this.props.puckDataStatus === 'not_loaded') {
      this.props.fetchPuckData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.navigator) {
      return;
    }

    if (nextProps.role && !this.props.role) {
      if (nextProps.role === 'finder') {
        this.navigator.immediatelyResetRouteStack([routeMap[routes.FIND_PUCKS_SCREEN]]);
      } else {
        this.navigator.immediatelyResetRouteStack([routeMap[routes.MAIN_MENU_SCREEN]]);
      }
    } else if (!nextProps.role && this.props.role) {
      this.navigator.immediatelyResetRouteStack([routeMap[routes.LOGIN_SCREEN]]);
    }
  }


  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle='light-content'/>
        <Navigator
          initialRoute={{
            ...routeMap[routes.LOGIN_SCREEN],
            index: 0,
          }}
          ref={n => this.navigator = n}
          renderScene={(route, navigator) => {
            const {Component} = route;
            if (Component) {
              return (
                <Component
                  navigator={{
                    push: (routeName, overrides) => {
                      navigator.push({
                        ...routeMap[routeName],
                        ...overrides,
                      });
                    },
                    pop: () => {
                      navigator.pop();
                    },
                  }}
                  {...(route.props || {})}
                />
              );
            } else {
              return <Text>Unknown route {String(route.component)}</Text>;
            }
          }}
          navigationBar={
            <Navigator.NavigationBar
              routeMapper={{
                LeftButton: (route, navigator, index, navState) => {
                  if (index > 0) {
                    return (
                      <TouchableOpacity
                        onPress={() => navigator.pop()}
                      >
                        <View style={styles.backWrapper}>
                          <Text style={styles.backIcon}>‹</Text>
                          <Text style={styles.backText}>Back</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                },
                RightButton: (route, navigator, index, navState) => null,
                Title: (route, navigator, index, navState) => {
                  const {title} = route;
                  return (<Text style={styles.title}>{title || ''}</Text>);
                },
              }}
              style={styles.navBar}
            />
          }
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    role: state.role,
    puckDataStatus: state.puckDataStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPuckData: () => dispatch(fetchPuckData()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppNavigator);