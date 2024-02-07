import ReactNative from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import I18n from 'react-native-i18n';

import al from '../locales/al.json';
import bg from '../locales/bg.json';
import bl from '../locales/bl.json';
import cz from '../locales/cz.json';
import ee from '../locales/ee.json';
import er from '../locales/er.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import gb from '../locales/gb.json';
import hi from '../locales/hi.json';
import it from '../locales/it.json';
import lt from '../locales/lt.json';
import lv from '../locales/lv.json';
import np from '../locales/np.json';
import pk from '../locales/pk.json';
import pl from '../locales/pl.json';
import pt from '../locales/pt.json';
import ro from '../locales/ro.json';
import si from '../locales/si.json';
import sk from '../locales/sk.json';
import en from '../locales/en.json';
import ukr from '../locales/ukr.json';
import hu from '../locales/hu.json';

import {LANGUAGE} from './Storage';

// Should the app fallback to English if user locale doesn't exists
I18n.defaultLocale = 'en';
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
  al,
  bg,
  bl,
  cz,
  ee,
  er,
  es,
  fr,
  gb,
  hi,
  it,
  lt,
  lv,
  np,
  pk,
  pl,
  pt,
  ro,
  si,
  sk,
  ukr,
  hu
};

// If language selected get locale
getUserPreferableLocale();

// Uncomment this for using RTL
//const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = true; // currentLocale.indexOf('jaJp') === 0;

// Set locale
export async function setLocale(locale) {
  I18n.locale = locale;
  await AsyncStorage.setItem(LANGUAGE, locale);
}

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  return I18n.t(name, params);
}

// Allow persist locale after app closed
async function getUserPreferableLocale() {
  const locale = await AsyncStorage.getItem(LANGUAGE);
  console.log("getUserPreferableLocale",locale)
  if (locale) {
    I18n.locale = locale;
  }
}

export default I18n;
