//import liraries
import {useIsFocused} from '@react-navigation/core';
import {Tab, Tabs} from 'native-base';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import {FlexContainer} from '../../Components';
import {MainHeader} from '../../Components/MainHeader';
import {color, Fonts} from '../../Theme/theme';
import Agency from './tabs/Agency';
import AllFeeds from './tabs/AllFeeds';
import Company from './tabs/Company';
import {FetchUserMessage} from '../../Store/UserActions';
import {connect} from 'react-redux';
import {handleFailureCallback} from '../../Config';
import {helperLog, userID} from '../../Helper/Utils';
import {notificationCount} from '../../Store/Global';
import {strings} from '../../Helper/i18n';
import AsyncStorage from '@react-native-community/async-storage';
import {SURVEY_CODE} from '../../Helper/Storage';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}
// create a component
const HomeScreen = ({
  navigation,
  FetchUserFeed,
  FetchUserMessage,
  notificationCount,
  UserActions,
}) => {
  const [isLogo, setIsLogo] = useState(false);
  const [title, setTitle] = useState('Home');
  const [index, setIndex] = useState(0);

  async function fetchMessages() {
    let surveyCode = await AsyncStorage.getItem(SURVEY_CODE);

    if (surveyCode === '' || surveyCode === null || surveyCode === undefined) {
      surveyCode = 'en';
    }
    FetchUserMessage(false, userID, 'general', surveyCode, {
      SuccessCallback: response => {
        notificationCount(response?.unread_message_count);
        if (response.ok) {
        }
      },
      FailureCallback: response => {
        notificationCount(0);
      },
    });
  }

  const stateData = useSelector(data => data);
  let value = stateData.UserActions;
  useEffect(() => {
    if (index == 0) {
      setTitle(strings('headerHome')), setIsLogo(false);
    } else if (index == 1) {
      value.companyImage !== ''
        ? setIsLogo(value.companyImage)
        : setTitle('Company');
    } else {
      value.agencyImage !== ''
        ? setIsLogo(value.agencyImage)
        : (setTitle('Agency'), setIsLogo(false));
    }
  }, [index, stateData]);

  function getUrl() {
    if (index == 0) {
      return;
    }

    if (index == 1) {
      return UserActions?.companyImage + '?' + new Date();
    }

    if (index == 2) {
      return UserActions?.agencyImage + '?' + new Date();
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);
  return (
    <FlexContainer noPadding={true} bottomSafeAreaColor={color.MAIN_BLUE}>
      <MainHeader
        isDrawer
        navigation={navigation}
        tittle={title}
        isLogo={getUrl()}
      />
      <FocusAwareStatusBar
        barStyle="light-content"
        backgroundColor={color.MAIN_BLUE}
      />
      {/** Tabs includes three different Tab
       * 1. AllFeeds
       * 2. Company
       * 3. Agency
       */}
      <Tabs
        locked
        tabContainerStyle={{elevation: 0}}
        onChangeTab={x => {
          setIndex(x.i);
        }}>
        <Tab
          heading={strings('allFeeds')}
          tabStyle={[{backgroundColor: color.MAIN_BLUE}]}
          activeTabStyle={{backgroundColor: color.MAIN_BLUE}}
          textStyle={{color: color.WHITE, fontFamily: Fonts.regular}}
          activeTextStyle={{
            color: color.WHITE,
            fontFamily: Fonts.bold,
          }}>
          <AllFeeds navigation={navigation} />
        </Tab>
        <Tab
          heading={strings('company')}
          tabStyle={[{backgroundColor: color.MAIN_BLUE}]}
          activeTabStyle={{backgroundColor: color.MAIN_BLUE}}
          textStyle={{color: color.WHITE, fontFamily: Fonts.regular}}
          activeTextStyle={{
            color: color.WHITE,
            fontFamily: Fonts.bold,
          }}>
          <Company navigation={navigation} />
        </Tab>
        <Tab
          heading={strings('agency')}
          tabStyle={[{backgroundColor: color.MAIN_BLUE}]}
          activeTabStyle={{backgroundColor: color.MAIN_BLUE}}
          textStyle={{color: color.WHITE, fontFamily: Fonts.regular}}
          activeTextStyle={{
            color: color.WHITE,
            fontFamily: Fonts.bold,
          }}>
          <Agency navigation={navigation} />
        </Tab>
      </Tabs>
    </FlexContainer>
  );
};

const mapActionCreators = {
  FetchUserMessage,
  notificationCount,
};
const mapStateToProps = state => ({
  UserActions: state.UserActions,
});

//make this component available to the app
export default connect(mapStateToProps, mapActionCreators)(HomeScreen);
