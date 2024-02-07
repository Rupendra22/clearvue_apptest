import { Button, Input, Item } from 'native-base';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { PlainText } from '.';
import { color, Fonts, normalize, sizes } from '../Theme/theme';

const InputText = ({
  isTittle,
  tittle,
  leftText,
  imgRight,
  placeholder,
  onFocus,
  value,
  onBlur,
  onChangeText,
  onEndEditing,
  onSubmitEditing,
  secureTextEntry,
  imgRightClick,
  rightText,
  marginBottom,
  keyboardType,
  returnKeyType,
  error,
  isError,
  inputAccessoryViewID,
  inputRef,
  focusable,
  autoFocus,
  imgRightStyle,
  autoCapitalize = 'none',
  fontSize = sizes.FONT_SIZE_LARGE,
  rightTextPress,
  focusColor = color.BLUE_1,
  editable = true,
  borderBottomColor = color.WHITE,
  placeholderTextColor = color.WHITE,
  inputTextStyle
}) => {
  const [focus, setFocusState] = useState(false);

  return (
    <View style={{marginBottom: marginBottom || normalize(5)}}>
      {isTittle && (
        <>
          <PlainText
            textStyle={{
              left: sizes.FONT_SIZE_XX_SMALL,
            }}
            fontSize={sizes.FONT_SIZE_EXTRA_SMALL}
            fontFamily={Fonts.bold}>
            {`${tittle}`.toLocaleUpperCase()}
          </PlainText>
          <View height={normalize(8)} />
        </>
      )}
      <Item
        style={[
          {
            backgroundColor: color.transparent,
            borderBottomColor: borderBottomColor,
          },
        ]}>
        {leftText && (
          <PlainText
            textStyle={{paddingStart: normalize(20)}}
            fontSize={sizes.FONT_SIZE_LARGE}>
            {leftText}
          </PlainText>
        )}
        <Input
          caretHidden={false}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          ref={inputRef}
          inputAccessoryViewID={inputAccessoryViewID}
          secureTextEntry={secureTextEntry}
          focusable={focusable}
          autoFocus={autoFocus}
          onFocus={() => {
            setFocusState(true);
            onFocus;
          }}
          keyboardType={keyboardType}
          value={value}
          onBlur={() => {
            setFocusState(false);
            onBlur;
          }}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onChangeText={onChangeText}
          onEndEditing={onEndEditing}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          style={[{
            color: color.WHITE,
            fontSize: fontSize,
            opacity: 1,
            fontFamily: Fonts.regular,
          },inputTextStyle]}
        />
        {rightText && (
          <PlainText
            onPress={rightTextPress}
            themeColor={color.WHITE}
            fontFamily={Fonts.semiBold}
            textStyle={{paddingEnd: normalize(20)}}
            fontSize={sizes.FONT_SIZE_MEDIUM}>
            {rightText}
          </PlainText>
        )}
        {imgRight && (
          <Button
            onPress={imgRightClick}
            activeOpacity={1}
            transparent
            style={{
              borderWidth: 0,
              alignSelf: 'center',
              paddingEnd: normalize(20),
            }}>
            <Image
              resizeMode="contain"
              source={imgRight}
              style={[
                {height: normalize(20), width: normalize(20)},
                imgRightStyle,
              ]}
            />
          </Button>
        )}
      </Item>
      {isError && (
        <PlainText
          textStyle={{paddingEnd: normalize(8), marginTop: normalize(5)}}
          themeColor={color.MAIN_RED}
          textAlign={'right'}
          fontSize={sizes.FONT_SIZE_SMALL}
          fontFamily={Fonts.regular}>
          {error}
        </PlainText>
      )}
    </View>
  );
};

InputText.propTypes = {
  isTittle: PropTypes.bool,
  focusable: PropTypes.bool,
  autoFocus: PropTypes.bool,
  editable: PropTypes.bool,
  tittle: PropTypes.string,
  leftText: PropTypes.string,
  imgRight: PropTypes.any,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,
  onEndEditing: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  secureTextEntry: PropTypes.bool,
  imgRightClick: PropTypes.func,
  rightText: PropTypes.string,
  marginBottom: PropTypes.number,
  autoCapitalize: PropTypes.oneOf([
    'none',
    'sentences',
    'words',
    'characters',
    undefined,
  ]),
  keyboardType: PropTypes.oneOf([
    'default',
    'email-address',
    'numeric',
    'phone-pad',
    'number-pad',
    'decimal-pad',
  ]),
  returnKeyType: PropTypes.oneOf([
    'default',
    'go',
    'google',
    'join',
    'next',
    'route',
    'search',
    'send',
    'yahoo',
    'done',
    'emergency-call',
  ]),
  error: PropTypes.string,
};

InputText.defaultProps = {
  keyboardType: 'default',
  returnKeyType: 'default',
  focusable: false,
  autoFocus: false,
  autoCapitalize: undefined,
  editable: true,
};

const styles = StyleSheet.create({
  focusStyle: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
});

export default InputText;
