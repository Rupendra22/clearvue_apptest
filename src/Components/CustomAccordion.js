import { Accordion, Icon, View, Item } from 'native-base';
import React from 'react';
import {Image} from 'react-native';
import {openLink} from '../Helper/Utils';
import {color, Fonts, normalize} from '../Theme/theme';
import {sizes} from './../Theme/theme';
import PlainText from './PlainText';
import { applyStyleToTextOnPress } from '../Helper/LocaleSupport';

const changeText = text => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text
    .split(' ')
    .map(part => (urlRegex.test(part) ? `<b>${part}</b>` : part + ' '));
};


const CustomAccordion = ({dataArray,urlClick}) => {
  const [ratio, setRatio] = React.useState(1);
  function _renderHeader(item, expanded) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: color.WHITE,
          padding: normalize(10),
        }}>
        <View
          style={{
            width: sizes.SCREEN_WIDTH - normalize(100),
          }}>
          <PlainText themeColor={color.MAIN_BLUE} fontFamily={Fonts.semiBold}>
            {item.question}
          </PlainText>
        </View>
        {expanded ? <Icon name="chevron-up" /> : <Icon name="chevron-down" />}
      </View>
    );
  }
  
  function _renderContent(item) {
    return (
      <View
        style={{
          backgroundColor: color.MAIN_BLUE,
          padding: normalize(10),
          borderRadius: normalize(8),
        }}>
        {item?.answer?.map(itemData => {
          const itemText = changeText(itemData?.value).join('');
          if (itemData?.type == 'text') {
            return (
              <PlainText lineHeight={normalize(25)}>
                {applyStyleToTextOnPress(
                  itemText,
                  [
                    {
                      style: {
                        fontFamily: Fonts.bold,
                      },
                      onPress: (item) => {urlClick(item)},
                    },
                  ],
                  '<b>',
                  '</b>',
                )}
                {/* {itemData?.value} */}
              </PlainText>
            );
          }

          if (itemData?.type == 'link') {
            return (
              <>
                <View style={{marginBottom: normalize(15)}} />
                <PlainText
                  onPress={() => openLink(itemData.data)}
                  lineHeight={sizes.PRIMARY_LINE_HEIGHT}
                  themeColor={color.WHITE}
                  fontFamily={Fonts.bold}
                  textStyle={{
                    textDecorationLine: 'underline',
                    alignSelf: 'flex-start',
                  }}>
                  {itemData.value}
                </PlainText>
              </>
            );
          }

          if (itemData?.type == 'media') {
            return (
              <>
                <View style={{marginBottom: normalize(15)}} />
                <Image
                  source={{
                    uri: itemData?.value,
                  }}
                  style={{
                    width: '100%',
                    aspectRatio: 1,
                    borderRadius: normalize(8),
                  }}
                  resizeMode={'contain'}
                />
              </>
            );
          }
        })}
      </View>
    );
  }
  return (
    <Accordion
      dataArray={dataArray}
      expanded={[]}
      renderHeader={_renderHeader}
      renderContent={_renderContent}
      style={{borderColor: 'white'}}
    />
  );
};

export default CustomAccordion;
