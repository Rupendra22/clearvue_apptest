import { Container } from 'native-base';
import * as React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { color } from '../Theme/theme';

const FlexContainer = ({
  noPadding = true,
  children,
  containerStyle,
  backgroundColor = color.MAIN_BLUE,
  statusBarColor = color.MAIN_BLUE,
  bottomSafeAreaColor = color.WHITE,
  isDarkContent = false,
  translucent = false,
}) => {
  return (
    <>
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={isDarkContent ? 'dark-content' : 'light-content'}
        translucent={translucent}
        hidden={false}
      />
      <React.Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: statusBarColor}} />
        <SafeAreaView
          style={[styles.container, {backgroundColor: bottomSafeAreaColor}]}>
          <Container style={{backgroundColor: backgroundColor}}>
            <View
              style={[styles.body, containerStyle, noPadding && {padding: 0}]}>
              {children}
            </View>
          </Container>
        </SafeAreaView>
      </React.Fragment>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: color.background,
  },
});

export default FlexContainer;
