import React from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import {Provider} from 'react-redux';
import store from './src/store/store';



export default function App(){



  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}
