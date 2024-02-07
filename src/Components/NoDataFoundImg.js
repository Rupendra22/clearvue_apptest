import React from 'react';
import {Image, View} from 'react-native';
import {weight, Fonts, normalize, sizes} from '../Theme/theme';
import PlainText from './PlainText';

const NoDataFoundImg = ({imgSource, message}) => (
  <View
    style={{
      alignItems: 'center',
      flex: 1,
      padding: sizes.CONTAINER_PADDING,
      justifyContent: 'center',
    }}>
    <Image
      source={imgSource}
      style={{
        height: normalize(250),
        resizeMode: 'contain',
        aspectRatio: 5 / 2,
      }}
    />
    <PlainText
      textStyle={{marginTop: 5}}
      lineHeight={sizes.LINE_HEIGHT_22}
      fontWeight={weight.FONT_WEIGHT_SEMIBOLD}
      textAlign={'center'}
      fontFamily={Fonts.semiBold}>
      {message}
    </PlainText>
  </View>
);

export default NoDataFoundImg;
