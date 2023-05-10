import { BigNumber, ethers } from 'ethers';
import Web3 from 'web3';

import betsJSON from "./Betting.json";
import stanbuckJSON from './stanbuck-abi.json';

const stanbuckAddress = '0x275AF1b983c5C11F3949bab71663FB03233931FE';
const betsAddress = '0xae9759cac9521bbdafbe5024b8e70b864c61f320';

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

export function placeBet(amount, gameID, home) {
  return new Promise(async (resolve, reject) => {
    try {
      const { ethereum } = window;
      if (!ethereum) reject("window.ethereum not found")
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(betsAddress, betsJSON.abi, signer);
      const txn = await contract.placeBet(gameID.toString(), home, {value: amount});
      await txn.wait();
      console.log("resolving");
      resolve({signer, contract});
    }
    catch (err) {
      reject(err);
    }
  })

}

export function getBets(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { ethereum } = window;
      if (!ethereum) reject("window.ethereum not found")
      console.log("Getting")
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(betsAddress, betsJSON.abi, signer);
      const txn = await contract.getBets(id.toString());
      resolve({home: txn[0], away: txn[1]});
    }
    catch (err) {
      reject(err);
    }
  })
}