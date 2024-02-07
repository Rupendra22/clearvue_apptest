import React from 'react';
import {Pressable, View} from 'react-native';
import {formateDate} from '../Helper/Utils';
import {color, Fonts, normalize, sizes} from '../Theme/theme';
import PlainText from './PlainText';
import ProfileAvatar from './ProfileAvatar';
import FastImage from 'react-native-fast-image';

const MessageItem = ({
  onPress,
  profileImage,
  title,
  date,
  subtitle,
  message,
  isUnread,
  isBorder = true,
  profilePick,
  customStyle,
  paddingBottom = 10,
  fromCache = true,
  numberOfLines
}) => (
  <Pressable
    style={[
      {
        marginTop: normalize(10),
        borderBottomWidth: isBorder ? 0 : 0,
        borderColor: color.SILVER,
        paddingBottom: paddingBottom,
        flexDirection: 'row',
      },
      customStyle,
    ]}
    onPress={onPress}>
    {profilePick == null ? (
      profileImage && <ProfileAvatar avatarText={profileImage} />
    ) : fromCache ? (
      <FastImage
      style={{
        width: normalize(80),
        // height: normalize(40),
        aspectRatio: 4.4 / 2.2,
        backgroundColor: color.WHITE,
        // borderRadius: normalize(25), 
      }}
        source={{
          uri: profilePick,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    ) : (
      <FastImage
      style={{
        width: normalize(80),
        // height: normalize(40),
        aspectRatio: 4.4 / 2.2,
        backgroundColor: color.WHITE,
        // borderRadius: normalize(25), 
      }}
        source={{
          uri: profilePick,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    )}
    <View style={{flex: 1, paddingHorizontal: normalize(10)}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent:"center",
          alignItems:"center",
        }}>
        <PlainText
          fontFamily={!isUnread ? Fonts.bold : Fonts.regular}
          textStyle={{flex: 1, marginRight: normalize(5)}}
          themeColor={color.BLUE_4}
          numberOfLines={numberOfLines}
          fontSize={sizes.FONT_SIZE_MEDIUM}>
          {title}
        </PlainText>
        {date && (
          <PlainText
            themeColor={color.SILVER}
            fontFamily={Fonts.bold}
            fontSize={sizes.FONT_SIZE_MEDIUM}>
            {formateDate(date)}
          </PlainText>
        )}
      </View>
      {subtitle ? (
        <PlainText
          fontFamily={!isUnread ? Fonts.semiBold : Fonts.regular}
          themeColor={color.BLUE_4}
          fontSize={sizes.FONT_SIZE_MEDIUM}>
          {subtitle}
        </PlainText>
      ) : null}

      {message !== '' ? (
        <PlainText
          numberOfLines={1}
          fontSize={sizes.FONT_SIZE_MEDIUM}
          themeColor={color.BLUE_4}>
          {message}
        </PlainText>
      ) : (
        <></>
      )}
    </View>
  </Pressable>
);

export default MessageItem;
