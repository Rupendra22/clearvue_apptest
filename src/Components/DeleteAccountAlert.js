import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Linking,
  ActivityIndicator,
} from 'react-native';
import * as theme from '../Theme/theme';
import PlainText from './PlainText';
import {applyStyleToText} from '../Helper/LocaleSupport';
import { strings } from '../Helper/i18n';

export function DeleteAccountAlert(props) {
  return (
    <View style={styles.logOutContainer}>
      {props.isLoaing && (
        <View style={{position: 'absolute'}}>
          <ActivityIndicator color={'red'} size={'large'} />
        </View>
      )}

      <View style={styles.logoutView}>
        <View style={styles.logoutTitle}>
          <PlainText
            fontFamily={theme.Fonts.medium}
            fontSize={theme.sizes.FONT_SIZE_XMEDIUM}
            themeColor={theme.color.LOGOUT_TEXT_COLOR}
            textAlign="center">
            {strings('deleteAccount')}
          </PlainText>
        </View>
        <View style={styles.logoutContent}>
          <PlainText
            lineHeight={theme.sizes.PRIMARY_LINE_HEIGHT}
            fontSize={theme.sizes.FONT_SIZE_LOW_MEDIUM}
            themeColor={theme.color.LOGOUT_TEXT_COLOR}
            fontFamily={theme.Fonts.regular}
            textAlign="center">
            {applyStyleToText(
              `${strings('deleteAccountText')} <b>Link.</b>`,
              [
                {
                  style: {
                    fontFamily: theme.Fonts.bold,
                    textDecorationLine: 'underline',
                    color: theme.color.MAIN_BLUE,
                  },
                  onPress: () =>
                    Linking.openURL('https://www.theclearvue.co.uk/privacy/'),
                },
              ],
              '<b>',
              '</b>',
              true,
            )}
          </PlainText>
        </View>
      </View>
      <View style={styles.logoutButtonContainer}>
        <View style={styles.logoutCancelButton}>
          <Pressable
            // hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            onPress={() => props.onCancel()}>
            <PlainText
              fontSize={theme.sizes.FONT_SIZE_XMEDIUM}
              themeColor={theme.color.LOGOUT_CANCEL}
              fontFamily={theme.Fonts.semiBold}
              textAlign="center">
              {strings('cancel')}
            </PlainText>
          </Pressable>
        </View>
        <View style={styles.logoutSubmitButton}>
          <Pressable
            // hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
            onPress={() => props.onSubmit()}>
            <PlainText
              fontSize={theme.sizes.FONT_SIZE_XMEDIUM}
              themeColor={theme.color.LOGOUT_SUBMIT}
              fontFamily={theme.Fonts.medium}
              textAlign="center">
              {strings('deleteLabel')}
            </PlainText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logOutContainer: {
    flexDirection: 'column',
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutView: {
    padding: theme.sizes.MODAL_PADDING,
  },
  logoutTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutContent: {
    flexDirection: 'row',
    marginTop: theme.normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonContainer: {
    // marginTop:theme.normalize(20),
    borderTopWidth: 1,
    borderColor: theme.color.MODAL_BACKDROP_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCancelButton: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    borderRightWidth: 1,
    borderColor: theme.color.MODAL_BACKDROP_COLOR,
  },
  logoutSubmitButton: {
    flex: 1,
    justifyContent: 'center',
  },
});
