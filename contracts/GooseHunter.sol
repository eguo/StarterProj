pragma solidity ^0.4.11;


contract GooseHunter {

    struct Goose {
        bool beingHunted;
        string data;

    }

    address[] public gooseHunters;
    uint public numGooseHunters;

    function GooseHunter() {

    }

    function register(){
        gooseHunters.push(msg.sender);
        numGooseHunters++;
    }




}
