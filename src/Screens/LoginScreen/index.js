import AsyncStorage from '@react-native-community/async-storage';
import { Content, View } from 'native-base';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { API, Headers } from '../../ApiService';
import { icEyeOff, icEyeOn, ic_clogo } from '../../Assets';
import {
  AlertMessage,
  Button,
  FlexContainer,
  InputText,
  Loader,
  PlainText,
} from '../../Components';
import BackIconButton from '../../Components/BackIconButton';
import { handleFailureCallback } from '../../Config';
import {
  AUTH_TOKEN,
  EMAIL_ADD,
  FCM_TOKEN,
  IS_LOGIN,
  LANGUAGE,
  REFRESH_TOKEN,
  SURVEY_CODE,
  USER_ID,
  WORKER_ID,
} from '../../Helper/Storage';
import * as Utils from '../../Helper/Utils';
import { checkEmpty, verifyEmail } from '../../Helper/Utils';
import { strings } from '../../Helper/i18n';
import {
  navigate,
  navigateAndSimpleReset,
} from '../../Navigators/NavigationUtils';
import {
  FetchUserProfile,
  UpdateUserLanguage,
} from '../../Store/ProfileStore/actions';
import { loginUser } from '../../Store/RegistrationFlow';
import { checkWorkerAvailibility } from '../../Store/RegistrationFlow/actions';
import { Fonts, color, normalize, sizes } from '../../Theme/theme';

const LoginScreen = ({
  loginUser,
  globalLoding,
  checkWorkerAvailibility,
  FetchUserProfile,
  UpdateUserLanguage,
  route,
}) => {
  const [isBack, setisBack] = useState(route?.params?.isBack);
  const [email, setEmail] = useState('');
  const [password, setPwd] = useState('');
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSecureTextEntry, setSecureTextEntry] = useState(true);
  const [isLoading, setLoader] = useState(false);
  const [_isLoading, _setLoader] = useState(false);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const [firstName, setFirstName] = useState('');
  const [nationalInsuranceNumber, setNationalInsuranceNumber] = useState('');
  const nameInput = useRef(null);
  const ninInput = useRef(null);

  //-- API Call
  async function _callLoginUser() {
    let fcmToken = await AsyncStorage.getItem(FCM_TOKEN);
    let param = {
      email: email.trim()?.toLowerCase(),
      password: password,
      device_token: fcmToken ? fcmToken : 'no_string', // Device Token
    };
    if (!verifyEmail(email.trim())) {
      setAlertMessage(strings('errEmail')), setIsAlert(true);
      return;
    }
    if (checkEmpty(password) || password == null) {
      setAlertMessage(strings('errPassword')), setIsAlert(true);
      return;
    }
    _setLoader(true);
    loginUser(param, {
      SuccessCallback: response => {
        _setLoader(false);
        AsyncStorage.setItem(IS_LOGIN, JSON.stringify(true));
        AsyncStorage.setItem(AUTH_TOKEN, response.access_token);
        AsyncStorage.setItem(REFRESH_TOKEN, response.refresh_token);
        AsyncStorage.setItem(USER_ID, response.user_id);
        AsyncStorage.setItem(EMAIL_ADD, email.trim()?.toLowerCase());
        Utils.isLogin = true;
        Utils.authToken = response.access_token;
        Utils.refreshToken = response.refresh_token;
        Utils.userID = response.user_id;

        API.getInstance().setHeader(
          Headers.AUTHORIZATION,
          `Bearer ${response?.access_token}`,
        );
        Utils.helperLog('AUTH_TOKEN', response?.access_token);
        fetchProfile(response.user_id);
        setUserLanguage();
        navigateAndSimpleReset('MainNavigator');
      },
      FailureCallback: response => {
        _setLoader(false);
        let isArray = Array.isArray(response?.data?.message);
        !isArray
          ? (setAlertMessage(response?.data?.message), setIsAlert(true))
          : (setAlertMessage(response?.data?.message?.[0]?.message),
            setIsAlert(true));
      },
    });
  }

  async function fetchProfile(userId) {
    FetchUserProfile(false, userId, {
      SuccessCallback: response => {
        if (response.ok) {
          AsyncStorage.setItem(WORKER_ID, String(response?.data?.worker_id));
          Utils.workerID = String(response?.data?.worker_id);
        }
      },
      FailureCallback: response => {},
    });
  }

  //REF-JS save user language
  async function setUserLanguage() {
    var locale = await AsyncStorage.getItem(SURVEY_CODE);
    let param = {
      language: locale ? locale : 'en',
    };
    await UpdateUserLanguage(param, {
      SuccessCallback: async response => {},
      FailureCallback: response => {
        handleFailureCallback(response);
      },
    });
  }

  function _callRegisterUser() {
    let param = {
      first_name: firstName,
      national_insurance_number: nationalInsuranceNumber,
    };
    if (
      firstName == null ||
      firstName == '' ||
      !isNaN(firstName) ||
      checkEmpty(firstName)
    ) {
      Utils.showToast('Enter Valid Name');
      return;
    }

    if (!Utils.checkForalphanumeric(nationalInsuranceNumber)) {
      Utils.showToast(
        'national insurance number must only contain alpha-numeric characters',
      );
      return;
    }
    if (
      nationalInsuranceNumber == null ||
      nationalInsuranceNumber == '' ||
      checkEmpty(nationalInsuranceNumber)
    ) {
      Utils.showToast('Enter Valid National Insurane Number');
      return;
    }
    setLoader(true);
    checkWorkerAvailibility(param, {
      SuccessCallback: response => {
        setLoader(false);
        navigate('SignUpScreen', {
          name: firstName,
          nin: nationalInsuranceNumber,
        });
      },
      FailureCallback: response => {
        setLoader(false);
        if (response.data.status === 409) {
          Utils.showToast(response.data.message);
        } else if (response.data.status === 404) {
          alert(response.data.message);
        }
      },
    });
  }
  //-- end
  return (
    <FlexContainer bottomSafeAreaColor={color.MAIN_BLUE}>
      <StatusBar backgroundColor={color.MAIN_BLUE} />
      <LinearGradient
        colors={[color.MAIN_BLUE, '#4aa8fb', color.MAIN_BLUE]}
        style={{ flex: 1 }}>
        {isBack && <BackIconButton containerStyle={{ top: 10 }} />}
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: sizes.CONTAINER_PADDING,
          }}>
          <Image
            resizeMode="contain"
            style={styles.logoStyle}
            source={ic_clogo}
          />
          <InputText
            placeholder="Email Address"
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            value={email}
            onChangeText={text => {
              setEmail(text);
              setIsAlert(false);
            }}
            returnKeyType={'next'}
            inputRef={emailInput}
            onSubmitEditing={() => {
              passwordInput.current._root.focus();
            }}
            marginBottom={normalize(15)}
          />
          <InputText
            placeholder={strings('password')}
            autoCapitalize={'none'}
            value={password}
            onChangeText={text => {
              setPwd(text);
              setIsAlert(false);
            }}
            returnKeyType={'done'}
            inputRef={passwordInput}
            imgRightClick={() => setSecureTextEntry(!isSecureTextEntry)}
            imgRight={isSecureTextEntry ? icEyeOff : icEyeOn}
            imgRightStyle={{ tintColor: 'white' }}
            secureTextEntry={isSecureTextEntry}
          />
          {isAlert && (
            <AlertMessage title={'Sorry...'} message={alertMessage} />
          )}
          <View style={{ marginTop: sizes.BTN_MARGIN_TOP * 1.5 }} />
          {_isLoading ? (
            <ActivityIndicator size="large" color={color.MAIN_BLUE} />
          ) : (
            <Button
              btnText={'Sign In'}
              onPress={() => {
                _callLoginUser();
              }}
            />
          )}

          <View style={{ height: sizes.BTN_MARGIN_TOP }} />
          <PlainText
            fontFamily={Fonts.bold}
            onPress={() => {
              navigate('ForgotPasswordScreen');
            }}
            themeColor={color.WHITE}
            textAlign={'center'}>
            {strings('forgotPassword')} Click to resend
          </PlainText>
        </Content>
      </LinearGradient>
      <Loader isLoading={globalLoding} />
    </FlexContainer>
  );
};

const mapActionCreators = {
  loginUser,
  checkWorkerAvailibility,
  FetchUserProfile,
  UpdateUserLanguage,
};

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});

const styles = StyleSheet.create({
  logoStyle: {
    width: normalize(115),
    height: normalize(115),
    alignSelf: 'center',
    marginTop: normalize(45),
    marginBottom: normalize(50),
  },
});

export default connect(mapStateToProps, mapActionCreators)(LoginScreen);
