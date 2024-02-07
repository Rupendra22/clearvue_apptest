import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Container} from 'native-base';
import React from 'react';
import {connect} from 'react-redux';
import {Loader} from '../Components';
import {FCM_TOKEN} from '../Helper/Storage';
import * as Utils from '../Helper/Utils';
import {helperLog} from '../Helper/Utils';
import {
  FAQScreen,
  ForgotPasswordScreen,
  HallofFameDetailScreen,
  LoginScreen,
  MessageDetailScreen,
  OnBoardingScreen,
  RegisterScreen,
  SignUpScreen,
  SplashScreen,
  SurveyDetailScreen,
  TrainingDetailScreen,
  TrainingScreen,
  ChooseYourLanguage,
  CommentsScreen,
} from '../Screens';
import DrawerNavigator from './DrawerNavigator';
import {navigationRef} from './NavigationUtils';
const Stack = createStackNavigator();
const routeNameRef = React.createRef();
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
import { color } from '../Theme/theme';

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
});

const Navigation = ({globalLoding}) => {
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Message handled in the background!', remoteMessage);
  // });

  React.useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {});
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // setBadgeCount()
      console.log('Message handled in the background!', remoteMessage);
    });
    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   // Assume a message-notification contains a "type" property in the data payload of the screen to open

  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage,
  //     );
  //   });

  //   // Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //         console.log(
  //           'Notification caused app to open from quit state:',
  //           remoteMessage.notification,
  //         );
  //       }
  //     });
  // }, []);

  React.useEffect(() => {
    if (Platform.OS == 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }
  });

  React.useEffect(() => {
    // PushNotificationIOS.setApplicationIconBadgeNumber(0)
    const type = 'notification';
    PushNotificationIOS.addEventListener('register', onRegistered);
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    PushNotificationIOS.addEventListener(
      'localNotification',
      onLocalNotification,
    );
    return () => {
      PushNotificationIOS.removeEventListener('register');
      PushNotificationIOS.removeEventListener('notification');
      PushNotificationIOS.removeEventListener('localNotification');
    };
  });

  const onRemoteNotification = notification => {
    PushNotificationIOS.setApplicationIconBadgeNumber(1);
    console.log('notification', notification);
  };

  const onRegistered = deviceToken => {
    PushNotificationIOS.setApplicationIconBadgeNumber(1);
    console.log('Registered For Remote Push', `Device Token: ${deviceToken}`);
  };

  const onLocalNotification = notification => {
    PushNotificationIOS.setApplicationIconBadgeNumber(0);
    console.log('onLocalNotification', notification);
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const deviceRemote = await messaging().registerDeviceForRemoteMessages();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    helperLog('Authorization enabled:', enabled);

    if (enabled) {
      getFcmToken();
      helperLog('Authorization status:', authStatus);
    }
  }

  async function getFcmToken() {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      helperLog('FCM Token:', fcmToken);
      AsyncStorage.setItem(FCM_TOKEN, fcmToken);
      Utils.fcmToken = fcmToken;
    } else {
      helperLog('Failed', 'No token received');
    }
  }

  // async function setBadgeCount() {
  //   // Set badge count
  //   notifee.setBadgeCount(1).then(() => console.log('Badge count set'));
  // }

  return (
    <Container style={{backgroundColor:color.MAIN_BLUE}}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={() => {
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
          Utils.helperLog('screen name', currentRouteName);
          routeNameRef.current = currentRouteName;
        }}>
        <Stack.Navigator
          initialRouteName={'SplashScreen'}
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MainNavigator"
            component={DrawerNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TrainingScreen"
            component={TrainingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OnBoardingScreen"
            component={OnBoardingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MessageDetailScreen"
            component={MessageDetailScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TrainingDetailScreen"
            component={TrainingDetailScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HallofFameDetailScreen"
            component={HallofFameDetailScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="FAQScreen"
            component={FAQScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SurveyDetailScreen"
            component={SurveyDetailScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChooseYourLanguage"
            component={ChooseYourLanguage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CommentsScreen"
            component={CommentsScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Container>
  );
};

const mapActionCreators = {};

export default connect(mapStateToProps, mapActionCreators)(Navigation);
