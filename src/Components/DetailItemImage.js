import React from 'react';
import { Image } from 'react-native';
import { normalize } from '../Theme/theme';

const DetailItemImage = ({image}) => {
  const [ratio, setRatio] = React.useState(1);
  React.useEffect(() => {
    if (image) {
      Image.getSize(image, (width, height) => {
        setRatio(width / height);
      });
    }
  }, [image]);

  return (
    <Image
      source={{
        uri: image,
      }}
      style={{
        width: '100%',
        aspectRatio: ratio,
        borderRadius: normalize(8),
      }}
      resizeMode={'contain'}
    />
  );
};

export default DetailItemImage;
