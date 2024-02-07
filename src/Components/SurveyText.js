import React from 'react';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import {color, Fonts, normalize, sizes} from '../Theme/theme';
import PlainText from './PlainText';

function SurveyText({title, onPress, icon, isRightImage, rightImagSource}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image source={icon} style={styles.photo} />
        <PlainText
          fontSize={sizes.FONT_SIZE_XLARGE}
          themeColor={color.MAIN_BLUE}
          fontFamily={Fonts.medium}
          textStyle={styles.text}>
          {title}
        </PlainText>
        {isRightImage ? (
          <Image source={rightImagSource} style={styles.photo} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    flex: 1,
  },
  photo: {
    height: normalize(20),
    width: normalize(20),
    tintColor: color.MAIN_BLUE,
  },
});
export default SurveyText;
