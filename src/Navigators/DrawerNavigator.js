import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomDrawer} from '../Components';
import {
  HallofFameScreen,
  HelpScreen,
  MessageScreen,
  ProfileScreen,
  SurveyScreen,
  TrainingScreen,
} from '../Screens';
import {color} from '../Theme/theme';
import MainNavigator from './MainNavigator';
import {strings} from '../Helper/i18n';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({}) => {
  return (
    <Drawer.Navigator
      initialRouteName="Root"
      drawerStyle={{backgroundColor: color.MAIN_BLUE}}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen key={'Home'} name="Home" component={MainNavigator} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Hall of Fame" component={HallofFameScreen} />
      <Drawer.Screen name="Messages" component={MessageScreen} />
      <Drawer.Screen name="Surveys" component={SurveyScreen} />
      <Drawer.Screen name="Training" component={TrainingScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
