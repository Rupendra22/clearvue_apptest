import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, View} from 'react-native';
import {home_icon, icHallOfFame, icHallOfFameNew, icMessage, icProfile, icProfileNew} from '../Assets';
import {
  HallofFameScreen,
  HomeScreen,
  MessageScreen,
  ProfileScreen,
} from '../Screens';
import {color, normalize} from '../Theme/theme';
import {connect} from 'react-redux';
const Tab = createBottomTabNavigator();

const mapStateToProps = state => ({
  badgeValue: state.global.notificationCount,
});

function renderIcon(image, focused) {
  return (
    <Image
      resizeMode={'contain'}
      source={image}
      style={{
        tintColor: focused ? 'white' : color.BLUE_1,
        height: normalize(22),
        width: normalize(22),
        margin: normalize(15),
      }}
    />
  );
}


function renderLargeIcon(image, focused) {
  return (
    <Image
      resizeMode={'contain'}
      source={image}
      style={{
        tintColor: focused ? 'white' : color.BLUE_1,
        height: normalize(42),
        width: normalize(42),
        margin: normalize(15),
      }}
    />
  );
}


const MainNavigator = ({badgeValue}) => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          height: normalize(Platform.OS === 'android' ? 80 : 90),
          paddingTop: 0.5,
          backgroundColor: color.MAIN_BLUE,
        },
        tabStyle: {paddingVertical: normalize(5)},
        showLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarLabelPosition: 'beside-icon',
          tabBarIcon: ({focused}) => renderIcon(home_icon, focused),
        }}
      />
      <Tab.Screen
        name="Message"
        component={MessageScreen}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarLabelPosition: 'beside-icon',
          tabBarIcon: ({focused}) => (
            <View>{renderIcon(icMessage, focused)}</View>
          ),
          tabBarBadge: badgeValue > 0 ? badgeValue : undefined,
          tabBarBadgeStyle: {backgroundColor: 'white'},
        }}
      />
      <Tab.Screen
        name="HallofFame"
        component={HallofFameScreen}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarLabelPosition: 'beside-icon',
          tabBarIcon: ({focused}) => renderLargeIcon(icHallOfFameNew, focused),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIconStyle: {display: 'none'},
          tabBarLabelPosition: 'beside-icon',
          tabBarIcon: ({focused}) => renderIcon(icProfileNew, focused),
        }}
      />
    </Tab.Navigator>
  );
};

const mapActionCreators = {};

export default connect(mapStateToProps, mapActionCreators)(MainNavigator);
