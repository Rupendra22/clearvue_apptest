import React from 'react';
import { color, Fonts, normalize, sizes } from '../Theme/theme';
import PlainText from './PlainText';

const AlertMessage = ({title, message}) => {
  return (
    <>
      <PlainText
        textAlign={'center'}
        fontWeight={'700'}
        textStyle={{
          color: color.WHITE,
          marginBottom: normalize(10),
          marginTop: normalize(40),
        }}
        fontSize={sizes.FONT_SIZE_XXXLARGE}
        fontFamily={Fonts.bold}>
        {title}
      </PlainText>
      <PlainText
        textAlign={'center'}
        fontWeight={'700'}
        textStyle={{color: color.WHITE, marginBottom: normalize(15)}}
        fontSize={sizes.FONT_SIZE_LARGE}>
        {message}
      </PlainText>
    </>
  );
};

export default AlertMessage;
