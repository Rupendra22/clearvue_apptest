import * as React from 'react';
import { Text } from 'react-native';
import * as theme from '../Theme/theme';
const FONT_FAMILY = theme.Fonts.regular;

const PlainText = ({
  fontStyle,
  themeColor,
  fontFamily,
  fontSize,
  fontWeight,
  textAlign,
  opacity,
  lineHeight,
  textStyle,
  numberOfLines,
  onPress,
  props,
  children,
  showErr = false,
  errMsg,
}) => (
  <>
    <Text
      style={[
        {
          fontStyle: fontStyle || 'normal',
          color: themeColor || theme.color.WHITE,
          fontFamily: fontFamily || FONT_FAMILY,
          fontSize: fontSize || theme.sizes.FONT_SIZE_LARGE,
          textAlign: textAlign || 'auto',
          opacity: opacity ? opacity : 1,
          lineHeight: lineHeight || null,
          fontWeight: fontWeight || null,
          ...textStyle,
        },
        textStyle,
      ]}
      numberOfLines={numberOfLines || undefined}
      onPress={onPress || null}
      {...props}>
      {children}
    </Text>
  </>
);

export default PlainText;
