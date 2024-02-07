import React from 'react';
import {Image, Modal, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {party_icon} from '../Assets';
import {Fonts, color, normalize, sizes} from '../Theme/theme';
import Button from './Button';
import FlexContainer from './FlexContainer';
import PlainText from './PlainText';

const SuccessModal = ({isVisible = false, onPress, name}) => {
  return (
    <Modal visible={isVisible} style={{flex: 1}}>
      <FlexContainer bottomSafeAreaColor={color.BLUE_2}>
        <LinearGradient
          colors={[color.MAIN_BLUE, color.BLUE_2]}
          style={{
            flex: 1,
            paddingHorizontal: sizes.CONTAINER_PADDING,
            paddingVertical: sizes.CONTAINER_PADDING_VERTICAL,
          }}>
          <View style={styles.textContainerStyle}>
            <PlainText
              textAlign={'center'}
              themeColor={color.WHITE}
              fontSize={sizes.FONT_SIZE_XXXMEDIUMLARGE}
              fontFamily={Fonts.bold}>
              {'Congratulations'}
            </PlainText>
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={party_icon}
              resizeMode="contain"
              style={{
                flex: 1,
                width: normalize(230),
              }}
            />
          </View>
          <View height={normalize(15)} />
          <View style={styles.textContainerStyle}>
            <PlainText
              themeColor={color.WHITE}
              fontSize={sizes.FONT_SIZE_XXXMEDIUMLARGE}
              fontFamily={Fonts.bold}>
              {name}
            </PlainText>
            <View height={normalize(15)} />
            <PlainText
              textAlign={'center'}
              lineHeight={sizes.LINE_HEIGHT_22}
              themeColor={color.WHITE}
              fontSize={sizes.FONT_SIZE_LARGE}>
              {
                'You are now part of a growing community, start exploring and stay connected to your co-workers. '
              }
            </PlainText>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Button onPress={onPress} btnText={'Continue'} textStyle={{}} />
          </View>
        </LinearGradient>
      </FlexContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textContainerStyle: {
    flex: 1,

    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});
export default SuccessModal;
