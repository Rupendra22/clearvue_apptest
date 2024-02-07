import { CardItem } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import { openLink } from '../Helper/Utils';
import { navigate } from '../Navigators/NavigationUtils';
import { color, Fonts, normalize, sizes } from './../Theme/theme';
import DetailItemImage from './DetailItemImage';
import PlainText from './PlainText';

const DetailItemView = ({item}) => {
  return (
    <View style={{marginBottom: normalize(15)}}>
      {item?.map(itemData => {
        if (itemData.type == 'text') {
          return (
            <>
              <CardItem
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  paddingTop: 0,
                }}>
                <PlainText
                  themeColor={color.BLUE_4}
                  fontSize={sizes.FONT_SIZE_MEDIUM}
                  lineHeight={sizes.PRIMARY_LINE_HEIGHT}
                  textStyle={{marginBottom: normalize(0)}}>
                  {itemData.data}
                </PlainText>
              </CardItem>
            </>
          );
        }

        if (itemData.type == 'link') {
          return (
            <>
              <View style={{marginBottom: normalize(15)}} />
              <PlainText
                onPress={() => openLink(itemData.data)}
                lineHeight={sizes.PRIMARY_LINE_HEIGHT}
                themeColor={color.MAIN_BLUE}
                fontFamily={Fonts.bold}
                textStyle={{
                  textDecorationLine: 'underline',
                  alignSelf: 'flex-start',
                }}>
                {itemData.data}
              </PlainText>
            </>
          );
        }

        if (itemData.type == 'survey') {
          return (
            <>
              <View style={{marginBottom: normalize(15)}} />
              <PlainText
                onPress={() =>
                  navigate('SurveyDetailScreen', {
                    item: {id: itemData?.data?.id, name: itemData?.data?.name},
                  })
                }
                lineHeight={sizes.PRIMARY_LINE_HEIGHT}
                themeColor={color.MAIN_BLUE}
                fontFamily={Fonts.bold}
                textStyle={{
                  textDecorationLine: 'underline',
                  alignSelf: 'flex-start',
                }}>
                {itemData.data?.name}
              </PlainText>
            </>
          );
        }

        if (itemData.type == 'media') {
          return (
            <>
              <View style={{marginBottom: normalize(15)}} />
              <DetailItemImage image={itemData.data} />
            </>
          );
        }
      })}
    </View>
  );
};

export default DetailItemView;
