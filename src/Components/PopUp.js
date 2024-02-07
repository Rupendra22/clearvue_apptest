import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState
} from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import * as theme from '../Theme/theme';

const PopUp = (
  {style, popStyle, blurType = 'light', blurAmount = 7, children, ...props},
  ref,
) => {
  const [isVisible, setIsVisible] = useState(false);
  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);
  //Reverted the changes due to PIOT-941

  useImperativeHandle(ref, () => ({
    isVisible,
    show,
    hide,
  }));

  return (
    <Modal {...props} visible={isVisible} onRequestClose={() => {}} transparent>
      <View style={[styles.container, style]}>
        {
          blurType === 'none' ? <View style={styles.backdropAlt} /> : null
          //   <Backdrop hide={hide} blurType={blurType} blurAmount={blurAmount} />
        }
        <View style={[styles.popUp, popStyle]}>{children}</View>
      </View>
    </Modal>
  );
};

export default forwardRef(PopUp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropAlt: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(100, 100, 100, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  popUp: {
    backgroundColor: theme.color.WHITE,
    borderRadius: theme.normalize(12),
    paddingHorizontal: theme.normalize(20),
    paddingVertical: theme.normalize(30),
    shadowColor: theme.color.BLACK,
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: theme.normalize(340),
    maxHeight: theme.normalize(740),
  },
});
