import {StyleSheet, Platform, Dimensions} from 'react-native';
import * as theme from '../Theme/theme';
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  tabStyle: {
    paddingVertical: theme.normalize(5),
    alignSelf: 'center',
    flexDirection: 'column',
  },
  tabBarImageIcon: {
    height: theme.normalize(22),
    width: theme.normalize(22),
    margin: theme.normalize(15),
  },
  tabBarStyle: {
    height: theme.normalize(Platform.OS === 'android' ? 90 : 100),
    backgroundColor: theme.color.GREEN,
    paddingTop: 0.5,
    position: 'absolute',
    borderTopWidth: 0,
    borderTopRightRadius: theme.sizes.MAIN_RADIOUS,
    borderTopLeftRadius: theme.sizes.MAIN_RADIOUS,
  },
});

export default styles;
