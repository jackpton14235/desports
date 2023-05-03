var Betting = artifacts.require("Betting")


module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Betting, '0x5d23FC1584602eDE4261cF4e27e9D5dD581281C8', '0x5d23FC1584602eDE4261cF4e27e9D5dD581281C8');
};
