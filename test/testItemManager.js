const ItemManager = artifacts.require("ItemManager");

contract("ItemManager", async accounts => {
    it("should be able to add an item", async () => {
        const itemManagerInstance = await ItemManager.deployed();
        const itemName = "Coca Cola";
        const itemPrice = 250;

        // last argument, is because it is a 'send', and you have 
        // to pass the sender address
        const result = await itemManagerInstance.createItem(
            itemName, itemPrice, {
                from: accounts[0]
            }
        );
        
        // event should show alert new item
        assert.equal(
            result.logs[0].args._itemIndex, 0, 
            "It's not the first item"
        )
        
        // item name should be the same name setted
        const item = await itemManagerInstance.items(0);
        assert.equal(
            item._identifier, itemName, 
            "item name is wrong"
        );


        

    })
})