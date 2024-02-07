//import liraries
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ProfileIcon} from '../../Assets';
import {FlexContainer, PlainText} from '../../Components';
import {MainHeader} from '../../Components/MainHeader';
import {navigate} from '../../Navigators/NavigationUtils';
import {color, normalize, sizes} from '../../Theme/theme';
import MessageItem from './../../Components/MessageItem';
import { strings } from '../../Helper/i18n';

// create a component
const TrainingScreen = () => {
  const data = [
    {
      img: ProfileIcon,
      title: 'Health & Safety',
      subtitle: 'keep up to date on site safety',
      date: 'Today',
      message: 'It was always the Monday mornings.',
      isUnread: true,
    },
    {
      img: ProfileIcon,
      title: 'Health & Safety',
      subtitle: 'keep up to date on site safety',
      date: 'Today',
      message: 'It was always the Monday mornings.',
    },
    {
      img: ProfileIcon,
      title: 'Health & Safety',
      subtitle: 'keep up to date on site safety',
      date: 'Today',
      message: 'It was always the Monday mornings.',
    },
    {
      img: ProfileIcon,
      title: 'Health & Safety',
      subtitle: 'keep up to date on site safety',
      date: 'Today',
      message: 'It was always the Monday mornings.',
      isUnread: true,
    },
    {
      img: ProfileIcon,
      title: 'Health & Safety',
      subtitle: 'keep up to date on site safety',
      date: 'Today',
      message: 'It was always the Monday mornings.',
      isUnread: true,
    },
    {
      img: ProfileIcon,
      title: 'Health & Safety',
      subtitle: 'keep up to date on site safety',
      date: 'Today',
      message: 'It was always the Monday mornings.',
    },
    {
      img: ProfileIcon,
      title: 'Health & Safety',
      subtitle: 'keep up to date on site safety',
      date: 'Today',
      message: 'It was always the Monday mornings.',
    },
    {
      img: ProfileIcon,
      title: 'Health & Safety',
      subtitle: 'keep up to date on site safety',
      date: 'Today',
      message: 'It was always the Monday mornings.',
    },
    {
      img: ProfileIcon,
      title: 'Health & Safety',
      subtitle: 'keep up to date on site safety',
      date: 'Today',
      message: 'It was always the Monday mornings.',
    },
  ];

  return (
    <FlexContainer
      noPadding={true}
      statusBarColor={color.BLUE_3}
      backgroundColor={color.BLUE_3}>
      <MainHeader
        isBack={true}
        tittle={strings('headerTraining')}
        backgroundColor={color.BLUE_3}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: color.WHITE,
          borderTopLeftRadius: normalize(20),
          borderTopRightRadius: normalize(20),
        }}>
        <FlatList
          ListEmptyComponent={
            <View
              style={{
                paddingTop: 20,
              }}>
              <PlainText textAlign={'center'}>EmptyList</PlainText>
            </View>
          }
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{height: normalize(20)}}
          contentContainerStyle={{paddingHorizontal: sizes.CONTAINER_PADDING}}
          keyExtractor={(item, index) => `${index}`}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({item, index}) => {
            return (
              <MessageItem
                item={item}
                numberOfLines={1}
                onPress={() => navigate('TranningDetailScreen')}
              />
            );
          }}
        />
      </View>
    </FlexContainer>
  );
};

// define your styles
const styles = StyleSheet.create({});

//make this component available to the app
export default TrainingScreen;
