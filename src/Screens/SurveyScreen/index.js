import {View} from 'native-base';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {
  FlexContainer,
  ListItemView,
  Loader,
  NoDataFound,
  PlainText,
  SurveyText,
} from '../../Components';
import LoadingView from '../../Components/LoaingView';
import {MainHeader} from '../../Components/MainHeader';
import {handleFailureCallback, endPoints} from '../../Config';
import {navigate} from '../../Navigators/NavigationUtils';
import {GetSurveyCategory} from '../../Store/UserActions/actions';
import {color, Fonts, normalize, sizes} from '../../Theme/theme';
import {strings} from '../../Helper/i18n';
import {icSurvey, icLock, icUnlock} from '../../Assets';
import {Image, TouchableOpacity} from 'react-native';
import {API, Headers} from '../../ApiService';
import {AUTH_TOKEN, SURVEY_CODE} from '../../Helper/Storage';
import AsyncStorage from '@react-native-community/async-storage';

const SurveyScreen = ({navigation, GetSurveyCategory, globalLoding}) => {
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getSurveytype(false);
    });
    getSurveytype(true);
    return () => unsubscribe();
  }, []);

  //-- API Call
  async function getSurveytype(isLoading) {
    setIsLoading(isLoading);
    var authToken = await AsyncStorage.getItem(AUTH_TOKEN);
    let surveyCode = await AsyncStorage.getItem(SURVEY_CODE);
    console.log('surveyCode', surveyCode);

    if (surveyCode === '' || surveyCode === null || surveyCode === undefined) {
      surveyCode = 'en';
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    };

    API.getInstance().Fetch(
      endPoints.surveyCategory(surveyCode),
      defaultHeaders,
      '',
      {
        SuccessCallback: response => {
          setIsLoading(false);
          if (response.ok) {
            setCategory(response?.surveys);
          }
          console.log(
            'SuccessCallback_GetSurveyCategory',
            JSON.stringify(response),
          );
        },
        FailureCallback: response => {
          setIsLoading(false);
          handleFailureCallback(response);
        },
      },
    );
  }
  //-- end

  return (
    <FlexContainer>
      <MainHeader
        isDrawer={true}
        navigation={navigation}
        tittle={strings('headerSurvey')}
        tittleIcon={icSurvey}
      />
      {isLoading ? (
        <LoadingView />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: color.WHITE,

            borderTopLeftRadius: normalize(20),
            borderTopRightRadius: normalize(20),
          }}>
          <FlatList
            data={category}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: sizes.CONTAINER_PADDING,
              paddingVertical: sizes.CONTAINER_PADDING_VERTICAL,
            }}
            ListEmptyComponent={globalLoding ? null : <NoDataFound />}
            keyExtractor={(item, index) => `_key${index.toString()}`}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  backgroundColor: color.SILVER,
                  height: sizes.BORDER_SMALL_HEIGHT,
                }}
              />
            )}
            renderItem={({item, index}) => {
              return (
                <ListItemView
                  leftIconTintColor={color.BLACK}
                  rightIconTintColor={
                    item.isVisible ? 'black' : color.BLOCK_COLOR
                  }
                  rightIcon={item.isVisible ? icUnlock : icLock}
                  leftIcon={icSurvey}
                  tittle={item?.name}
                  isDisable={!item?.isVisible}
                  themeColor={
                    item.isVisible ? color.MAIN_BLUE : color.BLOCK_COLOR
                  }
                  onPress={() => navigate('SurveyDetailScreen', {item: item})}
                />
              );
            }}
          />
        </View>
      )}
    </FlexContainer>
  );
};

const mapActionCreators = {
  GetSurveyCategory,
};

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});

export default connect(mapStateToProps, mapActionCreators)(SurveyScreen);
