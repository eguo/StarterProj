import React, { Component } from 'react'
import './AppContainer.css'

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"));


const json = require('../../../contracts.json');
const rinkebyAdd = '0xc2acd7af15b40a84f62d78d32e3a85d627146543';

const gooseHunterContract = web3.eth.contract(json.GooseHunter).at(rinkebyAdd);

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
const ipfsAPI = require('ipfs-api');





class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numGooseHunters: 0,
      gooseHunters: []
    }
    this.ipfsApi = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: "https"});

    this.getInitialData = this.getInitialData.bind(this);

    //ipfs methods
    this.captureFile = this.captureFile.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.arrayBufferToString = this.arrayBufferToString.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleAddHunter = this.handleAddHunter.bind(this);

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


          gooseHunterContract.numGooseHunters((cerr, succ)=> {
            var num = parseInt(succ, 10);
            this.setState({numGooseHunters: num});
            var hunters = [];

            for (var i = 0; i < num; i++){
              gooseHunterContract.getHunter(i, (cerr, succ)=> {
                console.log('success', succ[1]);
                ipfs.catJSON(succ[1], (err, res)=> {
                  var hunter = {address: succ[0], name: res.name, license: res.license, program: res.program, resumeFileName: res.resumeFileName, resumeFileHash: res.resumeFileHash};

                  hunters.push(hunter);

                  if (hunters.length == num){
                    this.setState({gooseHunters: hunters});
                    console.log("hunters", hunters);
                  }
                });



              });
            }


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
      this.setState({resumeFileName: file.name});

      console.log('state', this.state.resumeFileName);


    let reader = new window.FileReader()
    reader.onloadend = () => this.saveToIpfs(reader, "source")
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
        this.setState({resumeFileHash: ipfsId})
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


  handleAddHunter(evt){
    evt.preventDefault();

    var name = evt.target.hunter.value;
    var program = evt.target.program.value;
    var license = evt.target.license.value;
    var hash = "";

    ipfs.addJSON({name: name, program: program, license: license, resumeFileName: this.state.resumeFileName, resumeFileHash: this.state.resumeFileHash}, (cerr, result) => {
      console.log(result);
      hash = result;
      console.log('added', {name: name, program: program, license: license, resumeFileName: this.state.resumeFileName, resumeFileHash: this.state.resumeFileHash});
      gooseHunterContract.register(hash, {from: this.state.accounts[0]}, (cerr, succ)=> {
        console.log('succ');
      });
    });




  }

  render() {
    var hunters = (
      <div>
      <h4>Goose Hunters</h4>

      {this.state.gooseHunters.map((hunter, i)=>{
        return (
          <div style={{padding: "15px"}} key={i}>
            <p style={{width: "100%"}}>Name:  {hunter.name}</p>
            <p style={{width: "100%"}}>Address:  {hunter.address}</p>
            <p style={{width: "100%"}}>Program:  {hunter.program}</p>
            <p style={{width: "100%"}}>License:  {hunter.license}</p>
            <p> Resume:<a href={"https://ipfs.infura.io/ipfs/"+hunter.resumeFileHash} download>  {hunter.resumeFileName} </a> </p>
          </div>
        );
      })}
    </div>
  );

    return (
      <div style={{padding: "100px"}}>
      <h1> Goose Hunter Registry </h1>
        <h4>There are {this.state.numGooseHunters} hunters</h4>


        <form className='AddProject' onSubmit={this.handleAddHunter} style={{backgroundColor: "rgba(10, 22, 40, 0.5)", padding: "15px", color: "white", width: "20%"}}>
        <h4> Add a Hunter < /h4>
        <label style={{fontSize: "12px", display: "block", margin: "15px"}} htmlFor='contract_title'>Hunter Name</label>
        <input id='hunter' className='SendAmount' type='text' ref={(i) => { if(i) { this.hunter = i}}} style={{display: "block", margin: "15px"}}/>
        <label style={{fontSize: "12px", display: "block", margin: "15px"}} htmlFor='contract_title'>Hunters Program</label>
        <input id='program' className='SendAmount' type='text' ref={(i) => { if(i) { this.hunter = i}}} style={{display: "block", margin: "15px"}}/>
        <label style={{fontSize: "12px", display: "block", margin: "15px"}} htmlFor='contract_title'>Hunting License</label>
        <input id='license' className='SendAmount' type='text' ref={(i) => { if(i) { this.license = i}}} style={{display: "block", margin: "15px"}}/>

        <label style={{fontSize: "12px", display: "block", margin: "15px"}} htmlFor='contract_title'>Resume</label>
        <input id='invariants_code' type="file" onChange={this.captureFile} style={{ display: "block", border: "1px solid white", color: "white"}}/>

        <button type='submit' className='AddBtn' style={{backgroundColor: "rgba(255, 255, 255, 0.18)", border:"0px"}}>Add</button>

        </form>
        {hunters}
      </div>

    )
  }
}

export default AppContainer
