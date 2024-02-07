import AsyncStorage from '@react-native-community/async-storage';
import {Body, Content, ListItem, View} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {
  ProfileIcon,
  closeIcon,
  icProfileNew,
  ic_roundPlus,
  paper_clip,
} from '../../Assets';
import {FlexContainer, LoaingView, PlainText} from '../../Components';
import {openImagePicker} from '../../Components/ActionSheet';
import BottomSheet from '../../Components/BottomSheet';
import {DeleteAccountAlert} from '../../Components/DeleteAccountAlert';
import {MainHeader} from '../../Components/MainHeader';
import PopUp from '../../Components/PopUp';
import {handleFailureCallback} from '../../Config';
import {DATA} from '../../Helper/Constants';
import {
  AUTH_TOKEN,
  EMAIL_ADD,
  IS_LOGIN,
  LANGUAGE,
  REFRESH_TOKEN,
  SURVEY_CODE,
  USER_ID,
} from '../../Helper/Storage';
import * as Utils from '../../Helper/Utils';
import {formateDate, hasOwnKey, showToast, userID} from '../../Helper/Utils';
import {setLocale, strings} from '../../Helper/i18n';
import {navigateAndSimpleReset} from '../../Navigators/NavigationUtils';
import {
  FetchUserProfile,
  UpdateUserLanguage,
  UploadDocument,
} from '../../Store/ProfileStore/actions';
import {
  WorkerUpdateProfile,
  deleteAccount,
} from '../../Store/UserActions/actions';
import {Fonts, color, normalize, sizes} from '../../Theme/theme';
import {applyStyleToText} from './../../Helper/LocaleSupport';

const ProfileScreen = ({
  navigation,
  UploadDocument,
  FetchUserProfile,
  UpdateUserLanguage,
  WorkerUpdateProfile,
  globalLoding,
  deleteAccount,
}) => {
  const [name, setName] = useState('Name Of Worker');
  const [postCode, setPostCode] = useState('PostCode');
  const [shiftsCompeleted, setShiftCom] = useState(0);
  const [yr, setYr] = useState('00');
  const [mth, setMth] = useState('00');
  const [wks, setWks] = useState('00');
  const [data, setTraining] = useState([]);
  const [profilePic, setProfilePic] = useState('');
  const [documents, setDocuments] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [_isLoading, _setIsLoading] = useState(false);
  const [appreciation, setAppreciation] = useState(null);
  const [transport, setTransport] = useState(null);
  const [pensionOptOut, setPensionOptOut] = useState(null);
  const [prefLanguage, setPrefLanguage] = useState('');
  const popUpRef = React.useRef(null);
  const languageRef = React.useRef(null);
  const documentRef = React.useRef(null);
  const [employmentType, setEmploymentType] = React.useState('');
  const [workingHour, setWorkingHour] = React.useState('');
  const [showDocument, setShowDocument] = React.useState(false);
  const [agency_name, setAgencyName] = React.useState('');
  const [client_name, setPlacementName] = React.useState('');
  const [assignment_date, setAssignmentData] = React.useState('');
  const [email, setEmail] = React.useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile(false);
    });
    fetchProfile(true);
    return () => unsubscribe();
  }, []);

  useEffect(async () => {
    const locale = await AsyncStorage.getItem(LANGUAGE);
    setPrefLanguage(locale);
  }, []);

  //-- API Call
  function uploadDocument(key, response) {
    documentRef?.current?.close();
    setIsLoading(true);
    let param = new FormData();
    const newFile = {
      uri: response.uri,
      type: response.type,
      name: response.fileName,
    };
    param.append(key, newFile);
    UploadDocument(param, {
      SuccessCallback: response => {
        let docParam = {
          documents: {[key]: response?.documents[`${key}`].url},
        };
        if (response.ok) {
          WorkerUpdateProfile(
            true,
            userID,
            `${key}` == 'resource'
              ? {resource: response?.documents[`${key}`].url}
              : docParam,
            {
              SuccessCallback: res => {
                showToast(res?.message);
                fetchProfile(false);
              },
              FailureCallback: res => {
                setIsLoading(false);
                handleFailureCallback(response);
              },
            },
          );
        }
      },
      FailureCallback: response => {
        setIsLoading(false);
        handleFailureCallback(response);
        console.log(response);
      },
    });
  }

  async function fetchProfile(isLoading) {
    setIsLoading(isLoading);
    const localeLang = await AsyncStorage.getItem(SURVEY_CODE);
    FetchUserProfile(isLoading, userID, {
      SuccessCallback: async response => {
        setIsLoading(false);
        if (response.ok) {
          let data = response.data;
          if (data?.language && data?.language !== localeLang) {
            let lanCode = DATA.find(item => item.surveyCode === data?.language);
            setLocale(lanCode?.code);
            await AsyncStorage.setItem(SURVEY_CODE, lanCode?.surveyCode);
            navigateAndSimpleReset('SplashScreen');
          } else {
            setName(data?.name);
            setPostCode(data?.post_code);
            setShiftCom(data?.shift_completed);
            setYr(data?.length_of_service.years);
            setMth(data?.length_of_service.months);
            setWks(data?.length_of_service.weeks);
            setTraining(data?.training);
            setProfilePic(data?.url);
            setTraining(data?.training);
            setDocuments(data?.documents);
            setAppreciation(data?.appreciation);
            setPensionOptOut(data?.pension_opt_out ? 'Yes' : 'No');
            setTransport(data?.transport ? 'Yes' : 'No');
            setEmploymentType(data?.availability ?? 'NA');
            setWorkingHour(data?.hours ? `${data?.hours} Hr` : 'NA');
            setAgencyName(data?.agency_name);
            setPlacementName(data?.client_name);
            setAssignmentData(formateDate(data?.assignment_date));
            setEmail(data?.email);
          }
        }
      },
      FailureCallback: response => {
        setIsLoading(false);
        handleFailureCallback(response);
      },
    });
  }

  function _deleteAccount(isLoading) {
    _setIsLoading(isLoading);
    deleteAccount(false, {
      SuccessCallback: async response => {
        popUpRef.current.hide();
        await AsyncStorage.setItem(IS_LOGIN, 'false');
        await AsyncStorage.setItem(AUTH_TOKEN, '');
        await AsyncStorage.setItem(REFRESH_TOKEN, '');
        await AsyncStorage.setItem(USER_ID, '');
        await AsyncStorage.setItem(EMAIL_ADD, '');
        Utils.isLogin = false;
        Utils.authToken = '';
        Utils.refreshToken = '';
        Utils.userID = '';
        Alert.alert(
          null,
          'Your account was successfully deleted.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.setItem(IS_LOGIN, 'false');
                await AsyncStorage.setItem(AUTH_TOKEN, '');
                await AsyncStorage.setItem(REFRESH_TOKEN, '');
                await AsyncStorage.setItem(USER_ID, '');
                await AsyncStorage.setItem(EMAIL_ADD, '');
                Utils.isLogin = false;
                Utils.authToken = '';
                Utils.refreshToken = '';
                Utils.userID = '';
                navigateAndSimpleReset('OnBoardingScreen');
              },
            },
          ],
          {cancelable: false},
        );
      },
      FailureCallback: response => {
        popUpRef.current.hide();
        _setIsLoading(false);
        handleFailureCallback(response);
      },
    });
  }

  function updateSelectedLanguage(isLoading, lanCode) {
    setIsLoading(isLoading);
    languageRef.current.close();
    let param = {
      language: lanCode?.surveyCode,
    };
    UpdateUserLanguage(param, {
      SuccessCallback: async response => {
        if (response.ok) {
          setLocale(lanCode?.code);
          await AsyncStorage.setItem(SURVEY_CODE, lanCode?.surveyCode);
          navigateAndSimpleReset('SplashScreen');
        }
        setIsLoading(false);
      },
      FailureCallback: response => {
        setIsLoading(false);
        handleFailureCallback(response);
      },
    });
  }
  //-- end

  //-- Open Image Picker
  const ImagePicker = key => {
    // documentRef?.current?.close();
    openImagePicker((response, type) => {
      if (response?.errorCode === 'permission') {
        Alert.alert(
          'clear-vue would like to access your camera',
          'clear-vue would like to access your camera',
          [
            {
              text: 'cancel',
              onPress: () => {
                console.log('Cancel Pressed'), documentRef?.current?.close();
              },
              style: 'cancel',
            },
            {
              text: 'Settings',
              onPress: () => {
                Linking.openURL('app-settings:'), documentRef?.current?.close();
              },
            },
          ],
        );
      } else if (
        !response.didCancel &&
        !response.errorMessage &&
        !response.customButton
      ) {
        if (response.uri) {
          if (key === 'resource') {
            setProfilePic(response.uri);
          }
          setIsLoading(true);
          uploadDocument(key, response);
        }
      }
    });
  };
  //-- end

  //-- Image Download
  const checkPermission = async imageUrl => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      documentRef?.current?.close();
      setIsLoading(true);
      downloadXlsxx(imageUrl);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'ClearVue App needs access to your storage to download Photo',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadFile(imageUrl);
        } else {
          // If permission denied then show alert
          documentRef?.current?.close();
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        documentRef?.current?.close();
        console.warn(err);
      }
    }
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const downloadFile = fileUrl => {
    documentRef?.current?.close();
    let date = new Date();
    let FILE_URL = fileUrl;
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
        setIsLoading(false);
      })
      .catch(errorMessage => {
        setIsLoading(false);
        alert('Please try after sometime..');
        console.log('errorMessage -> ', JSON.stringify(errorMessage));
      });
  };

  const downloadImage = imageUrl => {
    setIsLoading(true);
    let date = new Date();
    let image_URL = String(imageUrl);
    let ext = image_URL.substring(
      image_URL.lastIndexOf('.') + 1,
      image_URL.length,
    );
    ext = '.' + ext;
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        MimeTypeArray: ['image/jpg', 'image/png', 'image/jpeg'],
        notification: false,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        console.log('res -> ', JSON.stringify(res));
        if (Platform.OS === 'android') {
          setIsLoading(false);
          RNFetchBlob.android.actionViewIntent(
            res.path(),
            'image/jpg' || 'image/jpeg' || 'image/png',
          );
        }

        if (Platform.OS === 'ios') {
          setIsLoading(false);
          RNFetchBlob.ios.previewDocument(res.path());
        }
      });
  };

  //-- Alert Function
  const customeAlert = (title, onPress) => {
    if (Platform.OS === 'ios') {
      // return;
    }
    Alert.alert(
      null,
      title,
      [
        {
          text: strings('cancel'),
          onPress: () => console.log('Cancel Pressed!'),
        },
        {
          text: 'OK',
          onPress: onPress,
        },
      ],
      {cancelable: true},
    );
  };

  const downloadXlsxx = async fileUrl => {
    let file_ext = getFileExtention(fileUrl)?.[0];
    var date = new Date();
    const {
      dirs: {DownloadDir, DocumentDir},
    } = RNFetchBlob.fs;
    const {config} = RNFetchBlob;
    const isIOS = Platform.OS == 'ios';
    const aPath = Platform.select({ios: DocumentDir, android: DownloadDir});
    const fPath =
      aPath +
      '/' +
      Math.floor(date.getTime() + date.getSeconds() / 2) +
      `.${file_ext}`;

    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
        notification: true,
      },
      android: {
        fileCache: false,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: fPath,
          description: 'Downloading file...',
        },
      },
    });

    if (isIOS) {
      config(configOptions)
        .fetch('GET', fileUrl)
        .then(res => {
          console.log('------- Sucess');
          setIsLoading(false);
          setTimeout(() => {
            setIsLoading(false);
            RNFetchBlob.ios.openDocument(res.data);
          }, 300);
        })
        .catch(errorMessage => {
          setIsLoading(false);
        })
        .finally(err => {
          setIsLoading(false);
        });
    } else {
      config(configOptions)
        .fetch('GET', fileUrl)
        .then(res => {
          RNFetchBlob.android.actionViewIntent(res.path());
          setIsLoading(false);
        })
        .catch((errorMessage, statusCode) => {
          setIsLoading(false);
        })
        .finally(err => {
          setIsLoading(false);
        });
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 25000);
  };

  const selectLanguage = async lanCode => {
    updateSelectedLanguage(true, lanCode);
  };

  const renderListItem = value => {
    return (
      <View style={{marginTop: normalize(8)}}>
        <PlainText themeColor={color.BLUE_4}>
          {applyStyleToText(
            `${value}`,
            [
              {
                style: {
                  fontFamily: Fonts.bold,
                },
              },
            ],
            '<b>',
            '</b>',
            true,
          )}
        </PlainText>
      </View>
    );
  };

  return (
    <FlexContainer noPadding={true} bottomSafeAreaColor={color.WHITE}>
      <MainHeader
        isDrawer
        tittle={strings('headerProfile')}
        navigation={navigation}
        tittleIcon={icProfileNew}
      />
      {isLoading ? (
        <LoaingView />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: color.WHITE,
            borderTopLeftRadius: normalize(20),
            borderTopRightRadius: normalize(20),
          }}>
          <Content
            contentContainerStyle={{
              padding: sizes.CONTAINER_PADDING,
              flexGrow: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: normalize(5),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  flexGrow: 1,
                  marginEnd: normalize(25),
                }}>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <PlainText
                    themeColor={color.BLUE_4}
                    fontFamily={Fonts.bold}
                    fontSize={sizes.FONT_SIZE_LARGE}
                    textStyle={{flex: 1}}>
                    {name}
                  </PlainText>
                  <PlainText
                    themeColor={color.BLUE_4}
                    fontFamily={Fonts.medium}
                    fontSize={sizes.FONT_SIZE_LARGE}
                    textStyle={{flex: 1, marginTop: 5}}>
                    {email}
                  </PlainText>
                </View>

                <Pressable onPress={() => documentRef.current.open()}>
                  <Image
                    resizeMode="contain"
                    style={{
                      tintColor: color.BLUE_4,
                      width: normalize(20),
                      height: normalize(20),
                      marginLeft: normalize(15),
                    }}
                    source={paper_clip}
                  />
                </Pressable>
              </View>
              <Pressable
                onPress={() => {
                  customeAlert(
                    'Do you want to upload Profile Image?',
                    function () {
                      ImagePicker('resource');
                    },
                  );
                }}>
                <FastImage
                  style={{
                    width: normalize(65),
                    height: normalize(65),
                    borderRadius: normalize(10),
                  }}
                  source={profilePic != '' ? {uri: profilePic} : ProfileIcon}
                />
              </Pressable>
            </View>
            <View style={{marginTop: normalize(15)}} />

            {renderListItem(
              `${strings('currentPlacement')}  - <b>${
                client_name ? client_name : 'NA'
              }</b>`,
            )}
            {renderListItem(
              `${strings('currentAgency')}  - <b>${
                agency_name ? agency_name : 'NA'
              }</b>`,
            )}
            <View style={{height: 5}} />
            <PlainText themeColor={color.BLUE_4}>
              {applyStyleToText(
                `${strings(
                  'lengthOfService',
                )} - <b>${yr}</b>yr <b>${mth}</b>mth <b>${wks}</b>wks`,
                [
                  {
                    style: {
                      fontFamily: Fonts.bold,
                    },
                  },
                ],
                '<b>',
                '</b>',
                false,
              )}
            </PlainText>

            {renderListItem(
              `${strings('pensionOptOut')} - <b>${pensionOptOut}</b>`,
            )}

            {renderListItem(`${strings('transport')} - <b>${transport}</b>`)}

            {renderListItem(`${strings('empType')} - <b>${employmentType}</b>`)}

            {renderListItem(
              `${strings('assignment_date')} - <b>${assignment_date}</b>`,
            )}

            {renderListItem(
              `${strings('workingHour')} - <b>${workingHour}</b>`,
            )}

            <View style={{marginTop: normalize(20)}}>
              <PlainText
                themeColor={color.BLUE_4}
                fontFamily={Fonts.bold}
                textStyle={{
                  textDecorationLine: 'underline',
                }}>
                {strings('achievements')}
              </PlainText>
              <View style={{marginTop: normalize(7)}} />
              {renderListItem(
                `${strings('recognition')} : <b>${
                  appreciation?.recognition ?? 0
                }</b>`,
              )}
              {renderListItem(
                `${strings('listedAwards')} : <b>${
                  appreciation?.awards ?? 0
                }</b>`,
              )}
              {renderListItem(
                `${strings('listedBadges')} : <b>${
                  appreciation?.badge ?? 0
                }</b>`,
              )}
            </View>

            {/* <View style={{marginTop: normalize(5)}} /> */}

            <PlainText
              themeColor={color.BLUE_4}
              fontFamily={Fonts.bold}
              textStyle={{
                textDecorationLine: 'underline',
                marginVertical: normalize(15),
              }}>
              {strings('skillsTraining')}
            </PlainText>
            {data.map((item, index) => {
              return <SkillandTrainingItem key={`${index}`} item={item} />;
            })}
          </Content>
          <PopUp
            ref={popUpRef}
            popStyle={{backgroundColor: 'rgba(0,0,0,0)', elevation: 0}}
            blurType={'none'}>
            <DeleteAccountAlert
              isLoaing={_isLoading}
              onCancel={() => {
                popUpRef?.current?.hide(), _setIsLoading(false);
              }}
              onSubmit={() => _deleteAccount(true)}
            />
          </PopUp>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: normalize(15),
            }}>
            <TouchableOpacity
              onPress={() => {
                languageRef.current.open();
              }}>
              <PlainText themeColor={color.BLUE_4} fontFamily={Fonts.bold}>
                App language
              </PlainText>
            </TouchableOpacity>
            <View style={{height: 20}} />
            <TouchableOpacity
              onPress={() => {
                popUpRef.current.show(), _setIsLoading(false);
              }}>
              <PlainText themeColor={color.BLUE_5} fontFamily={Fonts.bold}>
                {strings('deleteAccount')}
              </PlainText>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal
        style={{
          flex: 1,
          backgroundColor: color.MAIN_BLUE,
        }}
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.MAIN_BLUE,
          }}>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={{
              position: 'absolute',
              top: normalize(20),
              right: normalize(20),
            }}>
            <Image
              source={closeIcon}
              resizeMode={'contain'}
              style={{
                width: normalize(30),
                height: normalize(30),
                tintColor: color.WHITE,
              }}
            />
          </Pressable>
          <Image
            source={{uri: modalImage}}
            style={{width: '100%', height: normalize(600)}}
            resizeMode={'contain'}
          />
        </View>
      </Modal>
      <BottomSheet
        ref={documentRef}
        closeOnDragDown={true}
        height={normalize(normalize(300))}
        customStyles={{
          mask: {backgroundColor: 'transparent'},
          container: {elevation: 100},
        }}>
        <View style={{flex: 1, padding: sizes.CONTAINER_PADDING}}>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-start',
            }}>
            <PlainText
              themeColor={color.BLUE_4}
              fontFamily={Fonts.bold}
              textStyle={{
                textDecorationLine: 'underline',
              }}>
              {strings('rightToWorkDocuments')}
            </PlainText>
          </Pressable>
          <View style={{marginTop: normalize(15)}}>
            <DocumentText
              title={strings('passport')}
              isDocUploaded={hasOwnKey('passport', documents)}
              onPress={() => {
                !hasOwnKey('passport', documents)
                  ? customeAlert(strings('uploadPassport'), function () {
                      ImagePicker('passport');
                    })
                  : customeAlert(strings('viewPassport'), function () {
                      checkPermission(documents?.passport);
                    });
              }}
            />
            <DocumentText
              title={strings('identityCard')}
              isDocUploaded={hasOwnKey('identity_card', documents)}
              onPress={() => {
                !hasOwnKey('identity_card', documents)
                  ? customeAlert(strings('uploadIdentityCard'), function () {
                      ImagePicker('identity_card');
                    })
                  : customeAlert(strings('viewIdentityCard'), function () {
                      checkPermission(documents?.identity_card);
                    });
              }}
            />
            <DocumentText
              title={strings('drivingLicense')}
              isDocUploaded={hasOwnKey('driving_license', documents)}
              onPress={() => {
                !hasOwnKey('driving_license', documents)
                  ? customeAlert(strings('uploadDrivingLicense'), function () {
                      ImagePicker('driving_license');
                    })
                  : customeAlert(strings('viewDrivingLicense'), function () {
                      checkPermission(documents?.driving_license);
                    });
              }}
            />
            <DocumentText
              title={strings('utilityBill')}
              isDocUploaded={hasOwnKey('utility_bill', documents)}
              onPress={() => {
                !hasOwnKey('utility_bill', documents)
                  ? customeAlert(strings('uploadUtilityBill'), function () {
                      ImagePicker('utility_bill');
                    })
                  : customeAlert(strings('viewUtilityBill'), function () {
                      checkPermission(documents?.utility_bill);
                    });
              }}
            />
          </View>
        </View>
      </BottomSheet>
      <BottomSheet
        ref={languageRef}
        closeOnDragDown={true}
        customStyles={{
          mask: {backgroundColor: 'transparent'},
          container: {elevation: 100},
        }}>
        <View style={{flex: 1, paddingVertical: normalize(10)}}>
          <PlainText
            themeColor={color.BLUE_4}
            fontFamily={Fonts.bold}
            textAlign={'center'}
            textStyle={{
              borderBottomColor: 'black',
            }}>
            Select Language
          </PlainText>
          <View style={{marginTop: 10}} />
          <FlatList
            data={DATA}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            keyExtractor={(item, index) => String(index)}
            renderItem={({item, index}) => {
              return (
                <ListItem onPress={() => selectLanguage(item)}>
                  <Body>
                    <PlainText
                      themeColor={color.BLUE_4}
                      fontFamily={
                        prefLanguage === item?.code ? Fonts.bold : Fonts.regular
                      }>
                      {`${item?.emoji}  ${item?.languageName}`}
                    </PlainText>
                  </Body>
                </ListItem>
              );
            }}
          />
        </View>
      </BottomSheet>
      {/* <Loader profileLoad={globalLoding} /> */}
    </FlexContainer>
  );

  function DocumentText({title, onPress, isDocUploaded}) {
    return (
      <Pressable
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: normalize(155),
          marginBottom: normalize(10),
          alignContent: 'center',
          alignSelf: 'flex-start',
        }}
        onPress={onPress}>
        <PlainText themeColor={color.BLUE_4}>{title}</PlainText>
        <Image
          resizeMode="contain"
          style={{
            tintColor: color.BLUE_4,
            width: normalize(20),
            height: normalize(20),
            marginLeft: normalize(15),
          }}
          source={!isDocUploaded ? ic_roundPlus : paper_clip}
        />
      </Pressable>
    );
  }

  function SkillandTrainingItem({item}) {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: normalize(10),
        }}>
        <PlainText themeColor={color.BLUE_4}>{item?.message_name}</PlainText>
        <PlainText themeColor={color.BLUE_4}>
          {formateDate(item?.training_completed_at)}
        </PlainText>
      </View>
    );
  }
};

const mapActionCreators = {
  UploadDocument,
  FetchUserProfile,
  UpdateUserLanguage,
  WorkerUpdateProfile,
  deleteAccount,
};

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
  badgeValue: state.global.notificationCount,
});

export default connect(mapStateToProps, mapActionCreators)(ProfileScreen);
