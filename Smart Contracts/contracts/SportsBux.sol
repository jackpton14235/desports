// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contract/access/Ownable.sol";

contract SportsBux is ERC20, ERC20Burnable, Ownable {
        constructor () ERC20("SportsBux", "SPBX") {
                _mint(msg.sender, 100);
        }
}