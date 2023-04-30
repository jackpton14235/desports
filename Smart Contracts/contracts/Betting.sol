// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Betting {
        SportsBux private _token;
        address public oracle;
        
        mapping(string => uint256) public bet_totals;
        mapping(address => bet) public bets_by_bettor;

        // constructor
        constructor (address tokenAddress, address _oracle) {
                _token = SportsBux(tokenAddress);
                oracle = _oracle;
        }

        struct bet {
                // represents address of person making bet
                address bettor;
                // represents the payout if the bet is successful
                uint256 payout;
                // represents the game that is being bet on
                string gameID;
                // True if the bettor bet on the home team, false otherwise
                bool home;
        }

        function _placeBet (string gameID, bool home, address bettor, uint256 stake) public view returns (bool){
                // burns the amount of currency that was bet on the proposition
                uint256 allowance = allowance(bettor, msg.sender);
                require(allowance >= stake, "Not enough allowance");
                _approve(bettor, msg.sender, allowance - stake);
                _burn(bettor, amount);
        }
}