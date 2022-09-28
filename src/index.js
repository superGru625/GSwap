import React from 'react';
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from 'react-redux';
import { createBrowserHistory } from "history";
import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';

import store from './store';

import "./assets/scss/main.scss";

const getLibrary = (provider) => {
  return new Web3(provider);
}

ReactDOM.render(
	<Provider store={store}>
  		<Web3ReactProvider getLibrary={getLibrary}>
    		<App />
  		</Web3ReactProvider>
	</Provider>,
  	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
