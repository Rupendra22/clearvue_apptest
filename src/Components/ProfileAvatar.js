import React from 'react';
import { Text, View } from 'react-native';
import { color, Fonts, normalize, sizes } from '../Theme/theme';
import PlainText from './PlainText';

const ProfileAvatar = ({avatarText}) => {
  return (
    <View
      style={{
        // width: normalize(40),
        // height: normalize(40),
        width: normalize(80),
        // height: normalize(40),
        aspectRatio: 4.4 / 2.2,
        backgroundColor: color.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.MAIN_BLUE,
        // borderRadius: normalize(25),
      }}>
      <PlainText
        fontFamily={Fonts.bold}
        fontSize={sizes.FONT_SIZE_XLARGE}
        lineHeight={sizes.LINE_HEIGHT_22}
        style={{
          // fontSize: sizes.FONT_SIZE_XLARGE,
          color: color.WHITE,
          // lineHeight: sizes.LINE_HEIGHT_22,
        }}>
        {avatarText}
      </PlainText>
    </View>
  );
};

export default ProfileAvatar;
