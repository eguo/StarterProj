pragma solidity ^0.4.0;


/*
  Attestation Manager
  Mark Beylin
  Nov 11, 2016
*/
import "Contract.sol";


contract AttestationManager {
  Contract[] public contracts;
  address public creator;

  struct Attestation {
    address attestor;
    string attestationType;
    bool agree;
  }

  struct Contract {
    string contractHash;
    string title;
    address author;
    address liveAddress;
    Attestation[] attList;
  }

  /*****   Constructor   *****/

  function AttestationManager () {
    creator = msg.sender;
  }

  function addContractWithInfo(string _contractHash, string _title) returns (uint newId){
    newId = contracts.length++;
    Contract newContract = contracts[newId];
    newContract.contractHash = _contractHash;
    newContract.title = _title;
    newContrzct.author = msg.sender;
  }

  function attestToContract(uint id, bool _attestation, string _attestationType){
    if (id >= contracts.length){
      throw;
    }
    uint newAttId = contracts[id].attList.length++;
    Attestation newAtt = contracts[id].attList[newAttId];
    newAtt.attestor = msg.sender;
    newAtt.attestationType = _attestationType;
    newAtt.agree = _attestation;
  }
  function getNumContracts() constant returns (uint){
    return contracts.length;
  }

}
