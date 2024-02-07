import React from 'react';
import {Image, Pressable, View} from 'react-native';
import {PlainText} from '.';
import {
  drawer_icon,
  icBack,
  icFeatherRound,
  icLogo,
  icProfileNew,
} from '../Assets';
import {goBack, navigate} from '../Navigators/NavigationUtils';
import * as theme from '../Theme/theme';

function MainHeader({
  statusBarColor = 'transparent',
  barStyle = 'default',
  rightImgSource,
  navigation,
  isBack,
  isDrawer,
  nextAction,
  onPress,
  isTittle,
  tittle,
  tintColor = theme.color.WHITE,
  backgroundColor = theme.color.MAIN_BLUE,
  themeColor = theme.color.WHITE,
  isLogo,
  backDisable = false,
  tittleIcon,
}) {
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        height: theme.normalize(60),
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{flex: 1, paddingStart: theme.normalize(20)}}>
        {isBack ? (
          <Pressable
            // disabled={backDisable}
            onPress={() => {
              backDisable ? onPress() : goBack();
            }}>
            <Image
              source={icBack}
              resizeMode="contain"
              style={{
                width: theme.normalize(24),
                height: theme.normalize(24),
                tintColor: tintColor,
              }}
            />
          </Pressable>
        ) : null}
        {isDrawer ? (
          <Pressable onPress={() => navigation.openDrawer()}>
            <Image
              source={drawer_icon}
              resizeMode="contain"
              style={{
                width: theme.normalize(22),
                height: theme.normalize(22),
                tintColor: tintColor,
              }}
            />
          </Pressable>
        ) : null}
      </View>
      <View
        style={{
          flex: 8,
          paddingHorizontal: theme.normalize(5),
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        {tittleIcon ? (
          <>
            <Image
              source={tittleIcon}
              resizeMode={'contain'}
              style={{
                width: theme.normalize(25),
                height: theme.normalize(25),
                tintColor: 'white',
              }}
            />
            <View style={{width: theme.normalize(8)}} />
          </>
        ) : (
          <></>
        )}

        {!isLogo && tittle ? (
          <PlainText
            numberOfLines={1}
            themeColor={themeColor}
            fontSize={theme.sizes.FONT_SIZE_XXMEDIUM}
            fontFamily={theme.Fonts.bold}>
            {tittle}
          </PlainText>
        ) : (
          <></>
        )}
        {isLogo ? (
          <Image
            source={{
              uri: isLogo,
            }}
            resizeMode={'contain'}
            style={{width: theme.normalize(75), height: theme.normalize(60)}}
          />
        ) : (
          <></>
        )}
        {tittleIcon ? (
          <>
            <View style={{width: theme.normalize(33)}} />
          </>
        ) : (
          <></>
        )}
      </View>

      <View style={{flex: 1, paddingStart: theme.normalize(20)}}>
        {rightImgSource ? (
          <Pressable>
            <Image
              source={rightImgSource}
              resizeMode="contain"
              style={{
                width: theme.normalize(24),
                height: theme.normalize(24),
                tintColor: tintColor,
              }}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function HeaderWithDetail({
  tintColor = 'white',
  rewardClick,
  rewardAmmount = 0,
}) {
  return (
    <View
      style={{
        flex: 0,
        padding: theme.sizes.CONTAINER_PADDING,
        paddingBottom: theme.sizes.CONTAINER_PADDING * 2,
      }}>
      <>
        <View
          style={{
            alignContent: 'center',
            flexDirection: 'row',
          }}>
          <Image
            source={icLogo}
            resizeMode="contain"
            style={{
              height: theme.normalize(45),
              width: theme.normalize(110),
              tintColor: tintColor,
            }}
          />
          <View style={{flex: 1}} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Pressable
              onPress={rewardClick}
              style={{
                flexDirection: 'row',
                borderRadius: 50,
                paddingVertical: theme.normalize(5),
                paddingHorizontal: theme.normalize(10),
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.13)',
              }}>
              <Image
                style={{
                  height: theme.normalize(15),
                  width: theme.normalize(15),
                }}
                source={icFeatherRound}
              />
              <View width={5} />
              <Pressable
                onPress={() => {
                  navigate('ReferAndEarnScreen');
                }}>
                <PlainText
                  fontSize={theme.sizes.FONT_SIZE_LOW_MEDIUM}
                  themeColor={theme.color.WHITE}>
                  Get {rewardAmmount}
                </PlainText>
              </Pressable>
            </Pressable>
            <View width={theme.normalize(15)} />
          </View>
        </View>
      </>
    </View>
  );
}
export {MainHeader, HeaderWithDetail};
