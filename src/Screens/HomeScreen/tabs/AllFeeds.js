import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View, Image} from 'react-native';
import {connect} from 'react-redux';
import {userID, workerID} from '../../../Helper/Utils';
import {FetchUserFeed, addMessageReaction} from '../../../Store/UserActions';
import {navigate} from './../../../Navigators/NavigationUtils';
import {
  NoDataFound,
  SocialFeedItem,
  Loader,
  PlainText,
  NoDataFoundImg,
} from '../../../Components';
import {color, Fonts, normalize, sizes, weight} from '../../../Theme/theme';
import messaging from '@react-native-firebase/messaging';
import {noFeedFound} from '../../../Assets';
import {strings} from '../../../Helper/i18n';

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
});

const AllFeeds = ({
  FetchUserFeed,
  globalLoding,
  navigation,
  addMessageReaction,
}) => {
  const [data, setFeeds] = useState([]);
  const [isRefreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(1);
  const [maxResult, setMaxResult] = useState(10);
  const [maxCount, setMaxCount] = useState(100);
  const [isLoading, setLoading] = useState(true);

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  //-- API Call
  function userFeeds(isLoading) {
    FetchUserFeed(isLoading, userID, 'general', offset, 10, {
      SuccessCallback: response => {
        setTimeout(() => setLoading(false), 1000);
        if (response.ok && response?.result) {
          setMaxCount(response?.count ? response.count : 100);
          setFeeds(
            offset == 1 ? response?.result : [...data, ...response?.result],
          );
        }
      },
      FailureCallback: response => {
        setTimeout(() => setLoading(false), 1000);
        console.log(response);
      },
    });
  }

  function callAddMessageReaction(messageId, reaction) {
    let param = {
      reaction: reaction,
      worker_id: workerID,
    };

    addMessageReaction(false, userID, messageId, param, {
      SuccessCallback: response => {},
      FailureCallback: response => {},
    });
  }

  function onReactionClick(value, item) {
    let currentReaction = item?.reactions?.current_user_reaction;
    let reaction;
    if (value == 'LIKE' && currentReaction === 'LIKE') {
      reaction = 1;
    } else if (value == 'DISLIKE' && currentReaction === 'DISLIKE') {
      reaction = 2;
    } else if (currentReaction == null) {
      reaction = value;
    }
    console.log({reaction});
    callAddMessageReaction(reaction);
  }

  function onLikeClick() {}

  function LoadMoreRandomData() {
    if (maxResult - maxCount > 12) {
      return;
    }
    setOffset(offset + 1);
    setMaxResult(maxResult + 10);
    userFeeds(false);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(false);
    userFeeds(false);
    setRefreshing(false);
  }, []);
  //-- end

  useEffect(() => {
    userFeeds(false);
    setLoading(true);
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      userFeeds(false);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: data.length > 0 ? color.WHITE : color.MAIN_BLUE,
      }}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          isLoading ? null : (
            <NoDataFoundImg
              imgSource={noFeedFound}
              message={strings('noDataFoundAllFeed')}
            />
          )
        }
        contentContainerStyle={{}}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        data={data}
        onEndReachedThreshold={0.5}
        onEndReached={() => LoadMoreRandomData()}
        ItemSeparatorComponent={() => (
          <View
            style={{backgroundColor: color.SILVER, height: sizes.BORDER_HEIGHT}}
          />
        )}
        renderItem={({item, index}) => {
          return (
            <SocialFeedItem
              item={item}
              index={index}
              avatarImage={item?.sender}
              profilePick={item?.profile_pic}
              sender={item?.from}
              userName={item?.user_name}
              body={item?.body[0]}
              date={item?.created_at}
              onCommentClick={() => navigate('CommentsScreen', item)}
              showComment={item?.is_comment_allowed == 1}
              reactions={item?.reactions}
              getCurrentReaction={(messageId, value) => {
                callAddMessageReaction(messageId, value);
              }}
            />
          );
        }}
      />
      <Loader isLoading={isLoading} />
    </View>
  );
};
const mapActionCreators = {
  FetchUserFeed,
  addMessageReaction,
};
export default connect(mapStateToProps, mapActionCreators)(AllFeeds);
