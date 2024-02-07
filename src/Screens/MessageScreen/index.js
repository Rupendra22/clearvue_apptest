//import liraries
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {
  FlexContainer,
  Loader,
  MessageItem,
  NoDataFound,
  LoaingView,
} from '../../Components';
import {MainHeader} from '../../Components/MainHeader';
import {handleFailureCallback} from '../../Config';
import {userID} from '../../Helper/Utils';
import {navigate} from '../../Navigators/NavigationUtils';
import {FetchUserMessage} from '../../Store/UserActions';
import {color, normalize, sizes} from '../../Theme/theme';
import {notificationCount} from '../../Store/Global';
import {strings} from '../../Helper/i18n';
import {icMessage} from '../../Assets';
import AsyncStorage from '@react-native-community/async-storage';
import {SURVEY_CODE} from '../../Helper/Storage';

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});

// create a component
const MessageScreen = ({
  navigation,
  FetchUserMessage,
  globalLoding,
  badgeValue,
  notificationCount,
}) => {
  const [data, setMessages] = useState([]);

  //-- API call
  async function fetchMessages(isLoading) {
    let surveyCode = await AsyncStorage.getItem(SURVEY_CODE);

    if (surveyCode === '' || surveyCode === null || surveyCode === undefined) {
      surveyCode = 'en';
    }
    FetchUserMessage(isLoading, userID, 'general', surveyCode, {
      SuccessCallback: response => {
        notificationCount(response?.unread_message_count);
        if (response.ok) {
          setMessages(response?.result);
        }
      },
      FailureCallback: response => {
        handleFailureCallback(response);
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
        isDrawer
        tittle={strings('headerMessage')}
        navigation={navigation}
        tittleIcon={icMessage}
      />
      {globalLoding ? (
        <LoaingView />
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
            contentContainerStyle={{padding: sizes.CONTAINER_PADDING}}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{height: normalize(20)}}
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
                  title={item?.from}
                  subtitle={item?.title}
                  profileImage={item?.sender}
                  message={item?.body[0]?.[0]?.data}
                  date={item?.created_at}
                  isUnread={item?.is_message_read}
                  onPress={() => navigate('MessageDetailScreen', {item: item})}
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

const styles = StyleSheet.create({});

const mapActionCreators = {
  FetchUserMessage,
  notificationCount,
};

export default connect(mapStateToProps, mapActionCreators)(MessageScreen);
