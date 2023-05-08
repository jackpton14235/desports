// const web3 = require("web3");
import web3 from 'web3';

export function testWeb3() {
  const test = web3.utils.toWei('.01', 'ether');
  console.log(test)
  console.log(typeof(test));
  console.log(web3.utils.fromWei(test, 'ether'))
}

function getKey(index, key) {
  const ind = index.toString(16).padStart(64, "0");
  const keyPad = key.padStart(64, "0");
  console.log(ind)
  console.log(keyPad)
  const newKey = web3.utils.sha3(keyPad + ind, { "encoding": "hex" });
  console.log(newKey);
  return newKey;
}
