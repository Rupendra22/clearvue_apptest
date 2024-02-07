import {ListItem} from 'native-base';
import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import {icLock, icSurvey, icUnlock} from '../Assets';
import {Fonts, normalize, sizes, color} from '../Theme/theme';
import PlainText from './PlainText';

const ListItemView = ({
  leftIcon,
  rightIcon,
  tittle,
  rightIconTintColor,
  leftIconTintColor,
  onPress,
  rightImageStyle,
  isDisable,
  themeColor=color.MAIN_BLUE
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.3}
    disabled={isDisable}
    style={{
      flexDirection: 'row',
      flex: 1,
      padding: normalize(5),
      alignContent: 'center',
      alignItems: 'center',
      marginVertical: normalize(5),
    }}>
    {leftIcon ? (
      <Image
        source={leftIcon}
        resizeMode={'contain'}
        style={{
          height: normalize(32),
          width: normalize(32),
          tintColor: leftIconTintColor,
        }}
      />
    ) : (
      <></>
    )}

    <PlainText
      fontFamily={Fonts.medium}
      textStyle={{flex: 1, paddingHorizontal: normalize(10)}}
      fontSize={sizes.FONT_SIZE_HLARGE}
      themeColor={themeColor}>
      {tittle}
    </PlainText>
    {rightIcon ? (
      <Image
        source={rightIcon}
        resizeMode={'contain'}
        style={[
          {
            height: normalize(30),
            width: normalize(30),
            tintColor: rightIconTintColor,
          },
          rightImageStyle,
        ]}
      />
    ) : (
      <></>
    )}
  </TouchableOpacity>
);

export default ListItemView;
