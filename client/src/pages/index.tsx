import getWeb3 from "../getWeb3"
import { useEffect, useState, useRef } from "react"
import Web3 from "web3";
import { AbiItem } from "web3-utils/types"
import { Contract } from "web3-eth-contract/types"
import { Box, Input, Flex, Heading, Button, Text, VStack, Stack, SimpleGrid, Divider } from "@chakra-ui/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ItemManagerContract from "../contracts/ItemManager.json"
import ItemContract from "../contracts/Item.json"
import { Header } from "../components/Header";

interface ItemInterface {
  name: string;
  address: string;
  value: string;
  state: 0|1| 2;
}

export default function Home() {

  const [currentItem, setCurrentItem] = useState<ItemInterface>({
    name: "",
    address: "",
    value: "0 ETH",
    state: 0
  })

  const [itemName, setItemName] = useState("Example 1")
  const [cost, setCost] = useState(0)
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [networkId, setNetworkId] = useState<number | null>(null)
  const [accounts, setAccounts] = useState<string[] | null>()
  const [itemManager, setItemManager] = useState<Contract>(null)
  const [item, setItem] = useState<Contract>(null)
  const [eventIsSet, setEventIsSet] = useState(false)
  const [lastPaidItems, _setLastPaidItems] = useState<ItemInterface[]>([])

  const lastPaidItemsRef = useRef(lastPaidItems)

  const setLastPaidItems = data => {
    lastPaidItemsRef.current = data;
    _setLastPaidItems(data);
  };


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

  useEffect(() => {
    if (itemManager && eventIsSet == false) {
      eventPayment()
    }
  }, [itemManager])


  const handleCreateItem = async () => {

    const response = await itemManager.methods.createItem(itemName, cost).send({
      from: accounts[0]
    })

    const returnValues = response.events.SupplyChainStep.returnValues

    const valueInEther = web3.utils.fromWei(`${cost}`, "ether")


    setCurrentItem({
      name: itemName,
      address: returnValues._addressItem,
      state: 0,
      value: valueInEther
    })

    toast(`Item created!`, {
      autoClose: 5000,
      type: "success"
    })

  }

  const eventPayment = async () => {

    itemManager.events.SupplyChainStep().on("data", async (evt) => {

      const _currentItem = await itemManager.methods.items(evt.returnValues._itemIndex).call()

      // paid
      if( parseInt(_currentItem._state) === 1){

        setLastPaidItems([...lastPaidItemsRef.current, {
          name: _currentItem._identifier,
          value:  web3.utils.fromWei(_currentItem._price, "ether"),
          address: _currentItem["0"],
          state: 1
        }])

        toast(`Client paid`, {
          autoClose: 8000,
          type: "info"
        })

      }


    })

    setEventIsSet(true);

  };

  if (!accounts) {
    return (
      <Box>
        <Text>Loading Web3, accounts, and contract...</Text>
      </Box>)
      ;
  }

  return (


    <Flex direction="column" >
      <Header />
      <ToastContainer />

      <SimpleGrid minChildWidth="350px" >

        <Flex
          bg="gray.700"
          direction="column"
          // h="100vh"
          py="6"
          px="6"
          mx="6"
          my="6"

          borderRadius="8"

        >
          <Text fontSize="40" >Admin</Text>
          <Text fontSize="20" pb="2" color="blue.300" >Add Item:</Text>
          <VStack spacing="4" align="flex-start">
            <Box>
              <Text>Cost in  Wei</Text>
              <Input
                type="text"
                name="cost"
                value={cost}
                onChange={
                  (el) => setCost(/^\d+$/.test(el.target.value) ? parseInt(el.target.value) : 0)
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
        
        
        <Flex
          bg="gray.700"
          direction="column"
          // h="100vh"
          py="6"
          px="6"
          mx="6"
          my="6"

          borderRadius="8"


        >
          <Text fontSize="40" >Client</Text>
          <Text fontSize="20" pb="2" color="blue.300" >Item</Text>
          <VStack spacing="4" align="flex-start">
            <Box>
              <Text>Item Address</Text>
              <Text>{currentItem.address}</Text>
            </Box>
            <Box>
              <Text >Item Name</Text>
              <Text>{currentItem.name}</Text>
            </Box>
            <Box>
            <Text >Item value</Text>
              <Text>{currentItem.value} ETH</Text>
            </Box>
            <Text>ask the client to pay this amount to this address</Text>
          </VStack>
        </Flex>
        


      </SimpleGrid>

      <Divider borderColor="gray.500" my="5" />

      <Flex  

        direction="column"
        pb="6"
        px="3"
        mx="3"
        mb="6"
      >

        <Heading>Last Payments </Heading>
        <Text color="red.400" fontWeight="bold" fontSize="sm">Ship it Now</Text>

        <Stack spacing="4" my="5">
          { lastPaidItems.map((paidItem) => (
            <Box key={paidItem.address}>
              <Text >
                Item <Text as="span" color="pink.500">{paidItem.name}</Text> - 
                Value <Text color="green.400" as="span">{paidItem.value} ETH</Text>  - 
                Address <Text color="blue.400"  as="span">{paidItem.address}</Text> 
              </Text>
            </Box>
          ))}

        </Stack>
        


      </Flex>


      
    </Flex>

  )
}
