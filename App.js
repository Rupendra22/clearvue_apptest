import {Root} from 'native-base';
import React from 'react';
import {LogBox} from 'react-native';
import {Provider} from 'react-redux';
import API, {DevelopmentMode} from './src/ApiService';
import {apiConfig} from './src/Config';
import Navigation from './src/Navigators/Navigation';
import {configureStore} from './src/Store';
const store = configureStore();
LogBox.ignoreAllLogs(true);

API.getInstance().build(DevelopmentMode.DEVELOPMENT, apiConfig);
const App = () => {
  return (
    <Provider store={store}>
      <Root>
        <Navigation />
      </Root>
    </Provider>
  );
};

export default App;
