import { ActionSheet } from 'native-base';
import { PermissionsAndroid, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import * as ImagePicker from 'react-native-image-picker';

let buttonIos = [
  'Take Photo...',
  'Choose From Library...',
  'Pick Document',
  'Cancel',
];
let buttonIosImage = ['Take Photo...', 'Choose From Library...', 'Cancel'];
let buttonIosImage_ = ['Take Photo...', 'Cancel'];
let options = {
  mediaType: 'photo',
  //   includeBase64: true,
  quality: 1.0,

  storageOptions: {
    skipBackup: true,
  },
  json: true,
};

const requestCameraPermission = async (options, onResponse) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      requestTakePhoto(onResponse);
      console.log('Camera permission given');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const requestDocument = async onResponse => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    let _tempRes = res;
    let response = {
      uri: _tempRes['uri'],
      type: _tempRes['type'],
      fileName: _tempRes['name'],
      fileSize: _tempRes['size'],
      isPdf: true,
    };
    console.log('requestDocument_', JSON.stringify(response));
    return onResponse(response, 3);
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      throw err;
    }
  }
};

const requestTakePhoto = async onResponse => {
  const res = await ImagePicker.launchCamera(options, onResponse);
  let _tempRes = res.assets[0];
  let response = {
    uri: _tempRes['uri'],
    type: _tempRes['type'],
    fileName: _tempRes['fileName'],
    fileSize: _tempRes['fileSize'],
    isPdf: false,
  };
  console.log('requestTakePhoto_', JSON.stringify(response));

  return onResponse(response, 1);
};

const requestFromLib = async onResponse => {
  const res = await ImagePicker.launchImageLibrary(options, onResponse);
  let _tempRes = res.assets[0];
  let response = {
    uri: _tempRes['uri'],
    type: _tempRes['type'],
    fileName: _tempRes['fileName'],
    fileSize: _tempRes['fileSize'],
    isPdf: false,
  };
  console.log('requestFromLib_', JSON.stringify(response));

  return onResponse(response, 2);
};

/**
 * Method to get image/document from
 * Camera , Gallery and from file manager
 */
export const openPicker = (onResponse, type) => {
  let options = {
    mediaType: 'photo',
    //   includeBase64: true,
    quality: 1.0,

    storageOptions: {
      skipBackup: true,
    },
    json: true,
  };

  if (Platform.OS === 'ios') {
    ActionSheet.show(
      {
        options: buttonIos,
        cancelButtonIndex: 3,
        title: 'Select Document',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            return requestTakePhoto(onResponse);
          case 1:
            return requestFromLib(onResponse);
          case 2:
            return requestDocument(onResponse);
          default:
            onResponse({didCancel: true});
            break;
        }
      },
    );
  } else {
    ActionSheet.show(
      {
        options: buttonIos,
        cancelButtonIndex: 3,
        title: 'Select a Photo',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            return requestCameraPermission(options, onResponse);
          case 1:
            return requestFromLib(onResponse);
          case 2:
            return requestDocument(onResponse);
          default:
            onResponse({didCancel: true});
            break;
        }
      },
    );
  }
};

/**
 * Method to get image/document from
 * Camera and Galary only
 */
export const openImagePicker = (onResponse, type) => {
  let options = {
    mediaType: 'photo',
    //   includeBase64: true,
    quality: 1.0,

    storageOptions: {
      skipBackup: true,
    },
    json: true,
  };

  if (Platform.OS === 'ios') {
    ActionSheet.show(
      {
        options: buttonIosImage,
        cancelButtonIndex: 2,
        title: 'Select Document',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            return requestTakePhoto(onResponse);
          case 1:
            return requestFromLib(onResponse);
          default:
            onResponse({didCancel: true});
            break;
        }
      },
    );
  } else {
    ActionSheet.show(
      {
        options: buttonIosImage,
        cancelButtonIndex: 2,
        title: 'Select a Photo',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            return requestCameraPermission(options, onResponse);
          case 1:
            return requestFromLib(onResponse);
          default:
            onResponse({didCancel: true});
            break;
        }
      },
    );
  }
};

/**
 * Method to get image/document from
 * Camera and Galary only
 */
 export const openCameraOption = (onResponse, type) => {
  let options = {
    mediaType: 'photo',
    //   includeBase64: true,
    quality: 1.0,

    storageOptions: {
      skipBackup: true,
    },
    json: true,
  };

  if (Platform.OS === 'ios') {
    ActionSheet.show(
      {
        options: buttonIosImage_,
        cancelButtonIndex: 1,
        title: 'Select Document',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            return requestTakePhoto(onResponse);
          default:
            onResponse({didCancel: true});
            break;
        }
      },
    );
  } else {
    ActionSheet.show(
      {
        options: buttonIosImage_,
        cancelButtonIndex: 1,
        title: 'Select a Photo',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            return requestCameraPermission(options, onResponse);
          default:
            onResponse({didCancel: true});
            break;
        }
      },
    );
  }
};
