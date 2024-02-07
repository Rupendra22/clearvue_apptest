//import liraries
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {FlexContainer, Loader, NoDataFound} from '../../Components';
import LoadingView from '../../Components/LoaingView';
import {MainHeader} from '../../Components/MainHeader';
import MessageItem from '../../Components/MessageItem';
import {userID} from '../../Helper/Utils';
import {navigate} from '../../Navigators/NavigationUtils';
import {FetchUserMessage} from '../../Store/UserActions';
import {color, normalize, sizes} from '../../Theme/theme';
import {strings} from '../../Helper/i18n';
import {icTranningNew} from '../../Assets';
import AsyncStorage from '@react-native-community/async-storage';
import {SURVEY_CODE} from '../../Helper/Storage';

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
});

// create a component
const TrainingScreen = ({FetchUserMessage, navigation, globalLoding}) => {
  const [data, setMessages] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  async function fetchMessages(isLoading) {
    setisLoading(isLoading);
    let surveyCode = await AsyncStorage.getItem(SURVEY_CODE);

    if (surveyCode === '' || surveyCode === null || surveyCode === undefined) {
      surveyCode = 'en';
    }
    FetchUserMessage(isLoading, userID, 'training', surveyCode, {
      SuccessCallback: response => {
        console.log('1232131313', JSON.stringify(response));
        setisLoading(false);
        if (response.ok) {
          setMessages(response?.result);
        }
      },
      FailureCallback: response => {
        setisLoading(false);
        console.log(response);
      },
    });
  }
  //-- end

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMessages(false);
    });
    fetchMessages(true);
    return () => unsubscribe();
  }, []);

  return (
    <FlexContainer noPadding={true}>
      <MainHeader
        isDrawer={true}
        tittle={strings('headerTraining')}
        navigation={navigation}
        tittleIcon={icTranningNew}
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
            ListEmptyComponent={globalLoding ? null : <NoDataFound />}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{height: normalize(20)}}
            contentContainerStyle={{padding: sizes.CONTAINER_PADDING}}
            keyExtractor={(item, index) => `${index}`}
            showsVerticalScrollIndicator={false}
            data={data}
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
                <MessageItem
                  // customStyle={{paddingHorizontal: sizes.CONTAINER_PADDING}}
                  title={item?.from}
                  subtitle={item?.title}
                  profileImage={item?.sender}
                  message={item?.body[0]?.[0]?.data}
                  date={item?.created_at}
                  isUnread={item?.is_message_read}
                  onPress={() => navigate('TrainingDetailScreen', {item: item})}
                  profilePick={item?.profile_pic}
                  numberOfLines={1}
                />
              );
            }}
          />
        </View>
      )}
    </FlexContainer>
  );
};

// define your styles
const styles = StyleSheet.create({});

const mapActionCreators = {
  FetchUserMessage,
};

//make this component available to the app
export default connect(mapStateToProps, mapActionCreators)(TrainingScreen);
