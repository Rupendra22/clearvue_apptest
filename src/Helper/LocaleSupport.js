import React from 'react';
import { Text } from 'react-native';

export const applyStyleToText = (
  data,
  placeholderStyle,
  starttag,
  endtag,
  isShift,
) => {
  let higherUsage = data;
  let convertedtext = '';

  while (higherUsage != '') {
    if (higherUsage.indexOf(starttag) >= 0) {
      let text = higherUsage.split(starttag)[0];
      let placeeholder = higherUsage.split(starttag)[1].split(endtag)[0];
      let remaining = higherUsage.split(endtag);
      remaining.shift();
      higherUsage = remaining.join(endtag);
      if (placeholderStyle.length > 0) {
        if (placeholderStyle[0].onPress) {
          convertedtext = (
            <Text>
              {convertedtext}
              {text}
              <Text
                style={placeholderStyle[0].style}
                onPress={placeholderStyle[0].onPress}>
                {placeeholder}
              </Text>
            </Text>
          );
        } else {
          convertedtext = (
            <Text>
              {convertedtext}
              {text}
              <Text style={placeholderStyle[0].style}>{placeeholder}</Text>
            </Text>
          );
        }
      }
      {
        isShift && placeholderStyle.shift();
      }
    } else {
      convertedtext = (
        <Text>
          {convertedtext}
          {higherUsage}
        </Text>
      );
      higherUsage = '';
    }
  }
  return convertedtext;
};



export const applyStyleToTextOnPress = (
  data,
  placeholderStyle,
  starttag,
  endtag,
  isShift,
) => {
  let higherUsage = data;
  let convertedtext = '';

  while (higherUsage != '') {
    if (higherUsage.indexOf(starttag) >= 0) {
      let text = higherUsage.split(starttag)[0];
      let placeeholder = higherUsage.split(starttag)[1].split(endtag)[0];
      let remaining = higherUsage.split(endtag);
      remaining.shift();
      higherUsage = remaining.join(endtag);
      if (placeholderStyle.length > 0) {
        if (placeholderStyle[0].onPress) {
          convertedtext = (
            <Text>
              {convertedtext}
              {text}
              <Text
                style={placeholderStyle[0].style}
                onPress={() => placeholderStyle[0].onPress(placeeholder)}>
                {placeeholder}
              </Text>
            </Text>
          );
        } else {
          convertedtext = (
            <Text>
              {convertedtext}
              {text}
              <Text style={placeholderStyle[0].style}>{placeeholder}</Text>
            </Text>
          );
        }
      }
      {
        isShift && placeholderStyle.shift();
      }
    } else {
      convertedtext = (
        <Text>
          {convertedtext}
          {higherUsage}
        </Text>
      );
      higherUsage = '';
    }
  }
  return convertedtext;
};
