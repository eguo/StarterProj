import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import App from './App'
import Web3 from 'web3'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './index.css'



window.addEventListener('load', function() {
  var web3Provided;
  // Supports Metamask and Mist, and other wallets that provide 'web3'.
  if (typeof web3 !== 'undefined') {
    // Use the Mist/wallet provider.
    // eslint-disable-next-line
    web3Provided = new Web3(web3.currentProvider);
  } else {
    web3Provided = new Web3(new Web3.providers.HttpProvider(web3Location))
  }
//<Route path="*" component={}/>
  ReactDOM.render((
  <MuiThemeProvider>
    <Router history={browserHistory}>
      <Route path="/" component={App} web3={web3Provided}>

      </Route>
    </Router>
  </MuiThemeProvider>
), document.getElementById('root'))
});
