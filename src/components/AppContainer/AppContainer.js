import React, { Component } from 'react'
import './AppContainer.css'

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"));


const json = require('../../../contracts.json');
const rinkebyAdd = '0x7389e3495d723772c22b6ca480385f7fbef3bc38';

const gooseHunterContract = web3.eth.contract(json.GooseHunter).at(rinkebyAdd);

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
const ipfsAPI = require('ipfs-api');





class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      geese: 0
    }
    this.ipfsApi = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: "https"});

    this.getInitialData = this.getInitialData.bind(this);

    //ipfs methods
    this.captureFile = this.captureFile.bind(this);
    this.captureFileInvariants = this.captureFileInvariants.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.arrayBufferToString = this.arrayBufferToString.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.getInitialData();
    //this.handleSendMeta = this.handleSendMeta.bind(this)
  }
  componentDidMount() {
  //  this.getContractData();
  }
  getInitialData(){
    if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
      // Use Mist/MetaMask's provider
      console.log("Successfully connected to MetaMask")
      web3.setProvider(window.web3.currentProvider);

      web3.eth.getAccounts(function(err, accs){
        if (err){
          console.log ('error fetching accounts', err);
        } else {
          this.setState({accounts: accs});
          gooseHunterContract.numGeese((cerr, succ)=> {
            var num = parseInt(succ, 10);
            this.setState({geese: num});


          });
        }
      }.bind(this));
    } else {
      this.setState({metamaskError: "Please ensure you are using metamask"});
    }


  }




  captureFile (event) {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
      this.setState({sourceFileName: file.name});


    let reader = new window.FileReader()
    reader.onloadend = () => this.saveToIpfs(reader, "source")
    reader.readAsArrayBuffer(file)
  }
  captureFileInvariants (event) {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]

      this.setState({invariantsFileName: file.name});

    let reader = new window.FileReader()
    reader.onloadend = () => this.saveToIpfs(reader, "invariants")
    reader.readAsArrayBuffer(file)
  }


  saveToIpfs (reader, contract) {
    let ipfsId
    const buffer = Buffer.from(reader.result)
    this.ipfsApi.add(buffer)
    .then((response) => {
      console.log(response)
      ipfsId = response[0].hash
      console.log(ipfsId)
      if (contract == "source"){
        this.setState({sourceFileHash: ipfsId})
      } else {
        this.setState({invariantsFileHash: ipfsId})
      }

    }).catch((err) => {
      console.error(err)
    })
  }

  arrayBufferToString (arrayBuffer) {
    return String.fromCharCode.apply(null, new Uint16Array(arrayBuffer))
  }

  handleSubmit (event) {
    event.preventDefault()
  }

  render() {

    return (
      <div style={{padding: "100px"}}>
      There are {this.state.geese} geese being hunted
    </div>

    )
  }
}

export default AppContainer
