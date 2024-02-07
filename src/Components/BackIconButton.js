import {Button} from 'native-base';
import * as React from 'react';
import {Image} from 'react-native';
import {icBack} from '../Assets';
import { goBack } from '../Navigators/NavigationUtils';

import * as theme from '../Theme/theme';

function BackIconButton({onPress, imageIcon, containerStyle}) {
  return (
    <Button
      onPress={onPress ? onPress : () => goBack()}
      transparent
      style={[
        {
          position: 'absolute',
          top: theme.sizes.CONTAINER_PADDING * 2.2,
          left: theme.sizes.CONTAINER_PADDING,
          zIndex:10000
        },
        containerStyle,
      ]}>
      {imageIcon ? (
        imageIcon
      ) : (
        <Image
          source={icBack}
          style={{height: 25, width: 25, tintColor: 'white'}}
        />
      )}
    </Button>
  );
}

export default BackIconButton;
