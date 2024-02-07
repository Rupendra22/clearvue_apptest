import { Spinner } from 'native-base';
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import { color } from '../Theme/theme';

const LoadingView = ({}) => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:"center",backgroundColor:'white'}}>
     <Spinner color={color.BLUE_1}/>
    </View>
  );
};

export default LoadingView;
