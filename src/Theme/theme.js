import {Dimensions} from 'react-native';
import {widthPercentageToDP as wp} from '../Helper/ResponsiveSize';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const scaleWidth = SCREEN_WIDTH / 375;
export const scaleHeight = SCREEN_HEIGHT / 812;
export const _scale = Math.min(scaleWidth, scaleHeight);
export function normalize(size) {
  return Math.ceil(size * _scale);
}

export const sizes = {
  FONT_SIZE_XX_SMALL: wp('2.7'), //10
  FONT_SIZE_EXTRA_SMALL: wp('2.9'), //11,
  FONT_SIZE_SMALL: wp('3.2'), //12
  FONT_SIZE_LOW_MEDIUM: wp('3.3'), //13
  FONT_SIZE_MEDIUM: wp('3.6'), //14
  FONT_SIZE_LARGE: wp('4.1'), //16
  FONT_SIZE_HLARGE: wp('4.6'), //18
  FONT_SIZE_XLARGE: wp('5.1'), //20
  FONT_SIZE_MARGE: wp('5.7'), //22
  FONT_SIZE_XXLARGE: normalize(36),
  FONT_SIZE_XXXLARGE: normalize(44),
  FONT_SIZE_XMEDIUM: normalize(17),
  FONT_SIZE_XXMEDIUM: wp('5.1'), //20
  FONT_SIZE_XXMEDIUMLARGE: wp('6.1'), //24
  FONT_SIZE_XXXMEDIUMLARGE: wp('7.5'), //31
  FONT_SIZE_XXLMEDIUMLARGE: wp('6.4'), //25
  FONT_SIZE_XLXLARGE: wp('8.7'), //34
  FONT_SIZE_XLMEDIUMLARGE: wp('6.7'), //26
  FONT_SIZE_XXVMEDIUMLARGE: wp('7'), //27
  PRIMARY_BTN_HEIGHT: wp('13'), //55,
  SECONDARY_BTN_HEIGHT: wp('7.5'), //30,
  PRIMARY_LINE_HEIGHT: wp('5.1'), //20
  LINE_HEIGHT_22: wp('5.7'), //22
  TITLE_LINE_HEIGHT: wp('8.7'), //34
  SECONDARY_LINE_HEIGHT: wp('6.1'), //24
  BORDER_CONTAINER: normalize(8), //35
  CONTAINER_MARGIN_TOP: normalize(15),
  BTN_MARGIN_TOP: normalize(20),
  BORDER_RADIOUS: normalize(20),
  BTN_BORDER_RADIOUS: normalize(30),
  BASE: normalize(10),
  CONTAINER_RADIUS: normalize(Platform.OS === 'android' ? 18 : 9) * 2,
  SCREEN_WIDTH: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT,
  SCREEN_HEIGHT: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_HEIGHT : SCREEN_WIDTH,
  CONTAINER_PADDING: normalize(20),
  MAIN_RADIOUS: normalize(24),
  CONTAINER_PADDING_VERTICAL: normalize(24),
  TAB_BAR_HEIGHT: normalize(90),
  MODAL_PADDING: normalize(28),
  BORDER_HEIGHT: normalize(5),
  BORDER_SMALL_HEIGHT: 1,
};

export const weight = {
  FONT_WEIGHT_BLACK: '900',
  FONT_WEIGHT_NULL: null,
  FONT_WEIGHT_HEAVY: '800',
  FONT_WEIGHT_BOLD: '700',
  FONT_WEIGHT_SEMIBOLD: '600',
  FONT_WEIGHT_NORMAL: 'normal',
  FONT_WEIGHT_MEDIUM: '500',
  FONT_WEIGHT_REGULAR: '400',
};

export const color = {
  WHITE: '#FFFFFF',
  WHITE_10: 'rgba(255,255,255,0.70)',
  SILVER: '#C5C9CB',
  MAIN_BLUE: '#0072FF',
  DARK_BLUE: '#3DABFF',
  BLUE_1: '#00C6FF',
  BLUE_2: '#9CE8FD',
  BLUE_3: '#5CC9FF',
  BLUE_4: '#124684',
  BLUE_5: '#00124684',
  BLUE_6: '#D2EDF6',
  BLACK: '#000000',
  ORANGE: '#EF7348',
  MAIN_GREY: '#CCD6DD',
  GREEN: '#161616',
  GREY: '#808080',
  MAIN_DARK: '#0C0C0C',
  MAIN_RED: '#FC3400',
  MAIN_GREEN: '#0A8300',
  ORANGE: '#EFB216',
  DARK1_GREY: 'rgb(88,89,91)',
  _0078ff: '#0078ff',
  LOGOUT_TEXT_COLOR: '#2E2C34', // MAIN_DARK
  LOGOUT_CANCEL: '#00A5FF', // MAIN_BLUE
  LOGOUT_SUBMIT: '#FC3400', // MAIN_RED
  MODAL_BACKDROP_COLOR: 'rgba(0,0,0,0.1)',
  MODAL_BACKDROP_COLOR1: 'rgba(0,0,0,0.3)',
  BLOCK_COLOR: '#e4e4e4',
};

export const Fonts = {
  regular: 'Raleway-Regular',
  light: 'Raleway-Thin',
  bold: 'Raleway-Bold',
  black: 'Raleway-Black',
  italic: 'Raleway-Italic',
  semiBold: 'Raleway-SemiBold',
  extraBold: 'Raleway-ExtraBold',
  extraLight: 'Raleway-ExtraLight',
  medium: 'Raleway-Medium',
};
