import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./c3jscustom.css";
import "@babel/polyfill";
import * as serviceWorker from './serviceWorker';
import ProductSearchEngineWEBMainPage from "./PSEMainPage.react";

ReactDOM.render(<ProductSearchEngineWEBMainPage />, window.document.querySelector('#app-container'));

