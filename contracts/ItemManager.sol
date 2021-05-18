// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./openzeppelin-contracts_0.8/access/Ownable.sol";
import "./Item.sol";

contract ItemManager is Ownable {
    
    enum SuplyChainState { Created, Paid, Delivered }
    
    struct SItem {
        Item _item;
        string _identifier;
        uint _price;
        ItemManager.SuplyChainState _state;
    }
    
    mapping(uint => SItem ) public items;
    
    uint itemIndex;
    
    event SupplyChainStep(uint _itemIndex, uint _step, address _addressItem);
    
    function createItem(string memory _identifier, uint _price) public onlyOwner {
        
        Item item = new Item(this, _price, itemIndex);
        items[itemIndex]._item = item;
        items[itemIndex]._identifier = _identifier;
        items[itemIndex]._price = _price;
        items[itemIndex]._state = SuplyChainState.Created;
        itemIndex++;
        emit SupplyChainStep(itemIndex, uint(items[itemIndex]._state), address(item));
         
    }
    
    function triggerPayment(uint _itemIndex)  public payable {
        // need to be sent with exact money of item's price
        require(items[_itemIndex]._price == msg.value, "Only full payment accepeted");
        // does not need to be paided yet
        require(items[_itemIndex]._state == SuplyChainState.Created, "this it was already paided");
        
        items[_itemIndex]._state = SuplyChainState.Paid;
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state), address(items[itemIndex]._item) );
        
    }
    
    function triggerDelivery(uint _itemIndex) public onlyOwner {
        // need to be in paid state
        require(items[_itemIndex]._state == SuplyChainState.Paid, "Item need to be in Paid State");
        items[_itemIndex]._state = SuplyChainState.Delivered;
        
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state), address(items[itemIndex]._item));
        
    }
}