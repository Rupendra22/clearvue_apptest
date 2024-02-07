import AsyncStorage from '@react-native-community/async-storage';
import {Body, ListItem} from 'native-base';
import React, {Component} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {cleavue_logo_full_logo_white_transparent} from '../../Assets';
import {FlexContainer, PlainText} from '../../Components';
import {handleFailureCallback} from '../../Config';
import {DATA} from '../../Helper/Constants';
import {SURVEY_CODE} from '../../Helper/Storage';
import {setLocale} from '../../Helper/i18n';
import {navigateAndSimpleReset} from '../../Navigators/NavigationUtils';
import {UpdateUserLanguage} from '../../Store/ProfileStore/actions';
import * as theme from '../../Theme/theme';

class ChooseYourLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageData: DATA,
    };
  }

  selectLanguage = async lanCode => {
    setLocale(lanCode?.code);
    await AsyncStorage.setItem(SURVEY_CODE, lanCode?.surveyCode);
    navigateAndSimpleReset('OnBoardingScreen');
  };

  onSkipClick = () => {
    navigateAndSimpleReset('OnBoardingScreen');
  };

  render() {
    return (
      <FlexContainer
        backgroundColor="white"
        statusBarColor="white"
        isDarkContent>
        <View style={{flex: 1}}>
          <View
            style={{
              paddingHorizontal: theme.sizes.CONTAINER_PADDING,
            }}>
            <View
              style={{
                flexDirection: 'row',
                height: theme.normalize(60),
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Image
                resizeMode="contain"
                source={cleavue_logo_full_logo_white_transparent}
                style={{
                  width: theme.normalize(150),
                  height: theme.normalize(60),
                }}
              />
              <TouchableOpacity onPress={() => this.onSkipClick()}>
                <PlainText
                  fontWeight={theme.weight.FONT_WEIGHT_SEMIBOLD}
                  fontFamily={theme.Fonts.semiBold}
                  themeColor={theme.color.BLUE_4}>
                  Skip
                </PlainText>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 5}} />
            <PlainText
              fontSize={theme.sizes.FONT_SIZE_XLARGE}
              fontWeight={theme.weight.FONT_WEIGHT_SEMIBOLD}
              fontFamily={theme.Fonts.semiBold}
              themeColor={theme.color.MAIN_DARK}>
              Select your preferred language
            </PlainText>
            <View style={{marginTop: 3}} />
            <PlainText
              fontWeight={theme.weight.FONT_WEIGHT_MEDIUM}
              fontFamily={theme.Fonts.medium}
              themeColor={'#84818A'}>
              Please select a language to continue.
            </PlainText>
          </View>
          <FlatList
            data={this.state.languageData}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingVertical: theme.sizes.CONTAINER_PADDING_VERTICAL,
            }}
            keyExtractor={(item, index) => String(index)}
            renderItem={({item, index}) => {
              return (
                <ListItem onPress={() => this.selectLanguage(item)}>
                  <Body>
                    <PlainText
                      themeColor={theme.color.BLUE_4}
                      fontFamily={theme.Fonts.regular}>
                      {`${item?.emoji}  ${item?.languageName}`}
                    </PlainText>
                  </Body>
                </ListItem>
              );
            }}
          />
        </View>
      </FlexContainer>
    );
  }
}

const mapActionCreators = {
  UpdateUserLanguage,
};

const mapStateToProps = state => {
  return {
    globalLoading: state.global.loading,
  };
};

export default connect(mapStateToProps, mapActionCreators)(ChooseYourLanguage);
