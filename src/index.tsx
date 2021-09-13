import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import memoryUtils from './utils/memoryUtils';
import {getUser} from './utils/storageUtils';

memoryUtils.user = getUser();

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
