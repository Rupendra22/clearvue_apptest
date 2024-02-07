import { CardItem } from 'native-base';
import React from 'react';
import { Image } from 'react-native';

const SocialImageView = ({image, item}) => {
  const [ratio, setRatio] = React.useState(1);
  React.useEffect(() => {
    if (image) {
      Image.getSize(image, (width, height) => {
        setRatio(width / height);
      });
    }
  }, [image]);

  return (
    <CardItem
      style={{
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 5,
      }}>
      <Image
        source={{uri: image}} //needs to change
        style={{
          flex: 1,
          width: '100%',
          aspectRatio: ratio,
          resizeMode: 'contain',
        }}
      />
    </CardItem>
  );
};

export default SocialImageView;
