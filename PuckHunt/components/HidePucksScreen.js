// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ActivityIndicator,
} from 'react-native';

import HidePuckRow from './HidePuckRow';
import {HIDE_PUCK_DETAIL_SCREEN} from '../constants/routes';
import {
  BACKGROUND,
  RED,
  TEXT,
  GRAY_BORDER,
} from '../style/colors';

import type {PuckDataType} from '../io/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: BACKGROUND,
  },
  noDataWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listView: {
    backgroundColor: BACKGROUND,
  },
  rowSeparator: {
    height: 1,
    backgroundColor: GRAY_BORDER,
  },
  noData: {
    color: TEXT,
  },
  errorText: {
    color: RED,
  },
});

function getDataSource(ds, props) {
  const {puckData} = props;
  return ds.cloneWithRows(puckData || []);
}

class FindPucksScreen extends Component {
  props: {
    puckDataStatus: 'not_loaded' | 'loading' | 'success' | 'error',
    puckData: ?Array<PuckDataType>,
    puckDataLoadingErrorMessage: ?string,
    navigator: Object,
  };
  state: {
    dataSource: Object,
  };

  constructor(props) {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return !_.isEqual(r1, r2);
      },
    });

    this.state = {
      dataSource: getDataSource(ds, props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.puckData !== this.props.puckData) {
      this.setState({
        dataSource: getDataSource(this.state.dataSource, nextProps),
      });
    }
  }

  render() {
    const {
      puckDataStatus,
      puckDataLoadingErrorMessage,
    } = this.props;
    const {dataSource} = this.state;

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

    return (
      <View style={styles.container}>
        <ListView
          style={styles.listView}
          dataSource={dataSource}
          renderRow={(data, secId, rowId, rowMap) => (
            <HidePuckRow
              {...data}
              onPress={() => this.props.navigator.push(HIDE_PUCK_DETAIL_SCREEN, {
                title: data.name,
                props: data,
              })}
            />
          )}
          renderSeparator={(sectionID: number, rowID: number) => (
            <View
              key={`${sectionID}-${rowID}`}
              style={styles.rowSeparator}
            />
          )}
        />
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
)(FindPucksScreen);