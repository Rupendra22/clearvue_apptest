import {Content} from 'native-base';
import React, {useEffect, useState} from 'react';
import {BackHandler, View} from 'react-native';
import {ProfileIcon} from '../../Assets';
import {
  Button,
  CheckBox,
  DetailItemView,
  FlexContainer,
  MessageItem,
} from '../../Components';
import {MainHeader} from '../../Components/MainHeader';
import { strings } from '../../Helper/i18n';
import {goBack} from '../../Navigators/NavigationUtils';
import {color, normalize} from '../../Theme/theme';
import {isNullOrUndefined, openLink} from './../../Helper/Utils';
import {sizes} from './../../Theme/theme';

const data = {
  img: ProfileIcon,
  title: 'Health & Safety',
  subtitle: 'keep up to date on site safety',
  date: 'Today',
  message: 'It was always the Monday mornings.',
};

const detailList = [
  {
    id: 1,
    text: 'Nulla pellentesque sem ut tincidunt congue. Duis vel scelerisque dolor, id aliquam nulla. Vestibulum et euismod nisi. Praesent tristique quam id auctor porttitor. Morbi non felis quis felis tristique lacinia quis nec neque. Quisque euismod urna est, id blandit ex vehicula vitae. Mauris accumsan, nisi eu fermentum mattis, lorem elit euismod magna, sed accumsan lorem urna non risus',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    url: null,
  },
  {
    id: 1,
    text: 'Nulla pellentesque sem ut tincidunt congue. Duis vel scelerisque dolor, id aliquam nulla. Vestibulum et euismod nisi. Praesent tristique quam id auctor porttitor. Morbi non felis quis felis tristique lacinia quis nec neque. Quisque euismod urna est, id blandit ex vehicula vitae. Mauris accumsan, nisi eu fermentum mattis, lorem elit euismod magna, sed accumsan lorem urna non risus',
    img: '',
    url: null,
  },
  {
    id: 1,
    text: '',
    img: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    url: 'http://www.example.com/',
  },
  {
    id: 1,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dictum varius libero, sit amet sagittis elit blandit vel. Nunc ultrices nibh tincidunt, ornare mi at, egestas magna. Vivamus quam justo, suscipit sit amet viverra condimentum, rutrum et est. Nulla ac diam posuere, viverra orci eu, maximus ex.',
    img: 'https://images.unsplash.com/photo-1503551723145-6c040742065b-v2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    url: null,
  },
  {
    id: 1,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dictum varius libero,',
    img: 'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1206&q=80',
    url: 'http://www.google.com/',
  },
];

const TranningDetailScreen = ({params, navigation}) => {
  const [isConfirm, setConfirmBox] = useState(false);
  const [isDontUnderStand, setDontUnderStandBox] = useState(false);

  const backAction = () => {
    if (!(isConfirm || isDontUnderStand)) {
      alert('You must complete tick box before closing this training message.');
    }
    return !(isConfirm || isDontUnderStand);
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [isConfirm, isDontUnderStand]);

  return (
    <FlexContainer noPadding={true} statusBarColor={color.BLUE_1} bottomSafeAreaColor={color.WHITE}>
      <MainHeader
        isDrawer={false}
        isBack
        backDisable={!(isConfirm || isDontUnderStand)}
        onPress={() =>
          isConfirm || isDontUnderStand
            ? goBack()
            : alert(
                'You must complete tick box before closing this training message.',
              )
        }
        tittle={strings('headerTraining')}
        navigation={navigation}
      />
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
          <MessageItem item={data} />
          {detailList.map((item, index) => {
            return (
              <DetailItemView
                key={`${index}`}
                urlPress={() => openLink(item.url)}
                image={!isNullOrUndefined(item?.img) && item?.img}
                url={item?.url}
                description={!isNullOrUndefined(item?.text) && item?.text}
              />
            );
          })}
          <View style={{height: normalize(10)}} />
          <CheckBox
            onPress={() => {
              setConfirmBox(!isConfirm);
              setDontUnderStandBox(false);
            }}
            text={strings('confirmingInformationProvided')}
            isCheck={isConfirm}
          />
          <CheckBox
            onPress={() => {
              setConfirmBox(false);
              setDontUnderStandBox(!isDontUnderStand);
            }}
            text={strings('doNotUnderstand')}
            isCheck={isDontUnderStand}
            style={{marginTop: normalize(15)}}
          />
          <Button
            btnTextColor={color.WHITE}
            styles={{marginVertical: normalize(20)}}
            borderRadius={normalize(10)}
            backgroundColor={color.BLUE_1}
            btnText={'close without saving'}
            onPress={() => goBack()}
          />
        </Content>
      </View>
    </FlexContainer>
  );
};

export default TranningDetailScreen;
