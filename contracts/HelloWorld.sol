// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    uint myNumber;

    function setMyNumber(uint _value) public {
        myNumber = _value;
    }

    function getMyNumber() public view returns(uint) {
        return myNumber;
    }
}