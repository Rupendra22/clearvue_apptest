import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import Stars from 'react-native-stars';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {connect} from 'react-redux';
import {starEmpty, starFilled, starHalf} from '../../Assets';
import {
  Button,
  FlexContainer,
  Loader,
  PlainText,
  RadioButton,
} from '../../Components';
import LoadingView from '../../Components/LoaingView';
import {MainHeader} from '../../Components/MainHeader';
import {handleFailureCallback} from '../../Config';
import {showToast, userID} from '../../Helper/Utils';
import {getParams} from '../../Navigators/NavigationUtils';
import {FetchUserProfile} from '../../Store/ProfileStore/actions';
import {
  AddSurveyResponse,
  GetSurveyQuestions,
} from '../../Store/UserActions/actions';
import {color, Fonts, normalize, sizes} from '../../Theme/theme';
// import StarRating from 'react-native-star-rating';
import StarRating from '../../Components/star-rating';
import NoDataFound from '../../Components/NoDataFound';
import AsyncStorage from '@react-native-community/async-storage';
import {SURVEY_CODE} from '../../Helper/Storage';

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
});

const SurveyDetailScreen = ({
  navigation,
  GetSurveyQuestions,
  FetchUserProfile,
  AddSurveyResponse,
  globalLoding,
}) => {
  const [questions, setQuestions] = useState([]);
  const [client_id, setClientId] = useState(null);
  const [user_id, setUserId] = useState(null);
  const [agency_id, setAgencyId] = useState(null);
  const [site_id, setSiteId] = useState(null);
  const [worker_id, setWorkerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let {item} = getParams();

  useEffect(() => {
    getSurveyQuestions(false);
  }, []);

  //-- API Call
  async function getSurveyQuestions(isLoading) {
    var surveyCode = await AsyncStorage.getItem(SURVEY_CODE);
    console.log('surveyCode', surveyCode);
    setIsLoading(true);
    GetSurveyQuestions(
      isLoading,
      item.id,
      surveyCode == null ? 'en' : surveyCode,
      {
        SuccessCallback: response => {
          setIsLoading(false);
          if (response.ok) {
            let result = response.questions;
            console.log('======', JSON.stringify(result));
            fetchProfile(false);
            setQuestions(result);
            for (var i in result) {
              result[i].rating = null;
              result[i].isConfirm = [];
              result[i].filled = false;
            }

            setQuestions(result);
          }
        },
        FailureCallback: response => {
          setIsLoading(false);
          console.log(response);
        },
      },
    );
  }

  function fetchProfile(isLoading) {
    FetchUserProfile(isLoading, userID, {
      SuccessCallback: response => {
        if (response.ok) {
          let data = response.data;
          setAgencyId(data.agency_id);
          setClientId(data.client_id);
          setSiteId(data.site_id);
          setUserId(data.user_id);
          setWorkerId(data.worker_id);
        }
      },
      FailureCallback: response => {
        handleFailureCallback(response);
      },
    });
  }

  function addSurveyResponse(param) {
    console.log(
      'addSurveyResponse =====================',
      JSON.stringify(param),
    );

    if (checkForValidAnswer(param)) {
      const finalArray = param.map(item => {
        delete item['isValid'];
        return item;
      });
      setIsLoading(true);
      AddSurveyResponse(
        true,
        {result: finalArray},
        {
          SuccessCallback: response => {
            setIsLoading(false);
            if (response.ok) {
              console.log(response);
              showToast('Survey submitted successfully!');
              navigation.goBack();
            }
          },
          FailureCallback: response => {
            setIsLoading(false);
            handleFailureCallback(response);
          },
        },
      );
    } else {
      showToast('Please fill up the all answer');
    }
  }

  function checkForValidAnswer(array) {
    let isValid = true;
    array.forEach(element => {
      if (!element?.isValid) {
        return (isValid = false);
      }
    });
    return isValid;
  }
  //-- end

  return (
    <FlexContainer>
      <MainHeader isBack={true} navigation={navigation} tittle={item?.name} />
      {isLoading ? (
        <LoadingView />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: color.WHITE,
            borderTopLeftRadius: normalize(20),
            borderTopRightRadius: normalize(20),
          }}>
          <FlatList
            data={questions}
            contentContainerStyle={{
              paddingHorizontal: sizes.CONTAINER_PADDING,
              paddingVertical: sizes.CONTAINER_PADDING_VERTICAL,
              flexGrow: 1,
            }}
            ListEmptyComponent={isLoading ? null : <NoDataFound />}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    backgroundColor: color.MAIN_BLUE,
                    padding: normalize(10),
                    borderRadius: normalize(8),
                    marginBottom: normalize(10),
                  }}>
                  <PlainText
                    lineHeight={sizes.LINE_HEIGHT_22}
                    themeColor={color.WHITE}
                    fontSize={sizes.FONT_SIZE_LARGE}>
                    {item.question_text}
                  </PlainText>
                  <View height={normalize(10)} />
                  {item.option_type == 'Rating' && (
                    // <AirbnbRating showRating={false} defaultRating={2.5}  />
                    <>
                      <StarRating
                        activeOpacity={1}
                        disabled={false}
                        emptyStar={'star'}
                        fullStar={'star'}
                        halfStar={'star-half-empty'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        starSize={30}
                        rating={item?.rating}
                        starStyle={{margin: 5}}
                        selectedStar={rating => {
                          setQuestions(arr => {
                            const newArr = [...arr];
                            newArr[index] = {
                              ...newArr[index],
                              rating: rating,
                            };
                            return newArr;
                          });
                        }}
                        fullStarColor={'#ffd700'}
                        halfStarColor={'#ffd700'}
                        emptyStarColor={'#ffffff'}
                        halfStarEnabled={true}
                      />
                    </>
                  )}
                  <View height={normalize(10)} />
                  {item.option_type === 'Mcq' &&
                    item.options.map((subItem, _subIndex) => {
                      return (
                        <RadioButton
                          textStyle={{
                            color: color.WHITE,
                            fontFamily: Fonts.regular,
                          }}
                          onPress={() => {
                            if (item?.isConfirm?.length == 0) {
                              setQuestions(arr => {
                                const newArr = [...arr];
                                newArr[index] = {
                                  ...newArr[index],
                                  isConfirm: [...item.isConfirm, subItem],
                                };
                                return newArr;
                              });
                            } else if (item?.isConfirm?.includes(subItem)) {
                              item?.isConfirm?.pop();
                              setQuestions(arr => {
                                const newArr = [...arr];
                                newArr[index] = {
                                  ...newArr[index],
                                  isConfirm: item?.isConfirm,
                                };
                                return newArr;
                              });
                            } else {
                              !item?.isConfirm?.includes(subItem)
                                ? (item?.isConfirm?.pop(),
                                  item?.isConfirm?.push(subItem))
                                : null;

                              setQuestions(arr => {
                                const newArr = [...arr];
                                newArr[index] = {
                                  ...newArr[index],
                                  isConfirm: item?.isConfirm,
                                };
                                return newArr;
                              });
                            }
                          }}
                          text={subItem?.answer}
                          isCheck={item?.isConfirm?.includes(subItem)}
                        />
                      );
                    })}
                </View>
              );
            }}
            ListFooterComponent={
              questions?.length > 0 ? (
                <Button
                  btnText={'Submit'}
                  backgroundColor={color.MAIN_BLUE}
                  btnTextColor={color.WHITE}
                  onPress={() => {
                    let arr = [];
                    for (var i in questions) {
                      arr.push({
                        workerId: user_id,
                        questionId: questions[i]?.id,
                        siteId: site_id,
                        agencyId: agency_id,
                        clientId: client_id,
                        workerId: worker_id,
                        surveyId: String(item.id),
                        rating:
                          questions[i]?.rating == null
                            ? questions[i]?.rating
                            : String(
                                parseFloat(questions[i]?.rating).toFixed(1),
                              ),
                        answers: questions[i]?.isConfirm,
                        isValid:
                          questions[i]?.rating !== null ||
                          questions[i]?.isConfirm.length > 0,
                      });
                    }
                    console.log('>>>>>>>', arr);
                    addSurveyResponse(arr);
                  }}
                />
              ) : null
            }
          />
        </View>
      )}
    </FlexContainer>
  );
};

const mapActionCreators = {
  GetSurveyQuestions,
  FetchUserProfile,
  AddSurveyResponse,
};

export default connect(mapStateToProps, mapActionCreators)(SurveyDetailScreen);
