import {Content, Button as ImageButton} from 'native-base';
import React, {useRef, useState} from 'react';
import {
  Image,
  StatusBar,
  View,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {icEyeOff, icEyeOn, ic_clogo, icBack} from '../../Assets';
import {
  Button,
  InputText,
  Loader,
  PlainText,
  SuccessModal,
  BackIconButton,
} from '../../Components';
import {
  checkEmpty,
  checkForalphanumeric,
  showToast,
  strongRegex,
  verifyEmail,
} from '../../Helper/Utils';
import {
  goBack,
  navigate,
  navigateAndSimpleReset,
  navigateAndSimpleResetWithParam,
} from '../../Navigators/NavigationUtils';
import {checkWorkerAvailibility} from '../../Store/RegistrationFlow/actions';
import {color, Fonts, normalize, sizes} from '../../Theme/theme';
import {applyStyleToText} from './../../Helper/LocaleSupport';
import {registerUser} from '../../Store/RegistrationFlow/actions';

const RegisterScreen = ({
  checkWorkerAvailibility,
  globalLoding,
  registerUser,
  route,
  navigation,
}) => {
  const [name, setName] = useState(route?.params?.name);
  const [nationalInsuranceNumber, setNationalInsuranceNumber] = useState(
    route?.params?.nin,
  );
  const [password, setPassword] = useState('');
  const nameInput = useRef(null);
  const ninInput = useRef(null);
  const psswrodInput = useRef(null);
  const [isSecureTextEntry, setSecureTextEntry] = useState(true);
  const [email, setEmail] = useState('');
  const emailInput = useRef(null);
  const [pwdIsStrong, setPwdIsStrong] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  //-- API Call
  function _callRegisterUser() {
    let param = {
      first_name: name,
      national_insurance_number: nationalInsuranceNumber,
    };
    if (name == null || name == '' || !isNaN(name) || checkEmpty(name)) {
      showToast('Enter Valid Name');
      return;
    }

    if (!checkForalphanumeric(nationalInsuranceNumber)) {
      showToast(
        'national insurance number must only contain alpha-numeric characters',
      );
      return;
    }
    if (
      nationalInsuranceNumber == null ||
      nationalInsuranceNumber == '' ||
      checkEmpty(nationalInsuranceNumber)
    ) {
      showToast('Enter Valid National Insurane Number');
      return;
    }
    checkWorkerAvailibility(param, {
      SuccessCallback: response => {
        navigate('SignUpScreen', {name: name, nin: nationalInsuranceNumber});
      },
      FailureCallback: response => {
        if (response.data.status === 409) {
          showToast(response.data.message);
          navigate('LoginScreen',{isBack:true});
        } else if (response.data.status === 404) {
          showToast(response.data.message);
        }
      },
    });
  }

  function _callsignUpUser() {
    let param = {
      email: email.trim(),
      national_insurance_number: nationalInsuranceNumber,
      password: password,
    };

    if (!checkForalphanumeric(nationalInsuranceNumber)) {
      showToast(
        'national insurance number must only contain alpha-numeric characters',
      );
      return;
    }

    if (!verifyEmail(email.trim())) {
      showToast('Enter Valid Email Address');
      return;
    }

    if (checkEmpty(password) || password == null) {
      showToast('Enter Valid Password');
      return;
    }
    if (password.length < 8) {
      showToast('Password length should be 8 or more characters ');
      return;
    }
    if (pwdIsStrong !== true) {
      showToast('Enter Strong Password');
      return;
    }

    registerUser(param, {
      SuccessCallback: response => {
        if (response.ok) {
          setIsVisible(true);
        } else {
        }
      },
      FailureCallback: response => {
        if (response.data.status === 409) {
          Utils.showToast(response.data.message);
        } else if (response.data.status === 404) {
          alert(response.data.message);
          return;
        }
        // handleFailureCallback(response,false);
      },
    });
  }

  return (
    <LinearGradient colors={[color.MAIN_BLUE, color.BLUE_2]} style={{flex: 1}}>
      <StatusBar backgroundColor={color.MAIN_BLUE} barStyle="light-content" />
      <BackIconButton />
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
          placeholder="Email Address"
          autoCapitalize={'none'}
          value={email}
          onChangeText={text => setEmail(text)}
          returnKeyType={'next'}
          inputRef={emailInput}
          onSubmitEditing={() => {
            psswrodInput.current._root.focus();
          }}
          keyboardType={'email-address'}
        />
        <View height={normalize(20)} />
        <InputText
          placeholder="Password"
          autoCapitalize={'none'}
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (strongRegex.test(text)) {
              setPwdIsStrong(true);
            } else {
              setPwdIsStrong(false);
            }
          }}
          returnKeyType={'next'}
          inputRef={psswrodInput}
          imgRightClick={() => setSecureTextEntry(!isSecureTextEntry)}
          imgRight={isSecureTextEntry ? icEyeOff : icEyeOn}
          secureTextEntry={isSecureTextEntry}
          onSubmitEditing={() => ninInput.current._root.focus()}
          imgRightStyle={{tintColor: 'white'}}
        />
        <View height={normalize(20)} />
        <InputText
          placeholder="National Insurance Number (optional)"
          autoCapitalize={'none'}
          value={nationalInsuranceNumber}
          onChangeText={text => setNationalInsuranceNumber(text)}
          returnKeyType={'done'}
          inputRef={ninInput}
          onSubmitEditing={() => _callsignUpUser()}
        />
        <View height={normalize(50)} />
        {globalLoding ? (
          <ActivityIndicator size="large" color={color.MAIN_BLUE} />
        ) : (
          <Button
            btnText={'Register'}
            onPress={() => {
              _callsignUpUser();
            }}
          />
        )}

      </Content>
      <SuccessModal
        isVisible={isVisible}
        name={name}
        onPress={() => {
          setIsVisible(false);
          navigateAndSimpleResetWithParam('LoginScreen');
        }}
      />

    </LinearGradient>
  );
};

const mapActionCreators = {
  checkWorkerAvailibility,
  registerUser,
};

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});

export default connect(mapStateToProps, mapActionCreators)(RegisterScreen);
