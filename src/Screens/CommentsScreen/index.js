import {Button, Thumbnail} from 'native-base';
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  View,
  Platform,
  RefreshControl,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {send} from '../../Assets';
import {FlexContainer, MessageItem, PlainText, Loader} from '../../Components';
import {MainHeader} from '../../Components/MainHeader';
import {formateDate, userID} from '../../Helper/Utils';
import * as Utils from '../../Helper/Utils';
import {addComment, fetchComment} from '../../Store/UserActions';
import {strings} from './../../Helper/i18n';
import {color, Fonts, normalize, sizes, weight} from './../../Theme/theme';
import AutoGrowTextInputManager from './AutoGrowTextInputManager';
import {handleFailureCallback} from '../../Config';
import LoadingView from '../../Components/LoaingView';
import ProfileAvatar from '../../Components/ProfileAvatar';
import WhatsAppTextInput from '../../Components/WhatsAppTextInput';
import FastImage from 'react-native-fast-image';
import debounce from 'lodash/debounce';

class CommentsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageDetail: null,
      commentList: [],
      comment: '',
      isLoading: false,
      numberOfLines: 1,
      isRefreshing: false,
      page: 1,
      isListEnd: false,
      moreLoading: false,
      maxCount: 50,
      maxResult: 10,
    };
    this.addCommentCall = this.addCommentCall.bind(this);
    this.flatListRef = null;
  }

  componentDidMount() {
    let params = this.props.route.params;
    if (params) {
      this.setState(
        {
          messageDetail: params,
          isLoading: true,
        },
        () => this.callFetchComment(params?.id),
      );
    }
    this.getTextValueFromBody(params);
  }

  callFetchComment = (messageID, scrollToTop = false) => {
    let param = {
      page: this.state.page,
      limit: this.state.maxResult,
    };

    this.props.fetchComment(false, Utils.userID, messageID, param, {
      SuccessCallback: res => {
        this.setState({
          isLoading: false,
          isRefreshing: false,
          moreLoading: false,
        });
        if (res?.ok) {
          console.log('Count', res?.count);
          this.setState(
            {
              maxCount: res?.count ?? 50,
              commentList:
                this.state.page == 1
                  ? res?.comments
                  : [...this.state.commentList, ...res?.comments],
            },
            () => {
              if (scrollToTop) {
                this.flatListRef.scrollToOffset({animated: true, offset: 0});
                Keyboard.dismiss();
              }
            },
          );
        }
      },
      FailureCallback: res => {
        this.setState({
          isLoading: false,
          isRefreshing: false,
          moreLoading: false,
        });
        handleFailureCallback(res);
      },
    });
  };

  validateTextInput(text) {
    if (text.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  displayMessage(msg) {
    this.setState({sentMessage: msg});
    this.setState({messageText: ''});
  }

  addCommentCall = () => {
    const {comment, messageDetail, commentList} = this.state;
    let messageId = messageDetail?.id;

    let addedComment = comment.trim();
    if (addedComment == '') {
      return;
    }
    let param = {
      comment: addedComment,
      worker_id: String(Utils.workerID),
    };

    this.props.addComment(false, Utils.userID, messageId, param, {
      SuccessCallback: res => {
        this.setState(
          {
            comment: '',
            page: 1,
          },
          () => this.callFetchComment(messageId, true),
        );
      },
      FailureCallback: res => {
        handleFailureCallback(res);
      },
    });
  };

  getTextValueFromBody = params => {
    const resObject = params?.body?.[0].find(item => item.type === 'text');
    return resObject?.data;
  };

  renderHeaderComponent = () => {
    const {messageDetail} = this.state;
    return (
      <View
        style={{
          padding: sizes.CONTAINER_PADDING,
          borderBottomWidth: 0.5,
          borderBottomColor: color.SILVER,
        }}>
        <MessageItem
          isBorder={true}
          profileImage={messageDetail?.sender}
          title={messageDetail?.from}
          subtitle={messageDetail?.user_name}
          date={messageDetail?.created_at}
          isUnread={false}
          profilePick={messageDetail?.profile_pic}
          paddingBottom={0}
          fromCache={false}
        />
        <PlainText
          lineHeight={sizes.PRIMARY_LINE_HEIGHT}
          themeColor={color.BLACK}
          fontFamily={Fonts.medium}
          fontWeight={weight.FONT_WEIGHT_MEDIUM}
          fontSize={sizes.FONT_SIZE_MEDIUM}>
          {this.getTextValueFromBody(messageDetail)}
        </PlainText>
      </View>
    );
  };

  commentItemRow = ({item, index}) => {
    const fullName = `${item?.first_name} ${item?.last_name}`;
    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
        {item?.resource ? (
          <FastImage
            style={{
              width: normalize(40),
              height: normalize(40),
              backgroundColor: color.MAIN_BLUE,
              borderRadius: normalize(25),
            }}
            source={{
              uri: item?.resource,
              priority: FastImage.priority.normal,
            }}
          />
        ) : (
          <ProfileAvatar avatarText={Utils.getAvatarInitials(fullName)} />
        )}
        <View style={{width: 10}} />
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#f0f2f5',
              borderRadius: 20,
              padding: 10,
            }}>
            <View
              style={{
                paddingBottom: 5,
              }}>
              <PlainText
                fontFamily={Fonts.semiBold}
                textStyle={{flex: 1, marginRight: normalize(5)}}
                themeColor={color.BLACK}
                fontSize={sizes.FONT_SIZE_MEDIUM}>
                {fullName}
              </PlainText>
              <PlainText
                fontFamily={Fonts.regular}
                textStyle={{flex: 1}}
                themeColor={color.BLACK}
                lineHeight={sizes.FONT_SIZE_HLARGE}
                fontSize={sizes.FONT_SIZE_MEDIUM}>
                {item?.comment}
              </PlainText>
            </View>
          </View>
          {item?.created_at && (
            <PlainText
              textStyle={{marginTop: 5}}
              themeColor={color.SILVER}
              fontFamily={Fonts.medium}
              fontWeight={weight.FONT_WEIGHT_MEDIUM}
              fontSize={sizes.FONT_SIZE_MEDIUM}>
              {formateDate(item?.created_at, 'DD MMM YYYY')}
            </PlainText>
          )}
        </View>
      </View>
    );
  };

  renderFooterComponent = () => {
    return (
      <View
        style={{
          // backgroundColor: '#F6F8FD',
          backgroundColor: 'white',
          flexDirection: 'row',
          padding: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,

          elevation: 2,
        }}>
        <AutoGrowTextInputManager
          style={{
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(5),
            fontSize: 16,
            flex: 1,
            backgroundColor: '#f0f2f5',
            borderWidth: 0,
            borderRadius: 12,
            textAlignVertical: 'top',
            justifyContent: 'center',
          }}
          placeholder={'Your Message'}
          placeholderTextColor="#66737C"
          maxHeight={100}
          minHeight={40}
          enableScrollToCaret
          value={this.state.comment}
          state={this.state}
          onChangeText={text => {
            this.setState({comment: text}), console.log(text);
          }}
          ref={r => {
            this._textInput = r;
          }}
        />
        <View style={{width: normalize(25)}} />
        <Button transparent onPress={this.addCommentCall}>
          <Image
            source={send}
            style={{
              height: normalize(25),
              width: normalize(25),
              resizeMode: 'contain',
            }}
          />
        </Button>
      </View>
    );
  };

  refreshComment = () => {
    const {messageDetail} = this.state;
    this.setState({isRefreshing: true, page: 1}, () => {
      this.callFetchComment(messageDetail?.id);
    });
  };

  fetchMoreData = () => {
    const {maxCount, maxResult, page, messageDetail} = this.state;

    if (maxResult - maxCount > 10) {
      this.setState({moreLoading: false});
      return;
    }
    this.setState(
      {
        page: page + 1,
        maxResult: maxResult + 5,
        moreLoading: true,
      },
      () => this.callFetchComment(messageDetail?.id),
    );
  };

  renderFooter = () => {
    const {moreLoading} = this.state;
    return moreLoading ? (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator color={color.MAIN_BLUE} />
      </View>
    ) : (
      <></>
    );
  };

  render() {
    const {messageDetail, commentList, isRefreshing} = this.state;
    return (
      <FlexContainer backgroundColor="white">
        <MainHeader
          isBack={true}
          navigation={this.props.navigation}
          tittle={strings('comments')}
        />
        <KeyboardAvoidingView
          enabled
          style={{flex: 1}}
          keyboardVerticalOffset={
            Platform.OS === 'android' ? normalize(32) : 47
          }
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
          <FlatList
            data={commentList}
            ref={ref => {
              this.flatListRef = ref;
            }}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={this.renderHeaderComponent()}
            renderItem={this.commentItemRow}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.refreshComment}
              />
            }
            onEndReachedThreshold={0.2}
            onEndReached={() => this.fetchMoreData()}
            ListFooterComponent={this.renderFooter}
          />

          {this.renderFooterComponent()}
        </KeyboardAvoidingView>
        <Loader loading={this.state.isLoading} />
      </FlexContainer>
    );
  }
}

const mapActionCreators = {addComment, fetchComment};
const mapStateToProps = state => {
  return {
    globalLoading: state.global.loading,
  };
};
export default connect(mapStateToProps, mapActionCreators)(CommentsScreen);
