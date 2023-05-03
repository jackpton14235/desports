const Web3 = require("web3");

export function testWeb3() {
  const web3 = new Web3("ws://localhost:8545");
  const contractAddress = '0xD7F072649d95EeE21460373B75679691f389456c'
  web3.eth
    .getStorageAt(
      "0xD7F072649d95EeE21460373B75679691f389456c",
      getKey(1, "5d23FC1584602eDE4261cF4e27e9D5dD581281C8")
    )
    .then(console.log);
}

function getKey(index, key) {
  const ind = index.toString(16).padStart(64, "0");
  const keyPad = key.padStart(64, "0");
  console.log(ind)
  console.log(keyPad)
  const newKey = Web3.utils.sha3(keyPad + ind, { "encoding": "hex" });
  console.log(newKey);
  return newKey;
}
