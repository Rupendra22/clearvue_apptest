//import liraries
import React, {useState} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {halloffame, icHallOfFameNew} from '../../Assets';
import {FlexContainer, Loader, NoDataFound} from '../../Components';
import LoadingView from '../../Components/LoaingView';
import {MainHeader} from '../../Components/MainHeader';
import MessageItem from '../../Components/MessageItem';
import {handleFailureCallback} from '../../Config';
import {BADGE, SURVEY_CODE, TRANINING} from '../../Helper/Storage';
import {userID} from '../../Helper/Utils';
import {navigate} from '../../Navigators/NavigationUtils';
import {FetchUserMessage} from '../../Store/UserActions';
import {color, normalize, sizes} from '../../Theme/theme';
import AsyncStorage from '@react-native-community/async-storage';

// create a component
const HallofFameDetailScreen = ({
  route,
  param,
  navigation,
  FetchUserMessage,
  globalLoding,
}) => {
  const {data} = route.params;
  const [type, setType] = useState();
  const [message, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //-- API call
  async function fetchMessages(isLoading) {
    setIsLoading(isLoading);
    let surveyCode = await AsyncStorage.getItem(SURVEY_CODE);

    if (surveyCode === '' || surveyCode === null || surveyCode === undefined) {
      surveyCode = 'en';
    }

    const _type = data?.type ? data?.type : type;
    FetchUserMessage(isLoading, userID, _type, surveyCode, {
      SuccessCallback: response => {
        setIsLoading(false);
        if (response.ok) {
          setMessages(response?.result);
        }
      },
      FailureCallback: response => {
        setIsLoading(false);
        handleFailureCallback(response);
      },
    });
  }
  //-- end

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setType(data?.type);
      fetchMessages(false);
    });
    setType(data?.type);
    fetchMessages(true);
    return () => unsubscribe();
  }, [type]);

  function navigateUser(item) {
    if (data?.id == BADGE && item?.type === TRANINING) {
      navigate('TrainingDetailScreen', {item: item});
      return;
    }

    navigate('MessageDetailScreen', {item: item});
  }
  return (
    <FlexContainer noPadding={true}>
      <MainHeader isBack={true} tittle={data?.tittle} />

      <>
        <Image
          resizeMode="contain"
          source={icHallOfFameNew}
          style={{
            width: normalize(220),
            alignSelf: 'center',
            height: normalize(120),
            marginVertical: normalize(20),
            tintColor: color.WHITE,
          }}
        />

        <View
          style={{
            flex: 1,
            backgroundColor: color.WHITE,
            marginTop: normalize(10),
            borderTopLeftRadius: normalize(20),
            borderTopRightRadius: normalize(20),
          }}>
          <FlatList
            ListEmptyComponent={isLoading ? <LoadingView /> : <NoDataFound />}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{height: normalize(20)}}
            keyExtractor={(item, index) => `${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: sizes.CONTAINER_PADDING,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  backgroundColor: color.SILVER,
                  height: sizes.BORDER_SMALL_HEIGHT,
                }}
              />
            )}
            data={message}
            renderItem={({item, index}) => {
              return (
                <MessageItem
                  title={item?.from}
                  subtitle={item?.title}
                  profileImage={item?.sender}
                  message={item?.body[0]?.[0]?.data}
                  date={item?.created_at}
                  isUnread={item?.is_message_read}
                  onPress={() => navigateUser(item)}
                  profilePick={item?.profile_pic}
                  numberOfLines={1}
                />
              );
            }}
          />
        </View>
      </>
    </FlexContainer>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.BLUE_1,
  },
});

const mapActionCreators = {
  FetchUserMessage,
};
const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});
//make this component available to the app
export default connect(
  mapStateToProps,
  mapActionCreators,
)(HallofFameDetailScreen);
