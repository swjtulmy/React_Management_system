import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { getUser } from './utils/storageUtils';
import { Provider } from 'react-redux'

import store from './redux/store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
