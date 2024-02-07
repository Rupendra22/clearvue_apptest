import React from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import ProfileAvatar from './ProfileAvatar';
import {color, Fonts, normalize, sizes} from '../Theme/theme';
import PlainText from './PlainText';
import {formateDate} from '../Helper/Utils';

const SocialIFeedHeader = ({profilePick, sender, date, userName="Dummy data",avatarImage}) => (
  <View
    style={{
      flex: 1,
      flexDirection: 'row',
    }}>
    {profilePick == null ? (
      <ProfileAvatar avatarText={avatarImage} />
    ) : (
      <>
        <FastImage
          style={{
            width: normalize(80),
            // height: normalize(40),
            aspectRatio: 4.4 / 2.2,
            backgroundColor: color.WHITE,
            // borderRadius: normalize(25), 
          }}
          source={{
            uri: profilePick + '?' + new Date(),
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </>
    )}

    <View style={{flex: 1, marginLeft: 10}}>
      <View style={{flexDirection: 'row'}}>
        <PlainText
          textStyle={{flex: 0.7}}
          fontSize={sizes.FONT_SIZE_MEDIUM}
          themeColor={color.SILVER}
          fontFamily={Fonts.black}>
          {sender}
        </PlainText>
        <View style={{alignItems: 'flex-end', flex: 0.4}}>
          <PlainText
            fontSize={sizes.FONT_SIZE_MEDIUM}
            themeColor={color.SILVER}
            fontFamily={Fonts.black}>
            {formateDate(date)}
          </PlainText>
        </View>
      </View>
      {/* {userName !== '' && <CollapseText body={userName} />} */}
      {userName !== '' && (
        <PlainText fontSize={sizes.FONT_SIZE_MEDIUM} themeColor={color.ORANGE}>
          {userName}
        </PlainText>
      )}
    </View>
  </View>
);

export default React.memo(SocialIFeedHeader);
