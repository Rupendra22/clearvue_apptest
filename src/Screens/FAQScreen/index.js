import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {CustomAccordion, FlexContainer, Loader} from '../../Components';
import {MainHeader} from '../../Components/MainHeader';
import {getParams} from '../../Navigators/NavigationUtils';
import {FaqsList, LinkToSupportList} from '../../Store/UserActions/actions';
import {color, normalize, sizes} from '../../Theme/theme';
import {openLink} from '../../Helper/Utils';
import LoadingView from '../../Components/LoaingView';
import {info} from '../../Assets';

const FAQScreen = ({
  params,
  navigation,
  FaqsList,
  LinkToSupportList,
  globalLoding,
}) => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    item.type == 'FAQs'
      ? FaqsList(true, {
          SuccessCallback: res => {
            setLoading(false);
            setData(res.faq_list);
          },
          FailureCallback: res => {
            setLoading(false);
            console.log(res);
          },
        })
      : LinkToSupportList(true, {
          SuccessCallback: res => {
            setLoading(false);
            setData(res.faq_list);
          },
          FailureCallback: res => {
            setLoading(false);
            console.log(res);
          },
        });
  }, []);

  const {item} = getParams();

  return (
    <FlexContainer>
      <MainHeader isBack={true} tittle={item?.type} tittleIcon={info} />
      {isLoading ? (
        <LoadingView />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: color.WHITE,
            borderTopLeftRadius: normalize(20),
            borderTopRightRadius: normalize(20),
            paddingHorizontal: sizes.CONTAINER_PADDING,
            paddingVertical: sizes.CONTAINER_PADDING_VERTICAL,
          }}>
          <CustomAccordion dataArray={data} urlClick={item => openLink(item)} />
        </View>
      )}
    </FlexContainer>
  );
};

const mapStateToProps = state => ({
  globalLoding: state.global.loading,
});

export default connect(mapStateToProps, {FaqsList, LinkToSupportList})(
  FAQScreen,
);
