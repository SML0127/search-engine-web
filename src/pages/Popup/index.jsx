import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';

console.log(window.document.querySelector('#app-container'))

render(<Popup />, window.document.querySelector('#app-container'));
