import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { radio_btn } from '../Assets';
import { Fonts, normalize } from '../Theme/theme';
import { color, sizes } from './../Theme/theme';
import PlainText from './PlainText';

const RadioButton = ({
  onPress,
  text,
  isCheck,
  style,
  textStyle,
  checkBox,
  checkText,
  imageStyle,
}) => (
  <TouchableOpacity
    style={[styles.check, style]}
    onPress={onPress}
    activeOpacity={1}>
    <View
      style={[
        {
          width: normalize(20),
          height: normalize(20),
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: color.WHITE,
          borderWidth: 2,
          borderRadius: normalize(20),
        },
      ]}>
      {isCheck && (
        <Image
          resizeMode="contain"
          source={radio_btn}
          style={[
            {
              tintColor: color.WHITE,
              width: normalize(10),
              height: normalize(10),
            },
          ]}
        />
      )}
    </View>
    <PlainText
      // lineHeight={sizes.FONT_SIZE_LARGE}
      textStyle={[
        {
          flex: 1,
          marginLeft: normalize(12),
          fontFamily: Fonts.bold,
          fontSize: sizes.FONT_SIZE_MEDIUM,
          color: color.BLUE_4,
        },
        textStyle,
      ]}>
      {text}
    </PlainText>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  check: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: normalize(6),
    alignContent: 'center',
  },
});
export default RadioButton;
