import {Content, View} from 'native-base';
import React, {useRef, useState} from 'react';
import { Image, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import {connect} from 'react-redux';
import {ic_clogo} from '../../Assets';
import {Button, InputText, Loader} from '../../Components';
import {MainHeader} from '../../Components/MainHeader';
import {showToast, verifyEmail} from '../../Helper/Utils';
import {ForgotPassword} from '../../Store/RegistrationFlow/actions';
import {color, normalize, sizes} from '../../Theme/theme';
import FlexContainer from '../../Components/FlexContainer';
import {handleFailureCallback} from '../../Config';
import { strings } from '../../Helper/i18n';

const ForgotPasswordScreen = ({navigation, ForgotPassword, globalLoding}) => {
  const [email, setEmail] = useState('');

  const emailInput = useRef(null);

  function ForgotUserPassword() {
    let param = {
      email: email.trim(),
    };
    if (!verifyEmail(email.trim())) {
      showToast(strings('errEmail'));
    } else {
      ForgotPassword(param, {
        SuccessCallback: response => {
          if (response.ok) {
            navigation.goBack();
            showToast('Mail sent on given mail');
          }
        },
        FailureCallback: response => {
          handleFailureCallback(response);
        },
      });
    }
  }

  return (
    <FlexContainer bottomSafeAreaColor={color.BLUE_2}>
      <LinearGradient
        colors={[color.MAIN_BLUE, color.BLUE_2]}
        style={{flex: 1}}>
        <StatusBar backgroundColor={color.MAIN_BLUE} />
        <MainHeader
          isBack={true}
          navigation={navigation}
          backgroundColor={'transparent'}
        />
        <Content
          contentContainerStyle={{
            padding: sizes.CONTAINER_PADDING,
          }}>
          <Image
            resizeMode="contain"
            style={{
              width: normalize(115),
              height: normalize(115),
              alignSelf: 'center',
              marginTop: normalize(45),
              marginBottom: normalize(50),
            }}
            source={ic_clogo}
          />
          <InputText
            placeholder={strings('emailAddress')}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            value={email}
            onChangeText={text => setEmail(text)}
            returnKeyType={'done'}
            inputRef={emailInput}
            onSubmitEditing={() => {
              dismissKeyboard();
            }}
          />
          <View style={{marginTop: sizes.BTN_MARGIN_TOP * 2.5}} />
          {globalLoding ? (
            <ActivityIndicator size="large" color={color.MAIN_BLUE} />
          ) : (
            <Button
              btnText={'Send instructions'}
              onPress={() => {
                ForgotUserPassword();
              }}
            />
          )}
        </Content>
      </LinearGradient>
      <Loader isLoading={globalLoding} />
    </FlexContainer>
  );
};

const mapActionCreators = {
  ForgotPassword,
};
const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});

export default connect(
  mapStateToProps,
  mapActionCreators,
)(ForgotPasswordScreen);
