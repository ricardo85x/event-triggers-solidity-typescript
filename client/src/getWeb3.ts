import Web3 from "web3";
import { provider as Provider } from "web3-core/types"

interface Web3Window extends Window {
    ethereum?: Provider | any,
    web3?: Web3
}
const getWeb3 = () =>
  new Promise<Web3>((resolve, reject) => {

    console.log("E la vamos nos", window)
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...

      console.log("Pareeee")

      if ((window as Web3Window).ethereum) {

        console.log("La vamos nos 222")
        const web3 = new Web3((window as Web3Window).ethereum);
        try {
          // Request account access if needed
          await (window as Web3Window).ethereum?.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          console.log("ei 1", error);

          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if ((window as Web3Window).web3) {

        console.log("la vamos 2")
        // Use Mist/MetaMask's provider.
        const web3 = (window as Web3Window).web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {

        console.log("la vamos 3")

        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

export default getWeb3;
