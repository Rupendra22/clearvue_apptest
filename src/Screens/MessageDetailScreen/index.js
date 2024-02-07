import {Content} from 'native-base';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {
  DetailItemView,
  FlexContainer,
  Loader,
  MessageItem,
} from '../../Components';
import LoadingView from '../../Components/LoaingView';
import {MainHeader} from '../../Components/MainHeader';
import {strings} from '../../Helper/i18n';
import {hasOwnKey, hasOwnProperty} from '../../Helper/Utils';
import {getParams} from '../../Navigators/NavigationUtils';
import {GetMessageDetails, MessageRead} from '../../Store/UserActions';
import {color, normalize, sizes} from '../../Theme/theme';
import AsyncStorage from '@react-native-community/async-storage';
import {SURVEY_CODE} from '../../Helper/Storage';

const MessageDetailScreen = ({
  params,
  navigation,
  GetMessageDetails,
  MessageRead,
  globalLoding,
}) => {
  const {item} = getParams();
  const [messageId, setMessageId] = useState(item.id);
  const [isUnread, setMessageRead] = useState(item.is_message_read);
  const [message_receiver_worker_id, setMessageReceiverWorkerId] = useState(
    hasOwnProperty('message_receiver_worker_id', item)
      ? hasOwnKey('message_receiver_worker_id', item) !== ''
        ? item?.message_receiver_worker_id
        : false
      : false,
  );
  const [result, setResult] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  //-- API call
  async function fetchMessage() {
    setIsLoading(true);

    let surveyCode = await AsyncStorage.getItem(SURVEY_CODE);

    if (surveyCode === '' || surveyCode === null || surveyCode === undefined) {
      surveyCode = 'en';
    }

    GetMessageDetails(messageId, message_receiver_worker_id, surveyCode, {
      SuccessCallback: response => {
        if (response.ok) {
          setResult(response.result);
          setIsLoading(false);
          !isUnread
            ? MessageRead(false, messageId, {
                SuccessCallback: res => {
                  console.log(res);
                },
                FailureCallback: res => {
                  console.log(res);
                },
              })
            : null;
        }
      },
      FailureCallback: response => {
        setIsLoading(false);
        console.log(response);
      },
    });
  }
  //-- end

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMessage();
    });
    fetchMessage();
    return () => unsubscribe();
  }, []);
  return (
    <FlexContainer noPadding={true}>
      <MainHeader
        isBack
        tittle={strings('headerMessage')}
        navigation={navigation}
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
          <Content
            contentContainerStyle={{
              padding: sizes.CONTAINER_PADDING,
            }}>
            <MessageItem
              isBorder={false}
              profileImage={result.sender}
              title={result.from}
              subtitle={result.title}
              date={result.created_at}
              isUnread={isUnread}
              profilePick={result?.profile_pic}
            />
            <View height={normalize(10)} />
            {result?.body?.map(itemData => {
              return <DetailItemView item={itemData} />;
            })}
          </Content>
        </View>
      )}
    </FlexContainer>
  );
};

const mapActionCreators = {
  GetMessageDetails,
  MessageRead,
};

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});

export default connect(mapStateToProps, mapActionCreators)(MessageDetailScreen);
