/*
    REVISION HISTORY
    ****************
    2020-02-06 - Testing for sub-Models created. Implementation in app.js.
    2020-02-06 - Testing for api fetch connecting to our backend.
    2020-02-12 - How to display object model within an object model. 
                    See model-display.js, model-display-row.js,
                        table-display.js, table-row-display.js
*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';
import { ModelMain } from './model-main.js';

ReactDOM.render(<App model={ModelMain} />, document.getElementById('root'));
