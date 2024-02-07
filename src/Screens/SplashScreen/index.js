import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { API, Headers } from '../../ApiService';
import { cleavue_logo } from '../../Assets';
import { FlexContainer } from '../../Components';
import {
  AUTH_TOKEN,
  FCM_TOKEN,
  IS_LOGIN,
  LANGUAGE,
  REFRESH_TOKEN,
  SURVEY_CODE,
  USER_ID,
  WORKER_ID,
} from '../../Helper/Storage';
import * as Utils from '../../Helper/Utils';
import {
  navigate,
  navigateAndSimpleReset,
} from '../../Navigators/NavigationUtils';
import { color, normalize } from '../../Theme/theme';

async function setupLocalStorage(
  isNotification,
  setIsNotification,
  notificationType,
) {
  var isLogin = await AsyncStorage.getItem(IS_LOGIN);
  var authToken = await AsyncStorage.getItem(AUTH_TOKEN);
  var refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
  var fcmToken = await AsyncStorage.getItem(FCM_TOKEN);
  var u_id = await AsyncStorage.getItem(USER_ID);
  var locale = await AsyncStorage.getItem(LANGUAGE);
  var workerID = await AsyncStorage.getItem(WORKER_ID);
  var surveyCode = await AsyncStorage.getItem(SURVEY_CODE);

  console.log('12312312313123', locale);

  Utils.authToken = authToken;
  Utils.fcmToken = fcmToken;
  Utils.refreshToken = refreshToken;
  Utils.userID = u_id;
  Utils.workerID = workerID;
  Utils.hideSplashScreen();
  if (
    isLogin != null &&
    JSON.parse(isLogin) &&
    authToken != '' &&
    refreshToken != '' &&
    !isNotification
  ) {
    API.getInstance().setHeader(Headers.AUTHORIZATION, `Bearer ${authToken}`);
    navigateAndSimpleReset('MainNavigator');
  } else if (isNotification && isLogin != null && JSON.parse(isLogin)) {
    var messagId = notificationType?.msg_id;
    if (notificationType?.type == 'general') {
      if (messagId) {
        navigate('MessageDetailScreen', {
          item: { id: messagId },
        });
      } else {
        navigate('MessageScreen');
      }
    } else if (notificationType?.type == 'training') {
      if (messagId) {
        navigate('TrainingDetailScreen', {
          item: { id: messagId },
        });
      } else {
        navigate('TrainingScreen');
      }
    } else if (notificationType?.type == 'kudos') {
      if (messagId) {
        navigate('MessageDetailScreen', {
          item: { id: messagId },
        });
      } else {
        navigate('HallofFameScreen');
      }
    } else if (notificationType?.type == 'award') {
      if (messagId) {
        navigate('MessageDetailScreen', {
          item: { id: messagId },
        });
      } else {
        navigate('HallofFameScreen');
      }
    } else if (notificationType?.type == 'badge') {
      if (messagId) {
        navigate('MessageDetailScreen', {
          item: { id: messagId },
        });
      } else {
        navigate('HallofFameScreen');
      }
    } else if (notificationType?.type == 'feed') {
      navigate('MainNavigator', { screen: 'Home' });
    } else {
      navigateAndSimpleReset('MainNavigator');
    }
    setIsNotification(false);
  } else {
    navigateAndSimpleReset('ChooseYourLanguage');
  }
}

const SplashScreen = ({ navigation }) => {
  let [isNotification, setIsNotification] = useState(false);
  let [notificationType, setNotificationType] = useState(null);
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setIsNotification(true);
          setNotificationType(remoteMessage?.data);
        }
      });
    setTimeout(() => {
      setupLocalStorage(isNotification, setIsNotification, notificationType);
    }, 1200);
  });

  return (
    <FlexContainer bottomSafeAreaColor={color.MAIN_BLUE}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          resizeMode="contain"
          source={cleavue_logo}
          style={{ width: normalize(300), height: normalize(200) }}
        />
      </View>
    </FlexContainer>
  );
};

export default SplashScreen;
