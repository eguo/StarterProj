const Web3 = require('web3');
const web3 = new Web3(window.web3.currentProvider);
const contracts = require('./contracts.json');



setTimeout(() => {
  web3.eth.getAccounts((accountsError, accounts) => {
    console.log(accounts);
    web3.eth.sendTransaction({
      from: accounts[0],
      gas: 3150000,
      data: contracts.AttestationManager.bytecode,
    }, (txError, txResult) => {
      console.log(txError, txResult);
    });
  });
}, 500);
