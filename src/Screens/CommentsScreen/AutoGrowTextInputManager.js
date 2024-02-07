import React, {Component} from 'react';
import ReactNative, {TextInput, Platform, NativeModules} from 'react-native';
import PropTypes from 'prop-types';
import {color} from '../../Theme/theme';

const ANDROID_PLATFORM = Platform.OS === 'android';

const AutoGrowTextInputManager = NativeModules.AutoGrowTextInputManager;

export default class AutoGrowingTextInput extends Component {
  constructor(props) {
    super(props);
    this.setNativeProps = this.setNativeProps.bind(this);
    this.state = {
      height: 25,
    };
  }

  componentDidMount() {
    if (this.shouldApplyNativeSettings()) {
      const reactTag = this.textInputReactTag();
      if (reactTag) {
        AutoGrowTextInputManager.applySettingsForInput(reactTag, {
          enableScrollToCaret: this.props.enableScrollToCaret,
          maxHeight: this.props.maxHeight,
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.shouldApplyNativeSettings()) {
      const reactTag = this.textInputReactTag();
      if (reactTag) {
        AutoGrowTextInputManager.performCleanupForInput(reactTag);
      }
    }
  }

  shouldApplyNativeSettings() {
    return (
      AutoGrowTextInputManager &&
      (ANDROID_PLATFORM || this.props.enableScrollToCaret)
    );
  }

  textInputReactTag() {
    if (this._textInput) {
      return ReactNative.findNodeHandle(this._textInput);
    }
  }

  render() {
    const {state} = this.props;
    return (
      <TextInput
        numberOfLines={state?.numberOfLines}
        maxLength={250}
        multiline={true}
        {...this.props}
        {...this.style}
        style={[
          this.props.style,
          {
            height: 'auto',
            textAlignVertical: 'center',
            color: color.BLACK,
            ...Platform.select({
              ios: {lineHeight: 20, paddingBottom: 2, paddingTop: 13},
            }),
          },
        ]}
        ref={r => {
          this._textInput = r;
        }}
      />
    );
  }

  setNativeProps(nativeProps = {}) {
    this._textInput.setNativeProps(nativeProps);
  }

  resetHeightToMin() {
    this.setNativeProps({text: ''});
  }

  clear() {
    if (ANDROID_PLATFORM) {
      AutoGrowTextInputManager.resetKeyboardInput(
        ReactNative.findNodeHandle(this._textInput),
      );
    }
    return this._textInput.clear();
  }

  focus() {
    return this._textInput.focus();
  }

  blur() {
    this._textInput.blur();
  }

  isFocused() {
    return this._textInput.isFocused();
  }

  getRef() {
    return this._textInput;
  }
}

AutoGrowingTextInput.propTypes = {
  ...TextInput.propTypes,
  enableScrollToCaret: PropTypes.bool,
};
AutoGrowingTextInput.defaultProps = {
  ...TextInput.defaultProps,
  enableScrollToCaret: false,
};
