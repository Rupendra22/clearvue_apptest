import { Content } from 'native-base';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, StatusBar, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { icEyeOff, icEyeOn, ic_clogo } from '../../Assets';
import {
  Button,
  CheckBox,
  FlexContainer,
  InputText,
  PlainText,
  SuccessModal,
} from '../../Components';
import BackIconButton from '../../Components/BackIconButton';
import WorkerHourModal from '../../Components/WorkerHourModal';
import { handleFailureCallback } from '../../Config';
import { strings } from '../../Helper/i18n';
import {
  checkEmpty,
  checkForalphanumeric,
  helperLog,
  openLink,
  showToast,
  strongRegex,
  verifyEmail,
} from '../../Helper/Utils';
import {
  navigate,
  navigateAndSimpleResetWithParam,
} from '../../Navigators/NavigationUtils';
import {
  registerUser,
  registerUserV2,
  updateWorker,
} from '../../Store/RegistrationFlow/actions';
import { color, Fonts, normalize, sizes } from '../../Theme/theme';
import { applyStyleToText } from './../../Helper/LocaleSupport';
import AsyncStorage from '@react-native-community/async-storage';
import { AUTH_TOKEN, REFRESH_TOKEN, USER_ID } from '../../Helper/Storage';
import * as Utils from '../../Helper/Utils';
import { API, Headers } from '../../ApiService';

const SignUpScreen = ({
  navigation,
  route,
  registerUser,
  globalLoding,
  registerUserV2,
  updateWorker,
}) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [nin, setNin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSecurePwd, setSecurePwd] = useState(true);
  const [isSecureCpwd, setSecureCpwd] = useState(true);
  const [pwdIsStrong, setPwdIsStrong] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const [isConfirm, setConfirmBox] = useState(false);
  const [workerId, setWorkerId] = useState('');
  const [showErr, setShowErr] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const nameInput = useRef(null);
  const surnameInput = useRef(null);
  const ninInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const confPwdInput = useRef(null);

  function signUpUser() {
    let param = {
      email: email.trim()?.toLocaleLowerCase(),
      national_insurance_number: nin.trim(),
      first_name: name,
      password: password,
      surname: surname,
    };
    if (name == null || name == '' || !isNaN(name) || checkEmpty(name)) {
      showToast('Enter Valid Name');
    } else if (
      surname == null ||
      surname == '' ||
      !isNaN(surname) ||
      checkEmpty(surname)
    ) {
      showToast(strings('errSurname'));
    } else if (!verifyEmail(email.trim())) {
      showToast(strings('errEmail'));
    } else if (checkEmpty(password) || password == null) {
      showToast(strings('errPassword'));
    } else if (password.length < 8) {
      showToast(strings('errPasswordLength'));
    } else if (pwdIsStrong !== true) {
      showToast(strings('errStrongPassword'));
    } else if (checkEmpty(confPwd) || confPwd == null) {
      showToast(strings('errValidConfirmPassword'));
    } else if (password !== confPwd) {
      showToast(strings('errPasswordNotMatch'));
    } else if (!isConfirm) {
      showToast('Agree to the T&Cs. and Privacy Policy.');
    } else if (nin != '' && !checkForalphanumeric(nin)) {
      showToast(strings('errSocialSecurity'));
      return;
    } else {
      registerUserV2(param, {
        SuccessCallback: response => {
          helperLog('SuccessCallback', response);
          if (response.ok) {
            setIsVisible(true);
          }
        },
        FailureCallback: response => {
          console.log(response.message);
          if (response.status == 201) {
            AsyncStorage.setItem(AUTH_TOKEN, response?.data?.access_token);
            AsyncStorage.setItem(REFRESH_TOKEN, response?.data?.refresh_token);
            AsyncStorage.setItem(USER_ID, response?.data?.user_id);
            Utils.authToken = response.access_token;
            Utils.refreshToken = response.refresh_token;
            Utils.userID = response.user_id;

            API.getInstance().setHeader(
              Headers.AUTHORIZATION,
              `Bearer ${response?.data?.access_token}`,
            );
            setWorkerId(response?.data?.worker_id);
            Alert.alert(
              'ClearVue',
              strings('loginAlertMsg'),
              [{ text: 'Ok', onPress: () => setShowWorkerModal(true) }],
              {
                cancelable: false,
              },
            );
            return;
          }
          handleFailureCallback(response);
        },
      });
    }
  }

  function callUpdateWorker(availability, workHr, fromSave) {
    let param = {
      availability: availability == 0 ? 'FULL TIME' : 'PART TIME',
      hours: workHr,
    };
    if (availability == 1 && workHr === '') {
      return;
    }
    setShowWorkerModal(false);
    updateWorker(workerId, param, {
      SuccessCallback: response => {
        console.log(response?.ok);
        if (response.ok) {
          setTimeout(() => {
            setIsVisible(true);
          }, 100);
        }
      },
      FailureCallback: response => {
        console.log(response.message);
        handleFailureCallback(response);
        // showToast(response.data.message);
      },
    });
  }

  return (
    <FlexContainer bottomSafeAreaColor={color.BLUE_2}>
      <LinearGradient
        colors={[color.MAIN_BLUE, color.BLUE_2]}
        style={{ flex: 1 }}>
        <StatusBar backgroundColor={color.MAIN_BLUE} barStyle="light-content" />
        <BackIconButton containerStyle={{ top: 10 }} />
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
            placeholder={strings('firstName')}
            autoCapitalize={'words'}
            value={name}
            onChangeText={text => setName(text)}
            returnKeyType={'next'}
            inputRef={nameInput}
            onSubmitEditing={() => surnameInput.current._root.focus()}
          />
          <View height={normalize(20)} />
          <InputText
            placeholder={strings('surname')}
            autoCapitalize={'words'}
            value={surname}
            onChangeText={text => setSurname(text)}
            returnKeyType={'next'}
            inputRef={surnameInput}
            onSubmitEditing={() => ninInput.current._root.focus()}
          />
          <View height={normalize(20)} />
          <InputText
            placeholder={`${strings('nationalInsuranceNumber')}`}
            autoCapitalize={'none'}
            value={nin}
            onChangeText={text => setNin(text)}
            returnKeyType={'next'}
            inputRef={ninInput}
            onSubmitEditing={() => {
              emailInput.current._root.focus();
            }}
          />
          <View height={normalize(20)} />
          <InputText
            placeholder="Email Address"
            autoCapitalize={'none'}
            value={email}
            onChangeText={text => setEmail(text)}
            returnKeyType={'next'}
            inputRef={emailInput}
            onSubmitEditing={() => {
              passwordInput.current._root.focus();
            }}
          />
          <View height={normalize(20)} />
          <InputText
            placeholder={strings('enterPassword')}
            autoCapitalize={'none'}
            value={password}
            onChangeText={text => {
              setPwd(text);
              if (strongRegex.test(text)) {
                setPwdIsStrong(true);
              } else {
                setPwdIsStrong(false);
              }
            }}
            returnKeyType={'next'}
            inputRef={passwordInput}
            onSubmitEditing={() => {
              confPwdInput.current._root.focus();
            }}
            imgRightClick={() => setSecurePwd(!isSecurePwd)}
            imgRight={isSecurePwd ? icEyeOff : icEyeOn}
            imgRightStyle={{ tintColor: 'white' }}
            secureTextEntry={isSecurePwd}
          />
          {pwdIsStrong !== null && !pwdIsStrong && (
            <PlainText themeColor={color.WHITE} fontFamily={Fonts.regular}>
              The password must be eight characters or longer and must contain
              at least
              {'\n\t'}1{')'} one lowercase character
              {'\n\t'}2{')'} one uppercase character
              {'\n\t'}3{')'} one number
              {'\n\t'}4{')'} one special character(!@#$%^&*)
            </PlainText>
          )}
          <View height={normalize(20)} />
          <InputText
            placeholder={strings('confirmPassword')}
            autoCapitalize={'none'}
            value={confPwd}
            onChangeText={text => setConfPwd(text)}
            returnKeyType={'done'}
            inputRef={confPwdInput}
            imgRightClick={() => setSecureCpwd(!isSecureCpwd)}
            imgRight={isSecureCpwd ? icEyeOff : icEyeOn}
            secureTextEntry={isSecureCpwd}
            imgRightStyle={{ tintColor: 'white' }}
          />
          <View style={{ height: sizes.BTN_MARGIN_TOP }} />
          <View height={normalize(5)} />
          <View style={{ flexDirection: 'row' }}>
            <CheckBox
              onPress={() => {
                setConfirmBox(!isConfirm);
              }}
              isCheck={isConfirm}
              tintColor={color.WHITE}
            />
            <View style={{ justifyContent: 'center' }}>
              <PlainText
                themeColor={color.WHITE}
                onPress={() => {
                  try {
                    openLink('https://www.theclearvue.co.uk/terms');
                  } catch (error) {}
                }}>
                {applyStyleToText(
                  'I agree to the <b>Terms and conditions</b> and',
                  [
                    {
                      style: {
                        fontFamily: Fonts.bold,
                      },
                    },
                  ],
                  '<b>',
                  '</b>',
                  true,
                )}
              </PlainText>
              <PlainText
                themeColor={color.WHITE}
                fontFamily={Fonts.bold}
                onPress={() => {
                  try {
                    openLink('https://www.theclearvue.co.uk/privacy');
                  } catch (error) {
                    alert(error);
                  }
                }}>
                Privacy Policy
              </PlainText>
            </View>
          </View>
          <View height={normalize(60)} />
          {globalLoding ? (
            <ActivityIndicator size="large" color={color.MAIN_BLUE} />
          ) : (
            <Button
              btnText={strings('confirmed')}
              onPress={() => {
                signUpUser();
              }}
            />
          )}
          <View style={{ height: sizes.BTN_MARGIN_TOP }} />
          <PlainText
            fontFamily={Fonts.bold}
            onPress={() => {
              console.log('Forgot password');
            }}
            themeColor={color.WHITE}
            textAlign={'center'}>
            {applyStyleToText(
              `${strings('alreadyHaveAnAccount')} <b>${strings('signIn')}</b>`,
              [
                {
                  style: {
                    fontFamily: Fonts.bold,
                    textDecorationLine: 'underline',
                  },
                  onPress: () => navigate('LoginScreen', { isBack: true }),
                },
              ],
              '<b>',
              '</b>',
              true,
            )}
          </PlainText>
          {/* <Loader isLoading={globalLoding} /> */}
        </Content>
        <SuccessModal
          isVisible={isVisible}
          name={name}
          onPress={() => {
            setIsVisible(false);
            navigateAndSimpleResetWithParam('LoginScreen');
          }}
        />
        <WorkerHourModal
          isVisible={showWorkerModal}
          showErr={showErr}
          saveButtonPress={(availability, hr) => {
            callUpdateWorker(availability, hr, false);
          }}
          getWorkerDetail={(availability, hr) =>
            callUpdateWorker(availability, hr, true)
          }
        />
      </LinearGradient>
    </FlexContainer>
  );
};

const mapActionCreators = {
  registerUser,
  registerUserV2,
  updateWorker,
};

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});

export default connect(mapStateToProps, mapActionCreators)(SignUpScreen);
