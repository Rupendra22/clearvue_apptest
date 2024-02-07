import * as React from 'react';
import {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Animated,
  TouchableOpacity,
} from 'react-native';
import PlainText from './PlainText';
import {Fonts, sizes,color} from '../Theme/theme';


const CollapseText = ({body}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [maxLines, setMaxLines] = useState(1);
  const animationHeight = useRef(new Animated.Value(0)).current;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const collapseView = () => {
    setMaxLines(1);
    Animated.timing(animationHeight, {
      duration: 1000,
      toValue: 80,
    }).start();
  };

  const expandView = () => {
    setMaxLines(null);
    Animated.timing(animationHeight, {
      duration: 1000,
      toValue: 1000,
    }).start();
  };
  useEffect(() => {
    console.log("collapsedx",collapsed)
    if (collapsed) {
      collapseView();
    } else {
      expandView();
    }
  }, [collapsed]);
  return (
    <View style={{overflow: 'hidden'}}>
      <Animated.View style={{maxHeight: animationHeight}}>
        <TouchableOpacity onPress={toggleCollapsed}>
          <PlainText
            numberOfLines={maxLines}
            ellipsizeMode="tail"
            fontSize={sizes.FONT_SIZE_MEDIUM}
            themeColor={color.ORANGE}>
            {body}
          </PlainText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default CollapseText;
