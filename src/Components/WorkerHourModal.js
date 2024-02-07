import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import * as theme from '../Theme/theme';
import PlainText from './PlainText';
import InputText from './InputText';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from '../Components/RadioButton/SimpleRadioButton';
import Button from './Button';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {FULL_TIME_HOUR} from '../Helper/Storage';
import {strings} from '../Helper/i18n';

export default class WorkerHourModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      types1: [
        {label: 'Yes', value: 0},
        {label: strings('no'), value: 1},
      ],
      value1: -1,
      value1Index: -1,
      hours: '',
      isShowErr: false,
      message: '',
    };
  }

  open() {
    this.setState({
      modalVisible: true,
    });
  }

  close() {
    this.setState({
      modalVisible: false,
    });
  }

  getValueOfWorker = () => {
    if (this.state.hours <= 0) {
      this.setState({
        message: 'Enter a valid Hour',
        isShowErr: true,
      });
      return;
    }
    if (this.state.hours >= 30) {
      this.setState({
        message: `Hours should be less than 30`,
        isShowErr: true,
      });
      return;
    }
    if (this.state.hours == '' || isNaN(this.state.hours)) {
      this.setState({
        isShowErr: true,
      });
      return;
    }
    this.props.saveButtonPress(this.state.value1, this.state.hours);
    this.setState({
      hours: '',
      isShowErr: false,
      message: '',
    });
  };

  onWorkerHourChange = text => {
    this.setState({
      hours: text,
      isShowErr: false,
      message: '',
    });
  };

  render() {
    const {isVisible, showErr, negativeBtnPress} = this.props;
    return (
      <Modal
        onBackdropPress={negativeBtnPress}
        testID={'modal'}
        avoidKeyboard
        isVisible={isVisible}>
        {/* <KeyboardAvoidingView
          behavior={'padding'}
          enabled
          keyboardVerticalOffset={theme.normalize(55)}> */}
        <View style={styles.content}>
          <PlainText
            themeColor={theme.color.BLACK}
            textAlign="center"
            fontFamily={theme.Fonts.semiBold}
            fontWeight={theme.weight.FONT_WEIGHT_SEMIBOLD}
            fontSize={theme.sizes.FONT_SIZE_HLARGE}>
            Clear Vue
          </PlainText>
          <View style={{height: theme.normalize(8)}} />
          <PlainText
            themeColor={theme.color.BLACK}
            lineHeight={theme.sizes.FONT_SIZE_XLARGE}
            fontSize={theme.sizes.FONT_SIZE_LARGE}
            textAlign="center">
            {strings('fulltimeWorker')}
          </PlainText>
          <View style={{alignSelf: 'center', marginTop: 20}}>
            <RadioForm
              initial={-1}
              buttonColor={theme.color.DARK_BLUE}
              selectedButtonColor={theme.color.DARK_BLUE}
              buttonSize={12}
              formHorizontal={true}
              radio_props={this.state.types1}
              labelStyle={{
                fontFamily: theme.Fonts.semiBold,
                fontWeight: theme.weight.FONT_WEIGHT_SEMIBOLD,
                color: theme.color.BLACK,
              }}
              onPress={(value, index) => {
                this.setState(
                  {
                    value1: value,
                    value1Index: index,
                    hours: value == 0 ? FULL_TIME_HOUR : '',
                    isShowErr: false,
                  },
                  () => {
                    this.props.getWorkerDetail &&
                      this.props.getWorkerDetail(
                        value,
                        this.state.hours,
                        false,
                      );
                  },
                );
              }}
            />
          </View>
          {this.state.value1 == 1 && (
            <>
              <InputText
                keyboardType={'decimal-pad'}
                returnKeyType={'done'}
                borderBottomColor={'black'}
                placeholder={strings('enterYourHours')}
                inputTextStyle={{color: 'black'}}
                placeholderTextColor={'black'}
                value={this.state.hours}
                onChangeText={this.onWorkerHourChange}
                onSubmitEditing={() => this.getValueOfWorker()}
                isError={this.state.isShowErr}
                error={
                  this.state.message
                    ? this.state.message
                    : strings('enterWorkingHour')
                }
              />
              <TouchableOpacity onPress={() => this.getValueOfWorker()}>
                <PlainText
                  themeColor={theme.color.BLUE_4}
                  fontFamily={theme.Fonts.bold}
                  textAlign={'center'}
                  textStyle={{
                    marginTop: 10,
                  }}>
                  Save
                </PlainText>
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* </KeyboardAvoidingView> */}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: theme.normalize(24),
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 16,
    // borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});
