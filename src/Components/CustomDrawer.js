import AsyncStorage from '@react-native-community/async-storage';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import { Image, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  cleavue_logo,
  home_icon,
  icHallOfFameNew,
  icHelp,
  icMessage,
  icProfileNew,
  icSurvey,
  icTranningNew,
} from '../Assets';
import { LogoutAlert } from '../Components/LogoutAlert';
import PopUp from '../Components/PopUp';
import DeviceInfo from '../Helper/DeviceInfoRN';
import {
  AUTH_TOKEN,
  EMAIL_ADD,
  IS_LOGIN,
  REFRESH_TOKEN,
  USER_ID,
} from '../Helper/Storage';
import * as Utils from '../Helper/Utils';
import {
  currentScreenName,
  navigateAndSimpleReset,
} from '../Navigators/NavigationUtils';
import { color, Fonts, normalize, sizes } from '../Theme/theme';
import PlainText from './PlainText';
import HomeScreen from '../Screens/HomeScreen/index';
import { Item } from 'native-base';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { strings } from '../Helper/i18n';

const screenList = [
  {
    id: 0,
    label: 'Home',
    navigateTo: 'Home',
    innerNavigation: 'Home',
    icon: home_icon,
  },
  {
    id: 1,
    label: 'Profile',
    navigateTo: 'Home',
    innerNavigation: 'ProfileScreen', //ProfileScreen
    icon: icProfileNew,
  },
  {
    id: 2,
    label: 'Hall of Fame',
    navigateTo: 'Home',
    innerNavigation: 'HallofFame',
    icon: icHallOfFameNew,
  },
  {
    id: 3,
    label: 'Message',
    navigateTo: 'Home',
    innerNavigation: 'Message', //Message
    icon: icMessage,
  },
  {
    id: 4,
    label: 'Surveys',
    navigateTo: 'Surveys',
    icon: icSurvey,
  },
  {
    id: 5,
    label: 'Training',
    navigateTo: 'Training',
    icon: icTranningNew,
  },
  {
    id: 6,
    label: 'Help',
    navigateTo: 'Help',
    icon: icHelp,
  },
];

const CustomDrawer = props => {
  console.log('...currentScreenName', currentScreenName());
  const popUpRef = React.useRef(null);

  function onCancel() {
    popUpRef.current.hide();
  }

  async function onLogOut() {
    await AsyncStorage.setItem(IS_LOGIN, 'false');
    await AsyncStorage.setItem(AUTH_TOKEN, '');
    await AsyncStorage.setItem(REFRESH_TOKEN, '');
    await AsyncStorage.setItem(USER_ID, '');
    await AsyncStorage.setItem(EMAIL_ADD, '');
    Utils.isLogin = false;
    Utils.authToken = '';
    Utils.refreshToken = '';
    Utils.userID = '';
    popUpRef.current.hide();
    navigateAndSimpleReset('OnBoardingScreen');
  }

  function showSignOutAlert() {
    popUpRef.current.show();
  }

  function getStringValue(id) {
    switch (id) {
      case 0:
        return strings('headerHome');
      case 1:
        return strings('headerProfile');
      case 2:
        return strings('headerHallOfFame');
      case 3:
        return strings('headerMessage');
      case 4:
        return strings('headerSurvey');
      case 5:
        return strings('headerTraining');
      case 6:
        return strings('headerHelp');
      default:
        return strings('headerProfile');
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: color.MAIN_BLUE }}>
        <Image
          resizeMode="contain"
          source={cleavue_logo}
          style={{
            width: normalize(300),
            height: normalize(100),
            alignSelf: 'center',
          }}
        />
        <View style={{ flex: 1, paddingTop: 10 }}>
          {screenList.map((item, index) => {
            return (
              <DrawerItem
                {...props}
                activeBackgroundColor={color.WHITE}
                inactiveBackgroundColor={color.MAIN_BLUE}
                activeTintColor={color.MAIN_BLUE}
                inactiveTintColor={color.WHITE}
                labelStyle={{
                  fontSize: sizes.FONT_SIZE_HLARGE,
                  fontFamily: Fonts.bold,
                }}
                focused={
                  props?.state.index === 0
                    ? item.innerNavigation === currentScreenName()
                    : props?.state.index === index
                }
                label={({ focused, color }) => (
                  <Text
                    style={[
                      {
                        fontSize: sizes.FONT_SIZE_HLARGE,
                        fontFamily: Fonts.bold,
                        color,
                        marginLeft: normalize(-15),
                      },
                    ]}>
                    {/* {item.label} */} {getStringValue(item?.id)}
                  </Text>
                )}
                icon={({ focused, color }) => (
                  <Image
                    source={item?.icon}
                    resizeMode={'contain'}
                    style={{
                      height: normalize(26),
                      width: normalize(26),
                      tintColor: color,
                    }}
                  />
                )}
                onPress={() =>
                  props.navigation.navigate(item.navigateTo, {
                    screen: item.innerNavigation || '',
                  })
                }
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: color.WHITE_10,
        }}>
        <TouchableOpacity
          onPress={() => showSignOutAlert()}
          style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PlainText fontFamily={Fonts.bold}>Sign Out</PlainText>
          </View>
        </TouchableOpacity>
        <View style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PlainText
              themeColor={color.WHITE}
              fontSize={sizes.FONT_SIZE_MEDIUM}
              fontFamily={Fonts.medium}>
              {`${strings(
                'version',
              )} ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}
            </PlainText>
          </View>
        </View>
      </View>
      <PopUp
        ref={popUpRef}
        popStyle={{ backgroundColor: 'rgba(0,0,0,0)', elevation: 0 }}
        blurType={'none'}>
        <LogoutAlert onCancel={() => onCancel()} onSubmit={() => onLogOut()} />
      </PopUp>
    </View>
  );
};

export default CustomDrawer;
