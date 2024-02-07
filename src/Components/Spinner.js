import React, { useEffect } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { spinner } from '../Assets';

const Spinner = () => {
  const spin = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {alignItems: 'center', justifyContent: 'center'},
      ]}>
      <Animated.Image style={{transform: [{rotate}]}} source={spinner} />
    </View>
  );
};

export default Spinner;
