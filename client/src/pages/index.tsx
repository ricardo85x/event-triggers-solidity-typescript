import getWeb3 from "../getWeb3"
import { useEffect, useState } from "react"
import Web3 from "web3";
import { AbiItem } from "web3-utils/types"
import { Contract } from "web3-eth-contract/types"
import { Box, Input, Flex, Heading, Button,  Text, VStack } from "@chakra-ui/react";
import ItemManagerContract from "../contracts/ItemManager.json"
import ItemContract from "../contracts/Item.json"
import { Header } from "../components/Header";


export default function Home() {

  const [itemName, setItemName] = useState("Example 1")
  const [cost, setCost] = useState(0)
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [networkId, setNetworkId] = useState<number | null>(null)
  const [accounts, setAccounts] = useState<string[] | null>()
  const [itemManager, setItemManager] = useState<Contract>(null)
  const [item, setItem] = useState<Contract>(null)

  useEffect(() => {
    const loadWeb3 = async () => {

      const _web3 = await getWeb3()
      const _accounts = await _web3.eth.getAccounts()
      const _networkId = await _web3.eth.net.getId();

      const _itemManager = new _web3.eth.Contract(
        ItemManagerContract.abi as AbiItem[],
        ItemManagerContract.networks[_networkId] && ItemManagerContract.networks[_networkId]?.address
      )

      const _item = new _web3.eth.Contract(
        ItemContract.abi as AbiItem[],
        ItemContract.networks[_networkId] && ItemContract.networks[_networkId]?.address
      )

      setWeb3(_web3)
      setAccounts(_accounts)
      setNetworkId(_networkId)

      setItemManager(_itemManager)
      setItem(_item)

    }

    try {
      loadWeb3()
    } catch (e) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(e);
    }

  }, [])

  const handleCreateItem = async () => {

    const response = await itemManager.methods.createItem(itemName, cost).send({ 
      from: accounts[0]
    })

    console.log(response)

  }

  const runExample = async () => {

    // Stores a given value, 5 by default.
    //   await contract.methods.setMyNumber(inputNumber).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //    const response = await contract.methods.getMyNumber().call();

    // Update state with the result.
    //   setMyNumber(response)

  };

  if (!accounts) {
    return (
      <Box>
        <Text>Loading Web3, accounts, and contract...</Text>
      </Box>)
      ;
  }

  return (

    <Flex direction="column" h="100vh" >
      <Header />

      <Flex 
        bg="gray.700" 
        direction="column" 
        h="100vh" 
        pt="6"
        px="6"
        
      >
        <Text fontSize="40" >Items</Text>

        <Text fontSize="20" pb="2" color="blue.300" >Add Item:</Text>

        <VStack spacing="4" align="flex-start">
          <Box>
            <Text>Cost in  Wei</Text>
            <Input
              type="text"
              name="cost"
              value={cost}
              onChange={
                (el) => setCost( /^\d+$/.test(el.target.value)  ? parseInt(el.target.value) : 0 )
              }
            />

          </Box>

          <Box>
          
          <Text >Item Name</Text>
          <Input

            type="text"
            name="cost"
            
            value={itemName}
            onChange={
              (el) => setItemName(el.target.value)
            }
          />
          </Box>

          <Button colorScheme="blue" onClick={handleCreateItem}>Create New Item</Button>


        </VStack>

      </Flex>

    </Flex>

  )
}
