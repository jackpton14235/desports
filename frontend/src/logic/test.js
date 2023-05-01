const Web3 = require('web3');

export function testWeb3() {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  const store = web3.eth.getStorageAt("0x5d23FC1584602eDE4261cF4e27e9D5dD581281C8", 0);
  console.log(store)
}