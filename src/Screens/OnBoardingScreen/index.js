import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button, FlexContainer, PlainText} from '../../Components';
import AppIntroSlider from '../../Components/AppIntroSlider';
import {applyStyleToText} from '../../Helper/LocaleSupport';
import {strings} from '../../Helper/i18n';
import {Fonts, color, normalize, sizes} from '../../Theme/theme';
import {navigate} from './../../Navigators/NavigationUtils';
import {ScrollView} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');

// REF-JS : set message
const slides = [
  {
    id: '1',
    image: require('../../Assets/Images/image1.png'),
    imageSize: '40',
    title: 'onBoardingScreen1Title',
    subtitle: 'onBoardingScreen1SubTitle',
  },
  {
    id: '2',
    image: require('../../Assets/Images/image2.png'),
    imageSize: '50',
    title: 'onBoardingScreen2Title',
    subtitle: 'onBoardingScreen2SubTitle',
  },
  {
    id: '3',
    image: require('../../Assets/Images/image3.png'),
    imageSize: '50',
    title: 'onBoardingScreen3Title',
    subtitle: 'onBoardingScreen3SubTitle',
  },
  {
    id: '4',
    image: require('../../Assets/Images/image4.png'),
    imageSize: '50',
    title: 'onBoardingScreen4Title',
    subtitle: 'onBoardingScreen4SubTitle',
  },
  {
    id: '5',
    image: require('../../Assets/Images/image5.png'),
    imageSize: '50',
    title: 'onBoardingScreen5Title',
    subtitle: 'onBoardingScreen5SubTitle',
  },
];

const Slide = ({item}) => {
  return (
    <View style={{alignItems: 'center', width: width, flex: 1}}>
      <View
        style={{marginTop: normalize(24), paddingHorizontal: normalize(30)}}>
        <PlainText
          fontSize={sizes.FONT_SIZE_XLXLARGE}
          fontFamily={Fonts.extraBold}
          textAlign={'center'}
          textStyle={{color: color.BLUE_4}}>
          {strings(item?.title)}
        </PlainText>
        {/* <View style={{height: normalize(25)}} /> */}
        <Image
          source={item?.image}
          style={{
            height: `${normalize(item?.imageSize)}%`,
            width,
            resizeMode: 'contain',
          }}
        />
        <ScrollView>
          <PlainText
            lineHeight={sizes.LINE_HEIGHT_22}
            fontSize={sizes.FONT_SIZE_LARGE}
            fontFamily={Fonts.regular}
            textAlign={'center'}
            textStyle={{color: color.BLACK, paddingHorizontal: normalize(8)}}>
            {applyStyleToText(
              strings(item?.subtitle),
              [
                {
                  style: {
                    fontFamily: Fonts.bold,
                  },
                },
              ],
              '<b>',
              '</b>',
            )}
          </PlainText>
        </ScrollView>
      </View>
    </View>
  );
};

const OnboardingScreen = ({navigation}) => {
  const ref = React.useRef();

  const _renderNextButton = () => {
    return (
      <View>
        <Button
          btnText={strings('signUp')}
          btnTextColor={color.BLUE_4}
          styles={{marginBottom: sizes.BTN_MARGIN_TOP}}
          onPress={() => {
            navigate('SignUpScreen');
          }}
        />
      </View>
    );
  };

  const _renderDoneButton = () => {
    return (
      <>
        <PlainText
          textAlign={'center'}
          fontFamily={Fonts.bold}
          themeColor={color.BLUE_4}>
          {applyStyleToText(
            `${strings('alreadyHaveAnAccount')}
<b>${strings('signIn')}</b>
`,
            [
              {
                style: {
                  textDecorationLine: 'underline',
                  fontSize: sizes.FONT_SIZE_XLARGE,
                },
                onPress: () => navigate('LoginScreen', {isBack: true}),
              },
            ],
            '<b>',
            '</b>',
            true,
          )}
        </PlainText>
      </>
    );
  };

  return (
    <FlexContainer
      bottomSafeAreaColor={color.BLUE_2}
      statusBarColor={color.BLUE_6}>
      <View style={{flex: 1, backgroundColor: color.BLUE_6}}>
        <AppIntroSlider
          renderItem={({item}) => <Slide item={item} />}
          data={slides}
          bottomButton
          showSkipButton
          renderNextButton={_renderNextButton}
          renderDoneButton={_renderDoneButton}
          activeDotStyle={{backgroundColor: '#003574'}}
        />
      </View>
    </FlexContainer>
  );
};

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  indicator: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: color.MAIN_GREY,
    marginHorizontal: 3,
  },
});
export default OnboardingScreen;
