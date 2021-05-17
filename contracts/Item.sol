// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ItemManager.sol";

contract Item {
    
    uint public priceInWei;
    uint public pricePaid;
    uint public index;
    
    ItemManager parentContract;
    
    constructor(ItemManager _parentContract, uint _priceInWei, uint _index) { 
          priceInWei = _priceInWei;
          index = _index;
          parentContract = _parentContract;
    }
    
    receive() external payable {
        require(pricePaid == 0, "Item is already paided");
        require(priceInWei == msg.value, "wrong value sent, cancelling");
        pricePaid += msg.value;
        (bool success, ) = address(parentContract).call{
            value: (msg.value)
        }(
            abi.encodeWithSignature("triggerPayment(uint256)", index)
        );
        
        require(success, "Trasaction failed, cancelling");
    }
    
    fallback() external {
    
    }
}
