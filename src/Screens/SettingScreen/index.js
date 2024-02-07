//import liraries
import React from 'react';
import { View } from 'react-native';
import { FlexContainer } from '../../Components';
import { MainHeader } from '../../Components/MainHeader';
import { color, normalize } from '../../Theme/theme';

// create a component
const SettingScreen = ({navigation}) => {
  return (
    <FlexContainer
      noPadding={true}>
      <MainHeader
        isDrawer
        tittle={'Setting'}
        navigation={navigation}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: color.WHITE,
          borderTopLeftRadius: normalize(20),
          borderTopRightRadius: normalize(20),
        }}></View>
    </FlexContainer>
  );
};

//make this component available to the app
export default SettingScreen;
