import { ethers } from 'ethers';
import contractJSON from "../../../Smart Contracts/build/contracts/Betting.json";

export async function isWalletConnected() {
  const { ethereum } = window;

  if (!ethereum) {
    alert("You must have the metamask chrome extension installed!");
    return null;
  }

  ethereum.enable();

  const accounts = await ethereum.request({ method: 'eth_accounts' });
  console.log(accounts)
  if (accounts.length === 0) {
    console.log('No account found');
    return null;
  }

  return accounts[0];
}

export async function makeBet() {
  return new Promise((resolve, reject) => {
    try {
      const { ethereum } = window;
      if (!ethereum) reject("window.ethereum not found")
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const address = contractJSON.networks[window.ethereum.newtworkVersion];
      const contract = new ethers.Contract(address, contractJSON.abi, signer);
      
      resolve({signer, contract});
    }
    catch (err) {
      reject(err);
    }
  })

}