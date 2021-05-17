import getWeb3 from "../getWeb3"
import { useEffect, useState } from "react"
import Web3 from "web3";
import { AbiItem } from "web3-utils/types"
import { Contract } from "web3-eth-contract/types"

import HelloWorldContract from "../contracts/HelloWorld.json"

export default function Home() {

  const [myNumber, setMyNumber] = useState(0)
  const [inputNumber, setInputNumber] = useState(myNumber)
  const [web3, setWeb3] = useState<Web3|null>(null)
  const [accounts, setAccounts] = useState<string[]|null>()
  const [contract, setContract] = useState<Contract>(null)

  useEffect(() => {
    const loadWeb3 = async () => {

      const _web3 = await getWeb3()
      const _accounts = await _web3.eth.getAccounts()
      const networkId = await _web3.eth.net.getId();
      const deployedNetwork = HelloWorldContract.networks[networkId];
      const instance = new _web3.eth.Contract(
        HelloWorldContract.abi as AbiItem[],
        deployedNetwork && deployedNetwork?.address
      )

      console.log("HelloWorldContract", networkId)
      console.log("network", deployedNetwork)

      
      setWeb3(_web3)
      setAccounts(_accounts)
      setContract(instance)
      
      console.log(instance)

      console.log("conta", _accounts)

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


  const runExample = async () => {

    // Stores a given value, 5 by default.
    await contract.methods.setMyNumber(inputNumber).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getMyNumber().call();

    // Update state with the result.
    setMyNumber(response)

  };


  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (

    <>
      <h1>Ola NExt</h1>
      <div>The stored value is: {myNumber}</div>

      <button onClick={runExample}>SetNumber</button>
      <input type="number" value={inputNumber} onChange={(el) => setInputNumber(parseInt(el.target.value))} />
      
    </>

  )
}
