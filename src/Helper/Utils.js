import moment from 'moment';
import {Toast} from 'native-base';
import {Alert, Linking, Platform} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {color, Fonts} from '../Theme/theme';
import RNBootSplash from 'react-native-bootsplash';
import API, {DevelopmentMode} from '../ApiService';
import {strings} from './i18n';

export const isNullOrUndefined = value => {
  return value == null || value == '';
};

export function helperLog(tag, type) {
  if (__DEV__) {
    console.log(tag, JSON.stringify(type));
  }
}

export const verifyEmail = value => {
  return /^[a-zA-Z0-9+_.-]*@\w+([\.-]?\w+)*(\.\w{1,15})+$/.test(value);
};

export const checkForalphanumeric = value => {
  var pattern = new RegExp(/^[a-zA-Z0-9]*$/);
  return pattern.test(value);
};

export function checkEmpty(value) {
  return value.split(/\s/).join('') === '' ? true : false;
}

//Password Validation
export const strongRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
);

export const LONG_DURATION = 5000;
export const MED_DURATION = 3000;
export const SHORT_DURATION = 2100;

export const showToast = (
  message,
  duration = 3000,
  position = 'bottom',
  style,
) => {
  Toast.show({
    text: message,
    position: position,
    duration: duration,
    textStyle: {color: color.BLUE_1, fontFamily: Fonts.bold},
    style: {backgroundColor: color.WHITE},
  });
};

export const showSWWToast = (duration = 3000, position = 'bottom', style) => {
  Toast.show({
    text: strings('errSWW'),
    position: position,
    duration: duration,
    style: style,
  });
};

export function hasOwnProperty(keyName, obj) {
  return keyName in obj;
}

export function hasOwnKey(keyName, obj, isInt) {
  if (obj === null) {
    return isInt ? 0 : '';
  }
  return keyName in obj ? obj[keyName] : isInt ? 0 : '';
}

export function formateDate(date, formate = 'DD/MM/YYYY') {
  if(date == '' || date === undefined || date === null){
    return "--"
  }
  let currentDate = moment(new Date()).format(formate);
  date = moment(date).format(formate);
  let dateDiff = moment(currentDate, formate).diff(
    moment(date, formate),
    'days',
  );

  if (currentDate == date) {
    return 'Today';
  } else if (dateDiff == 1) {
    return 'Yesterday';
  } else {
    return date;
  }
}

export const openLink = async giveUrl => {
  try {
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(giveUrl, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: color.MAIN_BLUE,
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: color.MAIN_BLUE,
        secondaryToolbarColor: color.MAIN_BLUE,
        navigationBarColor: 'black',
        navigationBarDividerColor: 'black',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
      });
    } else Linking.openURL(giveUrl);
  } catch (error) {
    Linking.openURL(giveUrl);
    console.log(error.message);
    // Alert.alert(error.message);
  }
};

export var authToken = '';
export var refreshToken = '';
export var fcmToken = '';
export var isLogin = '';
export var userID = '';
export var fullName = '';
export var sessionId = '';
export var workerID = '';

export const hideSplashScreen = () => {
  Platform.OS == 'ios'
    ? setTimeout(() => {
        RNBootSplash.hide({fade: true}); // fade
      }, 12)
    : RNBootSplash.hide({fade: true}); // fade
};

export const getAvatarInitials = textString => {
  if (!textString) return '';
  const text = textString.trim();
  const textSplit = text.split(' ');
  if (textSplit.length <= 1) return text.charAt(0);
  const initials =
    textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
  return initials;
};
