import * as React from 'react';
import { Pressable } from 'react-native';
import * as theme from '../Theme/theme';
import PlainText from './PlainText';

function Button({
  transparent,
  btnText,
  textAlign,
  onPress,
  isBorder,
  styles,
  textStyle,
  disabled = false,
  backgroundColor = isBorder ? '#121212' : theme.color.WHITE,
  borderRadius = theme.sizes.BTN_BORDER_RADIOUS,
  btnTextColor = theme.color.BLUE_1,
  borderColor = theme.color.WHITE,
  height = theme.sizes.PRIMARY_BTN_HEIGHT,
  fontSize = theme.sizes.FONT_SIZE_LARGE,
  lineHeight = theme.sizes.PRIMARY_LINE_HEIGHT,
  fontWe, // add it on plain text
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          backgroundColor: backgroundColor,
          height: height,
          borderRadius: borderRadius,
          justifyContent: 'center',
          alignItems: 'center',
        },
        isBorder
          ? {
              borderWidth: 1,
              backgroundColor: backgroundColor ? backgroundColor : '#121212',
              borderColor: borderColor,
            }
          : null,
        transparent ? {backgroundColor: 'transparent'} : null,
        styles,
      ]}>
      <PlainText
        fontSize={fontSize}
        textStyle={textStyle}
        fontFamily={theme.Fonts.bold}
        fontWeight={'bold'}
        themeColor={btnTextColor}>
        {btnText}
      </PlainText>
    </Pressable>
  );
}

export default Button;
