// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Betting {
        address public oracle;
        
        mapping(string => mapping(bool => uint256)) public bet_totals;
        // True in the case the home team wins, false in case of away
        mapping(string => bool) private results; 
        // True in case that the game has been finished, false otherwise
        mapping(string => bool) private game_finished;
        mapping(address => mapping(string => Bet)) public bets_by_bettor;
        

        // constructor
        constructor (address tokenAddress, address _oracle) {
                oracle = _oracle;
        }

        struct Bet {
                // represents address of person making bet
                address bettor;
                // represents the amount staked
                uint256 staked;
                // represents the game that is being bet on
                string gameID;
                // True if the bettor bet on the home team, false otherwise
                bool home;
        }

        function getBets (string memory gameID) public view returns (uint256, uint256) {
                require(game_finished[gameID] == false, "The game is over or doesn't exist");
                return (bet_totals[gameID][true], bet_totals[gameID][false]);
        }

        function placeBet (string memory gameID, bool home) external payable{
                // confirm that the game hasn't happened already
                require(game_finished[gameID] == false, "The game is over");
                // flaw: this only allows the user to bet one side of the game
                bets_by_bettor[msg.sender][gameID] = 
                        Bet(msg.sender, msg.value, gameID, home);
                bet_totals[gameID][home] += msg.value;
        }

        function withdrawGain (string memory gameID) external {
                // confirm that the game has already happened
                require(game_finished[gameID] == true, "The game hasn't happened yet");
                
                bool winner = results[gameID];
                Bet memory bet = bets_by_bettor[msg.sender][gameID];
                // amount that the bettor wins
                uint256 win_amount = 0;
                if (bet.home == winner){
                        win_amount = bet.staked + bet_totals[gameID][!winner] * bet.staked / bet_totals[gameID][winner];
                }
                else {
                        win_amount = 0;
                }
                payable(msg.sender).transfer(win_amount);
        }

        function reportResult(string memory gameID, bool home) external {
                require(oracle == msg.sender, "Only the Oracle can call this function");
                game_finished[gameID] = true;
                results[gameID] = home;
        }
}