import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './src/App';
import store from './src/redux/store';

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.querySelector('.main')
);