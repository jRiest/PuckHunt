// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {submitPassword} from '../redux/actions';
import {
  BACKGROUND,
  GRAY_BORDER,
  TEXT,
  RED,
} from '../style/colors';

const BOX_MARGIN_HORIZONTAL = 10;
const BOX_PADDING_HORIZONTAL = 20;
const PASSWORD_HORIZONTAL_PADDING = 12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderColor: GRAY_BORDER,
    borderWidth: 0.5,
    marginHorizontal: BOX_MARGIN_HORIZONTAL,
    padding: 20,
  },
  label: {
    color: TEXT,
  },
  passwordField: {
    color: TEXT,
    height: 60,
    borderWidth: 0.5,
    borderColor: TEXT,
    paddingVertical: 4,
    paddingHorizontal: PASSWORD_HORIZONTAL_PADDING,
    marginTop: 10,
  },
  invalidPassword: {
    height: 30,
    color: RED,
    marginLeft: BOX_MARGIN_HORIZONTAL + BOX_PADDING_HORIZONTAL + PASSWORD_HORIZONTAL_PADDING,
    marginTop: 12,
  },
});

class LoginScreen extends Component {
  props: {
    invalidPassword: boolean,
    submitPassword: (password: string) => void,
  };

  onSubmitPassword = (event: Object) => {
    const password = event.nativeEvent.text;
    this.props.submitPassword(password);
  }

  render() {
    const {invalidPassword} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.label}>Enter the password to get started</Text>
          <TextInput
            onSubmitEditing={this.onSubmitPassword}
            enablesReturnKeyAutomatically={true}
            autoCorrect={false}
            autoCapitalize='none'
            selectTextOnFocus={true}
            returnKeyType='go'
            placeholder='password'
            placeholderTextColor='#aaa'
            style={styles.passwordField}
          />
        </View>
        <Text style={styles.invalidPassword}>
          {invalidPassword ? 'Invalid password' : ''}
        </Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    invalidPassword: state.invalidPassword,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitPassword: v => dispatch(submitPassword(v)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);