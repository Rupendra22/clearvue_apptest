//import liraries
import { Content } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import {
  awards,
  badges,
  halloffame,
  icAwardsNew,
  icBadgesNew,
  icHallOfFameNew,
  icKudosNew,
  kudos,
} from '../../Assets';
import { FlexContainer, Loader, LoaingView, PlainText } from '../../Components';
import { MainHeader } from '../../Components/MainHeader';
import { handleFailureCallback } from '../../Config';
import { strings } from '../../Helper/i18n';
import { AWARD, BADGE, KUDOS } from '../../Helper/Storage';
import { userID } from '../../Helper/Utils';
import { navigate } from '../../Navigators/NavigationUtils';
import { FetchUserProfile } from '../../Store/ProfileStore/actions';
import { color, Fonts, normalize, sizes } from '../../Theme/theme';

const HallofFameScreen = ({ navigation, FetchUserProfile, globalLoding }) => {
  const [count, setShifts] = useState(0);
  const [kudosCount, setKudos] = useState(0);
  const [badgeCount, setBadge] = useState(0);
  const [awardsCount, setAwards] = useState(0);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile(false);
    });
    fetchProfile(true);
    return () => unsubscribe();
  }, [navigation]);

  //-- API Call
  function fetchProfile(isLoading) {
    FetchUserProfile(isLoading, userID, {
      SuccessCallback: response => {
        setLoading(false);
        if (response.ok) {
          let data = response.data;
          setShifts(data?.shift_completed);
          setKudos(data?.appreciation?.recognition ?? 0);
          setAwards(data.appreciation?.awards ?? 0);
          setBadge(data?.appreciation?.badge ?? 0);
        }
      },
      FailureCallback: response => {
        setLoading(false);
        handleFailureCallback(response);
      },
    });
  }
  //-- end

  return (
    <FlexContainer>
      <MainHeader isDrawer tittle={''} navigation={navigation} />
      {isLoading ? (
        <LoaingView />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: color.WHITE,
            borderTopLeftRadius: normalize(20),
            borderTopRightRadius: normalize(20),
          }}>
          <Content
            style={{
              // flex: 1,
              // backgroundColor: color.BLUE_1,
              paddingHorizontal: sizes.CONTAINER_PADDING,
            }}>
            <Image
              resizeMode="contain"
              source={icHallOfFameNew}
              style={{
                width: normalize(220),
                alignSelf: 'center',
                height: normalize(120),
                marginTop: normalize(20),
                tintColor: color.MAIN_BLUE,
              }}
            />
            <View
              style={{ flexDirection: 'row', marginHorizontal: normalize(50) }}>
              <PlainText
                fontSize={sizes.FONT_SIZE_XLARGE}
                fontFamily={Fonts.medium}
                themeColor={color.MAIN_BLUE}>
                {strings('shiftsCompleted')}
              </PlainText>
              <View style={{ flex: 1 }} />
              <PlainText
                fontSize={sizes.FONT_SIZE_XLXLARGE}
                fontFamily={Fonts.bold}
                themeColor={color.MAIN_BLUE}>
                {count}
              </PlainText>
            </View>
            <View height={normalize(30)} />
            <RenderView
              item={{
                tittle: strings('listedKudos'),
                img: icKudosNew,
                value: kudosCount,
              }}
              onPress={() => {
                navigate('HallofFameDetailScreen', {
                  data: {
                    tittle: strings('listedKudos'),
                    id: KUDOS,
                    type: 'recognition',
                  },
                });
              }}
            />
            <View style={{ height: 10 }} />
            <RenderView
              item={{
                tittle: strings('listedAwards'),
                img: icAwardsNew,
                value: awardsCount,
              }}
              onPress={() => {
                navigate('HallofFameDetailScreen', {
                  data: {
                    tittle: strings('listedAwards'),
                    id: AWARD,
                    type: 'award',
                  },
                });
              }}
            />
            <View style={{ height: 10 }} />
            <RenderView
              item={{
                tittle: strings('listedBadges'),
                img: icBadgesNew,
                value: badgeCount,
              }}
              onPress={() => {
                navigate('HallofFameDetailScreen', {
                  data: {
                    tittle: strings('listedBadges'),
                    id: BADGE,
                    type: 'badge',
                  },
                });
              }}
            />
          </Content>
        </View>
      )}
    </FlexContainer>
  );

  function RenderView({ item, onPress }) {
    return (
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: color.MAIN_BLUE,
          borderRadius: normalize(8),
          padding: sizes.CONTAINER_PADDING,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          resizeMode="contain"
          source={item.img}
          style={{ width: normalize(50), height: normalize(50) }}
        />
        <View style={{ flex: 1, marginHorizontal: normalize(10) }}>
          <PlainText
            fontFamily={Fonts.semiBold}
            themeColor={color.WHITE}
            fontSize={sizes.FONT_SIZE_HLARGE}>
            {item.tittle}
          </PlainText>
        </View>
        <View
          style={{
            backgroundColor: color.ORANGE,
            paddingHorizontal: normalize(20),
            paddingVertical: normalize(4),
            borderRadius: normalize(20),
            width: normalize(105),
          }}>
          <PlainText
            textAlign={'center'}
            fontFamily={Fonts.bold}
            themeColor={color.WHITE}
            lineHeight={sizes.FONT_SIZE_XXMEDIUMLARGE}
            fontSize={sizes.FONT_SIZE_XXMEDIUMLARGE}>
            {item.value}
          </PlainText>
        </View>
      </Pressable>
    );
  }
};

// define your styles
const styles = StyleSheet.create({});

const mapActionCreators = {
  FetchUserProfile,
};

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});

export default connect(mapStateToProps, mapActionCreators)(HallofFameScreen);
