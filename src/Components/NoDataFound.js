import React from 'react';
import { StyleSheet, View } from 'react-native';
import { color, Fonts, normalize, sizes } from '../Theme/theme';
import PlainText from './PlainText';

const NoDataFound = ({containerStyle, message}) => (
  <View style={[styles.containerStyle, containerStyle]}>
    <View>
      <PlainText
        themeColor={color.MAIN_GREY}
        fontSize={sizes.FONT_SIZE_LARGE}
        fontFamily={Fonts.semiBold}>
        {message || 'No Data Found'}
      </PlainText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: normalize(200),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NoDataFound;
