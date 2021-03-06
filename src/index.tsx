import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';

import App from './App';
import reportWebVitals from './reportWebVitals';

// Redux
import { Provider } from "react-redux";
import { store } from "@/Redux/store";


ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </CookiesProvider>
  ,
  document.getElementById('root')
);

/**
 * AntDesign doesn't work with StrickMode
 * <React.StrictMode> remove for now
 */
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
