import {View} from 'native-base';
import React from 'react';
import {FlatList} from 'react-native';
import {icHallOfFame, icMessage, info, kudos, next, icHelp} from '../../Assets';
import {FlexContainer, SurveyText, ListItemView} from '../../Components';
import {MainHeader} from '../../Components/MainHeader';
import {strings} from '../../Helper/i18n';
import {navigate} from '../../Navigators/NavigationUtils';
import {color, normalize, sizes} from '../../Theme/theme';
import {openLink} from './../../Helper/Utils';

const listView = [
  {
    name: strings('fAQ'),
    route: {
      screenName: 'FAQScreen',
      params: {
        item: {
          type: 'FAQs',
        },
      },
    },
    icon: info,
    isBack: true,
    rightImagSource: next,
  },
  {
    name: strings('citizensAdvice'),
    route: '',
    link: 'https://www.citizensadvice.org.uk',
    icon: icHelp,
  },
  {
    name: strings('samaritans'),
    route: '',
    link: 'https://www.samaritans.org',
    icon: icHelp,
  },
  {
    name: strings('mentalHealth'),
    route: '',
    link: 'https://www.mentalhealth.org.uk',
    icon: icHelp,
  },
  {
    name: strings('modernSlavery'),
    route: '',
    link: 'https://www.modernslaveryhelpline.org/',
    icon: icHelp,
  },
  {
    name: strings('support'),
    route: '',
    link: 'https://www.mind.org.uk',
    icon: icHelp,
  },
  {
    name: strings('privacyPolicy'),
    route: '',
    link: 'https://theclearvue.co.uk/privacy',
    icon: info,
  },
  {
    name: strings('T&C'),
    route: '',
    link: 'https://theclearvue.co.uk/terms',
    icon: info,
  },
];

const HelpScreen = ({params, navigation}) => {
  function faqItemClick(item) {
    if (item?.route) {
      navigate(item?.route?.screenName, item?.route?.params);
      return;
    }

    if (item?.link) {
      openLink(item?.link);
    }
  }

  return (
    <FlexContainer>
      <MainHeader
        isDrawer={true}
        navigation={navigation}
        tittle={strings('headerHelp')}
        tittleIcon={icHelp}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: color.WHITE,
          borderTopLeftRadius: normalize(20),
          borderTopRightRadius: normalize(20),
          paddingHorizontal: sizes.CONTAINER_PADDING,
          paddingVertical: sizes.CONTAINER_PADDING_VERTICAL,
        }}>
        <FlatList
          data={listView}
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: color.SILVER,
                height: sizes.BORDER_SMALL_HEIGHT,
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <ListItemView
                leftIconTintColor={color.MAIN_BLUE}
                rightIconTintColor={color.MAIN_BLUE}
                rightIcon={item?.rightImagSource}
                leftIcon={item?.icon}
                tittle={item?.name}
                onPress={() => faqItemClick(item)}
                rightImageStyle={{height: normalize(18), width: normalize(18)}}
              />
            );
          }}
        />
      </View>
    </FlexContainer>
  );
};

export default HelpScreen;
