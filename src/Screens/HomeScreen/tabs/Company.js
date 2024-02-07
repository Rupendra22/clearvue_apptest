import React, {useEffect, useState} from 'react';
import {FlatList, View, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import {userID, workerID} from '../../../Helper/Utils';
import {addMessageReaction} from '../../../Store/UserActions/actions';
import {navigate} from '../../../Navigators/NavigationUtils';
import { noFeedFound } from '../../../Assets';
import {NoDataFoundImg, SocialFeedItem, Loader} from '../../../Components';
import {FetchUserFeed} from '../../../Store/UserActions';
import {color, sizes} from '../../../Theme/theme';
import { strings } from '../../../Helper/i18n';

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
});
const Company = ({FetchUserFeed, addMessageReaction, navigation}) => {
  const [data, setFeeds] = useState([]);
  const [offset, setOffset] = useState(1);
  const [maxResult, setMaxResult] = useState(10);
  const [maxCount, setMaxCount] = useState(100);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);

  //-- API Call
  function userFeeds(isLoading) {
    FetchUserFeed(isLoading, userID, 'client', offset, 10, {
      SuccessCallback: response => {
        setTimeout(() => setLoading(false), 200);
        if (response.ok && response?.result) {
          setMaxCount(response?.count ? response.count : 100);
          setFeeds(response?.result);
          setFeeds(
            offset == 1 ? response?.result : [...data, ...response?.result],
          );
        }
      },
      FailureCallback: response => {
        setTimeout(() => setLoading(false), 200);
        console.log(response);
      },
    });
  }

  function LoadMoreRandomData() {
    if (maxResult - maxCount > 12) {
      return;
    }
    setOffset(offset + 1);
    setMaxResult(maxResult + 10);
    userFeeds(false);
  }

  useEffect(() => {
    userFeeds(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      userFeeds(false);
    });
    return unsubscribe;
  }, [navigation]);
  //-- end

  function callAddMessageReaction(messageId, reaction) {
    let param = {
      reaction: reaction,
      worker_id: workerID,
    };

    addMessageReaction(false, userID, messageId, param, {
      SuccessCallback: response => {},
      FailureCallback: response => {
        console.log(response);
      },
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(false);
    userFeeds(false);
    setRefreshing(false);
  }, []);

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
              message={strings('noDataFoundCpny')}
            />
          )
        }
        contentContainerStyle={{}}
        keyExtractor={(item, index) => `${index}`}
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
              avatarImage={item?.sender}
              sender={item?.from}
              userName={item?.user_name}
              body={item?.body[0]}
              date={item?.created_at}
              profilePick={item?.profile_pic}
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
      {/* <Loader isLoading={isLoading} /> */}
    </View>
  );
};
const mapActionCreators = {
  FetchUserFeed,
  addMessageReaction,
};
export default connect(mapStateToProps, mapActionCreators)(Company);
