import {Body, CardItem, Left, Right, Button} from 'native-base';
import * as React from 'react';
import {
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {formateDate, openLink} from '../Helper/Utils';
import {Fonts, sizes, normalize} from '../Theme/theme';
import {color} from './../Theme/theme';
import CollapseText from './CollapseText';
import PlainText from './PlainText';
import ProfileAvatar from './ProfileAvatar';
import SocialImageView from './SocialImageView';
import FastImage from 'react-native-fast-image';
import {icComment, icLike, icLikeFill} from '../Assets';
import SocialIFeedHeader from './SocialIFeedHeader';

const SocialFeedItem = ({
  item,
  avatarImage,
  sender,
  body,
  userName,
  date,
  profilePick,
  onLikeClick,
  onDisLikeClick,
  onCommentClick,
  showComment,
  reactions,
  getCurrentReaction,
}) => {
  const [expanded, setExpanded] = React.useState(true);
  const animationHeight = React.useRef(new Animated.Value(2)).current;
  const [currentReaction, setCurrentReaction] = React.useState(
    reactions?.current_user_reaction,
  );
  const [likeCount, setLikeCount] = React.useState(reactions?.LIKE);
  const [disLikeCount, setDisLikeCount] = React.useState(reactions?.DISLIKE);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  React.useEffect(() => {
    setCurrentReaction(reactions?.current_user_reaction);
    setLikeCount(reactions?.LIKE);
    setDisLikeCount(reactions?.DISLIKE);
  }, [reactions]);

  function getLikeCount() {
    let _likeCount = likeCount;
    return _likeCount;
  }
  function onReactionClick(value) {
    let reaction;
    if (value == 'LIKE' && currentReaction === 'LIKE') {
      reaction = null;
      setCurrentReaction(null);
      setLikeCount(likeCount - 1 < 0 ? 0 : likeCount - 1);
    } else if (value == 'DISLIKE' && currentReaction === 'DISLIKE') {
      reaction = null;
      setCurrentReaction(null);
      setDisLikeCount(disLikeCount - 1 < 0 ? 0 : disLikeCount - 1);
    } else if (value == 'LIKE' && currentReaction === 'DISLIKE') {
      reaction = 'LIKE';
      setCurrentReaction('LIKE');
      setLikeCount(likeCount + 1);
      setDisLikeCount(disLikeCount - 1);
    } else if (value == 'DISLIKE' && currentReaction === 'LIKE') {
      reaction = 'DISLIKE';
      setCurrentReaction('DISLIKE');
      setLikeCount(likeCount - 1);
      setDisLikeCount(disLikeCount + 1);
    } else if (currentReaction == null) {
      reaction = value;
      setCurrentReaction(value);
      if (value == 'LIKE') {
        setLikeCount(likeCount + 1);
      } else if (value == 'DISLIKE') {
        setDisLikeCount(disLikeCount + 1);
      }
    }
    getCurrentReaction(item?.id, reaction);
  }
  React.useEffect(() => {
    if (expanded) {
      Animated.timing(animationHeight, {
        duration: 1000,
        toValue: 60,
        easing: Easing.linear,
      }).start();
    } else {
      Animated.timing(animationHeight, {
        duration: 1000,
        toValue: 5,
        easing: Easing.linear,
      }).start();
    }
  }, [expanded]);
  return (
    <View
      style={{
        flex: 0,
        elevation: 0,
        // borderBottomWidth: 1,
        marginBottom: 5,
        borderBottomColor: color.SILVER,
      }}>
      <CardItem
        style={{
          marginLeft: 0,
          marginRight: 0,
          borderBottomColor: color.SILVER,
        }}>
        <SocialIFeedHeader
          avatarImage={avatarImage}
          profilePick={profilePick}
          sender={sender}
          date={date}
          userName={userName}
        />
      </CardItem>

      {body?.map((itemData, index) => {
        if (itemData.type == 'text') {
          return (
            <>
              <CardItem
                key={`${index}`}
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  paddingTop: 0,
                }}>
                <PlainText
                  lineHeight={sizes.PRIMARY_LINE_HEIGHT}
                  themeColor={color.BLACK}
                  fontFamily={Fonts.semiBold}
                  fontSize={sizes.FONT_SIZE_MEDIUM}>
                  {itemData.data}
                </PlainText>
              </CardItem>
            </>
          );
        }

        if (itemData.type == 'link') {
          return (
            <>
              <CardItem
                key={`${index}`}
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  paddingTop: 0,
                }}>
                <PlainText
                  fontSize={sizes.FONT_SIZE_MEDIUM}
                  themeColor={color.BLUE_1}
                  fontFamily={Fonts.bold}
                  textStyle={{textDecorationLine: 'underline'}}
                  onPress={() => {
                    openLink(itemData.data);
                  }}>
                  {itemData.data}
                </PlainText>
              </CardItem>
            </>
          );
        }

        if (itemData.type === 'media') {
          return (
            <>
              <SocialImageView image={itemData?.data} />
            </>
          );
        }
      })}

      <View
        style={{
          paddingHorizontal: sizes.CONTAINER_PADDING,
          flexDirection: 'row',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Button
            transparent
            style={{marginRight: 10}}
            onPress={() => onReactionClick('LIKE')}>
            <Image
              source={currentReaction === 'LIKE' ? icLikeFill : icLike}
              style={{height: 20, width: 20, tintColor: color.MAIN_BLUE}}
            />
          </Button>
          <PlainText themeColor={color.MAIN_BLUE}>{getLikeCount()}</PlainText>
        </View>
        <View
          style={{
            alignSelf: 'center',
            marginHorizontal: 10,
          }}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Button
            transparent
            style={{marginRight: 10}}
            onPress={() => onReactionClick('DISLIKE')}>
            <Image
              source={currentReaction === 'DISLIKE' ? icLikeFill : icLike}
              style={{
                height: 20,
                width: 20,
                tintColor: color.MAIN_BLUE,
                transform: [{rotate: '180deg'}],
              }}
            />
          </Button>
          <PlainText themeColor={color.MAIN_BLUE}>{disLikeCount}</PlainText>
        </View>
        <View style={{flex: 1}} />

        <Button transparent onPress={onCommentClick} disabled={!showComment}>
          <Image
            source={icComment}
            style={{
              height: 20,
              width: 20,
              marginRight: 10,
              tintColor: showComment ? color.MAIN_BLUE : color.GREY,
            }}
          />
          <PlainText
            fontFamily={Fonts.regular}
            themeColor={showComment ? color.MAIN_BLUE : color.GREY}>
            Comment
          </PlainText>
        </Button>
      </View>
    </View>
  );
};

export default SocialFeedItem;
