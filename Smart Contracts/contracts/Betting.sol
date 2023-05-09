// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Betting is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    address public oracle;
    
    mapping(uint256 => mapping(bool => uint256)) public bet_totals;
    // True in the case the home team wins, false in case of away
    // I don't think we need this anymore but I'm scared to delete it -ER
    mapping(uint256 => bool) private results; 
    // True in case that the game has been finished, false otherwise
    mapping(uint256 => bool) private game_finished;
    mapping(address => Bet[]) public bets_by_bettor;
    
    // maps a game id to an array of bettors that bet on the game
    mapping(uint256 => address[]) public bettors_by_game;

    uint256 public volume;
    bytes32 private jobId;
    uint256 private fee;
    
    // constructor
    constructor (address _oracle) ConfirmedOwner(msg.sender) {
        oracle = _oracle;
        setChainlinkToken("");
        setChainlinkOracle("");
        jobId = "";
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }

    struct Bet {
        // represents address of person making bet
        address bettor;
        // represents the amount staked
        uint256 staked;
        // represents the game that is being bet on
        uint256 gameID;
        // True if the bettor bet on the home team, false otherwise
        bool home;
        // initialization check
        bool initialized;
    }

    function getBets (uint256 gameID) public view returns (uint256, uint256) {
        require(game_finished[gameID] == false, "The game is over or doesn't exist");
        return (bet_totals[gameID][true], bet_totals[gameID][false]);
    }

    function placeBet (uint256 gameID, bool home) external payable{
        // confirm that the game hasn't happened already
        require(game_finished[gameID] == false, "The game is over");
        // flaw: this only allows the user to bet one side of the game
        bets_by_bettor[msg.sender].push(Bet(msg.sender, msg.value, gameID, home, true));
        bet_totals[gameID][home] += msg.value;
        bettors_by_game[gameID].push(msg.sender);
    }

    // calls chailink oracle to get game status from our external adapter
    function checkGameStatus (uint256 gameID) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        req.add(
            "get",
            "https://desports-external-adapter.onrender.com"
        );

        req.add(
            "id",
            Strings.toString(gameID)
        );

        return sendChainlinkRequest(req, fee);
    }

    // called by oracle to give the information about game winner
    // info is the gameid if home won, -gameid if away won, 0 if game hasn't happened
    function fulfill(bytes32 _requestId, int256 info) 
    public recordChainlinkFulfillment(_requestId) {
        if (info == 0) {
            return;
        } else if (info < 0) {
            // away won
            uint256 gameID = uint256(info * -1);
            game_finished[gameID] = true;
            results[gameID] = false;
            withdrawGain(gameID, false);

        } else {
            // home won
            uint256 gameID = uint256(info);
            game_finished[gameID] = true;
            results[gameID] = true;
                withdrawGain(gameID, true);
        }

    }

    function withdrawGain (uint256 gameID, bool winner) internal {
        Bet memory bet;
        for (uint j = 0; j < bettors_by_game[gameID].length; j++){
                address bettor = bettors_by_game[gameID][j];
                for (uint i = 0; i < bets_by_bettor[bettor].length; i++){
                        if (bets_by_bettor[bettor][i].gameID == gameID)
                        {
                                bet = bets_by_bettor[bettor][i];
                        }
                }
                // require(!bet.initialized, "There is no bet on the game");
                // amount that the bettor wins
                uint256 win_amount = 0;
                if (bet.home == winner){
                        win_amount = bet.staked + bet_totals[gameID][!winner] 
                                * bet.staked / bet_totals[gameID][winner];
                }
                else {
                        win_amount = 0;
                }
                payable(bettor).transfer(win_amount);
        }
        
    }

    function reportResult(uint256 gameID, bool home) external {
        require(oracle == msg.sender, "Only the Oracle can call this function");
        game_finished[gameID] = true;
        results[gameID] = home;
    }
}