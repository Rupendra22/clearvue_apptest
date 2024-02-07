import { Content } from 'native-base';
import React, { useEffect, useState } from 'react';
import { BackHandler, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  Button,
  CheckBox,
  DetailItemView,
  FlexContainer,
  Loader,
  MessageItem,
} from '../../Components';
import LoadingView from '../../Components/LoaingView';
import { MainHeader } from '../../Components/MainHeader';
import { hasOwnKey, hasOwnProperty } from '../../Helper/Utils';
import { getParams, goBack } from '../../Navigators/NavigationUtils';
import {
  GetTrainingMessage,
  MessageRead,
  TrackWorkerTraining,
} from '../../Store/UserActions';
import { color, normalize, sizes } from '../../Theme/theme';
import { strings } from '../../Helper/i18n';
import AsyncStorage from '@react-native-community/async-storage';
import { SURVEY_CODE } from '../../Helper/Storage';
const TrainingDetailScreen = ({
  navigation,
  GetTrainingMessage,
  TrackWorkerTraining,
  MessageRead,
  globalLoding,
}) => {
  const [isConfirm, setConfirmBox] = useState(false);
  const [isDontUnderStand, setDontUnderStandBox] = useState(false);
  const [isShowButton, setShowButton] = useState(false);
  const { item } = getParams();
  const [messageId, setMessageId] = useState(item.id);
  const [result, setResult] = useState({});
  const [trainingStatus, setTrainingStatus] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [isUnread, setMessageRead] = useState(item.is_message_read);
  const [message_receiver_worker_id, setMessageReceiverWorkerId] = useState(
    hasOwnProperty('message_receiver_worker_id', item)
      ? hasOwnKey('message_receiver_worker_id', item) !== ''
        ? item?.message_receiver_worker_id
        : false
      : false,
  );
  const [isLoading, setIsLoading] = useState(false);
  const backAction = () => {
    if (!(isConfirm || isDontUnderStand)) {
      Alert.alert(
        'Attention',
        'You must complete tick box before closing this training message.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('Ok Pressed') },
        ],
        { cancelable: false },
      );
    }
    return !(isConfirm || isDontUnderStand);
  };

  //-- API Call
  async function fetchTrainingMessage() {
    setIsLoading(true);

    let surveyCode = await AsyncStorage.getItem(SURVEY_CODE);

    if (surveyCode === '' || surveyCode === null || surveyCode === undefined) {
      surveyCode = 'en';
    }

    GetTrainingMessage(messageId, message_receiver_worker_id, surveyCode, {
      SuccessCallback: response => {
        setIsLoading(false);
        if (response.ok) {
          setResult(response.result);
          setConfirmBox(response?.result?.is_training_completed);
          setShowButton(!response?.result?.is_training_completed);
          !response?.result?.is_training_completed
            ? setDontUnderStandBox(response?.result?.require_more_training)
            : setDisabled(true);
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

  function callTrainingStatus() {
    TrackWorkerTraining(true, messageId, trainingStatus, {
      SuccessCallback: response => {
        if (response.ok) {
          goBack();
        }
      },
      FailureCallback: response => {
        console.log(response);
      },
    });
  }
  //-- end

  useEffect(() => {
    fetchTrainingMessage();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', backAction);
      fetchTrainingMessage();
    });
    return () => (
      unsubscribe(),
      BackHandler.removeEventListener('hardwareBackPress', backAction)
    );
  }, [isConfirm, isDontUnderStand]);

  return (
    <FlexContainer
      noPadding={true}
      statusBarColor={color.MAIN_BLUE}
      bottomSafeAreaColor={color.WHITE}>
      <MainHeader
        isDrawer={false}
        isBack
        backDisable={!(isConfirm || isDontUnderStand)}
        onPress={() =>
          isConfirm || isDontUnderStand
            ? goBack()
            : Alert.alert(
                'Attention',
                'You must complete tick box before closing this training message.',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  { text: 'OK', onPress: () => console.log('Ok Pressed') },
                ],
                { cancelable: false },
              )
        }
        tittle={strings('headerTraining')}
        navigation={navigation}
      />
      {isLoading ? (
        <LoadingView />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: color.WHITE,
            borderTopLeftRadius: sizes.BORDER_RADIOUS,
            borderTopRightRadius: sizes.BORDER_RADIOUS,
            padding: normalize(15),
            paddingBottom: 0,
          }}>
          <Content showsVerticalScrollIndicator={false}>
            <MessageItem
              isBorder={false}
              profileImage={result.sender}
              title={result.from}
              subtitle={result.title}
              date={result.created_at}
              isUnread={isUnread}
              profilePick={result?.profile_pic}
            />
            {result?.body?.map(itemData => {
              return <DetailItemView item={itemData} />;
            })}
            <View style={{ height: normalize(10) }} />
            <CheckBox
              disabled={isDisabled}
              onPress={() => {
                setConfirmBox(!isConfirm);
                setDontUnderStandBox(false);
                setTrainingStatus({
                  is_training_completed: true,
                });
              }}
              text={strings('confirmingInformationProvided')}
              isCheck={isConfirm}
            />
            <CheckBox
              disabled={isDisabled}
              onPress={() => {
                setConfirmBox(false);
                setDontUnderStandBox(!isDontUnderStand);
                setTrainingStatus({
                  require_more_training: true,
                });
              }}
              text={strings('doNotUnderstand')}
              isCheck={isDontUnderStand}
              style={{ marginTop: normalize(15) }}
            />
            {isShowButton ? (
              <Button
                btnTextColor={color.WHITE}
                styles={{ marginVertical: normalize(20) }}
                borderRadius={normalize(10)}
                backgroundColor={color.MAIN_BLUE}
                btnText={
                  isConfirm || isDontUnderStand
                    ? 'Confirm & Exit'
                    : 'close without saving'
                }
                onPress={() => {
                  isConfirm || isDontUnderStand
                    ? callTrainingStatus()
                    : goBack();
                }}
              />
            ) : (
              <View style={{ marginVertical: normalize(20) }} />
            )}
          </Content>
        </View>
      )}
    </FlexContainer>
  );
};

const mapActionCreators = {
  GetTrainingMessage,
  TrackWorkerTraining,
  MessageRead,
};

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
});

export default connect(
  mapStateToProps,
  mapActionCreators,
)(TrainingDetailScreen);
