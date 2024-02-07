import {Content} from 'native-base';
import React, {useRef, useState} from 'react';
import {Image, StatusBar, View, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {ic_clogo} from '../../Assets';
import {Button, InputText, Loader, PlainText} from '../../Components';
import {checkEmpty, checkForalphanumeric, showToast} from '../../Helper/Utils';
import {navigate} from '../../Navigators/NavigationUtils';
import {checkWorkerAvailibility} from '../../Store/RegistrationFlow/actions';
import {color, Fonts, normalize, sizes} from '../../Theme/theme';
import {applyStyleToText} from '../../Helper/LocaleSupport';
import BackIconButton from '../../Components/BackIconButton';

const RegisterScreen = ({checkWorkerAvailibility, globalLoding}) => {
  const [name, setName] = useState('');
  const [nationalInsuranceNumber, setNationalInsuranceNumber] = useState('');
  const nameInput = useRef(null);
  const ninInput = useRef(null);

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
          navigate('LoginScreen', {isBack: true});
        } else if (response.data.status === 404) {
          showToast(response.data.message);
        }
      },
    });
  }

  return (
    <LinearGradient colors={[color.MAIN_BLUE, color.BLUE_2]} style={{flex: 1}}>
      <StatusBar backgroundColor={color.MAIN_BLUE} barStyle="light-content" />
      <BackIconButton containerStyle={{top: 10}} />
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
          placeholder="First Name"
          autoCapitalize={'words'}
          value={name}
          onChangeText={text => setName(text)}
          returnKeyType={'next'}
          inputRef={nameInput}
          onSubmitEditing={() => ninInput.current._root.focus()}
        />
        <View height={normalize(20)} />
        <InputText
          placeholder="National Insurance Number"
          autoCapitalize={'none'}
          value={nationalInsuranceNumber}
          onChangeText={text => setNationalInsuranceNumber(text)}
          returnKeyType={'next'}
          inputRef={ninInput}
        />
        <View height={normalize(80)} />
        {globalLoding ? (
          <ActivityIndicator size="large" color={color.MAIN_BLUE} />
        ) : (
          <Button
            btnText={'Register'}
            onPress={() => {
              _callRegisterUser();
            }}
          />
        )}

        <View style={{height: sizes.BTN_MARGIN_TOP}} />
        <PlainText
          fontFamily={Fonts.bold}
          onPress={() => {
            // Register();
          }}
          themeColor={color.WHITE}
          textAlign={'center'}>
          {applyStyleToText(
            ' Already have an account? <b>Sign In</b>',
            [
              {
                style: {
                  fontFamily: Fonts.bold,
                  textDecorationLine: 'underline',
                },
                onPress: () => navigate('LoginScreen', {isBack: true}),
              },
            ],
            '<b>',
            '</b>',
            true,
          )}
        </PlainText>
      </Content>
    </LinearGradient>
  );
};

const mapActionCreators = {
  checkWorkerAvailibility,
};

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});

export default connect(mapStateToProps, mapActionCreators)(RegisterScreen);
